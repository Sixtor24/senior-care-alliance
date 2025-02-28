import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Platform } from "react-native";
import useFormStore from "../../store/formStore";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";

interface OrganizationLinkFormProps {
    onBack: () => void;
    onNext: () => void;
    onError?: (message: string) => void;
}

const OrganizationLinkForm: React.FC<OrganizationLinkFormProps> = ({ onBack, onNext }) => {
    const { organization, updateFormData } = useFormStore();
    const [orgLink, setOrgLink] = useState(`${organization?.toLowerCase().replace(/\s+/g, '-') || 'your-organization'}`);
    const [error, setError] = useState<string | null>(null);

    const handleNext = () => {
        if (!orgLink.trim()) {
            setError("Please enter a valid organization link");
            return;
        }
        updateFormData({ organizationLink: orgLink });
        onNext();
    };

    return (
        <View className="w-[35vw]">
        <Animated.View 
            key="organizationLink"
            entering={FadeInDown.duration(500).delay(100)} 
            exiting={FadeOut.duration(300)}
            className="w-full"
        >
            <View className="flex-row mb-3 items-center">
                <Text className="text-left text-[40px] text-white font-extralight">
                    Organization Link
                </Text>
            </View>
            <Text className="text-left text-[16px] text-white font-light mb-4">
                Here's your custom link to access your database and collaborate with your team! You can personalize it by editing the field below.
            </Text>
            <View className="py-2" />
            <View className="flex-row items-center">
                <View className="items-center gap-3 border bg-[#105cb4] border-white/25 rounded-lg w-full overflow-hidden">
                    <View className="flex-row items-center w-full">
                        <Text className="text-white text-2xl font-light bg-[#105cb4] px-4 py-3">
                            app.yourproduct.com/
                        </Text>
                        <TextInput
                            className="text-white text-2xl font-extralight bg-[#105cb4] py-3 flex-1"
                            placeholder="your-organization"
                            value={orgLink}
                            onChangeText={(text) => {
                                setOrgLink(text.toLowerCase().replace(/\s+/g, '-'));
                                if (error) setError(null);
                            }}
                            style={[Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)]}
                        />
                    </View>
                    <View className="flex-row justify-end p-3 w-full">
                        <TouchableOpacity
                            className="bg-white px-5 text-sm font-semibold text-dark-blue py-3 rounded-lg"
                            onPress={handleNext}
                        >
                            <Text className="text-dark-blue font-semibold">Continue</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            {error && <Text className="text-red-900 mt-2">{error}</Text>}
            <View className="py-2" />
            <Text className="text-left text-[15px] text-white font-light italic">
                Note: You'll only be able to change it now.
            </Text>
        </Animated.View>
        </View>
    );
};

export default OrganizationLinkForm;
