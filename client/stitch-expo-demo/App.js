import React from 'react';
import { View, Text, ScrollView, SafeAreaView, Image, TouchableOpacity, StatusBar } from 'react-native';
import { 
  Bell, 
  Sun, 
  Wallet, 
  Sparkles, 
  ArrowRight, 
  PlusCircle, 
  Eye, 
  Headset, 
  Gavel, 
  Truck, 
  Home,
  Store,
  FileText,
  User,
  Zap
} from 'lucide-react-native';
import "./global.css";

const FarmerDashboard = () => {
  return (
    <View className="flex-1 bg-background pt-12">
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="bg-surface px-margin py-md flex-row justify-between items-center shadow-sm border-b border-outline-variant">
        <View className="flex-row items-center gap-md">
          <View className="w-10 h-10 rounded-full border-2 border-primary-fixed bg-surface-container overflow-hidden">
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3_9TgncW-pAP89pUO6TzFbZH9rqn5fawoSfle8blA6jThzJLNcsdyYVso9zlmBnhXOZBWsx1SSA_SrIHbvSa1gcpesQ07C4P7cJ8BpVd3YvfelyI1Xl_KGxfPSYP6v9Z3fmzefeuaynlca1WX4ZyYSa2eNI8iUawyIABOSLIUzxRf1OJEUK9ilKqZT57vHF6HL_CT0g20Yioa-M_l-62GJ-SGDpW9K_Eyhdk6nVGFIZQM1abnoIypm7takV3ijrX-OozHRtPJA6xR' }}
              className="w-full h-full"
            />
          </View>
          <Text className="text-xl font-bold text-primary">Smart-Kissan</Text>
        </View>
        <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-surface-container-low">
          <Bell size={24} color="#006e2f" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-margin pt-lg space-y-lg">
          
          {/* Welcome Header */}
          <View>
            <Text className="text-2xl font-bold text-on-surface">Welcome, Rajesh!</Text>
            <Text className="text-sm text-on-surface-variant">Here's what's happening on your farm today.</Text>
          </View>

          {/* Weather & Tip Row */}
          <View className="flex-row gap-md">
            <View className="flex-1 bg-surface-container-low p-md rounded-xl border border-outline-variant h-28 justify-between">
              <View className="flex-row justify-between items-start">
                <Sun size={24} color="#855300" />
                <Text className="text-xs font-bold text-on-surface">28°C</Text>
              </View>
              <View>
                <Text className="text-[10px] text-on-surface-variant">Nashik, MH</Text>
                <Text className="text-sm font-semibold text-primary">Clear Skies</Text>
              </View>
            </View>
            <View className="flex-1 bg-secondary-container p-md rounded-xl border border-outline-variant h-28">
              <Text className="text-[10px] font-bold text-on-secondary-container mb-1 uppercase tracking-wider">Farm Tip</Text>
              <Text className="text-sm text-on-secondary-fixed-variant italic leading-5">"Water early morning to minimize evaporation."</Text>
            </View>
          </View>

          {/* Stats Cards */}
          <View className="space-y-md">
            <View className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-surface-container-high flex-row items-center justify-between">
              <View>
                <Text className="text-xs text-on-surface-variant">Total Earnings</Text>
                <Text className="text-2xl font-bold text-primary">₹45,000</Text>
              </View>
              <View className="w-12 h-12 bg-primary-container rounded-full items-center justify-center">
                <Wallet size={24} color="#004b1e" />
              </View>
            </View>
            
            <View className="flex-row gap-md">
              <View className="flex-1 bg-surface-container-lowest p-md rounded-xl shadow-sm border border-surface-container-high">
                <Text className="text-xs text-on-surface-variant">Active Listings</Text>
                <View className="flex-row items-baseline gap-1 mt-1">
                  <Text className="text-xl font-bold text-on-surface">5</Text>
                  <Text className="text-[10px] font-medium text-primary">+2 new</Text>
                </View>
              </View>
              <View className="flex-1 bg-surface-container-lowest p-md rounded-xl shadow-sm border border-surface-container-high">
                <Text className="text-xs text-on-surface-variant">Bids Received</Text>
                <View className="flex-row items-baseline gap-1 mt-1">
                  <Text className="text-xl font-bold text-on-surface">12</Text>
                  <Text className="text-[10px] font-medium text-tertiary">3 pending</Text>
                </View>
              </View>
            </View>
          </View>

          {/* AI Grade Card */}
          <View className="relative overflow-hidden bg-primary rounded-xl p-lg shadow-lg">
            <View className="absolute -right-8 -top-8 w-40 h-40 bg-white opacity-20 rounded-full" />
            <View className="flex-row items-center gap-2 mb-2">
              <Sparkles size={20} color="#6bff8f" />
              <Text className="text-lg font-bold text-white">AI Crop Grading</Text>
            </View>
            <Text className="text-sm text-white opacity-90 mb-4">
              Instantly assess your harvest quality using AI. Get a certified grade for higher market value.
            </Text>
            <TouchableOpacity className="bg-primary-fixed flex-row items-center justify-center py-3 rounded-lg gap-2">
              <Text className="text-sm font-bold text-on-primary-fixed">Start Assessment</Text>
              <ArrowRight size={18} color="#002109" />
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <View>
            <Text className="text-lg font-bold text-on-surface mb-md">Quick Actions</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              <TouchableOpacity className="items-center gap-2 bg-surface-container-lowest p-md rounded-xl border border-surface-container-high mr-md min-w-[100px]">
                <View className="w-10 h-10 bg-green-50 rounded-full items-center justify-center">
                  <PlusCircle size={24} color="#006e2f" />
                </View>
                <Text className="text-xs font-semibold text-on-surface">Add Listing</Text>
              </TouchableOpacity>
              <TouchableOpacity className="items-center gap-2 bg-surface-container-lowest p-md rounded-xl border border-surface-container-high mr-md min-w-[100px]">
                <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center">
                  <Eye size={24} color="#565e74" />
                </View>
                <Text className="text-xs font-semibold text-on-surface">View Bids</Text>
              </TouchableOpacity>
              <TouchableOpacity className="items-center gap-2 bg-surface-container-lowest p-md rounded-xl border border-surface-container-high min-w-[100px]">
                <View className="w-10 h-10 bg-amber-50 rounded-full items-center justify-center">
                  <Headset size={24} color="#855300" />
                </View>
                <Text className="text-xs font-semibold text-on-surface">Support</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Recent Activity */}
          <View>
            <View className="flex-row justify-between items-center mb-md">
              <Text className="text-lg font-bold text-on-surface">Recent Activity</Text>
              <TouchableOpacity>
                <Text className="text-xs font-bold text-primary">See All</Text>
              </TouchableOpacity>
            </View>
            
            <View className="space-y-md">
              {/* Item 1 */}
              <View className="bg-surface-container-lowest p-md rounded-xl border border-surface-container-high flex-row gap-md">
                <View className="w-10 h-10 bg-green-50 rounded-lg items-center justify-center">
                  <Gavel size={20} color="#006e2f" />
                </View>
                <View className="flex-1">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-sm font-bold text-on-surface">New Bid: Onions</Text>
                    <Text className="text-[10px] text-on-surface-variant">2h ago</Text>
                  </View>
                  <Text className="text-sm text-on-surface-variant mb-2">Shyam Traders offered ₹18/kg for 500kg.</Text>
                  <View className="self-start px-2 py-0.5 bg-green-100 rounded-full">
                    <Text className="text-[10px] font-bold text-green-800 uppercase tracking-tighter">New Bid</Text>
                  </View>
                </View>
              </View>

              {/* Item 2 */}
              <View className="bg-surface-container-lowest p-md rounded-xl border border-surface-container-high flex-row gap-md">
                <View className="w-10 h-10 bg-blue-50 rounded-lg items-center justify-center">
                  <Truck size={20} color="#565e74" />
                </View>
                <View className="flex-1">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-sm font-bold text-on-surface">Order Pick-up</Text>
                    <Text className="text-[10px] text-on-surface-variant">5h ago</Text>
                  </View>
                  <Text className="text-sm text-on-surface-variant mb-2">Logistics partner assigned for Wheat delivery.</Text>
                  <View className="self-start px-2 py-0.5 bg-blue-100 rounded-full">
                    <Text className="text-[10px] font-bold text-blue-800 uppercase tracking-tighter">In Progress</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Navigation Bar */}
      <View className="absolute bottom-0 left-0 right-0 h-20 bg-white flex-row justify-around items-center rounded-t-3xl shadow-xl px-4 pb-4 border-t border-gray-100">
        <TouchableOpacity className="items-center">
          <Home size={24} color="#006e2f" />
          <Text className="text-[10px] font-bold text-primary mt-1">Home</Text>
          <View className="w-1 h-1 bg-primary rounded-full mt-1" />
        </TouchableOpacity>
        <TouchableOpacity className="items-center opacity-60">
          <Store size={24} color="#565e74" />
          <Text className="text-[10px] font-bold text-on-secondary-container mt-1">Market</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center opacity-60">
          <FileText size={24} color="#565e74" />
          <Text className="text-[10px] font-bold text-on-secondary-container mt-1">Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center opacity-60">
          <Truck size={24} color="#565e74" />
          <Text className="text-[10px] font-bold text-on-secondary-container mt-1">Logistics</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center opacity-60">
          <User size={24} color="#565e74" />
          <Text className="text-[10px] font-bold text-on-secondary-container mt-1">Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function App() {
  return <FarmerDashboard />;
}
