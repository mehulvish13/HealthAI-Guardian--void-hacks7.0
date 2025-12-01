export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface KnowledgeItem {
  term: string;
  definition: string;
  details?: {
    causes?: string[];
    symptoms?: string[];
    precautions?: string[];
    whenToSeeDoctor?: string;
  };
}

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  audioUrl?: string;
  isError?: boolean;
  relatedTerms?: KnowledgeItem[];
  isEmergency?: boolean;
}

export enum LoadingState {
  IDLE = 'idle',
  THINKING = 'thinking',
  SPEAKING = 'speaking',
  GENERATING = 'generating' // For reports/plans
}

export interface HistoryItem {
  role: Role;
  parts: { text: string }[];
}

export interface Language {
  code: string;
  name: string;
  voiceLang: string; // For TTS matching if needed
}
