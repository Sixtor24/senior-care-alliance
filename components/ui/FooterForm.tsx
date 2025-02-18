import React from 'react';
import { View, Text } from 'react-native';

// Footer Component
const Footer = ({ copyrightYear = 2025, companyName = "Senior Care Alliance" }) => {
  return (
    <View className="items-center mt-3">
      <Text className="text-gray-500 text-sm">
        © {copyrightYear} {companyName}
      </Text>
    </View>
  );
};

export default Footer;