import { motion } from 'framer-motion';
import { Calendar, Clock, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Transcription } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TranscriptionCardProps {
  transcription: Transcription;
}

export function TranscriptionCard({ transcription }: TranscriptionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        to={`/transcription/${transcription.id}`}
        className="block glass-card p-4 hover:border-primary/30 transition-all duration-300 group"
      >
        <div className="flex gap-4">
          {/* Thumbnail */}
          <div className="relative flex-shrink-0 w-32 h-20 rounded-lg overflow-hidden bg-muted">
            <img
              src={transcription.videoThumbnail}
              alt={transcription.videoTitle}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-background/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Play className="w-8 h-8 text-foreground" fill="currentColor" />
            </div>
            <div className="absolute bottom-1 right-1 bg-background/80 text-foreground text-xs px-1.5 py-0.5 rounded">
              {transcription.duration}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {transcription.videoTitle}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {transcription.channelName}
            </p>
            <p className="text-sm text-muted-foreground/70 mt-2 line-clamp-2">
              {transcription.transcriptionText}
            </p>
            
            {/* Meta */}
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {format(transcription.createdAt, "d 'de' MMM, yyyy", { locale: ptBR })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {transcription.duration}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
