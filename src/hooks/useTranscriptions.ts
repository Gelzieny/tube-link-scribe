import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface Transcription {
  id: string;
  user_id: string;
  video_url: string;
  video_title: string | null;
  transcription_text: string | null;
  status: 'processing' | 'completed' | 'failed';
  created_at: string;
}

export function useTranscriptions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['transcriptions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('transcriptions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Transcription[];
    },
    enabled: !!user,
  });
}

export function useTranscription(id: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['transcription', id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('transcriptions')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Transcription;
    },
    enabled: !!user && !!id,
  });
}

export function useCreateTranscription() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (videoUrl: string) => {
      if (!user) throw new Error('User not authenticated');

      // Create transcription record
      const { data: transcription, error: insertError } = await supabase
        .from('transcriptions')
        .insert({
          user_id: user.id,
          video_url: videoUrl,
          status: 'processing',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Call edge function to process transcription
      const { error: functionError } = await supabase.functions.invoke('transcribe-video', {
        body: { transcriptionId: transcription.id, videoUrl }
      });

      if (functionError) {
        // Update status to failed
        await supabase
          .from('transcriptions')
          .update({ status: 'failed' })
          .eq('id', transcription.id);
        throw functionError;
      }

      return transcription;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transcriptions'] });
    },
    onError: (error) => {
      toast.error('Erro ao criar transcrição: ' + error.message);
    },
  });
}

export function useUpdateTranscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, transcription_text }: { id: string; transcription_text: string }) => {
      const { data, error } = await supabase
        .from('transcriptions')
        .update({ transcription_text })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['transcriptions'] });
      queryClient.invalidateQueries({ queryKey: ['transcription', data.id] });
      toast.success('Transcrição atualizada!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar: ' + error.message);
    },
  });
}

export function useDeleteTranscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('transcriptions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transcriptions'] });
      toast.success('Transcrição excluída!');
    },
    onError: (error) => {
      toast.error('Erro ao excluir: ' + error.message);
    },
  });
}
