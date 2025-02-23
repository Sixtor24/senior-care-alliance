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
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const loadChatHistory = async () => {
        try {
            const history = await chatService.getChatHistory();
            setChatHistory(history);
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    };

    const loadConversation = async (conversationId: string) => {
        try {
            const history = await chatService.getConversationMessages(conversationId);
            setMessages(history.map(msg => ({
                id: msg.id,
                text: msg.content,
                type: msg.role as 'user' | 'assistant',
                timestamp: new Date(msg.created_at),
                thread_id: conversationId,
                role: msg.role,
                content: msg.content,
                created_at: msg.created_at,
                message_metadata: msg.message_metadata
            })));
            setActiveView('chat');
        } catch (error) {
            console.error('Error loading conversation:', error);
        }
    };

    useEffect(() => {
        loadChatHistory();
    }, []);

    const handleViewChange = (item: string) => {
        setActiveView(item as ActiveView);
    };

    const handleChatUpdate = async () => {
        // Solo actualizar el historial del sidebar
        loadConversation(messages[0].thread_id);
    };

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
                onSelectItem={handleViewChange}
                loadConversation={loadConversation}
                conversations={conversations}
                currentView={activeView}
                activeView={activeView}
                onChangeView={setActiveView}
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