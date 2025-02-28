import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Platform, ActivityIndicator, Alert } from "react-native";
import useFormStore from "../../store/formStore";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";

interface QuestionsFormProps {
    onBack: () => void;
    onNext: () => void;
    onError?: (message: string) => void;
}

const QuestionsForm: React.FC<QuestionsFormProps> = ({ onBack, onNext, onError }) => {
    const { email, phoneNumber, updateFormData } = useFormStore();
    const [step, setStep] = useState(1);
    const [previousStep, setPreviousStep] = useState(0);
    const [name, setName] = useState("");
    const [organization, setOrganization] = useState("");
    const [orgType, setOrgType] = useState("");
    const [role, setRole] = useState("");
    const [additionalInfo, setAdditionalInfo] = useState("");
    const [additionalInfo2, setAdditionalInfo2] = useState("");
    const [isAnimating, setIsAnimating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    const MAX_RETRIES = 3;
    
    // Function to validate data with API for each step
    const validateWithAPI = async (step: number, data: any) => {
        try {
            console.log(`Validating step ${step} data with API:`, data);
            
            // Here we would normally call the validation API endpoint
            // For now, we'll simulate API validation with a delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            return true; // Validation success
        } catch (error) {
            console.error(`API validation error for step ${step}:`, error);
            throw error;
        }
    };
    
    const validateWithSelectedType = async (selectedType: string) => {
        setIsLoading(true);
        setApiError(null);
        
        try {
            // Validación específica para el tipo de organización
            if (!selectedType) {
                throw new Error("Please select your organization type");
            }
            
            console.log("Validating organization type:", selectedType);
            
            // API validation for organization type
            await validateWithAPI(3, { type: selectedType });
            
            // Continue to next step after validation
            handleNextAfterValidation();
        } catch (error: any) {
            console.error("Validation error:", error);
            setApiError(error.message || "An error occurred during validation");
            
            if (onError && typeof onError === "function") {
                onError(error.message || "An error occurred");
            } else {
                // Fallback error display if onError prop isn't provided
                Alert.alert("Error", error.message || "An error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const validateWithSelectedRole = async (selectedRole: string) => {
        setIsLoading(true);
        setApiError(null);
        
        try {
            // Validación específica para el rol en la organización
            if (!selectedRole) {
                throw new Error("Please select your role");
            }
            
            console.log("Validating role:", selectedRole);
            
            // API validation for organization role
            await validateWithAPI(4, { organization_role: selectedRole });
            
            // Continue to next step after validation
            handleNextAfterValidation();
        } catch (error: any) {
            console.error("Validation error:", error);
            setApiError(error.message || "An error occurred during validation");
            
            if (onError && typeof onError === "function") {
                onError(error.message || "An error occurred");
            } else {
                // Fallback error display if onError prop isn't provided
                Alert.alert("Error", error.message || "An error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const validateStep = async () => {
        setIsLoading(true);
        setApiError(null);
        
        try {
            // Different validation for each step (case)
            if (step === 1) {
                // Case 1: Validate firstname
                if (!name.trim()) {
                    throw new Error("Please enter your name");
                }
                
                console.log("Case 1: Validating firstname:", name);
                
                // API validation for firstname
                const [firstName, lastName] = name.split(' ');
                await validateWithAPI(1, { 
                    firstname: firstName || name,
                    lastname: lastName || ""
                });
            } else if (step === 2) {
                // Case 2: Validate organization_name
                if (!organization.trim()) {
                    throw new Error("Please enter your organization name");
                }
                
                console.log("Case 2: Validating organization name:", organization);
                
                // API validation for organization name
                await validateWithAPI(2, { organization_name: organization });
            } else if (step === 3) {
                // Case 3: Validate type (one of 4 options)
                if (!orgType) {
                    throw new Error("Please select your organization type");
                }
                
                console.log("Case 3: Validating organization type:", orgType);
                
                // API validation for organization type
                await validateWithAPI(3, { type: orgType });
            } else if (step === 4) {
                // Case 4: Para el paso 4, ahora utilizamos la función validateWithSelectedRole directamente desde los botones
                // Esta condición no se ejecutará normalmente, pero la dejamos por precaución
                if (!role) {
                    throw new Error("Please select your role");
                }
                
                console.log("Case 4: Already handled by button selection");
                return;
            } else if (step === 5) {
                // Case 5: Validate data_use
                console.log("Case 5: Validating data use:", additionalInfo);
                
                // API validation for data use
                await validateWithAPI(5, { data_use: additionalInfo || "Not specified" });
            } else if (step === 6) {
                // Case 6: Validate decisions_support and submit all data
                console.log("Case 6: Validating decisions support:", additionalInfo2);
                
                // Validate essential information before submission
                if (!email) {
                    throw new Error("Email is required. Please go back and provide your email.");
                }
                
                if (!phoneNumber) {
                    throw new Error("Phone number is required. Please go back and provide your phone number.");
                }
                
                // API validation for decisions support
                await validateWithAPI(6, { decisions_support: additionalInfo2 || "Not specified" });
                
                // Prepare final submission data
                const [firstName, lastName] = name.split(' ');
                const userData = {
                    firstname: firstName || name,
                    lastname: lastName || "",
                    organization_name: organization,
                    organization_role: role,
                    email: email,
                    phone_number: phoneNumber,
                    data_use: additionalInfo || "Not specified",
                    decisions_support: additionalInfo2 || "Not specified",
                    type: orgType,
                    password: "" // This would come from somewhere else
                };
                
                console.log("Submitting all accumulated data to API:", userData);
                
                try {
                    await submitToAPI(userData);
                } catch (error) {
                    console.error("API Request Error:", error);
                    throw error;
                }
            }
            
            // Continue to next step after validation
            handleNextAfterValidation();
        } catch (error: any) {
            console.error("Validation error:", error);
            setApiError(error.message || "An error occurred during validation");
            
            if (onError && typeof onError === "function") {
                onError(error.message || "An error occurred");
            } else {
                // Fallback error display if onError prop isn't provided
                Alert.alert("Error", error.message || "An error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const submitToAPI = async (userData: any) => {
        try {
            console.log("Final submission to API with all accumulated data:", userData);
            
            const response = await fetch('https://sca-api-535434239234.us-central1.run.app/organizations', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error("API Error:", errorData);
                
                // If we haven't reached max retries, try again
                if (retryCount < MAX_RETRIES) {
                    setRetryCount(prev => prev + 1);
                    console.log(`Retrying API submission (${retryCount + 1}/${MAX_RETRIES})...`);
                    return submitToAPI(userData);
                }
                
                throw new Error(errorData.message || errorData.type || "Failed to submit data. Please try again.");
            }
            
            // Reset retry count on success
            setRetryCount(0);
            
            const result = await response.json();
            console.log("API Success - All data sent successfully:", result);
            
            return result;
        } catch (error: any) {
            console.error("API Error:", error);
            throw error;
        }
    };
    
    const handleNextAfterValidation = () => {
        if (step < 6) {
            setIsAnimating(true);
            setPreviousStep(step);
            requestAnimationFrame(() => {
                setTimeout(() => {
                    setStep(step + 1);
                    setIsAnimating(false);
                }, 300);
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

    const handleNext = () => {
        if (isAnimating || isLoading) return;
        validateStep();
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
                        entering={FadeInDown.duration(500)} 
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
                                        disabled={!name.trim() || isLoading}
                                    >
                                        {isLoading ? (
                                            <ActivityIndicator size="small" color="#105cb4" />
                                        ) : (
                                            <Text className="text-dark-blue font-semibold">Next</Text>
                                        )}
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
                        entering={FadeInDown.duration(500)} 
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
                                        disabled={!organization.trim() || isLoading}
                                    >
                                        {isLoading ? (
                                            <ActivityIndicator size="small" color="#105cb4" />
                                        ) : (
                                            <Text className="text-dark-blue font-semibold">Next</Text>
                                        )}
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
                        entering={FadeInDown.duration(500)} 
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
                                        if (!isLoading) {
                                            // Actualizamos el estado
                                            setOrgType(type);
                                            
                                            // Usamos directamente el valor seleccionado para validar
                                            // en lugar de confiar en el estado actualizado
                                            validateWithSelectedType(type);
                                        }
                                    }}
                                >
                                    {isLoading && orgType === type ? (
                                        <ActivityIndicator size="small" color="#FFFFFF" />
                                    ) : (
                                        <Text className={`font-medium text-white`}>
                                            {type}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Animated.View>
                );
                
            case 4:
                return (
                    <Animated.View 
                        key="step4"
                        entering={FadeInDown.duration(500)} 
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
                            {["C-Level", "Underwriter", "Risk Mitigation", "Agent", "Insurance Carrier"].map((roleOption) => (
                                <TouchableOpacity 
                                    key={roleOption}
                                    className={`border bg-[#105cb4] ${role === roleOption ? 'border-white' : 'border-white/25'} rounded-full px-5 py-3 items-center`}
                                    onPress={() => {
                                        if (!isLoading) {
                                            const handleRoleSelection = (selectedRole: string) => {
                                                setRole(selectedRole);
                                                validateWithSelectedRole(selectedRole);
                                            };
                                            
                                            handleRoleSelection(roleOption);
                                        }
                                    }}
                                >
                                    {isLoading && role === roleOption ? (
                                        <ActivityIndicator size="small" color="#FFFFFF" />
                                    ) : (
                                        <Text className={`font-medium text-white`}>
                                            {roleOption}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Animated.View>
                );
                
            case 5:
                return (
                    <Animated.View 
                        key="step5"
                        entering={FadeInDown.duration(500)} 
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
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <ActivityIndicator size="small" color="#105cb4" />
                                        ) : (
                                            <Text className="text-dark-blue font-semibold">Next</Text>
                                        )}
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
                        entering={FadeInDown.duration(500)} 
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
                                        className="bg-white px-5 text-sm font-semibold text-dark-blue py-3 rounded-lg"
                                        onPress={handleNext}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <ActivityIndicator size="small" color="#105cb4" />
                                        ) : (
                                            <Text className="text-dark-blue font-semibold">Next</Text>
                                        )}
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
            {apiError && (
                <View className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
                    <Text className="text-white">{apiError}</Text>
                </View>
            )}
            {renderForm()}
        </View>
    );
};

export default QuestionsForm;