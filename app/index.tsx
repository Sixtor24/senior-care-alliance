import React, { useEffect, useState } from 'react';
import { View } from "react-native";
import { chatService } from '../services/chatService';
import { ChatHistory } from '../types/chat';
import Dashboard from '@/components/HomeDashboard/Dashboard';

const HomePage = () => {
    const [chatHistory, setChatHistory] = useState<ChatHistory>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadChatHistory();
    }, []);

    const loadChatHistory = async () => {
        try {
            setIsLoading(true);
            const history = await chatService.getChatHistory();
            setChatHistory(history);
        } catch (error) {
            console.error('Failed to load chat history:', error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <View className="flex-row h-full w-full bg-white">
            <Dashboard
                chatHistory={chatHistory}
                isLoading={isLoading}
            />
        </View>
    );
};

export default HomePage;