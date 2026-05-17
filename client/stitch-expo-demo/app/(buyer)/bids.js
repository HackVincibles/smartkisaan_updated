import { SwipeableScreen } from '../../components/SwipeableScreen';
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { Gavel, Clock, CheckCircle, XCircle, ChevronRight, ArrowLeft } from 'lucide-react-native';

const MOCK_BIDS = [
  {
    id: 'B001',
    product: 'Premium Basmati Rice',
    farmer: 'Satnam Singh',
    yourBid: '₹6,200',
    currentHighest: '₹6,400',
    status: 'outbid',
    timeLeft: '2h 14m',
    qty: '2 quintals',
  },
  {
    id: 'B002',
    product: 'Fresh Alphonso Mangoes',
    farmer: 'Vinay G.',
    yourBid: '₹1,200',
    currentHighest: '₹1,200',
    status: 'winning',
    timeLeft: '4h 52m',
    qty: '3 boxes',
  },
  {
    id: 'B003',
    product: 'Organic Turmeric',
    farmer: 'Ravi Desai',
    yourBid: '₹4,800',
    currentHighest: '₹5,100',
    status: 'outbid',
    timeLeft: 'Closed',
    qty: '50 kg',
  },
];

const statusConfig = {
  winning: { label: 'Winning', color: '#16a34a', bg: '#dcfce7', icon: CheckCircle },
  outbid:  { label: 'Outbid',  color: '#dc2626', bg: '#fee2e2', icon: XCircle },
};

export default function BuyerBids() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  return (
    <SwipeableScreen currentTab="bids" role="buyer">
      <View style={{ flex: 1, backgroundColor: isDark ? '#09090b' : '#f9fafb' }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Header */}
      <View style={[
        styles.header,
        { paddingTop: insets.top + 16, backgroundColor: isDark ? '#18181b' : '#ffffff',
          borderBottomColor: isDark ? '#27272a' : '#f4f4f5' }
      ]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft color={isDark ? '#ffffff' : '#111827'} size={22} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#f4f4f5' : '#111827' }]}>My Bids</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 120 }}>
        {/* Summary pills */}
        <View style={styles.summaryRow}>
          {[
            { label: 'Active', value: '2', color: '#d97706' },
            { label: 'Winning', value: '1', color: '#16a34a' },
            { label: 'Total Bids', value: '3', color: '#2563eb' },
          ].map(s => (
            <View key={s.label} style={[styles.summaryPill, { backgroundColor: isDark ? '#27272a' : '#ffffff', borderColor: isDark ? '#3f3f46' : '#f3f4f6' }]}>
              <Text style={[styles.summaryValue, { color: s.color }]}>{s.value}</Text>
              <Text style={[styles.summaryLabel, { color: isDark ? '#a1a1aa' : '#6b7280' }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Bid cards */}
        {MOCK_BIDS.map(bid => {
          const conf = statusConfig[bid.status];
          const Icon = conf.icon;
          return (
            <TouchableOpacity
              key={bid.id}
              onPress={() => router.push('/(buyer)/place-bid')}
              style={[styles.card, { backgroundColor: isDark ? '#18181b' : '#ffffff', borderColor: isDark ? '#27272a' : '#f3f4f6' }]}
            >
              <View style={styles.cardRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.productName, { color: isDark ? '#f4f4f5' : '#111827' }]}>{bid.product}</Text>
                  <Text style={[styles.farmerName, { color: isDark ? '#a1a1aa' : '#6b7280' }]}>by {bid.farmer} • {bid.qty}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: conf.bg }]}>
                  <Icon color={conf.color} size={12} />
                  <Text style={[styles.statusText, { color: conf.color }]}>{conf.label}</Text>
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: isDark ? '#27272a' : '#f3f4f6' }]} />

              <View style={styles.bidRow}>
                <View>
                  <Text style={[styles.bidLabel, { color: isDark ? '#71717a' : '#9ca3af' }]}>Your Bid</Text>
                  <Text style={[styles.bidValue, { color: isDark ? '#f4f4f5' : '#111827' }]}>{bid.yourBid}</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={[styles.bidLabel, { color: isDark ? '#71717a' : '#9ca3af' }]}>Highest</Text>
                  <Text style={[styles.bidValue, { color: '#d97706' }]}>{bid.currentHighest}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.bidLabel, { color: isDark ? '#71717a' : '#9ca3af' }]}>
                    <Clock size={10} color={isDark ? '#71717a' : '#9ca3af'} /> Time Left
                  </Text>
                  <Text style={[styles.bidValue, { color: bid.timeLeft === 'Closed' ? '#dc2626' : (isDark ? '#f4f4f5' : '#111827') }]}>
                    {bid.timeLeft}
                  </Text>
                </View>
                <ChevronRight color={isDark ? '#52525b' : '#d1d5db'} size={18} />
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      </View>
    </SwipeableScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  summaryPill: {
    flex: 1, borderRadius: 16, padding: 14, alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, elevation: 1,
  },
  summaryValue: { fontSize: 22, fontWeight: '800' },
  summaryLabel: { fontSize: 11, fontWeight: '500', marginTop: 2 },
  card: {
    borderRadius: 16, borderWidth: 1, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, elevation: 2,
  },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start', padding: 16, paddingBottom: 12 },
  productName: { fontSize: 15, fontWeight: '700', marginBottom: 3 },
  farmerName: { fontSize: 12 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: '700' },
  divider: { height: 1, marginHorizontal: 16 },
  bidRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  bidLabel: { fontSize: 11, marginBottom: 3 },
  bidValue: { fontSize: 14, fontWeight: '700' },
});
