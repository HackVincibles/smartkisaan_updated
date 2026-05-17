import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { ArrowLeft, Star } from 'lucide-react-native';

const REVIEWS = [
  { id: 1, name: "Suresh Farmer", rating: 5, date: "Oct 12, 2025", text: "Great buyer, prompt payment and clear communication. Will trade again." },
  { id: 2, name: "Speedy Logistics", rating: 4, date: "Sep 28, 2025", text: "Crop was ready for pickup right on time. Good packaging." },
];

export default function Reviews() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950">
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View className="px-6 pt-14 pb-4 flex-row items-center border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-full items-center justify-center mr-4">
          <ArrowLeft color={isDark ? "#ffffff" : "#000000"} size={20} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 dark:text-zinc-100">Reviews & Ratings</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        <View className="items-center bg-white dark:bg-zinc-900 rounded-3xl p-8 mb-8 border border-gray-200 dark:border-zinc-800 shadow-sm">
          <Text className="text-5xl font-black text-gray-900 dark:text-zinc-100 mb-2">4.8</Text>
          <View className="flex-row mb-2">
            {[1,2,3,4,5].map(i => <Star key={i} color="#f59e0b" fill={i <= 4 ? "#f59e0b" : "transparent"} size={20} className="mx-0.5" />)}
          </View>
          <Text className="text-sm text-gray-500 dark:text-zinc-400 font-bold">Based on 24 reviews</Text>
        </View>

        <View className="bg-white dark:bg-zinc-900 rounded-3xl p-6 mb-8 border border-gray-200 dark:border-zinc-800 shadow-sm">
          <Text className="text-sm font-bold text-gray-900 dark:text-zinc-100 mb-4">Write a Review</Text>
          <View className="flex-row mb-4">
             {[1,2,3,4,5].map(i => (
               <TouchableOpacity key={i} onPress={() => {}} className="mr-2">
                 <Star color="#f59e0b" fill={i <= 4 ? "#f59e0b" : "transparent"} size={28} />
               </TouchableOpacity>
             ))}
          </View>
          <View className="bg-gray-50 dark:bg-zinc-800 rounded-2xl border border-gray-200 dark:border-zinc-700 p-4 mb-4 min-h-[100px]">
             <Text className="text-gray-400 dark:text-zinc-500">Share your experience with this transaction...</Text>
          </View>
          <TouchableOpacity 
            onPress={() => alert('Review submitted successfully! Pending on-chain verification.')}
            className="bg-[#0f172a] h-12 rounded-xl items-center justify-center"
          >
             <Text className="text-white font-bold">Submit Review</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-sm font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest mb-4 ml-1">Recent Reviews</Text>
        
        {REVIEWS.map(r => (
          <View key={r.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5 mb-4 shadow-sm">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-base font-bold text-gray-900 dark:text-zinc-100">{r.name}</Text>
              <Text className="text-xs text-gray-500 dark:text-zinc-400">{r.date}</Text>
            </View>
            <View className="flex-row mb-3">
              {[1,2,3,4,5].map(i => <Star key={i} color="#f59e0b" fill={i <= r.rating ? "#f59e0b" : "transparent"} size={14} className="mr-0.5" />)}
            </View>
            <Text className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed">{r.text}</Text>
          </View>
        ))}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
