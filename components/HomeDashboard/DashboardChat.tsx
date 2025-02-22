import ImagesPath from '@/assets/ImagesPath';
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useChat } from '@/hooks/useChat';
import Animated, { FadeIn } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import chatService from '@/services/chatService';

interface DashboardChatProps {
    title?: string;
    placeholder?: string;
    disclaimer?: string;
    onChatUpdated?: () => void;
}

const DashboardChat = ({
    title = "What can we help with?",
    placeholder = "What would you like to know about risk and trends in senior care facilities?",
    disclaimer = "Senior Care Alliance can make mistakes. Check important info.",
    onChatUpdated
}: DashboardChatProps) => {
    const { messages, sendMessage, isLoading: isSending, error: chatError, loadConversation } = useChat();
    const [inputText, setInputText] = useState('');
    const [error, setError] = useState('');
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        if (onChatUpdated) {
            const loadSelectedChat = async () => {
                const selectedChatId = await AsyncStorage.getItem('selectedChatId');
                if (selectedChatId) {
                    await loadConversation(selectedChatId);
                }
            };
            loadSelectedChat();
        }
    }, [onChatUpdated]);

    const handleSubmit = async () => {
        if (!inputText.trim() || isSending) return;

        try {
            setError('');
            const response = await sendMessage(inputText);
            setInputText('');
            scrollViewRef.current?.scrollToEnd({ animated: true });
            
            const chatTitle = inputText.substring(0, 30) + (inputText.length > 30 ? '...' : '');
            if (onChatUpdated) {
                await chatService.saveChatToHistory({
                    id: response.thread_id,
                    text: chatTitle,
                    timestamp: new Date()
                });
                setTimeout(onChatUpdated, 1000);
            }

        } catch (error) {
            setError('Failed to send message');
            console.error('Chat submission error:', error);
        }
    };

    const renderMessage = (message: any) => {
        // Helper function to format markdown-style content
        const formatMarkdownContent = (text: string) => {
            if (!text.includes('### ') && !text.includes('**')) return text;

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

        return (
            <View
                key={message.id}
                className={`flex-row items-start ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
                <View
                    className={`rounded-2xl p-4 ${
                        message.type === 'user'
                            ? 'bg-dark-blue max-w-[650px]'
                            : 'bg-gray-200 border border-gray-200 max-w-[550px]'
                    }`}
                >
                    {message.type === 'user' ? (
                        <Text className="text-[14px] font-light text-white">
                            {message.text}
                        </Text>
                    ) : (
                        formatMarkdownContent(message.text)
                    )}
                </View>
                {message.type === 'user' && (
                    <View className="w-10 h-10 rounded-full ml-2 overflow-hidden flex-shrink-0 items-center justify-center">
                        <Image
                            source={ImagesPath.USER_AVATAR}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    </View>
                )}
            </View>
        );
    };

    return (
        <View className={`flex flex-col h-full ${messages.length === 0 ? 'justify-center top-48 gap-10' : ''}`}>
            {/* Chat Messages Area */}
            <View className={`${messages.length === 0 ? 'flex items-center justify-center' : 'flex-1 overflow-hidden'}`}>
                {messages.length === 0 ? (
                    <Text className="text-2xl md:text-3xl lg:text-4xl font-extralight text-dark-blue text-center">
                        {title}
                    </Text>
                ) : (
                    <ScrollView
                        ref={scrollViewRef}
                        className="w-full p-8 pb-20"
                        showsVerticalScrollIndicator={false}
                        style={{ maxHeight: '65vh' }}
                    >
                        <Animated.View
                            entering={FadeIn.duration(400)}
                            className="flex-row items-start mb-4"
                        >
                            <View className='gap-6 px-12 w-full'>
                                {messages.map(renderMessage)}
                            </View>
                        </Animated.View>
                    </ScrollView>
                )}
            </View>

            {/* Input Area - Always fixed at bottom */}
            <View 
                className={`w-full bg-background-gray ${
                    messages.length === 0 
                        ? 'flex items-center justify-center'
                        : 'fixed bottom-0 left-0 right-0'
                }`}
            >
                <View
                    className="w-full max-w-[1000px] mx-auto flex-row items-start bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.1,
                        shadowRadius: 10,
                    }}
                >
                    <TextInput
                        className="flex-1 border-none text-sm md:text-base text-[#374151] min-h-[100px] px-2 py-2"
                        placeholder={placeholder}
                        placeholderTextColor="#6b7280"
                        selectionColor="#6b7280"
                        multiline={true}
                        textAlignVertical="top"
                        numberOfLines={5}
                        value={inputText}
                        onChangeText={setInputText}
                        style={[Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)]}
                    />
                    <TouchableOpacity
                        className="bg-dark-blue p-3 md:p-4 rounded-full self-end w-10 h-10 md:w-12 md:h-12 items-center justify-center"
                        onPress={handleSubmit}
                        disabled={isSending}
                    >
                        {isSending ? (
                            <ActivityIndicator color="white" size="small" />
                        ) : (
                            <Image source={ImagesPath.ARROW} className="w-4 h-4 md:w-5 md:h-5" />
                        )}
                    </TouchableOpacity>
                </View>
                {!!error && (
                    <Text className="text-red-500 text-sm mt-2 text-center">
                        {error}
                    </Text>
                )}
                {messages.length > 0 && (
                    <Text className="text-xs md:text-sm text-[#6b7280] mt-4 text-center">
                        {disclaimer}
                    </Text>
                )}
            </View>
        </View>
    );
};

export default DashboardChat;