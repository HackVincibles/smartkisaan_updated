import React, { useState, useEffect } from 'react';
import { useColorScheme } from 'nativewind';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StatusBar, Image, Alert, Modal } from 'react-native';
import { 
  ChevronLeft, 
  Search as SearchIcon, 
  Filter, 
  MapPin, 
  SlidersHorizontal,
  ChevronRight,
  Star,
  Mic,
  X,
  Volume2,
  Settings2,
  Users
} from 'lucide-react-native';
import { router } from 'expo-router';

import { SwipeableScreen } from '../../components/SwipeableScreen';

const SearchScreen = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [distFilter, setDistFilter] = useState(false);
  const [priceSort, setPriceSort] = useState(null); // null, 'asc', 'desc'
  const [gradeFilter, setGradeFilter] = useState(false);

  // Advanced Filter Modal States
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchMode, setSearchMode] = useState('All'); // 'All', 'Spot', 'Coop'
  const [regionFilter, setRegionFilter] = useState('All'); // 'All', 'Punjab', 'Maharashtra', 'Haryana'
  const [minRating, setMinRating] = useState(0); // 0, 4.6, 4.8

  // Voice recognition simulator states
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('Listening for voice input...');
  const [waveHeights, setWaveHeights] = useState([20, 35, 15, 28, 40, 20]);

  // Handle oscillating soundwave heights when voice search is active
  useEffect(() => {
    let interval;
    if (isListening) {
      interval = setInterval(() => {
        setWaveHeights(Array.from({ length: 6 }, () => Math.floor(Math.random() * 45) + 15));
      }, 120);
    }
    return () => clearInterval(interval);
  }, [isListening]);

  const handleStartVoice = () => {
    setIsListening(true);
    setVoiceText('Listening for voice input...');
    
    // Simulate real speech-to-text conversion
    setTimeout(() => {
      setVoiceText('Recognizing speech: "Basmati Rice..."');
    }, 1200);

    setTimeout(() => {
      setVoiceText('Searching for: "Basmati Rice"');
    }, 2200);

    setTimeout(() => {
      setSearchQuery('Basmati Rice');
      setIsListening(false);
      Alert.alert(
        "Voice Query Captured", 
        'Voice Search automatically matched your query to "Basmati Rice".'
      );
    }, 3200);
  };

  const searchResults = [
    {
      id: 1,
      title: 'Organic Wheat',
      farmer: 'Rajesh Kumar',
      price: '₹2,100',
      unit: 'Quintal',
      grade: 'Grade A',
      rating: '4.8',
      location: 'Punjab',
      distance: 85,
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=400',
      groupBuy: false
    },
    {
      id: 2,
      title: 'Basmati Rice',
      farmer: 'Suresh Singh',
      price: '₹5,400',
      unit: 'Quintal',
      grade: 'Grade A++',
      rating: '4.9',
      location: 'Haryana',
      distance: 120,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=400',
      groupBuy: true
    },
    {
      id: 3,
      title: 'Red Onions',
      farmer: 'Amit Patel',
      price: '₹1,850',
      unit: 'Quintal',
      grade: 'Grade B',
      rating: '4.5',
      location: 'Maharashtra',
      distance: 35,
      image: 'https://images.unsplash.com/photo-1508747703725-719777637510?q=80&w=400',
      groupBuy: false
    },
    {
      id: 101,
      title: 'Alphonso Mango Export Pool',
      farmer: 'Ratnagiri Cooperative Union',
      price: '₹2,200',
      unit: 'Box',
      grade: 'Grade A++',
      rating: '4.9',
      location: 'Maharashtra',
      distance: 28,
      image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=400',
      groupBuy: true
    },
    {
      id: 102,
      title: 'Kolkata Potato Heavy Lot',
      farmer: 'Bengal Growers Alliance',
      price: '₹950',
      unit: 'Quintal',
      grade: 'Grade A',
      location: 'Punjab',
      rating: '4.7',
      distance: 44,
      image: 'https://images.unsplash.com/photo-1518977676601-b53f02ac6d5d?q=80&w=400',
      groupBuy: true
    }
  ];

  let filteredResults = searchResults.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.farmer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Distance filter Within 50km
  if (distFilter) {
    filteredResults = filteredResults.filter(item => item.distance <= 50);
  }

  // Grade filter A/A++ only
  if (gradeFilter) {
    filteredResults = filteredResults.filter(item => item.grade.startsWith('Grade A'));
  }

  // Search Mode Filter
  if (searchMode === 'Spot') {
    filteredResults = filteredResults.filter(item => !item.groupBuy);
  } else if (searchMode === 'Coop') {
    filteredResults = filteredResults.filter(item => item.groupBuy);
  }

  // Region Location Filter
  if (regionFilter !== 'All') {
    filteredResults = filteredResults.filter(item => item.location === regionFilter);
  }

  // Minimum Rating Filter
  if (minRating > 0) {
    filteredResults = filteredResults.filter(item => parseFloat(item.rating) >= minRating);
  }

  // Price sorting
  if (priceSort === 'asc') {
    filteredResults = [...filteredResults].sort((a, b) => {
      const priceA = parseInt(a.price.replace(/[₹,]/g, ''));
      const priceB = parseInt(b.price.replace(/[₹,]/g, ''));
      return priceA - priceB;
    });
  } else if (priceSort === 'desc') {
    filteredResults = [...filteredResults].sort((a, b) => {
      const priceA = parseInt(a.price.replace(/[₹,]/g, ''));
      const priceB = parseInt(b.price.replace(/[₹,]/g, ''));
      return priceB - priceA;
    });
  }

  const togglePriceSort = () => {
    if (priceSort === null) setPriceSort('asc');
    else if (priceSort === 'asc') setPriceSort('desc');
    else setPriceSort(null);
  };

  const handleResetFilters = () => {
    setSearchMode('All');
    setRegionFilter('All');
    setMinRating(0);
    setDistFilter(false);
    setGradeFilter(false);
    setPriceSort(null);
    setShowFilterModal(false);
  };

  return (
    <SwipeableScreen currentTab="search" role="buyer">
      <View className="flex-1 bg-gray-50 dark:bg-zinc-950 pt-12">
        <StatusBar style={isDark ? "light" : "dark"} />
        
        {/* Search Header */}
        <View className="px-4 flex-row items-center py-2 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center mr-2">
            <ChevronLeft color={isDark ? "#ffffff" : "#0b1c30"} size={24} />
          </TouchableOpacity>
          
          <View className="flex-1 bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 h-11 rounded-full flex-row items-center px-4">
             <SearchIcon color={isDark ? "#a1a1aa" : "#64748b"} size={18} />
             <TextInput 
                placeholder="Search premium crops, cooperative pools..."
                placeholderTextColor={isDark ? "#71717a" : "#94a3b8"}
                className="flex-1 ml-2 text-gray-900 dark:text-zinc-100 font-semibold"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
             />
             <TouchableOpacity onPress={handleStartVoice} className="p-1">
                <Mic color="#10b981" size={18} />
             </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            onPress={() => setShowFilterModal(true)}
            className={`w-10 h-10 items-center justify-center ml-2 rounded-full border ${
              searchMode !== 'All' || regionFilter !== 'All' || minRating > 0
                ? 'bg-blue-500 border-blue-500' 
                : 'bg-gray-50 dark:bg-zinc-800/50 border-gray-200 dark:border-zinc-800'
            }`}
          >
             <SlidersHorizontal color={searchMode !== 'All' || regionFilter !== 'All' || minRating > 0 ? "#ffffff" : (isDark ? "#ffffff" : "#0f172a")} size={18} />
          </TouchableOpacity>
        </View>

        {/* Filter Chips */}
        <View className="py-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
             <TouchableOpacity 
               onPress={() => setDistFilter(!distFilter)}
               className={`border px-4 py-1.5 rounded-full mr-2 flex-row items-center ${
                 distFilter 
                   ? 'bg-[#10b981] border-[#10b981]' 
                   : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800'
               }`}
             >
                <MapPin color={distFilter ? "#ffffff" : (isDark ? "#ffffff" : "#0f172a")} size={14} />
                <Text className={`font-black ml-1 text-xs uppercase tracking-wider ${distFilter ? 'text-white' : 'text-gray-500 dark:text-zinc-400'}`}>
                  Within 50km {distFilter ? '✓' : ''}
                </Text>
             </TouchableOpacity>

             <TouchableOpacity 
               onPress={togglePriceSort}
               className={`border px-4 py-1.5 rounded-full mr-2 ${
                 priceSort !== null 
                   ? 'bg-blue-500 border-blue-500' 
                   : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800'
               }`}
             >
                <Text className={`font-black text-xs uppercase tracking-wider ${priceSort !== null ? 'text-white' : 'text-gray-500 dark:text-zinc-400'}`}>
                  Price: {priceSort === 'asc' ? 'Low to High ↑' : priceSort === 'desc' ? 'High to Low ↓' : 'Default ⇅'}
                </Text>
             </TouchableOpacity>

             <TouchableOpacity 
               onPress={() => setGradeFilter(!gradeFilter)}
               className={`border px-4 py-1.5 rounded-full mr-2 ${
                 gradeFilter 
                   ? 'bg-purple-500 border-purple-500' 
                   : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800'
               }`}
             >
                <Text className={`font-black text-xs uppercase tracking-wider ${gradeFilter ? 'text-white' : 'text-gray-500 dark:text-zinc-400'}`}>
                  Grade A Only {gradeFilter ? '✓' : ''}
                </Text>
             </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Results Body */}
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-4">
          <Text className="text-xs text-gray-400 dark:text-zinc-500 font-black tracking-widest mb-4">
            {filteredResults.length} COMMODITIES AVAILABLE NOW
          </Text>

          {filteredResults.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              onPress={() => {
                router.push({ 
                  pathname: '/(buyer)/place-bid', 
                  params: { id: item.id, isGroupBuy: item.groupBuy ? 'true' : 'false' } 
                });
              }}
              className={`bg-white dark:bg-zinc-900 rounded-[24px] mb-5 border overflow-hidden shadow-sm flex-row ${
                item.groupBuy ? 'border-emerald-500/35 dark:border-emerald-500/20' : 'border-gray-150 dark:border-zinc-800'
              }`}
            >
              <View className="w-32 h-32 bg-gray-100 dark:bg-zinc-850 relative">
                 <Image source={{ uri: item.image }} className="w-full h-full" resizeMode="cover" />
                 {item.groupBuy && (
                   <View className="absolute top-2 left-2 bg-[#059669] px-2 py-0.5 rounded-lg shadow-sm">
                      <Text className="text-white text-[8px] font-black uppercase tracking-wider">👥 Pool</Text>
                   </View>
                 )}
              </View>
              
              <View className="flex-1 p-4 justify-between">
                 <View>
                    <View className="flex-row justify-between items-start">
                       <Text className="text-base font-black text-gray-900 dark:text-zinc-100 flex-1 mr-2" numberOfLines={1}>{item.title}</Text>
                       <View className="flex-row items-center">
                          <Star color="#f59e0b" fill="#f59e0b" size={10} />
                          <Text className="text-xs font-black ml-1 text-gray-900 dark:text-zinc-100">{item.rating}</Text>
                       </View>
                    </View>
                    <Text className="text-xs text-gray-500 dark:text-zinc-400 mt-1 font-bold">by {item.farmer}</Text>
                    <View className="flex-row items-center mt-1">
                       <MapPin color={isDark ? "#a1a1aa" : "#64748b"} size={10} />
                       <Text className="text-xs text-gray-500 dark:text-zinc-400 ml-1 font-bold">{item.location} ({item.distance}km)</Text>
                    </View>
                 </View>

                  <View className="flex-row items-center justify-between mt-2">
                     <Text className="text-[#0f172a] dark:text-zinc-100 font-black text-xl">{item.price}<Text className="text-xs text-gray-400 font-bold">/{item.unit}</Text></Text>
                     <View className="flex-row items-center">
                        <View className="bg-green-100 dark:bg-green-950 px-2 py-0.5 rounded">
                           <Text className="text-green-700 dark:text-green-400 text-[9px] font-black uppercase tracking-widest">{item.grade}</Text>
                        </View>
                     </View>
                  </View>
              </View>
            </TouchableOpacity>
          ))}

          <View className="h-32" />
        </ScrollView>

        {/* Real-working Advanced Filter bottom sheet Modal */}
        <Modal
          visible={showFilterModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowFilterModal(false)}
        >
          <View className="flex-1 bg-black/60 justify-end">
            <View className="bg-white dark:bg-zinc-900 rounded-t-[40px] p-6 border-t border-gray-200 dark:border-zinc-800">
               {/* Modal Header */}
               <View className="flex-row justify-between items-center mb-6">
                  <View className="flex-row items-center">
                    <SlidersHorizontal color="#2563eb" size={20} />
                    <Text className="text-xl font-black text-gray-900 dark:text-zinc-100 ml-2">Market Filter Settings</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => setShowFilterModal(false)}
                    className="w-8 h-8 bg-gray-150 dark:bg-zinc-800 rounded-full items-center justify-center"
                  >
                     <X color={isDark ? "#ffffff" : "#111827"} size={16} />
                  </TouchableOpacity>
               </View>

               {/* Sourcing Channel Toggle */}
               <View className="mb-6">
                  <Text className="text-[10px] text-gray-500 dark:text-zinc-400 font-black uppercase tracking-wider mb-2.5">Sourcing Pipeline</Text>
                  <View className="flex-row gap-2 bg-gray-50 dark:bg-zinc-800/40 p-1 rounded-2xl border border-gray-150 dark:border-zinc-800">
                     {['All', 'Spot', 'Coop'].map(mode => (
                       <TouchableOpacity
                         key={mode}
                         onPress={() => setSearchMode(mode)}
                         className={`flex-1 py-3.5 rounded-xl items-center ${
                           searchMode === mode 
                             ? 'bg-blue-500 shadow-sm' 
                             : ''
                         }`}
                       >
                          <Text className={`text-xs font-black uppercase tracking-wider ${searchMode === mode ? 'text-white' : 'text-gray-500'}`}>
                            {mode === 'All' ? 'Show All' : mode === 'Spot' ? 'Spot Sell' : 'Co-Op Pool'}
                          </Text>
                       </TouchableOpacity>
                     ))}
                  </View>
               </View>

               {/* Crop Region Location Selection */}
               <View className="mb-6">
                  <Text className="text-[10px] text-gray-500 dark:text-zinc-400 font-black uppercase tracking-wider mb-2.5">Produce Region Origin</Text>
                  <View className="flex-row flex-wrap gap-2">
                     {['All', 'Punjab', 'Maharashtra', 'Haryana'].map(loc => (
                       <TouchableOpacity
                         key={loc}
                         onPress={() => setRegionFilter(loc)}
                         className={`px-4 py-2.5 rounded-xl border ${
                           regionFilter === loc 
                             ? 'bg-[#10b981]/15 border-[#10b981] dark:border-emerald-500 bg-emerald-500/10' 
                             : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700'
                         }`}
                       >
                          <Text className={`text-xs font-black uppercase tracking-wider ${
                            regionFilter === loc 
                              ? 'text-green-700 dark:text-green-400' 
                              : 'text-gray-500'
                          }`}>{loc}</Text>
                       </TouchableOpacity>
                     ))}
                  </View>
               </View>

               {/* Farmer Quality Rating Filter */}
               <View className="mb-8">
                  <Text className="text-[10px] text-gray-500 dark:text-zinc-400 font-black uppercase tracking-wider mb-2.5">Minimum Farmer Rating</Text>
                  <View className="flex-row gap-2">
                     {[{ label: 'Any Rating', value: 0 }, { label: '4.6+ Stars', value: 4.6 }, { label: '4.8+ Stars', value: 4.8 }].map(r => (
                       <TouchableOpacity
                         key={r.value}
                         onPress={() => setMinRating(r.value)}
                         className={`flex-1 py-3.5 rounded-xl border items-center flex-row justify-center ${
                           minRating === r.value 
                             ? 'bg-purple-500/10 border-purple-500' 
                             : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700'
                         }`}
                       >
                          <Star color={minRating === r.value ? "#a855f7" : "#94a3b8"} fill={minRating === r.value ? "#a855f7" : "transparent"} size={12} />
                          <Text className={`text-xs font-black ml-1.5 uppercase tracking-wider ${minRating === r.value ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500'}`}>{r.label}</Text>
                       </TouchableOpacity>
                     ))}
                  </View>
               </View>

               {/* Action Buttons */}
               <View className="flex-row gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800 mb-6">
                  <TouchableOpacity
                    onPress={handleResetFilters}
                    className="flex-1 bg-gray-100 dark:bg-zinc-800 h-14 rounded-2xl items-center justify-center"
                  >
                     <Text className="text-gray-900 dark:text-zinc-100 font-black text-xs uppercase tracking-wider">Reset All</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setShowFilterModal(false)}
                    className="flex-1 bg-[#0f172a] h-14 rounded-2xl items-center justify-center shadow-md shadow-gray-500/10"
                  >
                     <Text className="text-white font-black text-xs uppercase tracking-wider">Apply Filters</Text>
                  </TouchableOpacity>
               </View>
            </View>
          </View>
        </Modal>

        {/* Real-working voice recognition soundwave animation modal */}
        <Modal
          visible={isListening}
          transparent={true}
          animationType="fade"
        >
          <View className="flex-1 bg-black/85 backdrop-blur-md justify-center items-center px-8">
             <View className="w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-[36px] p-8 items-center shadow-2xl">
                <Text className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">SmartKissan Voice AI</Text>
                
                {/* Glowing mic icon */}
                <View className="w-20 h-20 bg-emerald-500/10 border-4 border-emerald-500/20 rounded-full items-center justify-center mb-6 shadow-inner animate-pulse">
                   <Mic color="#10b981" size={32} />
                </View>

                {/* Simulated speech-to-text text */}
                <Text className="text-gray-800 dark:text-zinc-100 text-lg font-black text-center mb-8 h-12 leading-6 px-4">
                   {voiceText}
                </Text>

                {/* Oscillating wave heights visual animation */}
                <View className="flex-row h-16 items-center justify-center gap-2 mb-10 w-full px-6">
                   {waveHeights.map((h, i) => (
                      <View 
                        key={i} 
                        style={{ height: h }} 
                        className="w-2 rounded-full bg-[#10b981] shadow-sm shadow-emerald-500/20" 
                      />
                   ))}
                </View>

                {/* Close voice search button */}
                <TouchableOpacity
                  onPress={() => setIsListening(false)}
                  className="bg-gray-100 dark:bg-zinc-800 px-8 py-3 rounded-full flex-row items-center border border-gray-200 dark:border-zinc-700"
                >
                   <X color={isDark ? "#ffffff" : "#111827"} size={14} />
                   <Text className="text-gray-900 dark:text-zinc-100 font-black text-xs uppercase tracking-widest ml-2">Cancel Voice</Text>
                </TouchableOpacity>
             </View>
          </View>
        </Modal>
      </View>
    </SwipeableScreen>
  );
};

export default SearchScreen;
