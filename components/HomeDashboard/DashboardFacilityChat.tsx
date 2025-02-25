import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import ImagesPath from '@/assets/ImagesPath';

interface Message {
    id: string;
    text: string;
    type: 'user' | 'assistant';
    timestamp: Date;
}

interface DashboardFacilityChatProps {
    initialMessages: Message[];
    userAvatar: any;
}

const DashboardFacilityChat = ({ initialMessages, userAvatar }: DashboardFacilityChatProps) => {
    const [inputText, setInputText] = useState('');
    const scrollViewRef = useRef<ScrollView>(null);

    const handleSend = () => {
        if (!inputText.trim()) return;
        setInputText('');
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };

    return (
        <View className="flex-1 bg-[white] mt-10 rounded-xl border border-gray-200 p-6">
            <ScrollView
                ref={scrollViewRef}
                className="flex-1"
                showsVerticalScrollIndicator={false}
            >
                <Animated.View
                    entering={FadeIn.duration(400)}
                    className="flex-row items-start mb-4"
                >
                    <View className='gap-6'>
                        <View className="flex-row items-start">
                            <View className="rounded-2xl bg-gray-200 border max-w-[550px] border-gray-200 p-4">
                                <Text className="text-[14px] font-light text-gray-900">
                                    Hello, I'm your virtual nursing advisor. This facility is low risk, with only five severe deficiencies noted —specifically related to infection control. While their performance is strong, there's just a little room to improve on staffing. Is there any additional data or reports I can provide for you on Advent Health?
                                </Text>
                            </View>
                        </View>
                        <View className="flex-row items-start justify-end">
                            <View className="rounded-2xl bg-dark-blue max-w-[650px] p-4">
                                <Text className="text-[14px] font-light text-white">
                                    Can you please provide a Staffing Report?
                                </Text>
                            </View>
                            <View className="w-10 h-10 rounded-full ml-2 overflow-hidden flex-shrink-0 items-center justify-center">
                                <Image
                                    source={ImagesPath.USER_AVATAR}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            </View>
                        </View>
                    </View>
                </Animated.View>
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
                    />
                </View>
                <TouchableOpacity
                    className="bg-dark-blue p-3 md:p-4 rounded-full w-10 h-10 md:w-12 md:h-12 items-center justify-center flex-shrink-0"
                    onPress={handleSend}
                >
                    <Image
                        source={ImagesPath.ARROW}
                        className="w-4 h-4 md:w-5 md:h-5"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default DashboardFacilityChat; 