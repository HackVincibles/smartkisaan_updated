import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Switch, Alert } from 'react-native';
import { ChevronLeft, Moon, Sun, Bell, ShieldCheck, Globe, HelpCircle, LogOut, Trash2 } from 'lucide-react-native';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';

const SettingsScreen = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);
  const [biometrics, setBiometrics] = useState(true);

  const handleLanguageChange = () => {
    Alert.alert(
      "Select Language",
      "Choose your preferred language",
      [
        { text: "English (US)", onPress: () => Alert.alert("Language set to English") },
        { text: "हिन्दी (Hindi)", onPress: () => Alert.alert("Language set to Hindi") },
        { text: "मराठी (Marathi)", onPress: () => Alert.alert("Language set to Marathi") },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      "Clear Cache",
      "Are you sure you want to clear the app cache? This will free up 24MB.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", onPress: () => Alert.alert("Success", "Cache cleared successfully!") }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: () => router.replace('/') }
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950 pt-12">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View className="px-4 flex-row items-center py-4 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center mr-2 bg-gray-100 dark:bg-zinc-800 rounded-full">
          <ChevronLeft color={isDark ? "#ffffff" : "#0b1c30"} size={24} />
        </TouchableOpacity>
        <Text className="text-xl text-gray-900 dark:text-zinc-100 font-black">App Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-4 mt-6">
        
        {/* Appearance Settings */}
        <Text className="text-xs text-gray-500 dark:text-zinc-400 font-black mb-2 uppercase tracking-widest">Appearance</Text>
        <View className="bg-white dark:bg-zinc-900 rounded-2xl mb-6 border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
           <View className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center">
                 <View className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-xl items-center justify-center mr-4">
                    {isDark ? <Moon color="#10b981" size={20} /> : <Sun color="#006e2f" size={20} />}
                 </View>
                 <View>
                    <Text className="text-base font-bold text-gray-900 dark:text-zinc-100">Dark Mode</Text>
                    <Text className="text-xs text-gray-500 dark:text-zinc-400">Reduce glare and improve battery</Text>
                 </View>
              </View>
              <Switch 
                 value={isDark}
                 onValueChange={toggleColorScheme}
                 trackColor={{ false: '#d1d5db', true: '#10b981' }}
                 thumbColor={'#ffffff'}
              />
           </View>
        </View>

        {/* Notifications */}
        <Text className="text-xs text-gray-500 dark:text-zinc-400 font-black mb-2 uppercase tracking-widest">Notifications</Text>
        <View className="bg-white dark:bg-zinc-900 rounded-2xl mb-6 border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
           <View className="flex-row items-center justify-between p-4 border-b border-gray-50 dark:border-zinc-800/50">
              <View className="flex-row items-center">
                 <View className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-xl items-center justify-center mr-4">
                    <Bell color="#006e2f" size={20} />
                 </View>
                 <View>
                    <Text className="text-base font-bold text-gray-900 dark:text-zinc-100">Push Notifications</Text>
                    <Text className="text-xs text-gray-500 dark:text-zinc-400">Bids, orders and market alerts</Text>
                 </View>
              </View>
              <Switch 
                 value={pushNotif}
                 onValueChange={setPushNotif}
                 trackColor={{ false: '#d1d5db', true: '#10b981' }}
                 thumbColor={'#ffffff'}
              />
           </View>
           
           <View className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center">
                 <View className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-xl items-center justify-center mr-4">
                    <Bell color="#6b7280" size={20} />
                 </View>
                 <View>
                    <Text className="text-base font-bold text-gray-900 dark:text-zinc-100">Email Updates</Text>
                    <Text className="text-xs text-gray-500 dark:text-zinc-400">Weekly reports and invoices</Text>
                 </View>
              </View>
              <Switch 
                 value={emailNotif}
                 onValueChange={setEmailNotif}
                 trackColor={{ false: '#d1d5db', true: '#10b981' }}
                 thumbColor={'#ffffff'}
              />
           </View>
        </View>

        {/* Preferences */}
        <Text className="text-xs text-gray-500 dark:text-zinc-400 font-black mb-2 uppercase tracking-widest">Preferences</Text>
        <View className="bg-white dark:bg-zinc-900 rounded-2xl mb-6 border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
           <TouchableOpacity onPress={handleLanguageChange} className="flex-row items-center justify-between p-4 border-b border-gray-50 dark:border-zinc-800/50">
              <View className="flex-row items-center">
                 <View className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-xl items-center justify-center mr-4">
                    <Globe color="#006e2f" size={20} />
                 </View>
                 <View>
                    <Text className="text-base font-bold text-gray-900 dark:text-zinc-100">Language</Text>
                    <Text className="text-xs text-gray-500 dark:text-zinc-400">English (US)</Text>
                 </View>
              </View>
              <ChevronLeft color="#9ca3af" size={16} style={{ transform: [{ rotate: '180deg' }] }} />
           </TouchableOpacity>
           
           <View className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center">
                 <View className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-xl items-center justify-center mr-4">
                    <ShieldCheck color="#006e2f" size={20} />
                 </View>
                 <View>
                    <Text className="text-base font-bold text-gray-900 dark:text-zinc-100">Biometric Login</Text>
                    <Text className="text-xs text-gray-500 dark:text-zinc-400">Use fingerprint or FaceID</Text>
                 </View>
              </View>
              <Switch 
                 value={biometrics}
                 onValueChange={setBiometrics}
                 trackColor={{ false: '#d1d5db', true: '#10b981' }}
                 thumbColor={'#ffffff'}
              />
           </View>
        </View>
        
        {/* Support & Data */}
        <Text className="text-xs text-gray-500 dark:text-zinc-400 font-black mb-2 uppercase tracking-widest">Support & Data</Text>
        <View className="bg-white dark:bg-zinc-900 rounded-2xl mb-6 border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
           <TouchableOpacity onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Help & Support', description: 'Contact our 24/7 support team' } })} className="flex-row items-center justify-between p-4 border-b border-gray-50 dark:border-zinc-800/50">
              <View className="flex-row items-center">
                 <View className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-xl items-center justify-center mr-4">
                    <HelpCircle color="#006e2f" size={20} />
                 </View>
                 <View>
                    <Text className="text-base font-bold text-gray-900 dark:text-zinc-100">Help & Support</Text>
                    <Text className="text-xs text-gray-500 dark:text-zinc-400">Contact us, FAQs</Text>
                 </View>
              </View>
              <ChevronLeft color="#9ca3af" size={16} style={{ transform: [{ rotate: '180deg' }] }} />
           </TouchableOpacity>
           
           <TouchableOpacity onPress={handleClearCache} className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center">
                 <View className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-xl items-center justify-center mr-4">
                    <Trash2 color="#ef4444" size={20} />
                 </View>
                 <View>
                    <Text className="text-base font-bold text-gray-900 dark:text-zinc-100">Clear Cache</Text>
                    <Text className="text-xs text-gray-500 dark:text-zinc-400">Free up local space</Text>
                 </View>
              </View>
              <ChevronLeft color="#9ca3af" size={16} style={{ transform: [{ rotate: '180deg' }] }} />
           </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity 
          onPress={handleLogout}
          className="bg-white dark:bg-zinc-900 rounded-2xl mb-12 border border-red-100 dark:border-red-900/50 shadow-sm p-4 flex-row items-center justify-center"
        >
          <LogOut color="#ef4444" size={20} />
          <Text className="text-base font-black text-red-500 ml-2">Logout Account</Text>
        </TouchableOpacity>
        
        <View className="items-center mb-8">
          <Text className="text-xs text-gray-400 dark:text-zinc-600 font-bold">SmartKissan v1.2.0 (Build 42)</Text>
        </View>

        <View className="h-32" />
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
