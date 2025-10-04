const API_BASE_URL = '/api';

export interface ChatRequest {
  message: string;
  paperTitle: string;
  paperSummary: string;
}

export interface ChatResponse {
  response: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export const sendChatMessage = async (request: ChatRequest): Promise<ChatResponse> => {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};