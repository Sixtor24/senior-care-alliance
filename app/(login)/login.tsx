import { Image, ScrollView, View } from "react-native";
import ImagesPath from "../../assets/ImagesPath";
import MultiStepForm from "@/components/SignUpForm";
import { useState } from "react";
import { ToastContainer } from "react-toastify";

export default function Login() {
    const [activeStep, setActiveStep] = useState(1);

    const handleStepChange = (newStep: number) => {
        setActiveStep(newStep);
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, }}>
                {/* Encabezado */}
                <View className="flex-1 bg-blue-background justify-center items-center">
                    <View className="flex-1 gap-10 mt-20 items-center">
                        <Image
                            source={ImagesPath.SENIOR_CARE_WHITE_LOGO}
                            className="w-1/2 aspect-square py-10"
                            resizeMode="contain"
                        />
                        <MultiStepForm onStepChange={handleStepChange} />
                        <ToastContainer />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}