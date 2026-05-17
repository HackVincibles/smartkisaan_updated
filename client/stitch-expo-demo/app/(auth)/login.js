import React from 'react';
import { useColorScheme } from 'nativewind';
import { View, Text, TextInput, TouchableOpacity, StatusBar, Alert, Modal, ActivityIndicator, Animated } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Mail, Lock, Phone, Fingerprint, Eye, EyeOff } from 'lucide-react-native';

const LoginScreen = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [showBiometric, setShowBiometric] = React.useState(false);
  const [showGoogle, setShowGoogle] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  
  const scanAnim = React.useRef(new Animated.Value(0)).current;

  const triggerBiometric = () => {
    setShowBiometric(true);
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 0, duration: 1000, useNativeDriver: true })
      ])
    ).start();

    setTimeout(() => {
      setShowBiometric(false);
      router.push('/(farmer)/dashboard');
    }, 2500);
  };

  const triggerGoogle = () => {
    setShowGoogle(true);
    setTimeout(() => {
      setShowGoogle(false);
      router.push('/(farmer)/dashboard');
    }, 2000);
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950 pt-12">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View className="px-4 py-2">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center">
          <ChevronLeft color={isDark ? "#ffffff" : "#0b1c30"} size={24} />
        </TouchableOpacity>
      </View>

      <View className="px-4 flex-1">
        <Text className="text-2xl text-gray-900 dark:text-zinc-100 font-bold mt-4">Welcome Back!</Text>
        <Text className="text-lg text-gray-500 dark:text-zinc-400 mt-2">Sign in to continue trading with verified members.</Text>

        <View className="mt-8">
           <View className="mb-4">
              <Text className="text-sm text-gray-900 dark:text-zinc-100 font-semibold mb-2">Phone Number or Email</Text>
              <View className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex-row items-center px-4 rounded-xl">
                <Phone color="#6d7b6c" size={18} />
                <TextInput 
                  placeholder="+91 98765 43210"
                  placeholderTextColor={isDark ? "#71717a" : "#a1a1aa"}
                  className="flex-1 p-4 text-gray-900 dark:text-zinc-100"
                />
              </View>
           </View>

           <View className="mb-6">
              <Text className="text-sm text-gray-900 dark:text-zinc-100 font-semibold mb-2">Password</Text>
              <View className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex-row items-center px-4 rounded-xl">
                <Lock color="#6d7b6c" size={18} />
                <TextInput 
                  placeholder="••••••••"
                  placeholderTextColor={isDark ? "#71717a" : "#a1a1aa"}
                  secureTextEntry={!showPassword}
                  className="flex-1 p-4 text-gray-900 dark:text-zinc-100"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-2">
                   {showPassword ? <EyeOff color="#6d7b6c" size={18} /> : <Eye color="#6d7b6c" size={18} />}
                </TouchableOpacity>
              </View>
              <TouchableOpacity 
                className="mt-2 self-end"
                onPress={() => Alert.alert('Reset Link Sent', 'Please check your email/SMS for password reset instructions.')}
              >
                <Text className="text-emerald-600 font-bold text-sm">Forgot Password?</Text>
              </TouchableOpacity>
           </View>

           <TouchableOpacity 
            onPress={() => {
              Alert.alert(
                'Wallet Connected',
                'Your Web3 Wallet (0x4A5e...8f3B) has been successfully verified and connected to your account via WalletConnect.',
                [{ text: 'Continue', onPress: () => router.push('/(farmer)/dashboard') }]
              );
            }}
            className="bg-emerald-600 h-14 rounded-xl items-center justify-center mb-8"
            style={{
              shadowColor: '#059669',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
              elevation: 2,
            }}
           >
              <Text className="text-white font-bold text-lg">Sign In</Text>
           </TouchableOpacity>

           <View className="flex-row items-center mb-8">
              <View className="flex-1 h-[1px] bg-gray-200 dark:bg-zinc-700" />
              <Text className="mx-4 text-gray-500 dark:text-zinc-400 text-sm">OR CONTINUE WITH</Text>
              <View className="flex-1 h-[1px] bg-gray-200 dark:bg-zinc-700" />
           </View>

           <View className="flex-row justify-center">
              <TouchableOpacity 
                onPress={triggerBiometric}
                className="w-14 h-14 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl items-center justify-center mr-4"
              >
                 <Fingerprint color="#006e2f" size={24} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={triggerGoogle}
                className="w-14 h-14 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl items-center justify-center"
              >
                 <Mail color="#565e74" size={24} />
              </TouchableOpacity>
           </View>
        </View>

        <View className="flex-1 justify-end pb-10 items-center">
           <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text className="text-gray-500 dark:text-zinc-400 font-medium">Don't have an account? <Text className="text-emerald-600 font-bold">Create One</Text></Text>
           </TouchableOpacity>
        </View>
      </View>

      {/* Biometric Modal */}
      <Modal visible={showBiometric} transparent animationType="fade">
        <View className="flex-1 bg-black/60 items-center justify-center">
          <View className="bg-white dark:bg-zinc-900 p-8 rounded-3xl items-center w-3/4">
             <Text className="text-lg font-bold text-gray-900 dark:text-white mb-6">Scan Fingerprint</Text>
             <Animated.View style={{ transform: [{ scale: scanAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] }) }], opacity: scanAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }}>
               <Fingerprint color="#059669" size={80} />
             </Animated.View>
             <Text className="text-sm text-gray-500 mt-6">Verifying identity...</Text>
          </View>
        </View>
      </Modal>

      {/* Google Auth Modal */}
      <Modal visible={showGoogle} transparent animationType="fade">
        <View className="flex-1 bg-black/60 items-center justify-center">
          <View className="bg-white dark:bg-zinc-900 p-8 rounded-3xl items-center w-3/4">
             <ActivityIndicator size="large" color="#059669" className="mb-4" />
             <Text className="text-lg font-bold text-gray-900 dark:text-white">Google Sign In</Text>
             <Text className="text-sm text-gray-500 mt-2 text-center">Connecting to Google services and retrieving profile...</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LoginScreen;
