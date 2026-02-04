import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Youtube, ArrowRight, Loader2, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCreateTranscription } from '@/hooks/useTranscriptions';

const getVideoIdFromUrl = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
};

const NewTranscription = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const createTranscription = useCreateTranscription();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const videoId = getVideoIdFromUrl(url);
    if (!videoId) {
      setError('Por favor, insira uma URL válida do YouTube');
      return;
    }

    try {
      const result = await createTranscription.mutateAsync(url);
      toast.success('Transcrição iniciada com sucesso!', {
        description: 'Você será redirecionado em instantes...',
      });

      setTimeout(() => {
        navigate(`/transcription/${result.id}`);
      }, 1000);
    } catch (err) {
      // Error is handled by the mutation
    }
  };

  const isValidUrl = url && getVideoIdFromUrl(url);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mx-auto mb-6">
            <Youtube className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Nova Transcrição
          </h1>
          <p className="text-muted-foreground">
            Cole o link do vídeo do YouTube para começar
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                URL do Vídeo
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setError('');
                  }}
                  className="pl-12 py-6 bg-card border-border text-foreground placeholder:text-muted-foreground text-lg"
                  disabled={createTranscription.isPending}
                />
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-sm text-destructive"
                >
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </motion.p>
              )}
            </div>

            {/* Preview */}
            {isValidUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <Youtube className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      Vídeo detectado
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      ID: {getVideoIdFromUrl(url)}
                    </p>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                </div>
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={!url || createTranscription.isPending}
              className="w-full py-6 text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {createTranscription.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  Iniciar Transcrição
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12"
        >
          <h3 className="text-sm font-medium text-foreground mb-4">
            Formatos suportados:
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              youtube.com/watch?v=VIDEO_ID
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              youtu.be/VIDEO_ID
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              youtube.com/embed/VIDEO_ID
            </li>
          </ul>
        </motion.div>
      </div>
    </Layout>
  );
};

export default NewTranscription;
