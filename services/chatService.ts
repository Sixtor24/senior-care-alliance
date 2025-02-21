import { ChatHistory, ChatItem } from "@/types/chat";
import axios from 'axios';

// Mock data - will be replaced with actual API calls later
const mockChatHistory: ChatHistory = [
    {
        title: "Yesterday",
        items: [
            { id: 'chat1', text: 'Chat History 1' },
            { id: 'chat2', text: 'Chat History 2' },
            { id: 'chat3', text: 'Chat History 3' },
        ]
    },
    {
        title: "30 days before",
        items: [
            { id: 'chat4', text: 'Chat History 1' },
            { id: 'chat5', text: 'Chat History 2' },
            { id: 'chat6', text: 'Chat History 3' },
        ]
    },
    {
        title: "january",
        items: [
            { id: 'chat7', text: 'Chat History 1' },
            { id: 'chat8', text: 'Chat History 2' },
            { id: 'chat9', text: 'Chat History 3' },
        ]
    }
];

const API_BASE_URL = 'https://sca-api-535434239234.us-central1.run.app';

interface ChatRequest {
    message: string;
    thread_id: string;
}

interface ChatResponse {
    response: string;
    thread_id: string;
    bigquery_data: Record<string, any>[];
    message?: string;
}

interface ThreadHistoryResponse {
    messages: {
        id: string;
        text: string;
        type: 'user' | 'assistant';
        timestamp: string;
    }[];
    thread_id: string;
}

interface ChatMessage {
    message: string;
    context?: string;
    metadata?: {
        facilityId?: string;
        userId?: string;
    };
}

class ChatService {
    private readonly API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sca-api-535434239234.us-central1.run.app';

    // Get all chat history
    async getChatHistory(): Promise<ChatHistory> {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockChatHistory;
    }

    // Get chat history by date range
    async getChatHistoryByDateRange(startDate: Date, endDate: Date): Promise<ChatHistory> {
        // This will be implemented with real API
        await new Promise(resolve => setTimeout(resolve, 1000));
        return mockChatHistory;
    }

    // Get chat by ID
    async getChatById(chatId: string): Promise<ChatItem | null> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const chat = mockChatHistory
            .flatMap(section => section.items)
            .find(item => item.id === chatId);
        return chat || null;
    }

    // Send a message to the chat API
    async sendMessage(message: string): Promise<ChatResponse> {
        if (!message || typeof message !== 'string') {
            throw new Error('Invalid message format: Message must be a non-empty string');
        }

        try {
            console.log('API URL:', this.API_URL); // Debug log
            
            const payload: ChatMessage = {
                message: message.trim(),
                context: 'facility',
                metadata: {
                    facilityId: '1',
                    userId: '1',
                }
            };

            console.log('Sending request to:', `${this.API_URL}/agents/chat`);
            console.log('Request payload:', JSON.stringify(payload, null, 2));

            const response = await axios.post<ChatResponse>(
                `${this.API_URL}/agents/chat`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        // Add any auth token if required
                        // 'Authorization': `Bearer ${token}`
                    },
                    timeout: 30000,
                    validateStatus: (status) => status < 500, // Handle all non-500 responses
                }
            );

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            console.log('Response data:', response.data);

            if (response.status === 200) {
                return response.data;
            }

            // Handle non-200 responses
            switch (response.status) {
                case 400:
                    throw new Error('Bad request: ' + (response.data.message || 'Please check your input'));
                case 401:
                    throw new Error('Authentication required. Please log in.');
                case 403:
                    throw new Error('You do not have permission to use this feature.');
                case 422:
                    throw new Error('Invalid input: ' + (response.data.message || 'Please check your message'));
                case 429:
                    throw new Error('Too many requests. Please wait a moment.');
                default:
                    throw new Error(`Request failed with status ${response.status}`);
            }

        } catch (error) {
            console.error('Full error object:', error);

            if (axios.isAxiosError(error)) {
                console.error('Axios error details:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    headers: error.response?.headers,
                    config: {
                        url: error.config?.url,
                        method: error.config?.method,
                        headers: error.config?.headers,
                    }
                });

                if (error.response) {
                    const errorMessage = error.response.data?.message || error.message;
                    throw new Error(`API Error: ${errorMessage}`);
                } else if (error.request) {
                    throw new Error('Network error: Unable to reach the server. Please check your connection.');
                }
            }

            // If we get here, it's an unexpected error
            throw new Error(`Chat service error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // Get chat history for a specific thread
    async getThreadHistory(threadId: string): Promise<ThreadHistoryResponse> {
        try {
            const response = await axios.get<ThreadHistoryResponse>(`${this.API_URL}/agents/chat/history/${threadId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Thread History API Error:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                });
            }
            throw new Error('Failed to fetch thread history');
        }
    }

    // Get all threads/chats
    async getAllThreads(): Promise<ChatHistory> {
        try {
            const response = await axios.get<ChatHistory>(`${this.API_URL}/agents/chat/threads`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Threads API Error:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                });
            }
            // Return mock data as fallback
            return mockChatHistory;
        }
    }

    async saveChatToHistory(chat: { id: string; text: string; timestamp: Date }): Promise<void> {
        try {
            // Obtener el historial actual
            const currentHistory = await this.getChatHistory();
            
            // Crear nuevo item de chat
            const newChatItem: ChatItem = {
                id: chat.id,
                text: chat.text
            };

            // Determinar la sección correcta basada en la fecha
            const today = new Date();
            const chatDate = chat.timestamp;
            
            let sectionTitle = '';
            if (chatDate.toDateString() === today.toDateString()) {
                sectionTitle = 'Today';
            } else if (chatDate.toDateString() === new Date(today.setDate(today.getDate() - 1)).toDateString()) {
                sectionTitle = 'Yesterday';
            } else if (chatDate.getTime() > today.getTime() - (30 * 24 * 60 * 60 * 1000)) {
                sectionTitle = '30 days before';
            } else {
                sectionTitle = chatDate.toLocaleString('default', { month: 'long' });
            }

            // Encontrar o crear la sección apropiada
            let section = currentHistory.find(s => s.title === sectionTitle);
            if (!section) {
                section = {
                    title: sectionTitle,
                    items: []
                };
                currentHistory.unshift(section);
            }

            // Agregar el nuevo chat al principio de la sección
            section.items.unshift(newChatItem);

            // Aquí podrías hacer una llamada API para persistir los cambios
            // Por ahora, actualizamos el mock data
            Object.assign(mockChatHistory, currentHistory);

            // Si tienes una API real, aquí harías la llamada:
            // await axios.post(`${this.API_URL}/agents/chat/history`, {
            //     threadId: chat.id,
            //     title: chat.text,
            //     timestamp: chat.timestamp
            // });

        } catch (error) {
            console.error('Error saving chat to history:', error);
            throw new Error('Failed to save chat to history');
        }
    }
}

// Export a singleton instance
export default new ChatService();