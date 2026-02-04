import { motion } from 'framer-motion';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Copy, 
  Download, 
  ExternalLink, 
  Youtube, 
  Clock, 
  Calendar,
  Edit2,
  Save,
  X,
  Trash2,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  useTranscription, 
  useUpdateTranscription, 
  useDeleteTranscription 
} from '@/hooks/useTranscriptions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const TranscriptionView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: transcription, isLoading, refetch } = useTranscription(id || '');
  const updateTranscription = useUpdateTranscription();
  const deleteTranscription = useDeleteTranscription();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');

  const handleCopy = async () => {
    if (transcription?.transcription_text) {
      await navigator.clipboard.writeText(transcription.transcription_text);
      toast.success('Transcrição copiada!');
    }
  };

  const handleDownload = () => {
    if (transcription?.transcription_text) {
      const blob = new Blob([transcription.transcription_text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transcricao-${transcription.video_title || 'video'}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Download iniciado!');
    }
  };

  const startEditing = () => {
    setEditText(transcription?.transcription_text || '');
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditText('');
  };

  const saveEdit = async () => {
    if (id && editText.trim()) {
      await updateTranscription.mutateAsync({ id, transcription_text: editText.trim() });
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (id) {
      await deleteTranscription.mutateAsync(id);
      navigate('/transcriptions');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!transcription) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-2xl font-semibold text-foreground mb-4">
            Transcrição não encontrada
          </h1>
          <Button onClick={() => navigate('/transcriptions')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Transcrições
          </Button>
        </div>
      </Layout>
    );
  }

  const getStatusBadge = () => {
    switch (transcription.status) {
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-sm">
            <Clock className="w-4 h-4 animate-spin" />
            Processando
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm">
            Concluído
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm">
            Erro
          </span>
        );
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/transcriptions')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <Youtube className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-foreground">
                    {transcription.video_title || 'Transcrição'}
                  </h1>
                  <div className="flex items-center gap-3 mt-1">
                    {getStatusBadge()}
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(transcription.created_at), "d 'de' MMMM, yyyy", { locale: ptBR })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {transcription.status === 'processing' && (
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Atualizar
                </Button>
              )}
              <a
                href={transcription.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border text-foreground hover:bg-accent transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Abrir Vídeo
              </a>
            </div>
          </div>
        </motion.div>

        {/* Transcription Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-foreground">Transcrição</h2>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <>
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" onClick={startEditing}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={saveEdit}
                    disabled={updateTranscription.isPending}
                  >
                    {updateTranscription.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Salvar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={cancelEditing}>
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </>
              )}
            </div>
          </div>

          {transcription.status === 'processing' ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">
                Processando transcrição... Isso pode levar alguns minutos.
              </p>
            </div>
          ) : isEditing ? (
            <Textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="min-h-[400px] bg-card border-border resize-none"
              autoFocus
            />
          ) : (
            <div className="prose prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-foreground font-sans text-base leading-relaxed bg-transparent p-0 m-0">
                {transcription.transcription_text || 'Transcrição não disponível.'}
              </pre>
            </div>
          )}
        </motion.div>

        {/* Delete Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir Transcrição
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir transcrição?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. A transcrição será permanentemente removida.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleteTranscription.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Excluir'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>
      </div>
    </Layout>
  );
};

export default TranscriptionView;
