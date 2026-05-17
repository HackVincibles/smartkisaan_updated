import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Construction, ArrowLeft, Sparkles } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

export default function ComingSoon() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { title = "Coming Soon", description = "We are working hard to bring this feature to you in the next update." } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-white dark:bg-zinc-950">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View className="px-6 pt-14 pb-4 flex-row items-center">
        <TouchableOpacity 
          onPress={() => router.back()} 
          className="w-10 h-10 bg-gray-100 dark:bg-zinc-900 rounded-full items-center justify-center mr-4"
        >
          <ArrowLeft color={isDark ? "#ffffff" : "#000000"} size={20} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 dark:text-zinc-100">Back</Text>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <View className="w-32 h-32 bg-[#10b981]/10 dark:bg-[#10b981]/20 rounded-full items-center justify-center mb-8">
           <Construction color="#10b981" size={56} strokeWidth={1.5} />
        </View>
        
        <View className="bg-[#10b981]/10 px-4 py-2 rounded-full flex-row items-center mb-6">
           <Sparkles color="#10b981" size={16} />
           <Text className="text-[#10b981] text-xs font-black ml-2 uppercase tracking-widest">In Development</Text>
        </View>

        <Text className="text-3xl text-gray-900 dark:text-zinc-100 font-black text-center mb-4 leading-tight">{title}</Text>
        <Text className="text-base text-gray-500 dark:text-zinc-400 text-center leading-relaxed px-4">{description}</Text>

        <TouchableOpacity 
          onPress={() => router.back()}
          className="mt-12 bg-[#10b981] px-8 py-4 rounded-full shadow-lg shadow-green-500/30"
        >
          <Text className="text-white font-black text-sm uppercase tracking-widest">Return to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
