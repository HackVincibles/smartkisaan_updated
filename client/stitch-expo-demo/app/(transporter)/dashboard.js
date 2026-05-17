import React, { useState, useEffect, useRef } from 'react';
import { useColorScheme } from 'nativewind';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Image, Alert, Animated, Easing, Dimensions, Switch } from 'react-native';
import { 
  Truck, 
  MapPin, 
  Navigation, 
  Clock, 
  ShieldCheck, 
  ChevronRight,
  TrendingUp,
  Package,
  QrCode,
  X,
  CheckCircle2,
  AlertCircle,
  Camera
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { SwipeableScreen } from '../../components/SwipeableScreen';

const { width } = Dimensions.get('window');
const SCAN_BOX = width * 0.65;

const TransporterDashboard = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const params = useLocalSearchParams();
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Active shipments state to support real-time status transitions!
  const [activeShipments, setActiveShipments] = useState([
    {
      id: 'S-9042',
      orderId: 'ORD-2026-9042',
      commodity: 'Wheat (Grade A)',
      qty: '500 kg',
      status: 'In Transit',
      eta: '45 mins',
      from: 'Nashik, Maharashtra',
      to: 'Mumbai Port, MH',
      progress: 65,
    }
  ]);

  // QR Simulator modal states
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState(false);
  const [scanningStatus, setScanningStatus] = useState('Position QR within the viewport');
  
  const scanLineY = useRef(new Animated.Value(0)).current;

  // Automatically trigger scanner if routed from TripNavigation with autoOpenScanner
  useEffect(() => {
    if (params.autoOpenScanner === 'true') {
      setShowScanner(true);
    }
  }, [params.autoOpenScanner]);

  // Listen to new accepted loads from shipments list
  useEffect(() => {
    if (params.newLoadId) {
      const loadIdStr = params.newLoadId.toString();
      const existingId = `S-90${loadIdStr}`;
      if (!activeShipments.some(s => s.id === existingId)) {
        const matchingLoad = {
          id: existingId,
          orderId: `ORD-2026-90${loadIdStr}`,
          commodity: loadIdStr === '1' ? 'Wheat (Grade A)' : loadIdStr === '2' ? 'Red Onions' : 'Premium Rice',
          qty: loadIdStr === '1' ? '12 Tons' : loadIdStr === '2' ? '8 Tons' : '20 Tons',
          status: 'Active',
          eta: loadIdStr === '1' ? 'Starts Tomorrow' : loadIdStr === '2' ? 'In 2 days' : 'Scheduled',
          from: loadIdStr === '1' ? 'Nashik, Maharashtra' : loadIdStr === '2' ? 'Pune, Maharashtra' : 'Surat, Gujarat',
          to: loadIdStr === '1' ? 'Mumbai Port, MH' : loadIdStr === '2' ? 'Vashi Market, MH' : 'JNPT Port, MH',
          progress: 0,
        };
        setActiveShipments(prev => [matchingLoad, ...prev]);
      }
    }
  }, [params.newLoadId]);

  // Scanner Scanline Animation Loop
  useEffect(() => {
    let anim;
    if (showScanner && !scanResult) {
      scanLineY.setValue(0);
      anim = Animated.loop(
        Animated.timing(scanLineY, {
          toValue: SCAN_BOX,
          duration: 2200,
          easing: Easing.linear,
          useNativeDriver: true
        })
      );
      anim.start();
    }
    return () => {
      if (anim) anim.stop();
    };
  }, [showScanner, scanResult]);

  const handleSimulateScan = () => {
    setScanningStatus('Reading secure payload...');
    
    setTimeout(() => {
      setScanningStatus('Authenticating on Polygon Amoy network...');
    }, 1000);

    setTimeout(() => {
      setScanResult(true);
      setScanningStatus('Success! On-chain receipt generated.');
      
      // Update active shipment status to Delivered!
      const updated = activeShipments.map(s => {
        if (s.id === 'S-9042') {
          return {
            ...s,
            status: 'Delivered',
            eta: 'Arrived',
            progress: 100
          };
        }
        return s;
      });
      setActiveShipments(updated);
    }, 2200);
  };

  const handleCloseScanner = () => {
    setShowScanner(false);
    setScanResult(false);
    setScanningStatus('Position QR within the viewport');
  };

  return (
    <SwipeableScreen currentTab="dashboard" role="transporter">
      <View className="flex-1 bg-gray-50 dark:bg-zinc-950 pt-12">
        <StatusBar style={isDark ? "light" : "dark"} />
        
        {/* Header - Capsular Shape */}
        <View className="px-6 py-6 bg-white dark:bg-zinc-900 mx-2 mt-2 rounded-[40px] shadow-sm flex-row justify-between items-center border border-gray-100 dark:border-zinc-800">
          <View>
            <Text className="text-[10px] text-gray-500 dark:text-zinc-400 font-black uppercase tracking-widest">Logistics Partner</Text>
            <Text className="text-2xl text-gray-900 dark:text-zinc-100 font-black">Speedy Logistics</Text>
          </View>
          <TouchableOpacity 
            onPress={() => router.push('/(transporter)/navigation')}
            className="w-12 h-12 bg-gray-100 dark:bg-zinc-850 rounded-full items-center justify-center border border-gray-200 dark:border-zinc-700 shadow-sm"
          >
            <Navigation color={isDark ? "#ffffff" : "#1e293b"} size={22} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          
          {/* Earnings Stats */}
          <TouchableOpacity 
            onPress={() => router.push('/(shared)/wallet')}
            className="mx-4 mt-6 bg-[#1e293b] rounded-3xl p-6 flex-row justify-between items-center shadow-xl"
          >
             <View>
                <Text className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-2">Today's Earnings</Text>
                <Text className="text-white text-3xl font-black">₹12,450</Text>
                <View className="flex-row items-center mt-3">
                   <TrendingUp color="#4ade80" size={16} />
                   <Text className="text-[#4ade80] text-[10px] font-black ml-1 uppercase tracking-wider">+15% Growth</Text>
                </View>
             </View>
             <View className="h-16 w-[1px] bg-white/10" />
             <View className="items-end">
                <Text className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-2">Distance</Text>
                <Text className="text-white text-3xl font-black">480 <Text className="text-white/50 text-xs">km</Text></Text>
                <Text className="text-white/50 text-[10px] font-bold mt-2">Fuel: 42L used</Text>
             </View>
          </TouchableOpacity>

          {/* Action Buttons */}
          <View className="flex-row px-4 mt-8 gap-3">
             <TouchableOpacity 
              onPress={() => router.push('/(transporter)/shipments')}
              className="flex-1 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-3xl items-center shadow-sm"
             >
                <View className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-2xl items-center justify-center mb-3">
                   <Package color="#2563eb" size={24} />
                </View>
                <Text className="text-gray-900 dark:text-zinc-100 font-black text-xs">Find Loads</Text>
             </TouchableOpacity>

             <TouchableOpacity 
               onPress={() => router.push('/(transporter)/optimizer')}
               className="flex-1 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-3xl items-center shadow-sm"
             >
                <View className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl items-center justify-center mb-3">
                   <MapPin color="#10b981" size={24} />
                </View>
                <Text className="text-gray-900 dark:text-zinc-100 font-black text-xs">Optimizer</Text>
             </TouchableOpacity>

             <TouchableOpacity 
               onPress={() => router.push('/(transporter)/fleet')}
               className="flex-1 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-5 rounded-3xl items-center shadow-sm"
             >
                <View className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 rounded-2xl items-center justify-center mb-3">
                   <Truck color="#d97706" size={24} />
                </View>
                <Text className="text-gray-900 dark:text-zinc-100 font-black text-xs">My Fleet</Text>
             </TouchableOpacity>
          </View>

          {/* Live GPS Toggle */}
          <View className="mx-4 mt-6 bg-blue-50 dark:bg-blue-900/20 p-5 rounded-3xl border border-blue-200 dark:border-blue-800 flex-row items-center justify-between">
             <View className="flex-1 mr-4">
                <Text className="text-blue-900 dark:text-blue-100 font-black text-sm">Broadcast Live Location</Text>
                <Text className="text-blue-700 dark:text-blue-400 font-medium text-xs mt-1 leading-4">Share GPS coordinates with buyer for active shipments.</Text>
             </View>
             <Switch 
                value={isBroadcasting} 
                onValueChange={(val) => {
                  setIsBroadcasting(val);
                  if(val) Alert.alert('Location Shared', 'Buyers can now track your live location.');
                }} 
                trackColor={{ false: '#94a3b8', true: '#3b82f6' }}
                thumbColor="#ffffff"
             />
          </View>

          {/* Active Shipment Section */}
          <View className="px-5 mt-8 flex-row justify-between items-center mb-4">
             <Text className="text-2xl text-gray-900 dark:text-zinc-100 font-black tracking-tight">Active Shipment</Text>
             <TouchableOpacity onPress={() => router.push('/(transporter)/navigation')}>
                <Text className="text-[#10b981] font-black text-sm">View Map</Text>
             </TouchableOpacity>
          </View>

          {activeShipments.map((ship) => (
            <View 
              key={ship.id} 
              className="mx-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-[36px] p-6 shadow-sm mb-6 relative overflow-hidden"
            >
               <View className="flex-row justify-between items-start mb-6">
                  <View>
                     <View className="flex-row items-center mb-1">
                        <Text className="text-[10px] text-gray-400 dark:text-zinc-500 font-black uppercase tracking-widest mr-3">{ship.orderId}</Text>
                        <View className={`px-2 py-0.5 rounded-lg ${ship.status === 'Delivered' ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-blue-100 dark:bg-blue-900/40'}`}>
                           <Text className={`text-[8px] font-black uppercase tracking-wider ${ship.status === 'Delivered' ? 'text-emerald-700 dark:text-emerald-400' : 'text-blue-700 dark:text-blue-400'}`}>{ship.status}</Text>
                        </View>
                     </View>
                     <Text className="text-2xl font-black text-gray-900 dark:text-zinc-100 mt-1">{ship.commodity}</Text>
                     <Text className="text-xs font-bold text-gray-400 mt-0.5">{ship.qty}</Text>
                  </View>
                  <View className="items-end">
                     <Text className="text-[10px] text-gray-400 dark:text-zinc-500 font-black uppercase tracking-widest">ETA</Text>
                     <Text className={`text-2xl font-black ${ship.status === 'Delivered' ? 'text-[#10b981]' : 'text-blue-500'}`}>{ship.eta}</Text>
                  </View>
               </View>

               <View className="bg-gray-50 dark:bg-zinc-800/40 p-4 rounded-2xl mb-6 border border-gray-100/50 dark:border-zinc-800">
                  <View className="flex-row items-center">
                     <View className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-3" />
                     <Text className="text-sm text-gray-900 dark:text-zinc-100 font-black" numberOfLines={1}>{ship.from}</Text>
                  </View>
                  <View className="w-[1px] h-5 bg-gray-200 dark:bg-zinc-700 ml-[4.5px] my-1" />
                  <View className="flex-row items-center">
                     <View className="w-2.5 h-2.5 rounded-full bg-red-500 mr-3" />
                     <Text className="text-sm text-gray-900 dark:text-zinc-100 font-black" numberOfLines={1}>{ship.to}</Text>
                  </View>
               </View>

               {/* Progress Bar */}
               <View>
                  <View className="flex-row justify-between mb-2 px-1">
                     <Text className="text-[10px] text-gray-400 dark:text-zinc-500 font-black uppercase tracking-widest">Transit Progress</Text>
                     <Text className="text-[10px] text-gray-900 dark:text-zinc-100 font-black">{ship.progress}%</Text>
                  </View>
                  <View className="h-2.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                     <View className={`h-full ${ship.status === 'Delivered' ? 'bg-[#10b981]' : 'bg-blue-500'}`} style={{ width: `${ship.progress}%` }} />
                  </View>
               </View>

               {/* Action Buttons */}
               <View className="flex-row mt-6 gap-3">
                  <TouchableOpacity 
                    onPress={() => router.push('/(transporter)/navigation')}
                    className="flex-1 bg-gray-50 dark:bg-zinc-800 py-3.5 rounded-2xl items-center justify-center flex-row border border-gray-100 dark:border-zinc-700"
                  >
                     <Navigation color={isDark ? "#ffffff" : "#1e293b"} size={16} />
                     <Text className="text-gray-900 dark:text-zinc-100 font-black ml-2 text-xs">View Map</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => setShowScanner(true)}
                    className={`flex-1 py-3.5 rounded-2xl items-center justify-center flex-row shadow-sm ${
                      ship.status === 'Delivered' ? 'bg-zinc-300 dark:bg-zinc-800' : 'bg-[#10b981] shadow-emerald-500/10'
                    }`}
                    disabled={ship.status === 'Delivered'}
                  >
                     <QrCode color={ship.status === 'Delivered' ? '#666' : '#ffffff'} size={16} />
                     <Text className={`font-black ml-2 text-xs ${ship.status === 'Delivered' ? 'text-gray-500 dark:text-zinc-400' : 'text-white'}`}>
                       {ship.status === 'Delivered' ? 'Verified' : 'Verify QR'}
                     </Text>
                  </TouchableOpacity>
               </View>
            </View>
          ))}

          {/* Responsive bottom padding to prevent items from being clipped under absolute floating tab bar */}
          <View className="h-32" />
        </ScrollView>
      </View>

      {/* Premium Custom QR Scanner Simulator Modal Overlay */}
      {showScanner && (
        <View className="absolute inset-0 bg-black/85 backdrop-blur-md items-center justify-center z-50 px-6">
          <View className="bg-zinc-900 border border-zinc-800 rounded-[36px] p-6 w-full shadow-2xl relative overflow-hidden">
            <TouchableOpacity 
              onPress={handleCloseScanner}
              className="absolute right-5 top-5 w-8 h-8 bg-zinc-800 rounded-full items-center justify-center z-20"
            >
              <X color="#fff" size={16} />
            </TouchableOpacity>

            <Text className="text-white text-xl font-black mb-1">Secure Delivery Verification</Text>
            <Text className="text-zinc-500 text-xs font-semibold mb-6">Verify cargo delivery and trigger escrow settlement</Text>

            {/* Neon Camera Viewport Simulation */}
            <View className="w-full aspect-square bg-black border border-zinc-800 rounded-3xl overflow-hidden relative items-center justify-center mb-6">
              
              {/* Scan box viewport */}
              <View className="w-[65%] aspect-square border border-[#10b981]/30 rounded-2xl relative overflow-hidden">
                {/* Corner brackets */}
                <View className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#10b981]" />
                <View className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#10b981]" />
                <View className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#10b981]" />
                <View className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#10b981]" />
                
                {/* Simulated QR graphic background */}
                {!scanResult && (
                  <View className="absolute inset-4 opacity-40 items-center justify-center">
                    <QrCode color="#fff" size={120} strokeWidth={1} />
                  </View>
                )}

                {/* Animated green scanline */}
                {showScanner && !scanResult && (
                  <Animated.View 
                    style={{
                      transform: [{ translateY: scanLineY }],
                      height: 2,
                      backgroundColor: '#10b981',
                      width: '100%',
                      boxShadow: '0 0 10px #10b981',
                      position: 'absolute'
                    }}
                  />
                )}
                
                {/* Visual success representation */}
                {scanResult && (
                  <View className="absolute inset-0 bg-[#10b981]/10 items-center justify-center">
                    <CheckCircle2 color="#10b981" size={54} strokeWidth={3} />
                  </View>
                )}
              </View>

              {/* Darkened Vignette */}
              <View className="absolute top-0 left-0 w-full h-[17.5%] bg-black/50" />
              <View className="absolute bottom-0 left-0 w-full h-[17.5%] bg-black/50" />
              <View className="absolute top-[17.5%] left-0 w-[17.5%] h-[65%] bg-black/50" />
              <View className="absolute top-[17.5%] right-0 w-[17.5%] h-[65%] bg-black/50" />
            </View>

            {/* Instruction / Status Alert Card */}
            <View className="bg-zinc-850 border border-zinc-800 rounded-2xl p-4 flex-row items-center mb-6">
              {scanResult ? (
                <CheckCircle2 color="#10b981" size={20} className="mr-3" />
              ) : (
                <AlertCircle color="#eab308" size={20} className="mr-3" />
              )}
              <View className="flex-1">
                <Text className="text-white text-xs font-black uppercase tracking-widest">Verification Status</Text>
                <Text className="text-zinc-400 text-xs mt-1 font-bold">{scanningStatus}</Text>
              </View>
            </View>

            {/* Bottom Actions */}
            <View className="flex-row gap-3">
              <TouchableOpacity 
                onPress={handleCloseScanner}
                className="flex-1 bg-zinc-850 h-14 rounded-2xl items-center justify-center"
              >
                <Text className="text-white font-black text-xs">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={scanResult ? () => Alert.alert('Upload Photos', 'Simulating image upload to IPFS...', [{text: 'Done', onPress: handleCloseScanner}]) : handleSimulateScan}
                className={`flex-1 h-14 rounded-2xl items-center justify-center flex-row shadow-lg ${
                  scanResult ? 'bg-[#10b981] shadow-emerald-500/10' : 'bg-blue-500 shadow-blue-500/10'
                }`}
              >
                {scanResult && <Camera color="#fff" size={16} className="mr-2" />}
                <Text className="text-white font-black text-xs">
                  {scanResult ? 'Upload 3 Photos' : 'Simulate Scan'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SwipeableScreen>
  );
};

export default TransporterDashboard;
