import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import CareDropdown from "../ui/CareDropdown";
import ImagesPath from "@/assets/ImagesPath";

// Tipo específico para QuestionsForm
interface QuestionsFormData {
    organizationType?: string;
    dataUsage?: string;
    decisions?: string;
}

interface QuestionsFormProps {
    formData: QuestionsFormData; // Usar el tipo específico
    onBack: () => void;
    onNext: (data: QuestionsFormData) => void;
}

const QuestionsForm: React.FC<QuestionsFormProps> = ({ formData, onBack, onNext }) => {
    // Estados para los campos del formulario
    const [organizationType, setOrganizationType] = useState(formData.organizationType || "");
    const [dataUsage, setDataUsage] = useState(formData.dataUsage || "");
    const [decisions, setDecisions] = useState(formData.decisions || "");

    // Estado para manejar errores
    const [errors, setErrors] = useState({
        dataUsage: false,
        organizationType: false,
        decisions: false,
    });

    // Validar campos antes de continuar
    const handleSubmit = () => {
        const newErrors = {
            dataUsage: !dataUsage,
            organizationType: !organizationType, // Marcar error si no hay selección
            decisions: !decisions,
        };

        // Actualizar el estado de errores
        setErrors(newErrors);

        // Si hay algún error, no avanzamos al siguiente paso
        if (Object.values(newErrors).some((error) => error)) {
            return;
        }

        // Si no hay errores, avanzamos al siguiente paso
        onNext({
            organizationType,
            dataUsage,
            decisions,
        });
    };

    // Datos para el dropdown
    const organizationTypes = [
        { label: "Agency", value: "Agency" },
        { label: "Insurer", value: "Insurer" },
        { label: "Broker", value: "Broker" },
        { label: "Clinical", value: "Clinical" },
        { label: "Consulting", value: "Consulting" },
    ];

    return (
        <View className="bg-white px-10 py-6 rounded-2xl drop-shadow-md w-full max-w-xl">
            <Text className="text-center text-[40px] text-black font-extralight pb-5">Following Questions</Text>

            {/* Pregunta 1 */}
            <TextInput
                className={`border ${errors.dataUsage ? "border-red-500" : "border-gray-300"} rounded-lg p-3 w-full mb-4`}
                placeholder={errors.dataUsage ? "How would you like to use our data?*" : "How would you like to use our data?"}
                placeholderTextColor={errors.dataUsage ? "red" : "black"}
                value={dataUsage}
                onChangeText={(text) => {
                    setDataUsage(text);
                    setErrors((prevErrors) => ({ ...prevErrors, dataUsage: false })); // Limpiar error al escribir
                }}
            />

            {/* Pregunta 2 - Dropdown */}
            <CareDropdown
                placeholder={errors.organizationType ? "What type of organization are you?*" : "What type of organization are you?"}
                items={organizationTypes}
                onSelect={(selectedValue) => {
                    setOrganizationType(selectedValue ?? "");
                    setErrors((prevErrors) => ({ ...prevErrors, organizationType: false })); // Limpiar error al seleccionar
                }}
                error={errors.organizationType} // Pasa el estado de error al dropdown
                />
            <View className="h-5" />

            {/* Pregunta 3 */}
            <TextInput
                className={`border ${errors.decisions ? "border-red-500" : "border-gray-300"} p-3 rounded-lg w-full mb-6`}
                placeholder={errors.decisions ? "What decisions can this data better support for your organization?*" : "What decisions can this data better support for your organization?"}
                placeholderTextColor={errors.decisions ? "red" : "black"}
                multiline
                numberOfLines={7}
                value={decisions}
                onChangeText={(text) => {
                    setDecisions(text);
                    setErrors((prevErrors) => ({ ...prevErrors, decisions: false })); // Limpiar error al escribir
                }}
            />

            {/* Botones */}
            <View className="flex-row justify-end mt-6 space-x-4">
                {/* Botón "Back" */}
                <TouchableOpacity
                    className="px-8 py-4 bg-gray-color rounded-full"
                    onPress={onBack}
                >
                    <Text className="text-gray-700 text-lg-[14]">Back</Text>
                </TouchableOpacity>

                {/* Botón "Continue" */}
                <TouchableOpacity
                    className="px-6 py-4 rounded-full flex-row bg-blue-background space-x-2 items-center"
                    onPress={handleSubmit}
                >
                    <Text className="text-white text-lg-[14]">Continue</Text>
                    <Image
                        source={ImagesPath.RIGHT_ARROW}
                        className="w-5 h-5"
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default QuestionsForm;