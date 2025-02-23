import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import LoadingSkeleton from '../ui/LoadingSkeleton';
import DashboardChat from './DashboardChat';
import DashboardPortfolio from './DashboartPortfolio';
import Sidebar, { ActiveView } from '../Sidebar';
import ProfileMenu from '../ProfileMenu';
import { profileData, menuItems } from '../../data/profileData';
import { ChatHistory, ChatMessage, DashboardProps } from '../../types/chat';
import DashboardFacility from './DashboardFacility';
import chatService from '@/services/chatService';

const DashboardSkeleton = () => (
    <View className="w-full space-y-6 p-4">
        <LoadingSkeleton height={200} className="rounded-lg" />
        <View className="space-y-4">
            <LoadingSkeleton height={60} className="rounded-lg" />
            <LoadingSkeleton height={60} className="rounded-lg" />
            <LoadingSkeleton height={60} className="rounded-lg" />
        </View>
    </View>
);

const Dashboard = ({ isLoading, chatHistory, conversations, onChatUpdated }: DashboardProps) => {
    const [activeView, setActiveView] = useState<ActiveView>('chat');
    const [chatHistoryState, setChatHistory] = useState<ChatHistory>(chatHistory);

    const loadChatHistory = async () => {
        try {
            const history = await chatService.getChatHistory();
            setChatHistory(history);
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    };

    const loadConversation = async (id: string) => {
        try {
            const messages = await chatService.getConversationMessages(id);
            // Actualizar el estado de los mensajes aquí
        } catch (error) {
            console.error('Error loading conversation:', error);
        }
    };

    useEffect(() => {
        loadChatHistory();
    }, []);

    const handleSelectItem = (itemId: string) => {
        switch (itemId) {
            case 'chat':
                setActiveView('chat');
                break;
            case 'portfolio':
                setActiveView('portfolio');
                break;
            case 'facility':
                setActiveView('facility');
                break;
            // Add other cases as needed
        }
    };

    const handleChatUpdate = async () => {
        // Solo actualizar el historial del sidebar
        loadChatHistory();
    };

    // Flatten chatHistory to get an array of ChatMessage
    const messages: ChatMessage[] = chatHistory.flatMap(section => 
        section.items.map(item => ({
            id: item.id,
            text: item.text,
            type: item.type,
            timestamp: item.timestamp,
            thread_id: item.thread_id,
        }))
    );

    const handleChatSubmit = async (message: string) => {
        const chatMessage: ChatMessage = {
            id: Date.now().toString(),
            text: message,
            type: 'user',
            timestamp: new Date(),
            thread_id: '', // Set the thread_id as needed
        };

        await onChatUpdated(chatMessage);
    };

    return (
        <View className="flex-1 flex-row">
            <Sidebar
                chatHistory={chatHistory}
                isLoading={isLoading}
                selectedItem={activeView}
                activeView={activeView}
                onChangeView={setActiveView}
                onSelectItem={handleSelectItem}
                currentView={activeView}
                loadConversation={loadConversation}
                conversations={conversations}
            />
            <View className="flex-1 bg-background-gray">
                <ProfileMenu
                    profileImage={profileData.profileImage}
                    userName={profileData.userName}
                    userEmail={profileData.userEmail}
                    menuItems={menuItems}
                />
                <ScrollView 
                    className="flex-1 px-4 md:px-6 lg:px-8"
                >
                    {isLoading ? (
                        <Animated.View 
                            entering={FadeIn.duration(300)}
                            exiting={FadeOut.duration(300)}
                        >
                            <DashboardSkeleton />
                        </Animated.View>
                    ) : (
                        <>
                            {activeView === 'chat' && (
                                <Animated.View 
                                    entering={FadeIn.duration(300)}
                                    exiting={FadeOut.duration(300)}
                                >
                                    <DashboardChat 
                                        title={'What can we help with?'}
                                        messages={messages}
                                        onSendMessage={handleChatSubmit}
                                        isLoading={isLoading}
                                        error={null}
                                        onChatUpdated={handleChatUpdate}
                                    />
                                </Animated.View>
                            )}
                            {activeView === 'portfolio' && (
                                <Animated.View 
                                    entering={FadeIn.duration(300)}
                                    exiting={FadeOut.duration(300)}
                                >
                                    <DashboardPortfolio />
                                </Animated.View>
                            )}
                            {activeView === 'facility' && (
                                <Animated.View 
                                    entering={FadeIn.duration(300)}
                                    exiting={FadeOut.duration(300)}
                                >
                                    <DashboardFacility />
                                </Animated.View>
                            )}
                        </>
                    )}
                </ScrollView>
            </View>
        </View>
    );
};

export default Dashboard;