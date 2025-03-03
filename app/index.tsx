import React, { useEffect, useState } from 'react';
import { View } from "react-native";
import Dashboard from '@/components/HomeDashboard/Dashboard';
import { ToastContainer } from 'react-toastify';

const HomePage = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                // ... cargar datos iniciales ...
            } catch (error) {
                console.error('Error loading initial data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, []);

    return (
        <View className="flex-row h-full w-full bg-white">
            <Dashboard isLoading={isLoading} />
            <ToastContainer />
        </View>
    );
};

export default HomePage;