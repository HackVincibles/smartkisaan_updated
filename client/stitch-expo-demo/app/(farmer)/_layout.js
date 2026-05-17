import React from 'react';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { LayoutDashboard, ListOrdered, Plus, TrendingUp, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';

export default function FarmerLayout() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs screenOptions={{ 
      headerShown: false,
      tabBarActiveTintColor: '#10b981',
      tabBarInactiveTintColor: isDark ? '#a1a1aa' : '#71717a',
      tabBarStyle: {
        position: 'absolute',
        bottom: 24,
        left: 16,
        right: 16,
        height: 64,
        borderRadius: 32,
        backgroundColor: isDark ? '#18181b' : '#ffffff',
        borderTopWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        paddingBottom: 0,
        paddingTop: 0,
      }
    }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="listings"
        options={{
          title: 'Listings',
          tabBarIcon: ({ color }) => <ListOrdered size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add-listing"
        options={{
          title: 'Add New',
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <View className="w-14 h-14 bg-[#10b981] rounded-full items-center justify-center -mt-6 border-4 border-white dark:border-zinc-950 shadow-sm shadow-[#10b981]/20">
              <Plus size={28} color="#ffffff" strokeWidth={3} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="market"
        options={{
          title: 'Market',
          tabBarIcon: ({ color }) => <TrendingUp size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
      
      {/* Hidden Screens */}
      <Tabs.Screen
        name="bids"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="no-listings"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="offline"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile-details"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="bank-accounts"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="camera-scanner"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="listing-details"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="sbt-badges"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="track-shipments"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
