import React from 'react';
import { useColorScheme } from 'nativewind';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  ChevronRight,
  Info,
  Calendar
} from 'lucide-react-native';
import { router } from 'expo-router';

import { SwipeableScreen } from '../../components/SwipeableScreen';

const MarketInsights = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [timeframe, setTimeframe] = React.useState('Weekly');
  
  const commodityTrends = [
    { id: 1, name: 'Premium Wheat', price: '₹2,100/q', change: '+2.4%', trend: 'up' },
    { id: 2, name: 'Roma Tomatoes', price: '₹3,200/q', change: '+5.8%', trend: 'up' },
    { id: 3, name: 'Basmati Rice', price: '₹5,450/q', change: '-1.2%', trend: 'down' },
    { id: 4, name: 'Red Onions', price: '₹1,850/q', change: '+1.5%', trend: 'up' },
  ];

  return (
    <SwipeableScreen currentTab="insights" role="buyer">
      <View className="flex-1 bg-gray-50 dark:bg-zinc-950 pt-12">
        <StatusBar style={isDark ? "light" : "dark"} />
        
        {/* Header */}
        <View className="px-4 py-2 border-b border-gray-200 dark:border-zinc-800">
          <Text className="text-xl text-gray-900 dark:text-zinc-100 font-bold">Market Insights</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-4">
          
          {/* Market Overview Card */}
          <View className="bg-[#0f172a] rounded-2xl p-6 mt-6 shadow-md">
             <View className="flex-row justify-between items-center mb-4">
                <Text className="text-white text-lg font-bold">Market Sentiment</Text>
                <View className="bg-primary px-2 py-1 rounded flex-row items-center">
                   <TrendingUp color="#ffffff" size={14} />
                   <Text className="text-white text-[10px] font-bold ml-1">BULLISH</Text>
                </View>
             </View>
             <Text className="text-white/70 text-sm mb-6">Aggregated analysis from 12 Mandis across Maharashtra & MP.</Text>
             <View className="flex-row justify-between">
                <View>
                   <Text className="text-white text-xl font-bold">12.4%</Text>
                   <Text className="text-white/50 text-[10px] uppercase font-bold">Avg. Price Rise</Text>
                </View>
                <View className="h-full w-[1px] bg-white dark:bg-zinc-900/10" />
                <View>
                   <Text className="text-white text-xl font-bold">850+</Text>
                   <Text className="text-white/50 text-[10px] uppercase font-bold">Active Listings</Text>
                </View>
                <View className="h-full w-[1px] bg-white dark:bg-zinc-900/10" />
                <View>
                   <Text className="text-white text-xl font-bold">₹4.2Cr</Text>
                   <Text className="text-white/50 text-[10px] uppercase font-bold">Trade Vol.</Text>
                </View>
             </View>
          </View>

          {/* Commodity Watchlist */}
          <View className="mt-8">
             <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl text-gray-900 dark:text-zinc-100 font-bold">Commodity Trends</Text>
                <TouchableOpacity 
                  onPress={() => setTimeframe(prev => prev === 'Weekly' ? 'Monthly' : 'Weekly')}
                  className="flex-row items-center bg-gray-100 dark:bg-zinc-800 px-3 py-1 rounded-full"
                >
                   <Calendar color="#006e2f" size={14} />
                   <Text className="text-primary font-bold text-sm ml-1">{timeframe}</Text>
                </TouchableOpacity>
             </View>

             {commodityTrends.map((item) => (
               <TouchableOpacity 
                 key={item.id} 
                 onPress={() => router.push({
                   pathname: '/(shared)/price-history',
                   params: { crop: item.name, role: 'buyer' }
                 })}
                 className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 mb-3 flex-row items-center justify-between"
               >
                  <View className="flex-row items-center">
                     <View className="w-10 h-10 bg-gray-50 dark:bg-zinc-850 rounded-lg items-center justify-center mr-4">
                        <BarChart3 color={isDark ? "#4ade80" : "#006e2f"} size={20} />
                     </View>
                     <Text className="text-gray-900 dark:text-zinc-100 font-bold text-lg">{item.name}</Text>
                  </View>
                  <View className="flex-row items-center">
                     <View className="mr-4 items-end">
                        <Text className="text-gray-900 dark:text-zinc-100 font-bold">{item.price}</Text>
                        <View className="flex-row items-center">
                           {item.trend === 'up' ? <TrendingUp color="#059669" size={12} /> : <TrendingDown color="#ba1a1a" size={12} />}
                           <Text className={`text-[10px] font-bold ml-1 ${item.trend === 'up' ? 'text-green-700 dark:text-green-400' : 'text-red-600'}`}>{item.change}</Text>
                        </View>
                     </View>
                     <ChevronRight color={isDark ? "#71717a" : "#bccbb9"} size={20} />
                  </View>
               </TouchableOpacity>
             ))}
          </View>

          {/* Demand Hotspots Section */}
          <View className="mt-8 mb-8">
             <Text className="text-xl text-gray-900 dark:text-zinc-100 font-black mb-4">Demand Hotspots</Text>
             <View className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-[28px] p-5 shadow-sm">
                <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-4">Top Purchasing Hub Volume Share</Text>
                
                <View className="gap-y-4">
                  {/* Mumbai */}
                  <View>
                     <View className="flex-row justify-between mb-1.5 px-0.5">
                        <Text className="text-xs text-gray-700 dark:text-zinc-300 font-bold">Mumbai Wholesalers</Text>
                        <Text className="text-xs text-gray-900 dark:text-zinc-100 font-black">45%</Text>
                     </View>
                     <View className="h-2 bg-gray-50 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <View className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }} />
                     </View>
                  </View>

                  {/* Pune */}
                  <View>
                     <View className="flex-row justify-between mb-1.5 px-0.5">
                        <Text className="text-xs text-gray-700 dark:text-zinc-300 font-bold">Pune Agro Mills</Text>
                        <Text className="text-xs text-gray-900 dark:text-zinc-100 font-black">25%</Text>
                     </View>
                     <View className="h-2 bg-gray-50 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <View className="h-full bg-emerald-500 rounded-full" style={{ width: '25%' }} />
                     </View>
                  </View>

                  {/* Nashik */}
                  <View>
                     <View className="flex-row justify-between mb-1.5 px-0.5">
                        <Text className="text-xs text-gray-700 dark:text-zinc-300 font-bold">Nashik Storage Junction</Text>
                        <Text className="text-xs text-gray-900 dark:text-zinc-100 font-black">18%</Text>
                     </View>
                     <View className="h-2 bg-gray-50 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <View className="h-full bg-purple-500 rounded-full" style={{ width: '18%' }} />
                     </View>
                  </View>

                  {/* Indore */}
                  <View>
                     <View className="flex-row justify-between mb-1.5 px-0.5">
                        <Text className="text-xs text-gray-700 dark:text-zinc-300 font-bold">Indore Mandi Hub</Text>
                        <Text className="text-xs text-gray-900 dark:text-zinc-100 font-black">12%</Text>
                     </View>
                     <View className="h-2 bg-gray-50 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <View className="h-full bg-amber-500 rounded-full" style={{ width: '12%' }} />
                     </View>
                  </View>
                </View>
             </View>
          </View>

          <View className="h-32" />
        </ScrollView>
      </View>
    </SwipeableScreen>
  );
};

export default MarketInsights;
