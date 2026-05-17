import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { ChevronLeft, Share2, MoreVertical, MapPin, Calendar, Clock, Gavel, Check, X } from 'lucide-react-native';

const MOCK_LISTINGS = {
  '1': {
    title: 'Kesar Mangoes',
    desc: 'Premium hand-picked export quality. Naturally ripened without chemicals.',
    price: '₹1,250',
    unit: 'Box',
    grade: 'Grade A++',
    status: 'Active',
    quantity: '500 Boxes',
    location: 'Junagadh, Gujarat',
    date: 'Listed 2 days ago',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=800',
    bids: [
      { id: 1, bidder: 'FreshMart Mumbai', amount: '₹1,200', quantity: '100 Boxes', time: '2h ago' },
      { id: 2, bidder: 'Apex Exports', amount: '₹1,250', quantity: '200 Boxes', time: '5h ago' },
    ]
  },
  '2': {
    title: 'Basmati Rice',
    desc: 'Aromatic long grain, 1121 variety. Aged for 12 months for best aroma.',
    price: '₹5,400',
    unit: 'Quintal',
    grade: 'Grade A',
    status: 'Active',
    quantity: '50 Quintals',
    location: 'Karnal, Haryana',
    date: 'Listed 5 days ago',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800',
    bids: [
      { id: 1, bidder: 'Global Grains', amount: '₹5,200', quantity: '20 Quintals', time: '1d ago' },
    ]
  },
  '3': {
    title: 'Red Onions',
    desc: 'Medium size, high pungency. Ideal for processing.',
    price: '₹1,850',
    unit: 'Quintal',
    grade: 'Grade B',
    status: 'Pending AI',
    quantity: '100 Quintals',
    location: 'Nashik, Maharashtra',
    date: 'Listed 1 day ago',
    image: 'https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=800',
    bids: []
  }
};

const ListingDetails = () => {
  const { id } = useLocalSearchParams();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const item = MOCK_LISTINGS[id] || MOCK_LISTINGS['1'];

  const handleAcceptBid = (bidder) => {
    Alert.alert(
      "Accept Bid",
      `Are you sure you want to accept the bid from ${bidder}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Accept", onPress: () => Alert.alert("Success", "Bid accepted! Escrow initiated.") }
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950">
      <StatusBar barStyle="light-content" />
      
      {/* Header Image Area */}
      <View className="relative h-80">
        <Image 
          source={{ uri: item.image }} 
          className="w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-black/30" />
        
        {/* Header Controls */}
        <View className="absolute top-12 left-0 right-0 flex-row justify-between px-4">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full items-center justify-center border border-white/30"
          >
            <ChevronLeft color="#ffffff" size={24} />
          </TouchableOpacity>
          <View className="flex-row gap-2">
            <TouchableOpacity className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full items-center justify-center border border-white/30">
              <Share2 color="#ffffff" size={20} />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full items-center justify-center border border-white/30">
              <MoreVertical color="#ffffff" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Floating Grade Badge */}
        <View className="absolute bottom-4 left-4 bg-white/90 dark:bg-zinc-900/90 px-3 py-1 rounded-xl shadow-sm">
          <Text className="text-green-700 dark:text-green-400 text-xs font-black uppercase tracking-widest">{item.grade}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 -mt-6 bg-gray-50 dark:bg-zinc-950 rounded-t-[30px] px-4 pt-6">
        
        {/* Title & Price */}
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-1 mr-4">
            <Text className="text-3xl text-gray-900 dark:text-zinc-100 font-black tracking-tight">{item.title}</Text>
            <View className="flex-row items-center mt-1">
              <MapPin color="#71717a" size={14} />
              <Text className="text-sm text-gray-500 dark:text-zinc-400 font-medium ml-1">{item.location}</Text>
            </View>
          </View>
          <View className="items-end">
            <Text className="text-[#004b1e] dark:text-[#4ade80] font-black text-3xl">{item.price}</Text>
            <Text className="text-xs font-bold text-gray-400">per {item.unit}</Text>
          </View>
        </View>

        {/* Quick Info Chips */}
        <View className="flex-row gap-2 mb-4">
          <View className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 px-3 py-2 rounded-xl flex-row items-center">
            <Calendar color="#71717a" size={14} />
            <Text className="text-xs text-gray-600 dark:text-zinc-300 font-bold ml-1">{item.date}</Text>
          </View>
          <View className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 px-3 py-2 rounded-xl flex-row items-center">
            <Clock color="#71717a" size={14} />
            <Text className="text-xs text-gray-600 dark:text-zinc-300 font-bold ml-1">{item.quantity} total</Text>
          </View>
        </View>

        {/* Farmer SBT Badges */}
        <View className="flex-row items-center bg-purple-50 dark:bg-purple-900/20 px-3 py-2 rounded-xl border border-purple-200 dark:border-purple-800 mb-6 self-start">
          <View className="w-5 h-5 bg-purple-100 dark:bg-purple-800 rounded-full items-center justify-center mr-2">
            <Text className="text-[10px]">🏆</Text>
          </View>
          <Text className="text-xs text-purple-700 dark:text-purple-400 font-black">Premium Supplier (SBT Verified)</Text>
        </View>

        {/* Description */}
        <Text className="text-xs text-gray-400 dark:text-zinc-500 font-black uppercase tracking-widest mb-2">Description</Text>
        <Text className="text-base text-gray-600 dark:text-zinc-300 font-medium leading-6 mb-6">
          {item.desc}
        </Text>

        {/* Bids Section */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl text-gray-900 dark:text-zinc-100 font-black tracking-tight">Active Bids ({item.bids.length})</Text>
          {item.status === 'Pending AI' && (
            <View className="bg-amber-100 dark:bg-amber-900/40 px-3 py-1.5 rounded-xl">
              <Text className="text-xs text-amber-700 dark:text-amber-400 font-black uppercase">AI Verification Pending</Text>
            </View>
          )}
        </View>

        {item.bids.length > 0 ? (
          item.bids.map((bid) => (
            <View 
              key={bid.id}
              className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl mb-3 p-4 shadow-sm"
            >
              <View className="flex-row justify-between items-center mb-2">
                <View>
                  <Text className="text-lg text-gray-900 dark:text-zinc-100 font-black">{bid.bidder}</Text>
                  <Text className="text-xs text-gray-500 font-bold">{bid.time}</Text>
                </View>
                <Text className="text-[#004b1e] dark:text-[#4ade80] font-black text-xl">{bid.amount}</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-gray-500 dark:text-zinc-400 font-medium">For {bid.quantity}</Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity 
                    onPress={() => Alert.alert("Rejected", "Bid rejected.")}
                    className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-full items-center justify-center"
                  >
                    <X color="#ef4444" size={18} strokeWidth={3} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => handleAcceptBid(bid.bidder)}
                    className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-full items-center justify-center"
                  >
                    <Check color="#10b981" size={18} strokeWidth={3} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-6 items-center justify-center">
            <Gavel color="#d1d5db" size={40} />
            <Text className="text-gray-500 dark:text-zinc-400 font-bold mt-2">No active bids yet</Text>
          </View>
        )}

        <View className="h-32" />
      </ScrollView>
    </View>
  );
};

export default ListingDetails;
