import React from 'react';
import { useColorScheme } from 'nativewind';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { 
  WifiOff, 
  RefreshCcw, 
  Save, 
  FileText, 
  Database,
  AlertCircle,
  ChevronLeft
} from 'lucide-react-native';
import { router } from 'expo-router';

const OfflineDashboard = () => {
  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950 pt-12">
      <StatusBar style={isDark ? "light" : "dark"} />
      
      {/* Header */}
      <View className="px-4 flex-row items-center py-2 border-b border-gray-200 dark:border-zinc-800 bg-gray-100 dark:bg-zinc-800/50-high">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center mr-2">
          <ChevronLeft color={isDark ? "#ffffff" : "#0b1c30"} size={24} />
        </TouchableOpacity>
        <Text className="text-xl text-gray-900 dark:text-zinc-100 font-bold">Offline Mode</Text>
        <View className="ml-auto bg-amber-100 px-2 py-0.5 rounded-full flex-row items-center">
           <WifiOff color="#d97706" size={12} />
           <Text className="text-amber-700 text-[10px] font-bold ml-1">LOCAL ONLY</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-4">
        
        {/* Offline Warning */}
        <View className="mt-6 bg-amber-50 border border-amber-100 rounded-2xl p-6 flex-row items-center">
           <AlertCircle color="#d97706" size={24} />
           <View className="flex-1 ml-4">
              <Text className="text-amber-900 font-bold text-base">Limited Connectivity</Text>
              <Text className="text-amber-700 text-xs">You are viewing locally cached data. New listings will sync once you are back online.</Text>
           </View>
        </View>

        {/* Local Storage Stats */}
        <View className="mt-8 flex-row space-x-md">
           <View className="flex-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
              <Database color="#006e2f" size={20} />
              <Text className="text-xl font-bold text-gray-900 dark:text-zinc-100 mt-4">12</Text>
              <Text className="text-xs text-gray-500 dark:text-zinc-400 font-bold uppercase">Cached Items</Text>
           </View>
           <View className="flex-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
              <Save color="#006e2f" size={20} />
              <Text className="text-xl font-bold text-gray-900 dark:text-zinc-100 mt-4">3</Text>
              <Text className="text-xs text-gray-500 dark:text-zinc-400 font-bold uppercase">Pending Sync</Text>
           </View>
        </View>

        {/* Local Actions */}
        <Text className="text-xl text-gray-900 dark:text-zinc-100 font-bold mt-8 mb-4">Offline Actions</Text>
        
        <TouchableOpacity className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 flex-row items-center mb-4 shadow-sm">
           <View className="w-12 h-12 bg-primary-container rounded-xl items-center justify-center mr-4">
              <FileText color="#006e2f" size={24} />
           </View>
           <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900 dark:text-zinc-100">Draft New Listing</Text>
              <Text className="text-xs text-gray-500 dark:text-zinc-400">Saved to device storage</Text>
           </View>
           <RefreshCcw color={isDark ? "#71717a" : "#bccbb9"} size={20} />
        </TouchableOpacity>

        <TouchableOpacity className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 flex-row items-center mb-4 shadow-sm">
           <View className="w-12 h-12 bg-gray-100 dark:bg-zinc-800/50 rounded-xl items-center justify-center mr-4">
              <RefreshCcw color="#565e74" size={24} />
           </View>
           <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900 dark:text-zinc-100">Sync Prices</Text>
              <Text className="text-xs text-gray-500 dark:text-zinc-400">Last synced 4h ago</Text>
           </View>
           <View className="bg-green-100 px-4 py-1 rounded-lg">
              <Text className="text-green-700 text-[10px] font-bold">READY</Text>
           </View>
        </TouchableOpacity>

        <View className="mt-8 p-6 bg-gray-100 dark:bg-zinc-800/50 rounded-2xl border border-gray-200 dark:border-zinc-800">
           <Text className="text-gray-900 dark:text-zinc-100 font-bold text-base mb-sm">Why Offline Mode?</Text>
           <Text className="text-gray-500 dark:text-zinc-400 text-xs leading-5">We know Mandi connectivity can be patchy. Smart-Kissan lets you document your harvest even without bars, and uploads everything automatically when you reach home or better signal.</Text>
        </View>

        <View className="h-32" />
      </ScrollView>
    </View>
  );
};

export default OfflineDashboard;
