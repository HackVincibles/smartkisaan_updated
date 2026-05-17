import React from 'react';
import { useColorScheme } from 'nativewind';
import { View, Text, TouchableOpacity, StatusBar, Image } from 'react-native';
import { router } from 'expo-router';
import { Rocket, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react-native';

const SystemUpgrade = () => {
  return (
    <View className="flex-1 bg-white dark:bg-zinc-900">
      <StatusBar style={isDark ? "light" : "dark"} />
      
      <View className="flex-1 items-center justify-center px-4 pt-20">
        <View className="w-32 h-32 bg-primary-container rounded-full items-center justify-center mb-8 shadow-lg shadow-primary/20">
           <Rocket color="#006e2f" size={56} />
        </View>
        
        <View className="bg-green-100 px-4 py-1.5 rounded-full flex-row items-center mb-4">
           <Sparkles color="#006e2f" size={14} />
           <Text className="text-green-700 text-[10px] font-bold ml-1 uppercase tracking-widest">v2.0 Update Available</Text>
        </View>

        <Text className="text-2xl text-gray-900 dark:text-zinc-100 font-bold text-center leading-tight">Elevating Your Agricultural Trading Experience.</Text>
        <Text className="text-lg text-gray-500 dark:text-zinc-400 text-center mt-4">A newer, faster, and more secure version of Smart-Kissan is ready for you.</Text>

        <View className="mt-8 w-full space-y-md">
           <View className="flex-row items-center bg-gray-100 dark:bg-zinc-800/50 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800">
              <View className="w-10 h-10 bg-white dark:bg-zinc-900 rounded-lg items-center justify-center mr-4 shadow-sm">
                 <CheckCircle2 color="#006e2f" size={20} />
              </View>
              <View className="flex-1">
                 <Text className="text-lg font-bold text-gray-900 dark:text-zinc-100">Enhanced AI Grading</Text>
                 <Text className="text-xs text-gray-500 dark:text-zinc-400">3x faster crop verification accuracy.</Text>
              </View>
           </View>

           <View className="flex-row items-center bg-gray-100 dark:bg-zinc-800/50 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800">
              <View className="w-10 h-10 bg-white dark:bg-zinc-900 rounded-lg items-center justify-center mr-4 shadow-sm">
                 <CheckCircle2 color="#006e2f" size={20} />
              </View>
              <View className="flex-1">
                 <Text className="text-lg font-bold text-gray-900 dark:text-zinc-100">Offline Mode</Text>
                 <Text className="text-xs text-gray-500 dark:text-zinc-400">Manage inventory without internet.</Text>
              </View>
           </View>
        </View>
      </View>

      {/* Footer */}
      <View className="px-4 pb-xl pt-sm">
        <TouchableOpacity 
          onPress={() => router.push('/')}
          className="bg-primary h-16 rounded-2xl flex-row items-center justify-center shadow-lg"
        >
          <Text className="text-white font-bold text-xl mr-2">Update Now</Text>
          <ArrowRight color="#ffffff" size={20} />
        </TouchableOpacity>
        <TouchableOpacity className="mt-4 items-center py-2">
           <Text className="text-gray-500 dark:text-zinc-400 font-bold text-sm">Remind Me Later</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SystemUpgrade;
