import { useState, useEffect } from 'react';
import chatService from '@/services/chatService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Message {
    id: string;
    text: string;
    type: 'user' | 'assistant';
    timestamp: Date;
    bigQueryData?: Array<{
        facility_name: string;
        address: string;
        risk_score: number;
    }>;
}

export const useChat = (initialThreadId?: string) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [threadId, setThreadId] = useState<string>(initialThreadId ?? '');

    const sendMessage = async (text: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const userMessage: Message = {
                id: Date.now().toString(),
                text,
                type: 'user',
                timestamp: new Date()
            };
            
            // Agregar mensaje del usuario inmediatamente
            setMessages(prev => [...prev, userMessage]);

            const response = await chatService.sendMessage(text);

            // Agregar respuesta del asistente
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: response.response,
                type: 'assistant',
                timestamp: new Date()
            };

            // Actualizar mensajes sin recargar todo el chat
            setMessages(prev => [...prev, assistantMessage]);

            // Actualizar threadId si es necesario
            if (response.thread_id && !threadId) {
                setThreadId(response.thread_id);
            }

            // Guardar en historial sin afectar la conversación actual
            await chatService.saveChatToHistory({
                id: response.thread_id,
                text: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
                timestamp: new Date()
            }).catch(console.error);

            return response;
        } catch (error) {
            setError('Failed to send message. Please try again.');
            console.error('Chat error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Solo cargar historial al inicio o cuando cambia threadId
    useEffect(() => {
        if (threadId && messages.length === 0) {
            loadThreadHistory();
        }
    }, [threadId]);

    const loadThreadHistory = async () => {
        try {
            setIsLoading(true);
            const history = await chatService.getThreadHistory(threadId);
            
            const formattedMessages = history.messages.map((msg: { id: string; text: string; type: 'user' | 'assistant'; timestamp: string }) => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
            }));

            setMessages(formattedMessages);
        } catch (error) {
            setError('Failed to load chat history');
            console.error('History loading error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const clearMessages = () => {
        setMessages([]);
        setThreadId('');
        setError(null);
    };

    const loadConversation = async (chatId: string) => {
        try {
            setIsLoading(true);
            const history = await chatService.getThreadHistory(chatId);
            
            const formattedMessages = history.messages.map((msg: { id: string; text: string; type: 'user' | 'assistant'; timestamp: string }) => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
            }));

            setMessages(formattedMessages);
            setThreadId(chatId);
            await AsyncStorage.setItem('selectedChatId', chatId);
        } catch (error) {
            console.error('Error loading conversation:', error);
            setError('Failed to load conversation');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        threadId,
        clearMessages,
        loadConversation
    };
}; 