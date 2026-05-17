import React from 'react';
import { useColorScheme } from 'nativewind';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, TextInput, Image } from 'react-native';
import { ChevronLeft, Camera, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react-native';
import { router } from 'expo-router';

const ProfileDetails = () => {
  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950 pt-12">
      <StatusBar style={isDark ? "light" : "dark"} />
      
      {/* Header */}
      <View className="px-4 flex-row items-center py-2 border-b border-gray-200 dark:border-zinc-800">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center mr-2">
          <ChevronLeft color={isDark ? "#ffffff" : "#0b1c30"} size={24} />
        </TouchableOpacity>
        <Text className="text-xl text-gray-900 dark:text-zinc-100 font-bold">Personal Information</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-4 mt-4">
        
        {/* Photo Upload */}
        <View className="items-center mb-8 mt-4">
           <View className="relative">
              <View className="w-28 h-28 bg-gray-100 dark:bg-zinc-800/50 rounded-full items-center justify-center border-4 border-primary-container overflow-hidden">
                 <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400' }} 
                    className="w-full h-full"
                 />
              </View>
              <TouchableOpacity className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full items-center justify-center border-2 border-white shadow-sm">
                 <Camera color="#ffffff" size={18} />
              </TouchableOpacity>
           </View>
        </View>

        {/* Verification Status */}
        <View className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-8 flex-row items-start">
           <ShieldCheck color="#006e2f" size={20} className="mt-1" />
           <View className="ml-4 flex-1">
              <Text className="text-green-800 font-bold text-lg">Identity Verified</Text>
              <Text className="text-green-700 text-sm mt-1">Your Aadhaar and Kisan Card have been successfully verified.</Text>
           </View>
        </View>

        {/* Form Fields */}
        <View className="space-y-lg mb-8">
           <View>
              <Text className="text-xs text-gray-500 dark:text-zinc-400 font-bold mb-xs ml-1 uppercase">Full Name</Text>
              <View className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 h-14 rounded-xl px-4 justify-center shadow-sm opacity-70">
                 <Text className="text-gray-900 dark:text-zinc-100 text-lg font-medium">Ramesh Kumar</Text>
              </View>
           </View>

           <View>
              <Text className="text-xs text-gray-500 dark:text-zinc-400 font-bold mb-xs ml-1 uppercase">Phone Number</Text>
              <View className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 h-14 rounded-xl flex-row items-center px-4 shadow-sm">
                 <Phone color={isDark ? "#a1a1aa" : "#64748b"} size={18} />
                 <TextInput 
                   defaultValue="+91 98765 43210"
                   keyboardType="phone-pad"
                   className="flex-1 ml-4 text-gray-900 dark:text-zinc-100 font-medium text-lg"
                 />
              </View>
           </View>

           <View>
              <Text className="text-xs text-gray-500 dark:text-zinc-400 font-bold mb-xs ml-1 uppercase">Email Address</Text>
              <View className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 h-14 rounded-xl flex-row items-center px-4 shadow-sm">
                 <Mail color={isDark ? "#a1a1aa" : "#64748b"} size={18} />
                 <TextInput 
                   defaultValue="ramesh.k@example.com"
                   keyboardType="email-address"
                   className="flex-1 ml-4 text-gray-900 dark:text-zinc-100 font-medium text-lg"
                 />
              </View>
           </View>

           <View>
              <Text className="text-xs text-gray-500 dark:text-zinc-400 font-bold mb-xs ml-1 uppercase">Farm Location</Text>
              <View className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl flex-row items-start p-4 shadow-sm">
                 <MapPin color={isDark ? "#a1a1aa" : "#64748b"} size={18} className="mt-1" />
                 <TextInput 
                   defaultValue="Plot 42, Green Valley Farms,\nVidisha District,\nMadhya Pradesh 464001"
                   multiline
                   numberOfLines={3}
                   className="flex-1 ml-4 text-gray-900 dark:text-zinc-100 font-medium text-lg"
                 />
              </View>
           </View>
        </View>

        <TouchableOpacity 
          onPress={() => router.back()}
          className="bg-primary h-14 rounded-xl items-center justify-center shadow-md mb-8"
        >
           <Text className="text-white font-bold text-base">Save Changes</Text>
        </TouchableOpacity>
        
        <View className="h-32" />
      </ScrollView>
    </View>
  );
};

export default ProfileDetails;
