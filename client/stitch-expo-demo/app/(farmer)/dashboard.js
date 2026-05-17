import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StatusBar } from 'react-native';
import { 
  Leaf, 
  Search, 
  Bell, 
  LayoutDashboard, 
  ListOrdered, 
  TrendingUp, 
  User,
  PlusCircle,
  Clock,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { SwipeableScreen } from '../../components/SwipeableScreen';
import TrustBlueprintModal from '../(shared)/TrustBlueprint';

const FarmerDashboard = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [blueprintVisible, setBlueprintVisible] = React.useState(false);

  return (
    <SwipeableScreen currentTab="dashboard" role="farmer">
      <View className="flex-1 bg-gray-50 dark:bg-zinc-950">
        <StatusBar barStyle="light-content" />
        
        {/* Premium Hero Header - Capsular Shape */}
        <View className="bg-[#004b1e] pt-14 pb-12 px-6 rounded-[40px] mt-2 mx-2 relative overflow-hidden shadow-xl">
          {/* Decorative background circles */}
          <View className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
          <View className="absolute bottom-10 -left-10 w-24 h-24 bg-white/5 rounded-full" />
          
          <View className="flex-row justify-between items-center relative z-10">
            <View className="flex-row items-center">
              <View className="w-14 h-14 bg-white/20 rounded-full items-center justify-center border border-white/30 backdrop-blur-md overflow-hidden">
                <Image 
                   source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400' }} 
                   className="w-full h-full"
                />
              </View>
              <View className="ml-4">
                <Text className="text-white/80 text-xs font-bold uppercase tracking-widest">Welcome back</Text>
                <Text className="text-white text-2xl font-black">Farmer Ramesh</Text>
              </View>
            </View>
            <TouchableOpacity 
              onPress={() => router.push('/(shared)/notifications')}
              className="w-12 h-12 bg-white/10 rounded-full items-center justify-center border border-white/20"
            >
              <Bell color="#ffffff" size={22} />
              <View className="absolute top-3 right-3 w-3 h-3 bg-[#ff4d4f] rounded-full border-2 border-[#004b1e]" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-4">
          
          {/* Stat Cards */}
          <View className="flex-row justify-between mt-6 mb-6 gap-4">
            <TouchableOpacity 
              onPress={() => router.push('/(farmer)/bids')}
              className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-5 flex-1 shadow-sm"
            >
              <View className="w-12 h-12 bg-[#e6f4ea] dark:bg-green-900/40 rounded-2xl items-center justify-center mb-4">
                <TrendingUp color={isDark ? "#4ade80" : "#006e2f"} size={24} />
              </View>
              <Text className="text-3xl text-gray-900 dark:text-zinc-100 font-black tracking-tight">12</Text>
              <Text className="text-sm text-gray-500 dark:text-zinc-400 font-bold mt-1">Active Bids</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => router.push('/(farmer)/track-shipments')}
              className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-5 flex-1 shadow-sm"
            >
              <View className="w-12 h-12 bg-[#fff4e6] dark:bg-amber-900/40 rounded-2xl items-center justify-center mb-4">
                <Clock color={isDark ? "#fbbf24" : "#d97706"} size={24} />
              </View>
              <Text className="text-3xl text-gray-900 dark:text-zinc-100 font-black tracking-tight">4</Text>
              <Text className="text-sm text-gray-500 dark:text-zinc-400 font-bold mt-1">In Transit</Text>
            </TouchableOpacity>
          </View>

          {/* Trust Blueprint Promo Card */}
          <TouchableOpacity 
            onPress={() => setBlueprintVisible(true)}
            className="bg-zinc-900 dark:bg-zinc-800/40 border border-zinc-800 rounded-3xl p-5 mb-6 flex-row items-center justify-between shadow-lg"
          >
            <View className="flex-row items-center flex-1 pr-4">
              <View className="w-12 h-12 bg-green-500/10 rounded-2xl items-center justify-center mr-4">
                <ShieldCheck color="#10b981" size={24} />
              </View>
              <View className="flex-1">
                <Text className="text-white text-sm font-black tracking-tight">🔒 Secure Trust Protocol</Text>
                <Text className="text-zinc-400 text-[10px] font-bold mt-0.5 leading-4">AI Scan Hashing • sponsored Escrow Relayers</Text>
              </View>
            </View>
            <View className="bg-green-500/20 px-3 py-1.5 rounded-xl">
              <Text className="text-xs text-green-400 font-black">View Details</Text>
            </View>
          </TouchableOpacity>

          {/* Action Card - Modern Look */}
          <TouchableOpacity 
            onPress={() => router.push('/(farmer)/add-listing')}
            className="bg-[#10b981] rounded-3xl p-6 mb-8 shadow-2xl shadow-[#10b981]/30 overflow-hidden relative"
          >
            <View className="absolute -top-20 -right-10 w-48 h-48 bg-[#34d399] rounded-full opacity-40 blur-3xl" />
            
            <View className="relative z-10">
              <View className="bg-white/20 self-start px-3 py-1 rounded-full mb-4 flex-row items-center border border-white/30">
                <Leaf color="#ffffff" size={14} />
                <Text className="text-white text-[10px] font-black ml-1 uppercase tracking-widest">Sell Harvest</Text>
              </View>
              <Text className="text-white text-3xl font-black tracking-tight mb-2">New Harvest?</Text>
              <Text className="text-white/90 text-sm font-bold leading-5 mb-6">List your crops now and reach 500+ verified buyers instantly.</Text>
              <View className="bg-white px-6 py-3 rounded-full self-start flex-row items-center shadow-md">
                <Text className="text-[#059669] font-black mr-2">Create Listing</Text>
                <ArrowUpRight color="#059669" size={20} />
              </View>
            </View>
          </TouchableOpacity>

          {/* Section Header */}
          <View className="flex-row justify-between items-end mb-4 px-1">
            <Text className="text-2xl text-gray-900 dark:text-zinc-100 font-black tracking-tight">Your Listings</Text>
            <TouchableOpacity onPress={() => router.push('/(farmer)/listings')} className="flex-row items-center">
              <Text className="text-[#006e2f] dark:text-zinc-400 font-bold mr-1">See All</Text>
              <ChevronRight color={isDark ? "#a1a1aa" : "#006e2f"} size={18} />
            </TouchableOpacity>
          </View>

          {/* Listings */}
          {[1, 2].map((i) => (
            <TouchableOpacity 
              key={i}
              onPress={() => router.push({ pathname: '/(farmer)/listing-details', params: { id: i.toString() } })}
              className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl mb-4 flex-row items-center gap-4 p-4 shadow-sm"
            >
              <View className="w-24 h-24 bg-gray-100 dark:bg-zinc-800 rounded-2xl overflow-hidden relative">
                 <Image 
                  source={{ uri: i === 1 ? 'https://images.unsplash.com/photo-1594489428504-5c0c480a15fd?q=80&w=400' : 'https://images.unsplash.com/photo-1518977676601-b53f02ac6d5d?q=80&w=400' }} 
                  className="w-full h-full"
                 />
                 <View className="absolute top-2 left-2 bg-white/90 dark:bg-zinc-900/90 px-2 py-0.5 rounded-lg shadow-sm">
                    <Text className="text-green-700 dark:text-green-400 text-[10px] font-black uppercase">{i === 1 ? 'Grade A' : 'Grade B'}</Text>
                 </View>
              </View>
              
              <View className="flex-1 py-1">
                <Text className="text-xl text-gray-900 dark:text-zinc-100 font-black tracking-tight mb-1" numberOfLines={1}>{i === 1 ? 'Organic Wheat' : 'Premium Potatoes'}</Text>
                <Text className="text-sm text-gray-500 dark:text-zinc-400 font-bold mb-3">{i === 1 ? '500 kg' : '1,200 kg'} available</Text>
                
                <View className="flex-row items-center justify-between">
                   <Text className="text-[#006e2f] dark:text-[#4ade80] font-black text-xl">₹{i === 1 ? '2,450' : '1,800'}<Text className="text-xs font-bold text-gray-400">/qtl</Text></Text>
                   <View className="bg-green-100 dark:bg-green-900/40 px-3 py-1.5 rounded-xl">
                     <Text className="text-xs text-green-700 dark:text-green-400 font-black">{i === 1 ? '12 Bids' : 'AI Analysis'}</Text>
                   </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          <View className="h-32" />
        </ScrollView>
        <TrustBlueprintModal visible={blueprintVisible} onClose={() => setBlueprintVisible(false)} />
      </View>
    </SwipeableScreen>
  );
};

export default FarmerDashboard;
