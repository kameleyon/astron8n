export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: Date;
  sessionId?: string;
  isFavorite?: boolean;
}

export interface OpenRouterPayload {
  model: string;
  messages: { role: string; content: string }[];
  temperature?: number;
  max_tokens?: number;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface ChatSession {
  id: string;
  firstMessage: string;
  messageCount: number;
  createdAt: Date;
  isFavorite: boolean;
}