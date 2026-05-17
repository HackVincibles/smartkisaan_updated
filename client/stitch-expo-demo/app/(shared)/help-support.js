import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { ArrowLeft, MessageSquare, Phone, ChevronDown, ChevronUp } from 'lucide-react-native';

const FAQS = [
  { q: "How do I withdraw my earnings?", a: "Go to Bank Accounts & Payouts, select your preferred bank account, and tap 'Withdraw'. Funds usually settle within 24 hours." },
  { q: "How does AI Grading work?", a: "Our AI analyzes the visual characteristics of your crop using computer vision to estimate grade, quality, and freshness instantly." },
  { q: "Can I cancel a bid after accepting?", a: "Once a bid is accepted, it becomes a binding contract. Please contact support immediately if there is an emergency." }
];

export default function HelpSupport() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950">
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View className="px-6 pt-14 pb-4 flex-row items-center border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-full items-center justify-center mr-4">
          <ArrowLeft color={isDark ? "#ffffff" : "#000000"} size={20} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 dark:text-zinc-100">Help & Support</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        <Text className="text-2xl font-black text-gray-900 dark:text-zinc-100 mb-6">How can we help you?</Text>
        
        <View className="flex-row gap-4 mb-8">
          <TouchableOpacity className="flex-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-5 rounded-2xl items-center shadow-sm">
            <View className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full items-center justify-center mb-3">
              <MessageSquare color="#3b82f6" size={24} />
            </View>
            <Text className="text-gray-900 dark:text-zinc-100 font-bold">Live Chat</Text>
            <Text className="text-xs text-gray-500 mt-1">Typical reply: 5m</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-5 rounded-2xl items-center shadow-sm">
            <View className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-full items-center justify-center mb-3">
              <Phone color="#10b981" size={24} />
            </View>
            <Text className="text-gray-900 dark:text-zinc-100 font-bold">Call Us</Text>
            <Text className="text-xs text-gray-500 mt-1">Toll-free 24/7</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-sm font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest mb-4 ml-1">Frequently Asked Questions</Text>
        
        <View className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden mb-10">
          {FAQS.map((faq, index) => (
            <View key={index} className={`border-b border-gray-100 dark:border-zinc-800 ${index === FAQS.length - 1 ? 'border-b-0' : ''}`}>
              <TouchableOpacity 
                onPress={() => setOpenFaq(openFaq === index ? -1 : index)}
                className="flex-row justify-between items-center p-5"
              >
                <Text className="flex-1 text-base font-bold text-gray-900 dark:text-zinc-100 pr-4">{faq.q}</Text>
                {openFaq === index ? <ChevronUp color={isDark ? "#a1a1aa" : "#6b7280"} size={20} /> : <ChevronDown color={isDark ? "#a1a1aa" : "#6b7280"} size={20} />}
              </TouchableOpacity>
              {openFaq === index && (
                <View className="px-5 pb-5 pt-0">
                  <Text className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">{faq.a}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}
