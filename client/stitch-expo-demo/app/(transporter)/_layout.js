import React from 'react';
import { useColorScheme } from 'nativewind';
import { Tabs } from 'expo-router';
import { Truck, Map, Box, Users, User } from 'lucide-react-native';

export default function TransporterLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs screenOptions={{ 
      headerShown: false,
      tabBarActiveTintColor: '#2563eb', // A nice blue for logistics
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
          title: 'Dispatch',
          tabBarIcon: ({ color }) => <Truck size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="shipments"
        options={{
          title: 'Loads',
          tabBarIcon: ({ color }) => <Box size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="navigation"
        options={{
          title: 'Routes',
          tabBarIcon: ({ color }) => <Map size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="fleet"
        options={{
          title: 'Fleet',
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
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
      <Tabs.Screen name="optimizer" options={{ href: null }} />
    </Tabs>
  );
}
