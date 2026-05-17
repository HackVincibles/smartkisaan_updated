import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions,
  Platform, UIManager, Animated, Easing, PanResponder,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Leaf, Globe } from 'lucide-react-native';
import { useLanguage } from './(shared)/LanguageContext';

const { width } = Dimensions.get('window');

const TRACK_WIDTH = width - 48; // pill total width
const THUMB_SIZE = 56;
const MAX_SWIPE = TRACK_WIDTH - THUMB_SIZE - 4;

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

// ─── Swipe-to-proceed slider ───────────────────────────────────────────────
function SwipeSlider({ accent, labelText, onComplete }) {
  const thumbX = useRef(new Animated.Value(0)).current;
  const completedRef = useRef(false);

  useEffect(() => {
    completedRef.current = false;
  }, [accent]);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.12, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      Animated.sequence([
        Animated.timing(thumbX, { toValue: 28, duration: 400, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(thumbX, { toValue: 0, duration: 350, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ]).start();
    }, 1200);
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, { dx, dy }) => Math.abs(dx) > 4 && Math.abs(dx) > Math.abs(dy),
      onPanResponderGrant: () => {
        thumbX.stopAnimation();
        completedRef.current = false;
      },
      onPanResponderMove: (_, { dx }) => {
        const clamped = Math.max(0, Math.min(dx, MAX_SWIPE));
        thumbX.setValue(clamped);
      },
      onPanResponderRelease: (_, { dx }) => {
        if (dx >= MAX_SWIPE * 0.7 && !completedRef.current) {
          completedRef.current = true;
          Animated.timing(thumbX, {
            toValue: MAX_SWIPE,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onComplete();
          });
        } else {
          Animated.spring(thumbX, {
            toValue: 0,
            tension: 80,
            friction: 7,
            useNativeDriver: true,
          }).start();
        }
      },
      onResponderTerminationRequest: () => false,
      onPanResponderTerminate: () => {
        Animated.spring(thumbX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    })
  ).current;

  return (
    <View style={styles.sliderTrack}>
      <View style={[StyleSheet.absoluteFillObject, styles.sliderGlass]} />
      <Text style={styles.sliderLabel}>{labelText}</Text>
      <Animated.View
        style={[
          styles.sliderThumb,
          {
            backgroundColor: accent,
            transform: [{ translateX: thumbX }, { scale: pulseAnim }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Leaf color="#fff" size={20} />
      </Animated.View>
    </View>
  );
}

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { locale, t } = useLanguage();

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  const imageOpacity = useRef(new Animated.Value(1)).current;
  const textOpacity = useRef(new Animated.Value(1)).current;
  const textTranslateY = useRef(new Animated.Value(0)).current;

  const triggerCycleRef = useRef(null);

  // Dynamic translated roles list based on locale selection
  const ROLES = [
    {
      id: 'farmer',
      label: locale === 'hi' ? 'किसान' : 'Farmer',
      headline: locale === 'hi' ? ['स्मार्ट समाधान', 'आधुनिक किसान'] : ['Smart Solutions', 'Modern Farmers'],
      subtitle: locale === 'hi' 
        ? 'बेहतर उपज और सही मंडी भाव के लिए किसानों को स्मार्ट उपकरणों से सशक्त बनाना।'
        : 'Empowering farmers with smart tools for better yields and decisions.',
      image: { uri: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=800' },
      accent: '#16a34a',
      highlightWords: locale === 'hi' ? ['समाधान', 'किसान'] : ['Solutions', 'Farmers'],
    },
    {
      id: 'buyer',
      label: locale === 'hi' ? 'खरीदार' : 'Buyer',
      headline: locale === 'hi' ? ['ताजी उपज', 'सर्वोत्तम दाम'] : ['Fresh Produce', 'Best Prices'],
      subtitle: locale === 'hi' 
        ? 'उचित दामों पर सबसे ताजी फसलों के लिए सत्यापित किसानों से सीधे जुड़ें।'
        : 'Connect directly with verified farmers for the freshest crops at fair prices.',
      image: { uri: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=800' },
      accent: '#d97706',
      highlightWords: locale === 'hi' ? ['उपज', 'दाम'] : ['Produce', 'Prices'],
    },
    {
      id: 'logistics',
      label: locale === 'hi' ? 'परिवहन' : 'Logistics',
      headline: locale === 'hi' ? ['विश्वसनीय मार्ग', 'समय पर वितरण'] : ['Reliable Routes', 'On-Time Delivery'],
      subtitle: locale === 'hi' 
        ? 'आसानी से अपने लॉजिस्टिक्स नेटवर्क को बढ़ाएं और शिपमेंट का सुरक्षित प्रबंधन करें।'
        : 'Manage shipments and grow your logistics network with secure escrow protection.',
      image: { uri: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=800' },
      accent: '#2563eb',
      highlightWords: locale === 'hi' ? ['मार्ग', 'वितरण'] : ['Routes', 'Delivery'],
    },
  ];

  const triggerCycle = (nextIndex) => {
    Animated.parallel([
      Animated.timing(imageOpacity, { toValue: 0, duration: 400, useNativeDriver: true }),
      Animated.timing(textOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(textTranslateY, { toValue: -16, duration: 300, useNativeDriver: true }),
    ]).start(() => {
      setActiveIndex(nextIndex);
      activeIndexRef.current = nextIndex;
      textTranslateY.setValue(22);
      Animated.parallel([
        Animated.timing(imageOpacity, { toValue: 1, duration: 550, useNativeDriver: true }),
        Animated.timing(textOpacity, { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.timing(textTranslateY, {
          toValue: 0, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true,
        }),
      ]).start();
    });
  };

  triggerCycleRef.current = triggerCycle;

  const bgSwipePanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dx, dy }) =>
        Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.5,
      onPanResponderRelease: (_, { dx, dy }) => {
        if (Math.abs(dx) < 55 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
        const current = activeIndexRef.current;
        if (dx < 0) {
          triggerCycleRef.current((current + 1) % ROLES.length);
        } else {
          triggerCycleRef.current((current - 1 + ROLES.length) % ROLES.length);
        }
      },
    })
  ).current;

  const role = ROLES[activeIndex];
  const textAnimStyle = { opacity: textOpacity, transform: [{ translateY: textTranslateY }] };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View 
        style={StyleSheet.absoluteFillObject} 
        {...bgSwipePanResponder.panHandlers} 
      />

      <Animated.Image
        source={role.image}
        style={[StyleSheet.absoluteFillObject, { opacity: imageOpacity }]}
        resizeMode="cover"
      />

      <LinearGradient
        colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.15)', 'transparent']}
        locations={[0, 0.35, 0.6]}
        style={StyleSheet.absoluteFillObject}
      />

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.55)', 'rgba(0,0,0,0.85)', 'rgba(0,0,0,0.95)']}
        locations={[0.35, 0.6, 0.8, 1]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* TOP BAR */}
      <View style={[styles.topBar, { top: insets.top + 18 }]}>
        <View style={styles.logoCircle}>
          <Leaf color="#16a34a" size={22} />
        </View>
        <Text style={styles.appName}>SmartKissan</Text>
      </View>

      {/* Language Toggle Icon Button */}
      <TouchableOpacity 
        onPress={() => router.push('/language')}
        style={[styles.languageBtn, { top: insets.top + 16 }]}
      >
        <Globe color="#ffffff" size={20} />
      </TouchableOpacity>

      {/* ROLE BADGE */}
      <View style={[styles.roleBadge, { top: insets.top + 22 }]}>
        <View style={[styles.roleDot, { backgroundColor: role.accent }]} />
        <Text style={styles.roleBadgeText}>{role.label}</Text>
      </View>

      {/* CONTENT AREA */}
      <View 
        style={[styles.contentArea, { paddingBottom: insets.bottom + 32 }]}
        pointerEvents="box-none"
      >
        <View style={styles.dotsRow}>
          <View style={styles.dotsInner}>
            {ROLES.map((r, i) => {
              const isActive = i === activeIndex;
              return (
                <TouchableOpacity key={r.id} onPress={() => { if (i !== activeIndex) triggerCycle(i); }}>
                  <View style={[
                    styles.dot,
                    { backgroundColor: isActive ? role.accent : 'rgba(255,255,255,0.35)', width: isActive ? 24 : 8 }
                  ]} />
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={styles.swipeHint}>
            {locale === 'hi' ? '← देखने के लिए स्वाइप करें →' : '← swipe to explore →'}
          </Text>
        </View>

        {/* HEADLINE */}
        <Animated.View style={[styles.headlineContainer, textAnimStyle]}>
          {role.headline.map((line, li) => {
            const words = line.split(' ');
            return (
              <Text key={li} style={styles.headline}>
                {words.map((word, wi) => (
                  <Text
                    key={wi}
                    style={{ color: role.highlightWords.includes(word) ? role.accent : '#ffffff' }}
                  >
                    {word}{wi < words.length - 1 ? ' ' : ''}
                  </Text>
                ))}
              </Text>
            );
          })}
        </Animated.View>

        {/* SUBTITLE */}
        <Animated.Text style={[styles.subtitle, textAnimStyle]}>
          {role.subtitle}
        </Animated.Text>

        {/* SWIPE SLIDER */}
        <SwipeSlider
          accent={role.accent}
          labelText={locale === 'hi' ? 'शुरू करने के लिए खिसकाएं' : 'Swipe to proceed'}
          onComplete={() => router.push('/role-select')}
        />

        {/* SIGN IN LINK */}
        <TouchableOpacity style={styles.loginContainer} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.loginText}>
            {locale === 'hi' ? 'पहले से ही खाता है? ' : 'Already have an account? '}
            <Text style={{ color: role.accent, fontWeight: '700' }}>
              {locale === 'hi' ? 'लॉग इन करें' : 'Sign In'}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a0a0a' },

  topBar: {
    position: 'absolute', left: 24,
    flexDirection: 'row', alignItems: 'center', zIndex: 10,
  },
  logoCircle: {
    width: 38, height: 38, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 19,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
  },
  appName: {
    fontSize: 18, fontWeight: '800', color: '#ffffff', marginLeft: 10,
    letterSpacing: 0.3,
  },
  languageBtn: {
    position: 'absolute', right: 120, zIndex: 10,
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  roleBadge: {
    position: 'absolute', right: 24, zIndex: 10,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  roleDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  roleBadgeText: { color: '#ffffff', fontSize: 12, fontWeight: '600' },

  contentArea: {
    flex: 1, justifyContent: 'flex-end', paddingHorizontal: 24,
  },
  dot: { height: 8, borderRadius: 4 },

  headlineContainer: { marginBottom: 16 },
  headline: { fontSize: 32, fontWeight: '800', lineHeight: 42, color: '#ffffff' },

  subtitle: {
    fontSize: 14, fontWeight: '400',
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 22, marginBottom: 40,
  },

  dotsRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 28,
  },
  dotsInner: { flexDirection: 'row', gap: 8 },
  swipeHint: {
    fontSize: 11, color: 'rgba(255,255,255,0.35)',
    fontWeight: '500', letterSpacing: 0.3,
  },

  // Swipe slider
  sliderTrack: {
    height: THUMB_SIZE + 8,
    borderRadius: (THUMB_SIZE + 8) / 2,
    overflow: 'hidden',
    marginBottom: 24,
    justifyContent: 'center',
  },
  sliderGlass: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: (THUMB_SIZE + 8) / 2,
  },
  sliderLabel: {
    position: 'absolute',
    alignSelf: 'center',
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '750',
    letterSpacing: 0.4,
    marginLeft: 32,
  },
  sliderThumb: {
    position: 'absolute',
    left: 4,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  loginContainer: { alignItems: 'center' },
  loginText: { color: 'rgba(255,255,255,0.55)', fontSize: 14, fontWeight: '500' },
});
