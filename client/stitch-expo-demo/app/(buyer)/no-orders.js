import React from 'react';
import { useColorScheme } from 'nativewind';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { ShoppingBag, Search, ArrowRight, ChevronLeft } from 'lucide-react-native';

const NoOrders = () => {
  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950 pt-12">
      <StatusBar style={isDark ? "light" : "dark"} />
      
      {/* Header */}
      <View className="px-4 flex-row items-center py-2 border-b border-gray-200 dark:border-zinc-800">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center mr-2">
          <ChevronLeft color={isDark ? "#ffffff" : "#0b1c30"} size={24} />
        </TouchableOpacity>
        <Text className="text-xl text-gray-900 dark:text-zinc-100 font-bold">My Orders</Text>
      </View>

      <View className="flex-1 items-center justify-center px-4">
        <View className="w-32 h-32 bg-gray-100 dark:bg-zinc-800/50 rounded-full items-center justify-center mb-8">
           <ShoppingBag color={isDark ? "#a1a1aa" : "#64748b"} size={48} />
        </View>

        <Text className="text-xl text-gray-900 dark:text-zinc-100 font-bold text-center">No Orders Yet</Text>
        <Text className="text-base text-gray-500 dark:text-zinc-400 text-center mt-4">You haven't placed any bids or orders. Start exploring the marketplace to find the best harvest.</Text>

        <TouchableOpacity 
          onPress={() => router.push('/(buyer)/dashboard')}
          className="mt-8 bg-primary px-xl h-14 rounded-xl flex-row items-center justify-center shadow-md"
        >
          <Search color="#ffffff" size={20} className="mr-2" />
          <Text className="text-white font-bold text-lg ml-2">Browse Market</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NoOrders;
