import { useState, useEffect } from 'react';
import chatService from '@/services/chatService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message } from '@/types/chat';

export const useChat = (initialThreadId?: string, onChatUpdated?: (message: Message) => Promise<void>) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [threadId, setThreadId] = useState<string>(initialThreadId ?? '');

    const loadConversation = async (conversationId: string) => {
        try {
            setIsLoading(true);
            const history = await chatService.getConversationMessages(conversationId);
            setMessages(history);
            setThreadId(conversationId);
            await AsyncStorage.setItem('currentThreadId', conversationId);
        } catch (error) {
            console.error('Error loading conversation:', error);
            setError('Failed to load conversation');
        } finally {
            setIsLoading(false);
        }
    };

    const sendMessage = async (text: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const userMessage: Message = {
                id: Date.now().toString(),
                text,
                type: 'user',
                timestamp: new Date(),
                role: 'user',
                content: text,
                created_at: new Date().toISOString(),
                message_metadata: {},
            };

            setMessages(prev => [...prev, userMessage]);

            const response = await chatService.sendMessage(text);

            if (response && response.response) {
                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: response.response,
                    type: 'assistant',
                    timestamp: new Date(),
                    role: 'assistant',
                    content: response.response,
                    created_at: new Date().toISOString(),
                    message_metadata: {},
                };

                setMessages(prev => [...prev, assistantMessage]);
                if (onChatUpdated) await onChatUpdated(assistantMessage);
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
            
            const formattedMessages = history.messages.map((msg: any) => ({
                id: msg.id,
                role: msg.role,
                content: msg.content,
                created_at: msg.created_at,
                message_metadata: msg.message_metadata || {},
                text: msg.content,
                type: msg.role as 'user' | 'assistant',
                timestamp: new Date(msg.created_at)
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