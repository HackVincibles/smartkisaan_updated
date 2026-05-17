import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StatusBar,
  Alert, Animated, Modal, Easing
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from 'nativewind';
import {
  ChevronLeft, Shield, Lock, Unlock, CheckCircle2,
  Clock, AlertTriangle, Package, Truck, MapPin,
  Banknote, Star, ChevronRight, ExternalLink, Linking,
  Info, Zap, User
} from 'lucide-react-native';

// ─────────────────────────────────────────────────────────────────────────────
// EscrowStatus — Full escrow state machine visualization
// Connects to:
//   GET  /api/v1/payments/balance/:orderId    → getEscrowBalance
//   GET  /api/v1/payments/history/:orderId    → getPaymentHistory
//   POST /api/v1/disputes/raise               → raiseDispute
//   POST /api/v1/payments/release-escrow      → triggerEscrowRelease (admin)
//   KissanEscrow.sol → orders(orderId) mapping
// ─────────────────────────────────────────────────────────────────────────────

const ESCROW_STAGES = [
  { key: 'BID_PLACED', label: 'Bid Placed', icon: Package, short: 'Bid' },
  { key: 'PENDING_PAYMENT', label: 'Awaiting Payment', icon: Banknote, short: 'Payment' },
  { key: 'PAID_ESCROW', label: 'Funds Locked', icon: Lock, short: 'Locked' },
  { key: 'PICKUP_ASSIGNED', label: 'Transporter Assigned', icon: Truck, short: 'Assigned' },
  { key: 'PICKED_UP', label: 'Picked Up', icon: Package, short: 'Pickup' },
  { key: 'IN_TRANSIT', label: 'In Transit', icon: Truck, short: 'Transit' },
  { key: 'DELIVERED', label: 'Delivered', icon: MapPin, short: 'Delivered' },
  { key: 'COMPLETED', label: 'Settled', icon: CheckCircle2, short: 'Done' },
];

const MOCK_ESCROW = {
  orderId: 'ORD-2025-9042',
  productName: 'Premium Wheat',
  quantity: '500 kg',
  escrowState: 'DELIVERED',     // Change this to test different states
  totalHeld: 24500,
  breakdown: {
    agreedPrice: 22000,
    freightCharge: 1800,
    platformFee: 700,
    totalAmount: 24500,
  },
  settlement: null,             // Filled after COMPLETED
  farmerName: 'Ramesh Kumar',
  buyerName: 'Agro Foods Pvt Ltd',
  contractAddress: '0xKissanEscrow...4d9B',
  aiScore: 88,
  listingAiScore: 91,
  paymentDoneAt: '2025-10-20T09:15:00Z',
  deliveredAt: '2025-10-23T14:30:00Z',
  autoReleaseAt: '2025-10-30T14:30:00Z',   // 7 days after delivery
};

const STATE_COLORS = {
  BID_PLACED:       { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
  PENDING_PAYMENT:  { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
  PAID_ESCROW:      { bg: '#ede9fe', text: '#6d28d9', border: '#c4b5fd' },
  PICKUP_ASSIGNED:  { bg: '#e0f2fe', text: '#0369a1', border: '#7dd3fc' },
  PICKED_UP:        { bg: '#e0f2fe', text: '#0369a1', border: '#7dd3fc' },
  IN_TRANSIT:       { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
  DELIVERED:        { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
  COMPLETED:        { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
  DISPUTED:         { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
  REFUNDED:         { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
};

function StageStep({ stage, status, isDark }) {
  // status: 'done' | 'active' | 'upcoming'
  const colors = {
    done: { icon: '#ffffff', bg: '#10b981', border: '#10b981' },
    active: { icon: '#ffffff', bg: '#7c3aed', border: '#7c3aed' },
    upcoming: { icon: isDark ? '#52525b' : '#d1d5db', bg: isDark ? '#27272a' : '#f9fafb', border: isDark ? '#3f3f46' : '#e5e7eb' },
  };
  const c = colors[status];
  const IIcon = stage.icon;

  return (
    <View className="flex-row items-center">
      <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: c.bg, borderWidth: 2, borderColor: c.border, alignItems: 'center', justifyContent: 'center' }}>
        {status === 'done'
          ? <CheckCircle2 color="#ffffff" size={16} />
          : <IIcon color={c.icon} size={16} />
        }
      </View>
      <View className="ml-3 flex-1">
        <Text className={`text-sm font-black ${status === 'upcoming' ? 'text-gray-400 dark:text-zinc-600' : 'text-gray-900 dark:text-zinc-100'}`}>
          {stage.label}
        </Text>
        {status === 'active' && (
          <Text className="text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase tracking-wider">Current Stage</Text>
        )}
      </View>
      {status === 'done' && <CheckCircle2 color="#10b981" size={16} />}
      {status === 'active' && <Clock color="#7c3aed" size={16} />}
    </View>
  );
}

function CountdownTimer({ targetDate, isDark }) {
  const target = new Date(targetDate);
  const now = new Date();
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return (
    <View className="flex-row items-center">
      <Zap color="#d97706" size={13} />
      <Text className="text-amber-600 dark:text-amber-400 text-xs font-black ml-1">
        Auto-release in {days}d {hours}h
      </Text>
    </View>
  );
}

export default function EscrowStatus() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const params = useLocalSearchParams();
  const [confirmRelease, setConfirmRelease] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const pulseAnim = useRef(new Animated.Value(0)).current;

  // In production: fetch by params.orderId
  const escrow = MOCK_ESCROW;
  const stateColor = STATE_COLORS[escrow.escrowState] || STATE_COLORS['BID_PLACED'];

  const currentStageIndex = ESCROW_STAGES.findIndex((s) => s.key === escrow.escrowState);
  const isDisputed = escrow.escrowState === 'DISPUTED';
  const isCompleted = escrow.escrowState === 'COMPLETED';
  const isDelivered = escrow.escrowState === 'DELIVERED';

  const qualityRatio = escrow.aiScore && escrow.listingAiScore
    ? (escrow.aiScore / escrow.listingAiScore * 100).toFixed(0)
    : null;

  const estimatedFarmerAmount = () => {
    if (!qualityRatio) return escrow.breakdown.agreedPrice;
    const ratio = parseFloat(qualityRatio) / 100;
    if (ratio >= 0.80) return escrow.breakdown.agreedPrice - escrow.breakdown.platformFee;
    if (ratio >= 0.60) {
      const penalty = (0.80 - ratio) / 0.20;
      const refund = Math.round(escrow.breakdown.agreedPrice * penalty * 0.15);
      return escrow.breakdown.agreedPrice - refund - escrow.breakdown.platformFee;
    }
    return 0;
  };

  const handleConfirmDelivery = () => {
    if (requestSent) return;

    Alert.alert(
      'Request Escrow Release',
      'Are you satisfied with the quality received? Requesting release will trigger smart contract multi-sig confirmation.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit Request',
          style: 'default',
          onPress: () => {
            setIsRequesting(true);
            Animated.loop(
              Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 0, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
              ])
            ).start();

            setTimeout(() => {
              setIsRequesting(false);
              setRequestSent(true);
              pulseAnim.stopAnimation();
              Alert.alert('✅ Request Sent', 'Escrow release request initiated. Awaiting smart contract multi-sig confirmation before funds are fully settled.');
            }, 3000);
          }
        }
      ]
    );
  };

  const handleRaiseDispute = () => {
    router.push('/(shared)/evidence-vault');
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950">
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View className="pt-14 pb-4 px-5 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ChevronLeft color={isDark ? '#ffffff' : '#0f172a'} size={24} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xl font-black text-gray-900 dark:text-zinc-100">Escrow Status</Text>
          <Text className="text-xs text-gray-400 dark:text-zinc-500 font-bold">{escrow.orderId}</Text>
        </View>
        <View
          style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : stateColor.bg, borderColor: stateColor.border, borderWidth: 1 }}
          className="px-3 py-1.5 rounded-full"
        >
          <Text style={{ color: stateColor.text }} className="text-[10px] font-black uppercase tracking-wider">
            {escrow.escrowState.replace(/_/g, ' ')}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Hero Lock Card ───────────────────────────────── */}
        <View
          style={{ backgroundColor: isDark ? '#18181b' : '#0a0f1e' }}
          className="mx-4 mt-5 rounded-3xl p-6"
        >
          <View className="flex-row items-center mb-2">
            {isCompleted
              ? <Unlock color="#4ade80" size={20} />
              : isDisputed
                ? <AlertTriangle color="#f87171" size={20} />
                : <Lock color="#a78bfa" size={20} />
            }
            <Text className="text-white font-black text-sm ml-2">
              {isCompleted ? 'Escrow Settled' : isDisputed ? 'Escrow Disputed' : 'Funds Locked in Escrow'}
            </Text>
          </View>
          <Text className="text-white text-4xl font-black tracking-tighter">
            ₹{escrow.totalHeld.toLocaleString('en-IN')}
          </Text>
          <Text className="text-white/40 text-xs font-bold mt-1">
            {escrow.productName} · {escrow.quantity}
          </Text>

          {/* AI Quality Bar */}
          {escrow.aiScore && (
            <View className="mt-5">
              <View className="flex-row justify-between mb-1.5">
                <Text className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Delivery Quality Score</Text>
                <Text className="text-white font-black text-[10px]">{escrow.aiScore}/100</Text>
              </View>
              <View className="h-2 bg-white/10 rounded-full overflow-hidden">
                <View
                  style={{
                    width: `${escrow.aiScore}%`,
                    backgroundColor: escrow.aiScore >= 80 ? '#4ade80' : escrow.aiScore >= 60 ? '#fbbf24' : '#f87171'
                  }}
                  className="h-full rounded-full"
                />
              </View>
              {qualityRatio && (
                <Text className="text-white/40 text-[10px] font-bold mt-1">
                  Quality ratio vs listing: {qualityRatio}%
                  {parseInt(qualityRatio) >= 80 ? ' — Full release' : parseInt(qualityRatio) >= 60 ? ' — Partial release' : ' — Disputed'}
                </Text>
              )}
            </View>
          )}

          {/* Auto-release countdown */}
          {isDelivered && escrow.autoReleaseAt && (
            <View className="mt-4 pt-4 border-t border-white/10">
              <CountdownTimer targetDate={escrow.autoReleaseAt} isDark={isDark} />
              <Text className="text-white/30 text-[10px] font-medium mt-1">
                Funds auto-release if no dispute is raised
              </Text>
            </View>
          )}
        </View>

        {/* ── Payment Breakdown ─────────────────────────────── */}
        <View className="mx-4 mt-4 bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-gray-100 dark:border-zinc-800">
          <Text className="text-[10px] text-gray-400 dark:text-zinc-500 font-black uppercase tracking-wider mb-3">
            Payment Breakdown
          </Text>
          {[
            { label: 'Agreed Price', value: escrow.breakdown.agreedPrice },
            { label: 'Freight Charge', value: escrow.breakdown.freightCharge },
            { label: 'Platform Fee', value: escrow.breakdown.platformFee },
          ].map((row, i) => (
            <View key={i} className="flex-row justify-between items-center py-2 border-b border-gray-50 dark:border-zinc-800">
              <Text className="text-gray-600 dark:text-zinc-400 text-sm font-medium">{row.label}</Text>
              <Text className="text-gray-900 dark:text-zinc-100 font-bold text-sm">₹{row.value.toLocaleString('en-IN')}</Text>
            </View>
          ))}
          <View className="flex-row justify-between items-center pt-3">
            <Text className="text-gray-900 dark:text-zinc-100 font-black text-base">Total Held</Text>
            <Text className="text-gray-900 dark:text-zinc-100 font-black text-lg">₹{escrow.totalHeld.toLocaleString('en-IN')}</Text>
          </View>

          {/* Estimated settlement */}
          {isDelivered && (
            <View className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
              <Text className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-2">Estimated Settlement</Text>
              <View className="flex-row justify-between mb-1">
                <View className="flex-row items-center">
                  <User color={isDark ? '#a1a1aa' : '#6b7280'} size={12} />
                  <Text className="text-gray-600 dark:text-zinc-400 text-xs font-medium ml-1">Farmer receives</Text>
                </View>
                <Text className="text-green-600 font-black text-sm">₹{estimatedFarmerAmount().toLocaleString('en-IN')}</Text>
              </View>
              <View className="flex-row justify-between">
                <View className="flex-row items-center">
                  <Truck color={isDark ? '#a1a1aa' : '#6b7280'} size={12} />
                  <Text className="text-gray-600 dark:text-zinc-400 text-xs font-medium ml-1">Transporter receives</Text>
                </View>
                <Text className="text-blue-600 font-black text-sm">₹{escrow.breakdown.freightCharge.toLocaleString('en-IN')}</Text>
              </View>
            </View>
          )}
        </View>

        {/* ── State Machine Progress ────────────────────────── */}
        <View className="mx-4 mt-4 bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-gray-100 dark:border-zinc-800">
          <Text className="text-[10px] text-gray-400 dark:text-zinc-500 font-black uppercase tracking-wider mb-4">
            Order Journey
          </Text>
          {ESCROW_STAGES.filter((s) => !['DISPUTED', 'REFUNDED'].includes(s.key)).map((stage, idx) => {
            const stageIdx = ESCROW_STAGES.indexOf(stage);
            const status = stageIdx < currentStageIndex ? 'done' : stageIdx === currentStageIndex ? 'active' : 'upcoming';

            return (
              <View key={stage.key}>
                <StageStep stage={stage} status={status} isDark={isDark} />
                {idx < ESCROW_STAGES.filter(s => !['DISPUTED', 'REFUNDED'].includes(s.key)).length - 1 && (
                  <View style={{ width: 2, height: 20, backgroundColor: stageIdx < currentStageIndex ? '#10b981' : (isDark ? '#3f3f46' : '#e5e7eb'), marginLeft: 17, marginVertical: 2 }} />
                )}
              </View>
            );
          })}
        </View>

        {/* ── AI Resolution Rules ──────────────────────────── */}
        <View className="mx-4 mt-4 bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-gray-100 dark:border-zinc-800">
          <View className="flex-row items-center mb-4">
            <Info color={isDark ? '#a1a1aa' : '#6b7280'} size={15} />
            <Text className="text-[10px] text-gray-400 dark:text-zinc-500 font-black uppercase tracking-wider ml-2">
              AI Resolution Rules
            </Text>
          </View>
          {[
            { range: 'Quality Drop < 5%', verdict: 'Full Release', color: '#059669', bg: '#d1fae5' },
            { range: 'Quality Drop 5–40%', verdict: 'Partial Refund', color: '#d97706', bg: '#fef3c7' },
            { range: 'Quality Drop > 40%', verdict: 'Full Refund', color: '#dc2626', bg: '#fee2e2' },
          ].map((rule, i) => (
            <View key={i} className="flex-row items-center justify-between py-2.5 border-b border-gray-50 dark:border-zinc-800">
              <Text className="text-gray-600 dark:text-zinc-400 text-xs font-medium flex-1">{rule.range}</Text>
              <View style={{ backgroundColor: rule.bg }} className="px-2 py-1 rounded-full ml-2">
                <Text style={{ color: rule.color }} className="text-[10px] font-black">{rule.verdict}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Parties ──────────────────────────────────────── */}
        <View className="mx-4 mt-4 bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-gray-100 dark:border-zinc-800">
          <Text className="text-[10px] text-gray-400 dark:text-zinc-500 font-black uppercase tracking-wider mb-3">
            Parties
          </Text>
          <View className="flex-row items-center py-2 border-b border-gray-50 dark:border-zinc-800">
            <Shield color="#10b981" size={14} />
            <Text className="text-gray-600 dark:text-zinc-400 text-sm ml-2">Farmer:</Text>
            <Text className="text-gray-900 dark:text-zinc-100 font-bold text-sm ml-2">{escrow.farmerName}</Text>
          </View>
          <View className="flex-row items-center py-2">
            <Package color="#2563eb" size={14} />
            <Text className="text-gray-600 dark:text-zinc-400 text-sm ml-2">Buyer:</Text>
            <Text className="text-gray-900 dark:text-zinc-100 font-bold text-sm ml-2">{escrow.buyerName}</Text>
          </View>
        </View>

        {/* ── Smart Contract ────────────────────────────────── */}
        <View className="mx-4 mt-4 bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-gray-100 dark:border-zinc-800">
          <Text className="text-[10px] text-gray-400 dark:text-zinc-500 font-black uppercase tracking-wider mb-3">
            Smart Contract
          </Text>
          <View className="bg-gray-50 dark:bg-zinc-800 rounded-2xl p-3 mb-3">
            <Text className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-1">KissanEscrow.sol · Polygon Amoy</Text>
            <Text className="text-xs font-mono text-gray-700 dark:text-zinc-300" numberOfLines={1} ellipsizeMode="middle">
              {escrow.contractAddress}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => Alert.alert('PolygonScan', 'Opening Polygon Amoy explorer...')}
            className="flex-row items-center justify-center bg-purple-50 dark:bg-purple-900/30 h-11 rounded-2xl border border-purple-200 dark:border-purple-700"
          >
            <ExternalLink color="#7c3aed" size={14} />
            <Text className="text-purple-700 dark:text-purple-400 font-black text-sm ml-2">View Contract on PolygonScan</Text>
          </TouchableOpacity>
        </View>

        {/* ── Action Buttons ────────────────────────────────── */}
        {isDelivered && (
          <View className="mx-4 mt-4 mb-8">
            <TouchableOpacity
              onPress={handleConfirmDelivery}
              disabled={requestSent}
              className={`h-14 rounded-2xl flex-row items-center justify-center mb-3 ${requestSent ? 'bg-gray-400 dark:bg-zinc-700' : 'bg-emerald-600'}`}
            >
              {requestSent ? <Clock color="#ffffff" size={18} /> : <Unlock color="#ffffff" size={18} />}
              <Text className="text-white font-black text-base ml-2">
                {requestSent ? 'Request Pending' : 'Request Escrow Release'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleRaiseDispute}
              className="bg-red-50 dark:bg-red-900/20 h-12 rounded-2xl flex-row items-center justify-center border border-red-200 dark:border-red-800"
            >
              <AlertTriangle color="#dc2626" size={16} />
              <Text className="text-red-600 dark:text-red-400 font-black text-sm ml-2">Raise Dispute with Evidence</Text>
            </TouchableOpacity>
          </View>
        )}

        {isCompleted && (
          <View className="mx-4 mt-4 mb-8">
            <TouchableOpacity
              onPress={() => router.push('/(shared)/blockchain-receipt')}
              className="bg-gray-900 dark:bg-zinc-100 h-14 rounded-2xl flex-row items-center justify-center"
            >
              <Shield color={isDark ? '#18181b' : '#ffffff'} size={18} />
              <Text className="text-white dark:text-zinc-900 font-black text-base ml-2">View Trust Receipt</Text>
            </TouchableOpacity>
          </View>
        )}

        {!isDelivered && !isCompleted && <View className="h-8" />}
      </ScrollView>

      {/* Multi-sig Signing Modal */}
      <Modal transparent visible={isRequesting} animationType="fade">
        <View className="flex-1 bg-black/60 items-center justify-center px-6">
          <View className="bg-white dark:bg-zinc-900 w-full rounded-3xl p-8 items-center border border-gray-200 dark:border-zinc-800">
            <Animated.View style={{ transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] }) }] }} className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full items-center justify-center mb-6">
              <Shield color="#10b981" size={36} />
            </Animated.View>
            <Text className="text-xl font-black text-gray-900 dark:text-zinc-100 text-center mb-2">
              Signing Transaction...
            </Text>
            <Text className="text-sm font-medium text-gray-500 dark:text-zinc-400 text-center">
              Initiating secure multi-sig request for escrow release via smart contract. Please wait.
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}
