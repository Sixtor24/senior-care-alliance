import React, { useState } from "react";
import { Text, View } from "react-native";
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from "react-native-reanimated";
import RegistrationForm from "./Forms/RegistrationForm";
import PasswordForm from "./Forms/PasswordForm";

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
    password: "", // Agregar campos adicionales si es necesario
  });

  // Estado compartido para la animación de opacidad
  const opacity = useSharedValue(0);

  // Función para animar la entrada
  const fadeIn = () => {
    opacity.value = withTiming(1, { duration: 300 });
  };

  // Función para animar la salida
  const fadeOut = () => {
    opacity.value = withTiming(0, { duration: 300 });
  };

  const handleNextStep = (data: any) => {
    fadeOut(); // Animar la salida del paso actual
    setTimeout(() => {
      setFormData((prevData) => ({ ...prevData, ...data }));
      const newStep = step + 1;
      setStep(newStep);
      onStepChange(newStep); // Notificar el cambio de paso al componente padre
      fadeIn(); // Animar la entrada del nuevo paso
    }, 300); // Esperar a que termine la animación de salida
  };

  const handlePreviousStep = () => {
    fadeOut(); // Animar la salida del paso actual
    setTimeout(() => {
      const newStep = step - 1;
      setStep(newStep);
      onStepChange(newStep); // Notificar el cambio de paso al componente padre
      fadeIn(); // Animar la entrada del nuevo paso
    }, 300); // Esperar a que termine la animación de salida
  };

  // Estilo animado para la opacidad
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  // Iniciar la animación al montar el componente
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
      </Animated.View>
      <View className="items-center mt-3">
                <Text className="text-gray-500">© 2025 Senior Care Alliance</Text>
            </View>
    </View>
  );
};

export default MultiStepForm;