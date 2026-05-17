import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StatusBar, Alert, TextInput } from 'react-native';
import { 
  ChevronLeft, 
  Search, 
  Filter, 
  MoreVertical,
  Plus,
  Package
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';

import { SwipeableScreen } from '../../components/SwipeableScreen';

const MyListings = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('All');
  const [sortBy, setSortBy] = useState(null); // null, 'bids-desc', 'price-asc', 'price-desc'

  const [myListings, setMyListings] = useState([
    {
      id: 1,
      title: 'Kesar Mangoes',
      desc: 'Premium hand-picked export quality',
      price: '₹1,250',
      unit: 'Box',
      grade: 'Grade A++',
      status: 'Active',
      bids: 12,
      image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=400'
    },
    {
      id: 2,
      title: 'Basmati Rice',
      desc: 'Aromatic long grain, 1121 variety',
      price: '₹5,400',
      unit: 'Quintal',
      grade: 'Grade A',
      status: 'Active',
      bids: 5,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=400'
    },
    {
      id: 3,
      title: 'Red Onions',
      desc: 'Medium size, high pungency',
      price: '₹1,850',
      unit: 'Quintal',
      grade: 'Grade B',
      status: 'Sold',
      bids: 0,
      image: 'https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=400'
    }
  ]);

  const handleFilterPress = () => {
    Alert.alert(
      "Sort & Filter Listings",
      "Choose a sorting strategy for your harvest listings:",
      [
        { text: "Original Order", onPress: () => setSortBy(null) },
        { text: "Most Bids First", onPress: () => setSortBy('bids-desc') },
        { text: "Price: Low to High", onPress: () => setSortBy('price-asc') },
        { text: "Price: High to Low", onPress: () => setSortBy('price-desc') },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const handleMorePress = (item) => {
    Alert.alert(
      `Listing Action: ${item.title}`,
      "Manage your active harvest listing:",
      [
        { 
          text: item.status === 'Active' ? "Mark as Sold" : "Mark as Active", 
          onPress: () => {
            const updated = myListings.map(lst => {
              if (lst.id === item.id) {
                return { 
                  ...lst, 
                  status: lst.status === 'Active' ? 'Sold' : 'Active',
                  bids: lst.status === 'Active' ? 0 : 5
                };
              }
              return lst;
            });
            setMyListings(updated);
            Alert.alert("Success", `Status updated to ${item.status === 'Active' ? 'Sold' : 'Active'}!`);
          } 
        },
        { 
          text: "Delete Listing", 
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Delete Confirmation",
              "Are you sure you want to permanently delete this listing?",
              [
                { text: "Cancel", style: "cancel" },
                { 
                  text: "Delete", 
                  style: "destructive",
                  onPress: () => {
                    const filtered = myListings.filter(lst => lst.id !== item.id);
                    setMyListings(filtered);
                  } 
                }
              ]
            );
          } 
        },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  let processedListings = myListings.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = selectedTab === 'All' ? true : item.status === selectedTab;
    return matchesSearch && matchesTab;
  });

  if (sortBy === 'bids-desc') {
    processedListings = [...processedListings].sort((a, b) => b.bids - a.bids);
  } else if (sortBy === 'price-asc') {
    processedListings = [...processedListings].sort((a, b) => {
      const priceA = parseInt(a.price.replace(/[₹,]/g, ''));
      const priceB = parseInt(b.price.replace(/[₹,]/g, ''));
      return priceA - priceB;
    });
  } else if (sortBy === 'price-desc') {
    processedListings = [...processedListings].sort((a, b) => {
      const priceA = parseInt(a.price.replace(/[₹,]/g, ''));
      const priceB = parseInt(b.price.replace(/[₹,]/g, ''));
      return priceB - priceA;
    });
  }

  const activeCount = myListings.filter(l => l.status === 'Active').length;
  const soldCount = myListings.filter(l => l.status === 'Sold').length;

  return (
    <SwipeableScreen currentTab="listings" role="farmer">
      <View className="flex-1 bg-gray-50 dark:bg-zinc-950 pt-12">
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        
        {/* Modern Cylindrical Header */}
        <View className="px-6 py-8 bg-[#004b1e] dark:bg-zinc-900 mx-2 mt-2 rounded-t-[100px] rounded-b-[40px] shadow-lg border border-gray-100 dark:border-zinc-800">
          <View className="flex-row items-center mb-1">
             <Package color="#ffffff" size={18} />
             <Text className="text-white/70 text-[10px] font-black ml-2 uppercase tracking-widest">Farmer Portal</Text>
          </View>
          <Text className="text-3xl text-white font-black">My Listings</Text>
        </View>

        {/* Search Bar */}
        <View className="px-4 mt-4">
           <View className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 h-12 rounded-xl flex-row items-center px-4 shadow-sm">
              <Search color={isDark ? "#a1a1aa" : "#64748b"} size={20} />
              <TextInput 
                placeholder="Search listings..."
                className="flex-1 ml-4 text-gray-900 dark:text-zinc-100"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
           </View>
        </View>

        {/* Tabs / Filters */}
        <View className="px-4 py-4 flex-row items-center justify-between">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1">
            <TouchableOpacity 
              onPress={() => setSelectedTab('All')}
              className={`${selectedTab === 'All' ? 'bg-[#006e2f]' : 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800'} px-6 py-2 rounded-full mr-3 shadow-md`}
            >
              <Text className={`${selectedTab === 'All' ? 'text-white' : 'text-gray-500 dark:text-zinc-400'} text-sm font-black uppercase tracking-widest`}>All ({myListings.length})</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setSelectedTab('Active')}
              className={`${selectedTab === 'Active' ? 'bg-[#006e2f]' : 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800'} px-6 py-2 rounded-full mr-3 border border-gray-200 dark:border-zinc-800`}
            >
              <Text className={`${selectedTab === 'Active' ? 'text-white' : 'text-gray-500 dark:text-zinc-400'} text-sm font-black uppercase tracking-widest`}>Active ({activeCount})</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setSelectedTab('Sold')}
              className={`${selectedTab === 'Sold' ? 'bg-[#006e2f]' : 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800'} px-6 py-2 rounded-full mr-3 border border-gray-200 dark:border-zinc-800`}
            >
              <Text className={`${selectedTab === 'Sold' ? 'text-white' : 'text-gray-500 dark:text-zinc-400'} text-sm font-black uppercase tracking-widest`}>Sold ({soldCount})</Text>
            </TouchableOpacity>
          </ScrollView>
          <TouchableOpacity 
            onPress={handleFilterPress}
            className={`ml-3 w-12 h-12 rounded-2xl items-center justify-center shadow-sm border ${
              sortBy !== null 
                ? 'bg-blue-500 border-blue-500' 
                : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800'
            }`}
          >
            <Filter color={sortBy !== null ? "#ffffff" : (isDark ? "#4ade80" : "#006e2f")} size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-4">
          {processedListings.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              onPress={() => router.push({ pathname: '/(farmer)/listing-details', params: { id: item.id } })}
              className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl mb-5 p-5 shadow-sm"
            >
              <View className="flex-row gap-5">
                <View className="w-28 h-28 bg-gray-100 dark:bg-zinc-800 rounded-2xl overflow-hidden relative">
                   <Image 
                    source={{ uri: item.image }} 
                    className="w-full h-full"
                    resizeMode="cover"
                   />
                   <View className="absolute top-2 left-2 bg-white/90 dark:bg-zinc-900/90 px-2 py-0.5 rounded-lg shadow-sm">
                      <Text className="text-green-700 dark:text-green-400 text-[9px] font-black uppercase tracking-widest">{item.grade}</Text>
                   </View>
                </View>
                
                <View className="flex-1 py-1 justify-between">
                  <View>
                    <View className="flex-row justify-between items-start mb-1">
                      <Text className="text-xl text-gray-900 dark:text-zinc-100 font-black tracking-tight flex-1 mr-2" numberOfLines={1}>{item.title}</Text>
                      <TouchableOpacity onPress={() => handleMorePress(item)}>
                        <MoreVertical color={isDark ? "#71717a" : "#9ca3af"} size={18} />
                      </TouchableOpacity>
                    </View>
                    <Text className="text-xs text-gray-500 dark:text-zinc-400 font-bold mb-3" numberOfLines={1}>{item.desc}</Text>
                  </View>
                  
                  <View className="flex-row items-center justify-between">
                     <Text className="text-[#004b1e] dark:text-[#4ade80] font-black text-2xl">{item.price}<Text className="text-xs font-bold text-gray-400">/{item.unit}</Text></Text>
                     <View className={`px-3 py-1.5 rounded-xl ${
                        item.status === 'Active' ? 'bg-green-100 dark:bg-green-900/40' : 
                        item.status === 'Pending AI' ? 'bg-amber-100 dark:bg-amber-900/40' : 'bg-gray-100 dark:bg-zinc-800'
                      }`}>
                        <Text className={`text-[10px] font-black uppercase tracking-wider ${
                           item.status === 'Active' ? 'text-green-700 dark:text-green-400' : 
                           item.status === 'Pending AI' ? 'text-amber-700 dark:text-amber-400' : 'text-gray-700 dark:text-zinc-400'
                        }`}>{item.status === 'Active' ? `${item.bids} Bids` : item.status}</Text>
                     </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          <View className="h-32" />
        </ScrollView>
        
        {/* Floating Action Button */}
        <TouchableOpacity 
          onPress={() => router.push('/(farmer)/add-listing')}
          className="absolute bottom-28 right-6 w-16 h-16 bg-[#10b981] rounded-full items-center justify-center shadow-2xl shadow-green-500/50 border-4 border-white dark:border-zinc-950"
        >
          <Plus color="#ffffff" size={32} />
        </TouchableOpacity>
      </View>
    </SwipeableScreen>
  );
};

export default MyListings;
