import React from "react";
import { View, Text } from "react-native";

interface RegistrationStepsProps {
    number: string; 
    isActive: boolean; 
    label: string; 
}

const RegistrationSteps: React.FC<RegistrationStepsProps> = ({
    number,
    isActive,
    label,
}) => {
    return (
        <View className="items-center">
            <View
                className={`w-10 h-10 rounded-full items-center justify-center ${isActive ? "bg-white" : "bg-[#0E67C7]"
                    }`}
                style={{
                    borderWidth: 1,
                    borderColor: isActive ? "#FFFFFF" : "#ABD3FF",
                }}
            >
                <Text
                    className={`text-lg font-light ${isActive ? "text-[#0E67C7]" : "text-white"
                        }`}
                >
                    {number}
                </Text>
            </View>

            <View className="mt-2 w-16 items-center">
                <Text
                    className={`text-xs text-center ${isActive ? "text-white" : "text-text-blue"
                        }`}
                >
                    {label}
                </Text>
            </View>
        </View>
    );
};

export default RegistrationSteps;