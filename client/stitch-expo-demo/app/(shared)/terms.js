import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { ArrowLeft, ShieldCheck, FileText, Lock, Users, Truck, AlertTriangle } from 'lucide-react-native';

export default function TermsAndConditions() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View className="px-6 pt-14 pb-4 flex-row items-center border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-full items-center justify-center mr-4">
          <ArrowLeft color={isDark ? '#ffffff' : '#000000'} size={20} />
        </TouchableOpacity>
        <View>
          <Text className="text-xl font-black text-gray-900 dark:text-zinc-100">Terms of Service</Text>
          <Text className="text-xs text-gray-400 dark:text-zinc-500 font-medium mt-0.5">SmartKissan Platform Guidelines</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-5 py-6">
        
        {/* Intro */}
        <View className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-3xl p-5 mb-6">
          <View className="flex-row items-center mb-2.5">
            <ShieldCheck color="#059669" size={20} />
            <Text className="text-sm font-black text-emerald-800 dark:text-emerald-300 ml-2">Smart Escrow Protection Agreement</Text>
          </View>
          <Text className="text-xs text-emerald-700 dark:text-emerald-400 leading-5">
            By registering a profile on the SmartKissan network, you agree to fulfill trading, logistics, or bidding obligations as defined by our Gasless Ledger Escrow system. Please read these terms carefully before participating.
          </Text>
        </View>

        {/* Section 1 */}
        <View className="mb-6">
          <View className="flex-row items-center mb-2 px-1">
            <Lock color={isDark ? "#a1a1aa" : "#475569"} size={16} />
            <Text className="text-sm font-black text-gray-900 dark:text-zinc-100 ml-2">1. On-Chain Escrow & Payout Custody</Text>
          </View>
          <Text className="text-xs text-gray-500 dark:text-zinc-400 leading-5 px-1">
            All buy-side crop bids commit matching funds directly into the platform's multi-sig clearing escrow managed behind-the-scenes on the Polygon blockchain. Escrow funds are only released to the farmer and transporter once successful delivery and physical quality parameters have been confirmed by the buyer or autonomous delivery relayer.
          </Text>
        </View>

        {/* Section 2 */}
        <View className="mb-6">
          <View className="flex-row items-center mb-2 px-1">
            <AlertTriangle color="#ea580c" size={16} />
            <Text className="text-sm font-black text-gray-900 dark:text-zinc-100 ml-2">2. Upfront Advance Payment Risk Waiver</Text>
          </View>
          <Text className="text-xs text-gray-500 dark:text-zinc-400 leading-5 px-1">
            Buyers who toggle the **Upfront Advance Facility** (25% to 50%) acknowledge that these disbursements bypass smart contract locks to pay the farmer (for fertilizer/harvest costs) and transporter (for trip fuel advances) immediately. Releasing funds upfront carries **counterparty risk**. The platform is not liable for cargo damage or transaction defaults regarding advance payments.
          </Text>
        </View>

        {/* Section 3 */}
        <View className="mb-6">
          <View className="flex-row items-center mb-2 px-1">
            <Users color={isDark ? "#a1a1aa" : "#475569"} size={16} />
            <Text className="text-sm font-black text-gray-900 dark:text-zinc-100 ml-2">3. 4-Member Equal Split Sourcing Pools</Text>
          </View>
          <Text className="text-xs text-gray-500 dark:text-zinc-400 leading-5 px-1">
            Co-operative sourcing pools are strictly regulated at 4 equal shares of 25% each. Members joining a pool are legally committed to their portion of crop volume and transportation fees. Funds stay locked in platform custody until all 4 members complete the group split.
          </Text>
        </View>

        {/* Section 4 */}
        <View className="mb-6">
          <View className="flex-row items-center mb-2 px-1">
            <Truck color={isDark ? "#a1a1aa" : "#475569"} size={16} />
            <Text className="text-sm font-black text-gray-900 dark:text-zinc-100 ml-2">4. Logistics Transit & Handover verification</Text>
          </View>
          <Text className="text-xs text-gray-500 dark:text-zinc-400 leading-5 px-1">
            Transporters are responsible for maintaining cargo conditions in transit. If quality inspections at delivery reveal cargo rot, degradation, or weight deficit exceeding 3%, buyers have the legal right to raise a dispute, locking platform payouts pending admin mediation.
          </Text>
        </View>

        {/* Section 5 */}
        <View className="mb-6">
          <View className="flex-row items-center mb-2 px-1">
            <FileText color={isDark ? "#a1a1aa" : "#475569"} size={16} />
            <Text className="text-sm font-black text-gray-900 dark:text-zinc-100 ml-2">5. Platform Gas Fee Custody</Text>
          </View>
          <Text className="text-xs text-gray-500 dark:text-zinc-400 leading-5 px-1">
            All system transaction gas fees, smart contract deployment rates, and relayer network fees are fully sponsored and covered by the platform. End-users (Farmers, Buyers, Logistics) will never be charged for cryptocurrency gas or blockchain execution fees.
          </Text>
        </View>

        <View className="h-24" />
      </ScrollView>

      {/* Accept Footer */}
      <View className="p-5 bg-white dark:bg-zinc-900 border-t border-gray-150 dark:border-zinc-800">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-emerald-600 h-14 rounded-2xl items-center justify-center"
          style={{
            shadowColor: '#059669',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 3,
          }}
        >
          <Text className="text-white font-black text-base">I Understand & Agree</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
