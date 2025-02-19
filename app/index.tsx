import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Platform } from "react-native";
import { MaterialIcons, Octicons, Feather } from '@expo/vector-icons';
import { chatService } from '../services/chatService';
import { ChatHistory } from '../types/chat';

const Dashboard = () => {
    const [selectedItem, setSelectedItem] = React.useState('home');
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [chatHistory, setChatHistory] = useState<ChatHistory>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadChatHistory();
    }, []);

    const loadChatHistory = async () => {
        try {
            setIsLoading(true);
            const history = await chatService.getChatHistory();
            setChatHistory(history);
        } catch (error) {
            console.error('Failed to load chat history:', error);
            // Handle error appropriately
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="flex-row h-full w-full bg-white">
            {/* Sidebar Container with responsive width */}
            <View className="w-80 md:w-72 lg:w-64 xl:w-1/6 h-full z-10">
                {/* Sidebar */}
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
                        <View className="p-3 gap-5">
                            {/* Logo with responsive sizing */}
                            <Image
                                source={require('../assets/images/senior-care-logo.svg')}
                                className="w-full h-16 my-4 object-contain"
                            />
                            {/* Menu Items - rest of the sidebar content */}
                            <View className="flex-col gap-1">
                                <TouchableOpacity 
                                    className={`flex-row items-center py-1 px-4 rounded-md ${selectedItem === 'home' ? 'bg-gray-100' : 'bg-white'}`}
                                    onPress={() => setSelectedItem('home')}
                                >
                                    <Feather 
                                        name="home" 
                                        size={20} 
                                        color={selectedItem === 'home' ? '#0E67C7' : '#9DA3AE'} 
                                    />
                                    <Text className={`ml-2 text-xs ${selectedItem === 'home' ? 'text-black' : 'text-gray-400'}`}>
                                        Home
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    className={`flex-row items-center py-1 px-4 rounded-md ${selectedItem === 'portfolio' ? 'bg-gray-100' : 'bg-white'}`}
                                    onPress={() => setSelectedItem('portfolio')}
                                >
                                    <Octicons 
                                        name="briefcase" 
                                        size={20} 
                                        color={selectedItem === 'portfolio' ? '#0E67C7' : '#9DA3AE'} 
                                    />
                                    <Text className={`ml-2 text-xs ${selectedItem === 'portfolio' ? 'text-black' : 'text-gray-400'}`}>
                                        Portfolio
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    className={`flex-row items-center py-1 pl-[0.85rem] pr-4 rounded-md ${selectedItem === 'facility' ? 'bg-gray-100' : 'bg-white'}`}
                                    onPress={() => setSelectedItem('facility')}
                                >
                                    <MaterialIcons 
                                        name="insert-chart-outlined" 
                                        size={24} 
                                        color={selectedItem === 'facility' ? '#0E67C7' : '#9DA3AE'} 
                                    />
                                    <Text className={`ml-2 text-xs ${selectedItem === 'facility' ? 'text-black' : 'text-gray-400'}`}>
                                        Facility Insights
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View className="w-full gap-5 pt-4">
                                {isLoading ? (
                                    <Text>Loading...</Text>
                                ) : (
                                    chatHistory.map((section, index) => (
                                        <View key={index} className="w-full gap-1">
                                            <Text className="text-[0.7rem] pl-4 py-2 font-light uppercase text-sidebar-gray">
                                                {section.title}
                                            </Text>
                                            {section.items.map((item) => (
                                                <TouchableOpacity 
                                                    key={item.id}
                                                    className={`rounded-md px-4 py-2 ${selectedItem === item.id ? 'bg-gray-100' : 'bg-white'}`}
                                                    onPress={() => setSelectedItem(item.id)}
                                                >
                                                    <Text className="text-black text-[0.75rem]">{item.text}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    ))
                                )}
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>

            {/* Main Content - responsive padding and max-width */}
            <View className="flex-1 bg-background-gray">
                {/* Profile section with responsive padding */}
                <View className="w-full flex-row justify-end p-4 md:p-6 relative z-10">
                    <TouchableOpacity 
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-gray-200 items-center justify-center bg-white"
                        onPress={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    >
                        <Image 
                            source={require('../assets/images/profile.svg')} 
                            className="w-10 h-10 md:w-12 md:h-12"
                            resizeMode="contain"
                        />
                    </TouchableOpacity>

                    {/* Profile Dropdown Menu */}
                    {isProfileMenuOpen && (
                        <View 
                            className="absolute top-20 right-4 md:right-6 bg-white rounded-xl w-64 p-4 shadow-lg z-20"
                            style={{
                                shadowColor: '#000',
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.15,
                                shadowRadius: 10,
                            }}
                        >
                            {/* Profile Info */}
                            <View className="flex-row items-center mb-4 pb-4 border-b border-gray-100">
                                <Image 
                                    source={require('../assets/images/profile.svg')} 
                                    className="w-12 h-12 rounded-full"
                                    resizeMode="contain"
                                />
                                <View className="ml-3">
                                    <Text className="text-sm font-medium text-gray-900">John Doe</Text>
                                    <Text className="text-xs text-gray-500">john.doe@example.com</Text>
                                </View>
                            </View>

                            {/* Menu Items */}
                            <View className="gap-2">
                                <TouchableOpacity className="flex-row items-center py-2 px-3 rounded-md hover:bg-gray-50">
                                    <Text className="text-sm text-gray-700">Manage Team</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="flex-row items-center py-2 px-3 rounded-md hover:bg-gray-50">
                                    <Text className="text-sm text-gray-700">Settings</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="flex-row items-center py-2 px-3 rounded-md hover:bg-gray-50">
                                    <Text className="text-sm text-gray-700">Logout</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>

                <ScrollView 
                    className="flex-1 px-4 md:px-6 lg:px-8"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    <View className="items-center justify-center flex-1 min-h-full">
                        <Text className="text-2xl md:text-3xl lg:text-4xl font-extralight text-[#111827] mb-4 md:mb-6">
                            What can we help with?
                        </Text>
                        <View 
                            className="w-full max-w-[1000px] flex-row items-start bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl"
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
                                placeholder="What would you like to know about risk and trends in senior care facilities?"
                                placeholderTextColor="#6b7280"
                                selectionColor="#6b7280"
                                multiline={true}
                                textAlignVertical="top"
                                numberOfLines={5}
                                style={[Platform.OS === 'web' && ({ outlineStyle: 'none' } as any) ]}
                            />
                            <TouchableOpacity className="bg-dark-blue p-3 md:p-4 rounded-full self-end w-10 h-10 md:w-12 md:h-12 items-center justify-center">
                                <Image source={require('../assets/images/Arrow.svg')} className="w-4 h-4 md:w-5 md:h-5" />
                            </TouchableOpacity>
                        </View>
                        <Text className="text-xs md:text-sm text-[#6b7280] my-6 md:my-10">
                            Senior Care Alliance can make mistakes. Check important info.
                        </Text>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

export default Dashboard;