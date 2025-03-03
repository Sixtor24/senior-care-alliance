import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Platform, ScrollView } from "react-native";
import useFormStore from "../../store/formStore";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { toast, Bounce } from 'react-toastify';

interface InviteTeamFormProps {
    onBack: () => void;
    onNext: () => void;
    onError?: (message: string) => void;
}

const InviteTeamForm: React.FC<InviteTeamFormProps> = ({ onBack, onNext, onError }) => {
    const { updateFormData } = useFormStore();
    const [teamEmails, setTeamEmails] = useState<string[]>([]);
    const [currentEmail, setCurrentEmail] = useState('');
    const [inviteMessage, setInviteMessage] = useState("I'd like to invite you to join our organization on the platform.");
    const [error, setError] = useState<string | null>(null);

    const handleNext = () => {
        // If there's text in the input field, try to add it as an email chip first
        if (currentEmail.trim()) {
            addEmailChip(currentEmail);
            setCurrentEmail('');
        }
        
        // Validate emails before proceeding
        if (teamEmails.length > 0 && !validateEmails()) {
            return;
        }
        
        // Only proceed if validation passes or if there are no emails to validate
        onNext();
        if (Platform.OS === 'web') {
            // Force navigation to the specific route
            window.location.pathname = '/';
        } else {
            router.replace("/");
        }
    };

    const addEmailChip = (email: string) => {
        email = email.trim();
        
        if (!email) return;
        
        if (!isValidEmail(email)) {
            const errorMessage = `Invalid email format: ${email}`;
            setError(errorMessage);
            if (onError) onError(errorMessage);
            
            toast.warn(errorMessage, {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            return;
        }
        
        if (teamEmails.includes(email)) {
            const errorMessage = `Email already added: ${email}`;
            setError(errorMessage);
            if (onError) onError(errorMessage);
            
            toast.warn(errorMessage, {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            return;
        }
        
        setTeamEmails([...teamEmails, email]);
        setError(''); // Clear any previous errors
    };
    
    // Helper function to validate email format
    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const removeEmail = (index: number) => {
        const newEmails = [...teamEmails];
        newEmails.splice(index, 1);
        setTeamEmails(newEmails);
    };

    const handleEmailChange = (text: string) => {
        setCurrentEmail(text);
        if (error) setError(null);
    };

    const handleKeyPress = (e: any) => {
        // If space or enter is pressed, add the email chip
        if ((e.nativeEvent.key === ' ' || e.nativeEvent.key === 'Enter') && currentEmail.trim()) {
            addEmailChip(currentEmail);
            setCurrentEmail('');
            e.preventDefault(); // Prevent the space from being added to the input
        }
    };

    const validateEmails = () => {
        // Check if there are any invalid emails
        const invalidEmails = teamEmails.filter(email => !isValidEmail(email));
        
        if (invalidEmails.length > 0) {
            const errorMessage = `Invalid email${invalidEmails.length > 1 ? 's' : ''}: ${invalidEmails.join(', ')}`;
            setError(errorMessage);
            if (onError) onError(errorMessage);
            
            toast.warn(errorMessage, {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            return false;
        }
        
        return true;
    };

    return (
        <View className="w-[35vw]">
            <Animated.View 
                key="inviteTeam"
                entering={FadeInDown.duration(500)} 
                exiting={FadeOut.duration(300)}
                className="w-full"
            >
                <View className="flex-row mb-3 items-center">
                    <Text className="text-left text-[40px] text-white font-extralight">
                        Invite Your Team
                    </Text>
                </View>
                <Text className="text-left text-[16px] text-white font-light mb-4">
                    Invite your team via email! Type an email and press space to add it.
                </Text>
                
                <View className="border bg-[#105cb4] border-white/25 rounded-lg w-full mt-4 p-3">
                    {/* Email chips container */}
                    <ScrollView className="flex-row flex-wrap gap-2 mb-2">
                        {teamEmails.map((email, index) => (
                            <View key={index} className="flex-row items-center bg-white rounded-md px-2 py-1 mb-1">
                                <Text className="text-[#105cb4] mr-1">{email}</Text>
                                <TouchableOpacity onPress={() => removeEmail(index)}>
                                    <Ionicons name="close-circle" size={18} color="#105cb4" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                    
                    {/* Email input */}
                    <TextInput
                        className="text-white font-light bg-[#105cb4] px-4 py-3 w-full border border-white/25 rounded-md"
                        placeholder="Type email and press space to add"
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        value={currentEmail}
                        onChangeText={handleEmailChange}
                        onKeyPress={handleKeyPress}
                        style={[Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)]}
                    />
                    
                    <View className="flex-row justify-end gap-5 mt-3 w-full">
                        <TouchableOpacity
                            className="px-5 border border-white/25 text-sm font-semibold py-3 rounded-lg"
                            onPress={handleNext}
                        >
                            <Text className="text-white font-normal">Skip</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-white px-5 text-sm font-semibold text-dark-blue py-3 rounded-lg"
                            onPress={handleNext}
                        >
                            <Text className="text-dark-blue font-semibold">Continue</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
                {error && <Text className="text-red-900 mt-2">{error}</Text>}
            </Animated.View>
        </View>
    );
};

export default InviteTeamForm;
