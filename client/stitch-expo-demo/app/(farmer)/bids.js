import React from 'react';
import { useColorScheme } from 'nativewind';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Image, Alert } from 'react-native';
import { 
  ChevronLeft, 
  Gavel, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ArrowRight,
  User,
  Star
} from 'lucide-react-native';
import { router } from 'expo-router';

const BidsOffers = () => {
  const bids = [
    {
      id: 1,
      commodity: 'Organic Tomatoes',
      bidder: 'FreshMart Ltd.',
      bidAmount: '₹3,450',
      basePrice: '₹3,200',
      qty: '4.5 Quintals',
      rating: 4.8,
      status: 'New',
      time: '12m ago'
    },
    {
      id: 2,
      commodity: 'Roma Tomatoes',
      bidder: 'Mumbai Veggies',
      bidAmount: '₹3,380',
      basePrice: '₹3,200',
      qty: '4.5 Quintals',
      rating: 4.5,
      status: 'Pending',
      time: '1h ago'
    },
    {
      id: 3,
      commodity: 'Russet Potatoes',
      bidder: 'AgroExports',
      bidAmount: '₹1,950',
      basePrice: '₹1,850',
      qty: '12 Quintals',
      rating: 4.9,
      status: 'Active',
      time: '3h ago'
    }
  ];

  const handleAccept = (bid) => {
    Alert.alert(
      'Accept Bid?',
      `Are you sure you want to accept the bid of ${bid.bidAmount} from ${bid.bidder}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Accept Bid', 
          onPress: () => {
            // Simulate API call to acceptBid
            Alert.alert('Processing', 'Contacting smart contract...', [], { cancelable: false });
            setTimeout(() => {
              Alert.alert('Success', 'Bid accepted! Funds are being moved to escrow.');
            }, 1500);
          }
        } 
      ]
    );
  };

  const handleReject = (bid) => {
    Alert.alert(
      'Reject Bid',
      `Are you sure you want to reject the bid from ${bid.bidder}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reject', 
          style: 'destructive',
          onPress: () => Alert.alert('Bid Rejected', 'The bidder has been notified.') 
        } 
      ]
    );
  };

  return (
    <View className="flex-1 bg-[#f4f7f4] dark:bg-gray-50 dark:bg-zinc-950 pt-12">
      <StatusBar style={isDark ? "light" : "dark"} />
      
      {/* Header */}
      <View className="px-5 flex-row items-center py-4 border-b border-gray-200 dark:border-gray-200 dark:border-zinc-800/30">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-white dark:bg-zinc-900 dark:bg-gray-100 dark:bg-zinc-800/50 rounded-full items-center justify-center mr-3 shadow-sm shadow-black/5">
          <ChevronLeft color="#006e2f" size={24} />
        </TouchableOpacity>
        <Text className="text-2xl text-gray-800 dark:text-gray-900 dark:text-zinc-100 font-black tracking-tight">Bids & Offers</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-5">
        
        {/* Quick Filters */}
        <View className="py-5 flex-row">
           <TouchableOpacity className="bg-[#10b981] dark:bg-primary px-5 py-2.5 rounded-full mr-2 shadow-sm shadow-[#10b981]/20">
              <Text className="text-white text-sm font-bold tracking-wide">Highest Bids</Text>
           </TouchableOpacity>
           <TouchableOpacity className="bg-white dark:bg-zinc-900 dark:bg-gray-100 dark:bg-zinc-800/50 border border-gray-200 dark:border-gray-200 dark:border-zinc-800/50 px-5 py-2.5 rounded-full mr-2 shadow-sm shadow-black/5">
              <Text className="text-gray-600 dark:text-gray-500 dark:text-zinc-400 text-sm font-bold tracking-wide">Newest</Text>
           </TouchableOpacity>
           <TouchableOpacity className="bg-white dark:bg-zinc-900 dark:bg-gray-100 dark:bg-zinc-800/50 border border-gray-200 dark:border-gray-200 dark:border-zinc-800/50 px-5 py-2.5 rounded-full shadow-sm shadow-black/5">
              <Text className="text-gray-600 dark:text-gray-500 dark:text-zinc-400 text-sm font-bold tracking-wide">Favorites</Text>
           </TouchableOpacity>
        </View>

        {bids.map((bid) => (
          <View key={bid.id} className="bg-white dark:bg-zinc-900 dark:bg-gray-100 dark:bg-zinc-800/50 rounded-[28px] p-6 mb-5 border border-white dark:border-gray-200 dark:border-zinc-800/30 shadow-lg shadow-black/5">
             <View className="flex-row justify-between items-start mb-4">
                <View>
                   <Text className="text-xs text-gray-500 dark:text-gray-500 dark:text-zinc-400 font-black uppercase tracking-widest">{bid.commodity}</Text>
                   <View className="flex-row items-end mt-1">
                      <Text className="text-3xl font-black text-[#006e2f] dark:text-primary tracking-tighter">{bid.bidAmount}</Text>
                      <Text className="text-sm text-gray-400 dark:text-gray-500 dark:text-zinc-400 ml-2 mb-1 font-medium">/ qtl</Text>
                   </View>
                </View>
                <View className="bg-[#e6f4ea] dark:bg-primary-container/20 px-3 py-1 rounded-xl flex-row items-center">
                   <TrendingUp color="#10b981" size={14} className="mr-1" />
                   <Text className="text-[#059669] dark:text-primary text-xs font-bold">+{Math.round((parseInt(bid.bidAmount.replace('₹', '').replace(',', '')) - parseInt(bid.basePrice.replace('₹', '').replace(',', ''))) / parseInt(bid.basePrice.replace('₹', '').replace(',', '')) * 100)}%</Text>
                </View>
             </View>

             <View className="h-[1px] bg-gray-100 dark:bg-outline-variant/20 mb-4" />

             <View className="flex-row items-center justify-between mb-6">
                <View className="flex-row items-center">
                   <View className="w-12 h-12 bg-gray-50 dark:bg-gray-100 dark:bg-zinc-800/50-high rounded-full items-center justify-center mr-3 border border-gray-100 dark:border-gray-200 dark:border-zinc-800/10">
                      <User color="#6b7280" size={20} />
                   </View>
                   <View>
                      <Text className="text-base font-bold text-gray-800 dark:text-gray-900 dark:text-zinc-100 tracking-tight">{bid.bidder}</Text>
                      <View className="flex-row items-center mt-0.5">
                         <Star color="#f59e0b" fill="#f59e0b" size={12} />
                         <Text className="text-xs text-gray-500 dark:text-gray-500 dark:text-zinc-400 ml-1 font-medium">{bid.rating} • Verified Buyer</Text>
                      </View>
                   </View>
                </View>
                <View className="items-end">
                   <Text className="text-[10px] text-gray-400 dark:text-gray-500 dark:text-zinc-400 font-black uppercase tracking-wider">{bid.time}</Text>
                   <Text className="text-sm text-gray-700 dark:text-gray-900 dark:text-zinc-100 font-black mt-1">For {bid.qty}</Text>
                </View>
             </View>

             <View className="flex-row space-x-3 gap-3">
                <TouchableOpacity 
                   onPress={() => handleReject(bid)}
                   className="flex-1 bg-red-50 dark:bg-error-container/20 border border-red-100 dark:border-error/30 h-14 rounded-2xl items-center justify-center"
                >
                   <Text className="text-[#ef4444] dark:text-error font-bold tracking-wide">Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                   onPress={() => handleAccept(bid)}
                   className="flex-[1.5] bg-[#10b981] dark:bg-primary h-14 rounded-2xl items-center justify-center shadow-md shadow-[#10b981]/20"
                >
                   <Text className="text-white font-bold tracking-wide">Accept Bid</Text>
                </TouchableOpacity>
             </View>
          </View>
        ))}

        <View className="mt-4 p-6 bg-white dark:bg-zinc-900 dark:bg-gray-100 dark:bg-zinc-800/50 rounded-3xl border border-gray-100 dark:border-gray-200 dark:border-zinc-800/30 mb-10 items-center shadow-sm shadow-black/5">
           <View className="w-16 h-16 bg-[#e6f4ea] dark:bg-primary-container/20 rounded-full items-center justify-center mb-3">
              <Gavel color="#10b981" size={32} />
           </View>
           <Text className="text-gray-800 dark:text-gray-900 dark:text-zinc-100 font-black text-lg tracking-tight">Smart Negotiation</Text>
           <Text className="text-center text-sm text-gray-500 dark:text-gray-500 dark:text-zinc-400 mt-2 leading-5">Bids on Smart-Kissan are legally binding once accepted. Buyers must have sufficient escrow funds to bid.</Text>
        </View>

        <View className="h-32" />
      </ScrollView>
    </View>
  );
};

export default BidsOffers;
