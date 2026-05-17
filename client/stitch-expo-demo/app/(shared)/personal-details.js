import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { ArrowLeft, User, Phone, Mail, Camera, Save } from 'lucide-react-native';

export default function PersonalDetails() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [name, setName] = useState("Ramesh Kumar");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [email, setEmail] = useState("ramesh@example.com");

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Validation Error", "Name field cannot be left blank.");
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      Alert.alert("Validation Error", "Please provide a valid 10-digit mobile number.");
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert("Validation Error", "Please provide a valid email address.");
      return;
    }
    Alert.alert("Profile Updated", "Your personal details have been saved successfully.", [
      { text: "OK", onPress: () => router.back() }
    ]);
  };

  const handleAvatarUpdate = () => {
    Alert.alert("Change Photo", "Upload new avatar photo", [
      { text: "Take Photo", onPress: () => Alert.alert("Camera activated") },
      { text: "Choose from Library", onPress: () => Alert.alert("Gallery opened") },
      { text: "Cancel", style: "cancel" }
    ]);
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950">
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View className="px-6 pt-14 pb-4 flex-row items-center border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-full items-center justify-center mr-4">
          <ArrowLeft color={isDark ? "#ffffff" : "#000000"} size={20} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 dark:text-zinc-100">Personal Details</Text>
      </View>
      <ScrollView className="flex-1 px-4 py-6">
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-gray-200 dark:bg-zinc-800 rounded-full items-center justify-center mb-4 border-4 border-white dark:border-zinc-900 shadow-sm">
            <User color={isDark ? "#52525b" : "#9ca3af"} size={40} />
            <TouchableOpacity 
              onPress={handleAvatarUpdate}
              className="absolute bottom-0 right-0 w-8 h-8 bg-[#10b981] rounded-full items-center justify-center border-2 border-white dark:border-zinc-900"
            >
              <Camera color="#fff" size={14} />
            </TouchableOpacity>
          </View>
        </View>
        <View className="space-y-4">
          <View>
            <Text className="text-sm font-bold text-gray-700 dark:text-zinc-300 mb-2 ml-1">Full Name</Text>
            <View className="flex-row items-center bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl px-4 py-3 shadow-sm">
              <User color={isDark ? "#71717a" : "#9ca3af"} size={20} />
              <TextInput 
                className="flex-1 ml-3 text-gray-900 dark:text-zinc-100 font-semibold" 
                value={name} 
                onChangeText={setName}
                placeholderTextColor={isDark ? "#71717a" : "#9ca3af"} 
              />
            </View>
          </View>
          <View>
            <Text className="text-sm font-bold text-gray-700 dark:text-zinc-300 mb-2 ml-1">Phone Number</Text>
            <View className="flex-row items-center bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl px-4 py-3 shadow-sm">
              <Phone color={isDark ? "#71717a" : "#9ca3af"} size={20} />
              <TextInput 
                className="flex-1 ml-3 text-gray-900 dark:text-zinc-100 font-semibold" 
                value={phone} 
                onChangeText={setPhone}
                keyboardType="phone-pad" 
                placeholderTextColor={isDark ? "#71717a" : "#9ca3af"} 
              />
            </View>
          </View>
          <View>
            <Text className="text-sm font-bold text-gray-700 dark:text-zinc-300 mb-2 ml-1">Email Address</Text>
            <View className="flex-row items-center bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl px-4 py-3 shadow-sm">
              <Mail color={isDark ? "#71717a" : "#9ca3af"} size={20} />
              <TextInput 
                className="flex-1 ml-3 text-gray-900 dark:text-zinc-100 font-semibold" 
                value={email} 
                onChangeText={setEmail}
                keyboardType="email-address" 
                placeholderTextColor={isDark ? "#71717a" : "#9ca3af"} 
              />
            </View>
          </View>
        </View>
        <TouchableOpacity 
          onPress={handleSave}
          className="mt-8 bg-[#10b981] h-14 rounded-2xl flex-row items-center justify-center"
          style={{
            shadowColor: '#10b981',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Save color="#fff" size={20} />
          <Text className="text-white font-bold text-lg ml-2">Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

