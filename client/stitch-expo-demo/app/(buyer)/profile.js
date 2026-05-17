import { SwipeableScreen } from '../../components/SwipeableScreen';
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import {
  User, Bell, MapPin, CreditCard, Shield, HelpCircle,
  ChevronRight, LogOut, Star, Package
} from 'lucide-react-native';

const MENU_SECTIONS = [
  {
    title: 'My Account',
    items: [
      { icon: User, label: 'Personal Details', sub: 'Name, phone, email', route: '/(shared)/personal-details' },
      { icon: MapPin, label: 'Delivery Addresses', sub: '2 saved addresses', route: '/(shared)/addresses' },
      { icon: CreditCard, label: 'Payment Methods', sub: 'UPI, bank account', route: '/(shared)/payment-methods' },
    ],
  },
  {
    title: 'Activity',
    items: [
      { icon: Package, label: 'My Orders', sub: 'Track & manage orders', route: '/(buyer)/my-orders' },
      { icon: Star, label: 'Reviews & Ratings', sub: 'Rate your purchases', route: '/(shared)/reviews' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: Bell, label: 'Notifications', sub: 'Bids, orders, alerts', route: '/(shared)/notifications' },
      { icon: Shield, label: 'Privacy & Security', sub: 'KYC, data settings', route: '/(shared)/kyc' },
      { icon: HelpCircle, label: 'Help & Support', sub: 'FAQs, chat support', route: '/(shared)/help-support' },
    ],
  },
];

export default function BuyerProfile() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  return (
    <SwipeableScreen currentTab="profile" role="buyer">
      <View style={{ flex: 1, backgroundColor: isDark ? '#09090b' : '#f9fafb' }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}>
        {/* Profile Hero */}
        <View style={[styles.hero, { backgroundColor: isDark ? '#18181b' : '#ffffff', paddingTop: insets.top + 24 }]}>
          <View style={[styles.avatarCircle, { backgroundColor: '#d97706' }]}>
            <Text style={styles.avatarText}>R</Text>
          </View>
          <Text style={[styles.heroName, { color: isDark ? '#f4f4f5' : '#111827' }]}>Ramesh Patel</Text>
          <Text style={[styles.heroSub, { color: isDark ? '#a1a1aa' : '#6b7280' }]}>Buyer · ramesh@example.com</Text>
          <View style={styles.statRow}>
            {[
              { label: 'Orders', value: '14' },
              { label: 'Bids Won', value: '8' },
              { label: 'Reviews', value: '6' },
            ].map((s, i) => (
              <View key={s.label} style={[styles.statItem, i < 2 && { borderRightWidth: 1, borderRightColor: isDark ? '#27272a' : '#f3f4f6' }]}>
                <Text style={[styles.statValue, { color: isDark ? '#f4f4f5' : '#111827' }]}>{s.value}</Text>
                <Text style={[styles.statLabel, { color: isDark ? '#71717a' : '#9ca3af' }]}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu sections */}
        <View style={{ paddingHorizontal: 16, marginTop: 20, gap: 20 }}>
          {MENU_SECTIONS.map(section => (
            <View key={section.title}>
              <Text style={[styles.sectionTitle, { color: isDark ? '#71717a' : '#9ca3af' }]}>
                {section.title.toUpperCase()}
              </Text>
              <View style={[styles.sectionCard, { backgroundColor: isDark ? '#18181b' : '#ffffff', borderColor: isDark ? '#27272a' : '#f3f4f6' }]}>
                {section.items.map((item, i) => (
                  <TouchableOpacity
                    key={item.label}
                    style={[
                      styles.menuRow,
                      i < section.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: isDark ? '#27272a' : '#f3f4f6' }
                    ]}
                    onPress={() => router.push(item.route)}
                  >
                    <View style={[styles.menuIconBg, { backgroundColor: isDark ? '#27272a' : '#f3f4f6' }]}>
                      <item.icon color={isDark ? '#a1a1aa' : '#374151'} size={18} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.menuLabel, { color: isDark ? '#f4f4f5' : '#111827' }]}>{item.label}</Text>
                      <Text style={[styles.menuSub, { color: isDark ? '#71717a' : '#9ca3af' }]}>{item.sub}</Text>
                    </View>
                    <ChevronRight color={isDark ? '#3f3f46' : '#d1d5db'} size={18} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* Logout */}
          <TouchableOpacity
            style={[styles.logoutBtn, { borderColor: isDark ? '#27272a' : '#fee2e2', backgroundColor: isDark ? '#18181b' : '#fff' }]}
            onPress={() => router.replace('/')}
          >
            <LogOut color="#dc2626" size={18} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </View>
    </SwipeableScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center', paddingHorizontal: 24, paddingBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, elevation: 2,
  },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  avatarText: { color: '#ffffff', fontSize: 32, fontWeight: '800' },
  heroName: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  heroSub: { fontSize: 14, marginBottom: 20 },
  statRow: { flexDirection: 'row', width: '100%' },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  statValue: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 12, marginTop: 2 },
  sectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 8, marginLeft: 4 },
  sectionCard: {
    borderRadius: 16, borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, elevation: 1,
  },
  menuRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 14 },
  menuIconBg: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  menuSub: { fontSize: 12 },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, height: 52, borderRadius: 14, borderWidth: 1,
  },
  logoutText: { color: '#dc2626', fontSize: 15, fontWeight: '700' },
});
