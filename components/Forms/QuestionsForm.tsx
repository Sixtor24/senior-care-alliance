import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import CareDropdown from "../ui/CareDropdown";
import ImagesPath from "@/assets/ImagesPath";


interface QuestionsFormData {
    organizationType?: string;
    dataUsage?: string;
    decisions?: string;
}

interface QuestionsFormProps {
    formData: QuestionsFormData; 
    onBack: () => void;
    onNext: (data: QuestionsFormData) => void;
}

const QuestionsForm: React.FC<QuestionsFormProps> = ({ formData, onBack, onNext }) => {
    
    const [organizationType, setOrganizationType] = useState(formData.organizationType ?? "");
    const [dataUsage, setDataUsage] = useState(formData.dataUsage ?? "");
    const [decisions, setDecisions] = useState(formData.decisions ?? "");

    
    const [errors, setErrors] = useState({
        dataUsage: false,
        organizationType: false,
        decisions: false,
    });

    
    const handleSubmit = () => {
        const newErrors = {
            dataUsage: !dataUsage,
            organizationType: !organizationType, 
            decisions: !decisions,
        };

        
        setErrors(newErrors);

        
        if (Object.values(newErrors).some((error) => error)) {
            return;
        }

        
        onNext({
            organizationType,
            dataUsage,
            decisions,
        });
    };

    
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

            
            <TextInput
                className={`border ${errors.dataUsage ? "border-red-500" : "border-gray-300"} rounded-lg p-3 w-full mb-4`}
                placeholder={errors.dataUsage ? "How would you like to use our data?*" : "How would you like to use our data?"}
                placeholderTextColor={errors.dataUsage ? "red" : "black"}
                value={dataUsage}
                onChangeText={(text) => {
                    setDataUsage(text);
                    setErrors((prevErrors) => ({ ...prevErrors, dataUsage: false })); 
                }}
            />

            
            <CareDropdown
                placeholder={errors.organizationType ? "What type of organization are you?*" : "What type of organization are you?"}
                items={organizationTypes}
                onSelect={(selectedValue) => {
                    setOrganizationType(selectedValue ?? "");
                    setErrors((prevErrors) => ({ ...prevErrors, organizationType: false })); 
                }}
                error={errors.organizationType} 
                />
            <View className="h-5" />

            
            <TextInput
                className={`border ${errors.decisions ? "border-red-500" : "border-gray-300"} p-3 rounded-lg w-full mb-6`}
                placeholder={errors.decisions ? "What decisions can this data better support for your organization?*" : "What decisions can this data better support for your organization?"}
                placeholderTextColor={errors.decisions ? "red" : "black"}
                multiline
                numberOfLines={7}
                value={decisions}
                onChangeText={(text) => {
                    setDecisions(text);
                    setErrors((prevErrors) => ({ ...prevErrors, decisions: false })); 
                }}
            />

            
            <View className="flex-row justify-end mt-6 space-x-4">
                
                <TouchableOpacity
                    className="px-8 py-4 bg-gray-color rounded-full"
                    onPress={onBack}
                >
                    <Text className="text-gray-700 text-lg-[14]">Back</Text>
                </TouchableOpacity>

                
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