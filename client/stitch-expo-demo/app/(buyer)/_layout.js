import React from 'react';
import { Tabs } from 'expo-router';
import { ShoppingBag, Search, Gavel, BarChart3, User } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BuyerLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#d97706',
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
          title: 'Shop',
          tabBarIcon: ({ color }) => <ShoppingBag size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bids"
        options={{
          title: 'My Bids',
          tabBarIcon: ({ color }) => <Gavel size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color }) => <BarChart3 size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />

      {/* Hidden screens */}
      <Tabs.Screen name="no-orders"   options={{ href: null }} />
      <Tabs.Screen name="place-bid"   options={{ href: null }} />
      <Tabs.Screen name="track-order" options={{ href: null }} />
      <Tabs.Screen name="my-orders" options={{ href: null }} />
      <Tabs.Screen name="payment" options={{ href: null }} />
    </Tabs>
  );
}
