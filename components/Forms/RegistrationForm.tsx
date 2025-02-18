import ImagesPath from "@/assets/ImagesPath";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import CareDropdown from "../ui/CareDropdown";
import FooterForm from '@/components/ui/FooterForm';

interface RegistrationFormProps {
  onNext: (data: FormData) => void;
  formData: FormData;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  organizationName: string;
}

const roles = [
  { label: "C-Level", value: "C-Level" },
  { label: "Underwriter", value: "Underwriter" },
  { label: "Risk Mitigation", value: "Risk Mitigation" },
  { label: "Agent", value: "Agent" },
  { label: "Insurance Carrier", value: "Insurance Carrier" },
];

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onNext, formData }) => {
  const [firstName, setFirstName] = useState(formData.firstName);
  const [lastName, setLastName] = useState(formData.lastName);
  const [email, setEmail] = useState(formData.email);
  const [role, setRole] = useState(formData.role);
  const [organizationName, setOrganizationName] = useState(formData.organizationName);

  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    role: false,
    organizationName: false,
  });

  const validateFields = () => {
    const newErrors = {
      firstName: !firstName,
      lastName: !lastName,
      email: !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      role: !role,
      organizationName: !organizationName,
    };

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => !error);
  };

  const handleContinue = () => {
    if (validateFields()) {
      onNext({
        firstName,
        lastName,
        email,
        role,
        organizationName,
      });
    } else {
      Alert.alert("Error", "Please fill in all fields correctly.");
    }
  };

  return (
    <>
      <View
        className="bg-white px-14 py-8 rounded-2xl drop-shadow-md w-full mb-3 max-w-[38rem]"
        style={{zIndex: 1}}
      >
        <Text className="text-center text-[40px] font-extralight pb-7">
          Partner Information
        </Text>
        <View className="flex-col">
          {/* First Name */}
          <TextInput
            className={`border ${errors.firstName ? "border-red-500" : "border-gray-300"} rounded-lg p-3`}
            placeholder={errors.firstName ? "First Name*" : "First Name"}
            placeholderTextColor={errors.firstName ? "red" : "black"}
            value={firstName}
            onChangeText={(text) => {
              setFirstName(text);
              setErrors({ ...errors, firstName: false });
            }}
          />
          <View className="h-5" />

          {/* Last Name */}
          <TextInput
            className={`border ${errors.lastName ? "border-red-500" : "border-gray-300"} rounded-lg p-3`}
            placeholder={errors.lastName ? "Last Name*" : "Last Name"}
            placeholderTextColor={errors.lastName ? "red" : "black"}
            value={lastName}
            onChangeText={(text) => {
              setLastName(text);
              setErrors({ ...errors, lastName: false });
            }}
          />
          <View className="h-5" />

          {/* Email */}
          <TextInput
            className={`border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-lg p-3`}
            placeholder={errors.email ? "Email*" : "Email"}
            placeholderTextColor={errors.email ? "red" : "black"}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors({ ...errors, email: false });
            }}
            keyboardType="email-address"
          />
          <View className="h-5" />

          {/* Role */}
          <CareDropdown
            placeholder={errors.role ? "Role*" : "Role"}
            items={roles}
            onSelect={(selectedValue) => {
              setRole(selectedValue ?? "");
              setErrors({ ...errors, role: false });
            }}
            error={errors.role} 
          />
          <View className="h-5" />

          <TextInput
            className={`border ${errors.organizationName ? "border-red-500" : "border-gray-300"} rounded-lg p-3`}
            placeholder={errors.organizationName ? "Organization Name*" : "Organization Name"}
            placeholderTextColor={errors.organizationName ? "red" : "black"}
            value={organizationName}
            onChangeText={(text) => {
              setOrganizationName(text);
              setErrors({ ...errors, organizationName: false });
            }}
          />
          <View className="flex-row justify-end mt-4">
            <TouchableOpacity
              className="bg-blue-background rounded-full px-6 py-4 flex-row items-center space-x-2"
              onPress={handleContinue}
            >
              <Text className="text-white text-center font-bold">Continue</Text>
              <Image
                source={ImagesPath.RIGHT_ARROW}
                className="w-5 h-5"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View >
      <FooterForm />
      </>
  );
};

export default RegistrationForm;