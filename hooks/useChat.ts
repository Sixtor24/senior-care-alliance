import { useState, useEffect } from 'react';
import chatService from '@/services/chatService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatMessage } from '@/types/chat';

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

export const useChat = (initialThreadId?: string, onChatUpdated?: (message: Message) => Promise<void>) => {
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
                timestamp: new Date(),
            };

            // Actualiza la UI inmediatamente
            setMessages(prev => [...prev, userMessage]);

            // Envía el mensaje al servidor
            const response = await chatService.sendMessage(text);

            if (response && response.response) {
                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: response.response,
                    type: 'assistant',
                    timestamp: new Date(),
                };

                // Actualiza la UI con la respuesta del asistente
                setMessages(prev => [...prev, assistantMessage]);
            } else {
                console.error('Respuesta vacía del servidor:', response);
                setError('No se recibió respuesta del asistente');
            }
        } catch (error) {
            console.error('Error en sendMessage:', error);
            setError('Error al enviar el mensaje');
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