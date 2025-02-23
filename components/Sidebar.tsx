import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { MaterialIcons, Octicons, Feather } from '@expo/vector-icons';
import { ChatHistory, Conversation, SidebarProps } from '../types/chat';
import LoadingSkeleton from './ui/LoadingSkeleton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import chatService from '@/services/chatService';

export type ActiveView = 'chat' | 'portfolio' | 'facility';

const SidebarSkeleton = () => (
    <View className="p-3 gap-5">
        <LoadingSkeleton height={64} className="my-4" />
        
        <View className="flex-col gap-1">
            {[1, 2, 3].map((i) => (
                <LoadingSkeleton 
                    key={i} 
                    height={40} 
                    className="rounded-md"
                />
            ))}
        </View>
        
        <View className="w-full gap-5 pt-4">
            {[1, 2].map((section) => (
                <View key={section} className="w-full gap-1">
                    <LoadingSkeleton 
                        width="50%" 
                        height={20} 
                        className="mb-2"
                    />
                    {[1, 2, 3].map((item) => (
                        <LoadingSkeleton 
                            key={item}
                            height={36}
                            className="rounded-md"
                        />
                    ))}
                </View>
            ))}
        </View>
    </View>
);

const Sidebar = ({ 
    selectedItem, 
    onSelectItem, 
    chatHistory, 
    isLoading, 
    currentView, 
    activeView,
    onChangeView,
    loadConversation,
    conversations 
}: SidebarProps) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

    const handleConversationClick = async (conversationId: string) => {
        await loadConversation(conversationId);
        onSelectItem('chat');
    };

    const handleChatSelect = async (chatId: string) => {
        await AsyncStorage.setItem('selectedChatId', chatId);
        onSelectItem(chatId);
    };

    const handleDelete = async () => {
        if (selectedThreadId) {
            try {
                const currentHistory = await chatService.loadChatHistory();
                const updatedHistory = currentHistory.map(section => ({
                    ...section,
                    items: section.items.filter(item => item.thread_id !== selectedThreadId)
                })).filter(section => section.items.length > 0);

                await chatService.saveChatHistory(updatedHistory);
                setShowDeleteModal(false);
                if (onChangeView) {
                    onChangeView('chat');
                }
            } catch (error) {
                console.error('Error deleting chat:', error);
            }
        }
    };

    return (
        <View className="w-80 md:w-72 lg:w-64 xl:w-1/6 h-full z-10">
            <View
                style={{
                    shadowOffset: { width: 1, height: 0 },
                    shadowColor: '#000',
                    shadowOpacity: 0.05,
                    shadowRadius: 10,
                }}
                className="w-full bg-[#FFFFFF] h-full border-r border-gray-100"
            >
                <ScrollView className="h-full" showsVerticalScrollIndicator={false}>
                    {isLoading ? (
                        <SidebarSkeleton />
                    ) : (
                        <View className="p-3 px-4 gap-5">
                            <Image
                                source={require('../assets/images/senior-care-logo.svg')}
                                className="w-full h-16 my-4 object-contain"
                            />
                            <View className="flex-col gap-1">
                                <MenuItem
                                    id="chat"
                                    icon={<Feather name="home" size={20} />}
                                    label="Home"
                                    selectedItem={selectedItem}
                                    onSelect={onSelectItem}
                                />
                                <MenuItem
                                    id="portfolio"
                                    icon={<Octicons name="briefcase" size={20} />}
                                    label="Portfolio"
                                    selectedItem={selectedItem}
                                    onSelect={onSelectItem}
                                />
                                <MenuItem
                                    id="facility"
                                    icon={<MaterialIcons name="insert-chart-outlined" className='-mr-2 right-1' size={28} />}
                                    label="Facility Insights"
                                    selectedItem={selectedItem}
                                    onSelect={onSelectItem}
                                />
                            </View>
                            {/* <View className="w-full gap-5 pt-4">
                                <Text className="text-[0.7rem] pl-4 py-2 font-light uppercase text-sidebar-gray">
                                    Conversaciones
                                </Text>
                                {conversations.map((conversation) => (
                                    <TouchableOpacity 
                                        key={conversation.id}
                                        className="group hover:bg-gray-50 rounded-md px-4 py-1"
                                        onPress={() => handleConversationClick(conversation.id)}
                                    >
                                        <View className="flex-row justify-between items-center">
                                            <Text className="text-black text-[0.75rem] flex-1">
                                                {conversation.title || `Chat ${conversation.id.slice(0, 8)}`}
                                            </Text>
                                            <Text className="text-xs text-gray-500">
                                                {new Date(conversation.created_at).toLocaleDateString()}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View> */}
                        </View>
                    )}
                </ScrollView>
            </View>

            {showDeleteModal && (
                <View className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
                    <View className="bg-white p-8 rounded-xl w-[400px] shadow-xl">
                        <Text className="text-xl font-medium mb-4">Delete Chat</Text>
                        <Text className="text-gray-600 mb-8">Are you sure you want to delete this chat?</Text>
                        <View className="flex-row justify-end gap-4">
                            <TouchableOpacity
                                className="px-6 py-3 rounded-lg border border-gray-200"
                                onPress={() => setShowDeleteModal(false)}
                            >
                                <Text className="text-gray-600">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="px-6 py-3 bg-red-500 rounded-lg"
                                onPress={handleDelete}
                            >
                                <Text className="text-white font-medium">Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

interface MenuItemProps {
    id: string;
    icon: React.ReactNode;
    label: string;
    selectedItem: string;
    onSelect: (id: string) => void;
}

const MenuItem = ({ id, icon, label, selectedItem, onSelect }: MenuItemProps) => (
    <TouchableOpacity 
        className={`flex-row items-center py-1.5 px-4 rounded-md ${
            selectedItem === id 
                ? 'bg-dark-blue' 
                : 'bg-white hover:bg-gray-50'
        }`}
        onPress={() => onSelect(id)}
    >
        {React.cloneElement(icon as React.ReactElement, {
            color: selectedItem === id ? '#FFFFFF' : '#9DA3AE'
        })}
        <Text className={`ml-2 text-xs ${
            selectedItem === id 
                ? 'text-white' 
                : 'text-gray-400'
        }`}>
            {label}
        </Text>
    </TouchableOpacity>
);

export default Sidebar;