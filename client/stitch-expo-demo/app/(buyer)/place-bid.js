import React, { useState } from 'react';
import { useColorScheme } from 'nativewind';
import { View, Text, TextInput, TouchableOpacity, StatusBar, Image, ScrollView, Alert } from 'react-native';
import { 
  ChevronLeft, 
  IndianRupee, 
  Info,
  Clock,
  ShieldCheck,
  TrendingUp,
  Users,
  Lock,
  ArrowRight,
  Truck,
  Landmark,
  BadgeAlert,
  HelpCircle,
  AlertTriangle
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function PlaceBid() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const params = useLocalSearchParams();
  const isGroupBuy = params.isGroupBuy === 'true';
  const loadId = params.id ? parseInt(params.id.toString()) : 1;

  // Advance Payment Selection Status
  const [advanceType, setAdvanceType] = useState('none'); // 'none', '25' (25%), '50' (50%)

  // Configuration for strictly regulated 4-Member Equal Split Sourcing Groups
  const cropTitle = isGroupBuy 
    ? (loadId === 101 ? 'Alphonso Mango Export Pool' : 'Kolkata Potato Heavy Lot')
    : (loadId === 1 ? 'Premium Quality Onions' : loadId === 2 ? 'Fresh Tomatoes' : 'Alphonso Mangoes');

  const sellerName = isGroupBuy
    ? (loadId === 101 ? 'Ratnagiri Cooperative Union' : 'Bengal Growers Alliance')
    : 'Ramesh Patel';

  const defaultPrice = isGroupBuy
    ? (loadId === 101 ? '2000' : '8000') // base individual bid rate per unit
    : (loadId === 1 ? '1200' : loadId === 2 ? '800' : '2500');

  const unitType = isGroupBuy
    ? (loadId === 101 ? 'Box' : 'Ton')
    : 'Quintal';

  // Strict Co-Op Split configuration values
  const lotTotalVolume = isGroupBuy
    ? (loadId === 101 ? '120' : '20')
    : '10';

  const equalVolumePortion = isGroupBuy
    ? (loadId === 101 ? '30' : '5')
    : '10';

  const equalCostPortion = isGroupBuy
    ? (loadId === 101 ? 60000 : 40000)
    : 12000;

  const [bidAmount, setBidAmount] = useState(defaultPrice);
  const [qty, setQty] = useState(isGroupBuy ? equalVolumePortion : '5'); 

  // Dynamically compute the complete price splits in real time
  const productCost = isGroupBuy 
    ? equalCostPortion 
    : ((parseInt(bidAmount) || 0) * (parseInt(qty) || 0));

  // 12% crop value + ₹800 fixed trip surcharge
  const logisticsCost = productCost > 0 ? Math.round(productCost * 0.12 + 800) : 0; 
  
  // 2% platform facilitation & Mandi trade tax
  const platformCost = Math.round(productCost * 0.02); 

  const totalCost = productCost + logisticsCost + platformCost;

  const advancePercentage = advanceType === '25' ? 25 : advanceType === '50' ? 50 : 0;
  const advanceAmount = Math.round(totalCost * (advancePercentage / 100));
  const escrowLockAmount = totalCost - advanceAmount;

  // Split details of advance paid instantly
  const farmerAdvance = Math.round(productCost * (advancePercentage / 100));
  const logisticsAdvance = Math.round(logisticsCost * (advancePercentage / 100));

  const handleConfirmBid = () => {
    if (!isGroupBuy) {
      if (!bidAmount || isNaN(bidAmount) || parseFloat(bidAmount) <= 0) {
        Alert.alert('Validation Error', 'Please enter a valid bid amount greater than ₹0.');
        return;
      }
      if (!qty || isNaN(qty) || parseFloat(qty) <= 0) {
        Alert.alert('Validation Error', 'Please enter a valid positive quantity.');
        return;
      }
    }

    const advanceInfoText = advancePercentage > 0 
      ? `(₹${advanceAmount.toLocaleString()} paid instantly to cover input costs, and ₹${escrowLockAmount.toLocaleString()} safely locked in Smart Escrow)`
      : `(100% of ₹${totalCost.toLocaleString()} locked safely in Smart Escrow)`;

    if (isGroupBuy) {
      Alert.alert(
        "Join Co-Op Pool Successful!",
        `You have successfully committed to this 4-Member Equal-Split group. Your total share cost: ₹${totalCost.toLocaleString()} ${advanceInfoText}. The transaction will complete when the final member joins.`,
        [
          { 
            text: "View My Orders", 
            onPress: () => router.push('/(buyer)/my-orders') 
          }
        ]
      );
    } else {
      Alert.alert(
        "Bid Placed Successfully!",
        `Your bid of ₹${bidAmount}/${unitType} for ${qty} ${unitType}s has been submitted to ${sellerName}. Total Bid Cost: ₹${totalCost.toLocaleString()} ${advanceInfoText}.`,
        [
          { 
            text: "Go to Dashboard", 
            onPress: () => router.push('/(buyer)/dashboard') 
          }
        ]
      );
    }
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950 pt-12">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View className="px-4 py-3 flex-row items-center border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center mr-2">
          <ChevronLeft color={isDark ? "#ffffff" : "#0b1c30"} size={24} />
        </TouchableOpacity>
        <Text className="text-xl text-gray-900 dark:text-zinc-100 font-black">
          {isGroupBuy ? '4-Split Co-Op Sourcing' : 'Place Your Bid'}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-4">
        
        {/* Product Preview */}
        <View className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-[24px] p-4 mt-6 flex-row items-center shadow-sm">
           <Image 
              source={{ uri: isGroupBuy && loadId === 101 ? 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=400' : 'https://images.unsplash.com/photo-1518977676601-b53f02ac6d5d?q=80&w=400' }} 
              className="w-20 h-20 rounded-xl"
           />
           <View className="flex-1 ml-4">
              <View className="flex-row items-center">
                <Text className="text-lg font-black text-gray-900 dark:text-zinc-100 flex-1" numberOfLines={1}>{cropTitle}</Text>
              </View>
              <Text className="text-xs text-gray-500 dark:text-zinc-400 font-bold">Grade A · Managed by {sellerName}</Text>
              <View className="flex-row items-center mt-1">
                 <Text className="text-gray-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-wider">Lot Total Volume:</Text>
                 <Text className="text-[#10b981] font-bold text-sm ml-1">
                   ₹{isGroupBuy ? (loadId === 101 ? '2,40,000' : '1,60,000') : '12,000'} ({lotTotalVolume} {unitType}s)
                 </Text>
              </View>
           </View>
        </View>

        {/* Dynamic Context Box based on isGroupBuy */}
        {isGroupBuy ? (
          <View className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl p-4 mt-4 flex-row items-start">
             <Users color="#059669" size={18} className="mt-0.5" />
             <View className="ml-3 flex-1">
                <Text className="text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase tracking-wider mb-1">Strict 4-Member Equal Split</Text>
                <Text className="text-emerald-700 dark:text-emerald-400 text-xs font-semibold leading-4">
                  This is a strictly regulated 4-member cooperative order. All 4 members split both the cargo lot and the smart escrow payment **equally (25% each)** to guarantee seamless logistics and distribution.
                </Text>
             </View>
          </View>
        ) : (
          <View className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-4 mt-4 flex-row items-center">
             <Info color="#2563eb" size={18} />
             <Text className="text-blue-700 dark:text-blue-300 text-xs ml-4 flex-1 font-semibold">
                Highest individual bid currently is <Text className="font-bold">₹{(parseInt(defaultPrice) + 40).toLocaleString()}</Text>. Bidding higher increases your chances.
             </Text>
          </View>
        )}

        {/* Bidding/Commitment Input Fields */}
        {isGroupBuy ? (
          /* Locked Co-op Splitting Layout */
          <View className="mt-6">
             <Text className="text-[10px] text-gray-500 dark:text-zinc-400 font-black uppercase tracking-wider mb-2 ml-1">REGULATED EQUAL-SPLIT ALLOCATION (25% SHARE)</Text>
             <View className="bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-5">
                <View className="flex-row items-center justify-between mb-4">
                   <View>
                      <Text className="text-xs text-gray-400 font-bold uppercase tracking-wider">Crop Volume Allocation</Text>
                      <Text className="text-lg font-black text-gray-900 dark:text-zinc-100">{equalVolumePortion} {unitType}s</Text>
                   </View>
                   <View className="bg-gray-200 dark:bg-zinc-800 p-2 rounded-xl flex-row items-center">
                      <Lock color="#64748b" size={14} />
                      <Text className="text-gray-500 dark:text-zinc-400 text-[10px] font-black uppercase ml-1">Locked Portions</Text>
                   </View>
                </View>

                <View className="bg-gray-200 dark:bg-zinc-800 mb-4" style={{ height: 1 }} />

                <View className="flex-row items-center justify-between">
                   <View>
                      <Text className="text-xs text-gray-400 font-bold uppercase tracking-wider">Split Payment Portion</Text>
                      <Text className="text-lg font-black text-[#10b981]">₹{equalCostPortion.toLocaleString()}</Text>
                   </View>
                   <Text className="text-[10px] text-gray-400 font-black uppercase">Exactly 1/4 of total lot</Text>
                </View>
             </View>
          </View>
        ) : (
          /* Dynamic Individual Bidding Layout */
          <View className="mt-6 flex-row gap-4">
            <View className="flex-1">
              <Text className="text-[10px] text-gray-500 dark:text-zinc-400 font-black uppercase tracking-wider mb-2 ml-1">Order Quantity ({unitType}s)</Text>
              <View className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 h-14 rounded-2xl flex-row items-center px-4 shadow-sm">
                 <TextInput 
                    value={qty}
                    onChangeText={setQty}
                    keyboardType="numeric"
                    placeholder="e.g. 5"
                    className="flex-1 text-base font-black text-gray-900 dark:text-zinc-100 text-center"
                 />
              </View>
            </View>
            
            <View className="flex-1">
              <Text className="text-[10px] text-gray-500 dark:text-zinc-400 font-black uppercase tracking-wider mb-2 ml-1">Bid per {unitType}</Text>
              <View className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 h-14 rounded-2xl flex-row items-center px-4 shadow-sm">
                 <IndianRupee color={isDark ? "#ffffff" : "#64748b"} size={16} />
                 <TextInput 
                    value={bidAmount}
                    onChangeText={setBidAmount}
                    keyboardType="numeric"
                    className="flex-1 ml-2 text-base font-black text-gray-900 dark:text-zinc-100 text-center"
                 />
              </View>
            </View>
          </View>
        )}

        {/* Dynamic Pocket-Cost Breakdown Summary Card */}
        <View className="mt-8 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-[28px] p-6 shadow-sm">
           <Text className="text-[10px] text-gray-400 dark:text-zinc-500 font-black uppercase tracking-wider mb-4">Complete Pocket-Cost Breakdown</Text>
           
           <View className="gap-y-3">
              {/* Product Cost */}
              <View className="flex-row justify-between">
                 <View className="flex-row items-center">
                    <Lock color={isDark ? '#a1a1aa' : '#475569'} size={14} />
                    <Text className="text-gray-600 dark:text-zinc-300 text-xs font-semibold ml-2">Base Product Price</Text>
                 </View>
                 <Text className="text-gray-900 dark:text-zinc-100 font-black text-xs">₹{productCost.toLocaleString()}</Text>
              </View>

              {/* Logistics Cost */}
              <View className="flex-row justify-between">
                 <View className="flex-row items-center">
                    <Truck color={isDark ? '#a1a1aa' : '#475569'} size={14} />
                    <Text className="text-gray-600 dark:text-zinc-300 text-xs font-semibold ml-2">Logistics & Shipping Cost</Text>
                 </View>
                 <Text className="text-gray-900 dark:text-zinc-100 font-black text-xs">₹{logisticsCost.toLocaleString()}</Text>
              </View>

              {/* Platform and Mandi Cess */}
              <View className="flex-row justify-between">
                 <View className="flex-row items-center">
                    <Landmark color={isDark ? '#a1a1aa' : '#475569'} size={14} />
                    <Text className="text-gray-600 dark:text-zinc-300 text-xs font-semibold ml-2">Platform Facilitation & Cess (2%)</Text>
                 </View>
                 <Text className="text-gray-900 dark:text-zinc-100 font-black text-xs">₹{platformCost.toLocaleString()}</Text>
              </View>

              <View className="bg-gray-200 dark:bg-zinc-800 my-2" style={{ height: 1 }} />

              {/* Total Pocket Cost */}
              <View className="flex-row justify-between items-center">
                 <Text className="text-gray-900 dark:text-zinc-100 font-black text-sm uppercase">Total Pocket Cost</Text>
                 <Text className="text-gray-900 dark:text-zinc-100 font-black text-lg">₹{totalCost.toLocaleString()}</Text>
              </View>
           </View>
        </View>

        {/* Dynamic Input Advance Option Card */}
        <View className="mt-5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-[28px] p-6 shadow-sm">
           <View className="flex-row items-center mb-3">
              <BadgeAlert color="#006e2f" size={18} />
              <Text className="text-sm font-black text-gray-900 dark:text-zinc-100 ml-2">Upfront Advance Facility</Text>
           </View>
           
           <Text className="text-[10px] text-gray-400 font-bold mb-4 leading-4">
             Unlock a portion of payments immediately to fund the farmer's seed/harvest costs or transporter's fuel advances.
           </Text>

           {/* Selector Chips */}
           <View className="flex-row bg-gray-50 dark:bg-zinc-800/40 p-1 rounded-2xl border border-gray-200 dark:border-zinc-800 mb-4">
              {[
                { type: 'none', label: '0% Advance', desc: 'Max Security' },
                { type: '25', label: '25% Advance', desc: 'Input/Fuel Support' },
                { type: '50', label: '50% Advance', desc: 'High Support' }
              ].map((item) => (
                <TouchableOpacity
                  key={item.type}
                  onPress={() => setAdvanceType(item.type)}
                  className="flex-1 py-2.5 rounded-xl items-center justify-center"
                  style={advanceType === item.type ? {
                    backgroundColor: '#3b82f6',
                    shadowColor: '#3b82f6',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 1,
                  } : null}
                >
                  <Text className={`text-[10px] font-black uppercase tracking-wider ${advanceType === item.type ? 'text-white' : 'text-gray-400'}`}>
                    {item.label}
                  </Text>
                  <Text className={`text-[7px] font-bold ${advanceType === item.type ? 'text-white/80' : 'text-gray-400'}`}>
                    {item.desc}
                  </Text>
                </TouchableOpacity>
              ))}
           </View>

           {/* Advance Split Breakdowns */}
           {advancePercentage > 0 && (
             <View className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/40 mb-4">
                <Text className="text-blue-800 dark:text-blue-300 text-[10px] font-black uppercase tracking-wider mb-3">Advance Disbursement Splits</Text>
                <View className="gap-y-2">
                   <View className="flex flex-row justify-between">
                      <Text className="text-xs text-blue-700 dark:text-blue-400 font-medium">Paid to Farmer Ramesh</Text>
                      <Text className="text-xs text-blue-900 dark:text-white font-black">₹{farmerAdvance.toLocaleString()}</Text>
                   </View>
                   <View className="flex flex-row justify-between">
                      <Text className="text-xs text-blue-700 dark:text-blue-400 font-medium">Paid to Transporter Agency (Fuel)</Text>
                      <Text className="text-xs text-blue-900 dark:text-white font-black">₹{logisticsAdvance.toLocaleString()}</Text>
                   </View>
                   <View className="bg-blue-100 dark:bg-blue-900/40 my-1" style={{ height: 1 }} />
                   <View className="flex flex-row justify-between">
                      <Text className="text-xs text-blue-800 dark:text-blue-300 font-black">Total Instant Advance Payout</Text>
                      <Text className="text-xs text-blue-900 dark:text-white font-black">₹{advanceAmount.toLocaleString()}</Text>
                   </View>
                   <View className="flex flex-row justify-between">
                      <Text className="text-xs text-blue-800 dark:text-blue-300 font-black">Safely Locked in Escrow</Text>
                      <Text className="text-xs text-emerald-600 dark:text-emerald-400 font-black">₹{escrowLockAmount.toLocaleString()}</Text>
                   </View>
                </View>
             </View>
           )}

           {/* COUNTERPARTY RISK WARNING DISCLAIMER */}
           {advancePercentage > 0 && (
             <View className="bg-red-50 dark:bg-red-950/20 p-4 rounded-2xl border border-red-100 dark:border-red-900/40 flex-row items-start">
                <AlertTriangle color="#ef4444" size={16} className="mt-0.5" />
                <View className="ml-3 flex-1">
                   <Text className="text-red-800 dark:text-red-400 text-[10px] font-black uppercase tracking-wider mb-1">⚠️ Counterparty Risk Warning</Text>
                   <Text className="text-red-700 dark:text-red-400 text-[10px] font-bold leading-4">
                     Advance funds bypass the smart contract escrow lock to pay the participants immediately for fuel or fertilizer input costs. This helps them execute your order, but is released **at your own risk** in case of cargo damage or transaction failure.
                   </Text>
                </View>
             </View>
           )}
        </View>

        {/* Standard Smart Escrow lock confirmation */}
        {advancePercentage === 0 && (
          <View className="mt-5 flex-row items-center bg-green-50 dark:bg-emerald-950/20 p-4 rounded-2xl border border-green-100 dark:border-emerald-900/40">
             <ShieldCheck color="#006e2f" size={20} />
             <Text className="text-green-800 dark:text-emerald-300 text-[10px] ml-3 font-bold leading-4 flex-1">
               Smart Escrow security active. 100% of ₹{totalCost.toLocaleString()} will be securely held in contract escrow; released to farmer & transporter only after cargo quality passes verification.
             </Text>
          </View>
        )}

        <View className="h-10" />
      </ScrollView>

      {/* Elevated Floating Footer - Completely clears the absolute bottom floating Tab Navigator (Control Panel)! */}
      <View className="px-6 pt-4 pb-4 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 mb-[108px] rounded-[24px] mx-4" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 }}>
        <TouchableOpacity 
          onPress={handleConfirmBid}
          className="bg-[#059669] h-14 rounded-2xl flex-row items-center justify-center"
          style={{
            shadowColor: '#059669',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Text className="text-white font-black text-base mr-2">
            {isGroupBuy ? 'Confirm Co-Op Sourcing' : 'Submit Solo Bid'}
          </Text>
          <ArrowRight color="#ffffff" size={18} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
