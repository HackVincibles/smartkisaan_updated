import React from 'react';
import { useColorScheme } from 'nativewind';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { Leaf, PlusCircle, ArrowRight, ChevronLeft } from 'lucide-react-native';

const NoListings = () => {
  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950 pt-12">
      <StatusBar style={isDark ? "light" : "dark"} />
      
      {/* Header */}
      <View className="px-4 flex-row items-center py-2 border-b border-gray-200 dark:border-zinc-800">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center mr-2">
          <ChevronLeft color={isDark ? "#ffffff" : "#0b1c30"} size={24} />
        </TouchableOpacity>
        <Text className="text-xl text-gray-900 dark:text-zinc-100 font-bold">My Harvest</Text>
      </View>

      <View className="flex-1 items-center justify-center px-4">
        <View className="w-32 h-32 bg-primary-container rounded-full items-center justify-center mb-8">
           <Leaf color="#006e2f" size={48} />
        </View>

        <Text className="text-xl text-gray-900 dark:text-zinc-100 font-bold text-center">Ready to Sell?</Text>
        <Text className="text-base text-gray-500 dark:text-zinc-400 text-center mt-4">You haven't listed any crops yet. List your harvest now to reach verified buyers nationwide.</Text>

        <TouchableOpacity 
          onPress={() => router.push('/(farmer)/add-listing')}
          className="mt-8 bg-primary px-xl h-14 rounded-xl flex-row items-center justify-center shadow-md"
        >
          <PlusCircle color="#ffffff" size={20} className="mr-2" />
          <Text className="text-white font-bold text-lg ml-2">Create First Listing</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NoListings;
