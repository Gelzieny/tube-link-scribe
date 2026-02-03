export interface Transcription {
  id: string;
  videoId: string;
  videoTitle: string;
  videoThumbnail: string;
  channelName: string;
  transcriptionText: string;
  createdAt: Date;
  duration: string;
  status: 'completed' | 'processing' | 'failed';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: Date;
  transcriptionCount: number;
}

export interface TranscriptionFormData {
  youtubeUrl: string;
}
