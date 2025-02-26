import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import SortIcon from './SortIcon'

interface AssistanceMessageProps {
    message: any;
    threadId?: string;
}

const AssistanceMessage = ({ message, threadId }: AssistanceMessageProps) => {
    const hasStructuredData = (message: any) => {
        return message?.bigQueryData &&
            (Array.isArray(message.bigQueryData) ||
                typeof message.bigQueryData === 'object');
    };

    const getColumnNames = (data: any[]): string[] => {
        if (!Array.isArray(data) || data.length === 0) return [];
        return Object.keys(data[0] || {});
    };

    const renderDynamicTable = (data: any) => {
        if (!Array.isArray(data) || data.length === 0) return null;

        const columns = getColumnNames(data);
        const [sortState, setSortState] = useState({ field: '', direction: 'asc' });

        const handleSort = (field: string) => {
            setSortState(prev => ({
                field,
                direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
            }));
        };

        return (
            <View className="mt-6 mb-6">
                <View className="bg-white rounded-3xl shadow-sm py-1 overflow-hidden flex-1 flex flex-col">
                    <ScrollView 
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    >
                        <View>
                            {/* Headers */}
                            <View className="flex-row border-b border-gray-200 px-6 p-4">
                                {columns.map((header, index) => (
                                    <TouchableOpacity 
                                        key={index}
                                        className="flex-1 flex-row items-center min-w-[200px]"
                                        onPress={() => handleSort(header)}
                                    >
                                        <Text className="text-[14px] font-light text-dark-blue">
                                            {header.split('_').map(word => 
                                                word.charAt(0).toUpperCase() + word.slice(1)
                                            ).join(' ')}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Table Body */}
                            <ScrollView 
                                className="flex-1"
                                showsVerticalScrollIndicator={false}
                            >
                                {data.map((item, rowIndex) => (
                                    <View 
                                        key={rowIndex}
                                        className="flex-row items-center p-4 px-6 py-5 border-b border-gray-100"
                                    >
                                        {columns.map((header, colIndex) => (
                                            <View 
                                                key={colIndex}
                                                className="flex-1 min-w-[150px]"
                                            >
                                                <Text 
                                                    className={`text-[14px] ${
                                                        typeof item[header] === 'number' 
                                                            ? 'font-semibold text-gray-900'
                                                            : 'text-gray-600'
                                                    }`}
                                                >
                                                    {typeof item[header] === 'number'
                                                        ? item[header].toFixed(2)
                                                        : String(item[header])}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    };

    // Helper function to format markdown-style content with table support
    const formatMarkdownContent = (text: string, messageData: any) => {
        return (
            <View className="gap-4">
                {text.split('\n').map((section, index) => {
                    if (section.startsWith('### ')) {
                        return (
                            <View key={index} className="gap-2">
                                <Text className="text-lg font-semibold text-dark-blue">
                                    {section.replace('### ', '')}
                                </Text>
                                {/* Render table only if structured data exists */}
                                {hasStructuredData(messageData) &&
                                    renderDynamicTable(messageData.bigquery_data)}
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
    
    // Get thread_id from either the message or the threadId prop
    
    return (
        <View>
            <View>
                {formatMarkdownContent(message.text, message)}
            </View>
            {hasStructuredData(message) && (
                <View className='gap-3'>
                    {renderDynamicTable(message.bigQueryData)}
                </View>
            )}
        </View>
    )
}

export default AssistanceMessage