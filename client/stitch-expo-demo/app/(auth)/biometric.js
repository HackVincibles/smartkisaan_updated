import React from 'react';
import { useColorScheme } from 'nativewind';
import { View, Text, TouchableOpacity, StatusBar, Image } from 'react-native';
import { router } from 'expo-router';
import { Fingerprint, ShieldCheck, ArrowRight, Lock } from 'lucide-react-native';

const BiometricSetup = () => {
  return (
    <View className="flex-1 bg-white dark:bg-zinc-900 pt-12">
      <StatusBar style={isDark ? "light" : "dark"} />
      
      <View className="px-4 flex-1 justify-center items-center">
        <View className="w-24 h-24 bg-primary-container rounded-full items-center justify-center mb-8 shadow-lg">
           <Fingerprint color="#006e2f" size={48} />
        </View>

        <Text className="text-2xl text-gray-900 dark:text-zinc-100 font-bold text-center">Secure Your Trade</Text>
        <Text className="text-lg text-gray-500 dark:text-zinc-400 text-center mt-4">Enable fingerprint or face recognition for faster bidding and secure payouts.</Text>

        <View className="mt-8 w-full">
           <View className="flex-row items-center p-6 bg-gray-100 dark:bg-zinc-800/50 rounded-2xl border border-gray-200 dark:border-zinc-800 mb-4">
              <ShieldCheck color="#006e2f" size={24} />
              <Text className="text-gray-900 dark:text-zinc-100 font-bold text-base ml-4">Biometric Login</Text>
           </View>
           <View className="flex-row items-center p-6 bg-gray-100 dark:bg-zinc-800/50 rounded-2xl border border-gray-200 dark:border-zinc-800">
              <Lock color="#006e2f" size={24} />
              <Text className="text-gray-900 dark:text-zinc-100 font-bold text-base ml-4">App Lock Protection</Text>
           </View>
        </View>
      </View>

      <View className="px-4 pb-xl">
        <TouchableOpacity 
          onPress={() => router.push('/')}
          className="bg-primary h-14 rounded-xl flex-row items-center justify-center shadow-lg"
        >
          <Text className="text-white font-bold text-lg mr-2">Activate Now</Text>
          <ArrowRight color="#ffffff" size={20} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/')} className="mt-4 items-center py-2">
           <Text className="text-gray-500 dark:text-zinc-400 font-bold text-sm">Skip for Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BiometricSetup;
