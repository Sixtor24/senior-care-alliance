import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { MaterialIcons, Octicons, Feather } from '@expo/vector-icons';
import { ChatHistory } from '../types/chat';
import LoadingSkeleton from './ui/LoadingSkeleton';

export type ActiveView = 'chat' | 'portfolio' | 'other';

interface SidebarProps {
    selectedItem: string;
    onSelectItem: (item: string) => void;
    chatHistory: ChatHistory;
    isLoading: boolean;
    currentView: 'chat' | 'portfolio' | 'other';
    activeView: ActiveView;
    onChangeView: (view: ActiveView) => void;
}

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

const Sidebar = ({ selectedItem, onSelectItem, chatHistory, isLoading, currentView, activeView, onChangeView }: SidebarProps) => {
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
                            <View className="w-full gap-5 pt-4">
                                {activeView === 'chat' && (
                                    isLoading ? (
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
                                                        className={`hover:bg-gray-50 rounded-md px-4 py-2 ${selectedItem === item.id ? 'bg-gray-100' : 'bg-white'}`}
                                                        onPress={() => onSelectItem(item.id)}
                                                    >
                                                        <Text className="text-black text-[0.75rem]">{item.text}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        ))
                                    )
                                )}
                            </View>
                        </View>
                    )}
                </ScrollView>
            </View>
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