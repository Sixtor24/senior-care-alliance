import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import ImagesPath from "@/assets/ImagesPath";
import FooterForm from '@/components/ui/FooterForm';

interface PasswordFormProps {
    formData: any; 
    onBack: () => void;
    onNext: (data: { password: string }) => void;
}

const PasswordForm: React.FC<PasswordFormProps> = ({ formData, onBack, onNext }) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showSecondPassword, setShowSecondPassword] = useState(false);

    // Validaciones
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasMinLength = password.length >= 8;
    const passwordsMatch = password === confirmPassword;

    // Fuerza de contraseña (0 a 3)
    const strength = +hasUppercase + +hasNumber + +hasMinLength;

    const handleSubmit = () => {
        if (strength === 3 && passwordsMatch) {
            onNext({ password });
        }
    };

    return (
        <>
            <View className="bg-white px-10 py-6 rounded-2xl drop-shadow-md w-full max-w-xl">
                <Text className="text-center text-[40px] text-black font-extralight pb-5">Create Password</Text>

                {/* Campo de Contraseña */}
                <View className="relative mb-4">
                    <TextInput
                    className={`border py-2 px-5 rounded-lg text-black w-full text-base pr-10 ${
                        strength === 0 && password.length > 0 ? "border-red-500" : "border-gray-color"
                    }`}
                    secureTextEntry={!showPassword}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    />
                    <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                    <FontAwesome name={showPassword ? "eye" : "eye-slash"} size={20} color="#C5C5C5" />
                    </TouchableOpacity>
                </View>

                <View className="flex-row w-full rounded-full mb-2 gap-3 overflow-hidden">
                    <View
                        className={`h-1 flex-1 ${strength >= 1 ? "bg-red-500" : "bg-light-gray"
                            } rounded-full`}
                    />
                    <View
                        className={`h-1 flex-1 ${strength >= 2 ? "bg-yellow-500" : "bg-light-gray"
                            } rounded-full`}
                    />
                    <View
                        className={`h-1 flex-1 ${strength === 3 ? "bg-green-500" : "bg-light-gray"
                            } rounded-full`}
                    />
                </View>

                <Text className="text-text-gray text-sm mb-2">Weak password. Must contain:</Text>
                <View>
                    {[
                        { label: "At least 1 uppercase", valid: hasUppercase },
                        { label: "At least 1 number", valid: hasNumber },
                        { label: "At least 8 characters", valid: hasMinLength },
                    ].map((rule, index) => (
                        <View key={index} className="flex-row items-center mb-1">
                            <View
                                className={`w-4 h-4 my-1 rounded-full justify-center items-center ${rule.valid ? "bg-green-500" : "bg-light-gray"
                                    }`}
                            >
                                <MaterialIcons
                                    name={rule.valid ? "check" : "close"}
                                    size={11}
                                    color={rule.valid ? "white" : "black"}
                                />
                            </View>
                            <Text className="ml-2 text-text-gray">{rule.label}</Text>
                        </View>
                    ))}
                </View>

                <View className="relative mt-4">
                    <TextInput
                    className="border py-2 px-5 text-black rounded-lg w-full text-base pr-10 border-gray-color"
                    secureTextEntry={!showSecondPassword}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity
                    onPress={() => setShowSecondPassword(!showSecondPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                    <FontAwesome name={showSecondPassword ? "eye" : "eye-slash"} size={20} color="#C5C5C5" />
                    </TouchableOpacity>
                </View>

                <View className="mt-2 h-12 justify-center">
                    {password.length > 0 && strength < 3 && (
                        <Text className="text-red-500 text-sm">
                            Your password does not meet the security requirements.
                        </Text>
                    )}
                    {confirmPassword.length > 0 && !passwordsMatch && (
                        <Text className="text-red-500 text-sm mt-1">
                            Passwords do not match.
                        </Text>
                    )}
                </View>

                <View className="flex-row justify-end mt-6 space-x-4">
                    <TouchableOpacity
                        className="px-8 py-4 bg-gray-color rounded-full"
                        onPress={onBack}
                    >
                        <Text className="text-gray-700 text-lg-[14]">Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={strength < 3 || !passwordsMatch}
                        className={`px-6 py-4 rounded-full flex-row items-center space-x-2 ${strength < 3 || !passwordsMatch ? "bg-blue-300" : "bg-dark-blue"}`}
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
            <FooterForm />
        </>
    );
};

export default PasswordForm;