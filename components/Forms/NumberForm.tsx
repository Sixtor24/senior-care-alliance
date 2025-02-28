import React, { useState } from "react";
import { View, Text, TextInput, Platform, ActivityIndicator, Modal, FlatList, Pressable } from "react-native";
import useFormStore from "../../store/formStore";

// Lista predefinida de países con sus códigos e imágenes de banderas
const COUNTRIES = [
    { code: 'US', name: 'United States', callingCode: '+1', flag: '🇺🇸' },
    { code: 'MX', name: 'Mexico', callingCode: '+52', flag: '🇲🇽' },
    { code: 'ES', name: 'Spain', callingCode: '+34', flag: '🇪🇸' },
    { code: 'AR', name: 'Argentina', callingCode: '+54', flag: '🇦🇷' },
    { code: 'CL', name: 'Chile', callingCode: '+56', flag: '🇨🇱' },
    { code: 'CO', name: 'Colombia', callingCode: '+57', flag: '🇨🇴' },
    { code: 'PE', name: 'Peru', callingCode: '+51', flag: '🇵🇪' },
    { code: 'VE', name: 'Venezuela', callingCode: '+58', flag: '🇻🇪' },
    { code: 'CR', name: 'Costa Rica', callingCode: '+506', flag: '🇨🇷' },
    { code: 'EC', name: 'Ecuador', callingCode: '+593', flag: '🇪🇨' },
    { code: 'DO', name: 'Dominican Republic', callingCode: '+1', flag: '🇩🇴' },
    { code: 'GT', name: 'Guatemala', callingCode: '+502', flag: '🇬🇹' },
    { code: 'CA', name: 'Canada', callingCode: '+1', flag: '🇨🇦' },
];

interface NumberFormProps {
    onBack: () => void;
    onNext: () => void;
    onError?: (message: string) => void;
}

const NumberForm: React.FC<NumberFormProps> = ({ onBack, onNext }) => {
    const { error, loading, setPhoneNumber, setError } = useFormStore();
    const [phoneNumber, setPhoneNumberLocal] = useState("");
    const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
    const [showCountryPicker, setShowCountryPicker] = useState(false);

    const handlePhoneChange = (text: string) => {
        // Solo permitir números y algunos caracteres especiales
        const cleanedText = text.replace(/[^\d\s+()-]/g, '');
        setPhoneNumberLocal(cleanedText);
        setError(null);
    };

    const handleCountrySelect = (country: typeof COUNTRIES[0]) => {
        setSelectedCountry(country);
        setShowCountryPicker(false);
    };

    const handleSubmit = async () => {
        if (!phoneNumber.trim()) {
            setError("Please enter your phone number");
            return;
        }

        try {
            // Formatear el número de teléfono con el código de país
            const formattedNumber = `${selectedCountry.callingCode}${phoneNumber.startsWith('0') ? phoneNumber.substring(1) : phoneNumber}`;

            // Validación básica del número
            if (phoneNumber.length < 5) {
                setError("Invalid phone number");
                return;
            }

            // Primero guardar el número en el store
            const success = await setPhoneNumber(formattedNumber);

            // Si la validación fue exitosa, proceder con la navegación
            if (success) {
                // Navegación inmediata sin esperar a la animación
                onNext();
            }
        } catch (error) {
            setError("Error validating phone number");
        }
    };

    return (
        <View
            className="w-[35vw]"
        >
            <View className="flex-row mb-3 items-center">
                <Text className="text-left text-[40px] text-white font-extralight ">
                    Enter your phone number
                </Text>
            </View>
            <Text className="text-left text-[16px] text-white font-light mb-1">
                Almost ready! Enter your mobile phone number below
            </Text>
            <View className="py-4" />
            <View className="flex-row items-center">
                <View className="items-center gap-3 border bg-[#105cb4] border-white/25 rounded-lg w-full overflow-hidden">
                    <View className="flex-row items-center w-full px-4 py-3">
                        <Pressable
                            onPress={() => setShowCountryPicker(true)}
                            className="mr-2 flex-row items-center bg-[#0d4a8f] px-2 py-1 rounded-md"
                        >
                            <Text className="mr-2 text-xl">{selectedCountry.flag}</Text>
                            <Text className="text-white mr-1">{selectedCountry.callingCode}</Text>
                            <Text className="text-white">▼</Text>
                        </Pressable>
                        <TextInput
                            className="text-white font-extralight bg-[#105cb4] flex-1"
                            placeholder={"Enter your phone number"}
                            multiline={false}
                            keyboardType="phone-pad"
                            textAlignVertical="top"
                            value={phoneNumber}
                            onChangeText={handlePhoneChange}
                            style={[Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)]}
                        />
                    </View>
                    {error ? (
                        <Text className="text-red-500 px-4 w-full text-left">{error}</Text>
                    ) : null}
                    <View className="flex-row justify-end p-3 w-full">
                        <Pressable
                            onPress={handleSubmit}
                            disabled={loading}
                            className="bg-white px-5 py-3 rounded-lg"
                            style={({ pressed }) => [
                                {
                                    opacity: pressed ? 0.8 : 1,
                                    backgroundColor: loading ? '#cccccc' : 'white',
                                },
                                Platform.OS === 'web' && {
                                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
                                }
                            ]}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#105cb4" />
                            ) : (
                                <Text className="text-sm font-semibold text-[#105cb4]">Continue</Text>
                            )}
                        </Pressable>
                    </View>
                </View>
            </View>
            <View className="py-2" />
            <Text className="text-left text-[15px] text-white font-light ">
                You must have a valid phone number to use Senior Care Alliance services. <Text className="underline" onPress={onBack}>Go back</Text>
            </Text>

            {/* Modal de selección de país */}
            <Modal
                visible={showCountryPicker}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowCountryPicker(false)}
            >
                <Pressable
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => setShowCountryPicker(false)}
                >
                    <View
                        className="w-[35vw] max-h-[70vh] bg-[#105cb4] rounded-lg p-4"
                        style={Platform.OS === 'web' ? { boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)' } : undefined}
                    >
                        <Text className="text-white text-xl mb-4">Select a country</Text>
                        <FlatList
                            data={COUNTRIES}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => (
                                <Pressable
                                    className="flex-row items-center py-3 border-b border-white/10"
                                    onPress={() => handleCountrySelect(item)}
                                    style={({ pressed }) => [
                                        {
                                            opacity: pressed ? 0.7 : 1,
                                            backgroundColor: pressed ? 'rgba(255,255,255,0.1)' : 'transparent'
                                        }
                                    ]}
                                >
                                    <Text className="text-2xl mr-3">{item.flag}</Text>
                                    <Text className="text-white flex-1">{item.name}</Text>
                                    <Text className="text-white">{item.callingCode}</Text>
                                </Pressable>
                            )}
                        />
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

export default NumberForm;