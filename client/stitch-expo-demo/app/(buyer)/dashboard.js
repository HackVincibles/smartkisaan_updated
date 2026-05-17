import React, { useState } from 'react';
import { useColorScheme } from 'nativewind';
import { View, Text, ScrollView, Image, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { 
  Search, 
  Bell, 
  MapPin, 
  ChevronRight, 
  Star,
  Clock,
  TrendingUp,
  Filter,
  ShoppingBag,
  ArrowRight,
  Users,
  Users2,
  Lock,
  ShieldCheck
} from 'lucide-react-native';
import { router } from 'expo-router';
import { SwipeableScreen } from '../../components/SwipeableScreen';
import TrustBlueprintModal from '../(shared)/TrustBlueprint';

const BuyerDashboard = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [blueprintVisible, setBlueprintVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Spices', 'Dairy'];
  
  const featuredCrops = [
    {
      id: 1,
      title: 'Premium Quality Onions',
      farmer: 'Ramesh Patel',
      price: '₹1,200',
      unit: 'Quintal',
      rating: '4.8',
      grade: 'Grade A',
      category: 'Vegetables',
      image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?q=80&w=600',
    },
    {
      id: 2,
      title: 'Fresh Tomatoes',
      farmer: 'Sunil Kumar',
      price: '₹800',
      unit: 'Quintal',
      rating: '4.6',
      grade: 'Grade A+',
      category: 'Vegetables',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=600',
    },
    {
      id: 3,
      title: 'Alphonso Mangoes',
      farmer: 'Gopal Mandloi',
      price: '₹2,500',
      unit: 'Box',
      rating: '4.9',
      grade: 'Grade A++',
      category: 'Fruits',
      image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=600',
    },
    {
      id: 4,
      title: 'Premium Wheat',
      farmer: 'Vikram Singh',
      price: '₹2,450',
      unit: 'Quintal',
      rating: '4.7',
      grade: 'Grade A',
      category: 'Grains',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=600',
    },
    {
      id: 5,
      title: 'Organic Turmeric',
      farmer: 'Devendra Vyas',
      price: '₹4,800',
      unit: 'Quintal',
      rating: '4.8',
      grade: 'Grade A',
      category: 'Spices',
      image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=600',
    },
    {
      id: 6,
      title: 'Pure Desi Cow Ghee',
      farmer: 'Radhika Dairy',
      price: '₹650',
      unit: 'Kg',
      rating: '4.9',
      grade: 'Grade A++',
      category: 'Dairy',
      image: 'https://images.unsplash.com/photo-1614707267537-b85acf00c4b8?q=80&w=600',
    }
  ];

  // Regulated Co-Op pools strictly configured for exactly 4 members maximum to ensure seamless local logistics/distribution.
  const coOpPools = [
    {
      id: 101,
      title: 'Alphonso Mango Sourcing Pool',
      organizer: 'Ratnagiri Cooperative Union',
      price: '₹2,40,000',
      portionPrice: '₹60,000',
      unit: 'Lot',
      portionUnit: '30 Boxes',
      rating: '4.9',
      grade: 'Grade A++',
      category: 'Fruits',
      membersLimit: 4,
      membersJoined: 3,
      image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=600',
      avatars: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100'
      ]
    },
    {
      id: 102,
      title: 'Kolkata Potato Sourcing Pool',
      organizer: 'Bengal Growers Alliance',
      price: '₹1,60,000',
      portionPrice: '₹40,000',
      unit: 'Lot',
      portionUnit: '5 Tons',
      rating: '4.7',
      grade: 'Grade A',
      category: 'Vegetables',
      membersLimit: 4,
      membersJoined: 2,
      image: 'https://images.unsplash.com/photo-1518977676601-b53f02ac6d5d?q=80&w=600',
      avatars: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100'
      ]
    }
  ];

  const filteredCrops = selectedCategory === 'All' 
    ? featuredCrops 
    : featuredCrops.filter(crop => crop.category === selectedCategory);

  const filteredPools = selectedCategory === 'All'
    ? coOpPools
    : coOpPools.filter(pool => pool.category === selectedCategory);

  return (
    <SwipeableScreen currentTab="dashboard" role="buyer">
      <View className="flex-1 bg-gray-50 dark:bg-zinc-950 pt-12">
        <StatusBar style={isDark ? "light" : "dark"} />
        
        {/* Header - Cylindrical Shape */}
        <View className="px-6 py-6 bg-white dark:bg-zinc-900 mx-2 mt-2 rounded-t-[100px] rounded-b-[40px] shadow-sm flex-row justify-between items-center border border-gray-100 dark:border-zinc-800">
          <TouchableOpacity onPress={() => router.push('/(shared)/addresses')}>
            <View className="flex-row items-center">
              <MapPin color={isDark ? "#4ade80" : "#1e293b"} size={14} />
              <Text className="text-[10px] text-gray-500 dark:text-zinc-400 font-black ml-1 uppercase tracking-widest">Delivering To</Text>
            </View>
            <Text className="text-lg text-gray-900 dark:text-zinc-100 font-black">Mumbai Central, MH ▼</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => router.push('/(shared)/notifications')}
            className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-full items-center justify-center border border-gray-200 dark:border-zinc-700 shadow-sm"
          >
            <Bell color={isDark ? "#ffffff" : "#0f172a"} size={22} />
            <View className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-zinc-800" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          
          {/* Search Bar */}
          <View className="px-4 mt-6">
            <TouchableOpacity 
              onPress={() => router.push('/(buyer)/search')}
              className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 h-14 rounded-2xl flex-row items-center px-4 shadow-sm"
            >
              <Search color="#64748b" size={20} />
              <Text className="text-gray-500 dark:text-zinc-400 ml-4 flex-1 font-medium">Search for crops, farmers...</Text>
              <TouchableOpacity onPress={() => router.push('/(buyer)/search')}>
                <Filter color={isDark ? "#ffffff" : "#0f172a"} size={20} />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>

          {/* Trust Blueprint Promo Card */}
          <View className="px-4 mt-6">
            <TouchableOpacity 
              onPress={() => setBlueprintVisible(true)}
              className="bg-zinc-900 dark:bg-zinc-800/40 border border-zinc-800 rounded-3xl p-5 flex-row items-center justify-between shadow-lg"
            >
              <View className="flex-row items-center flex-1 pr-4">
                <View className="w-12 h-12 bg-green-500/10 rounded-2xl items-center justify-center mr-4">
                  <ShieldCheck color="#10b981" size={24} />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-sm font-black tracking-tight">🔒 Secure Trust Protocol</Text>
                  <Text className="text-zinc-400 text-[10px] font-bold mt-0.5 leading-4">AI Scan Hashing • 4-Split Co-Op Pools</Text>
                </View>
              </View>
              <View className="bg-green-500/20 px-3 py-1.5 rounded-xl">
                <Text className="text-xs text-green-400 font-black">View Blueprint</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Categories */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-6 px-4">
            {categories.map((cat, i) => (
              <TouchableOpacity 
                key={cat} 
                onPress={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full mr-2 border ${selectedCategory === cat ? 'bg-gray-900 dark:bg-zinc-100 border-gray-900 dark:border-zinc-100' : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800'}`}
              >
                <Text className={`font-black text-sm ${selectedCategory === cat ? 'text-white dark:text-zinc-900' : 'text-gray-500 dark:text-zinc-400'}`}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Cooperative Bidding / Group Sourcing Section */}
          {filteredPools.length > 0 && (
            <View className="mt-8">
              <View className="px-5 flex-row justify-between items-center mb-4">
                <View>
                  <Text className="text-2xl text-gray-900 dark:text-zinc-100 font-black tracking-tight">Co-Op Sourcing Pools</Text>
                  <Text className="text-[10px] text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-widest mt-0.5">Split order volumes & payments equally (Max 4)</Text>
                </View>
                <View className="bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1 rounded-full flex-row items-center">
                  <Users2 color={isDark ? "#34d399" : "#059669"} size={12} />
                  <Text className="text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider ml-1">4-Split Max</Text>
                </View>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
                {filteredPools.map((pool) => {
                  const slotsLeft = pool.membersLimit - pool.membersJoined;
                  const progressPct = (pool.membersJoined / pool.membersLimit) * 100;
                  return (
                    <TouchableOpacity 
                      key={pool.id}
                      onPress={() => router.push({ pathname: '/(buyer)/place-bid', params: { id: pool.id, isGroupBuy: 'true' } })}
                      className="w-80 bg-white dark:bg-zinc-900 border-2 border-emerald-500/20 dark:border-emerald-500/10 rounded-[30px] overflow-hidden mr-4 shadow-md relative"
                    >
                      <View className="h-44 relative">
                        <Image source={{ uri: pool.image }} className="w-full h-full" />
                        <View className="absolute inset-0 bg-black/20" />
                        
                        {/* Premium Slots Indicators */}
                        <View className="absolute top-3 left-3 bg-[#059669] px-3 py-1 rounded-full flex-row items-center shadow-md">
                          <Users color="#ffffff" size={12} />
                          <Text className="text-white text-[9px] font-black uppercase tracking-widest ml-1">
                            {pool.membersJoined}/{pool.membersLimit} Pool Filled
                          </Text>
                        </View>
                        
                        <View className="absolute top-3 right-3 bg-white/95 dark:bg-zinc-900/95 px-2.5 py-1 rounded-full flex-row items-center shadow-sm">
                          <Star color="#f59e0b" fill="#f59e0b" size={10} />
                          <Text className="text-[10px] font-black ml-1 text-gray-900 dark:text-zinc-100">{pool.rating}</Text>
                        </View>

                        {/* Co-Op Organizer Overlay */}
                        <View className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                          <Text className="text-white/70 text-[9px] font-bold uppercase tracking-widest">Co-Op Organizer</Text>
                          <Text className="text-white text-xs font-black" numberOfLines={1}>{pool.organizer}</Text>
                        </View>
                      </View>

                      <View className="p-5">
                        <View className="flex-row justify-between items-start mb-2">
                          <Text className="text-lg font-black text-gray-900 dark:text-zinc-100 flex-1 mr-2" numberOfLines={1}>{pool.title}</Text>
                          <View className="bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                            <Text className="text-emerald-700 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest">{pool.grade}</Text>
                          </View>
                        </View>

                        {/* 4-Split Progress Bar */}
                        <View className="mt-3 mb-4">
                          <View className="flex-row justify-between items-center mb-1">
                            <Text className="text-[10px] text-gray-500 dark:text-zinc-400 font-black uppercase tracking-wider">Split Contract</Text>
                            <Text className="text-xs text-emerald-600 dark:text-emerald-400 font-black">{pool.membersJoined} of {pool.membersLimit} Partners</Text>
                          </View>
                          <View className="h-3 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden flex-row">
                             {Array.from({ length: pool.membersLimit }).map((_, i) => {
                               const filled = i < pool.membersJoined;
                               return (
                                 <View 
                                   key={i} 
                                   className={`h-full flex-1 border-r border-white dark:border-zinc-900 ${
                                     filled ? 'bg-[#10b981]' : 'bg-gray-200 dark:bg-zinc-800'
                                   }`} 
                                 />
                               );
                             })}
                          </View>
                          <View className="flex-row justify-between items-center mt-1">
                            <Text className="text-[9px] text-[#059669] font-black uppercase tracking-wider">
                              {slotsLeft === 1 ? '⚠️ 1 SLOT LEFT! LOCKS SOON' : `${slotsLeft} slots remaining`}
                            </Text>
                            <Text className="text-[9px] text-gray-400 dark:text-zinc-500 font-bold uppercase">
                              {pool.portionUnit} / member
                            </Text>
                          </View>
                        </View>

                        <View className="h-[1px] bg-gray-100 dark:bg-zinc-800 my-2" />

                        {/* Retailer Members Avatars Stack */}
                        <View className="flex-row justify-between items-center mt-2">
                          <View className="flex-row items-center">
                            <View className="flex-row mr-2">
                              {pool.avatars.map((url, idx) => (
                                <View 
                                  key={idx} 
                                  style={{ marginLeft: idx === 0 ? 0 : -10 }} 
                                  className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 overflow-hidden shadow-sm"
                                >
                                  <Image source={{ uri: url }} className="w-full h-full" />
                                </View>
                              ))}
                              {Array.from({ length: slotsLeft }).map((_, idx) => (
                                <View 
                                  key={idx} 
                                  style={{ marginLeft: -10 }} 
                                  className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-850 items-center justify-center shadow-sm"
                                >
                                  <Users color={isDark ? "#52525b" : "#cbd5e1"} size={10} />
                                </View>
                              ))}
                            </View>
                            <Text className="text-[9px] text-gray-400 font-black uppercase tracking-wider">
                              ₹{parseInt(pool.portionPrice.replace(/[₹,]/g, '')).toLocaleString()} / Share
                            </Text>
                          </View>

                          <TouchableOpacity 
                            onPress={() => router.push({ pathname: '/(buyer)/place-bid', params: { id: pool.id, isGroupBuy: 'true' } })}
                            className="bg-[#059669] px-4 py-2.5 rounded-2xl flex-row items-center shadow-md shadow-emerald-500/10"
                          >
                            <Text className="text-white font-black text-xs mr-1">Join Split</Text>
                            <ArrowRight color="#ffffff" size={12} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Promo Banner */}
          <View className="mx-4 mt-8 bg-[#0f172a] rounded-3xl p-8 overflow-hidden flex-row items-center shadow-xl">
             <View className="flex-1">
                <View className="bg-[#10b981] px-3 py-1 self-start rounded-full mb-3">
                   <Text className="text-white text-[10px] font-black uppercase tracking-widest">Wholesale</Text>
                </View>
                <Text className="text-white text-2xl font-black mb-1">Direct from Nashik</Text>
                <Text className="text-white/70 text-sm font-medium mb-6">Get the freshest Onions at wholesale rates.</Text>
                <TouchableOpacity 
                  onPress={() => router.push('/(buyer)/search')}
                  className="bg-white px-6 py-3 self-start rounded-full shadow-md"
                >
                   <Text className="text-[#0f172a] font-black text-sm">Shop Now</Text>
                </TouchableOpacity>
             </View>
             <View className="w-24 h-24 bg-white/10 rounded-full items-center justify-center -mr-10">
                <ShoppingBag color="#ffffff" size={48} />
              </View>
          </View>

          {/* Recommended */}
          <View className="px-5 mt-8 flex-row justify-between items-center mb-4">
            <Text className="text-2xl text-gray-900 dark:text-zinc-100 font-black tracking-tight">Recommended</Text>
            <TouchableOpacity onPress={() => router.push('/(buyer)/search')}>
              <Text className="text-[#10b981] font-black text-sm">View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
             {filteredCrops.map((item) => (
               <TouchableOpacity 
                key={item.id} 
                onPress={() => router.push({ pathname: '/(buyer)/place-bid', params: { id: item.id } })}
                className="w-64 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl overflow-hidden mr-4 shadow-sm"
               >
                  <View className="h-40 relative">
                     <Image source={{ uri: item.image }} className="w-full h-full" />
                     <View className="absolute top-3 left-3 bg-white/90 dark:bg-zinc-900/90 px-2.5 py-1 rounded-full flex-row items-center shadow-sm">
                        <Star color="#f59e0b" fill="#f59e0b" size={12} />
                        <Text className="text-[10px] font-black ml-1 text-gray-900 dark:text-zinc-100">{item.rating}</Text>
                     </View>
                  </View>
                  <View className="p-5">
                     <View className="flex-row justify-between items-start mb-1">
                        <Text className="text-xl font-black text-gray-900 dark:text-zinc-100 flex-1 mr-2">{item.title}</Text>
                        <View className="bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded-lg">
                           <Text className="text-green-700 dark:text-green-400 text-[10px] font-black uppercase">{item.grade}</Text>
                        </View>
                     </View>
                     <Text className="text-xs text-gray-500 dark:text-zinc-400 font-bold">by {item.farmer}</Text>
                     <View className="flex-row items-center justify-between mt-6">
                        <Text className="text-gray-900 dark:text-zinc-100 font-black text-2xl">{item.price}<Text className="text-xs text-gray-500 font-bold"> / {item.unit}</Text></Text>
                        <TouchableOpacity 
                           onPress={() => router.push({ pathname: '/(buyer)/place-bid', params: { id: item.id } })}
                           className="w-10 h-10 bg-[#10b981] rounded-full items-center justify-center shadow-md"
                        >
                           <ArrowRight color="#ffffff" size={18} />
                        </TouchableOpacity>
                     </View>
                  </View>
               </TouchableOpacity>
             ))}
          </ScrollView>

          <View className="h-32" />
        </ScrollView>
        <TrustBlueprintModal visible={blueprintVisible} onClose={() => setBlueprintVisible(false)} />
      </View>
    </SwipeableScreen>
  );
};

export default BuyerDashboard;
