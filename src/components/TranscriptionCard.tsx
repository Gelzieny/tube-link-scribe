import { Link } from 'react-router-dom';
import { Youtube, Clock, Calendar, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Transcription } from '@/hooks/useTranscriptions';

interface TranscriptionCardProps {
  transcription: Transcription;
}

export function TranscriptionCard({ transcription }: TranscriptionCardProps) {
  const getStatusBadge = () => {
    switch (transcription.status) {
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs">
            <Clock className="w-3 h-3 animate-spin" />
            Processando
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs">
            Concluído
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full bg-destructive/10 text-destructive text-xs">
            Erro
          </span>
        );
    }
  };

  const extractVideoId = (url: string): string => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/shorts\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    
    return '';
  };

  const videoId = extractVideoId(transcription.video_url);
  const thumbnailUrl = videoId 
    ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    : null;

  return (
    <Link
      to={`/transcription/${transcription.id}`}
      className="glass-card p-4 flex items-center gap-4 hover:border-primary/50 transition-colors group"
    >
      {/* Thumbnail */}
      <div className="w-24 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={transcription.video_title || 'Video thumbnail'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-red-500/10">
            <Youtube className="w-8 h-8 text-red-500" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-foreground font-medium truncate">
          {transcription.video_title || 'Vídeo do YouTube'}
        </h3>
        <div className="flex items-center gap-3 mt-1">
          {getStatusBadge()}
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {format(new Date(transcription.created_at), "d 'de' MMM, yyyy", { locale: ptBR })}
          </span>
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
    </Link>
  );
}
