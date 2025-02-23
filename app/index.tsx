import React, { useEffect, useState } from 'react';
import { View } from "react-native";
import chatService from '../services/chatService';
import { ChatHistory, ChatMessage } from '../types/chat';
import Dashboard from '@/components/HomeDashboard/Dashboard';

const HomePage = () => {
    const [chatHistory, setChatHistory] = useState<ChatHistory>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadChatHistory();
    }, []);

    const loadChatHistory = async () => {
        const history = await chatService.loadChatHistory();
        setChatHistory(history);
        setIsLoading(false);
    };

    const handleChatUpdate = async (newMessage: ChatMessage) => {
        try {
            const updatedHistory = await chatService.updateChatHistory(newMessage);
            setChatHistory(updatedHistory);
        } catch (error) {
            console.error('Error updating chat history:', error);
        }
    };

    return (
        <View className="flex-row h-full w-full bg-white">
            <Dashboard
                chatHistory={chatHistory}
                isLoading={isLoading}
                onChatUpdated={handleChatUpdate}
            />
        </View>
    );
};

export default HomePage;