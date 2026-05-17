import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Modal, Animated, Easing } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle2, 
  Shield, 
  Lock, 
  AlertCircle, 
  Clock,
  Users,
  ArrowRight,
  UserCheck,
  ChevronRight
} from 'lucide-react-native';

// ─────────────────────────────────────────────────────────────────────────────
// MyOrders — enhanced with blockchain integration entry points & Co-Op Pools
// Trust Receipt  → /(shared)/blockchain-receipt
// Escrow Status  → /(shared)/escrow-status
// Evidence Vault → /(shared)/evidence-vault
// ─────────────────────────────────────────────────────────────────────────────

const ORDERS = [
  {
    id: '#ORD-9012', item: 'Premium Wheat', qty: '500 kg',
    status: 'In Transit', escrowState: 'IN_TRANSIT', date: 'Oct 15, 2025',
    icon: Truck, color: '#3b82f6', amount: '₹24,500',
    hasReceipt: false,
  },
  {
    id: '#ORD-8942', item: 'Organic Soybeans', qty: '200 kg',
    status: 'Delivered', escrowState: 'DELIVERED', date: 'Oct 10, 2025',
    icon: CheckCircle2, color: '#10b981', amount: '₹18,200',
    hasReceipt: false,
  },
  {
    id: '#ORD-8311', item: 'Fresh Tomatoes', qty: '300 kg',
    status: 'Completed', escrowState: 'COMPLETED', date: 'Sep 28, 2025',
    icon: CheckCircle2, color: '#059669', amount: '₹9,600',
    hasReceipt: true,
    txHash: '0xa3f8...b3c4',
  },
];

const ESCROW_BADGE = {
  IN_TRANSIT:    { label: 'Funds Locked', color: '#7c3aed', bg: 'rgba(124,58,237,0.1)' },
  DELIVERED:     { label: 'Pending Release', color: '#d97706', bg: 'rgba(217,119,6,0.1)' },
  COMPLETED:     { label: 'Settled', color: '#059669', bg: 'rgba(5,150,105,0.1)' },
  DISPUTED:      { label: 'In Dispute', color: '#dc2626', bg: 'rgba(220,38,38,0.1)' },
  PAID_ESCROW:   { label: 'Funds Locked', color: '#7c3aed', bg: 'rgba(124,58,237,0.1)' },
};

export default function MyOrders() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [requestingOrder, setRequestingOrder] = useState(null);
  const [requestedOrders, setRequestedOrders] = useState({});
  const pulseAnim = useRef(new Animated.Value(0)).current;

  // Active 4-Split Co-Op Pools local state
  const [coopPools, setCoopPools] = useState([
    {
      id: 'POOL-4091',
      item: 'Alphonso Mango Export Pool',
      qty: '30 Boxes',
      amount: '₹61,200',
      joinedMembers: 3,
      totalMembers: 4,
      status: 'Filling',
      desc: 'Waiting for 1 more buyer to commit. Escrow auto-starts upon full group assembly.',
      members: [
        { name: 'Mumbai Fresh', initial: 'MF', active: true },
        { name: 'You (Organic Retail)', initial: 'YO', active: true },
        { name: 'Pune Agro Union', initial: 'PA', active: true },
        { name: 'Waiting for Buyer...', initial: '?', active: false }
      ]
    },
    {
      id: 'POOL-2088',
      item: 'Kolkata Potato Heavy Lot',
      qty: '5 Tons',
      amount: '₹40,800',
      joinedMembers: 4,
      totalMembers: 4,
      status: 'Active',
      desc: 'All 4 members successfully committed. Standard Escrow Contract is active.',
      members: [
        { name: 'You (Organic Retail)', initial: 'YO', active: true },
        { name: 'Delhi Traders', initial: 'DT', active: true },
        { name: 'Indore Veg Link', initial: 'IV', active: true },
        { name: 'Surat Grocery Ltd', initial: 'SG', active: true }
      ]
    }
  ]);

  const handleRequestRelease = (orderId) => {
    if (requestedOrders[orderId]) return;

    Alert.alert(
      'Request Escrow Release',
      'Are you satisfied with the quality received? Requesting release will trigger smart contract multi-sig confirmation.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit Request',
          style: 'default',
          onPress: () => {
            setRequestingOrder(orderId);
            Animated.loop(
              Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 0, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
              ])
            ).start();

            setTimeout(() => {
              setRequestingOrder(null);
              setRequestedOrders(prev => ({ ...prev, [orderId]: true }));
              pulseAnim.stopAnimation();
              Alert.alert('✅ Request Sent', 'Escrow release request initiated. Awaiting smart contract multi-sig confirmation before funds are fully settled.');
            }, 3000);
          }
        }
      ]
    );
  };

  const handleInviteCoopMember = (poolId) => {
    Alert.alert(
      "Share Sourcing Invite",
      "Copy pool invite link to clipboard? Let wholesale friends join the remaining 25% allocation to split transportation costs.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Copy Invite Link", 
          onPress: () => {
            // Update pool slots to 4/4 to simulate someone joining!
            setCoopPools(prev => prev.map(p => {
              if (p.id === poolId) {
                return {
                  ...p,
                  joinedMembers: 4,
                  status: 'Active',
                  desc: 'All 4 members successfully committed. Standard Escrow Contract is active.',
                  members: p.members.map((m, idx) => idx === 3 ? { name: 'Bangalore Organics', initial: 'BO', active: true } : m)
                };
              }
              return p;
            }));
            Alert.alert("Link Copied!", "Invite shared with partners. Bangalore Organics has joined the group split!");
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950">
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header */}
      <View className="px-6 pt-14 pb-4 flex-row items-center border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-full items-center justify-center mr-4">
          <ArrowLeft color={isDark ? '#ffffff' : '#000000'} size={20} />
        </TouchableOpacity>
        <View>
          <Text className="text-xl font-black text-gray-900 dark:text-zinc-100">Order Ledger</Text>
          <Text className="text-xs text-gray-400 dark:text-zinc-500 font-medium mt-0.5">Escrow & Co-Op transactions</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-4 py-6">
        
        {/* SECTION 1: Dynamic 4-Split Co-Op Pools Tracker */}
        <View className="mb-6">
          <Text className="text-sm font-black text-gray-400 uppercase tracking-wider mb-3 px-1">Active Co-Op Sourcing Pools</Text>
          
          {coopPools.map((pool) => (
            <View 
              key={pool.id} 
              className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-[28px] p-5 mb-4 shadow-sm"
            >
              {/* Pool Header */}
              <View className="flex-row justify-between items-start mb-3 pb-3 border-b border-gray-100 dark:border-zinc-850">
                <View className="flex-1 mr-2">
                  <Text className="text-xs text-gray-400 font-bold uppercase tracking-wider">{pool.id}</Text>
                  <Text className="text-lg font-black text-gray-900 dark:text-zinc-100 mt-0.5">{pool.item}</Text>
                </View>
                <View className={`px-3 py-1 rounded-full flex-row items-center ${
                  pool.status === 'Active' ? 'bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30' : 'bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30'
                }`}>
                  <Users color={pool.status === 'Active' ? '#059669' : '#ea580c'} size={12} />
                  <Text className={`text-[10px] font-black ml-1 uppercase tracking-wider ${
                    pool.status === 'Active' ? 'text-emerald-700 dark:text-emerald-400' : 'text-orange-700 dark:text-orange-400'
                  }`}>
                    {pool.joinedMembers}/{pool.totalMembers} Joined
                  </Text>
                </View>
              </View>

              {/* Share Info */}
              <View className="flex-row justify-between mb-4">
                <Text className="text-xs text-gray-500 dark:text-zinc-400">Your Share Allocation:</Text>
                <Text className="text-xs font-black text-gray-900 dark:text-zinc-100">{pool.qty} ({pool.amount})</Text>
              </View>

              {/* Members Slots Visualization */}
              <Text className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-2">4-Member Equal Split Status</Text>
              <View className="flex-row justify-between items-center mb-4 bg-gray-50 dark:bg-zinc-800/40 p-3 rounded-2xl border border-gray-150 dark:border-zinc-800">
                {pool.members.map((member, idx) => (
                  <View key={idx} className="items-center flex-1">
                    <View className={`w-9 h-9 rounded-full items-center justify-center border-2 ${
                      member.active 
                        ? 'bg-blue-100 dark:bg-blue-950/40 border-blue-400' 
                        : 'bg-gray-150 dark:bg-zinc-800 border-dashed border-gray-300 dark:border-zinc-700'
                    }`}>
                      <Text className={`text-xs font-black ${member.active ? 'text-blue-700 dark:text-blue-300' : 'text-gray-400'}`}>
                        {member.initial}
                      </Text>
                    </View>
                    <Text className={`text-[8px] font-bold mt-1 text-center truncate w-14 ${member.active ? 'text-gray-700 dark:text-zinc-300 font-black' : 'text-gray-400'}`} numberOfLines={1}>
                      {member.name.split(' ')[0]}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Description & Action */}
              <Text className="text-[10px] text-gray-500 dark:text-zinc-400 leading-4 mb-4 font-medium">
                {pool.desc}
              </Text>

              {pool.status === 'Active' ? (
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => router.push('/(shared)/escrow-status')}
                    className="flex-1 bg-purple-50 dark:bg-purple-900/20 py-2.5 rounded-xl items-center justify-center flex-row border border-purple-100 dark:border-purple-800"
                  >
                    <Lock color="#7c3aed" size={13} />
                    <Text className="text-purple-700 dark:text-purple-400 font-bold text-xs ml-1.5">View Group Escrow</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => router.push('/(buyer)/track-order')}
                    className="flex-1 bg-gray-100 dark:bg-zinc-800 py-2.5 rounded-xl items-center justify-center flex-row"
                  >
                    <Truck color={isDark ? '#a1a1aa' : '#6b7280'} size={13} />
                    <Text className="text-gray-900 dark:text-zinc-100 font-bold text-xs ml-1.5">Track Transit</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => handleInviteCoopMember(pool.id)}
                  className="bg-blue-500 py-3 rounded-2xl items-center justify-center flex-row shadow-sm"
                >
                  <UserCheck color="#ffffff" size={14} />
                  <Text className="text-white font-black text-xs ml-2">Invite Wholesale Partners</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* SECTION 2: Standard/Direct Solo Orders */}
        <Text className="text-sm font-black text-gray-400 uppercase tracking-wider mb-3 px-1">Solo Orders & Direct Escrows</Text>
        
        {ORDERS.map((o) => {
          const escrowBadge = ESCROW_BADGE[o.escrowState];
          return (
            <View
              key={o.id}
              className="bg-white dark:bg-zinc-900 rounded-[28px] border border-gray-200 dark:border-zinc-800 p-5 mb-4 shadow-sm"
            >
              {/* Order header */}
              <View className="flex-row justify-between items-center mb-3 pb-3 border-b border-gray-100 dark:border-zinc-800">
                <View>
                  <Text className="text-sm font-bold text-gray-500 dark:text-zinc-400">{o.id}</Text>
                  <Text className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">{o.date} · {o.amount}</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  {/* Escrow state chip */}
                  {escrowBadge && (
                    <View style={{ backgroundColor: escrowBadge.bg }} className="px-2 py-1 rounded-full flex-row items-center">
                      <Lock color={escrowBadge.color} size={10} />
                      <Text style={{ color: escrowBadge.color }} className="text-[10px] font-black ml-1 uppercase tracking-wider">
                        {escrowBadge.label}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Product info */}
              <View className="flex-row items-center mb-4">
                <View className="w-12 h-12 bg-gray-100 dark:bg-zinc-800 rounded-xl items-center justify-center mr-4">
                  <Package color={isDark ? '#a1a1aa' : '#6b7280'} size={24} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-gray-900 dark:text-zinc-100">{o.item}</Text>
                  <Text className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">Qty: {o.qty}</Text>
                </View>
                {/* Status icon */}
                <View className="w-9 h-9 rounded-full items-center justify-center" style={{ backgroundColor: `${o.color}18` }}>
                  <o.icon color={o.color} size={18} />
                </View>
              </View>

              {/* Row 1: Track + Escrow */}
              <View className="flex-row gap-2 mb-2">
                <TouchableOpacity
                  onPress={() => router.push('/(buyer)/track-order')}
                  className="flex-1 bg-gray-100 dark:bg-zinc-800 py-2.5 rounded-xl items-center justify-center flex-row"
                >
                  <Truck color={isDark ? '#a1a1aa' : '#6b7280'} size={13} />
                  <Text className="text-gray-900 dark:text-zinc-100 font-bold text-xs ml-1">Track</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push('/(shared)/escrow-status')}
                  className="flex-1 bg-purple-50 dark:bg-purple-900/20 py-2.5 rounded-xl items-center justify-center flex-row border border-purple-100 dark:border-purple-800"
                >
                  <Lock color="#7c3aed" size={13} />
                  <Text className="text-purple-700 dark:text-purple-400 font-bold text-xs ml-1">Escrow</Text>
                </TouchableOpacity>
              </View>

              {/* Row 2: Trust Receipt (if completed) + Dispute */}
              <View className="flex-row gap-2">
                {o.escrowState === 'DELIVERED' ? (
                  <TouchableOpacity
                    onPress={() => handleRequestRelease(o.id)}
                    disabled={requestedOrders[o.id]}
                    className={`flex-1 py-2.5 rounded-xl items-center justify-center flex-row ${requestedOrders[o.id] ? 'bg-gray-400 dark:bg-zinc-700' : 'bg-emerald-600'}`}
                  >
                    {requestedOrders[o.id] ? <Clock color="#ffffff" size={13} /> : <CheckCircle2 color="#ffffff" size={13} />}
                    <Text className="text-white font-bold text-xs ml-1">
                      {requestedOrders[o.id] ? 'Request Pending' : 'Request Escrow Release'}
                    </Text>
                  </TouchableOpacity>
                ) : o.escrowState === 'COMPLETED' || o.hasReceipt ? (
                  <TouchableOpacity
                    onPress={() => router.push('/(shared)/blockchain-receipt')}
                    className="flex-1 bg-green-50 dark:bg-green-900/20 py-2.5 rounded-xl items-center justify-center flex-row border border-green-200 dark:border-green-800"
                  >
                    <Shield color="#059669" size={13} />
                    <Text className="text-green-700 dark:text-green-400 font-bold text-xs ml-1">Trust Receipt</Text>
                  </TouchableOpacity>
                ) : (
                  <View className="flex-1 bg-gray-50 dark:bg-zinc-800 py-2.5 rounded-xl items-center justify-center flex-row opacity-50">
                    <Shield color={isDark ? '#52525b' : '#9ca3af'} size={13} />
                    <Text className="text-gray-400 dark:text-zinc-600 font-bold text-xs ml-1">No Receipt Yet</Text>
                  </View>
                )}
                {o.escrowState !== 'DELIVERED' && o.escrowState !== 'COMPLETED' && (
                  <TouchableOpacity
                    onPress={() => router.push('/(shared)/evidence-vault')}
                    className="flex-1 bg-red-50 dark:bg-red-900/20 py-2.5 rounded-xl items-center justify-center flex-row border border-red-100 dark:border-red-900/30"
                  >
                    <AlertCircle color="#dc2626" size={13} />
                    <Text className="text-red-600 dark:text-red-400 font-bold text-xs ml-1">Dispute</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
        <View className="h-32" />
      </ScrollView>

      {/* Multi-sig Signing Modal */}
      <Modal transparent visible={!!requestingOrder} animationType="fade">
        <View className="flex-1 bg-black/60 items-center justify-center px-6">
          <View className="bg-white dark:bg-zinc-900 w-full rounded-3xl p-8 items-center border border-gray-200 dark:border-zinc-800">
            <Animated.View style={{ transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] }) }] }} className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full items-center justify-center mb-6">
              <Shield color="#10b981" size={36} />
            </Animated.View>
            <Text className="text-xl font-black text-gray-900 dark:text-zinc-100 text-center mb-2">
              Signing Transaction...
            </Text>
            <Text className="text-sm font-medium text-gray-500 dark:text-zinc-400 text-center">
              Initiating secure platform relayer relocked request for order {requestingOrder}. Please wait.
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}
