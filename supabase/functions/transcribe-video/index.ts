import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { GoogleGenAI } from "https://esm.sh/@google/genai@0.14.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !authData.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { transcriptionId, videoUrl } = await req.json();

    if (!transcriptionId || !videoUrl) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Processing transcription ${transcriptionId} for video: ${videoUrl}`);

    // Extract video ID from URL
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    // Initialize Google Gemini
    const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY');
    if (!GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY not configured');
    }

    const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });

    // Fetch video title from YouTube oEmbed API
    let videoTitle = `Vídeo YouTube: ${videoId}`;
    try {
      const oembedResponse = await fetch(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`
      );
      if (oembedResponse.ok) {
        const oembedData = await oembedResponse.json();
        videoTitle = oembedData.title || videoTitle;
      }
    } catch (e) {
      console.log('Could not fetch video title:', e);
    }

    console.log(`Video title: ${videoTitle}`);
    console.log(`Processing video with Gemini...`);

    // Use Gemini to transcribe the video directly from YouTube URL
    // NOTE: Model names change over time; avoid hard-coding preview-only names.
    const MODEL_CANDIDATES = [
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-flash-latest',
    ];

    let transcriptionText: string;

    try {
      transcriptionText = await generateTranscriptionWithFallback({
        ai,
        videoUrl,
        modelCandidates: MODEL_CANDIDATES,
      });
      console.log('Transcription completed successfully');
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError);
      
      // Update status to failed
      const adminClient = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );
      
      await adminClient
        .from('transcriptions')
        .update({ 
          status: 'failed',
          transcription_text: `Erro ao processar transcrição: ${geminiError instanceof Error ? geminiError.message : 'Erro desconhecido'}`
        })
        .eq('id', transcriptionId);

      return new Response(JSON.stringify({ error: 'Gemini processing failed', details: geminiError instanceof Error ? geminiError.message : 'Unknown error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Transcription completed, updating database...');

    // Update transcription with result using service role
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
    
    const { error: updateError } = await adminClient
      .from('transcriptions')
      .update({
        video_title: videoTitle,
        transcription_text: transcriptionText,
        status: 'completed'
      })
      .eq('id', transcriptionId);

    if (updateError) {
      console.error('Update error:', updateError);
      throw updateError;
    }

    console.log('Transcription saved successfully');

    return new Response(JSON.stringify({ success: true, transcriptionId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing transcription:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function generateTranscriptionWithFallback(params: {
  ai: GoogleGenAI;
  videoUrl: string;
  modelCandidates: string[];
}): Promise<string> {
  const { ai, videoUrl, modelCandidates } = params;

  let lastError: unknown = null;

  for (const model of modelCandidates) {
    console.log(`Trying Gemini model: ${model}`);

    try {
      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            parts: [
              {
                fileData: {
                  fileUri: videoUrl,
                  mimeType: 'video/*',
                },
              },
              {
                text:
                  'Transcreva o vídeo completo. Forneça apenas o texto transcrito, sem comentários adicionais.',
              },
            ],
          },
        ],
      });

      const text = response.text?.trim();
      if (text) return text;
      return 'Transcrição não disponível';
    } catch (err) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);

      // If the model doesn't exist / isn't supported, try the next one.
      if (
        msg.includes('404') ||
        msg.includes('NOT_FOUND') ||
        msg.includes('is not found') ||
        msg.includes('not supported for generateContent')
      ) {
        console.log(`Model not available (${model}). Trying next...`);
        continue;
      }

      // Any other error (auth/quota/input) should bubble up.
      throw err;
    }
  }

  const lastMsg = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(
    `Nenhum modelo Gemini suportado disponível. Último erro: ${lastMsg}`
  );
}

function extractVideoId(url: string): string {
  if (!url) return '';
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return '';
}
