import ImagesPath from '@/assets/ImagesPath';
import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useChat } from '@/hooks/useChat';
import Animated, { FadeIn } from 'react-native-reanimated';

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
    const { messages, sendMessage, isLoading: isSending, error: chatError } = useChat();
    const [inputText, setInputText] = useState('');
    const [error, setError] = useState('');
    const scrollViewRef = useRef<ScrollView>(null);

    const handleSubmit = async () => {
        if (!inputText.trim() || isSending) return;

        try {
            setError('');
            await sendMessage(inputText);
            setInputText('');
            scrollViewRef.current?.scrollToEnd({ animated: true });
            
            // Solo actualizamos el sidebar, no todo el chat
            if (onChatUpdated) {
                setTimeout(onChatUpdated, 1000); // Pequeño delay para asegurar que el guardado se completó
            }

        } catch (error) {
            setError('Failed to send message');
            console.error('Chat submission error:', error);
        }
    };

    const renderMessage = (message: any) => (
        <View
            key={message.id}
            className={`flex-row items-start ${message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
        >
            <View
                className={`rounded-2xl p-4 ${message.type === 'user'
                        ? 'bg-dark-blue max-w-[650px]'
                        : 'bg-gray-200 border border-gray-200 max-w-[550px]'
                    }`}
            >
                <Text
                    className={`text-[14px] font-light ${message.type === 'user' ? 'text-white' : 'text-gray-900'
                        }`}
                >
                    {message.text}
                </Text>
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

    return (
        <View className="items-center justify-center">
            <View className="max-w-[1000px] w-full">
                <View
                    className={`w-full ${messages.length === 0 ? 'justify-center items-center' : 'justify-start'
                        }`}
                >
                    <ScrollView
                        ref={scrollViewRef}
                        className="w-full py-8"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            flexGrow: 0, // Cambiado a 0 para evitar que se estire
                            justifyContent: messages.length === 0 ? 'center' : 'flex-start',
                        }}
                        style={{
                            maxHeight: '100%', // Asegura que el ScrollView no exceda el contenedor
                        }}
                    >
                        {messages.length > 0 && (
                            <Animated.View
                                entering={FadeIn.duration(400)}
                                className="flex-row items-start mb-4"
                            >
                                <View className='gap-6 w-full'>
                                    {messages.map(renderMessage)}
                                </View>
                            </Animated.View>
                        )}
                    </ScrollView>
                </View>
            </View>
            <View
                className={`w-full ${messages.length > 0 ? 'fixed bottom-0 left-0 right-0 bg-background-gray' : 'top-48'}`}
                style={{
                    zIndex: 10
                }}
            >
                {messages.length === 0 && (
                    <Text className="text-2xl md:text-3xl lg:text-4xl font-extralight text-dark-blue mb-4 md:mb-6 text-center">
                        {title}
                    </Text>
                )}
                <View
                    className="w-full max-w-[1000px] mx-auto flex-row items-start bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl"
                    style={{
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: 0,
                        },
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
                            <Image
                                source={ImagesPath.ARROW}
                                className="w-4 h-4 md:w-5 md:h-5"
                            />
                        )}
                    </TouchableOpacity>
                </View>
                {!!error && (
                    <Text className="text-red-500 text-sm mt-2 text-center">
                        {error}
                    </Text>
                )}
                {messages.length > 0 && (
                    <Text className="text-xs md:text-sm mb-4 text-[#6b7280] mt-6 md:mt-4 text-center max-w-[1000px] mx-auto">
                        {disclaimer}
                    </Text>
                )}
            </View>
        </View>
    );
};

export default DashboardChat;