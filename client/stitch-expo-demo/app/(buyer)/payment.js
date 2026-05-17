import React, { useState, useEffect } from 'react';
import { useColorScheme } from 'nativewind';
import { View, Text, TouchableOpacity, StatusBar, ActivityIndicator, Image } from 'react-native';
import { ChevronLeft, ShieldCheck, CheckCircle2, Lock } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function PaymentGateway() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { amount, id } = useLocalSearchParams();
  const [status, setStatus] = useState('processing'); // processing, success
  
  useEffect(() => {
    // Simulate Razorpay processing flow
    const timer = setTimeout(() => {
      setStatus('success');
      // Auto redirect to orders after showing success
      setTimeout(() => {
        router.push('/(buyer)/my-orders');
      }, 2500);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950 pt-12">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View className="px-4 flex-row items-center py-2 border-b border-gray-200 dark:border-zinc-800">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center mr-2">
          <ChevronLeft color={isDark ? "#ffffff" : "#0b1c30"} size={24} />
        </TouchableOpacity>
        <Text className="text-xl text-gray-900 dark:text-zinc-100 font-bold">Secure Checkout</Text>
      </View>

      <View className="flex-1 justify-center px-6">
        <View className="bg-white dark:bg-zinc-900 rounded-[30px] p-8 items-center shadow-sm border border-gray-200 dark:border-zinc-800">
          
          {status === 'processing' ? (
            <>
              <View className="w-24 h-24 mb-6 relative justify-center items-center">
                <ActivityIndicator size="large" color="#10b981" className="absolute" />
                <Lock color={isDark ? "#a1a1aa" : "#64748b"} size={24} />
              </View>
              <Text className="text-2xl font-bold text-gray-900 dark:text-zinc-100 mb-2">Processing Payment</Text>
              <Text className="text-center text-gray-500 dark:text-zinc-400 mb-6">
                Securing ₹{amount || '14,350'} in Smart Contract Escrow...
              </Text>
              <View className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl flex-row items-center">
                 <ShieldCheck color="#2563eb" size={16} />
                 <Text className="text-blue-700 dark:text-blue-400 text-xs font-bold ml-2">Razorpay Secure</Text>
              </View>
            </>
          ) : (
            <>
              <View className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full mb-6 items-center justify-center">
                <CheckCircle2 color="#10b981" size={48} />
              </View>
              <Text className="text-2xl font-bold text-gray-900 dark:text-zinc-100 mb-2">Payment Successful</Text>
              <Text className="text-center text-gray-500 dark:text-zinc-400 mb-6">
                Funds locked securely. Redirecting to your orders...
              </Text>
            </>
          )}

        </View>

        {/* UPI & Payment Apps Trust Badge Row */}
        <View className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 mt-6 shadow-sm">
          <Text className="text-[10px] text-gray-500 dark:text-zinc-400 font-black uppercase tracking-widest text-center mb-4">
            🔒 SECURE TRANSACTIONS MANAGED BY UPI & NPCI
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
          
          <Text className="text-[9px] text-gray-400 dark:text-zinc-500 font-bold text-center mt-4">
            Supports Google Pay, PhonePe, Paytm, BHIM UPI, and Netbanking via NPCI gateway.
          </Text>
        </View>
        
        <View className="mt-6 flex-row justify-center space-x-4 opacity-50">
           <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">UPI</Text>
           <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">•</Text>
           <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">CARDS</Text>
           <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">•</Text>
           <Text className="text-xs font-bold text-gray-400 uppercase tracking-widest">NETBANKING</Text>
        </View>
      </View>
    </View>
  );
}
