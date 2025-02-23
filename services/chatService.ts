import { ChatHistory, ChatItem, ChatMessage, ChatResponse, Conversation, Message, SaveChatParams, ThreadHistoryResponse } from "@/types/chat";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://sca-api-535434239234.us-central1.run.app';

class ChatService {
    private readonly API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sca-api-535434239234.us-central1.run.app';

    private async saveConversationsToLocal(conversations: Conversation[]) {
        try {
            await AsyncStorage.setItem('conversations', JSON.stringify(conversations));
        } catch (error) {
            console.error('Error saving conversations:', error);
        }
    }

    private async getLocalConversations(): Promise<Conversation[]> {
        try {
            const savedConversations = await AsyncStorage.getItem('conversations');
            return savedConversations ? JSON.parse(savedConversations) : [];
        } catch (error) {
            console.error('Error getting local conversations:', error);
            return [];
        }
    }

    async getConversations(): Promise<Conversation[]> {
        try {
            const response = await axios.get<Conversation[]>(
                `${this.API_URL}/conversations`,
                {
                    headers: {
                        'accept': 'application/json'
                    }
                }
            );
            
            // Guardar conversaciones localmente
            await this.saveConversationsToLocal(response.data);
            
            return response.data;
        } catch (error) {
            console.error('Error fetching conversations:', error);
            // Intentar obtener conversaciones locales si falla la API
            return this.getLocalConversations();
        }
    }
    
    async getConversation(id: string): Promise<Conversation> {
        const response = await axios.get(`${this.API_URL}/conversations/${id}`);
        return response.data;
    }
    
    async getConversationMessages(conversationId: string): Promise<Message[]> {
        try {
            const response = await axios.get<Message[]>(
                `${this.API_URL}/conversations/${conversationId}/messages`,
                {
                    headers: {
                        'accept': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching conversation messages:', error);
            return [];
        }
    }

    // Get all chat history
    async getChatHistory(): Promise<ChatHistory> {
        try {
            const storedHistory = await AsyncStorage.getItem('chatHistory');
            return storedHistory ? JSON.parse(storedHistory) : [];
        } catch (error) {
            console.error('Error loading chat history:', error);
            return [];
        }
    }

    // Get chat history by date range
    async getChatHistoryByDateRange(startDate: Date, endDate: Date): Promise<ChatHistory> {
        try {
            const storedHistory = await AsyncStorage.getItem('chatHistory');
            const history: ChatHistory = storedHistory ? JSON.parse(storedHistory) : [];
            
            return history.filter(section => {
                const sectionDate = new Date(section.items[0]?.timestamp);
                return sectionDate >= startDate && sectionDate <= endDate;
            });
        } catch (error) {
            console.error('Error getting chat history by date range:', error);
            return [];
        }
    }

    // Get chat by ID
    async getChatById(chatId: string): Promise<ChatItem | null> {
        try {
            const storedHistory = await AsyncStorage.getItem('chatHistory');
            const history: ChatHistory = storedHistory ? JSON.parse(storedHistory) : [];
            
            const chat = history
                .flatMap(section => section.items)
                .find(item => item.id === chatId);

            return chat || null;
        } catch (error) {
            console.error('Error getting chat by ID:', error);
            return null;
        }
    }

    // Send a message to the chat API
    async sendMessage(message: string): Promise<ChatResponse> {
        if (!message || typeof message !== 'string') {
            throw new Error('Invalid message format');
        }

        try {
            // Obtener el thread_id actual si existe
            const currentThreadId = await AsyncStorage.getItem('currentThreadId');
            
            const response = await axios.post<ChatResponse>(
                `${this.API_URL}/agents/chat`,
                {
                    message: message.trim(),
                    thread_id: currentThreadId || '' // Enviar thread_id si existe
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (response.status === 200 && response.data) {
                // Si recibimos un nuevo thread_id, actualizar conversaciones locales
                if (response.data.thread_id) {
                    const newConversation: Conversation = {
                        id: response.data.thread_id,
                        title: message.slice(0, 30) + '...',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        type: 'chat',
                        status: 'active',
                        facility_ccn: null
                    };

                    const currentConversations = await this.getLocalConversations();
                    await this.saveConversationsToLocal([newConversation, ...currentConversations]);
                    
                    await AsyncStorage.setItem('currentThreadId', response.data.thread_id);
                }
                return response.data;
            }

            throw new Error('Error en la respuesta del servidor');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('API Error:', {
                    status: error.response?.status,
                    data: error.response?.data
                });
            }
            throw error;
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
            // Return empty array as fallback
            return [];
        }
    }

    async saveChatToHistory(chat: SaveChatParams) {
        try {
            // Ensure chat has the type property
            const newChatItem: ChatItem = {
                id: chat.id,
                text: chat.text,
                thread_id: chat.thread_id,
                timestamp: chat.timestamp,
                type: chat.type // Ensure this is set correctly
            };

            // Obtener el historial existente del localStorage
            const storedHistory = await AsyncStorage.getItem('chatHistory');
            let currentHistory: ChatHistory = storedHistory ? JSON.parse(storedHistory) : [];

            // Organizar por fecha
            const today = new Date();
            const chatDate = new Date(chat.timestamp);
            
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

            // Encontrar o crear sección
            let section = currentHistory.find(s => s.title === sectionTitle);
            if (!section) {
                section = {
                    title: sectionTitle,
                    items: []
                };
                currentHistory.unshift(section);
            }

            // Agregar nuevo chat al inicio de la sección
            section.items.unshift(newChatItem);

            // Guardar en localStorage
            await AsyncStorage.setItem('chatHistory', JSON.stringify(currentHistory));

            return currentHistory;
        } catch (error) {
            console.error('Error saving chat to history:', error);
            throw new Error('Failed to save chat to history');
        }
    }

    // Método para guardar el historial del chat
    async saveChatHistory(chatHistory: ChatHistory) {
        try {
            await AsyncStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        } catch (error) {
            console.error('Error saving chat history:', error);
        }
    }

    // Método para cargar el historial del chat
    async loadChatHistory(): Promise<ChatHistory> {
        try {
            const storedHistory = await AsyncStorage.getItem('chatHistory');
            return storedHistory ? JSON.parse(storedHistory) : [];
        } catch (error) {
            console.error('Error loading chat history:', error);
            return [];
        }
    }

    async clearChatHistory() {
        try {
            await AsyncStorage.removeItem('chatHistory');
            return [];
        } catch (error) {
            console.error('Error clearing chat history:', error);
            throw error;
        }
    }

    async updateChatHistory(newMessage: ChatMessage) {
        try {
            const currentHistory = await this.loadChatHistory();
            const today = 'Today';

            // Check for duplicates in history
            const isDuplicate = currentHistory.some(section => 
                section.items.some(item => 
                    item.thread_id === newMessage.thread_id || 
                    item.id === newMessage.id
                )
            );

            if (!isDuplicate) {
                let updatedHistory = [...currentHistory];
                let todaySection = updatedHistory.find(section => section.title === today);

                if (todaySection) {
                    todaySection.items.unshift({
                        id: newMessage.id,
                        text: newMessage.text,
                        thread_id: newMessage.thread_id,
                        timestamp: newMessage.timestamp,
                        type: newMessage.type
                    });
                } else {
                    updatedHistory.unshift({
                        title: today,
                        items: [{
                            id: newMessage.id,
                            text: newMessage.text,
                            thread_id: newMessage.thread_id,
                            timestamp: newMessage.timestamp,
                            type: newMessage.type
                        }]
                    });
                }

                await this.saveChatHistory(updatedHistory);
                return updatedHistory;
            }
            return currentHistory;
        } catch (error) {
            console.error('Error updating chat history:', error);
            throw error;
        }
    }

    async getCurrentThreadId(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem('currentThreadId');
        } catch (error) {
            console.error('Error getting current thread ID:', error);
            return null;
        }
    }
}

// Export a singleton instance
export default new ChatService();