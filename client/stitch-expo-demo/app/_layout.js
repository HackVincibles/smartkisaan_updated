import React from 'react';
import { Stack } from "expo-router";
import { View } from "react-native";
import { useColorScheme } from "nativewind";
import { LanguageProvider } from "./(shared)/LanguageContext";
import "../global.css";

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  
  return (
    <LanguageProvider>
      <View className={`flex-1 ${colorScheme === 'dark' ? 'dark' : ''}`}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="role-select" />
          <Stack.Screen name="language" />
          <Stack.Screen name="upgrade" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(farmer)" />
          <Stack.Screen name="(buyer)" />
          <Stack.Screen name="(transporter)" />
          <Stack.Screen name="(admin)" />
        </Stack>
      </View>
    </LanguageProvider>
  );
}
