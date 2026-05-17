import React from 'react';
import { useColorScheme } from 'nativewind';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Image } from 'react-native';
import { ChevronLeft, PlusCircle, Building2, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { router } from 'expo-router';

const BankAccounts = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950 pt-12">
      <StatusBar style={isDark ? "light" : "dark"} />
      
      {/* Header */}
      <View className="px-4 flex-row items-center py-2 border-b border-gray-200 dark:border-zinc-800">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center mr-2">
          <ChevronLeft color={isDark ? "#ffffff" : "#0b1c30"} size={24} />
        </TouchableOpacity>
        <Text className="text-xl text-gray-900 dark:text-zinc-100 font-bold">Bank & Payouts</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-4 mt-4">
        
        {/* Payout Balance */}
        <View className="bg-emerald-800 dark:bg-emerald-900 rounded-[28px] p-6 mb-6 shadow-md">
           <Text className="text-white/80 text-sm font-bold uppercase mb-2">Available for Withdrawal</Text>
           <Text className="text-white text-[36px] font-black mb-4">₹42,500.00</Text>
           
           <TouchableOpacity className="bg-white py-3 rounded-xl items-center flex-row justify-center shadow-sm">
              <Text className="text-emerald-800 font-black text-sm">Withdraw to Bank</Text>
           </TouchableOpacity>
        </View>

        {/* NPCI Trust Badge row */}
        <View className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-5 mb-8 shadow-sm">
          <Text className="text-[10px] text-gray-500 dark:text-zinc-400 font-black uppercase tracking-widest text-center mb-3">
            🔒 SECURE SETTLEMENT BY NPCI & IMPS
          </Text>
          
          <View className="flex-row justify-around items-center h-12 px-2 mt-2">
            {/* BHIM UPI */}
            <View style={{ backgroundColor: '#ffffff', borderRadius: 20, padding: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 }}>
              <Image 
                source={{ uri: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/upi-icon.png' }}
                style={{ width: 36, height: 36, borderRadius: 18 }}
                resizeMode="contain"
              />
            </View>

            {/* Google Pay */}
            <View style={{ backgroundColor: '#ffffff', borderRadius: 20, padding: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 }}>
              <Image 
                source={{ uri: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-pay-icon.png' }}
                style={{ width: 36, height: 36, borderRadius: 18 }}
                resizeMode="contain"
              />
            </View>

            {/* PhonePe */}
            <View style={{ backgroundColor: '#ffffff', borderRadius: 20, padding: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 }}>
              <Image 
                source={{ uri: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/phonepe-icon.png' }}
                style={{ width: 36, height: 36, borderRadius: 18 }}
                resizeMode="contain"
              />
            </View>

            {/* Paytm */}
            <View style={{ backgroundColor: '#ffffff', borderRadius: 20, padding: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 }}>
              <Image 
                source={{ uri: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/paytm-icon.png' }}
                style={{ width: 36, height: 36, borderRadius: 18 }}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        <View className="flex-row justify-between items-center mb-4">
           <Text className="text-xl text-gray-900 dark:text-zinc-100 font-bold">Linked Accounts</Text>
           <TouchableOpacity className="flex-row items-center">
              <PlusCircle color="#006e2f" size={16} />
              <Text className="text-primary font-bold text-sm ml-1">Add New</Text>
           </TouchableOpacity>
        </View>

        {/* Primary Bank */}
        <View className="bg-white dark:bg-zinc-900 rounded-2xl p-4 mb-4 border-2 border-emerald-800 shadow-sm relative overflow-hidden">
           <View className="absolute top-0 right-0 bg-emerald-800 px-4 py-1 rounded-bl-xl">
              <Text className="text-white text-[10px] font-bold uppercase">Primary</Text>
           </View>
           
           <View className="flex-row items-center mb-4 mt-2">
              <View className="w-12 h-12 bg-gray-100 dark:bg-zinc-800/50 rounded-full items-center justify-center mr-4">
                 <Building2 color={isDark ? "#ffffff" : "#0b1c30"} size={24} />
              </View>
              <View>
                 <Text className="text-xl text-gray-900 dark:text-zinc-100 font-bold">State Bank of India</Text>
                 <Text className="text-sm text-gray-500 dark:text-zinc-400 font-medium">•••• •••• 4281</Text>
              </View>
           </View>
           
           <View className="flex-row items-center bg-green-50 self-start px-2 py-1 rounded">
              <CheckCircle2 color="#006e2f" size={14} />
              <Text className="text-green-700 text-[10px] font-bold ml-1">VERIFIED</Text>
           </View>
        </View>

        {/* Secondary Bank */}
        <View className="bg-white dark:bg-zinc-900 rounded-2xl p-4 mb-8 border border-gray-200 dark:border-zinc-800 shadow-sm relative">
           <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 bg-gray-100 dark:bg-zinc-800/50 rounded-full items-center justify-center mr-4">
                 <Building2 color={isDark ? "#ffffff" : "#0b1c30"} size={24} />
              </View>
              <View>
                 <Text className="text-xl text-gray-900 dark:text-zinc-100 font-bold">HDFC Bank</Text>
                 <Text className="text-sm text-gray-500 dark:text-zinc-400 font-medium">•••• •••• 9920</Text>
              </View>
           </View>
           
           <View className="flex-row justify-between items-center">
              <View className="flex-row items-center bg-amber-50 self-start px-2 py-1 rounded">
                 <AlertCircle color="#d97706" size={14} />
                 <Text className="text-amber-700 text-[10px] font-bold ml-1">PENDING VERIFICATION</Text>
              </View>
              <TouchableOpacity>
                 <Text className="text-emerald-800 font-bold text-xs">Make Primary</Text>
              </TouchableOpacity>
           </View>
        </View>

        <Text className="text-xl text-gray-900 dark:text-zinc-100 font-bold mb-4">Recent Transactions</Text>
        
        {/* Transaction 1 */}
        <View className="bg-white dark:bg-zinc-900 rounded-xl p-4 mb-2 flex-row justify-between items-center border border-gray-200 dark:border-zinc-800">
           <View className="flex-row items-center">
              <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-4">
                 <Text className="text-green-700 text-xl font-bold">₹</Text>
              </View>
              <View>
                 <Text className="text-gray-900 dark:text-zinc-100 font-bold text-lg">Payout: Order #8241</Text>
                 <Text className="text-xs text-gray-500 dark:text-zinc-400">14 May 2024 • 14:30</Text>
              </View>
           </View>
           <Text className="text-green-700 font-bold text-lg">+₹14,500</Text>
        </View>

        {/* Transaction 2 */}
        <View className="bg-white dark:bg-zinc-900 rounded-xl p-4 mb-2 flex-row justify-between items-center border border-gray-200 dark:border-zinc-800">
           <View className="flex-row items-center">
              <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-4">
                 <Text className="text-green-700 text-xl font-bold">₹</Text>
              </View>
              <View>
                 <Text className="text-gray-900 dark:text-zinc-100 font-bold text-lg">Payout: Order #8199</Text>
                 <Text className="text-xs text-gray-500 dark:text-zinc-400">10 May 2024 • 09:15</Text>
              </View>
           </View>
           <Text className="text-green-700 font-bold text-lg">+₹8,200</Text>
        </View>

        <View className="h-32" />
      </ScrollView>
    </View>
  );
};

export default BankAccounts;
