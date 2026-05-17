import React, { useState } from 'react';
import { useColorScheme } from 'nativewind';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, TextInput, Alert } from 'react-native';
import { 
  ChevronLeft, 
  Search, 
  Filter, 
  MapPin, 
  Truck,
  ArrowRight,
  ShieldCheck,
  IndianRupee
} from 'lucide-react-native';
import { router } from 'expo-router';

import { SwipeableScreen } from '../../components/SwipeableScreen';

const AvailableLoads = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [urgentOnly, setUrgentOnly] = useState(false);

  const loads = [
    {
      id: 1,
      commodity: 'Wheat (Grade A)',
      weight: '12 Tons',
      time: 'Starts Tomorrow',
      payout: '₹14,200',
      pickup: 'Nashik, Maharashtra',
      drop: 'Mumbai Port, MH',
      distance: '165 km',
      urgent: true,
    },
    {
      id: 2,
      commodity: 'Red Onions',
      weight: '8 Tons',
      time: 'In 2 days',
      payout: '₹8,400',
      pickup: 'Pune, Maharashtra',
      drop: 'Vashi Market, MH',
      distance: '120 km',
      urgent: false,
    },
    {
      id: 3,
      commodity: 'Premium Rice',
      weight: '20 Tons',
      time: 'Scheduled',
      payout: '₹22,000',
      pickup: 'Surat, Gujarat',
      drop: 'JNPT Port, MH',
      distance: '280 km',
      urgent: false,
    }
  ];

  const handleAcceptLoad = (load) => {
    Alert.alert(
      'Accept Load Proposal',
      `Confirm acceptance of ${load.commodity} from ${load.pickup} to ${load.drop}? Payout of ${load.payout} will be held in Smart Escrow.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Accept & Lock', 
          onPress: () => {
            Alert.alert(
              "Smart Contract Manifest Generated", 
              "Manifest deployed on-chain to Polygon Amoy. Cargo ready for pick up.",
              [
                {
                  text: "Go to Dashboard",
                  onPress: () => router.push({
                    pathname: '/(transporter)/dashboard',
                    params: { newLoadId: load.id.toString() }
                  })
                }
              ]
            );
          } 
        }
      ]
    );
  };

  return (
    <SwipeableScreen currentTab="shipments" role="transporter">
      <View className="flex-1 bg-gray-50 dark:bg-zinc-950 pt-12">
        <StatusBar style={isDark ? "light" : "dark"} />
        
        {/* Header */}
        <View className="px-4 flex-row items-center py-2 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center mr-2">
            <ChevronLeft color={isDark ? "#ffffff" : "#0b1c30"} size={24} />
          </TouchableOpacity>
          <Text className="text-xl text-gray-900 dark:text-zinc-100 font-black">Available Loads</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-4">
          
          {/* Filter / Search Bar */}
          <View className="mt-4 mb-6">
             <View className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 h-14 rounded-xl flex-row items-center px-4 shadow-sm">
                <Search color={isDark ? "#a1a1aa" : "#64748b"} size={20} />
                <TextInput 
                  placeholder="Search by pickup or destination..."
                  placeholderTextColor={isDark ? "#71717a" : "#94a3b8"}
                  className="flex-1 ml-4 text-gray-900 dark:text-zinc-100"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                <TouchableOpacity 
                  onPress={() => setUrgentOnly(!urgentOnly)}
                  className={`ml-4 w-10 h-10 items-center justify-center rounded-lg ${urgentOnly ? 'bg-amber-100 dark:bg-amber-900/40' : ''}`}
                >
                   <Filter color={urgentOnly ? "#d97706" : (isDark ? "#ffffff" : "#1e293b")} size={20} />
                </TouchableOpacity>
             </View>
          </View>

          {loads.filter(load => {
            const matchesSearch = load.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  load.pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  load.drop.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesUrgent = urgentOnly ? load.urgent : true;
            return matchesSearch && matchesUrgent;
          }).map((load) => (
            <TouchableOpacity 
              key={load.id} 
              onPress={() => handleAcceptLoad(load)}
              className="bg-white dark:bg-zinc-900 rounded-2xl mb-4 border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm"
            >
              <View className="p-4">
                 <View className="flex-row justify-between items-start mb-4">
                    <View>
                       <View className="flex-row items-center">
                          <Text className="text-xl font-black text-gray-900 dark:text-zinc-100">{load.commodity}</Text>
                          {load.urgent && (
                             <View className="ml-2 bg-red-100 dark:bg-red-900/40 px-2 py-0.5 rounded">
                                <Text className="text-red-600 dark:text-red-400 text-[8px] font-bold uppercase">Urgent</Text>
                             </View>
                          )}
                       </View>
                       <Text className="text-sm text-gray-500 dark:text-zinc-400 font-bold mt-1">{load.weight} • {load.time}</Text>
                    </View>
                    <View className="items-end">
                       <Text className="text-[#2563eb] font-black text-xl">{load.payout}</Text>
                       <Text className="text-[10px] text-gray-500 dark:text-zinc-400 uppercase font-black">Payout</Text>
                    </View>
                 </View>

                  <View className="bg-gray-100 dark:bg-zinc-800/50 rounded-xl p-4 mb-4">
                     <View className="flex-row items-center">
                        <View className="w-2 h-2 rounded-full bg-[#2563eb] mr-4" />
                        <View>
                           <Text className="text-xs text-gray-500 dark:text-zinc-400 font-bold uppercase">Pickup</Text>
                           <Text className="text-base font-bold text-gray-900 dark:text-zinc-100">{load.pickup}</Text>
                        </View>
                     </View>
                     <View className="w-[1px] h-4 bg-gray-300 dark:bg-zinc-700 ml-[3px] my-1" />
                     <View className="flex-row items-center">
                        <View className="w-2 h-2 rounded-full bg-red-500 mr-4" />
                        <View>
                           <Text className="text-xs text-gray-500 dark:text-zinc-400 font-bold uppercase">Destination</Text>
                           <Text className="text-base font-bold text-gray-900 dark:text-zinc-100">{load.drop}</Text>
                        </View>
                     </View>
                  </View>

                  <View className="flex-row justify-between items-center">
                     <View className="flex-row items-center">
                        <View className="flex-row items-center bg-gray-100 dark:bg-zinc-800/50 px-2.5 py-1 rounded-full mr-2">
                           <Truck color={isDark ? "#ffffff" : "#1e293b"} size={12} />
                           <Text className="text-[10px] font-black ml-1 text-gray-900 dark:text-zinc-100">{load.distance}</Text>
                        </View>
                        <View className="flex-row items-center bg-green-100 dark:bg-green-900/40 px-2.5 py-1 rounded-full">
                           <ShieldCheck color="#006e2f" size={12} />
                           <Text className="text-green-700 dark:text-green-400 text-[10px] font-black ml-1">Insured</Text>
                        </View>
                     </View>
                     <TouchableOpacity 
                       onPress={() => handleAcceptLoad(load)}
                       className="bg-[#2563eb] px-6 py-2.5 rounded-xl shadow-sm"
                     >
                        <Text className="text-white font-black text-sm">Accept Load</Text>
                     </TouchableOpacity>
                  </View>
              </View>
            </TouchableOpacity>
          ))}

          <View className="h-32" />
        </ScrollView>
      </View>
    </SwipeableScreen>
  );
};

export default AvailableLoads;
