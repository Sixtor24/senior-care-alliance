import React, { useEffect, useState } from 'react';
import { View } from "react-native";
import chatService from '../services/chatService';
import { ChatHistory } from '../types/chat';
import Dashboard from '@/components/HomeDashboard/Dashboard';

interface ChatMessage {
    id: string;
    text: string;
    type: 'user' | 'assistant';
    timestamp: Date;
}

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
        // Find the section for today or create it if it doesn't exist
        const today = new Date().toDateString();
        const existingSection = chatHistory.find(section => section.title === today);

        let updatedHistory: ChatHistory;

        if (existingSection) {
            // If the section exists, add the new message to its items
            existingSection.items.push(newMessage);
            updatedHistory = [...chatHistory]; // Create a new array reference
        } else {
            // If the section doesn't exist, create a new one
            updatedHistory = [
                ...chatHistory,
                {
                    title: today,
                    items: [newMessage]
                }
            ];
        }

        setChatHistory(updatedHistory);
        await chatService.saveChatHistory(updatedHistory);
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