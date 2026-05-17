import React from 'react';
import { useColorScheme } from 'nativewind';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Image, Alert, Linking } from 'react-native';
import { ChevronLeft, Package, MapPin, Truck, CheckCircle2, Phone, MessageSquare, Clock } from 'lucide-react-native';
import { router } from 'expo-router';

export default function TrackShipments() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const milestones = [
    { id: 1, title: 'Picked Up from Farm', time: '10:30 AM, 14 May', completed: true, active: false },
    { id: 2, title: 'In Transit', time: 'Currently near Nashik Highway', completed: false, active: true },
    { id: 3, title: 'Delivery & Escrow Release', time: 'Estimated 15 May', completed: false, active: false },
  ];

  const handleCallDriver = () => {
    Alert.alert(
      "Contact Logistics Partner",
      "Calling Rajesh G. (Driver) at +91 98765 43210...",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Call", onPress: () => Linking.openURL('tel:+919876543210').catch(() => Alert.alert("Error", "Direct calling not supported on this simulator.")) }
      ]
    );
  };

  const handleMessageDriver = () => {
    Alert.alert(
      "Secure Messaging",
      "Direct encrypted messaging with logistics partner is enabled.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Chat", onPress: () => Alert.alert("Chat Initiated", "Direct encrypted gateway established with Rajesh G.") }
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950 pt-12">
      <StatusBar style={isDark ? "light" : "dark"} />
      
      <View className="px-4 flex-row items-center py-2 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center mr-2">
          <ChevronLeft color={isDark ? "#ffffff" : "#0b1c30"} size={24} />
        </TouchableOpacity>
        <Text className="text-xl text-gray-900 dark:text-zinc-100 font-black">Track Shipments</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-4">
        {/* Package Identity Card */}
        <View className="bg-white dark:bg-zinc-900 rounded-[30px] p-6 mt-6 border border-gray-150 dark:border-zinc-800 shadow-sm">
           <View className="flex-row items-center mb-4">
             <View className="w-10 h-10 bg-green-50 dark:bg-green-950 rounded-xl items-center justify-center mr-3">
               <Package color="#10b981" size={20} />
             </View>
             <View>
               <Text className="text-xs text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-widest">Cargo Description</Text>
               <Text className="text-lg font-black text-gray-900 dark:text-zinc-100">450kg Roma Tomatoes</Text>
             </View>
           </View>

           <View className="h-[1px] bg-gray-100 dark:bg-zinc-800 my-4" />

           {milestones.map((step, index) => (
             <View key={step.id} className="flex-row mb-6">
                <View className="items-center mr-4">
                   <View className={`w-8 h-8 rounded-full items-center justify-center ${
                     step.completed 
                       ? 'bg-[#10b981]' 
                       : step.active 
                         ? 'border-2 border-[#10b981] bg-white dark:bg-zinc-900' 
                         : 'bg-gray-100 dark:bg-zinc-800/50'
                   }`}>
                      {step.completed ? (
                        <CheckCircle2 color="#ffffff" size={16} />
                      ) : (
                        <View className={`w-2.5 h-2.5 rounded-full ${step.active ? 'bg-[#10b981]' : 'bg-transparent'}`} />
                      )}
                   </View>
                   {index !== milestones.length - 1 && (
                     <View className={`w-[2px] flex-1 my-1.5 ${step.completed ? 'bg-[#10b981]' : 'bg-gray-200 dark:bg-zinc-850'}`} />
                   )}
                </View>
                <View className="flex-1 pb-4 justify-center">
                   <Text className={`text-base font-bold ${step.active || step.completed ? 'text-gray-900 dark:text-zinc-100' : 'text-gray-500 dark:text-zinc-400'}`}>{step.title}</Text>
                   <Text className="text-xs text-gray-400 dark:text-zinc-500 mt-1 font-semibold">{step.time}</Text>
                </View>
             </View>
           ))}
        </View>

        {/* Driver Contact Card */}
        <View className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-[30px] p-5 flex-row items-center mt-6 shadow-sm">
           <View className="w-14 h-14 bg-gray-100 dark:bg-zinc-800 rounded-full items-center justify-center mr-4 overflow-hidden border-2 border-[#10b981]/20">
              <Image source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200' }} className="w-full h-full" />
           </View>
           <View className="flex-1">
              <Text className="text-base font-black text-gray-900 dark:text-zinc-100">Rajesh G. (Driver)</Text>
              <View className="flex-row items-center mt-1">
                 <Truck color={isDark ? "#a1a1aa" : "#64748b"} size={12} />
                 <Text className="text-xs text-gray-500 dark:text-zinc-400 ml-1 font-bold">Speedy-X Logistics</Text>
              </View>
           </View>
           <View className="flex-row gap-2">
              <TouchableOpacity 
                onPress={handleCallDriver}
                className="w-10 h-10 bg-green-50 dark:bg-green-950/40 rounded-full items-center justify-center border border-green-200 dark:border-green-800/40"
              >
                 <Phone color="#10b981" size={18} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleMessageDriver}
                className="w-10 h-10 bg-blue-50 dark:bg-blue-950/40 rounded-full items-center justify-center border border-blue-200 dark:border-blue-800/40"
              >
                 <MessageSquare color="#3b82f6" size={18} />
              </TouchableOpacity>
           </View>
        </View>
      </ScrollView>
    </View>
  );
}
