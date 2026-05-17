import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Modal, ActivityIndicator, Animated, Image } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { ArrowLeft, CreditCard, Landmark, Plus, ChevronRight, ShieldCheck, CheckCircle2, Check, Trash2, Star } from 'lucide-react-native';

export default function PaymentMethods() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [methods, setMethods] = useState([
    { id: '1', type: 'bank', name: 'State Bank of India', detail: 'Account ending in 4921', isVerified: true },
    { id: '2', type: 'upi', name: 'UPI ID', detail: 'ramesh@okhdfc', isVerified: true }
  ]);

  const [selectedMethodId, setSelectedMethodId] = useState('1');
  const [defaultMethodId, setDefaultMethodId] = useState('1');

  const [isLinking, setIsLinking] = useState(false);
  const [linkingStep, setLinkingStep] = useState(0); // 0: contacting, 1: validating, 2: smart wallet, 3: done
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const startLinkingAnimation = () => {
    setIsLinking(true);
    setLinkingStep(0);
    
    // Pulse animation for the secure bank emblem
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.0, duration: 800, useNativeDriver: true })
      ])
    ).start();

    // Step-by-step progress simulation
    setTimeout(() => {
      setLinkingStep(1);
      setTimeout(() => {
        setLinkingStep(2);
        setTimeout(() => {
          setLinkingStep(3);
          setTimeout(() => {
            setIsLinking(false);
            setMethods(prev => [
              ...prev,
              { id: Date.now().toString(), type: 'bank', name: 'HDFC Bank Ltd', detail: 'Account ending in 8892' }
            ]);
            Alert.alert("Account Linked", "Your HDFC Bank account has been linked to the escrow smart contract wallet.");
          }, 1500);
        }, 1800);
      }, 1800);
    }, 1500);
  };

  const handleAddMethod = () => {
    Alert.alert(
      "Add Payment Method",
      "Choose a method to link secure checkout",
      [
        { text: "Link HDFC Bank Account", onPress: startLinkingAnimation },
        {
          text: "Link UPI ID",
          onPress: () => {
            setMethods(prev => [
              ...prev,
              { id: Date.now().toString(), type: 'upi', name: 'UPI ID', detail: 'ramesh@okaxis' }
            ]);
            Alert.alert("Success", "New UPI ID linked successfully.");
          }
        },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950">
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Header */}
      <View className="px-6 pt-14 pb-4 flex-row items-center border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-full items-center justify-center mr-4">
          <ArrowLeft color={isDark ? "#ffffff" : "#000000"} size={20} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 dark:text-zinc-100">Payment Methods</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        <Text className="text-sm font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest mb-4 ml-1">Saved Methods</Text>

        {methods.map(method => {
          const isSelected = selectedMethodId === method.id;
          const isDefault = defaultMethodId === method.id;
          return (
            <TouchableOpacity 
              key={method.id} 
              onPress={() => setSelectedMethodId(isSelected ? null : method.id)}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-4 mb-3 border relative shadow-sm"
              style={{
                borderColor: isSelected ? '#10b981' : (isDark ? '#27272a' : '#e4e4e7'),
                borderWidth: isSelected ? 2 : 1
              }}
            >
              <View className="flex-row items-center">
                <View className={`w-12 h-12 rounded-2xl items-center justify-center mr-4 ${method.type === 'bank' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-emerald-50 dark:bg-emerald-900/20'}`}>
                  {method.type === 'bank' ? (
                    <Landmark color="#3b82f6" size={24} />
                  ) : (
                    <CreditCard color="#10b981" size={24} />
                  )}
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <Text className="text-base font-bold text-gray-900 dark:text-zinc-100">{method.name}</Text>
                    {isDefault && (
                      <View className="bg-emerald-100 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md ml-2 flex-row items-center">
                        <Check size={10} color="#10b981" />
                        <Text className="text-[#10b981] text-[9px] font-black uppercase ml-0.5">Primary</Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">{method.detail}</Text>
                </View>
                <View className="flex-row items-center">
                  <View className={`w-5 h-5 rounded-full items-center justify-center border ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 dark:border-zinc-700'}`}>
                    {isSelected && <Check color="#fff" size={12} />}
                  </View>
                </View>
              </View>

              {isSelected && (
                <View className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800 flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    {!isDefault && (
                      <TouchableOpacity 
                        onPress={() => {
                          setDefaultMethodId(method.id);
                          Alert.alert("Success", `${method.name} set as primary method.`);
                        }}
                        className="flex-row items-center bg-gray-100 dark:bg-zinc-800 px-3 py-1.5 rounded-xl mr-2"
                      >
                        <Star color="#eab308" size={12} />
                        <Text className="text-xs font-bold text-gray-700 dark:text-zinc-300 ml-1">Make Primary</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity 
                      onPress={() => {
                        Alert.alert(
                          "Remove Method",
                          `Unlink ${method.name} from escrow profile?`,
                          [
                            { text: "Cancel", style: "cancel" },
                            { 
                              text: "Remove", 
                              style: "destructive", 
                              onPress: () => {
                                setMethods(prev => prev.filter(m => m.id !== method.id));
                                if (defaultMethodId === method.id) setDefaultMethodId(null);
                                setSelectedMethodId(null);
                              } 
                            }
                          ]
                        );
                      }}
                      className="flex-row items-center bg-red-50 dark:bg-red-950/20 px-3 py-1.5 rounded-xl"
                    >
                      <Trash2 color="#ef4444" size={12} />
                      <Text className="text-xs font-bold text-red-600 dark:text-red-400 ml-1">Unlink</Text>
                    </TouchableOpacity>
                  </View>
                  <View className="flex-row items-center">
                    <ShieldCheck color="#10b981" size={14} />
                    <Text className="text-[9px] font-black text-[#10b981] ml-1 uppercase tracking-wider">ESCROW SECURE</Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* UPI & Payouts Trust Badge Box */}
        <View className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-5 mt-4 mb-4 shadow-sm">
          <Text className="text-[10px] text-gray-500 dark:text-zinc-400 font-black uppercase tracking-widest text-center mb-3">
            🔒 SECURE NPCI BANK MANDATES & UPI GATEWAYS
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

        <TouchableOpacity 
          onPress={handleAddMethod}
          className="bg-[#10b981] h-14 rounded-2xl flex-row items-center justify-center mt-2"
          style={{
            shadowColor: '#10b981',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Plus color="#fff" size={20} />
          <Text className="text-white font-bold text-lg ml-2">Add New Method</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* High-Fidelity Bank Linking Modal */}
      <Modal visible={isLinking} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/60 px-6">
          <View className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 w-full items-center border border-gray-200 dark:border-zinc-800 shadow-2xl">
            
            {/* Animated Shield/Emblem */}
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }} className="w-24 h-24 bg-emerald-50 dark:bg-emerald-950/30 rounded-full justify-center items-center mb-6">
              <ShieldCheck color="#10b981" size={54} />
            </Animated.View>

            <Text className="text-2xl font-black text-gray-900 dark:text-white mb-2 text-center">Securing Bank Link</Text>
            <Text className="text-sm text-gray-500 dark:text-zinc-400 text-center mb-8">
              Partnering with <Text className="font-bold text-emerald-500">NPCI & Escrow Contracts</Text> to secure auto-release workflows.
            </Text>

            {/* Stepper progress */}
            <View className="w-full space-y-4 mb-6">
              <View className="flex-row items-center">
                <View className={`w-6 h-6 rounded-full items-center justify-center ${linkingStep >= 0 ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-zinc-800'}`}>
                  {linkingStep > 0 ? <CheckCircle2 color="#fff" size={14} /> : <ActivityIndicator size="small" color="#fff" />}
                </View>
                <Text className={`text-sm ml-3 font-semibold ${linkingStep >= 0 ? 'text-gray-900 dark:text-zinc-100 font-bold' : 'text-gray-400'}`}>
                  Contacting HDFC Gateway
                </Text>
              </View>

              <View className="flex-row items-center">
                <View className={`w-6 h-6 rounded-full items-center justify-center ${linkingStep >= 1 ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-zinc-800'}`}>
                  {linkingStep > 1 ? (
                    <CheckCircle2 color="#fff" size={14} />
                  ) : linkingStep === 1 ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text className="text-xs text-gray-400">2</Text>
                  )}
                </View>
                <Text className={`text-sm ml-3 font-semibold ${linkingStep >= 1 ? 'text-gray-900 dark:text-zinc-100 font-bold' : 'text-gray-400'}`}>
                  Validating Account & KYC Status
                </Text>
              </View>

              <View className="flex-row items-center">
                <View className={`w-6 h-6 rounded-full items-center justify-center ${linkingStep >= 2 ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-zinc-800'}`}>
                  {linkingStep > 2 ? (
                    <CheckCircle2 color="#fff" size={14} />
                  ) : linkingStep === 2 ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text className="text-xs text-gray-400">3</Text>
                  )}
                </View>
                <Text className={`text-sm ml-3 font-semibold ${linkingStep >= 2 ? 'text-gray-900 dark:text-zinc-100 font-bold' : 'text-gray-400'}`}>
                  Configuring Multi-Sig Escrow Wallets
                </Text>
              </View>
            </View>

            <View className="bg-gray-100 dark:bg-zinc-800/50 px-4 py-2.5 rounded-xl flex-row items-center justify-center w-full">
              <Text className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest">
                AES-256 BANK GRADE SECURITY
              </Text>
            </View>

          </View>
        </View>
      </Modal>
    </View>
  );
}

