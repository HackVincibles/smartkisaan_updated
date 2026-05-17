import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Image, Alert } from 'react-native';
import { 
  ChevronLeft, 
  TrendingUp, 
  TrendingDown,
  LineChart,
  MessageSquare,
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { SwipeableScreen } from '../../components/SwipeableScreen';

const MarketAdvisor = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const marketTrends = [
    { id: 1, crop: 'Wheat', price: '₹2,450', trend: 'up', change: '+₹50', color: '#10b981', predicted: '₹2,600', confidence: '94%' },
    { id: 2, crop: 'Potato', price: '₹1,800', trend: 'down', change: '-₹20', color: '#ef4444', predicted: '₹1,720', confidence: '88%' },
    { id: 3, crop: 'Corn', price: '₹2,100', trend: 'up', change: '+₹30', color: '#10b981', predicted: '₹2,250', confidence: '91%' },
    { id: 4, crop: 'Onion', price: '₹3,500', trend: 'up', change: '+₹120', color: '#10b981', predicted: '₹3,800', confidence: '85%' },
  ];

  return (
    <SwipeableScreen currentTab="market" role="farmer">
      <View className="flex-1 bg-gray-50 dark:bg-zinc-950 pt-12">
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        
        {/* Header */}
        <View className="px-4 flex-row items-center py-4 border-b border-gray-200 dark:border-zinc-800">
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
          >
            <ChevronLeft color={isDark ? "#ffffff" : "#006e2f"} size={24} />
          </TouchableOpacity>
          <Text className="text-2xl text-gray-900 dark:text-zinc-100 font-black tracking-tight flex-1">Market Advisor</Text>
          <View className="bg-[#10b981]/20 px-3 py-1.5 rounded-full flex-row items-center">
             <Sparkles color="#10b981" size={14} />
             <Text className="text-[#059669] dark:text-[#4ade80] text-[10px] font-black ml-1 uppercase tracking-wider">AI Live</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-4">
          
          {/* AI Insight Card - Premium Look */}
          <View className="bg-[#004b1e] dark:bg-[#002109] rounded-2xl p-6 mt-6 mb-6 shadow-xl shadow-black/10 relative overflow-hidden">
             {/* Faux background glow */}
             <View className="absolute -top-10 -right-10 w-32 h-32 bg-[#10b981] rounded-full opacity-30 blur-2xl" />
             
             <View className="flex-row items-center justify-between mb-4 relative z-10">
                <View className="flex-row items-center">
                   <View className="w-12 h-12 bg-white dark:bg-zinc-900/10 rounded-full items-center justify-center mr-3 border border-white/20 backdrop-blur-md">
                      <MessageSquare color="#10b981" size={24} />
                   </View>
                   <Text className="text-white text-xl font-extrabold tracking-tight">Market Intelligence</Text>
                </View>
             </View>
             
             <Text className="text-white/80 text-sm font-medium leading-6 mb-6 relative z-10">
                "Wheat prices are expected to rise by 5-8% in the Indore region over the next 10 days due to local supply constraints. Consider holding your Grade A stock for a better margin."
             </Text>
             
             <TouchableOpacity 
               onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Full Analysis', description: 'Generating detailed market report...' } })}
               className="bg-[#10b981] py-3.5 rounded-full items-center flex-row justify-center shadow-md relative z-10"
             >
                <Text className="text-white font-bold tracking-wide mr-2">Get Full Analysis</Text>
                <ArrowRight color="#ffffff" size={18} />
             </TouchableOpacity>
          </View>

          {/* Live Prices Header */}
          <View className="flex-row justify-between items-end mt-3 mb-3">
            <Text className="text-xl text-gray-900 dark:text-zinc-100 font-black tracking-tight">Live Mandi Prices</Text>
            <TouchableOpacity onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Location', description: 'Select a different Mandi location' } })} className="bg-white dark:bg-zinc-900 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 px-3 py-1.5 rounded-full shadow-sm">
              <Text className="text-[#006e2f] dark:text-[#4ade80] font-bold text-xs tracking-wide">Indore ▼</Text>
            </TouchableOpacity>
          </View>

          {/* Price List */}
          <View className="bg-white dark:bg-zinc-900 dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden shadow-sm shadow-black/5 mb-6">
             {marketTrends.map((trend, index) => (
                <TouchableOpacity 
                  key={trend.id} 
                  onPress={() => router.push({
                    pathname: '/(shared)/price-history',
                    params: { crop: trend.crop, role: 'farmer' }
                  })}
                  className={`p-4 flex-row items-center justify-between ${index !== marketTrends.length - 1 ? 'border-b border-gray-100 dark:border-zinc-800' : ''}`}
                >
                 <View className="flex-row items-center">
                   <View className="w-12 h-12 bg-gray-50 dark:bg-zinc-800 rounded-full items-center justify-center mr-3">
                      <LineChart color={isDark ? "#4ade80" : "#006e2f"} size={20} />
                   </View>
                    <View>
                      <Text className="text-gray-900 dark:text-zinc-100 font-black text-lg tracking-tight mb-0.5">{trend.crop}</Text>
                      <Text className="text-xs text-gray-500 dark:text-zinc-400 font-medium">Avg. Market Price</Text>
                      <View className="flex-row items-center mt-1">
                         <Sparkles color="#10b981" size={10} />
                         <Text className="text-[#059669] dark:text-[#4ade80] text-[10px] font-bold ml-1">Forecast: {trend.predicted} ({trend.confidence})</Text>
                      </View>
                    </View>
                 </View>
                 <View className="items-end">
                   <Text className="text-gray-900 dark:text-zinc-100 font-black text-lg mb-1">{trend.price}</Text>
                   <View className={`flex-row items-center px-2 py-0.5 rounded-lg ${trend.trend === 'up' ? 'bg-green-100 dark:bg-green-900/40' : 'bg-red-50 dark:bg-red-900/40'}`}>
                     {trend.trend === 'up' ? <TrendingUp color={isDark ? "#4ade80" : "#10b981"} size={12} /> : <TrendingDown color={isDark ? "#f87171" : "#ef4444"} size={12} />}
                     <Text className="font-bold ml-1 text-[10px] uppercase tracking-wider" style={{ color: trend.trend === 'up' ? (isDark ? "#4ade80" : "#10b981") : (isDark ? "#f87171" : "#ef4444") }}>{trend.change}</Text>
                   </View>
                 </View>
               </TouchableOpacity>
             ))}
          </View>

          {/* Educational Content */}
          <View className="flex-row items-center mt-3 mb-3">
             <BookOpen color={isDark ? "#4ade80" : "#006e2f"} size={20} className="mr-2" />
             <Text className="text-xl text-gray-900 dark:text-zinc-100 font-black tracking-tight">Agri-Tips for Today</Text>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4 mb-10 pb-4">
             <TouchableOpacity 
               onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Article', description: 'Opening: Pest Control for Tomatoes' } })}
               className="w-64 bg-white dark:bg-zinc-900 dark:bg-zinc-900 rounded-2xl p-2 mr-3 border border-gray-100 dark:border-zinc-800 shadow-sm shadow-black/5"
             >
                <View className="w-full h-36 bg-gray-100 dark:bg-zinc-800 rounded-xl mb-3 overflow-hidden">
                   <Image source={{ uri: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=400' }} className="w-full h-full" />
                   <View className="absolute top-2 right-2 bg-white dark:bg-zinc-900/90 backdrop-blur-md px-2 py-1 rounded-lg">
                      <Text className="text-gray-900 text-[9px] font-black tracking-widest uppercase">3 Min Read</Text>
                   </View>
                </View>
                <View className="px-2 pb-2">
                   <Text className="text-gray-900 dark:text-zinc-100 font-bold text-base tracking-tight mb-1" numberOfLines={1}>Pest Control for Tomatoes</Text>
                   <Text className="text-gray-500 dark:text-zinc-400 text-xs font-medium">Organic Farming Basics</Text>
                </View>
             </TouchableOpacity>
             
             <TouchableOpacity 
               onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Article', description: 'Opening: Wheat Storage Best Practices' } })}
               className="w-64 bg-white dark:bg-zinc-900 dark:bg-zinc-900 rounded-2xl p-2 mr-3 border border-gray-100 dark:border-zinc-800 shadow-sm shadow-black/5"
             >
                <View className="w-full h-36 bg-gray-100 dark:bg-zinc-800 rounded-xl mb-3 overflow-hidden">
                   <Image source={{ uri: 'https://images.unsplash.com/photo-1594489428504-5c0c480a15fd?q=80&w=400' }} className="w-full h-full" />
                   <View className="absolute top-2 right-2 bg-white dark:bg-zinc-900/90 backdrop-blur-md px-2 py-1 rounded-lg">
                      <Text className="text-gray-900 text-[9px] font-black tracking-widest uppercase">5 Min Read</Text>
                   </View>
                </View>
                <View className="px-2 pb-2">
                   <Text className="text-gray-900 dark:text-zinc-100 font-bold text-base tracking-tight mb-1" numberOfLines={1}>Wheat Storage Practices</Text>
                   <Text className="text-gray-500 dark:text-zinc-400 text-xs font-medium">Post-Harvest Care</Text>
                </View>
             </TouchableOpacity>
             
             {/* Extra padding item to ensure the last card scrolls fully into view */}
             <View className="w-4" />
          </ScrollView>

          <View className="h-32" />
        </ScrollView>
      </View>
    </SwipeableScreen>
  );
};

export default MarketAdvisor;
