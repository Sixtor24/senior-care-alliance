import ImagesPath from '@/assets/ImagesPath';
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Platform } from 'react-native';

interface DashboardChatProps {
    onSubmit: (text: string) => void;
    title?: string;
    placeholder?: string;
    disclaimer?: string;
}

const DashboardChat = ({ 
    onSubmit,
    title = "What can we help with?",
    placeholder = "What would you like to know about risk and trends in senior care facilities?",
    disclaimer = "Senior Care Alliance can make mistakes. Check important info."
}: DashboardChatProps) => {
    const [inputText, setInputText] = React.useState('');

    const handleSubmit = () => {
        if (inputText.trim()) {
            onSubmit(inputText);
            setInputText('');
        }
    };

    return (
        <View className="items-center justify-center py-32">
            <View className="max-w-[1000px] w-full">
                <Text className="text-2xl md:text-3xl lg:text-4xl font-extralight text-[#111827] mb-4 md:mb-6 text-center">
                    {title}
                </Text>
                <View 
                    className="w-full flex-row items-start bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl"
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
                    >
                        <Image 
                            source={ImagesPath.ARROW} 
                            className="w-4 h-4 md:w-5 md:h-5" 
                        />
                    </TouchableOpacity>
                </View>
                <Text className="text-xs md:text-sm text-[#6b7280] mt-6 md:mt-10 text-center">
                    {disclaimer}
                </Text>
            </View>
        </View>
    );
};

export default DashboardChat;