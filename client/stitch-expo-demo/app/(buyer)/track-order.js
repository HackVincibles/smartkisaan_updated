import React from 'react';
import { useColorScheme } from 'nativewind';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Image } from 'react-native';
import { 
  ChevronLeft, 
  Package, 
  MapPin, 
  Truck, 
  CheckCircle2,
  Phone,
  MessageCircle,
  Clock,
  ArrowRight
} from 'lucide-react-native';
import { router } from 'expo-router';

const TrackOrder = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const milestones = [
    { id: 1, title: 'Order Confirmed', time: '10:30 AM, 14 May', completed: true, active: false },
    { id: 2, title: 'Quality Verified', time: '02:15 PM, 14 May', completed: true, active: false },
    { id: 3, title: 'In Transit', time: 'Expected by 6:00 PM', completed: false, active: true },
    { id: 4, title: 'Delivered', time: 'Estimated 15 May', completed: false, active: false },
  ];

  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950 pt-12">
      <StatusBar style={isDark ? "light" : "dark"} />
      
      {/* Header */}
      <View className="px-4 flex-row items-center py-2 border-b border-gray-200 dark:border-zinc-800">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center mr-2">
          <ChevronLeft color={isDark ? "#ffffff" : "#0b1c30"} size={24} />
        </TouchableOpacity>
        <Text className="text-xl text-gray-900 dark:text-zinc-100 font-bold">Track Shipment</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        
        {/* Map Placeholder */}
        <View className="h-64 bg-gray-100 dark:bg-zinc-800/50 relative">
           <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800' }} 
              className="w-full h-full opacity-50"
              resizeMode="cover"
           />
           <View className="absolute inset-0 items-center justify-center">
              <View className="w-12 h-12 bg-primary rounded-full items-center justify-center shadow-lg">
                 <Truck color="#ffffff" size={24} />
              </View>
              <View className="bg-white dark:bg-zinc-900 px-4 py-1 rounded-full mt-sm shadow-sm">
                 <Text className="text-[10px] font-bold text-gray-900 dark:text-zinc-100">SPEEDY-X DISPATCH</Text>
              </View>
           </View>
        </View>

        <View className="px-4 -mt-8 bg-white dark:bg-zinc-900 rounded-t-[40px] pt-xl shadow-lg flex-1">
           <View className="flex-row justify-between items-start mb-8">
              <View>
                 <Text className="text-xs text-gray-500 dark:text-zinc-400 font-bold uppercase">Order #SK-22481</Text>
                 <Text className="text-xl font-bold text-gray-900 dark:text-zinc-100 mt-1">450kg Roma Tomatoes</Text>
              </View>
              <View className="items-end">
                 <Text className="text-xs text-gray-500 dark:text-zinc-400 font-bold">ETA</Text>
                 <Text className="text-xl font-bold text-primary">18:00 Today</Text>
              </View>
           </View>

           {/* Milestones */}
           <View className="mb-8">
              {milestones.map((step, index) => (
                <View key={step.id} className="flex-row mb-6">
                   <View className="items-center mr-lg">
                      <View className={`w-6 h-6 rounded-full items-center justify-center ${step.completed ? 'bg-primary' : step.active ? 'border-2 border-primary bg-white dark:bg-zinc-900' : 'bg-gray-100 dark:bg-zinc-800/50-high'}`}>
                         {step.completed ? <CheckCircle2 color="#ffffff" size={14} /> : <View className={`w-2 h-2 rounded-full ${step.active ? 'bg-primary' : 'bg-outline-variant'}`} />}
                      </View>
                      {index !== milestones.length - 1 && (
                        <View className={`w-[2px] flex-1 my-1 ${step.completed ? 'bg-primary' : 'bg-outline-variant'}`} />
                      )}
                   </View>
                   <View className="flex-1 pb-4">
                      <Text className={`text-lg font-bold ${step.active || step.completed ? 'text-gray-900 dark:text-zinc-100' : 'text-gray-500 dark:text-zinc-400'}`}>{step.title}</Text>
                      <Text className="text-sm text-gray-500 dark:text-zinc-400 mt-1">{step.time}</Text>
                   </View>
                </View>
              ))}
           </View>

           {/* Transporter Card */}
           <View className="bg-gray-100 dark:bg-zinc-800/50 rounded-2xl p-6 flex-row items-center mb-8">
              <View className="w-14 h-14 bg-white dark:bg-zinc-900 rounded-full items-center justify-center mr-4 overflow-hidden">
                 <Image source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200' }} className="w-full h-full" />
              </View>
              <View className="flex-1">
                 <Text className="text-lg font-bold text-gray-900 dark:text-zinc-100">Rajesh G. (Driver)</Text>
                 <View className="flex-row items-center mt-1">
                    <Clock color={isDark ? "#a1a1aa" : "#64748b"} size={12} />
                    <Text className="text-xs text-gray-500 dark:text-zinc-400 ml-1">Speedy-X Logistics</Text>
                 </View>
              </View>
              <View className="flex-row space-x-sm">
                 <TouchableOpacity className="w-10 h-10 bg-white dark:bg-zinc-900 rounded-full items-center justify-center border border-gray-200 dark:border-zinc-800">
                    <Phone color="#006e2f" size={18} />
                 </TouchableOpacity>
                 <TouchableOpacity className="w-10 h-10 bg-white dark:bg-zinc-900 rounded-full items-center justify-center border border-gray-200 dark:border-zinc-800">
                    <MessageCircle color="#006e2f" size={18} />
                 </TouchableOpacity>
              </View>
           </View>
        </View>

        <View className="h-32" />
      </ScrollView>
    </View>
  );
};

export default TrackOrder;
