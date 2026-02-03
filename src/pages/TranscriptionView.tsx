import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Copy, Download, ExternalLink, Youtube } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { mockTranscriptions } from '@/data/mockData';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

const TranscriptionView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const transcription = mockTranscriptions.find((t) => t.id === id);

  if (!transcription) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Transcrição não encontrada
          </h2>
          <p className="text-muted-foreground mb-6">
            A transcrição que você está procurando não existe
          </p>
          <Button onClick={() => navigate('/')} variant="outline">
            Voltar ao Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(transcription.transcriptionText);
    toast.success('Texto copiado para a área de transferência!');
  };

  const handleDownload = () => {
    const blob = new Blob([transcription.transcriptionText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${transcription.videoTitle}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Download iniciado!');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </Link>
        </motion.div>

        {/* Video Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Thumbnail */}
            <div className="relative w-full md:w-64 flex-shrink-0">
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={transcription.videoThumbnail}
                  alt={transcription.videoTitle}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-2 right-2 bg-background/80 text-foreground text-xs px-2 py-1 rounded">
                {transcription.duration}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <Youtube className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-semibold text-foreground line-clamp-2">
                    {transcription.videoTitle}
                  </h1>
                  <p className="text-muted-foreground">
                    {transcription.channelName}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {format(transcription.createdAt, "d 'de' MMMM, yyyy", { locale: ptBR })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {transcription.duration}
                </span>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="border-border text-foreground hover:bg-muted"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar Texto
                </Button>
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="border-border text-foreground hover:bg-muted"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar TXT
                </Button>
                <a
                  href={`https://youtube.com/watch?v=${transcription.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ver no YouTube
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Transcription Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Transcrição
          </h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {transcription.transcriptionText}
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default TranscriptionView;
