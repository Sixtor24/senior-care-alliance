import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform, ScrollView } from 'react-native';
import { AntDesign, FontAwesome6, Fontisto } from '@expo/vector-icons';
import SortIcon from '../ui/SortIcon';

// Types that would match your API response
interface Facility {
    id: string;
    facilityName: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
    };
    premium: {
        amount: number;
        currency: string;
    };
    riskLevel: 'Low' | 'Medium' | 'High';
    insightLink: string;
}

interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

// Mock data that mirrors API response
const MOCK_FACILITIES: Facility[] = [
    {
        id: '1',
        facilityName: 'Advent Health',
        address: {
            street: '600 Stewart Street',
            city: 'Seattle',
            state: 'WA',
            zipCode: '98101'
        },
        premium: {
            amount: 3000.00,
            currency: 'USD'
        },
        riskLevel: 'Low',
        insightLink: '/facility/1/insights'
    },
    {
        id: '2',
        facilityName: 'Advent Health',
        address: {
            street: '600 Stewart Street',
            city: 'Seattle',
            state: 'WA',
            zipCode: '98101'
        },
        premium: {
            amount: 3000.00,
            currency: 'USD'
        },
        riskLevel: 'Medium',
        insightLink: '/facility/2/insights'
    },
    {
        id: '3',
        facilityName: 'Advent Health',
        address: {
            street: '600 Stewart Street',
            city: 'Seattle',
            state: 'WA',
            zipCode: '98101'
        },
        premium: {
            amount: 3000.00,
            currency: 'USD'
        },
        riskLevel: 'High',
        insightLink: '/facility/3/insights'
    },
    {
        id: '4',
        facilityName: 'Advent Health',
        address: {
            street: '600 Stewart Street',
            city: 'Seattle',
            state: 'WA',
            zipCode: '98101'
        },
        premium: {
            amount: 3000.00,
            currency: 'USD'
        },
        riskLevel: 'Low',
        insightLink: '/facility/1/insights'
    },
    {
        id: '5',
        facilityName: 'Advent Health',
        address: {
            street: '600 Stewart Street',
            city: 'Seattle',
            state: 'WA',
            zipCode: '98101'
        },
        premium: {
            amount: 3000.00,
            currency: 'USD'
        },
        riskLevel: 'Medium',
        insightLink: '/facility/2/insights'
    },
    {
        id: '6',
        facilityName: 'Advent Health',
        address: {
            street: '600 Stewart Street',
            city: 'Seattle',
            state: 'WA',
            zipCode: '98101'
        },
        premium: {
            amount: 3000.00,
            currency: 'USD'
        },
        riskLevel: 'High',
        insightLink: '/facility/3/insights'
    },
    {
        id: '7',
        facilityName: 'Advent Health',
        address: {
            street: '600 Stewart Street',
            city: 'Seattle',
            state: 'WA',
            zipCode: '98101'
        },
        premium: {
            amount: 3000.00,
            currency: 'USD'
        },
        riskLevel: 'Low',
        insightLink: '/facility/1/insights'
    },
    {
        id: '8',
        facilityName: 'Advent Health',
        address: {
            street: '600 Stewart Street',
            city: 'Seattle',
            state: 'WA',
            zipCode: '98101'
        },
        premium: {
            amount: 3000.00,
            currency: 'USD'
        },
        riskLevel: 'Medium',
        insightLink: '/facility/2/insights'
    },
    {
        id: '9',
        facilityName: 'Advent Health',
        address: {
            street: '600 Stewart Street',
            city: 'Seattle',
            state: 'WA',
            zipCode: '98101'
        },
        premium: {
            amount: 3000.00,
            currency: 'USD'
        },
        riskLevel: 'High',
        insightLink: '/facility/3/insights'
    },
    
];

const MOCK_PAGINATION: PaginationInfo = {
    currentPage: 3,
    totalPages: 10,
    totalItems: 50,
    itemsPerPage: 5
};

// Add this type for sort state
type SortState = {
    field: 'facilityName' | 'address' | 'premium' | 'riskLevel' | null;
    direction: 'asc' | 'desc' | null;
};

const Portfolio = () => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [facilities, setFacilities] = React.useState<Facility[]>(MOCK_FACILITIES);
    const [pagination, setPagination] = React.useState<PaginationInfo>(MOCK_PAGINATION);
    const [sortState, setSortState] = React.useState<SortState>({
        field: null,
        direction: null
    });

    const getRiskLevelStyle = (level: Facility['riskLevel']) => {
        switch (level) {
            case 'Low':
                return 'bg-[#ECFDF3] text-[#027A48] border-[#027A48]';
            case 'Medium':
                return 'bg-[#FFFAEB] text-[#B54708] border-[#B54708]';
            case 'High':
                return 'bg-[#FEF3F2] text-[#B42318] border-[#B42318]';
            default:
                return '';
        }
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        // In the future, this will trigger an API call
    };

    const handleRemoveFacility = (facilityId: string) => {
        // In the future, this will make an API call
        setFacilities(facilities.filter(facility => facility.id !== facilityId));
    };

    const handlePageChange = (page: number) => {
        // In the future, this will trigger an API call
        setPagination({ ...pagination, currentPage: page });
    };

    const formatAddress = (address: Facility['address']) => {
        return `${address.street} ${address.city}, ${address.state}. ${address.zipCode}`;
    };

    const handleSort = (field: SortState['field']) => {
        setSortState(prevState => {
            let direction: SortState['direction'];
            
            if (prevState.field !== field) {
                direction = 'asc';
            } else {
                direction = prevState.direction === 'asc' ? 'desc' : 'asc';
            }
            
            return { field, direction };
        });
        // Later you'll add API call here
    };

    return (
        <View className="px-16 py-10 h-full">
            <View className="flex-row items-center justify-between mb-6">
                <Text className="text-[32px] font-extralight text-dark-blue">Portfolio</Text>
                
                <View className="flex-row items-center flex-1 max-w-[450px] ml-8">
                    <View className="flex-row items-center bg-white rounded-lg px-3 py-2 flex-1 mr-4 border border-gray-300">
                        <AntDesign name="search1" size={22} color="#C5C5C5" />
                        <TextInput
                            placeholder="Search for facility"
                            className="ml-2 flex-1 h-6 text-[14px] text-gray-900"
                            value={searchQuery}
                            onChangeText={handleSearch}
                            style={[Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)]}
                            placeholderTextColor="#667085"
                        />
                    </View>
                    <TouchableOpacity className="bg-dark-blue px-6 py-3.5 gap-1 rounded-full flex-row items-center">
                        <Text className="text-white text-[14px] font-medium">Add facilities</Text>
                        <FontAwesome6 name="angle-right" size={13} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <View className="bg-white rounded-3xl shadow-sm py-1 overflow-hidden flex-1 flex flex-col">
                <View className="flex-row border-b border-gray-200 px-6 p-4">
                    <TouchableOpacity 
                        className="flex-1 flex-row items-center"
                        onPress={() => handleSort('facilityName')}
                    >
                        <Text className="text-[14px] font-light text-dark-blue">Facility name</Text>
                        <SortIcon 
                            isSelected={sortState.field === 'facilityName'}
                            activeColor="#C5C5C5"
                            inactiveColor="#C5C5C5"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        className="flex-1 flex-row items-center"
                        onPress={() => handleSort('address')}
                    >
                        <Text className="text-[14px] font-light text-dark-blue">Address</Text>
                        <SortIcon 
                            isSelected={sortState.field === 'address'}
                            activeColor="#C5C5C5"
                            inactiveColor="#C5C5C5"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        className="flex-1 flex-row items-center"
                        onPress={() => handleSort('premium')}
                    >
                        <Text className="text-[14px] font-light text-dark-blue">Premium</Text>
                        <SortIcon 
                            isSelected={sortState.field === 'premium'}
                            activeColor="#C5C5C5"
                            inactiveColor="#C5C5C5"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        className="flex-1 flex-row items-center"
                        onPress={() => handleSort('riskLevel')}
                    >
                        <Text className="text-[14px] font-light text-dark-blue">Risk Level</Text>
                        <SortIcon 
                            isSelected={sortState.field === 'riskLevel'}
                            activeColor="#C5C5C5"
                            inactiveColor="#C5C5C5"
                        />
                    </TouchableOpacity>

                    <View className="w-24" />
                </View>

                <ScrollView 
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                >
                    {facilities.map((facility) => (
                        <View 
                            key={facility.id} 
                            className="flex-row items-center p-4 px-6 py-5 border-b border-gray-100"
                            >
                            <View className="flex-1">
                                <Text className="text-[14px] font-semibold text-gray-900">{facility.facilityName}</Text>
                            </View>
                            <View className="flex-1">
                                <Text className="text-[14px] text-gray-600 max-w-[150px]">{formatAddress(facility.address)}</Text>
                            </View>
                            <View className="flex-1 flex-row items-center">
                                <View className="flex-row items-center border border-gray-200 rounded-xl py-3.5 pl-4 bg-white w-[130px]">
                                    <View className="flex-row items-center">
                                        <Fontisto name="dollar" size={13} className='text-emerald-600' />
                                        <Text className="text-[14px] text-gray-900 ml-1">
                                            {facility.premium.amount.toFixed(2)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View className="flex-1">
                                <Text className={`px-6 py-3.5 rounded-full border w-fit ${getRiskLevelStyle(facility.riskLevel)}`}>
                                    {facility.riskLevel}
                                </Text>
                            </View>
                            <TouchableOpacity 
                                className="w-24 border border-gray-200 items-center justify-center rounded-full py-3.5 px-4 hover:bg-red-600 hover:border-red-600 group transition-all duration-300 ease-in-out"
                                onPress={() => handleRemoveFacility(facility.id)}
                            >
                                <Text className="text-[14px] text-gray-500 group-hover:text-white transition-colors duration-300 ease-in-out">Remove</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </View>

            <View className="flex-row items-center justify-between mt-6 px-4">
                <TouchableOpacity 
                    className="flex-row items-center gap-2"
                    onPress={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                >
                    <FontAwesome6 name="angle-left" size={13} className='text-gray-600' />
                    <Text className="text-[14px] font-light text-gray-600">Previous</Text>
                </TouchableOpacity>

                <View className="flex-row gap-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                        .filter(page => page === 1 || page === pagination.totalPages || 
                            (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1))
                        .map((page, index, array) => {
                            if (index > 0 && array[index - 1] !== page - 1) {
                                return [
                                    <Text key={`ellipsis-${page}`} className="text-[14px] mt-2 text-gray-600 px-2">...</Text>,
                                    <TouchableOpacity 
                                        key={page}
                                        className={`w-10 h-10 items-center justify-center rounded-lg ${
                                            pagination.currentPage === page ? 'bg-dark-blue' : ''
                                        }`}
                                        onPress={() => handlePageChange(page)}
                                    >
                                        <Text className={`text-[14px] mb-2 ${
                                            pagination.currentPage === page ? 'text-white' : 'text-gray-600'
                                        }`}>{page}</Text>
                                    </TouchableOpacity>
                                ];
                            }
                            return (
                                <TouchableOpacity 
                                    key={page}
                                    className={`w-8 h-8 items-center justify-center rounded-full ${
                                        pagination.currentPage === page ? 'bg-dark-blue' : ''
                                    }`}
                                    onPress={() => handlePageChange(page)}
                                >
                                    <Text className={`text-[14px] font-light ${
                                        pagination.currentPage === page ? 'text-white' : 'text-gray-600'
                                    }`}>{page}</Text>
                                </TouchableOpacity>
                            );
                        })}
                </View>

                <TouchableOpacity 
                    className="flex-row items-center gap-1 "
                    onPress={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                >
                    <Text className="text-[14px] font-light text-gray-600">Next</Text>
                    <FontAwesome6 name="angle-right" size={13} className='text-gray-600' />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Portfolio;
