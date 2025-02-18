import { Image, Text, ScrollView, View } from "react-native";
import ImagesPath from "../../assets/ImagesPath";
import RegistrationSteps from "@/components/RegistrationSteps";
import MultiStepForm from "@/components/MultiStepForm";
import { useState } from "react";

export default function Index() {
  const [activeStep, setActiveStep] = useState(1);
  const steps = [
    { id: "step-1", number: "1", label: "Partner Information", isActive: activeStep === 1 },
    { id: "step-2", number: "2", label: "Create Password", isActive: activeStep === 2 },
    { id: "step-3", number: "3", label: "Questions", isActive: activeStep === 3 },
    { id: "step-4", number: "4", label: "Customize Link", isActive: activeStep === 4 },
    { id: "step-5", number: "5", label: "Invite Team", isActive: activeStep === 5 },
  ];

  const handleStepChange = (newStep: number) => {
    setActiveStep(newStep);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, }}>
        {/* Encabezado */}
        <View className="flex-1 bg-white">
          <View className="flex-1 bg-blue-background justify-center items-center pt-12 pb-14">
            <View className="flex-1 justify-center items-center px-4 pb-24">
              <View className="gap-6">
              <Image
                source={ImagesPath.SENIOR_CARE_WHITE_LOGO}
                className="w-1/2 aspect-square py-10"
                resizeMode="contain"
              />
              <Text className="text-text-blue text-center py-5 text-sm">
                Average Registration Time:{' '}
              <Text className="font-bold text-white">63.4 Seconds</Text>
              </Text>
              </View>
              <View className="flex-row justify-center items-start">
                {steps.map((step, index) => (
                  <View key={step.id} className="flex-row items-start">
                    <RegistrationSteps
                      number={step.number}
                      isActive={step.isActive}
                      label={step.label}
                    />
                    {index < steps.length - 1 && (
                      <View
                        className="h-[0.03rem] w-7 bg-white mx-3 top-5"
                      />
                    )}
                  </View>
                ))}
              </View>
            </View>
          </View>
          <View style={{
            paddingHorizontal: 20,
            bottom: 125,
            left: 0,
            right: 0,
          }}>
            <MultiStepForm onStepChange={handleStepChange} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}