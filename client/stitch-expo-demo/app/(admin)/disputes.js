import React from 'react';
import { useColorScheme } from 'nativewind';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Image, Alert } from 'react-native';
import { 
  ChevronLeft, 
  AlertCircle, 
  MessageSquare, 
  FileText, 
  ShieldAlert,
  ArrowRight,
  Gavel,
  Scale
} from 'lucide-react-native';
import { router } from 'expo-router';

const DisputeResolution = () => {
  const disputes = [
    {
      id: 1,
      orderId: 'SK-8241',
      issue: 'Quality Mismatch',
      parties: { farmer: 'Ramesh K.', buyer: 'FreshMart' },
      amount: '₹14,500',
      status: 'In Review',
      date: '14 May 2024'
    },
    {
      id: 2,
      orderId: 'SK-9902',
      issue: 'Delivery Delay',
      parties: { farmer: 'Satnam S.', transporter: 'Speedy-X' },
      amount: '₹8,200',
      status: 'Evidence Pending',
      date: '12 May 2024'
    }
  ];

  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950 pt-12">
      <StatusBar style={isDark ? "light" : "dark"} />
      
      {/* Header */}
      <View className="px-4 flex-row items-center py-2 border-b border-gray-200 dark:border-zinc-800">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center mr-2">
          <ChevronLeft color={isDark ? "#ffffff" : "#0b1c30"} size={24} />
        </TouchableOpacity>
        <Text className="text-xl text-gray-900 dark:text-zinc-100 font-bold">Dispute Resolution</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-4">
        
        {/* Status Overview */}
        <View className="flex-row mt-6 space-x-sm">
           <View className="flex-1 bg-red-50 border border-red-100 rounded-2xl p-4 items-center">
              <Text className="text-error font-bold text-xl">12</Text>
              <Text className="text-[10px] text-error font-bold uppercase">Open Cases</Text>
           </View>
           <View className="flex-1 bg-amber-50 border border-amber-100 rounded-2xl p-4 items-center">
              <Text className="text-amber-700 font-bold text-xl">5</Text>
              <Text className="text-[10px] text-amber-700 font-bold uppercase">In Review</Text>
           </View>
           <View className="flex-1 bg-green-50 border border-green-100 rounded-2xl p-4 items-center">
              <Text className="text-green-700 font-bold text-xl">148</Text>
              <Text className="text-[10px] text-green-700 font-bold uppercase">Resolved</Text>
           </View>
        </View>

        <Text className="text-xs text-gray-500 dark:text-zinc-400 font-bold mt-8 mb-4 uppercase">ACTIVE MEDIATION</Text>

        {disputes.map((caseItem) => (
          <TouchableOpacity 
            key={caseItem.id} 
            onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Case Details', description: 'View evidence for Order ${caseItem.orderId}' } })}
            className="bg-white dark:bg-zinc-900 rounded-2xl p-6 mb-4 border border-gray-200 dark:border-zinc-800 shadow-sm"
          >
             <View className="flex-row justify-between items-start mb-4">
                <View>
                   <View className="flex-row items-center">
                      <AlertCircle color="#ba1a1a" size={16} />
                      <Text className="text-lg font-bold text-gray-900 dark:text-zinc-100 ml-2">{caseItem.issue}</Text>
                   </View>
                   <Text className="text-xs text-gray-500 dark:text-zinc-400 mt-1">Order {caseItem.orderId} • {caseItem.date}</Text>
                </View>
                <View className="bg-amber-100 px-2 py-0.5 rounded">
                   <Text className="text-amber-700 text-[8px] font-bold uppercase">{caseItem.status}</Text>
                </View>
             </View>

             <View className="bg-gray-100 dark:bg-zinc-800/50 rounded-xl p-4 flex-row items-center mb-4">
                <View className="flex-1 items-center">
                   <Text className="text-[10px] text-gray-500 dark:text-zinc-400 font-bold uppercase">Farmer</Text>
                   <Text className="text-base font-bold text-gray-900 dark:text-zinc-100">{caseItem.parties.farmer}</Text>
                </View>
                <Scale color={isDark ? "#71717a" : "#bccbb9"} size={16} />
                <View className="flex-1 items-center">
                   <Text className="text-[10px] text-gray-500 dark:text-zinc-400 font-bold uppercase">{caseItem.parties.buyer || 'Logistics'}</Text>
                   <Text className="text-base font-bold text-gray-900 dark:text-zinc-100">{caseItem.parties.buyer || caseItem.parties.transporter}</Text>
                </View>
             </View>

             <View className="flex-row justify-between items-center">
                <Text className="text-gray-900 dark:text-zinc-100 font-bold text-lg">{caseItem.amount}</Text>
                <TouchableOpacity 
                  onPress={(e) => {
                    e.stopPropagation();
                    Alert.alert(
                      'Mediate Case ' + caseItem.orderId,
                      'Select resolution action. This will trigger escrow distribution via smart contracts.',
                      [
                        { text: 'Full Refund to Buyer', onPress: () => Alert.alert('Resolved', 'Funds refunded to buyer.') },
                        { text: 'Release to Farmer', onPress: () => Alert.alert('Resolved', 'Funds released to farmer.') },
                        { text: '50/50 Split', onPress: () => Alert.alert('Resolved', 'Funds split equally.') },
                        { text: 'Cancel', style: 'cancel' }
                      ]
                    );
                  }}
                  className="bg-[#0f172a] px-lg py-2 rounded-lg flex-row items-center"
                >
                   <Gavel color="#ffffff" size={14} />
                   <Text className="text-white font-bold text-sm ml-2">Mediate Case</Text>
                </TouchableOpacity>
             </View>
          </TouchableOpacity>
        ))}

        {/* Mediation Tips */}
        <View className="mt-8 p-6 bg-gray-100 dark:bg-zinc-800/50-high rounded-2xl border border-gray-200 dark:border-zinc-800 mb-8">
           <ShieldAlert color={isDark ? "#ffffff" : "#0f172a"} size={24} />
           <Text className="text-lg font-bold text-gray-900 dark:text-zinc-100 mt-sm">Admin Best Practices</Text>
           <Text className="text-sm text-gray-500 dark:text-zinc-400 mt-xs">Always review AI grading evidence and transit logs before issuing a final verdict on quality disputes.</Text>
        </View>

        <View className="h-10" />
      </ScrollView>
    </View>
  );
};

export default DisputeResolution;
