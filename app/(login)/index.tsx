import { Image, Text, View } from "react-native";
import ImagesPath from "../../assets/ImagesPath";

export default function Index() {
  return (
    <View className="flex-1 bg-white">
      {/* Contenedor principal con flex */}
      <View className="flex-1 flex-col">
        {/* Parte superior con fondo azul */}
        <View className="flex-[0.7] bg-blue-background justify-center items-center">
          {/* Imagen más grande y centrada */}
          <Image
            source={ImagesPath.SENIOR_CARE_WHITE_LOGO}
            className="w-48 h-48" // Tamaño más grande usando Tailwind
            resizeMode="contain"
          />
          {/* Texto con parte en negrita y color blanco */}
          <Text className="text-text-blue text-center mt-4">
            Average Registration Time:{' '}
            <Text className="font-bold text-white">63.4 Seconds</Text>
          </Text>
        </View>
        {/* Parte inferior con contenido */}
        <View className="flex-1 justify-center items-center">
          <Text className="text-9xl text-black">
            Edit app/index.tsx to edit this screen.
          </Text>
        </View>
      </View>
    </View>
  );
}