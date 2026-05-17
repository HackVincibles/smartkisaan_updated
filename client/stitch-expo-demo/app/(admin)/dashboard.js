import React, { useState } from 'react';
import { useColorScheme } from 'nativewind';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  Activity,
  ChevronRight,
  LogOut,
  Bell
} from 'lucide-react-native';
import { router } from 'expo-router';
import TrustBlueprintModal from '../(shared)/TrustBlueprint';

const AdminDashboard = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [blueprintVisible, setBlueprintVisible] = useState(false);

  const stats = [
    { id: 1, label: 'Active Users', value: '12.4k', icon: Users, color: '#2563eb' },
    { id: 2, label: 'Pending KYC', value: '48', icon: ShieldCheck, color: '#059669' },
    { id: 3, label: 'Disputes', value: '5', icon: AlertTriangle, color: '#dc2626' },
    { id: 4, label: 'Trade Vol.', value: '₹1.2Cr', icon: TrendingUp, color: '#7c3aed' },
  ];

  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950 pt-12">
      <StatusBar style={isDark ? "light" : "dark"} />
      
      {/* Header */}
      <View className="px-4 py-4 bg-white dark:bg-zinc-900 mx-2 mt-2 rounded-[40px] shadow-sm flex-row justify-between items-center border border-gray-100 dark:border-zinc-800">
        <View>
          <Text className="text-xs text-gray-500 dark:text-zinc-400 font-bold">PLATFORM ADMIN</Text>
          <Text className="text-xl text-gray-900 dark:text-zinc-100 font-bold">Command Center</Text>
        </View>
        <TouchableOpacity 
          onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Notifications', description: 'System alerts and updates' } })}
          className="w-10 h-10 bg-white dark:bg-zinc-900 rounded-full items-center justify-center border border-gray-200 dark:border-zinc-800 shadow-sm"
        >
          <Bell color={isDark ? "#ffffff" : "#0b1c30"} size={20} />
          <View className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        
        {/* System Health */}
        <View className="mx-4 mt-4 bg-[#0f172a] rounded-2xl p-6 shadow-lg">
           <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white text-lg font-bold">System Integrity</Text>
              <View className="bg-green-500/20 px-2 py-1 rounded flex-row items-center">
                 <View className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                 <Text className="text-green-500 text-[10px] font-bold">OPERATIONAL</Text>
              </View>
           </View>
           <View className="flex-row justify-between items-center">
              <View>
                 <Text className="text-white text-2xl font-bold">99.98%</Text>
                 <Text className="text-white/50 text-[10px] font-bold uppercase">Uptime</Text>
              </View>
              <View className="items-end">
                 <Text className="text-white text-2xl font-bold">42ms</Text>
                 <Text className="text-white/50 text-[10px] font-bold uppercase">Latency</Text>
              </View>
           </View>
        </View>

        {/* Trust Blueprint Promo Card */}
        <TouchableOpacity 
          onPress={() => setBlueprintVisible(true)}
          className="mx-4 mt-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex-row items-center justify-between shadow-lg"
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
            <Text className="text-xs text-green-400 font-black">View Blueprint</Text>
          </View>
        </TouchableOpacity>

        {/* Quick Stats Grid */}
        <View className="flex-row flex-wrap px-4 mt-6">
           {stats.map((stat) => (
             <View key={stat.id} className="w-[48%] bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 mb-4 mr-[4%] last:mr-0">
                <View className="w-10 h-10 rounded-xl items-center justify-center mb-sm" style={{ backgroundColor: `${stat.color}15` }}>
                   <stat.icon color={stat.color} size={20} />
                </View>
                <Text className="text-gray-900 dark:text-zinc-100 font-bold text-xl">{stat.value}</Text>
                <Text className="text-xs text-gray-500 dark:text-zinc-400 font-medium">{stat.label}</Text>
             </View>
           ))}
        </View>

        {/* Verification Queue */}
        <View className="px-4 mt-4 mb-4 flex-row justify-between items-center">
           <Text className="text-xl text-gray-900 dark:text-zinc-100 font-bold">Pending Approvals</Text>
           <TouchableOpacity onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Queue', description: 'Full verification queue is empty' } })}>
              <Text className="text-primary font-bold text-sm">View Queue</Text>
           </TouchableOpacity>
        </View>

        <View className="mx-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
           {[1, 2, 3].map((i) => (
             <TouchableOpacity 
               key={i} 
               onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'User Details', description: 'Open user KYC profile' } })}
               className={`flex-row items-center justify-between p-4 ${i !== 3 ? 'border-b border-gray-200 dark:border-zinc-800' : ''}`}
             >
                <View className="flex-row items-center">
                   <View className="w-10 h-10 bg-gray-100 dark:bg-zinc-800/50 rounded-full items-center justify-center mr-4">
                      <Users color="#64748b" size={20} />
                   </View>
                   <View>
                      <Text className="text-gray-900 dark:text-zinc-100 font-bold text-base">Arjun Sharma</Text>
                      <Text className="text-[10px] text-gray-500 dark:text-zinc-400">Farmer • Vidisha, MP</Text>
                   </View>
                </View>
                <ChevronRight color="#bccbb9" size={18} />
             </TouchableOpacity>
           ))}
        </View>

        {/* Security Logs */}
        <View className="px-4 mt-8 mb-4 flex-row justify-between items-center">
           <Text className="text-xl text-gray-900 dark:text-zinc-100 font-bold">Security Logs</Text>
           <TouchableOpacity onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Export', description: 'Downloading CSV...' } })}>
              <Text className="text-primary font-bold text-sm">Export CSV</Text>
           </TouchableOpacity>
        </View>
        
        <View className="mx-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 mb-8 shadow-sm">
           <View className="flex-row items-center py-2">
              <Activity color="#64748b" size={16} />
              <Text className="text-xs text-gray-500 dark:text-zinc-400 ml-4">New Buyer Registration (IP: 192.168.1.1)</Text>
           </View>
           <View className="flex-row items-center py-2">
              <Activity color="#64748b" size={16} />
              <Text className="text-xs text-gray-500 dark:text-zinc-400 ml-4">Escrow Release: Order #8241 Confirmed</Text>
           </View>
        </View>

        <TouchableOpacity 
          onPress={() => router.push('/')}
          className="mx-4 bg-gray-100 dark:bg-zinc-800/50 h-14 rounded-xl flex-row items-center justify-center border border-gray-200 dark:border-zinc-800 mb-8"
        >
           <LogOut color="#ba1a1a" size={20} />
           <Text className="text-error font-bold text-lg ml-2">Exit Admin Mode</Text>
        </TouchableOpacity>

        <View className="h-20" />
      </ScrollView>
      <TrustBlueprintModal visible={blueprintVisible} onClose={() => setBlueprintVisible(false)} />
    </View>
  );
};

export default AdminDashboard;
