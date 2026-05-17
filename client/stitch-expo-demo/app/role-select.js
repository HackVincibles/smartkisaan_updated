import React from 'react';
import { useColorScheme } from 'nativewind';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Leaf, ShoppingBag, Truck, ChevronRight, ArrowLeft } from 'lucide-react-native';
import { useLanguage } from './(shared)/LanguageContext';

const { width } = Dimensions.get('window');

export default function RoleSelectScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const { locale, t } = useLanguage();

  const ROLES = [
    {
      id: 'farmer',
      name: locale === 'hi' ? 'किसान' : 'Farmer',
      description: locale === 'hi' 
        ? 'फसलें बेचें, सूचियां प्रबंधित करें और बोलियां ट्रैक करें'
        : 'Sell crops, manage listings & track bids',
      icon: Leaf,
      color: '#16a34a',
      bg: '#dcfce7',
      route: '/(farmer)/dashboard',
    },
    {
      id: 'buyer',
      name: locale === 'hi' ? 'खरीदार' : 'Buyer',
      description: locale === 'hi'
        ? 'ताजी उपज देखें, बोलियां लगाएं और सहकारी समूहों में जुड़ें'
        : 'Browse fresh produce, place bids & join co-op pools',
      icon: ShoppingBag,
      color: '#d97706',
      bg: '#fef3c7',
      route: '/(buyer)/dashboard',
    },
    {
      id: 'logistics',
      name: locale === 'hi' ? 'लॉजिस्टिक्स / परिवहन' : 'Logistics',
      description: locale === 'hi'
        ? 'अनाज भार ढूंढें, सुरक्षित डिलीवरी करें और ट्रांजिट प्रबंधित करें'
        : 'Find grain loads, complete deliveries & manage transit',
      icon: Truck,
      color: '#2563eb',
      bg: '#dbeafe',
      route: '/(transporter)/dashboard',
    },
  ];

  return (
    <View style={[styles.root, isDark && { backgroundColor: '#09090b' }]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity 
          style={[styles.backBtn, isDark && { backgroundColor: '#27272a' }]} 
          onPress={() => router.back()}
        >
          <ArrowLeft color={isDark ? "#ffffff" : "#111827"} size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, isDark && { color: '#f4f4f5' }]}>
          {locale === 'hi' ? 'अपनी भूमिका चुनें' : 'Choose your role'}
        </Text>
        <Text style={[styles.subtitle, isDark && { color: '#a1a1aa' }]}>
          {locale === 'hi' 
            ? 'चुनें कि आप आज स्मार्टकिसान का उपयोग कैसे करना चाहते हैं।' 
            : 'Select how you want to use SmartKissan today.'}
        </Text>

        <View style={styles.cardsContainer}>
          {ROLES.map((role) => (
            <TouchableOpacity 
              key={role.id} 
              style={[styles.card, isDark && { backgroundColor: '#18181b', borderColor: '#27272a' }]}
              onPress={() => router.push(role.route)}
            >
              <View style={[styles.iconCircle, { backgroundColor: role.bg }]}>
                <role.icon color={role.color} size={24} />
              </View>
              
              <View style={styles.cardText}>
                <Text style={[styles.cardTitle, isDark && { color: '#f4f4f5' }]}>{role.name}</Text>
                <Text style={[styles.cardDesc, isDark && { color: '#a1a1aa' }]}>{role.description}</Text>
              </View>

              <ChevronRight color="#9ca3af" size={20} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 40,
    lineHeight: 24,
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
    paddingRight: 16,
  },
});
