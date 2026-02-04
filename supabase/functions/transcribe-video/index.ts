import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

    // Extract video title from URL (basic extraction)
    const videoId = extractVideoId(videoUrl);
    const videoTitle = `Vídeo YouTube: ${videoId}`;

    // Call Lovable AI Gateway for transcription
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente especializado em transcrever vídeos do YouTube. Quando receber uma URL de vídeo, analise o conteúdo e forneça uma transcrição detalhada em português. Se não conseguir acessar o vídeo diretamente, explique isso e ofereça orientações sobre como obter a transcrição.'
          },
          {
            role: 'user',
            content: `Por favor, transcreva o seguinte vídeo do YouTube: ${videoUrl}\n\nForneça a transcrição completa do áudio do vídeo em português.`
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      
      // Update status to failed
      const adminClient = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      );
      
      await adminClient
        .from('transcriptions')
        .update({ 
          status: 'failed',
          transcription_text: 'Erro ao processar transcrição. Tente novamente mais tarde.'
        })
        .eq('id', transcriptionId);

      return new Response(JSON.stringify({ error: 'AI processing failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const aiData = await aiResponse.json();
    const transcriptionText = aiData.choices?.[0]?.message?.content || 'Transcrição não disponível';

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

function extractVideoId(url: string): string {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return 'unknown';
}
