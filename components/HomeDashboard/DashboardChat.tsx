import ImagesPath from '@/assets/ImagesPath';
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Platform, TextInputKeyPressEventData, NativeSyntheticEvent, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { useChat } from '@/hooks/useChat';
import Animated, { FadeIn } from 'react-native-reanimated';
import { DashboardChatProps, Message } from '@/types/chat';
import AssistanceMessage from '../ui/AssistanceMessage';
import axios from 'axios';
import Constants from 'expo-constants';

const API_URL: string = Constants.expoConfig?.extra?.API_URL || '';

if (!API_URL) {
  throw new Error('API_URL is not defined');
}

const { height } = Dimensions.get('window');
const maxHeight = height * 0.65;

// Define a more specific message type that includes thread_id
type ChatMessage = Message & {
    thread_id?: string;
    bigQueryData?: any;
}

const DashboardChat = ({
    title = "What can we help with?",
    placeholder = "What would you like to know about risk and trends in senior care facilities?",
    disclaimer = "Senior Care Alliance can make mistakes. Check important info.",
    onChatUpdated,
    loadConversation,
    isLoading,
    error: errorProp,
    threadId: externalThreadId,
}: DashboardChatProps & { threadId?: string }) => {
    const { messages, sendMessage, isLoading: isSending, setMessages, threadId: chatThreadId, setThreadId } = useChat();
    const [inputText, setInputText] = useState('');
    const [error, setError] = useState('');
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [displayThreadId, setDisplayThreadId] = useState<string | undefined>(externalThreadId || chatThreadId);
    const scrollViewRef = useRef<ScrollView>(null);

    // Set chat thread ID from external thread ID on initial load
    useEffect(() => {
        if (externalThreadId && setThreadId) {
            console.log('Setting initial thread ID from external source:', externalThreadId);
            setThreadId(externalThreadId);
        }
    }, [externalThreadId]);

    // Track thread_id changes from both sources
    useEffect(() => {
        const newThreadId = externalThreadId || chatThreadId;
        if (newThreadId !== displayThreadId) {
            console.log('Thread ID Changed:', { previous: displayThreadId, new: newThreadId });
            setDisplayThreadId(newThreadId);
        }
    }, [externalThreadId, chatThreadId]);

    useEffect(() => {
        if (externalThreadId) {
            loadConversationMessages(externalThreadId);
        }
    }, [externalThreadId]);  // Dependency on externalThreadId

    const loadConversationMessages = async (conversationId: string) => {
        console.log('Starting to load messages for conversation:', conversationId);
        setIsLoadingHistory(true);
        try {
            const messagesResponse = await axios.get(`${API_URL}/conversations/${conversationId}/messages`);
            console.log('Messages Response:', messagesResponse.data);
            
            if (!messagesResponse.data || !Array.isArray(messagesResponse.data)) {
                console.error('Invalid messages data:', messagesResponse.data);
                return;
            }
            
            const formattedMessages = messagesResponse.data.map((msg: any) => ({
                id: msg.id,
                text: msg.content,
                type: msg.role === 'user' ? 'user' : 'assistant',
                timestamp: new Date(msg.created_at),
                thread_id: conversationId,
                bigQueryData: msg.message_metadata?.bigquery_data || null,
                role: msg.role,
                content: msg.content,
                created_at: msg.created_at,
                message_metadata: msg.message_metadata
            }));
            
            console.log('Setting formatted messages:', formattedMessages);
            setMessages(formattedMessages as Message[]);
            scrollViewRef.current?.scrollToEnd({ animated: true });
        } catch (error) {
            console.error('Error loading conversation:', error);
            setError('Failed to load conversation');
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const handleSubmit = async () => {
        if (!inputText.trim() || isSending) return;

        try {
            setError('');
            console.log('Attempting to send message:', inputText);
            console.log('Current thread ID before sending:', displayThreadId);
            
            // Log thread continuity information
            if (displayThreadId) {
                console.log('✓ Continuing conversation with same thread ID:', displayThreadId);
            } else {
                console.log('Starting new conversation thread');
            }
            
            await sendMessage(inputText);
            
            // The thread ID is tracked in the useChat hook
            // We'll get it in the next render via useEffect
            
            setInputText('');
            scrollViewRef.current?.scrollToEnd({ animated: true });

        } catch (error) {
            console.error('Failed to send message:', error);
            setError('Failed to send message');
        }
    };

    const handleKeyPress = (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        const { key, shiftKey } = event.nativeEvent as KeyboardEvent; // Cast to KeyboardEvent
        if (key === 'Enter' && !shiftKey) {
            event.preventDefault(); // Prevent default behavior
            handleSubmit(); // Call the function to send the message
        }
    };


    const renderMessage = (message: ChatMessage, threadId: string) => {
        
        return (
            <View
                key={message.id}
                className={`flex-row items-start ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
                <View
                    className={`rounded-2xl p-4 ${message.type === 'user'
                            ? 'bg-dark-blue max-w-[650px]'
                            : 'bg-gray-200 border border-gray-200 max-w-[750px]'
                        }`}
                >
                    {message.type === 'user' ? (
                        <View>
                            <Text className="text-[14px] font-light text-white">
                                {message.text}
                            </Text>
                        </View>
                    ) : (
                        <AssistanceMessage message={message} threadId={threadId} />
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

    const renderContent = () => {
        if (isLoadingHistory) {
            return (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text className="mt-2">Loading conversation...</Text>
                </View>
            );
        } else if (messages.length === 0) {
            return (
                <Text className="text-2xl md:text-3xl lg:text-4xl font-extralight text-dark-blue text-center">
                    {title}
                </Text>
            );
        } else {
            return (
                <ScrollView
                    ref={scrollViewRef}
                    className="w-full p-8 pb-20"
                    showsVerticalScrollIndicator={false}
                    style={{ maxHeight }}
                >
                    <Animated.View
                        entering={FadeIn.duration(400)}
                        className="flex-row items-start mb-4"
                    >
                        <View className='gap-6 px-12 w-full'>
                            {messages.map((message) => renderMessage(message as ChatMessage, displayThreadId ?? ''))}
                        </View>
                    </Animated.View>
                </ScrollView>
            );
        }
    };

    return (
        <View className={`flex flex-col h-full ${messages.length === 0 ? 'justify-center top-48 gap-10' : ''}`}>
            {/* Chat Messages Area */}
            <View className={`${messages.length === 0 ? 'flex items-center justify-center' : 'flex-1 overflow-hidden'}`}>
                {renderContent()}
            </View>

            {/* Input Area - Always fixed at bottom */}
            <View
                className={`w-full bg-background-gray ${messages.length === 0
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
                        onKeyPress={handleKeyPress}
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