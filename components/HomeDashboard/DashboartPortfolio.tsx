import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform, ScrollView } from 'react-native';
import { AntDesign, FontAwesome6, Fontisto } from '@expo/vector-icons';
import SortIcon from '../ui/SortIcon';
import { debounce } from 'lodash';
import Modal from 'react-native-modal';

// Types that would match your API response
interface Facility {
    ccn: string;
    facilityName: string;
    address: string;
    city: string;
    state: string;
    premium: number;
    riskScore: string;
}

interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
}

// Add this type for sort state
type SortState = {
    field: 'facilityName' | 'address' | 'premium' | 'riskLevel' | null;
    direction: 'asc' | 'desc' | null;
};

// Define MOCK_PAGINATION
const MOCK_PAGINATION: PaginationInfo = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
};

// Add new interface for available facilities
interface AvailableFacility {
    ccn: string;
    facilityName: string;
    address: string;
    city: string;
    state: string;
    premium?: number;  // Make premium optional
    riskScore: string;
}

const Portfolio = () => {
    const [favoriteSearchQuery, setFavoriteSearchQuery] = useState('');
    const [generalSearchQuery, setGeneralSearchQuery] = useState('');
    const [addFacilities, setAddFacilities] = useState<Facility[]>([]);
    const [allFacilities, setAllFacilities] = useState<Facility[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>(MOCK_PAGINATION);
    const [sortState, setSortState] = useState<SortState>({
        field: null,
        direction: null
    });
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [availableFacilities, setAvailableFacilities] = useState<AvailableFacility[]>([]);
    const [addingFacility, setAddingFacility] = useState(false);
    const [portfolioId, setPortfolioId] = useState<string | null>(null);
    const [anotherInputValue, setAnotherInputValue] = useState('');
    const [savingItems, setSavingItems] = useState<Set<string>>(new Set());
    const PORTFOLIO_ID = 'de0b6743-f1d0-4e79-9c3d-e91a9356d254';
    const [tableLoading, setTableLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [editingPremium, setEditingPremium] = useState<string | null>(null);
    const [premiumValue, setPremiumValue] = useState<string>('');

    const getRiskLevelStyle = (level: Facility['riskScore']) => {
        switch (level.toLowerCase()) {
            case 'low':
                return 'bg-[#ECFDF3] text-[#027A48] border-[#027A48]';
            case 'medium':
                return 'bg-[#FFFAEB] text-[#B54708] border-[#B54708]';
            case 'high':
                return 'bg-[#FEF3F2] text-[#B42318] border-[#B42318]';
            default:
                return '';
        }
    };

    const handleRemoveFacility = async (ccn: string) => {
        try {
            setTableLoading(true);
            const response = await fetch(
                `https://sca-api-535434239234.us-central1.run.app/portfolios/facilities/${ccn}`,
                {
                    method: 'DELETE',
                }
            );

            if (!response.ok) {
                throw new Error('Failed to remove facility');
            }

            await fetchFacilities();

        } catch (error) {
            console.error('Error removing facility:', error);
        } finally {
            setTableLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        // In the future, this will trigger an API call
        setPagination({ ...pagination, currentPage: page });
    };

    const formatAddress = (facility: Facility) => {
        return `${facility.address} ${facility.city}, ${facility.state}`;
    };

    const handleSort = (field: SortState['field']) => {
        setSortState(prevState => ({
            field,
            direction: prevState.field !== field ? 'asc' : 
                       prevState.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const fetchFacilities = async () => {
        try {
            console.log()
            setTableLoading(true);
            const response = await fetch(
                `https://sca-api-535434239234.us-central1.run.app/portfolios/facilities`
            );
            const data = await response.json();
            
            if (Array.isArray(data)) {
                const transformedData = data.map((facility: any) => ({
                    ccn: facility.ccn,
                    facilityName: facility.facility_name,
                    address: facility.address,
                    city: facility.city,
                    state: facility.state,
                    premium: facility.premium || 0,
                    riskScore: facility.risk_score
                }));
                
                setAllFacilities(transformedData);
            } else {
                console.error('Unexpected data format:', data);
                setAllFacilities([]);
            }
        } catch (error) {
            console.error('Error fetching facilities:', error);
            setAllFacilities([]);
        } finally {
            setTableLoading(false);
        }
    };

    const searchFacilities = async (text: string, isFavoriteSearch: boolean) => {
        if (!text.trim()) {
            if (isFavoriteSearch) {
                fetchFacilities(); // Fetch all saved facilities
            } else {
                setAvailableFacilities([]); // Clear modal table
            }
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(
                `https://sca-api-535434239234.us-central1.run.app/portfolios/facilities/search?${isFavoriteSearch ? `portfolio_id=${PORTFOLIO_ID}&` : ''}search_term=${encodeURIComponent(text)}&limit=10&offset=0`
            );

            if (!response.ok) {
                throw new Error('Search request failed');
            }

            const data = await response.json();
            
            if (Array.isArray(data)) {
                const transformedData = data.map((facility: any) => ({
                    ccn: facility.ccn,
                    facilityName: facility.facility_name,
                    address: facility.address,
                    city: facility.city,
                    state: facility.state,
                    premium: facility.premium || 0,
                    riskScore: facility.risk_score
                }));
                
                // Solo actualiza availableFacilities para la búsqueda en el modal
                setAvailableFacilities(transformedData); // Update available facilities for modal
            }
        } catch (error) {
            console.error('Error searching facilities:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePremiumUpdate = async (ccn: string, amount: string) => {
        try {
            // Validar que el monto sea un número válido
            const premiumAmount = parseFloat(amount);
            if (isNaN(premiumAmount) || premiumAmount < 0) {
                console.error('Invalid premium amount:', amount);
                return;
            }

            // Convertir a entero ya que la API espera un integer
            const formattedPremium = Math.round(premiumAmount);
            
            console.log('Starting premium update:', { ccn, amount, formattedPremium });
            setTableLoading(true);
            
            const response = await fetch(
                `https://sca-api-535434239234.us-central1.run.app/portfolios/facilities/${ccn}/premium?premium=${formattedPremium}`,
                {
                    method: 'PUT',
                    headers: {
                        'accept': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error('API Error Response:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorData
                });
                throw new Error(`Failed to update premium: ${JSON.stringify(errorData)}`);
            }

            console.log('Premium updated successfully, refreshing table...');
            await fetchFacilities();
            console.log('Table refresh completed');
            setEditingPremium(null);
            setPremiumValue('');

        } catch (error) {
            console.error('Error updating premium:', error);
        } finally {
            setTableLoading(false);
        }
    };

    const searchFavoriteFacilities = async (text: string) => {
        try {
            setTableLoading(true);
            
            if (!text.trim()) {
                // Si no hay texto, volver a cargar todas las facilities del portfolio
                await fetchFacilities();
                return;
            }

            const response = await fetch(
                `https://sca-api-535434239234.us-central1.run.app/portfolios/facilities/search?portfolio_id=${PORTFOLIO_ID}&search_term=${encodeURIComponent(text)}`
            );

            if (!response.ok) {
                throw new Error('Search request failed');
            }

            const data = await response.json();
            
            if (Array.isArray(data)) {
                const transformedData = data.map((facility: any) => ({
                    ccn: facility.ccn,
                    facilityName: facility.facility_name,
                    address: facility.address,
                    city: facility.city,
                    state: facility.state,
                    premium: facility.premium || 0,
                    riskScore: facility.risk_score
                }));
                
                setAllFacilities(transformedData); // Actualizar la tabla principal
            }
        } catch (error) {
            console.error('Error searching facilities:', error);
        } finally {
            setTableLoading(false);
        }
    };

    const handleAddFacilitySearchInput = debounce((text: string) => {
        setFavoriteSearchQuery(text);
        searchFavoriteFacilities(text);
    },); // 300ms debounce delay

    const handleGeneralSearchInput = debounce((text: string) => {
        setGeneralSearchQuery(text);
        searchFacilities(text, false);
    }, ); // 300ms debounce delay

    // Efecto para cargar facilities solo al inicio
    useEffect(() => {
        fetchFacilities();
    }, []);

    const handleAddFacility = async (ccn: string) => {
        try {
            setModalLoading(true);
            setSavingItems(prev => new Set(prev).add(ccn));

            const response = await fetch(
                `https://sca-api-535434239234.us-central1.run.app/portfolios/facilities/${ccn}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to add facility');
            }

            // Primero cerramos el modal
            setModalVisible(false);
            // Limpiamos los estados del modal
            setGeneralSearchQuery('');
            setAvailableFacilities([]);
            
            // Después actualizamos la tabla
            await fetchFacilities();

        } catch (error) {
            console.error('Error adding facility:', error);
        } finally {
            setModalLoading(false);
            setSavingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(ccn);
                return newSet;
            });
        }
    };

    return (
        <View className="px-16 py-10 h-full">
            <View className="flex-row items-center justify-between mb-6">
                <Text className="text-[32px] font-extralight text-dark-blue">Portfolio</Text>
                
                <View className="flex-row items-center flex-1 max-w-[450px] ml-8">
                    <View className="flex-row items-center bg-white rounded-lg px-3 py-2 flex-1 mr-4 border border-gray-300">
                        <AntDesign name="search1" size={22} color="#C5C5C5" />
                        <TextInput
                            placeholder="Search in favorites"
                            className="ml-2 flex-1 h-6 text-[14px] text-gray-900"
                            value={favoriteSearchQuery}
                            onChangeText={handleAddFacilitySearchInput}
                            style={[Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)]}
                            placeholderTextColor="#667085"
                        />
                    </View>
                    <TouchableOpacity 
                        className="bg-dark-blue px-6 py-3.5 gap-1 rounded-full flex-row items-center"
                        onPress={() => setModalVisible(true)}
                    >
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
                    {tableLoading ? (
                        <View className="p-4 px-6">
                            <Text>Loading...</Text>
                        </View>
                    ) : allFacilities.map((facility) => (
                        <View 
                            key={facility.ccn} 
                            className="flex-row items-center p-4 px-6 py-5 border-b border-gray-100"
                        >
                            <View className="flex-1">
                                <View className='max-w-[150px]'>
                                <Text className="text-[14px] font-semibold text-gray-900">{facility.facilityName}</Text>
                                </View>
                            </View>
                            <View className="flex-1">
                                <Text className="text-[14px] text-gray-600 max-w-[150px]">{formatAddress(facility)}</Text>
                            </View>
                            <View className="flex-1 flex-row items-center">
                                {editingPremium === facility.ccn ? (
                                    <View className="flex-row items-center">
                                        <View className="flex-row items-center border border-gray-200 rounded-xl py-3.5 pl-4 bg-white w-[130px]">
                                            <Fontisto name="dollar" size={13} className='text-emerald-600' />
                                            <TextInput
                                                value={premiumValue}
                                                onChangeText={(text) => {
                                                    // Solo permitir números y un punto decimal
                                                    const filtered = text.replace(/[^0-9.]/g, '');
                                                    // Evitar múltiples puntos decimales
                                                    if (filtered.split('.').length <= 2) {
                                                        setPremiumValue(filtered);
                                                    }
                                                }}
                                                onBlur={() => {
                                                    if (!premiumValue) {
                                                        setEditingPremium(null);
                                                        setPremiumValue(facility.premium.toString());
                                                    }
                                                }}
                                                keyboardType="numeric"
                                                className="ml-1 flex-1 text-[14px] text-gray-900"
                                                autoFocus
                                                style={[Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)]}
                                            />
                                        </View>
                                        <TouchableOpacity 
                                            className={`ml-2 p-2 rounded-full ${
                                                !premiumValue || isNaN(parseFloat(premiumValue)) 
                                                ? 'bg-gray-300' 
                                                : 'bg-emerald-600'
                                            }`}
                                            onPress={() => {
                                                if (premiumValue && !isNaN(parseFloat(premiumValue))) {
                                                    console.log('Guardando premium:', {
                                                        ccn: facility.ccn,
                                                        premium: premiumValue
                                                    });
                                                    handlePremiumUpdate(facility.ccn, premiumValue);
                                                }
                                            }}
                                            disabled={!premiumValue || isNaN(parseFloat(premiumValue))}
                                        >
                                            <AntDesign name="check" size={16} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <TouchableOpacity 
                                        onPress={() => {
                                            setEditingPremium(facility.ccn);
                                            setPremiumValue(facility.premium.toString());
                                        }}
                                        className="flex-row items-center border border-gray-200 rounded-xl py-3.5 pl-4 bg-white w-[130px]"
                                    >
                                        <View className="flex-row items-center">
                                            <Fontisto name="dollar" size={13} className='text-emerald-600' />
                                            <Text className="text-[14px] text-gray-900 ml-1">
                                                {facility.premium.toFixed(2)}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            </View>
                            <View className="flex-1">
                                <Text className={`px-6 py-3.5 rounded-full border w-fit ${getRiskLevelStyle(facility.riskScore)}`}>
                                    {facility.riskScore}
                                </Text>
                            </View>
                            <TouchableOpacity 
                                className="w-24 border border-gray-200 items-center justify-center rounded-full py-3.5 px-4 hover:bg-red-600 hover:border-red-600 group transition-all duration-300 ease-in-out"
                                onPress={() => handleRemoveFacility(facility.ccn)}
                            >
                                <Text className="text-[14px] text-gray-500 group-hover:text-white transition-colors duration-300 ease-in-out">Remove</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </View>

            {addFacilities.length > 10 && (
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
                        className="flex-row items-center gap-1"
                        onPress={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                    >
                        <Text className="text-[14px] font-light text-gray-600">Next</Text>
                        <FontAwesome6 name="angle-right" size={13} className='text-gray-600' />
                    </TouchableOpacity>
                </View>
            )}

            <Modal
                isVisible={isModalVisible}
                onBackdropPress={() => {
                    setModalVisible(false);
                    fetchFacilities();
                }}
                className="m-0"
            >
                <View className="bg-white rounded-3xl p-6 mx-auto w-[600px]">

                    <View className="flex-row items-center justify-between mb-6">
                        <Text className="text-2xl font-light text-dark-blue">Add Facilities</Text>
                        
                        <View className="flex-row items-center flex-1 max-w-[450px] ml-8">
                            <View className="flex-row items-center bg-white rounded-lg px-3 py-2 flex-1 mr-4 border border-gray-300">
                                <AntDesign name="search1" size={22} color="#C5C5C5" />
                                <TextInput
                                    placeholder="Search all facilities"
                                    className="ml-2 flex-1 h-6 text-[14px] text-gray-900"
                                    value={generalSearchQuery}
                                    onChangeText={handleGeneralSearchInput}
                                    style={[Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)]}
                                    placeholderTextColor="#667085"
                                />
                            </View>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <AntDesign name="close" size={24} color="#667085" />
                        </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView className="max-h-[400px] mt-4">
                        {availableFacilities.map((facility) => (
                            <View 
                                key={facility.ccn}
                                className="flex-row items-center justify-between p-4 border-b border-gray-100"
                            >
                                <View>
                                    <Text className="text-[14px] font-semibold text-gray-900">
                                        {facility.facilityName}
                                    </Text>
                                    <Text className="text-[14px] text-gray-600">
                                        {`${facility.address} ${facility.city}, ${facility.state}`}
                                    </Text>
                                    <View className="flex-row items-center mt-2">
                                        <Text className={`px-3 py-1 rounded-full border w-fit ${getRiskLevelStyle(facility.riskScore)}`}>
                                            {facility.riskScore}
                                        </Text>
                                    </View>
                                </View>
                                <TouchableOpacity 
                                    className="bg-dark-blue px-4 py-2 rounded-full"
                                    onPress={() => handleAddFacility(facility.ccn)}
                                    disabled={savingItems.has(facility.ccn)}
                                >
                                    <Text className="text-white text-[14px]">
                                        {savingItems.has(facility.ccn) ? 'Adding...' : 'Add'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
};

export default Portfolio;
