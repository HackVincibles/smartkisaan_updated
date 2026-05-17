import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Image, Alert } from 'react-native';
import { 
  User, 
  Settings, 
  CreditCard, 
  ShieldCheck, 
  Bell, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Camera,
  Star,
  TrendingUp
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { SwipeableScreen } from '../../components/SwipeableScreen';

const FarmerProfile = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const menuItems = [
    { id: 1, title: 'Personal Information', icon: User, color: '#10b981', route: '/(shared)/personal-details' },
    { id: 2, title: 'Bank Accounts & Payouts', icon: CreditCard, color: '#10b981', route: '/(shared)/payment-methods' },
    { id: 3, title: 'KYC Verification', icon: ShieldCheck, color: '#10b981', status: 'Verified', route: '/(shared)/kyc' },
    { id: 4, title: 'Blockchain Badges (SBTs)', icon: Star, color: '#f59e0b', route: '/(farmer)/sbt-badges', badge: '2 Earned' },
    { id: 5, title: 'Trust Receipts', icon: TrendingUp, color: '#7c3aed', route: '/(shared)/blockchain-receipt' },
    { id: 6, title: 'Notifications', icon: Bell, color: isDark ? '#a1a1aa' : '#71717a', route: '/(shared)/notifications' },
    { id: 7, title: 'App Settings', icon: Settings, color: isDark ? '#a1a1aa' : '#71717a', route: '/(farmer)/settings' },
    { id: 8, title: 'Help & Support', icon: HelpCircle, color: isDark ? '#a1a1aa' : '#71717a', route: '/(shared)/help-support' },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => router.replace('/')
        }
      ]
    );
  };

  const handleMenuPress = (item) => {
    if (item.route) {
       router.push(item.route);
    }
  };

  return (
    <SwipeableScreen currentTab="profile" role="farmer">
      <View className="flex-1 bg-gray-50 dark:bg-zinc-950 pt-12">
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        
        {/* Header */}
        <View className="px-4 py-4 border-b border-gray-200 dark:border-zinc-800 flex-row justify-between items-center">
          <Text className="text-2xl text-gray-900 dark:text-zinc-100 font-bold">My Account</Text>
          <TouchableOpacity 
            onPress={() => router.push('/(farmer)/settings')}
            style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}
            className="w-10 h-10 rounded-full items-center justify-center"
          >
             <Settings color={isDark ? "#ffffff" : "#000000"} size={22} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          
          {/* Profile Card */}
          <View className="bg-white dark:bg-zinc-900 dark:bg-zinc-900 px-4 py-8 items-center border-b border-gray-200 dark:border-zinc-800">
             <View className="relative">
                <View className="w-24 h-24 bg-gray-100 dark:bg-zinc-800 rounded-full items-center justify-center border-4 border-gray-50 dark:border-zinc-950 overflow-hidden">
                   <Image 
                      source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400' }} 
                      className="w-full h-full"
                   />
                </View>
                <TouchableOpacity 
                  onPress={() => router.push('/(shared)/personal-details')}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-[#10b981] rounded-full items-center justify-center border-2 border-white dark:border-zinc-900"
                >
                   <Camera color="#ffffff" size={14} />
                </TouchableOpacity>
             </View>
             <Text className="text-2xl text-gray-900 dark:text-zinc-100 font-bold mt-4 tracking-tight">Ramesh Kumar</Text>
             <Text className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Member since Feb 2024</Text>
             <View className="bg-green-100 dark:bg-green-900/40 px-3 py-1 rounded-full mt-3 flex-row items-center">
                <ShieldCheck color={isDark ? "#4ade80" : "#006e2f"} size={14} />
                <Text className="text-green-700 dark:text-green-400 text-[10px] font-bold ml-1 tracking-wider">VERIFIED FARMER</Text>
             </View>
          </View>

          {/* Stats Row */}
          <View className="flex-row bg-white dark:bg-zinc-900 dark:bg-zinc-900 py-6 border-b border-gray-200 dark:border-zinc-800">
             <View className="flex-1 items-center border-r border-gray-200 dark:border-zinc-800">
                <Text className="text-2xl text-gray-900 dark:text-zinc-100 font-bold tracking-tight">14</Text>
                <Text className="text-xs text-gray-500 dark:text-zinc-400 uppercase font-bold mt-1 tracking-wider">Total Sales</Text>
             </View>
             <View className="flex-1 items-center">
                <Text className="text-2xl text-[#10b981] dark:text-[#4ade80] font-bold tracking-tight">4.8 ★</Text>
                <Text className="text-xs text-gray-500 dark:text-zinc-400 uppercase font-bold mt-1 tracking-wider">Rating</Text>
             </View>
          </View>
          {/* Blockchain Badges — tap to full SBT screen */}
          <TouchableOpacity
            onPress={() => router.push('/(farmer)/sbt-badges')}
            className="bg-white dark:bg-zinc-900 py-5 border-b border-gray-200 dark:border-zinc-800"
          >
             <View className="px-4 flex-row justify-between items-center mb-4">
                <View>
                  <Text className="text-sm text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-wider">On-Chain Reputation</Text>
                  <Text className="text-[10px] text-gray-400 dark:text-zinc-600 font-medium mt-0.5">Soulbound Tokens · Polygon Amoy</Text>
                </View>
                <View className="flex-row items-center">
                   <ShieldCheck color="#10b981" size={14} />
                   <Text className="text-[#10b981] text-xs font-bold ml-1">View All →</Text>
                </View>
             </View>
             <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
                {/* Trusted Farmer — earned */}
                <View className="items-center mr-5">
                   <View className="w-16 h-16 bg-amber-100 dark:bg-amber-900/40 rounded-full items-center justify-center mb-2 border-2 border-amber-300">
                      <Star color="#d97706" fill="#d97706" size={24} />
                   </View>
                   <Text className="text-xs text-gray-900 dark:text-zinc-100 font-bold">Trusted</Text>
                   <Text className="text-[10px] text-gray-500 dark:text-zinc-400">Earned ✓</Text>
                </View>
                {/* Quality Champion — earned */}
                <View className="items-center mr-5">
                   <View className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full items-center justify-center mb-2 border-2 border-blue-300">
                      <ShieldCheck color="#2563eb" size={24} />
                   </View>
                   <Text className="text-xs text-gray-900 dark:text-zinc-100 font-bold">Quality</Text>
                   <Text className="text-[10px] text-gray-500 dark:text-zinc-400">Earned ✓</Text>
                </View>
                {/* Consistent Supplier — locked */}
                <View className="items-center mr-5 opacity-50">
                   <View className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full items-center justify-center mb-2 border-2 border-dashed border-gray-300 dark:border-zinc-600">
                      <TrendingUp color={isDark ? '#71717a' : '#9ca3af'} size={24} />
                   </View>
                   <Text className="text-xs text-gray-500 dark:text-zinc-500 font-bold">Consistent</Text>
                   <Text className="text-[10px] text-gray-400 dark:text-zinc-600">34/50</Text>
                </View>
                {/* Lightning Delivery — locked */}
                <View className="items-center mr-4 opacity-50">
                   <View className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full items-center justify-center mb-2 border-2 border-dashed border-gray-300 dark:border-zinc-600">
                      <Star color={isDark ? '#71717a' : '#9ca3af'} size={24} />
                   </View>
                   <Text className="text-xs text-gray-500 dark:text-zinc-500 font-bold">Lightning</Text>
                   <Text className="text-[10px] text-gray-400 dark:text-zinc-600">11/20</Text>
                </View>
             </ScrollView>
          </TouchableOpacity>

          {/* Menu Items */}
          <View className="mt-4 bg-white dark:bg-zinc-900 dark:bg-zinc-900 border-t border-b border-gray-200 dark:border-zinc-800">
             {menuItems.map((item, index) => (
               <TouchableOpacity 
                  key={item.id} 
                  onPress={() => handleMenuPress(item)}
                  className={`flex-row items-center justify-between px-4 py-4 ${index !== menuItems.length - 1 ? 'border-b border-gray-100 dark:border-zinc-800' : ''}`}
               >
                  <View className="flex-row items-center">
                     <View className="w-10 h-10 bg-gray-50 dark:bg-zinc-800 rounded-xl items-center justify-center mr-3">
                        <item.icon color={item.color} size={20} />
                     </View>
                     <Text className="text-gray-900 dark:text-zinc-100 font-semibold text-base">{item.title}</Text>
                  </View>
                  <View className="flex-row items-center">
                     {item.badge && (
                       <View className="bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-full mr-2">
                         <Text className="text-amber-700 dark:text-amber-400 text-[10px] font-black">{item.badge}</Text>
                       </View>
                     )}
                     {item.status && (
                       <Text className="text-green-700 dark:text-green-400 text-sm font-bold mr-2">{item.status}</Text>
                     )}
                     <ChevronRight color={isDark ? "#52525b" : "#d1d5db"} size={20} />
                  </View>
               </TouchableOpacity>
             ))}
          </View>

          {/* Logout */}
          <TouchableOpacity 
            onPress={handleLogout}
            className="mt-6 mx-4 bg-red-50 dark:bg-red-900/10 h-14 rounded-2xl flex-row items-center justify-center border border-red-100 dark:border-red-900/30 mb-8"
          >
             <LogOut color={isDark ? "#f87171" : "#ef4444"} size={20} />
             <Text className="text-red-600 dark:text-red-400 font-bold text-base ml-2">Sign Out</Text>
          </TouchableOpacity>

          <View className="h-32" />
        </ScrollView>
      </View>
    </SwipeableScreen>
  );
};

export default FarmerProfile;
