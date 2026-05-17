import React, { useRef, useEffect } from 'react';
import { View, PanResponder, Animated, Dimensions, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { router, usePathname } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { 
  LayoutDashboard, 
  ClipboardList, 
  ShoppingBag, 
  User, 
  Search, 
  Gavel, 
  TrendingUp, 
  Truck, 
  MapPin, 
  Car,
  Settings,
  Users,
  AlertTriangle
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const ROLE_TABS = {
  farmer: ['dashboard', 'listings', 'market', 'profile'],
  buyer: ['dashboard', 'search', 'bids', 'insights', 'profile'],
  transporter: ['dashboard', 'shipments', 'routes', 'fleet', 'profile'],
  admin: ['dashboard', 'users', 'disputes', 'settings']
};

const TAB_ICONS = {
  dashboard: LayoutDashboard,
  listings: ClipboardList,
  market: ShoppingBag,
  profile: User,
  search: Search,
  bids: Gavel,
  insights: TrendingUp,
  shipments: Truck,
  routes: MapPin,
  fleet: Car,
  users: Users,
  disputes: AlertTriangle,
  settings: Settings
};

export function SwipeableScreen({ children, currentTab, role = 'farmer' }) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const tabs = ROLE_TABS[role] || ROLE_TABS.farmer;
  const currentIndex = tabs.indexOf(currentTab);
  
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  
  const pathname = usePathname();

  // Initial entry animation
  useEffect(() => {
    opacity.setValue(0.8);
    scale.setValue(0.99);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  }, [pathname]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 20;
      },
      onPanResponderMove: (_, gestureState) => {
        let moveX = gestureState.dx;
        if ((currentIndex === 0 && gestureState.dx > 0) || 
            (currentIndex === tabs.length - 1 && gestureState.dx < 0)) {
          moveX = gestureState.dx * 0.3;
        }
        
        translateX.setValue(moveX);
        const currentScale = 1 - (Math.abs(moveX) / width) * 0.03;
        scale.setValue(currentScale);
      },
      onPanResponderRelease: (_, gestureState) => {
        const threshold = width * 0.25;
        const velocity = gestureState.vx;
        
        if ((gestureState.dx < -threshold || velocity < -0.4) && currentIndex < tabs.length - 1) {
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: -width,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.5,
              duration: 150,
              useNativeDriver: true,
            })
          ]).start(() => {
            router.replace(`/(${role})/${tabs[currentIndex + 1]}`);
          });
        } else if ((gestureState.dx > threshold || velocity > 0.4) && currentIndex > 0) {
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: width,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0.5,
              duration: 150,
              useNativeDriver: true,
            })
          ]).start(() => {
            router.replace(`/(${role})/${tabs[currentIndex - 1]}`);
          });
        } else {
          Animated.parallel([
            Animated.spring(translateX, {
              toValue: 0,
              tension: 100,
              friction: 10,
              useNativeDriver: true,
            }),
            Animated.spring(scale, {
              toValue: 1,
              tension: 100,
              friction: 10,
              useNativeDriver: true,
            })
          ]).start();
        }
      },
    })
  ).current;

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#09090b' : '#f4f4f5' }]} {...panResponder.panHandlers}>
      <Animated.View 
        style={[
          styles.content,
          { 
            transform: [{ translateX }, { scale }],
            opacity 
          }
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  controlPanel: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  indicatorContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  tabLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  }
});
