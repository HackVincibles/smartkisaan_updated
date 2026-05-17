import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { 
  ChevronLeft, 
  Plus, 
  Truck, 
  Settings, 
  Activity, 
  Fuel, 
  Calendar,
  AlertTriangle,
  X,
  PlusCircle,
  Wrench,
  Check
} from 'lucide-react-native';

const FleetManagement = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [vehicles, setVehicles] = useState([
    {
      id: 'V-8821',
      model: 'Tata Prima 4025.S',
      type: 'Heavy Duty Truck',
      capacity: '25 Ton',
      status: 'On Route',
      fuel: '65%',
      lastService: '12 Oct 2025',
      image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=400'
    },
    {
      id: 'V-1044',
      model: 'Ashok Leyland 2820',
      type: 'Medium Truck',
      capacity: '15 Ton',
      status: 'Idle',
      fuel: '42%',
      lastService: '05 Nov 2025',
      image: 'https://images.unsplash.com/photo-1586191582056-94033be47551?q=80&w=400'
    }
  ]);

  // Form states for adding new vehicle
  const [showAddModal, setShowAddModal] = useState(false);
  const [newModel, setNewModel] = useState('');
  const [newCapacity, setNewCapacity] = useState('');
  const [newType, setNewType] = useState('Heavy Duty Truck');

  // Details/Settings modal states
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const handleAddVehicle = () => {
    if (!newModel.trim() || !newCapacity.trim()) {
      Alert.alert("Missing Fields", "Please enter model and capacity parameters.");
      return;
    }
    const newId = `V-${Math.floor(1000 + Math.random() * 9000)}`;
    const newVehicle = {
      id: newId,
      model: newModel,
      type: newType,
      capacity: newCapacity.includes('Ton') ? newCapacity : `${newCapacity} Ton`,
      status: 'Idle',
      fuel: '100%',
      lastService: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=400'
    };

    setVehicles([newVehicle, ...vehicles]);
    setNewModel('');
    setNewCapacity('');
    setShowAddModal(false);
    
    Alert.alert("Success", `Vehicle ${newId} (${newModel}) has been successfully integrated into your active fleet.`);
  };

  const handleToggleStatus = () => {
    if (!selectedVehicle) return;
    const updated = vehicles.map(v => {
      if (v.id === selectedVehicle.id) {
        const nextStatus = v.status === 'Idle' ? 'On Route' : 'Idle';
        setSelectedVehicle({ ...v, status: nextStatus });
        return { ...v, status: nextStatus };
      }
      return v;
    });
    setVehicles(updated);
  };

  const handleScheduleService = () => {
    if (!selectedVehicle) return;
    Alert.alert("Service Scheduled", `Routine maintenance and fitness certification scheduled for ${selectedVehicle.model} (${selectedVehicle.id}).`);
    setShowSettingsModal(false);
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View className="pt-14 pb-6 px-6 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <ChevronLeft color={isDark ? "#ffffff" : "#0f172a"} size={24} />
          </TouchableOpacity>
          <Text className="text-2xl font-black text-gray-900 dark:text-zinc-100">My Fleet</Text>
        </View>
        <TouchableOpacity 
          onPress={() => setShowAddModal(true)}
          className="w-10 h-10 bg-[#10b981] rounded-full items-center justify-center shadow-lg shadow-emerald-500/10"
        >
          <Plus color="#ffffff" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        {/* Fleet Summary Card */}
        <View className="flex-row gap-4 mb-8">
           <View className="flex-1 bg-blue-50 dark:bg-blue-900/20 p-5 rounded-3xl border border-blue-100 dark:border-blue-900/30">
              <Text className="text-blue-600 dark:text-blue-400 font-black text-3xl">
                {String(vehicles.length).padStart(2, '0')}
              </Text>
              <Text className="text-blue-800/60 dark:text-blue-400/60 text-[9px] font-black uppercase tracking-widest mt-1">Total Vehicles</Text>
           </View>
           <View className="flex-1 bg-green-50 dark:bg-green-900/20 p-5 rounded-3xl border border-green-100 dark:border-green-900/30">
              <Text className="text-green-600 dark:text-green-400 font-black text-3xl">
                {String(vehicles.filter(v => v.status === 'On Route').length).padStart(2, '0')}
              </Text>
              <Text className="text-green-800/60 dark:text-green-400/60 text-[9px] font-black uppercase tracking-widest mt-1">Active Now</Text>
           </View>
        </View>

        <Text className="text-xs font-black text-gray-400 dark:text-zinc-500 uppercase tracking-[2px] mb-4 ml-1">
          Active Fleet Inventory
        </Text>

        {vehicles.map((v) => (
          <TouchableOpacity 
            key={v.id}
            onPress={() => {
              setSelectedVehicle(v);
              setShowSettingsModal(true);
            }}
            className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-5 mb-6 shadow-sm overflow-hidden relative"
          >
            <View className="flex-row justify-between items-start mb-4">
               <View>
                  <Text className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">{v.id}</Text>
                  <Text className="text-xl font-black text-gray-900 dark:text-zinc-100 mt-1">{v.model}</Text>
                  <Text className="text-xs font-bold text-gray-500 dark:text-zinc-400">{v.type}</Text>
               </View>
               <View className={`px-3 py-1 rounded-full ${v.status === 'On Route' ? 'bg-green-100 dark:bg-green-900/40' : 'bg-amber-100 dark:bg-amber-900/40'}`}>
                  <Text className={`text-[10px] font-black uppercase ${v.status === 'On Route' ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'}`}>{v.status}</Text>
               </View>
            </View>

            <View className="flex-row justify-between border-t border-gray-50 dark:border-zinc-800 pt-4 mt-2 mr-10">
               <View className="flex-row items-center">
                  <Activity color="#64748b" size={14} />
                  <Text className="text-xs font-bold text-gray-600 dark:text-zinc-400 ml-1.5">{v.capacity}</Text>
               </View>
               <View className="flex-row items-center">
                  <Fuel color="#64748b" size={14} />
                  <Text className="text-xs font-bold text-gray-600 dark:text-zinc-400 ml-1.5">{v.fuel}</Text>
               </View>
               <View className="flex-row items-center">
                  <Calendar color="#64748b" size={14} />
                  <Text className="text-xs font-bold text-gray-600 dark:text-zinc-400 ml-1.5">Svc: {v.lastService.split(' ')[1] || 'Oct'} 25</Text>
               </View>
            </View>

            <TouchableOpacity 
              onPress={() => {
                setSelectedVehicle(v);
                setShowSettingsModal(true);
              }}
              className="absolute bottom-5 right-5 w-10 h-10 bg-gray-50 dark:bg-zinc-800 rounded-full items-center justify-center border border-gray-100 dark:border-zinc-700 shadow-sm"
            >
               <Settings color={isDark ? "#a1a1aa" : "#64748b"} size={18} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        <View className="bg-amber-50 dark:bg-amber-900/20 p-5 rounded-3xl border border-amber-100 dark:border-amber-900/30 flex-row items-center">
           <View className="w-12 h-12 bg-amber-100 dark:bg-amber-800/40 rounded-2xl items-center justify-center mr-4">
              <AlertTriangle color="#d97706" size={24} />
           </View>
           <View className="flex-1">
              <Text className="text-amber-900 dark:text-amber-200 font-black text-sm">Service Warning</Text>
              <Text className="text-amber-800/60 dark:text-amber-200/60 text-xs font-semibold leading-4">Vehicle V-1044 is due for service in 3 days.</Text>
           </View>
        </View>

        {/* Responsive padding to prevent clipping behind absolute control panel */}
        <View className="h-32" />
      </ScrollView>

      {/* Add Vehicle Interactive Modal Overlay */}
      {showAddModal && (
        <View className="absolute inset-0 bg-black/75 backdrop-blur-sm items-center justify-center z-50 px-6">
          <View className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[32px] p-6 w-full shadow-2xl relative">
            <TouchableOpacity 
              onPress={() => setShowAddModal(false)}
              className="absolute right-5 top-5 w-8 h-8 bg-gray-100 dark:bg-zinc-800 rounded-full items-center justify-center"
            >
              <X color={isDark ? "#fff" : "#000"} size={16} />
            </TouchableOpacity>

            <Text className="text-gray-900 dark:text-zinc-100 text-xl font-black mb-1">Add Active Vehicle</Text>
            <Text className="text-gray-400 text-xs font-semibold mb-6">Expand your active transporter fleet parameters</Text>

            <View className="gap-4">
              <View>
                <Text className="text-gray-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-wider mb-2 ml-1">Vehicle Model</Text>
                <TextInput 
                  value={newModel}
                  onChangeText={setNewModel}
                  placeholder="e.g. Tata Prima 4025.S"
                  placeholderTextColor={isDark ? "#71717a" : "#9ca3af"}
                  className="bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 h-14 rounded-2xl px-4 text-gray-900 dark:text-zinc-100 font-bold"
                />
              </View>

              <View>
                <Text className="text-gray-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-wider mb-2 ml-1">Capacity (Tons)</Text>
                <TextInput 
                  value={newCapacity}
                  onChangeText={setNewCapacity}
                  placeholder="e.g. 25"
                  keyboardType="numeric"
                  placeholderTextColor={isDark ? "#71717a" : "#9ca3af"}
                  className="bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 h-14 rounded-2xl px-4 text-gray-900 dark:text-zinc-100 font-bold"
                />
              </View>

              <View>
                <Text className="text-gray-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-wider mb-2 ml-1">Vehicle Type</Text>
                <View className="flex-row gap-2">
                  {['Heavy Duty Truck', 'Medium Truck'].map(t => {
                    const active = newType === t;
                    return (
                      <TouchableOpacity 
                        key={t}
                        onPress={() => setNewType(t)}
                        className={`flex-1 py-3 border rounded-xl items-center ${
                          active ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500' : 'border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/20'
                        }`}
                      >
                        <Text className={`text-xs font-black ${active ? 'text-emerald-500' : 'text-gray-500 dark:text-zinc-400'}`}>{t}</Text>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </View>

              <TouchableOpacity 
                onPress={handleAddVehicle}
                className="bg-[#10b981] h-14 rounded-2xl items-center justify-center flex-row shadow-lg shadow-emerald-500/10 mt-4"
              >
                <PlusCircle color="#ffffff" size={18} />
                <Text className="text-white font-black text-sm ml-2">Integrate Vehicle</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Vehicle Settings / Configuration Modal Overlay */}
      {showSettingsModal && selectedVehicle && (
        <View className="absolute inset-0 bg-black/75 backdrop-blur-sm items-center justify-center z-50 px-6">
          <View className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[32px] p-6 w-full shadow-2xl relative">
            <TouchableOpacity 
              onPress={() => setShowSettingsModal(false)}
              className="absolute right-5 top-5 w-8 h-8 bg-gray-100 dark:bg-zinc-800 rounded-full items-center justify-center"
            >
              <X color={isDark ? "#fff" : "#000"} size={16} />
            </TouchableOpacity>

            <Text className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{selectedVehicle.id}</Text>
            <Text className="text-gray-900 dark:text-zinc-100 text-2xl font-black mt-1 mb-6">{selectedVehicle.model}</Text>

            <View className="gap-4">
              <View className="flex-row justify-between bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-2xl p-4 items-center">
                <View>
                  <Text className="text-gray-900 dark:text-zinc-100 font-black text-sm">Operational Status</Text>
                  <Text className="text-gray-400 text-[10px] font-bold mt-0.5">Toggle vehicle routing permissions</Text>
                </View>
                <TouchableOpacity 
                  onPress={handleToggleStatus}
                  className={`px-4 py-2 rounded-xl border ${
                    selectedVehicle.status === 'On Route' ? 'bg-green-50 border-green-500' : 'bg-gray-100 border-zinc-700'
                  }`}
                >
                  <Text className={`text-xs font-black uppercase ${selectedVehicle.status === 'On Route' ? 'text-green-600' : 'text-gray-500'}`}>
                    {selectedVehicle.status === 'On Route' ? 'On Route' : 'Idle'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-2xl p-4 flex-row justify-between">
                <View className="items-center flex-1 border-r border-gray-100 dark:border-zinc-800 py-1">
                  <Activity color="#2563eb" size={20} />
                  <Text className="text-gray-900 dark:text-zinc-100 font-black text-sm mt-2">{selectedVehicle.capacity}</Text>
                  <Text className="text-gray-400 text-[9px] font-bold mt-0.5">Capacity</Text>
                </View>
                <View className="items-center flex-1 border-r border-gray-100 dark:border-zinc-800 py-1">
                  <Fuel color="#eab308" size={20} />
                  <Text className="text-gray-900 dark:text-zinc-100 font-black text-sm mt-2">{selectedVehicle.fuel}</Text>
                  <Text className="text-gray-400 text-[9px] font-bold mt-0.5">Fuel Level</Text>
                </View>
                <View className="items-center flex-1 py-1">
                  <Calendar color="#8b5cf6" size={20} />
                  <Text className="text-gray-900 dark:text-zinc-100 font-black text-sm mt-2">Oct 25</Text>
                  <Text className="text-gray-400 text-[9px] font-bold mt-0.5">Last Service</Text>
                </View>
              </View>

              <View className="flex-row gap-3 mt-4">
                <TouchableOpacity 
                  onPress={handleScheduleService}
                  className="flex-1 bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 h-14 rounded-2xl items-center justify-center flex-row"
                >
                  <Wrench color={isDark ? "#ffffff" : "#0f172a"} size={16} />
                  <Text className="text-gray-900 dark:text-zinc-100 font-black text-xs ml-2">Schedule Service</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => setShowSettingsModal(false)}
                  className="flex-1 bg-emerald-500 h-14 rounded-2xl items-center justify-center flex-row shadow-lg shadow-emerald-500/10"
                >
                  <Check color="#ffffff" size={16} />
                  <Text className="text-white font-black text-xs ml-2">Save Settings</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default FleetManagement;
