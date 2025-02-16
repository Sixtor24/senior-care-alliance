import { Image, Text, ScrollView, View } from "react-native";
import ImagesPath from "../../assets/ImagesPath";
import RegistrationSteps from "@/components/RegistrationSteps";
import MultiStepForm from "@/components/MultiStepForm";
import { useState } from "react";

export default function Index() {
  const [activeStep, setActiveStep] = useState(1); 

  const steps = [
    { id: "step-1", number: "1", label: "Partner Info", isActive: activeStep === 1 },
    { id: "step-2", number: "2", label: "Create Password", isActive: activeStep === 2 },
    { id: "step-3", number: "3", label: "Answer Questions", isActive: activeStep === 3 },
    { id: "step-4", number: "4", label: "Customize URL", isActive: activeStep === 4 },
    { id: "step-5", number: "5", label: "Invite Members", isActive: activeStep === 5 },
  ];

  const handleStepChange = (newStep: number) => {
    setActiveStep(newStep);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 bg-white">
          <View className="flex-[0.4] bg-blue-background justify-center items-center pb-28">
            <View className="flex-1 justify-center items-center px-4">
              <Image
                source={ImagesPath.SENIOR_CARE_WHITE_LOGO}
                className="w-1/2 aspect-square py-10"
                resizeMode="contain"
              />
              <Text className="text-text-blue text-center py-5 text-sm">
                Average Registration Time:{' '}
                <Text className="font-bold text-white">63.4 Seconds</Text>
              </Text>
              <View className="flex-row flex-wrap justify-center">
                {steps.map((step, index) => (
                  <View key={step.id} className="flex-row items-center">
                    <RegistrationSteps
                      number={step.number}
                      isActive={step.isActive}
                      label={step.label}
                    />
                    {index < steps.length - 1 && (
                      <View
                        className="h-0.5 w-8 bg-white mb-10 opacity-50 mx-2"
                        style={{ alignSelf: "center" }}
                      />
                    )}
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          bottom: 20,
          left: 0,
          right: 0,
          paddingHorizontal: 20,
        }}
      >
        <MultiStepForm onStepChange={handleStepChange} />
      </View>
    </View>
  );
}