import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, RefObject } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { MaterialIcons, Octicons, Feather } from '@expo/vector-icons';
import { Conversation, SidebarProps } from '../types/chat';
import LoadingSkeleton from './ui/LoadingSkeleton';
import axios from 'axios';

export type ActiveView = 'chat' | 'portfolio' | 'facility';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sca-api-535434239234.us-central1.run.app';


const ConversationSkeleton = () => (
    <View className="w-full flex-row justify-between items-center">
        <View className="flex-1 mr-2">
            <View 
                className="h-4 bg-gray-300 dark:bg-gray-200 rounded-md animate-pulse" 
                style={{ opacity: 0.7 }}
            />
        </View>
    </View>
);

const Sidebar = forwardRef<View, SidebarProps>(({ 
    selectedItem, 
    onSelectItem, 
    isLoading: externalLoading, 
    onChangeView,
    loadConversation,
    onSelectThread
}, ref) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [conversationTitles, setConversationTitles] = useState<{[key: string]: string}>({});
    const [isLoading, setIsLoading] = useState(externalLoading);

    const loadConversations = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_URL}/conversations`, {
                params: { 
                    sort: 'created_at:desc', 
                    limit: 10,
                    offset: 0,
                    type: 'general',
                    status: 'active'
                }
            });
            
            console.log('Loaded conversations:', response.data);
            setConversations(response.data);
            await loadTitlesForConversations(response.data);
        } catch (error) {
            console.error('Error loading conversations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadTitlesForConversations = async (conversations: Conversation[]) => {
        const newTitles: {[key: string]: string} = {};
        for (const conversation of conversations.slice(0, 10)) {
            if (!conversationTitles[conversation.id]) {
                try {
                    const messagesResponse = await axios.get(
                        `${API_URL}/conversations/${conversation.id}/messages?limit=1&offset=0`
                    );
                    const firstUserMessage = messagesResponse.data.find(
                        (msg: { role: string; }) => msg.role === 'user'
                    );
                    if (firstUserMessage) {
                        newTitles[conversation.id] = firstUserMessage.content;
                    }
                } catch (error) {
                    console.error('Error loading conversation title:', error);
                }
            }
        }
        
        if (Object.keys(newTitles).length > 0) {
            setConversationTitles(prev => ({...prev, ...newTitles}));
        }
    };

    // Solo cargar al inicio
    useEffect(() => {
        loadConversations();
    }, []);

    const handleConversationClick = async (conversationId: string) => {
        try {
            console.log('Loading conversation:', conversationId);
            
            // Realizar una solicitud para obtener los mensajes de la conversación
            const response = await axios.get(`${API_URL}/conversations/${conversationId}/messages`);
            
            // Imprimir los mensajes en la consola
            console.log('Conversation messages:', response.data);
            
            // Llamar a la función para cargar la conversación
            await loadConversation(conversationId);
            onSelectItem('chat');
            
            // Recargar conversaciones después de seleccionar una
            loadConversations();
        } catch (error) {
            console.error('Error loading conversation:', error);
        }
    };

    const handleLabelClick = (conversationId: string) => {
        console.log('Label clicked, loading conversation:', conversationId);
        onSelectThread(conversationId);
    };

    const groupConversationsByDate = (conversations: Conversation[]) => {
        const groups: { [key: string]: Conversation[] } = {};
        
        conversations.slice(0, 10).forEach(conversation => {
            const date = new Date(conversation.created_at);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            
            let groupKey = '';
            
            if (date.toDateString() === today.toDateString()) {
                groupKey = 'Today';
            } else if (date.toDateString() === yesterday.toDateString()) {
                groupKey = 'Yesterday';
            } else if (date.getTime() > today.getTime() - 7 * 24 * 60 * 60 * 1000) {
                groupKey = 'This Week';
            } else if (date.getMonth() === today.getMonth()) {
                groupKey = 'This Month';
            } else {
                groupKey = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            }
            
            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(conversation);
        });
        
        return groups;
    };

    return (
        <View ref={ref as RefObject<View>} className="w-80 md:w-72 lg:w-64 xl:w-1/6 h-full z-10">
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
                                {/* <MenuItem
                                    id="facility"
                                    icon={<MaterialIcons name="insert-chart-outlined" className='-mr-2 right-1' size={28} />}
                                    label="Facility Insights"
                                    selectedItem={selectedItem}
                                    onSelect={onSelectItem}
                                /> */}
                            </View>
                            <View className="w-full gap-5 pt-4">
                                {Object.entries(groupConversationsByDate(conversations)).map(([dateGroup, groupConversations]) => (
                                    <View key={dateGroup}>
                                        <Text className="text-[0.7rem] pl-4 py-2 font-light uppercase text-sidebar-gray">
                                            {dateGroup}
                                        </Text>
                                        <View className='flex-col gap-2'>
                                        {groupConversations.map((conversation) => (
                                            <TouchableOpacity 
                                                key={conversation.id}
                                                className="group hover:bg-gray-50 rounded-md px-4 py-2"
                                                onPress={() => handleLabelClick(conversation.id)}
                                            >
                                                {conversationTitles[conversation.id] ? (
                                                    <View className="flex-row justify-between items-center">
                                                        <Text className="text-black text-[0.75rem] flex-1">
                                                            {conversationTitles[conversation.id]?.length > 30 
                                                                ? conversationTitles[conversation.id].slice(0, 30) + '...' 
                                                                : conversationTitles[conversation.id]}
                                                        </Text>
                                                    </View>
                                                ) : (
                                                    <ConversationSkeleton />
                                                )}
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                </ScrollView>
            </View>
        </View>
    );
});

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