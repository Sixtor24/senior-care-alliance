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
    standardReportLink?: string;
    complaintReportLink?: string;
}

interface DeficienciesTableProps {
    data: Deficiency[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
}

interface DashboardFacilityProps {
    facilityData: {
        name: string;
        address: string;
        ccn: string;
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

    const [deficiencies, setDeficiencies] = React.useState<Deficiency[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [totalPages, setTotalPages] = React.useState(1);
    const ITEMS_PER_PAGE = 10;

    React.useEffect(() => {
        const fetchDeficiencies = async () => {
            if (!facilityData.ccn) return;
            
            setIsLoading(true);
            try {
                const offset = (currentPage - 1) * ITEMS_PER_PAGE;
                const response = await fetch(
                    `https://sca-api-535434239234.us-central1.run.app/portfolios/facilities/${facilityData.ccn}/tags?limit=${ITEMS_PER_PAGE}&offset=${offset}`
                );
                
                if (!response.ok) {
                    throw new Error('Failed to fetch deficiencies');
                }
                
                const data = await response.json();
                
                // Transform API data to match our component's expected format
                const transformedData: Deficiency[] = data.map((item: any) => ({
                    id: item.id,
                    severity: item.scope_severity_code,
                    tag: item.deficiency_tag_number,
                    date: item.survey_date,
                    description: item.deficiency_description,
                    hasStandardReport: item.standard_deficiency && item.standard_report_link,
                    hasComplaintReport: item.complaint_deficiency && item.complaint_report_link,
                    standardReportLink: item.standard_report_link,
                    complaintReportLink: item.complaint_report_link
                }));
                
                setDeficiencies(transformedData);
                
                // Calculate total pages based on response headers or data length
                // This is a placeholder - you might need to adjust based on actual API response
                const totalCount = parseInt(response.headers.get('X-Total-Count') || '0', 10) || data.length * 5;
                setTotalPages(Math.ceil(totalCount / ITEMS_PER_PAGE));
            } catch (error) {
                console.error('Error fetching deficiencies:', error);
                // Fallback to mock data in case of error
                setDeficiencies(mockData);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchDeficiencies();
    }, [facilityData.ccn, currentPage]);

    console.log('DashboardFacility - Metrics:', facilityData.metrics);

    // Mock data as fallback
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
                    userAvatar={ImagesPath.USER_AVATAR}
                    ccn={facilityData.ccn}
                />
            </View>

            <DeficienciesTable
                data={deficiencies}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                isLoading={isLoading}
            />
        </View>
    );
};

const DeficienciesTable = ({ data, currentPage, totalPages, onPageChange, isLoading = false }: DeficienciesTableProps) => {
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

    const handleReportClick = (url?: string) => {
        if (url) {
            window.open(url, '_blank');
        }
    };

    // Extract the nested ternary into a function
    const renderTableContent = () => {
        if (isLoading) {
            return (
                <View className="py-8 items-center justify-center">
                    <Text className="text-gray-500">Loading deficiencies...</Text>
                </View>
            );
        } else if (data.length === 0) {
            return (
                <View className="py-8 items-center justify-center">
                    <Text className="text-gray-500">No deficiencies found</Text>
                </View>
            );
        } else {
            return (
                <ScrollView className="max-h-[500px]">
                    {data.map((item) => (
                        <View
                            key={item.id}
                            className="flex-row items-center px-6 py-8 border-b border-gray-100"
                        >
                            <Text className="w-[100px] text-[14px] font-semibold text-gray-900 text-left">{item.severity}</Text>
                            <Text className="w-[100px] text-[14px] text-gray-600 text-left">{item.tag}</Text>
                            <Text className="w-[100px] text-[14px] text-gray-600 text-left">{item.date}</Text>
                            <View className='flex-1'>
                                <Text className="w-[400px] pl-4 text-[14px] text-gray-600 pr-4 text-left">{item.description}</Text>
                            </View>
                            <View className="w-[300px] flex-row gap-2 justify-end">
                                {item.hasStandardReport && (
                                    <TouchableOpacity
                                        className="border border-gray-200 items-center justify-center rounded-full py-3.5 px-5 hover:bg-dark-blue hover:border-dark-blue group transition-all duration-300 ease-in-out"
                                        onPress={() => handleReportClick(item.standardReportLink)}
                                    >
                                        <Text className="text-[14px] text-gray-500 group-hover:text-white transition-colors duration-300 ease-in-out">Standard Report</Text>
                                    </TouchableOpacity>
                                )}
                                {item.hasComplaintReport && (
                                    <TouchableOpacity
                                        className="border border-gray-200 items-center justify-center rounded-full py-3.5 px-5 hover:bg-dark-blue hover:border-dark-blue group transition-all duration-300 ease-in-out"
                                        onPress={() => handleReportClick(item.complaintReportLink)}
                                    >
                                        <Text className="text-[14px] text-gray-500 group-hover:text-white transition-colors duration-300 ease-in-out">Complaint Report</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    ))}
                </ScrollView>
            );
        }
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
                <View>
                    {renderTableContent()}
                </View>
            </View>
            {/* Pagination */}
            <View className="flex-row items-center justify-between mt-6 px-4">
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
            </View>
        </View>
    );
};

export default DashboardFacility; 