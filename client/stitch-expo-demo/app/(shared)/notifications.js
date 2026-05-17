import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { ArrowLeft, Bell, CheckCircle2, ShieldAlert } from 'lucide-react-native';

const NOTIFICATIONS = [
  { id: 1, title: 'Bid Accepted!', desc: 'Your bid for 500kg Wheat was accepted.', time: '2h ago', icon: CheckCircle2, color: '#10b981' },
  { id: 2, title: 'KYC Verified', desc: 'Your account is fully verified.', time: '1d ago', icon: ShieldAlert, color: '#3b82f6' },
  { id: 3, title: 'New Message', desc: 'Logistics provider updated ETA.', time: '2d ago', icon: Bell, color: '#f59e0b' },
];

export default function Notifications() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950">
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View className="px-6 pt-14 pb-4 flex-row items-center border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-full items-center justify-center mr-4">
          <ArrowLeft color={isDark ? "#ffffff" : "#000000"} size={20} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 dark:text-zinc-100">Notifications</Text>
      </View>
      <ScrollView className="flex-1 px-4 py-4">
        {NOTIFICATIONS.map(n => (
          <View key={n.id} className="flex-row bg-white dark:bg-zinc-900 p-4 rounded-2xl mb-3 shadow-sm border border-gray-100 dark:border-zinc-800">
            <View className="w-12 h-12 rounded-full items-center justify-center mr-4" style={{ backgroundColor: n.color + '20' }}>
              <n.icon color={n.color} size={24} />
            </View>
            <View className="flex-1 justify-center">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-base font-bold text-gray-900 dark:text-zinc-100">{n.title}</Text>
                <Text className="text-xs text-gray-500 dark:text-zinc-400">{n.time}</Text>
              </View>
              <Text className="text-sm text-gray-600 dark:text-zinc-400">{n.desc}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
