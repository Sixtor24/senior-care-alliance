import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, ScrollView, Image, Platform, ActivityIndicator } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import ImagesPath from '@/assets/ImagesPath';
import Constants from 'expo-constants';

const API_URL: string = Constants.expoConfig?.extra?.API_URL || '';

if (!API_URL) {
  throw new Error('API_URL is not defined');
}

const { height } = Dimensions.get('window');
const maxHeight = height * 0.65;

interface Message {
    id: string;
    text: string;
    type: 'user' | 'assistant';
    timestamp: Date;
}

interface DashboardFacilityChatProps {
    userAvatar: any;
    ccn: string;
}

// Add this function to format markdown content
const formatMarkdownContent = (text: string) => {
    return (
        <View className="gap-4">
            {text.split('\n').map((section, index) => {
                if (section.startsWith('### ')) {
                    return (
                        <View key={index} className="gap-2">
                            <Text className="text-lg font-semibold text-dark-blue">
                                {section.replace('### ', '')}
                            </Text>
                        </View>
                    );
                } else if (section.includes('**')) {
                    const parts = section.split('**');
                    return (
                        <Text key={index} className="text-[14px] font-light">
                            {parts.map((part, partIndex) => (
                                <Text
                                    key={partIndex}
                                    className={partIndex % 2 === 1 ? "font-bold" : "font-light"}
                                >
                                    {part}
                                </Text>
                            ))}
                        </Text>
                    );
                } else {
                    return (
                        <Text key={index} className="text-[14px] font-light">
                            {section}
                        </Text>
                    );
                }
            })}
        </View>
    );
};

const DashboardFacilityChat = ({ userAvatar, ccn }: DashboardFacilityChatProps) => {
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [threadId, setThreadId] = useState<string | null>(null);
    const scrollViewRef = useRef<ScrollView>(null);
    const [isLoading, setIsLoading] = useState(false);

    // console.log('DashboardFacilityChat received CCN:', ccn);

    /* useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await fetch(`https://sca-api-535434239234.us-central1.run.app/conversations/facility/${ccn}?limit=50&offset=0`, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                    },
                });
                const data = await response.json();
                setConversations(data);
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        };

        fetchConversations();
    }, [ccn]); */

    const handleSend = async () => {
        if (!inputText.trim() || isLoading) return;

        // Log para verificar el threadId actual
        console.log('Current threadId:', threadId);

        // Add user's message to the messages
        const userMessage: Message = {
            id: new Date().toISOString(),
            text: inputText,
            type: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        
        try {
            // Log para verificar el mensaje enviado
            console.log('Sending message:', inputText);

            // Make API call to get real response using the new endpoint
            const response = await fetch(`${API_URL}/agents/facility/chat`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    message: inputText,
                    thread_id: threadId ?? undefined,  // Only include if we have a thread_id
                    facility_ccn: ccn
                }),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to get response');
            }
            
            const data = await response.json();
            
            // Log para verificar la respuesta del bot
            console.log('Bot response data:', data);

            // Save the thread_id for future messages
            if (data.thread_id) {
                setThreadId(data.thread_id);
                console.log('Updated threadId:', data.thread_id);
            }
            
            // Add bot response from API
            const botResponse: Message = {
                id: new Date().toISOString() + '-bot',
                text: data.response || "Sorry, I couldn't process your request.",
                type: 'assistant',
                timestamp: new Date(),
            };
            
            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error('Error getting chat response:', error);
            
            // Add error message if API call fails
            const errorMessage: Message = {
                id: new Date().toISOString() + '-error',
                text: error instanceof Error ? error.message : "Sorry, I couldn't connect to the server. Please try again later.",
                type: 'assistant',
                timestamp: new Date(),
            };
            
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
        
        setInputText('');
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };

    return (
        <View className="flex-1 bg-[white] mt-10 rounded-xl border border-gray-200 p-6">
            <ScrollView
                ref={scrollViewRef}
                className="flex-1"
                style={{ maxHeight }}
                showsVerticalScrollIndicator={false}
            >
                {/* Display conversations list */}
                {/* <{conversations.map((conversation) => (
                    <Animated.View
                        key={conversation.id}
                        entering={FadeIn.duration(400)}
                        className="flex-row items-start mb-4"
                    >
                        <View className='gap-6'>
                            <View className="flex-row items-start">
                                <View className="rounded-2xl bg-gray-200 border max-w-[550px] border-gray-200 p-4">
                                    <Text className="text-[14px] font-light text-gray-900">
                                        {conversation.title}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </Animated.View>
                ))}> */}
                
                {/* Display actual chat messages */}
                {messages.map((message) => (
                    <Animated.View
                        key={message.id}
                        entering={FadeIn.duration(400)}
                        className="flex-row items-start"
                    >
                        {message.type === 'assistant' ? (
                            <View className='py-3'>
                                <View className="flex-row items-start">
                                    <View className="rounded-2xl bg-gray-200 border max-w-[550px] border-gray-200 p-4">
                                        {formatMarkdownContent(message.text)}
                                    </View>
                                </View>
                            </View>
                        ) : (
                            <View className='py-3 w-full'>
                                <View className="flex-row items-start justify-end">
                                    <View className="rounded-2xl bg-dark-blue max-w-[650px] p-4">
                                        <Text className="text-[14px] font-light text-white">
                                            {message.text}
                                        </Text>
                                    </View>
                                    <View className="w-10 h-10 rounded-full ml-2 overflow-hidden flex-shrink-0 items-center justify-center">
                                        <Image
                                            source={userAvatar || ImagesPath.USER_AVATAR}
                                            className="w-full h-full"
                                            resizeMode="cover"
                                        />
                                    </View>
                                </View>
                            </View>
                        )}
                    </Animated.View>
                ))}
            </ScrollView>
            <View className='flex-row items-end gap-2 mt-4'>
                <View className="flex-1 bg-white rounded-full border border-gray-200 px-4 py-4">
                    <TextInput
                        className="w-full text-[14px] text-gray-900"
                        placeholder="Ask anything"
                        placeholderTextColor="#667085"
                        value={inputText}
                        onChangeText={setInputText}
                        style={[Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)]}
                        onKeyPress={({ nativeEvent }) => {
                            if (nativeEvent.key === 'Enter' && inputText.trim()) {
                                handleSend();
                            }
                        }}
                    />
                </View>
                <TouchableOpacity
                    className="bg-dark-blue p-3 md:p-4 rounded-full w-10 h-10 md:w-12 md:h-12 items-center justify-center flex-shrink-0"
                    onPress={handleSend}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" size="small" />
                    ) : (
                        <Image
                            source={ImagesPath.ARROW}
                            className="w-4 h-4 md:w-5 md:h-5"
                        />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default DashboardFacilityChat; 