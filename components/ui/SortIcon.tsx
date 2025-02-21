import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

interface SortIconProps {
    isSelected?: boolean;
    activeColor?: string;
    inactiveColor?: string;
    size?: number;
    onPress?: () => void;
}

const SortIcon = ({ 
    isSelected = false, 
    activeColor = '#0B5FFF',
    inactiveColor = '#667085',
    size = 13,
    onPress 
}: SortIconProps) => {
    return (
        <TouchableOpacity 
            onPress={onPress}
            className="ml-2"
        >
            <View className="flex-col items-center justify-center h-4">
                <FontAwesome6 
                    name="angle-up" 
                    size={size} 
                    color={isSelected ? activeColor : inactiveColor}
                    style={{ marginBottom: -3 }}
                />
                <FontAwesome6 
                    name="angle-down" 
                    size={size} 
                    color={isSelected ? activeColor : inactiveColor}
                    style={{ marginTop: -3 }}
                />
            </View>
        </TouchableOpacity>
    );
};

export default SortIcon; 