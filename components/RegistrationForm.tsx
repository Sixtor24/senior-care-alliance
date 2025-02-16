import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

const RegistrationForm = () => {
  return (
    <View className="flex-1 justify-center items-center px-4">
      {/* Formulario */}
      <View className="bg-white px-10 py-6 rounded-2xl shadow-lg w-full max-w-2xl">
        {/* Título */}
        <Text className="text-center text-[40px] font-extralight my-4">
            Partner Information
        </Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-3"
          placeholder="First Name"
        />
        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-3"
          placeholder="Last Name"
        />
        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-3"
          placeholder="Email"
        />
        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-3"
          placeholder="Role in the Organization"
        />
        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-3"
          placeholder="Organization Name"
        />

        {/* Botón de continuar */}
        <TouchableOpacity className="bg-blue-500 rounded-lg p-3 mt-4">
          <Text className="text-white text-center font-bold">Continue →</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View className="items-center mt-6">
        <Text className="text-gray-500">© 2025 Senior Care Alliance</Text>
      </View>
    </View>
  );
};

export default RegistrationForm;