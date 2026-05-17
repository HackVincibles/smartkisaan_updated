import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StatusBar,
  Linking, Alert, Modal, Pressable
} from 'react-native';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import {
  ChevronLeft, Star, Shield, Award, Zap, TrendingUp,
  ExternalLink, Info, CheckCircle2, Lock, Package
} from 'lucide-react-native';

// ─────────────────────────────────────────────────────────────────────────────
// SBT Badges Screen — Soulbound Token reputation badges for farmers
// Connects to: FarmerReputation.sol · getFarmerBadges() · blockchain.service.js
// Badges minted by backend after trust milestones are hit (trust.worker.js)
// ─────────────────────────────────────────────────────────────────────────────

const BADGES = [
  {
    id: 'trusted_farmer',
    name: 'Trusted Farmer',
    description: 'Complete 10 successful deliveries with no disputes',
    icon: Shield,
    gradient: ['#065f46', '#10b981'],
    iconColor: '#4ade80',
    bgColor: '#d1fae5',
    darkBg: 'rgba(16,185,129,0.15)',
    borderColor: '#6ee7b7',
    darkBorder: '#065f46',
    earned: true,
    tokenId: '#SBT-0042',
    mintedAt: '2025-09-14',
    txHash: '0xa3f8...b3c4',
    criterion: 'deliveries',
    progress: 14,
    goal: 10,
    rarity: 'Common',
    badgeURI: 'ipfs://QmTrustedFarmer...',
  },
  {
    id: 'quality_champion',
    name: 'Quality Champion',
    description: 'Maintain an average buyer rating above 4.5 stars',
    icon: Star,
    gradient: ['#78350f', '#f59e0b'],
    iconColor: '#fbbf24',
    bgColor: '#fef3c7',
    darkBg: 'rgba(245,158,11,0.15)',
    borderColor: '#fcd34d',
    darkBorder: '#78350f',
    earned: true,
    tokenId: '#SBT-0107',
    mintedAt: '2025-10-01',
    txHash: '0xd7e2...a1f5',
    criterion: 'rating',
    progress: 4.8,
    goal: 4.5,
    rarity: 'Rare',
    badgeURI: 'ipfs://QmQualityChampion...',
  },
  {
    id: 'consistent_supplier',
    name: 'Consistent Supplier',
    description: 'Complete 50 orders without raising any disputes',
    icon: TrendingUp,
    gradient: ['#1e3a8a', '#3b82f6'],
    iconColor: '#93c5fd',
    bgColor: '#dbeafe',
    darkBg: 'rgba(59,130,246,0.15)',
    borderColor: '#93c5fd',
    darkBorder: '#1e3a8a',
    earned: false,
    tokenId: null,
    mintedAt: null,
    txHash: null,
    criterion: 'orders',
    progress: 34,
    goal: 50,
    rarity: 'Epic',
    badgeURI: null,
  },
  {
    id: 'speed_delivery',
    name: 'Lightning Delivery',
    description: 'Achieve on-time delivery rate above 95% over 20 orders',
    icon: Zap,
    gradient: ['#4c1d95', '#8b5cf6'],
    iconColor: '#c4b5fd',
    bgColor: '#ede9fe',
    darkBg: 'rgba(139,92,246,0.15)',
    borderColor: '#c4b5fd',
    darkBorder: '#4c1d95',
    earned: false,
    tokenId: null,
    mintedAt: null,
    txHash: null,
    criterion: 'ontime',
    progress: 11,
    goal: 20,
    rarity: 'Legendary',
    badgeURI: null,
  },
];

const RARITY_COLORS = {
  Common: { text: '#059669', bg: '#d1fae5' },
  Rare: { text: '#d97706', bg: '#fef3c7' },
  Epic: { text: '#2563eb', bg: '#dbeafe' },
  Legendary: { text: '#7c3aed', bg: '#ede9fe' },
};

function BadgeDetailModal({ badge, onClose, isDark }) {
  if (!badge) return null;
  const rarityStyle = RARITY_COLORS[badge.rarity];

  return (
    <Modal visible={!!badge} transparent animationType="slide">
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}
        onPress={onClose}
      >
        <Pressable onPress={() => {}}>
          <View
            style={{ backgroundColor: isDark ? '#18181b' : '#ffffff', borderTopLeftRadius: 32, borderTopRightRadius: 32 }}
            className="p-6"
          >
            {/* Badge Icon */}
            <View className="items-center mb-5">
              <View
                style={{
                  width: 80, height: 80, borderRadius: 40,
                  backgroundColor: isDark ? badge.darkBg : badge.bgColor,
                  borderWidth: 2, borderColor: isDark ? badge.darkBorder : badge.borderColor,
                  alignItems: 'center', justifyContent: 'center', marginBottom: 12,
                }}
              >
                <badge.icon color={badge.iconColor} size={36} />
              </View>
              <Text className="text-2xl font-black text-gray-900 dark:text-zinc-100">{badge.name}</Text>
              <View style={{ backgroundColor: rarityStyle.bg }} className="px-3 py-1 rounded-full mt-2">
                <Text style={{ color: rarityStyle.text }} className="text-[10px] font-black uppercase tracking-wider">
                  {badge.rarity} · Soulbound Token
                </Text>
              </View>
            </View>

            <Text className="text-gray-600 dark:text-zinc-400 text-sm text-center mb-5 font-medium">
              {badge.description}
            </Text>

            {badge.earned ? (
              <>
                <View className="bg-gray-50 dark:bg-zinc-800 rounded-2xl p-4 mb-4">
                  <View className="flex-row justify-between mb-3">
                    <Text className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Token ID</Text>
                    <Text className="text-gray-900 dark:text-zinc-100 font-black text-xs">{badge.tokenId}</Text>
                  </View>
                  <View className="flex-row justify-between mb-3">
                    <Text className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Minted On</Text>
                    <Text className="text-gray-900 dark:text-zinc-100 font-black text-xs">{badge.mintedAt}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-[10px] text-gray-400 font-black uppercase tracking-wider">TX Hash</Text>
                    <Text className="text-gray-900 dark:text-zinc-100 font-black text-xs font-mono">{badge.txHash}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => Linking.openURL(`https://amoy.polygonscan.com/tx/${badge.txHash}`)}
                  className="flex-row items-center justify-center bg-purple-50 dark:bg-purple-900/30 h-13 rounded-2xl border border-purple-200 dark:border-purple-700 mb-3"
                  style={{ height: 52 }}
                >
                  <ExternalLink color="#7c3aed" size={15} />
                  <Text className="text-purple-700 dark:text-purple-400 font-black text-sm ml-2">View on PolygonScan</Text>
                </TouchableOpacity>

                <View className="flex-row items-center justify-center">
                  <Lock color={isDark ? '#52525b' : '#9ca3af'} size={13} />
                  <Text className="text-gray-400 dark:text-zinc-500 text-xs ml-2 font-medium">
                    Soulbound — non-transferable, forever yours
                  </Text>
                </View>
              </>
            ) : (
              <View>
                <View className="bg-gray-50 dark:bg-zinc-800 rounded-2xl p-4 mb-4">
                  <Text className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-3">Your Progress</Text>
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-700 dark:text-zinc-300 text-sm font-bold">
                      {badge.criterion === 'rating' ? `${badge.progress} stars` : `${badge.progress} / ${badge.goal}`}
                    </Text>
                    <Text className="text-gray-400 text-xs font-bold">
                      {badge.criterion === 'rating' ? `Need ${badge.goal}+` : `${badge.goal} required`}
                    </Text>
                  </View>
                  <View className="h-3 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <View
                      style={{
                        width: `${Math.min(100, (badge.progress / badge.goal) * 100)}%`,
                        backgroundColor: badge.iconColor,
                      }}
                      className="h-full rounded-full"
                    />
                  </View>
                </View>
                <View className="flex-row items-center justify-center bg-gray-100 dark:bg-zinc-800 h-12 rounded-2xl">
                  <Lock color={isDark ? '#52525b' : '#9ca3af'} size={14} />
                  <Text className="text-gray-400 dark:text-zinc-500 font-bold text-sm ml-2">Not yet earned</Text>
                </View>
              </View>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function SBTBadgesScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selectedBadge, setSelectedBadge] = useState(null);

  const earnedCount = BADGES.filter((b) => b.earned).length;

  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950">
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View className="pt-14 pb-4 px-5 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ChevronLeft color={isDark ? '#ffffff' : '#0f172a'} size={24} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xl font-black text-gray-900 dark:text-zinc-100">On-Chain Badges</Text>
          <Text className="text-xs text-gray-400 dark:text-zinc-500 font-bold">Soulbound Tokens · Polygon Amoy</Text>
        </View>
        <TouchableOpacity onPress={() => Alert.alert('What are SBTs?', 'Soulbound Tokens (SBTs) are non-transferable blockchain badges that prove your reputation. They cannot be sold or moved — they are permanently bound to your wallet.')}>
          <Info color={isDark ? '#52525b' : '#9ca3af'} size={22} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Hero Stats ───────────────────────────────────── */}
        <View
          style={{ backgroundColor: isDark ? '#18181b' : '#0a0f1e' }}
          className="mx-4 mt-5 rounded-3xl p-6"
        >
          <View className="flex-row items-center mb-4">
            <Award color="#fbbf24" size={20} />
            <Text className="text-white font-black text-base ml-2">Your Reputation</Text>
          </View>
          <View className="flex-row">
            <View className="flex-1">
              <Text className="text-white text-4xl font-black">{earnedCount}</Text>
              <Text className="text-white/50 text-xs font-bold uppercase tracking-wider mt-1">Badges Earned</Text>
            </View>
            <View className="flex-1">
              <Text className="text-white text-4xl font-black">{BADGES.length}</Text>
              <Text className="text-white/50 text-xs font-bold uppercase tracking-wider mt-1">Total Available</Text>
            </View>
            <View className="flex-1">
              <Text className="text-[#4ade80] text-4xl font-black">92</Text>
              <Text className="text-white/50 text-xs font-bold uppercase tracking-wider mt-1">Trust Score</Text>
            </View>
          </View>
          <View className="mt-4 pt-4 border-t border-white/10 flex-row items-center">
            <Shield color="#4ade80" size={13} />
            <Text className="text-white/50 text-[10px] font-bold ml-2 uppercase tracking-wider">
              Verified on Polygon Amoy Testnet · Chain ID 80002
            </Text>
          </View>
        </View>

        {/* ── What are SBTs ─────────────────────────────────── */}
        <View className="mx-4 mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 flex-row items-start border border-blue-200 dark:border-blue-800">
          <Info color="#2563eb" size={16} style={{ marginTop: 1 }} />
          <Text className="text-blue-700 dark:text-blue-400 text-xs font-medium ml-2 flex-1 leading-5">
            <Text className="font-black">Soulbound Tokens</Text> are non-transferable NFTs permanently linked to your wallet — proving your track record on-chain without trusting any central authority.
          </Text>
        </View>

        {/* ── Badge Grid ───────────────────────────────────── */}
        <Text className="text-[10px] text-gray-400 dark:text-zinc-500 font-black uppercase tracking-wider mx-4 mt-6 mb-3">
          Your Badge Collection
        </Text>

        <View className="flex-row flex-wrap px-4 gap-3">
          {BADGES.map((badge) => {
            const rarityStyle = RARITY_COLORS[badge.rarity];
            const progressPct = Math.min(100, Math.round((badge.progress / badge.goal) * 100));

            return (
              <TouchableOpacity
                key={badge.id}
                onPress={() => setSelectedBadge(badge)}
                style={{ width: '47%', opacity: badge.earned ? 1 : 0.7 }}
                className={`bg-white dark:bg-zinc-900 rounded-3xl p-5 border ${
                  badge.earned
                    ? 'border-gray-100 dark:border-zinc-700'
                    : 'border-dashed border-gray-200 dark:border-zinc-700'
                }`}
              >
                {/* Badge icon */}
                <View
                  style={{
                    width: 56, height: 56, borderRadius: 28,
                    backgroundColor: isDark ? badge.darkBg : badge.bgColor,
                    borderWidth: badge.earned ? 2 : 1,
                    borderColor: isDark ? badge.darkBorder : badge.borderColor,
                    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
                    position: 'relative',
                  }}
                >
                  <badge.icon color={badge.earned ? badge.iconColor : (isDark ? '#52525b' : '#d1d5db')} size={24} />
                  {badge.earned && (
                    <View className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full items-center justify-center">
                      <CheckCircle2 color="#fff" size={12} />
                    </View>
                  )}
                </View>

                <Text className="text-gray-900 dark:text-zinc-100 font-black text-sm mb-1">{badge.name}</Text>
                <View style={{ backgroundColor: rarityStyle.bg }} className="px-2 py-0.5 rounded-full self-start mb-3">
                  <Text style={{ color: rarityStyle.text }} className="text-[9px] font-black uppercase tracking-wider">
                    {badge.rarity}
                  </Text>
                </View>

                {/* Progress bar */}
                {!badge.earned && (
                  <View>
                    <View className="flex-row justify-between mb-1">
                      <Text className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold">{progressPct}%</Text>
                    </View>
                    <View className="h-1.5 bg-gray-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                      <View
                        style={{ width: `${progressPct}%`, backgroundColor: badge.iconColor }}
                        className="h-full rounded-full"
                      />
                    </View>
                  </View>
                )}

                {badge.earned && (
                  <View className="flex-row items-center">
                    <Package color={isDark ? '#52525b' : '#9ca3af'} size={11} />
                    <Text className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold ml-1">{badge.tokenId}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── How to Earn ───────────────────────────────────── */}
        <View className="mx-4 mt-6 bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-gray-100 dark:border-zinc-800 mb-8">
          <Text className="text-[10px] text-gray-400 dark:text-zinc-500 font-black uppercase tracking-wider mb-4">
            How to Earn Badges
          </Text>
          {[
            { icon: Shield, label: 'Trusted Farmer', desc: 'Complete 10 successful deliveries' },
            { icon: Star, label: 'Quality Champion', desc: 'Maintain avg rating above 4.5 ★' },
            { icon: TrendingUp, label: 'Consistent Supplier', desc: '50 orders with no disputes' },
            { icon: Zap, label: 'Lightning Delivery', desc: '95%+ on-time rate over 20 orders' },
          ].map((item, i) => (
            <View
              key={i}
              className={`flex-row items-center py-3 ${i !== 3 ? 'border-b border-gray-100 dark:border-zinc-800' : ''}`}
            >
              <item.icon color={isDark ? '#a1a1aa' : '#6b7280'} size={16} />
              <View className="ml-3">
                <Text className="text-gray-900 dark:text-zinc-100 font-bold text-sm">{item.label}</Text>
                <Text className="text-gray-500 dark:text-zinc-400 text-xs font-medium">{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View className="h-32" />
      </ScrollView>

      <BadgeDetailModal badge={selectedBadge} onClose={() => setSelectedBadge(null)} isDark={isDark} />
    </View>
  );
}
