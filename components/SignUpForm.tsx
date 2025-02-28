import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import QuestionsForm from "./Forms/QuestionsForm";
import EmailForm from "./Forms/EmailForm";
import VerificationForm from "./Forms/NumberForm";
import useFormStore from "../store/formStore";
import OrganizationLinkForm from "./Forms/OrganizationLinkForm";
import InviteTeamForm from "./Forms/InviteTeamForm";

interface MultiStepFormProps {
    onStepChange: (newStep: number) => void;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({ onStepChange }) => {
    const { step, nextStep, prevStep, email } = useFormStore();
    
    // Sync the step with parent component
    useEffect(() => {
        onStepChange(step);
    }, [step, onStepChange]);

    return (
        <View>
            <View className="flex-1 justify-center items-center px-16">
                {step === 1 && (
                    <Animated.View 
                        entering={FadeInDown.duration(400)}
                        key="email-form"
                    >
                        <EmailForm 
                            onNext={nextStep} 
                            formData={{ email }} 
                        />
                    </Animated.View>
                )}
                {step === 2 && (
                    <Animated.View 
                        entering={FadeInDown.duration(400)}
                        key="verification-form"
                    >
                        <VerificationForm
                            onBack={prevStep}
                            onNext={nextStep}
                        />
                    </Animated.View>
                )}
                {step === 3 && (
                    <Animated.View 
                        entering={FadeInDown.duration(400).springify().delay(100)}
                        exiting={FadeOut.duration(250)}
                        key="questions-form-1"
                    >
                        <QuestionsForm
                            onBack={prevStep}
                            onNext={nextStep}
                        />
                    </Animated.View>
                )}
                {step === 4 && (
                    <Animated.View 
                        entering={FadeInDown.duration(400).springify().delay(100)}
                        exiting={FadeOut.duration(250)}
                        key="organization-link-form"
                    >
                        <OrganizationLinkForm
                            onBack={prevStep}
                            onNext={nextStep}
                        />
                    </Animated.View>
                )}
                {step === 5 && (
                    <Animated.View 
                        entering={FadeInDown.duration(400).springify().delay(100)}
                        exiting={FadeOut.duration(250)}
                        key="invite-team-form"
                    >
                        <InviteTeamForm
                            onBack={prevStep}
                            onNext={nextStep}
                        />
                    </Animated.View>
                )}
            </View>
        </View>
    );
};

export default MultiStepForm;