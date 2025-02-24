import { useState, useEffect } from 'react';
import chatService from '@/services/chatService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message } from '@/types/chat';

export const useChat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [threadId, setThreadId] = useState<string>('');

    const sendMessage = async (text: string) => {
        setIsLoading(true);
        setError(null);

        try {
            console.log('useChat: Initiating message send:', { text, currentThreadId: threadId });

            const userMessage: Message = {
                id: Date.now().toString(),
                text,
                type: 'user',
                timestamp: new Date(),
                thread_id: threadId,
                role: 'user',
                content: text,
                created_at: new Date().toISOString(),
                message_metadata: {},
            };

            setMessages(prev => [...prev, userMessage]);

            const response = await chatService.sendMessage(text);
            console.log('useChat: Received API response:', {
                hasResponse: !!response.response,
                threadId: response.thread_id,
                messageLength: response.response?.length
            });

            if (response && response.response) {
                setThreadId(response.thread_id);
                
                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: response.response,
                    type: 'assistant',
                    timestamp: new Date(),
                    thread_id: response.thread_id,
                    role: 'assistant',
                    content: response.response,
                    created_at: new Date().toISOString(),
                    message_metadata: {},
                };

                setMessages(prev => [...prev, assistantMessage]);
                console.log('useChat: Message thread updated successfully');
            }
        } catch (error) {
            console.error('useChat: Error in message flow:', error);
            setError('Error al enviar el mensaje');
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([]);
        setThreadId('');
        setError(null);
    };

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        clearChat,
        threadId
    };
}; 