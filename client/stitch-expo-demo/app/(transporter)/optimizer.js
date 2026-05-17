import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { 
  ChevronLeft, 
  Zap, 
  MapPin, 
  TrendingDown, 
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Fuel,
  Clock,
  CheckCircle
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const RouteOptimizer = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [selectedStrategy, setSelectedStrategy] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const strategies = [
    { 
      title: 'Fuel Efficient Route', 
      sub: 'Avoids heavy traffic and steep inclines via NH-48', 
      icon: Fuel, 
      color: '#10b981', 
      impact: '-12% Fuel',
      timeSaved: '20 min',
      costSaved: '₹3,400'
    },
    { 
      title: 'Express Delivery', 
      sub: 'Uses tolled expressways for fastest transit time', 
      icon: Clock, 
      color: '#3b82f6', 
      impact: '-45 min',
      timeSaved: '45 min',
      costSaved: '₹1,200'
    },
    { 
      title: 'Secure Path', 
      sub: 'Verified logistics corridors with high security ratings', 
      icon: ShieldCheck, 
      color: '#8b5cf6', 
      impact: '100% Safe',
      timeSaved: '5 min',
      costSaved: '₹4,500'
    }
  ];

  const loadingSteps = [
    "Contacting Indian Transit APIs...",
    "Analyzing NH-48 traffic density...",
    "Calculating elevation angles...",
    "Applying optimized Green Corridor parameters..."
  ];

  const handleApplyRoute = () => {
    setLoading(true);
    setLoadingStep(0);
    
    // Cycle through loading steps to look extremely realistic
    const interval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 800);

    setTimeout(() => {
      clearInterval(interval);
      setLoading(false);
      router.push({
        pathname: '/(transporter)/navigation',
        params: { optimized: 'true' }
      });
    }, 3500);
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View className="pt-14 pb-6 px-6 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <ChevronLeft color={isDark ? "#ffffff" : "#0f172a"} size={24} />
          </TouchableOpacity>
          <Text className="text-2xl font-black text-gray-900 dark:text-zinc-100">AI Route Optimizer</Text>
        </View>
        <Zap color="#10b981" size={24} fill="#10b981" />
      </View>

      {/* Main Container */}
      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        {/* Active Optimization Info Card */}
        <View className="bg-[#1e293b] rounded-[40px] p-6 mb-8 overflow-hidden relative shadow-2xl">
          <View className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500 rounded-full opacity-10 blur-3xl" />
          
          <View className="flex-row items-center bg-blue-500/20 border border-blue-500 self-start px-3 py-1.5 rounded-full mb-6">
            <Zap color="#3b82f6" size={12} fill="#3b82f6" />
            <Text className="text-blue-400 text-[9px] font-black ml-1.5 uppercase tracking-widest">Active Optimization</Text>
          </View>
          
          <Text className="text-white text-2xl font-black tracking-tight mb-4 leading-8">
            Optimized pathways ready for NH-48 corridor.
          </Text>
          
          <View className="flex-row items-center justify-between mt-4">
            <View>
              <Text className="text-white/50 text-[9px] font-black uppercase tracking-widest mb-1">Potential Savings</Text>
              <Text className="text-[#4ade80] text-3xl font-black">{strategies[selectedStrategy].costSaved}</Text>
            </View>
            <View className="items-end">
              <Text className="text-white/50 text-[9px] font-black uppercase tracking-widest mb-1">Time Reduced</Text>
              <Text className="text-blue-400 text-3xl font-black">{strategies[selectedStrategy].timeSaved}</Text>
            </View>
          </View>
        </View>

        {/* Strategies Section */}
        <Text className="text-xs font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[2px] mb-4 ml-1">
          Select Optimization Strategy
        </Text>

        {strategies.map((item, i) => {
          const isSelected = selectedStrategy === i;
          return (
            <TouchableOpacity 
              key={i}
              onPress={() => setSelectedStrategy(i)}
              className={`border rounded-3xl p-5 mb-4 flex-row items-center shadow-sm ${
                isSelected 
                  ? 'bg-white dark:bg-zinc-900 border-[#10b981] border-2 shadow-md shadow-[#10b981]/5' 
                  : 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800'
              }`}
            >
              <View className="w-12 h-12 rounded-2xl items-center justify-center mr-4" style={{ backgroundColor: `${item.color}15` }}>
                <item.icon color={item.color} size={24} />
              </View>
              
              <View className="flex-1">
                <Text className="text-gray-900 dark:text-zinc-100 font-black text-sm mb-1">{item.title}</Text>
                <Text className="text-gray-500 dark:text-zinc-400 text-[10px] font-bold leading-4">{item.sub}</Text>
              </View>
              
              <View className="items-end ml-2">
                <Text className="text-gray-900 dark:text-zinc-100 font-black text-xs">{item.impact}</Text>
                <View className={`mt-2 w-6 h-6 rounded-full items-center justify-center border ${
                  isSelected ? 'bg-[#10b981] border-[#10b981]' : 'bg-gray-50 dark:bg-zinc-800 border-gray-100'
                }`}>
                  {isSelected ? (
                    <CheckCircle color="#ffffff" size={14} />
                  ) : (
                    <ArrowRight color={isDark ? "#a1a1aa" : "#64748b"} size={12} />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity 
          onPress={handleApplyRoute}
          className="mt-6 bg-[#10b981] h-16 rounded-2xl items-center justify-center shadow-xl shadow-green-500/10 flex-row"
        >
          <Zap color="#ffffff" size={18} fill="#ffffff" className="mr-2" />
          <Text className="text-white font-black text-base ml-1">Apply Recommended Route</Text>
        </TouchableOpacity>

        {/* Responsive padding to prevent clipping behind absolute control panel */}
        <View className="h-32" />
      </ScrollView>

      {/* Real-time Processing Overlay */}
      {loading && (
        <View className="absolute inset-0 bg-black/85 backdrop-blur-md items-center justify-center px-8 z-50">
          <View className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 w-full items-center shadow-2xl">
            <View className="w-16 h-16 bg-[#10b981]/10 rounded-full items-center justify-center mb-6">
              <ActivityIndicator size="large" color="#10b981" />
            </View>
            <Text className="text-white text-xl font-black mb-2 text-center">AI Route Computation</Text>
            <Text className="text-[#10b981] text-xs font-bold uppercase tracking-widest text-center mb-6">Speedy-04 Fleet</Text>
            <Text className="text-zinc-400 text-xs font-semibold text-center h-10 px-2">
              {loadingSteps[loadingStep]}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default RouteOptimizer;
