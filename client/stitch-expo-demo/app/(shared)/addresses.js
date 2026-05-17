import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { ArrowLeft, MapPin, Plus, CheckCircle2 } from 'lucide-react-native';

export default function Addresses() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [addresses, setAddresses] = useState([
    {
      id: '1',
      title: 'Home / Farm',
      lines: ['142 Green Fields Road', 'Near Mandi Gate 2', 'Indore, Madhya Pradesh 452001'],
      isDefault: true
    },
    {
      id: '2',
      title: 'Warehouse',
      lines: ['Plot 45, Industrial Area', 'Dewas Naka', 'Indore, Madhya Pradesh 452010'],
      isDefault: false
    }
  ]);

  const setDefault = (id) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  const handleAddAddress = () => {
    Alert.alert(
      "Add Address",
      "Which address profile would you like to add?",
      [
        {
          text: "Mandi Shop",
          onPress: () => {
            setAddresses(prev => [
              ...prev,
              {
                id: Date.now().toString(),
                title: 'Mandi Shop 12',
                lines: ['Shop No. 12, Grain Mandi', 'A.B. Road', 'Indore, Madhya Pradesh 452003'],
                isDefault: false
              }
            ]);
            Alert.alert("Success", "Mandi Shop address added successfully.");
          }
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950">
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View className="px-6 pt-14 pb-4 flex-row items-center border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-full items-center justify-center mr-4">
          <ArrowLeft color={isDark ? "#ffffff" : "#000000"} size={20} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 dark:text-zinc-100">Delivery Addresses</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        <Text className="text-sm font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest mb-4 ml-1">Saved Addresses</Text>

        {addresses.map(addr => (
          <TouchableOpacity 
            key={addr.id}
            onPress={() => setDefault(addr.id)}
            className="rounded-2xl border p-5 mb-4 relative"
            style={{
              backgroundColor: addr.isDefault ? 'rgba(16, 185, 129, 0.1)' : (isDark ? '#18181b' : '#ffffff'),
              borderColor: addr.isDefault ? 'rgba(16, 185, 129, 0.3)' : (isDark ? '#27272a' : '#e4e4e7'),
              borderWidth: 1,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.04,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            {addr.isDefault && (
              <View className="absolute top-4 right-4 flex-row items-center">
                <CheckCircle2 color="#10b981" size={16} />
                <Text className="text-[#10b981] font-black text-[10px] uppercase ml-1">Default</Text>
              </View>
            )}
            <View className="flex-row items-start mb-2">
              <MapPin color={addr.isDefault ? "#10b981" : (isDark ? "#71717a" : "#9ca3af")} size={20} />
              <Text className="text-lg font-bold text-gray-900 dark:text-zinc-100 ml-2">{addr.title}</Text>
            </View>
            <Text className={`text-sm ml-7 leading-relaxed ${addr.isDefault ? 'text-gray-700 dark:text-zinc-300' : 'text-gray-500 dark:text-zinc-400'}`}>
              {addr.lines.join(',\n')}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity 
          onPress={handleAddAddress}
          className="bg-[#10b981] h-14 rounded-2xl flex-row items-center justify-center mt-4"
          style={{
            shadowColor: '#10b981',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Plus color="#fff" size={20} />
          <Text className="text-white font-bold text-lg ml-2">Add New Address</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

