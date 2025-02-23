import React, { useEffect, useState } from 'react';
import { View } from "react-native";
import chatService from '../services/chatService';
import { ChatHistory, ChatMessage, Conversation } from '../types/chat';
import Dashboard from '@/components/HomeDashboard/Dashboard';

const HomePage = () => {
    const [chatHistory, setChatHistory] = useState<ChatHistory>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            const [history, convs] = await Promise.all([
                chatService.loadChatHistory(),
                chatService.getConversations()
            ]);
            setChatHistory(history);
            setConversations(convs);
        } catch (error) {
            console.error('Error loading initial data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChatUpdate = async (newMessage: ChatMessage) => {
        try {
            const [updatedHistory, updatedConversations] = await Promise.all([
                chatService.updateChatHistory(newMessage),
                chatService.getConversations() // Recargar conversaciones
            ]);
            setChatHistory(updatedHistory);
            setConversations(updatedConversations);
        } catch (error) {
            console.error('Error updating chat:', error);
        }
    };

    return (
        <View className="flex-row h-full w-full bg-white">
            <Dashboard
                chatHistory={chatHistory}
                conversations={conversations}
                isLoading={isLoading}
                onChatUpdated={handleChatUpdate}
            />
        </View>
    );
};

export default HomePage;