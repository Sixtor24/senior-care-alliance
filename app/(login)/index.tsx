import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import ImagesPath from "../../assets/ImagesPath";
import RegistrationSteps from "@/components/RegistrationSteps";
import RegistrationForm from "@/components/RegistrationForm";

export default function Index() {

  const steps = [
    { id: "step-1", number: "1", label: "Partner Info", isActive: true },
    { id: "step-2", number: "2", label: "Create Password", isActive: false },
    { id: "step-3", number: "3", label: "Answer Questions", isActive: false },
    { id: "step-4", number: "4", label: "Customize URL", isActive: false },
    { id: "step-5", number: "5", label: "Invite Members", isActive: false },
  ];


  return (
    <View className="flex-1 bg-white">
      {/* Contenedor principal */}
      <View className="flex-1">
        {/* Fondo azul extendido */}
        <View className="flex-[0.4] bg-blue-background pb-36">
          {/* Contenido interno centrado */}
          <View className="flex-1 justify-center items-center">
            <Image
              source={ImagesPath.SENIOR_CARE_WHITE_LOGO}
              className="w-48 h-48"
              resizeMode="contain"
            />
            <Text className="text-text-blue text-center mt-6">
              Average Registration Time:{' '}
              <Text className="font-bold text-white">63.4 Seconds</Text>
            </Text>
            <View className="flex-row items-center mt-6 px-4">
              {steps.map((step) => (
                <View key={step.id} className="flex-row items-center">
                  <RegistrationSteps
                    number={step.number}
                    isActive={step.isActive}
                    label={step.label}
                  />
                  {step.id !== steps[steps.length - 1].id && (
                    <View
                      className="h-0.5 w-10 bg-white opacity-50 mb-10 mx-3"
                      style={{ alignSelf: "center" }}
                    />
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
  
        {/* Formulario (superpuesto) */}
        <View
          className="absolute bottom-10 left-0 right-0 px-4"
          style={{ zIndex: 1 }}
        >
          <RegistrationForm />
        </View>
      </View>
    </View>
  );
}