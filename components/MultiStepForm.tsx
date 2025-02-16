import React, { useState } from "react";
import { Text, View } from "react-native";
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from "react-native-reanimated";
import RegistrationForm from "./Forms/RegistrationForm";
import PasswordForm from "./Forms/PasswordForm";
import QuestionsForm from "./Forms/QuestionsForm";

interface MultiStepFormProps {
    onStepChange: (newStep: number) => void;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({ onStepChange }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        organizationName: "",
        password: "",
        organizationType: "", 
        dataUsage: "",         
        decisions: "",         
    });

    
    const opacity = useSharedValue(0);

   
    const fadeIn = () => {
        opacity.value = withTiming(1, { duration: 300 });
    };

    
    const fadeOut = () => {
        opacity.value = withTiming(0, { duration: 300 });
    };

    const handleNextStep = (data: any) => {
        fadeOut(); 
        setTimeout(() => {
            setFormData((prevData) => ({ ...prevData, ...data }));
            const newStep = step + 1;
            setStep(newStep);
            onStepChange(newStep); 
            fadeIn(); 
        }, 300); 
    };

    const handlePreviousStep = () => {
        fadeOut(); 
        setTimeout(() => {
            const newStep = step - 1;
            setStep(newStep);
            onStepChange(newStep); 
            fadeIn(); 
        }, 300); 
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    React.useEffect(() => {
        fadeIn();
    }, []);

    return (
        <View>
            <Animated.View style={[{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 16 }, animatedStyle]}>
                {step === 1 && (
                    <RegistrationForm
                        onNext={handleNextStep}
                        formData={formData}
                    />
                )}
                {step === 2 && (
                    <PasswordForm
                        formData={formData}
                        onBack={handlePreviousStep}
                        onNext={handleNextStep}
                    />
                )}
                {step === 3 && (
                    <QuestionsForm
                        formData={{
                            organizationType: formData.organizationType,
                            dataUsage: formData.dataUsage,
                            decisions: formData.decisions,
                        }}
                        onBack={handlePreviousStep}
                        onNext={handleNextStep}
                    />
                )}
            </Animated.View>
            <View className="items-center mt-3">
                <Text className="text-gray-500">© 2025 Senior Care Alliance</Text>
            </View>
        </View>
    );
};

export default MultiStepForm;