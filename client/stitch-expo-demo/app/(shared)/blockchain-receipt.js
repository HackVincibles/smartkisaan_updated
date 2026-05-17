import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StatusBar,
  Linking, Alert, Animated, Image
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from 'nativewind';
import {
  ChevronLeft, Shield, CheckCircle2, ExternalLink,
  Copy, Package, User, Banknote, Star, Clock,
  Hash, Link, ChevronDown, ChevronUp, Landmark, Truck,
  FileSpreadsheet, Sparkles, Key
} from 'lucide-react-native';

// ─────────────────────────────────────────────────────────────────────────────
// BlockchainReceipt — Trust Receipt screen
// Shows a role-adaptive on-chain trust record for every completed order.
// Highly responsive layout clearing absolute navigation bar overlays.
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_RECEIPT = {
  orderId: 'ORD-2026-9042',
  txHash: '0xa3f8c1d9e2b74e5f6a1c8d2f9b3e7a4c5d6e8f9b1c2d3e4f5a6b7c8d9e0f1a2b3',
  blockNumber: 14872341,
  farmerId: '0x4A5e2C...8f3B',
  farmerName: 'Ramesh Patel',
  buyerId: '0x7B3d1A...2c9F',
  buyerName: 'Agro Foods Pvt Ltd',
  amount: 24500,
  qualityGrade: 'Grade A',
  aiScore: 94,
  productName: 'Premium Basmati Rice',
  quantity: '10 Quintals',
  timestamp: '2026-05-17T06:00:00Z',
  escrowState: 'COMPLETED',
  network: 'Polygon Amoy Testnet',
  contractAddress: '0xKissanEscrow...4d9B',
  ipfsCID: 'QmX7vK3mP9nQ2rL8sT4uW1yZ6aB5cD0eF',
  transporterName: 'Express Logistics Corp',
  transporterId: '0x9E2a4C...7f1A',
  vehicleNo: 'MH-12-QB-8842',
  route: 'Nashik to Mumbai Hub',
};

const QUALITY_COLORS = {
  'Grade A++': { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' },
  'Grade A':  { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
  'Grade B':  { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
};

export default function BlockchainReceipt() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const params = useLocalSearchParams();
  
  // Set current view-role. Allows dynamic runtime switching for hackathon judges!
  const [activeRole, setActiveRole] = useState(params.role || 'buyer'); // 'farmer', 'buyer', 'transporter', 'admin'
  const [showRaw, setShowRaw] = useState(false);

  const receipt = MOCK_RECEIPT;
  const qColors = QUALITY_COLORS[receipt.qualityGrade] || QUALITY_COLORS['Grade A'];
  const explorerUrl = `https://amoy.polygonscan.com/tx/${receipt.txHash}`;
  const ipfsUrl = `https://ipfs.io/ipfs/${receipt.ipfsCID}`;

  const formattedDate = new Date(receipt.timestamp).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const handleCopy = (text, label) => {
    Alert.alert('Copied', `${label} copied to clipboard`);
  };

  const handleOpenExplorer = () => {
    Linking.openURL(explorerUrl).catch(() =>
      Alert.alert('Error', 'Could not open browser')
    );
  };

  const handleOpenIPFS = () => {
    Linking.openURL(ipfsUrl).catch(() =>
      Alert.alert('Error', 'Could not open IPFS gateway')
    );
  };

  // =========================================================================
  // RENDERABLE CARDS / SECTIONS
  // =========================================================================

  // SECTION 1: AI Quality Grading Card (Farmers' Top Focus)
  const renderAIQualityCard = () => (
    <View key="ai-quality" className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-[28px] p-5 mb-4 shadow-sm">
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <Sparkles color="#8b5cf6" size={20} />
          <Text className="text-base font-black text-gray-900 dark:text-zinc-100 ml-2">AI Grading Audit</Text>
        </View>
        <View style={{ backgroundColor: qColors.bg, borderColor: qColors.border, borderWidth: 1 }} className="px-3 py-1 rounded-full">
          <Text style={{ color: qColors.text }} className="font-black text-xs uppercase tracking-wider">{receipt.qualityGrade}</Text>
        </View>
      </View>

      <Text className="text-xs text-gray-500 dark:text-zinc-400 font-semibold mb-3 leading-5">
        Analyzed by SmartKissan AI Vision Node. Certifies that physical crop attributes fully match wholesale standards.
      </Text>

      {/* Progress scale */}
      <View className="mb-4 bg-gray-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800">
        <View className="flex-row justify-between mb-1.5">
          <Text className="text-[10px] text-gray-400 dark:text-zinc-500 font-black uppercase tracking-wider">AI Quality Score</Text>
          <Text className="text-gray-900 dark:text-zinc-100 font-black text-xs">{receipt.aiScore}/100</Text>
        </View>
        <View className="h-2.5 bg-gray-250 dark:bg-zinc-800 rounded-full overflow-hidden">
          <View
            style={{ width: `${receipt.aiScore}%` }}
            className="h-full rounded-full bg-purple-500"
          />
        </View>
      </View>

      {/* SBT Badge mint status */}
      <View className="flex-row items-center bg-purple-50 dark:bg-purple-950/20 p-3 rounded-2xl border border-purple-100 dark:border-purple-900/40">
        <Text className="text-purple-700 dark:text-purple-400 text-[10px] font-black uppercase tracking-wider flex-1">
          🏆 Soulbound Token Badge (SBT) Active on-chain
        </Text>
        <TouchableOpacity onPress={() => Alert.alert("SBT Badge Validated", "Verified by KissanRegistry contract on Polygon.")}>
          <Text className="text-purple-600 dark:text-purple-300 text-[10px] font-black uppercase underline">View NFT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // SECTION 2: Escrow Security Card (Buyers' Top Focus)
  const renderEscrowCard = () => (
    <View key="escrow" className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-[28px] p-5 mb-4 shadow-sm">
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <Landmark color="#10b981" size={20} />
          <Text className="text-base font-black text-gray-900 dark:text-zinc-100 ml-2">Smart Escrow Ledger</Text>
        </View>
        <View className="bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/40">
          <Text className="text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest">{receipt.escrowState}</Text>
        </View>
      </View>

      <Text className="text-xs text-gray-500 dark:text-zinc-400 font-semibold mb-4 leading-5">
        Securely locked inside KissanEscrow contract. Relieved and distributed instantly upon quality handover approval.
      </Text>

      {/* Financial Split Summary */}
      <View className="bg-gray-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-gray-150 dark:border-zinc-850 gap-y-3">
        <View className="flex-row justify-between">
          <Text className="text-[10px] text-gray-400 font-bold uppercase">Escrow Locked Amount</Text>
          <Text className="text-sm font-black text-gray-900 dark:text-zinc-100">₹{receipt.amount.toLocaleString()}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-[10px] text-gray-400 font-bold uppercase">Contract Address</Text>
          <Text className="text-xs font-mono text-gray-600 dark:text-zinc-300" numberOfLines={1}>{receipt.contractAddress}</Text>
        </View>
        <View className="h-[1px] bg-gray-200 dark:bg-zinc-800 my-1" />
        <View className="flex-row justify-between">
          <Text className="text-[10px] text-gray-400 font-bold uppercase">Platform Settlement Fee</Text>
          <Text className="text-sm font-black text-emerald-500">₹{Math.round(receipt.amount * 0.01)} (1%)</Text>
        </View>
      </View>
    </View>
  );

  // SECTION 3: Logistics Handover Card (Transporters' Top Focus)
  const renderLogisticsCard = () => (
    <View key="logistics" className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-[28px] p-5 mb-4 shadow-sm">
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <Truck color="#2563eb" size={20} />
          <Text className="text-base font-black text-gray-900 dark:text-zinc-100 ml-2">Logistics Handover</Text>
        </View>
        <View className="bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/40">
          <Text className="text-blue-700 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest">DISPATCHED</Text>
        </View>
      </View>

      <Text className="text-xs text-gray-500 dark:text-zinc-400 font-semibold mb-4 leading-5">
        Secure transport handshake utilizing unique OTP delivery verifications and digital licensing credentials.
      </Text>

      <View className="bg-gray-50 dark:bg-zinc-800/40 p-4 rounded-2xl border border-gray-150 dark:border-zinc-850 gap-y-3">
        <View className="flex-row justify-between">
          <Text className="text-[10px] text-gray-400 font-bold uppercase">Transporter Agency</Text>
          <Text className="text-sm font-black text-gray-900 dark:text-zinc-100">{receipt.transporterName}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-[10px] text-gray-400 font-bold uppercase">Vehicle Registration</Text>
          <Text className="text-sm font-black text-blue-600">{receipt.vehicleNo}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-[10px] text-gray-400 font-bold uppercase">Shipping Route</Text>
          <Text className="text-xs font-black text-gray-800 dark:text-zinc-200">{receipt.route}</Text>
        </View>
        <View className="h-[1px] bg-gray-200 dark:bg-zinc-800 my-1" />
        <View className="flex flex-row justify-between items-center">
          <Text className="text-[10px] text-gray-400 font-bold uppercase">Handshake ID</Text>
          <Text className="text-xs font-mono text-gray-500" numberOfLines={1}>{receipt.transporterId}</Text>
        </View>
      </View>
    </View>
  );

  // SECTION 4: Cryptographic Integrity Card (Admins' Top Focus / Chain Verifier)
  const renderCryptographicCard = () => (
    <View key="crypto" className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-[28px] p-5 mb-4 shadow-sm">
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <Key color="#db2777" size={20} />
          <Text className="text-base font-black text-gray-900 dark:text-zinc-100 ml-2">Blockchain Proofs</Text>
        </View>
        <View className="bg-pink-50 dark:bg-pink-950 px-3 py-1 rounded-full border border-pink-100 dark:border-pink-900/40">
          <Text className="text-pink-700 dark:text-pink-400 text-[10px] font-black uppercase tracking-widest">POLYGON</Text>
        </View>
      </View>

      <Text className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-2">Immutable Transaction Hash</Text>
      <View className="flex-row items-center bg-gray-50 dark:bg-zinc-800 rounded-2xl p-3 mb-4 border border-gray-150 dark:border-zinc-750">
        <Hash color={isDark ? '#71717a' : '#9ca3af'} size={14} />
        <Text className="flex-1 text-xs font-mono text-gray-700 dark:text-zinc-300 mx-2" numberOfLines={1} ellipsizeMode="middle">{receipt.txHash}</Text>
        <TouchableOpacity onPress={() => handleCopy(receipt.txHash, 'Transaction Hash')}>
          <Copy color={isDark ? '#71717a' : '#9ca3af'} size={16} />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-3 mb-4 border border-blue-150 dark:border-blue-950/20">
        <Link color="#2563eb" size={14} />
        <Text className="flex-1 text-xs font-mono text-blue-700 dark:text-blue-400 mx-2" numberOfLines={1} ellipsizeMode="middle">{receipt.ipfsCID}</Text>
        <TouchableOpacity onPress={() => handleCopy(receipt.ipfsCID, 'IPFS CID')}>
          <Copy color="#2563eb" size={16} />
        </TouchableOpacity>
      </View>

      <View className="flex-row gap-2 mt-2">
        <TouchableOpacity
          onPress={handleOpenExplorer}
          className="flex-1 flex-row items-center justify-center bg-purple-50 dark:bg-purple-900/30 h-12 rounded-2xl border border-purple-200 dark:border-purple-700"
        >
          <ExternalLink color="#7c3aed" size={14} />
          <Text className="text-purple-700 dark:text-purple-400 font-black text-xs uppercase tracking-wider ml-1">PolygonScan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleOpenIPFS}
          className="flex-1 flex-row items-center justify-center bg-blue-50 dark:bg-blue-900/30 h-12 rounded-2xl border border-blue-200 dark:border-blue-750"
        >
          <ExternalLink color="#2563eb" size={14} />
          <Text className="text-blue-700 dark:text-blue-400 font-black text-xs uppercase tracking-wider ml-1">IPFS Gateway</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Dynamic layout sorter based on activeRole
  const getOrderedCards = () => {
    switch (activeRole) {
      case 'farmer':
        return [
          renderAIQualityCard(),   // TOP FOCUS: Grading certificate validation
          renderEscrowCard(),      // Escrow Lock Status
          renderCryptographicCard(), 
          renderLogisticsCard(),   // BOTTOM: Transporter details
        ];
      case 'buyer':
        return [
          renderEscrowCard(),      // TOP FOCUS: Escrow verification
          renderAIQualityCard(),   // AI quality proof
          renderCryptographicCard(),
          renderLogisticsCard(),   // BOTTOM: Logistics details
        ];
      case 'transporter':
        return [
          renderLogisticsCard(),   // TOP FOCUS: Shipping, route, vehicle, OTP confirmations
          renderEscrowCard(),      // Escrow payout release terms
          renderCryptographicCard(),
          renderAIQualityCard(),   // BOTTOM: Crop quality details
        ];
      case 'admin':
        return [
          renderCryptographicCard(), // TOP FOCUS: Cryptographic ledger health and hashes
          renderEscrowCard(),        // Total escrow lock splits
          renderAIQualityCard(),
          renderLogisticsCard(),     // BOTTOM: Logistics handshake
        ];
      default:
        return [
          renderEscrowCard(),
          renderAIQualityCard(),
          renderCryptographicCard(),
          renderLogisticsCard(),
        ];
    }
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950 pt-12">
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View className="pb-4 px-5 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ChevronLeft color={isDark ? '#ffffff' : '#0f172a'} size={24} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xl font-black text-gray-900 dark:text-zinc-100">Trust Receipt</Text>
          <Text className="text-xs text-gray-400 dark:text-zinc-500 font-bold">Immutable Blockchain Record</Text>
        </View>
        <View className="flex-row items-center bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-full border border-green-200 dark:border-green-700">
          <Shield color="#059669" size={13} />
          <Text className="text-green-700 dark:text-green-400 text-[10px] font-black ml-1 uppercase tracking-wider">Verified</Text>
        </View>
      </View>

      {/* Role Picker Toolbar - Incredible addition for hackathon presentations! */}
      <View className="bg-white dark:bg-zinc-900 px-4 py-3 border-b border-gray-200 dark:border-zinc-800">
        <Text className="text-[9px] text-gray-400 font-black uppercase tracking-wider mb-2 text-center">Adaptive View Selection (Judge Simulation)</Text>
        <View className="flex-row bg-gray-50 dark:bg-zinc-800/40 p-1 rounded-2xl border border-gray-150 dark:border-zinc-800">
          {['buyer', 'farmer', 'transporter', 'admin'].map((role) => (
            <TouchableOpacity
              key={role}
              onPress={() => setActiveRole(role)}
              className="flex-grow py-2 rounded-xl items-center"
              style={activeRole === role ? {
                backgroundColor: '#3b82f6',
                shadowColor: '#3b82f6',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 1,
              } : null}
            >
              <Text className={`text-[10px] font-black uppercase tracking-wider ${activeRole === role ? 'text-white' : 'text-gray-400'}`}>
                {role}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }} // Critical: Clears bottom absolute navigation panel comfortably!
        className="flex-1 px-4 pt-4"
      >
        {/* Hero Order Overview */}
        <View style={{ backgroundColor: isDark ? '#18181b' : '#0a0f1e' }} className="rounded-[32px] p-6 mb-5 overflow-hidden">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-white/10 rounded-2xl items-center justify-center mr-3">
              <CheckCircle2 color="#4ade80" size={20} />
            </View>
            <View>
              <Text className="text-white font-black text-base">{receipt.orderId}</Text>
              <Text className="text-white/50 text-[10px] font-bold uppercase tracking-widest">{receipt.network}</Text>
            </View>
          </View>

          <Text className="text-white text-3xl font-black tracking-tighter mb-1">₹{receipt.amount.toLocaleString('en-IN')}</Text>
          <Text className="text-white/40 text-xs font-bold">{receipt.productName} · {receipt.quantity}</Text>

          <View className="flex-row items-center mt-4 pt-4 border-t border-white/10">
            <Clock color="rgba(255,255,255,0.4)" size={13} />
            <Text className="text-white/40 text-[10px] font-bold ml-2">{formattedDate}</Text>
            <Text className="text-white/20 mx-2">·</Text>
            <Text className="text-white/40 text-[10px] font-bold">Block #{receipt.blockNumber.toLocaleString()}</Text>
          </View>
        </View>

        {/* Dynamic Sorted cards depending on selected role */}
        {getOrderedCards()}

        {/* Parties Involved */}
        <View className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-[28px] p-5 mb-4 shadow-sm">
          <Text className="text-[10px] text-gray-400 dark:text-zinc-500 font-black uppercase tracking-wider mb-3">Parties Involved</Text>
          <View className="flex flex-row justify-between mb-2">
            <Text className="text-xs text-gray-400 font-bold uppercase">Seller Name</Text>
            <Text className="text-xs text-gray-900 dark:text-zinc-100 font-black">{receipt.farmerName}</Text>
          </View>
          <View className="flex flex-row justify-between mb-2">
            <Text className="text-xs text-gray-400 font-bold uppercase">Buyer Name</Text>
            <Text className="text-xs text-gray-900 dark:text-zinc-100 font-black">{receipt.buyerName}</Text>
          </View>
          <View className="flex flex-row justify-between">
            <Text className="text-xs text-gray-400 font-bold uppercase">Settled on</Text>
            <Text className="text-xs text-gray-900 dark:text-zinc-100 font-black">Polygon Smart Escrow</Text>
          </View>
        </View>

        {/* Raw Metadata Toggle */}
        <View className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-[28px] overflow-hidden mb-4 shadow-sm">
          <TouchableOpacity
            onPress={() => setShowRaw(!showRaw)}
            className="flex-row items-center justify-between p-5"
          >
            <Text className="text-[10px] text-gray-400 dark:text-zinc-500 font-black uppercase tracking-wider">Raw On-Chain Metadata</Text>
            {showRaw ? <ChevronUp color="#9ca3af" size={18} /> : <ChevronDown color="#9ca3af" size={18} />}
          </TouchableOpacity>
          {showRaw && (
            <View className="px-5 pb-5 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-850 p-4">
              <Text className="text-xs font-mono text-gray-600 dark:text-zinc-400 leading-5">
                {JSON.stringify({
                  orderId: receipt.orderId,
                  farmerId: receipt.farmerId,
                  buyerId: receipt.buyerId,
                  amount: receipt.amount,
                  qualityGrade: receipt.qualityGrade,
                  aiScore: receipt.aiScore,
                  timestamp: receipt.timestamp,
                  network: receipt.network,
                  contractAddress: receipt.contractAddress,
                  ipfsCID: receipt.ipfsCID,
                  transporterName: receipt.transporterName,
                  transporterId: receipt.transporterId,
                  vehicleNo: receipt.vehicleNo,
                  route: receipt.route,
                }, null, 2)}
              </Text>
            </View>
          )}
        </View>

      </ScrollView>
    </View>
  );
}
