import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar, Dimensions, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { WebView } from 'react-native-webview';
import { 
  ChevronLeft, 
  MapPin, 
  Navigation as NavIcon, 
  Phone, 
  MessageSquare,
  Clock,
  ArrowRight,
  Zap,
  PhoneCall
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const TripNavigation = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const params = useLocalSearchParams();
  
  const isOptimized = params.optimized === 'true';
  const [arrived, setArrived] = useState(false);

  // Nashik to Mumbai Route Coordinates
  // Coordinates are constrained to Western India / Maharashtra region for performance optimization
  const routePoints = [
    [19.9975, 73.7898], // Nashik
    [19.6835, 73.4764], // Kasara
    [19.4522, 73.3284], // Shahapur
    [19.2183, 72.9781], // Thane
    [18.9525, 72.8426]  // Mumbai Port
  ];

  const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; background-color: ${isDark ? '#09090b' : '#f8fafc'}; }
        #map { height: 100vh; width: 100vw; }
        
        /* Dark Mode theme for OpenStreetMap */
        ${isDark ? `
        .leaflet-tile {
          filter: invert(95%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
        .leaflet-container {
          background: #09090b !important;
        }
        ` : ''}

        /* Marker Styles */
        .custom-marker {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pulse-pickup {
          width: 14px;
          height: 14px;
          background: #2563eb;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 0 12px rgba(37,99,235,0.8);
          animation: pulseGreen 2s infinite;
        }
        .pulse-drop {
          width: 14px;
          height: 14px;
          background: #ef4444;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 0 12px rgba(239,68,68,0.8);
          animation: pulseRed 2s infinite;
        }
        .truck-icon {
          font-size: 26px;
          text-shadow: 0 2px 5px rgba(0,0,0,0.3);
          animation: bounce 1.2s infinite alternate;
        }
        
        @keyframes pulseGreen {
          0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(37,99,235,0.7); }
          70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(37,99,235,0); }
          100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(37,99,235,0); }
        }
        @keyframes pulseRed {
          0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(239,68,68,0.7); }
          70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(239,68,68,0); }
          100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(239,68,68,0); }
        }
        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-5px); }
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', {
          zoomControl: false,
          attributionControl: false,
          maxBounds: [[8.0, 68.0], [36.0, 97.0]], // Optimized strictly for India boundaries
          minZoom: 6,
          maxZoom: 16
        }).setView([19.5, 73.3], 8);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
        }).addTo(map);

        var routePoints = ${JSON.stringify(routePoints)};

        // Dynamic routing color depending on AI Optimization state
        var routeLine = L.polyline(routePoints, {
          color: '${isOptimized ? '#10b981' : '#3b82f6'}',
          weight: 6,
          opacity: 0.9,
          dashArray: '${isOptimized ? 'none' : '8, 8'}',
          lineJoin: 'round'
        }).addTo(map);

        map.fitBounds(routeLine.getBounds(), { padding: [80, 80] });

        // Div Icons
        var pickupIcon = L.divIcon({
          className: 'custom-marker',
          html: '<div class="pulse-pickup"></div>',
          iconSize: [20, 20]
        });

        var dropIcon = L.divIcon({
          className: 'custom-marker',
          html: '<div class="pulse-drop"></div>',
          iconSize: [20, 20]
        });

        var truckDivIcon = L.divIcon({
          className: 'custom-marker',
          html: '<div class="truck-icon">🚚</div>',
          iconSize: [36, 36]
        });

        // Add visual checkpoints
        L.marker([19.9975, 73.7898], { icon: pickupIcon }).addTo(map).bindPopup("<b>Pickup:</b> Nashik Mandi");
        L.marker([18.9525, 72.8426], { icon: dropIcon }).addTo(map).bindPopup("<b>Destination:</b> Mumbai Port");
        
        var truckMarker = L.marker([19.4522, 73.3284], { icon: truckDivIcon }).addTo(map);
        truckMarker.bindPopup("<b>Live Truck:</b> Speedy-04");

        // Live Simulated Path Movement along NH-48
        var currentIdx = 2;
        setInterval(function() {
          currentIdx = (currentIdx + 1) % routePoints.length;
          var nextCoord = routePoints[currentIdx];
          truckMarker.setLatLng(nextCoord);
          map.panTo(nextCoord);
        }, 12000);
      </script>
    </body>
    </html>
  `;

  const handleCall = () => {
    Alert.alert(
      "Calling Farmer",
      "Connecting you with Farmer Ramesh Patel at +91 98765 43210...",
      [{ text: "End Call", style: "cancel" }]
    );
  };

  const handleMessage = () => {
    Alert.alert(
      "Chat with Farmer",
      "Opening messaging client...",
      [{ text: "Dismiss", style: "default" }]
    );
  };

  const handleArrived = () => {
    setArrived(true);
    Alert.alert(
      "Destination Reached!",
      "You have arrived at Mumbai Port. Please present your QR code to the buyer to verify and trigger the automated Escrow release.",
      [
        { 
          text: "Open QR Scanner", 
          onPress: () => router.push({ pathname: '/(transporter)/dashboard', params: { autoOpenScanner: 'true' } }) 
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-100 dark:bg-zinc-950">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Interactive Leaflet India Map WebView */}
      <View className="absolute inset-0">
        <WebView 
          originWhitelist={['*']}
          source={{ html: mapHtml }}
          style={{ width: '100%', height: '100%', backgroundColor: isDark ? '#09090b' : '#f8fafc' }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </View>

      {/* Top Header Overlay */}
      <View className="absolute top-14 left-4 right-4 bg-white dark:bg-zinc-900 rounded-3xl p-4 shadow-xl flex-row items-center border border-gray-100 dark:border-zinc-800">
        <TouchableOpacity onPress={() => router.back()} className="mr-3 w-10 h-10 items-center justify-center bg-gray-50 dark:bg-zinc-800 rounded-full border border-gray-100 dark:border-zinc-700">
          <ChevronLeft color={isDark ? "#ffffff" : "#0f172a"} size={20} />
        </TouchableOpacity>
        <View className="flex-1">
          {isOptimized ? (
            <View className="flex-row items-center bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded self-start mb-1">
              <Zap color="#10b981" size={10} fill="#10b981" />
              <Text className="text-[#10b981] text-[8px] font-black uppercase tracking-wider ml-1">AI Optimized path</Text>
            </View>
          ) : (
            <Text className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest">Next Turn in 400m</Text>
          )}
          <Text className="text-base font-black text-gray-900 dark:text-zinc-100" numberOfLines={1}>
            {isOptimized ? "Follow Green Corridor (NH-48)" : "Turn Right onto NH-48"}
          </Text>
        </View>
        <View className={`p-3 rounded-2xl ${isOptimized ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-blue-100 dark:bg-blue-900/40'}`}>
          <NavIcon color={isOptimized ? "#10b981" : "#2563eb"} size={22} fill={isOptimized ? "#10b981" : "#2563eb"} />
        </View>
      </View>

      {/* Bottom Info Sheet - Responsive Layout Positioned Above Floating Tab Control Panel (bottom-28) */}
      <View className="absolute bottom-28 left-4 right-4 bg-white dark:bg-zinc-900 rounded-[36px] p-6 shadow-2xl border border-gray-100 dark:border-zinc-800">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-3xl font-black text-gray-900 dark:text-zinc-100 tracking-tighter">
              {isOptimized ? "38" : "45"} <Text className="text-xs font-bold text-gray-400">min</Text>
            </Text>
            <Text className="text-gray-500 dark:text-zinc-400 text-xs font-bold mt-0.5">
              {isOptimized ? "26.1" : "28.4"} km remaining
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-gray-900 dark:text-zinc-100 font-black text-base">
              ETA {isOptimized ? "4:13 PM" : "4:20 PM"}
            </Text>
            <View className="bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1 rounded-full mt-2">
              <Text className="text-emerald-700 dark:text-emerald-400 text-[9px] font-black uppercase tracking-wider">
                {isOptimized ? "AI Optimized" : "On Time"}
              </Text>
            </View>
          </View>
        </View>

        <View className="h-[1px] bg-gray-100 dark:bg-zinc-800 w-full mb-6" />

        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center flex-1">
            <View className="w-12 h-12 bg-gray-100 dark:bg-zinc-800 rounded-full items-center justify-center overflow-hidden border-2 border-gray-50 dark:border-zinc-700">
              <Image source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400' }} className="w-full h-full" />
            </View>
            <View className="ml-3">
              <Text className="text-gray-900 dark:text-zinc-100 font-black text-sm">Ramesh Patel</Text>
              <Text className="text-gray-500 dark:text-zinc-400 text-[10px] font-bold">Pick-up Location</Text>
            </View>
          </View>
          <View className="flex-row gap-2">
            <TouchableOpacity onPress={handleCall} className="w-10 h-10 bg-emerald-500 rounded-full items-center justify-center shadow-lg shadow-emerald-500/20">
              <Phone color="#ffffff" size={16} fill="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleMessage} className="w-10 h-10 bg-[#2563eb] rounded-full items-center justify-center shadow-lg shadow-blue-500/20">
              <MessageSquare color="#ffffff" size={16} fill="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          onPress={handleArrived}
          disabled={arrived}
          className={`mt-6 h-14 rounded-2xl items-center justify-center flex-row shadow-lg ${arrived ? 'bg-zinc-300 dark:bg-zinc-700' : 'bg-gray-900 dark:bg-zinc-100 shadow-zinc-950/20'}`}
        >
          <Text className={`font-black text-sm mr-2 ${arrived ? 'text-gray-500 dark:text-zinc-400' : 'text-white dark:text-zinc-900'}`}>
            {arrived ? "Arrived" : "Arrive at Destination"}
          </Text>
          <ArrowRight color={arrived ? "#888" : (isDark ? "#000" : "#fff")} size={16} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TripNavigation;
