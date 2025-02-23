import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import LoadingSkeleton from '../ui/LoadingSkeleton';
import DashboardChat from './DashboardChat';
import DashboardPortfolio from './DashboartPortfolio';
import Sidebar, { ActiveView } from '../Sidebar';
import ProfileMenu from '../ProfileMenu';
import { profileData, menuItems } from '../../data/profileData';
import { ChatHistory, ChatMessage } from '../../types/chat';
import DashboardFacility from './DashboardFacility';
import chatService from '@/services/chatService';

interface DashboardProps {
    isLoading: boolean;
    chatHistory: ChatHistory;
    onChatUpdated: (newMessage: ChatMessage) => Promise<void>;
}

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

const Dashboard = ({ isLoading, chatHistory, onChatUpdated }: DashboardProps) => {
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