// src/chatbot/types.ts

export interface ChatRequest {
  userId: string;
  message: string;
}

export interface ChatResponse {
  message: string;
}
