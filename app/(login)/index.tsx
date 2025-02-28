import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { router } from "expo-router";

export default function IndexRedirect() {
  useEffect(() => {
    // Redireccionar a login.tsx
    router.replace("/(login)/login");
  }, []);

  // Mostrar un indicador de carga mientras se redirecciona
  return (
    <View className="flex-1 bg-blue-background justify-center items-center">
      <ActivityIndicator size="large" color="#FFFFFF" />
    </View>
  );
}