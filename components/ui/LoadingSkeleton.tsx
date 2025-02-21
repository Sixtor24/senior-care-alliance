import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { 
    useAnimatedStyle, 
    useSharedValue,
    withRepeat, 
    withTiming,
    withSequence,
} from 'react-native-reanimated';

interface SkeletonProps {
    width?: number | `${number}%`;
    height?: number;
    className?: string;
}

const LoadingSkeleton = ({ width = '100%', height = 20, className = '' }: SkeletonProps) => {
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(0.7, { duration: 1000 }),
                withTiming(0.3, { duration: 1000 })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyles = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    backgroundColor: '#E5E7EB',
                    borderRadius: 4,
                },
                animatedStyles,
            ]}
            className={className}
        />
    );
};

export default LoadingSkeleton;