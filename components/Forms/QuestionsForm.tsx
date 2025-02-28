import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Platform } from "react-native";
import useFormStore from "../../store/formStore";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";

interface QuestionsFormProps {
    onBack: () => void;
    onNext: () => void;
    onError?: (message: string) => void;
}

const QuestionsForm: React.FC<QuestionsFormProps> = ({ onBack, onNext }) => {
    const { email, updateFormData } = useFormStore();
    const [step, setStep] = useState(1);
    const [previousStep, setPreviousStep] = useState(0);
    const [name, setName] = useState("");
    const [organization, setOrganization] = useState("");
    const [orgType, setOrgType] = useState("");
    const [role, setRole] = useState("");
    const [additionalInfo, setAdditionalInfo] = useState("");
    const [additionalInfo2, setAdditionalInfo2] = useState("");
    const [isAnimating, setIsAnimating] = useState(false);
    
    const handleNext = () => {
        if (isAnimating) return;
        
        if (step < 6) {
            setIsAnimating(true);
            setPreviousStep(step);
            // Use requestAnimationFrame for better timing with animations
            requestAnimationFrame(() => {
                setTimeout(() => {
                    setStep(step + 1);
                    setIsAnimating(false);
                }, 300); // Match this with your exiting animation duration
            });
        } else {
            // Save the collected data before proceeding
            updateFormData({
                name,
                organization,
                orgType,
                role,
                additionalInfo,
                additionalInfo2
            });
            onNext(); // This will now take the user to organizationLinkForm
        }
    };

    const handleBack = () => {
        if (isAnimating) return;
        
        if (step > 1) {
            setIsAnimating(true);
            setPreviousStep(step);
            // Use requestAnimationFrame for better timing with animations
            requestAnimationFrame(() => {
                setTimeout(() => {
                    setStep(step - 1);
                    setIsAnimating(false);
                }, 300); // Match this with your exiting animation duration
            });
        } else {
            onBack();
        }
    };

    const renderForm = () => {
        switch (step) {
            case 1:
                return (
                    <Animated.View 
                        key="step1"
                        entering={FadeInDown.duration(500).delay(100)} 
                        exiting={FadeOut.duration(300)}
                        className="w-full"
                    >
                        <View className="flex-row mb-3 items-center">
                            <Text className="text-left text-[40px] text-white font-extralight">
                                You're all set!
                            </Text>
                        </View>
                        <Text className="text-left text-[16px] text-white font-light mb-4">
                                Now, let's get to know you better. What's your name?
                        </Text>
                        <View className="py-2" />
                        <View className="flex-row items-center">
                            <View className="items-center gap-3 border bg-[#105cb4] border-white/25 rounded-lg w-full overflow-hidden">
                                <TextInput
                                    className="text-white font-extralight bg-[#105cb4] px-4 py-3 w-full flex-1"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChangeText={(text) => {
                                        setName(text);
                                    }}
                                    style={[Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)]}
                                />
                                <View className="flex-row justify-end p-3 w-full">
                                    <TouchableOpacity
                                        className="bg-white px-5 text-sm font-semibold text-dark-blue py-3 rounded-lg"
                                        onPress={handleNext}
                                        disabled={!name.trim()}
                                    >
                                        <Text className="text-dark-blue font-semibold">Next</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Animated.View>
                );
            
            case 2:
                return (
                    <Animated.View 
                        key="step2"
                        entering={FadeInDown.duration(500).delay(100)} 
                        exiting={FadeOut.duration(300)}
                        className="w-full"
                    >
                        <View className="flex-row mb-3 items-center">
                            <Text className="text-left text-[40px] text-white font-extralight">
                                Lovely to meet you {name}
                            </Text>
                        </View>
                        <Text className="text-left text-[16px] text-white font-light mb-4">
                                What's your organization's name?
                        </Text>
                        <View className="py-2" />
                        <View className="flex-row items-center">
                            <View className="items-center gap-3 border bg-[#105cb4] border-white/25 rounded-lg w-full overflow-hidden">
                                <TextInput
                                    className="text-white font-extralight bg-[#105cb4] px-4 py-3 w-full flex-1"
                                    placeholder="Enter organization name"
                                    value={organization}
                                    onChangeText={setOrganization}
                                    style={[Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)]}
                                />
                                <View className="flex-row justify-end p-3 w-full">
                                    <TouchableOpacity
                                        className="bg-white px-5 text-sm font-semibold text-dark-blue py-3 rounded-lg"
                                        onPress={handleNext}
                                        disabled={!organization.trim()}
                                    >
                                        <Text className="text-dark-blue font-semibold">Next</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Animated.View>
                );
                
            case 3:
                return (
                    <Animated.View 
                        key="step3"
                        entering={FadeInDown.duration(500).delay(100)} 
                        exiting={FadeOut.duration(300)}
                        className="w-full"
                    >
                        <View className="flex-row mb-3 items-center">
                            <Text className="text-left text-[40px] text-white font-extralight">
                                Perfect!
                            </Text>
                        </View>
                        <Text className="text-left text-[16px] text-white font-light mb-4">
                                Help us get to know you! What type of organization are you?
                        </Text>
                        <View className="py-2" />
                        <View className="flex-row flex-wrap gap-3 w-full justify-between">
                            {["Agency", "Carrier", "Broker", "Clinical Consulting"].map((type, index) => (
                                <TouchableOpacity 
                                    key={type}
                                    className={`border bg-[#105cb4] border-white/25 rounded-full px-5 py-3 ${index === 3 ? 'flex-2 w-42' : 'flex-1 w-16'} items-center`}
                                    onPress={() => {
                                        setOrgType(type);
                                        handleNext();
                                    }}
                                >
                                    <Text className={`font-medium ${orgType === type ? 'text-dark-blue' : 'text-white'}`}>
                                        {type}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Animated.View>
                );
                
            case 4:
                return (
                    <Animated.View 
                        key="step4"
                        entering={FadeInDown.duration(500).delay(100)} 
                        exiting={FadeOut.duration(300)}
                        className="w-full"
                    >
                        <View className="flex-row mb-3 items-center">
                            <Text className="text-left text-[40px] text-white font-extralight">
                                Thank you!
                            </Text>
                        </View>
                        <Text className="text-left text-[16px] text-white font-light mb-4">
                                What's your role in the organization? Select an option below!
                        </Text>
                        <View className="py-2" />
                        <View className="flex-row flex-wrap gap-2 w-full justify-between">
                            {["C-Level", "Underwriter", "Risk Mitigation", "Agent", "Insurance Carrier"].map((roleOption, index) => (
                                <TouchableOpacity 
                                    key={roleOption}
                                    className={`border bg-[#105cb4] border-white/25 rounded-full px-5 py-3 items-center`}
                                    onPress={() => {
                                        setRole(roleOption);
                                        handleNext();
                                    }}
                                >
                                    <Text className={`font-medium ${role === roleOption ? 'text-dark-blue' : 'text-white'}`}>
                                        {roleOption}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Animated.View>
                );
                
            case 5:
                return (
                    <Animated.View 
                        key="step5"
                        entering={FadeInDown.duration(500).delay(100)} 
                        exiting={FadeOut.duration(300)}
                        className="w-full"
                    >
                        <View className="flex-row mb-3 items-center">
                            <Text className="text-left text-[40px] text-white font-extralight">
                                Following questions
                            </Text>
                        </View>
                        <Text className="text-left text-[16px] text-white font-light mb-4">
                                It will be quick, I promise.
                        </Text>
                        <View className="py-2" />
                        <View className="flex-row items-center">
                            <View className="items-center gap-3 border bg-[#105cb4] border-white/25 rounded-lg w-full overflow-hidden">
                                <TextInput
                                    className="text-white font-extralight bg-[#105cb4] px-4 py-3 w-full flex-1"
                                    placeholder="How would you like to use our data?"
                                    multiline={true}
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                    value={additionalInfo}
                                    onChangeText={setAdditionalInfo}
                                    style={[Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)]}
                                />
                                <View className="flex-row justify-end p-3 w-full">
                                    <TouchableOpacity
                                        className="bg-white  px-5 text-sm font-semibold text-dark-blue py-3 rounded-lg"
                                        onPress={handleNext}
                                    >
                                        <Text className="text-dark-blue font-semibold">Next</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Animated.View>
                );
                
            case 6:
                return (
                    <Animated.View 
                        key="step6"
                        entering={FadeInDown.duration(500).delay(100)} 
                        exiting={FadeOut.duration(300)}
                        className="w-full"
                    >
                        <View className="flex-row mb-3 items-center">
                            <Text className="text-left text-[40px] text-white font-extralight">
                                Following questions
                            </Text>
                        </View>
                        <Text className="text-left text-[16px] text-white font-light mb-4">
                                It will be quick, I promise.
                        </Text>
                        <View className="py-2" />
                        <View className="flex-row items-center">
                            <View className="items-center gap-3 border bg-[#105cb4] border-white/25 rounded-lg w-full overflow-hidden">
                                <TextInput
                                    className="text-white font-extralight bg-[#105cb4] px-4 py-3 w-full flex-1"
                                    placeholder="What decisions can this data better support for your organization?"
                                    multiline={true}
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                    value={additionalInfo2}
                                    onChangeText={setAdditionalInfo2}
                                    style={[Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)]}
                                />
                                <View className="flex-row justify-end p-3 w-full">
                                    <TouchableOpacity
                                        className="bg-white  px-5 text-sm font-semibold text-dark-blue py-3 rounded-lg"
                                        onPress={handleNext}
                                    >
                                        <Text className="text-dark-blue font-semibold">Next</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Animated.View>
                );
                
            default:
                return null;
        }
    };

    return (
        <View className="w-[35vw]">
            {renderForm()}
        </View>
    );
};

export default QuestionsForm;