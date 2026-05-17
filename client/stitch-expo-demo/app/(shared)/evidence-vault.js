import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StatusBar,
  Alert, Image, Linking
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from 'nativewind';
import * as ImagePicker from 'expo-image-picker';
import {
  ChevronLeft, Upload, Image as ImageIcon, FileText,
  MessageSquare, Shield, CheckCircle2, Clock, Hash,
  ExternalLink, Lock, AlertTriangle, Camera, Trash2,
  Link
} from 'lucide-react-native';

// ─────────────────────────────────────────────────────────────────────────────
// EvidenceVault — Dispute evidence upload + IPFS anchoring screen
// Connects to:
//   POST /api/v1/disputes/raise   → raiseDispute (with evidence)
//   ipfs.service.js               → Pinata uploadFromUrl
//   trust.worker.js               → stores IPFS CID + blockchain hash
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_DISPUTE = {
  orderId: 'ORD-2025-9042',
  product: 'Premium Wheat',
  amount: 24500,
  status: 'ai_resolved',
  aiVerdict: 'PARTIAL_REFUND',
  aiVerdictReason: 'Moderate quality drop (22%) detected between listing scan and delivery scan.',
  listingAiScore: 91,
  deliveryAiScore: 71,
  ipfsCID: 'QmEvidVault7x3mP9nQ2rL8sT4uW1yZ6aB5cD0eF',
  blockchainTxHash: '0xe1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
  raisedAt: '2025-10-23T10:00:00Z',
  resolvedAt: '2025-10-23T10:00:05Z',
};

const VERDICT_CONFIG = {
  FULL_REFUND: { label: 'Full Refund', color: '#059669', bg: '#d1fae5', icon: CheckCircle2 },
  PARTIAL_REFUND: { label: 'Partial Refund', color: '#d97706', bg: '#fef3c7', icon: AlertTriangle },
  NO_REFUND: { label: 'No Refund', color: '#dc2626', bg: '#fee2e2', icon: Shield },
  ESCALATE_TO_ARBITRATOR: { label: 'Manual Review', color: '#7c3aed', bg: '#ede9fe', icon: Clock },
};

const UPLOAD_CATEGORIES = [
  { id: 'photo', label: 'Product Photos', icon: Camera, desc: 'Clear photos showing quality issue' },
  { id: 'delivery', label: 'Delivery Proof', icon: ImageIcon, desc: 'Photo of received item + packaging' },
  { id: 'chat', label: 'Chat Screenshot', icon: MessageSquare, desc: 'Conversation with farmer/transporter' },
  { id: 'document', label: 'Invoice / Bill', icon: FileText, desc: 'Any supporting documents' },
];

function EvidenceItem({ item, onRemove, isDark }) {
  return (
    <View className="flex-row items-center bg-gray-50 dark:bg-zinc-800 rounded-2xl p-3 mb-2">
      {item.uri ? (
        <Image source={{ uri: item.uri }} className="w-12 h-12 rounded-xl mr-3" />
      ) : (
        <View className="w-12 h-12 bg-gray-200 dark:bg-zinc-700 rounded-xl items-center justify-center mr-3">
          <FileText color={isDark ? '#a1a1aa' : '#6b7280'} size={20} />
        </View>
      )}
      <View className="flex-1">
        <Text className="text-gray-900 dark:text-zinc-100 font-bold text-sm" numberOfLines={1}>{item.name}</Text>
        <Text className="text-gray-400 dark:text-zinc-500 text-[10px] font-bold uppercase mt-0.5">{item.category}</Text>
      </View>
      {item.ipfsCID ? (
        <View className="flex-row items-center">
          <CheckCircle2 color="#059669" size={14} />
          <Text className="text-green-600 text-[10px] font-black ml-1">IPFS</Text>
        </View>
      ) : (
        <TouchableOpacity onPress={() => onRemove(item.id)}>
          <Trash2 color={isDark ? '#71717a' : '#9ca3af'} size={16} />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function EvidenceVault() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const params = useLocalSearchParams();

  const [evidence, setEvidence] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [vaultSealed, setVaultSealed] = useState(false);
  const [sealedCID, setSealedCID] = useState(null);
  const [sealedTxHash, setSealedTxHash] = useState(null);
  const [reason, setReason] = useState('');
  const [activeView, setActiveView] = useState('upload'); // 'upload' | 'existing'

  // In production: load existing dispute if params.disputeId exists
  const dispute = params.disputeId ? MOCK_DISPUTE : null;
  const verdictConf = dispute ? VERDICT_CONFIG[dispute.aiVerdict] : null;

  const pickImage = async (category) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setEvidence((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          uri: asset.uri,
          name: asset.fileName || `evidence_${Date.now()}.jpg`,
          category,
          ipfsCID: null,
        },
      ]);
    }
  };

  const removeEvidence = (id) => {
    setEvidence((prev) => prev.filter((e) => e.id !== id));
  };

  const handleSealVault = async () => {
    if (evidence.length === 0) {
      Alert.alert('No Evidence', 'Please upload at least one piece of evidence before sealing the vault.');
      return;
    }

    setUploading(true);

    // Mock IPFS + blockchain anchoring (production: call /api/v1/disputes/raise)
    await new Promise((r) => setTimeout(r, 2000));

    const mockCID = 'QmEv' + Date.now().toString(16).toUpperCase().slice(0, 20);
    const mockTx = '0x' + Date.now().toString(16) + 'deadbeef1234cafe';

    // Update all evidence items with mock CIDs
    setEvidence((prev) => prev.map((e) => ({ ...e, ipfsCID: mockCID })));
    setSealedCID(mockCID);
    setSealedTxHash(mockTx);
    setVaultSealed(true);
    setUploading(false);

    Alert.alert(
      '🔒 Vault Sealed via Pinata!',
      'Your evidence has been uploaded to IPFS via Pinata API and anchored on Polygon Amoy. It is now tamper-proof and can be used for dispute resolution.',
      [{ text: 'Got it', style: 'default' }]
    );
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
          <Text className="text-xl font-black text-gray-900 dark:text-zinc-100">Evidence Vault</Text>
          <Text className="text-xs text-gray-400 dark:text-zinc-500 font-bold">IPFS · Tamper-Proof Dispute Evidence</Text>
        </View>
        {vaultSealed && (
          <View className="flex-row items-center bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-full border border-green-200 dark:border-green-700">
            <Lock color="#059669" size={12} />
            <Text className="text-green-700 dark:text-green-400 text-[10px] font-black ml-1 uppercase">Sealed</Text>
          </View>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Tab Switcher (if existing dispute) ────────────── */}
        {dispute && (
          <View className="mx-4 mt-4 flex-row bg-gray-100 dark:bg-zinc-800 rounded-2xl p-1">
            {['upload', 'existing'].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveView(tab)}
                style={{ flex: 1, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
                  backgroundColor: activeView === tab ? (isDark ? '#27272a' : '#ffffff') : 'transparent' }}
              >
                <Text className={`text-sm font-black capitalize ${activeView === tab ? 'text-gray-900 dark:text-zinc-100' : 'text-gray-400 dark:text-zinc-500'}`}>
                  {tab === 'upload' ? 'Add Evidence' : 'Filed Dispute'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── EXISTING DISPUTE VIEW ─────────────────────────── */}
        {dispute && activeView === 'existing' && (
          <View className="px-4 mt-4">
            {/* AI Verdict Card */}
            {verdictConf && (
              <View
                style={{ backgroundColor: isDark ? '#18181b' : verdictConf.bg, borderColor: verdictConf.color }}
                className="rounded-3xl p-5 mb-4 border"
              >
                <View className="flex-row items-center mb-2">
                  <verdictConf.icon color={verdictConf.color} size={18} />
                  <Text style={{ color: verdictConf.color }} className="font-black text-base ml-2">
                    AI Verdict: {verdictConf.label}
                  </Text>
                </View>
                <Text className="text-gray-700 dark:text-zinc-300 text-sm font-medium leading-5">
                  {dispute.aiVerdictReason}
                </Text>
                <View className="mt-3 pt-3 border-t border-black/10 dark:border-white/10">
                  <View className="flex-row justify-between">
                    <View>
                      <Text className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Listing AI Score</Text>
                      <Text className="text-gray-900 dark:text-zinc-100 font-black text-lg">{dispute.listingAiScore}/100</Text>
                    </View>
                    <View>
                      <Text className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Delivery AI Score</Text>
                      <Text className="text-gray-900 dark:text-zinc-100 font-black text-lg">{dispute.deliveryAiScore}/100</Text>
                    </View>
                    <View>
                      <Text className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Quality Drop</Text>
                      <Text style={{ color: verdictConf.color }} className="font-black text-lg">
                        {dispute.listingAiScore - dispute.deliveryAiScore}%
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* IPFS Anchor */}
            <View className="bg-white dark:bg-zinc-900 rounded-3xl p-5 mb-4 border border-gray-100 dark:border-zinc-800">
              <Text className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-3">Blockchain Anchored Evidence</Text>
              <View className="flex-row items-center bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-3 mb-2">
                <Link color="#2563eb" size={14} />
                <Text className="flex-1 text-xs font-mono text-blue-700 dark:text-blue-400 mx-2" numberOfLines={1} ellipsizeMode="middle">
                  {dispute.ipfsCID}
                </Text>
              </View>
              <View className="flex-row items-center bg-gray-50 dark:bg-zinc-800 rounded-2xl p-3 mb-3">
                <Hash color={isDark ? '#71717a' : '#9ca3af'} size={14} />
                <Text className="flex-1 text-xs font-mono text-gray-700 dark:text-zinc-300 mx-2" numberOfLines={1} ellipsizeMode="middle">
                  {dispute.blockchainTxHash}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => Linking.openURL(`https://amoy.polygonscan.com/tx/${dispute.blockchainTxHash}`)}
                className="flex-row items-center justify-center bg-purple-50 dark:bg-purple-900/30 h-11 rounded-2xl border border-purple-200 dark:border-purple-700"
              >
                <ExternalLink color="#7c3aed" size={14} />
                <Text className="text-purple-700 dark:text-purple-400 font-black text-sm ml-2">View on PolygonScan</Text>
              </TouchableOpacity>
            </View>

            {/* Tamper-proof badge */}
            <View className="flex-row items-center bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 mb-6 border border-green-200 dark:border-green-800">
              <Shield color="#059669" size={18} />
              <View className="ml-3 flex-1">
                <Text className="text-green-800 dark:text-green-400 font-black text-sm">Evidence is Tamper-Proof</Text>
                <Text className="text-green-700 dark:text-green-500 text-xs font-medium mt-0.5">
                  Anchored on Polygon Amoy — immutable and verifiable by anyone
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ── UPLOAD VIEW ───────────────────────────────────── */}
        {(!dispute || activeView === 'upload') && (
          <View className="px-4 mt-4">
            {/* Info banner */}
            <View className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 mb-5 flex-row items-start border border-amber-200 dark:border-amber-800">
              <AlertTriangle color="#d97706" size={16} style={{ marginTop: 1 }} />
              <Text className="text-amber-700 dark:text-amber-400 text-xs font-medium ml-2 flex-1 leading-5">
                All evidence will be uploaded to <Text className="font-black">IPFS</Text> and anchored on <Text className="font-black">Polygon Amoy</Text> — making it tamper-proof and admissible for dispute resolution.
              </Text>
            </View>

            {/* Upload Categories */}
            <Text className="text-[10px] text-gray-400 dark:text-zinc-500 font-black uppercase tracking-wider mb-3">
              Add Evidence
            </Text>
            <View className="flex-row flex-wrap gap-3 mb-5">
              {UPLOAD_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => pickImage(cat.label)}
                  style={{ width: '47%' }}
                  className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-4 items-center"
                >
                  <View className="w-12 h-12 bg-gray-50 dark:bg-zinc-800 rounded-2xl items-center justify-center mb-2">
                    <cat.icon color={isDark ? '#a1a1aa' : '#6b7280'} size={22} />
                  </View>
                  <Text className="text-gray-900 dark:text-zinc-100 font-black text-xs text-center">{cat.label}</Text>
                  <Text className="text-gray-400 dark:text-zinc-500 text-[10px] text-center mt-1">{cat.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Evidence List */}
            {evidence.length > 0 && (
              <View className="mb-5">
                <Text className="text-[10px] text-gray-400 dark:text-zinc-500 font-black uppercase tracking-wider mb-3">
                  Queued Evidence ({evidence.length})
                </Text>
                {evidence.map((item) => (
                  <EvidenceItem key={item.id} item={item} onRemove={removeEvidence} isDark={isDark} />
                ))}
              </View>
            )}

            {/* Sealed vault state */}
            {vaultSealed && sealedCID && (
              <View className="bg-green-50 dark:bg-green-900/20 rounded-3xl p-5 mb-5 border border-green-200 dark:border-green-800">
                <View className="flex-row items-center mb-3">
                  <Lock color="#059669" size={16} />
                  <Text className="text-green-800 dark:text-green-400 font-black text-sm ml-2">Vault Sealed!</Text>
                </View>
                <Text className="text-[10px] text-green-700 font-black uppercase tracking-wider mb-1">IPFS CID</Text>
                <Text className="text-xs font-mono text-green-700 dark:text-green-400 mb-3">{sealedCID}</Text>
                <Text className="text-[10px] text-green-700 font-black uppercase tracking-wider mb-1">Blockchain Tx</Text>
                <Text className="text-xs font-mono text-green-700 dark:text-green-400">{sealedTxHash}</Text>
                <TouchableOpacity
                  onPress={() => Linking.openURL(`https://amoy.polygonscan.com/tx/${sealedTxHash}`)}
                  className="flex-row items-center justify-center mt-3 bg-green-600 h-11 rounded-2xl"
                >
                  <ExternalLink color="#ffffff" size={14} />
                  <Text className="text-white font-black text-sm ml-2">View on PolygonScan</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Seal Button */}
            {!vaultSealed && (
              <TouchableOpacity
                onPress={handleSealVault}
                disabled={uploading || evidence.length === 0}
                style={{ opacity: (uploading || evidence.length === 0) ? 0.5 : 1 }}
                className="bg-gray-900 dark:bg-zinc-100 h-14 rounded-2xl flex-row items-center justify-center mb-4"
              >
                <Shield color={isDark ? '#18181b' : '#ffffff'} size={18} />
                <Text className="text-white dark:text-zinc-900 font-black text-base ml-2">
                  {uploading ? 'Sealing Vault...' : `Seal & Upload to IPFS (${evidence.length} files)`}
                </Text>
              </TouchableOpacity>
            )}

            <View className="flex-row items-center justify-center mb-8">
              <Shield color={isDark ? '#52525b' : '#9ca3af'} size={13} />
              <Text className="text-gray-400 dark:text-zinc-500 text-xs ml-2 font-medium">
                Encrypted · Immutable · Decentralized
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
