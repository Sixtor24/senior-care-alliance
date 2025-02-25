import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { AntDesign, Feather, FontAwesome6 } from '@expo/vector-icons';
import DashboardFacilityChat from './DashboardFacilityChat';
import ImagesPath from '@/assets/ImagesPath';
import SortIcon from '../ui/SortIcon';

interface FacilityData {
    name: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
    };
    metrics: {
        riskLevel: 'Low' | 'Medium' | 'High';
        riskScore: number;
        cmsRating: number;
        fireInspections: number;
        certifiedBeds: number;
        citations: number;
    };
}

interface Deficiency {
    id: string;
    severity: string;
    tag: string;
    date: string;
    description: string;
    hasStandardReport?: boolean;
    hasComplaintReport?: boolean;
}

interface DeficienciesTableProps {
    data: Deficiency[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

interface DashboardFacilityProps {
    facilityData: {
        name: string;
        address: string;
        metrics: {
            riskLevel: string;
            riskScore: number;
            cmsRating: number;
            fireInspections: string;
            certifiedBeds: number;
            citations: number;
        };
    };
}

const DashboardFacility = ({ facilityData }: DashboardFacilityProps) => {
    console.log('DashboardFacility - Received facilityData:', facilityData);
    console.log('DashboardFacility - Address:', facilityData.address);

    const mockData: Deficiency[] = [
        {
            id: '1',
            severity: 'G',
            tag: '10000',
            date: '04/12/2024',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...',
            hasComplaintReport: true
        },
        {
            id: '2',
            severity: 'L',
            tag: '10000',
            date: '04/12/2024',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...',
            hasStandardReport: true,
            hasComplaintReport: true
        },
        // ... add more items as needed
    ];

    const [currentPage, setCurrentPage] = React.useState(1);

    console.log('DashboardFacility - Metrics:', facilityData.metrics);

    return (
        <View className="flex-1 p-8">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-8">
                <Text className="text-[32px] font-extralight text-dark-blue">
                    {facilityData.name}
                </Text>
                {/* <View className="flex-1 max-w-xs">
                    <View className="flex-row items-center bg-white  rounded-xl px-3 py-2 drop-shadow-sm flex-1 border border-gray-300">
                        <AntDesign name="search1" size={22} color="#C5C5C5" />
                        <TextInput
                            placeholder="Search for facility"
                            className="ml-2 flex-1 text-[14px] text-gray-900"
                            placeholderTextColor="#667085"
                            style={[Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)]}
                        />
                    </View>
                </View> */}
            </View>

            {/* Facility Info Card */}
            <View className="bg-white rounded-3xl p-8 shadow-sm">
                <View className="mb-6">
                    <Text className="text-xl font-semibold text-gray-900">{facilityData.name}</Text>
                    <Text className="text-gray-600 mt-1">{facilityData.address}</Text>
                </View>

                {/* Metrics Grid */}
                <View className="flex-row gap-4 mb-8">
                    {/* Risk Level */}
                    <View className={`flex-1 ${
                        facilityData.metrics.riskLevel.toLowerCase() === 'high' ? 'bg-red-50 border-red-700' :
                        facilityData.metrics.riskLevel.toLowerCase() === 'medium' ? 'bg-yellow-50 border-yellow-700' :
                        'bg-emerald-50 border-emerald-700'
                    } rounded-xl pb-4 pl-4 pt-2 pr-2 border`}>
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-gray-700">Risk Level</Text>
                            <Feather name="info" size={23} color={
                                facilityData.metrics.riskLevel.toLowerCase() === 'high' ? '#B91C1C' :
                                facilityData.metrics.riskLevel.toLowerCase() === 'medium' ? '#B45309' :
                                '#047857'
                            } />
                        </View>
                        <Text className={`text-3xl font-semibold ${
                            facilityData.metrics.riskLevel.toLowerCase() === 'high' ? 'text-red-700' :
                            facilityData.metrics.riskLevel.toLowerCase() === 'medium' ? 'text-yellow-700' :
                            'text-emerald-700'
                        }`}>{facilityData.metrics.riskLevel}</Text>
                    </View>

                    {/* Risk Score */}
                    <View className="flex-1 bg-white rounded-2xl p-4 border border-gray-100 pb-4 pl-4 pt-2 pr-2">
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-gray-700">Risk Score</Text>
                            <Feather name="info" size={23} color="#9DA3AE" />
                        </View>
                        <Text className="text-2xl text-gray-900">{facilityData.metrics.riskScore.toFixed(2)}</Text>
                    </View>

                    {/* CMS Rating */}
                    <View className="flex-1 bg-white rounded-2xl p-4 border border-gray-100">
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-gray-700">CMS</Text>
                        </View>
                        <View className="flex-row">
                            {[...Array(5)].map((_, index) => (
                                <AntDesign
                                    key={index}
                                    name="star"
                                    size={24}
                                    color={index < facilityData.metrics.cmsRating ? "#2E90FA" : "#E5E7EB"}
                                    className="mr-1"
                                />
                            ))}
                        </View>
                    </View>
                </View>

                {/* Secondary Metrics */}
                <View className="flex-row gap-4">
                    {/* Fire Inspections */}
                    <View className="flex-1 bg-white rounded-2xl p-4 border border-gray-100">
                        <Text className="text-gray-700 mb-2">Fire Inspections</Text>
                        <Text className="text-2xl text-gray-900">{facilityData.metrics.fireInspections}</Text>
                    </View>

                    {/* Certified Beds */}
                    <View className="flex-1 bg-white rounded-2xl p-4 border border-gray-100">
                        <Text className="text-gray-700 mb-2">Certified Beds</Text>
                        <Text className="text-2xl text-gray-900">{facilityData.metrics.certifiedBeds}</Text>
                    </View>

                    {/* Citations */}
                    <View className="flex-1 bg-white rounded-2xl p-4 border border-gray-100">
                        <Text className="text-gray-700 mb-2">Citations & Deficiencies</Text>
                        <Text className="text-2xl text-gray-900">{facilityData.metrics.citations}</Text>
                    </View>
                </View>
                <DashboardFacilityChat
                    initialMessages={[
                        {
                            id: '1',
                            text: "Hello, I'm your virtual nursing advisor. This facility is low risk, with only five severe deficiencies noted —specifically related to infection control. While their performance is strong, there's just a little room to improve on staffing. Is there any additional data or reports I can provide for you on Advent Health?",
                            type: 'assistant',
                            timestamp: new Date()
                        },
                        {
                            id: '2',
                            text: "Can you please provide a Staffing Report?",
                            type: 'user',
                            timestamp: new Date()
                        }
                    ]}
                    userAvatar={ImagesPath.USER_AVATAR}
                />
            </View>

            <DeficienciesTable
                data={mockData}
                currentPage={currentPage}
                totalPages={10}
                onPageChange={setCurrentPage}
            />
        </View>
    );
};

const DeficienciesTable = ({ data, currentPage, totalPages, onPageChange }: DeficienciesTableProps) => {
    const [sortState, setSortState] = React.useState<{
        field: 'severity' | 'tag' | 'date' | 'description' | null;
        direction: 'asc' | 'desc' | null;
    }>({
        field: null,
        direction: null
    });

    const handleSort = (field: typeof sortState.field) => {
        setSortState(prevState => ({
            field,
            direction: prevState.field === field && prevState.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    return (
        <View className='my-8'>
            <Text className="text-base font-medium px-6 py-4">Severe Deficiencies</Text>
            <View className="bg-white rounded-3xl shadow-sm py-1 overflow-hidden">
                {/* Table Header */}
                <View className="flex-row border-b border-gray-200 px-6 py-6">
                    <View className="w-[100px]">
                        <TouchableOpacity
                            className="flex-row items-center"
                            onPress={() => handleSort('severity')}
                        >
                            <Text className="text-[14px] font-light text-dark-blue text-left">Severity</Text>
                            {/* <SortIcon
                                isSelected={sortState.field === 'severity'}
                                activeColor="#C5C5C5"
                                inactiveColor="#C5C5C5"
                            /> */}
                        </TouchableOpacity>
                    </View>

                    <View className="w-[100px]">
                        <TouchableOpacity
                            className="flex-row items-center"
                            onPress={() => handleSort('tag')}
                        >
                            <Text className="text-[14px] font-light text-dark-blue text-left">Tag</Text>
                            {/* <SortIcon
                                isSelected={sortState.field === 'tag'}
                                activeColor="#C5C5C5"
                                inactiveColor="#C5C5C5"
                            /> */}
                        </TouchableOpacity>
                    </View>

                    <View className="w-[100px]">
                        <TouchableOpacity
                            className="flex-row items-center"
                            onPress={() => handleSort('date')}
                        >
                            <Text className="text-[14px] font-light text-dark-blue text-left">Date</Text>
                            {/* <SortIcon
                                isSelected={sortState.field === 'date'}
                                activeColor="#C5C5C5"
                                inactiveColor="#C5C5C5"
                            /> */}
                        </TouchableOpacity>
                    </View>

                    <View className="flex-1">
                        <TouchableOpacity
                            className="flex-row items-center pl-4"
                            onPress={() => handleSort('description')}
                        >
                            <Text className="text-[14px] font-light text-dark-blue text-left">Description</Text>
                            {/* <SortIcon
                                isSelected={sortState.field === 'description'}
                                activeColor="#C5C5C5"
                                inactiveColor="#C5C5C5"
                            /> */}
                        </TouchableOpacity>
                    </View>

                    <View className="w-[300px]" /> {/* Space for buttons */}
                </View>

                {/* Table Body */}
            </View>
            {/* Pagination */}
            {/* <View className="flex-row items-center justify-between mt-6 px-4">
                <TouchableOpacity
                    className="flex-row items-center gap-2"
                    onPress={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <FontAwesome6 name="angle-left" size={13} className='text-gray-600' />
                    <Text className="text-[14px] font-light text-gray-600">Previous</Text>
                </TouchableOpacity>

                <View className="flex-row items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => page === 1 || page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1))
                        .map((page, index, array) => (
                            <View key={`page-${page}`} className="flex-row items-center">
                                {index > 0 && array[index - 1] !== page - 1 && (
                                    <View className="px-2">
                                        <Text className="text-[14px] text-gray-600">...</Text>
                                    </View>
                                )}
                                <TouchableOpacity
                                    className={`w-8 h-8 items-center justify-center rounded-full ${currentPage === page ? 'bg-dark-blue' : ''
                                        }`}
                                    onPress={() => onPageChange(page)}
                                >
                                    <Text className={`text-[14px] font-light ${currentPage === page ? 'text-white' : 'text-gray-600'
                                        }`}>{page}</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                </View>

                <TouchableOpacity
                    className="flex-row items-center gap-2"
                    onPress={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <Text className="text-[14px] font-light text-gray-600">Next</Text>
                    <FontAwesome6 name="angle-right" size={13} className='text-gray-600' />
                </TouchableOpacity>
            </View> */}
        </View>
    );
};

export default DashboardFacility; 