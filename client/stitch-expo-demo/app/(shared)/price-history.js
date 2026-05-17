import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StatusBar,
  Dimensions, ActivityIndicator
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from 'nativewind';
import {
  ChevronLeft, Sparkles, TrendingUp, TrendingDown,
  Info, Calendar, Landmark, MapPin, BadgePercent, ArrowRightLeft
} from 'lucide-react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle, Line } from 'react-native-svg';

// ─────────────────────────────────────────────────────────────────────────────
// Custom Interactive SVG Price Chart (Pure SVG, fully cross-platform)
// Generates beautiful price curves without complex heavy libraries.
// ─────────────────────────────────────────────────────────────────────────────

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_PADDING = 30;
const CHART_HEIGHT = 160;

// Price datasets based on crop selection
const CROP_DATASETS = {
  'Wheat': {
    Weekly: [2380, 2400, 2410, 2430, 2420, 2450, 2450],
    Monthly: [2250, 2300, 2320, 2380, 2450],
    SixMonths: [2100, 2150, 2200, 2350, 2380, 2450],
    dates: {
      Weekly: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      Monthly: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Today'],
      SixMonths: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
    },
    mandis: [
      { name: 'Indore Mandi', price: '₹2,450', diff: 'Base', status: 'Stable' },
      { name: 'Dewas Mandi', price: '₹2,485', diff: '+₹35', status: 'High' },
      { name: 'Ujjain Mandi', price: '₹2,420', diff: '-₹30', status: 'Low' },
      { name: 'Dhar Mandi', price: '₹2,460', diff: '+₹10', status: 'Stable' },
    ]
  },
  'Potato': {
    Weekly: [1850, 1840, 1830, 1810, 1820, 1800, 1800],
    Monthly: [1920, 1880, 1850, 1820, 1800],
    SixMonths: [2100, 2050, 1980, 1900, 1850, 1800],
    dates: {
      Weekly: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      Monthly: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Today'],
      SixMonths: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
    },
    mandis: [
      { name: 'Indore Mandi', price: '₹1,800', diff: 'Base', status: 'Stable' },
      { name: 'Dewas Mandi', price: '₹1,780', diff: '-₹20', status: 'Low' },
      { name: 'Ujjain Mandi', price: '₹1,820', diff: '+₹20', status: 'High' },
      { name: 'Dhar Mandi', price: '₹1,810', diff: '+₹10', status: 'Stable' },
    ]
  },
  'Corn': {
    Weekly: [2040, 2060, 2070, 2080, 2090, 2100, 2100],
    Monthly: [1980, 2010, 2040, 2070, 2100],
    SixMonths: [1850, 1900, 1950, 2000, 2050, 2100],
    dates: {
      Weekly: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      Monthly: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Today'],
      SixMonths: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
    },
    mandis: [
      { name: 'Indore Mandi', price: '₹2,100', diff: 'Base', status: 'Stable' },
      { name: 'Dewas Mandi', price: '₹2,080', diff: '-₹20', status: 'Low' },
      { name: 'Ujjain Mandi', price: '₹2,120', diff: '+₹20', status: 'High' },
      { name: 'Dhar Mandi', price: '₹2,110', diff: '+₹10', status: 'Stable' },
    ]
  },
  'Onion': {
    Weekly: [3380, 3420, 3450, 3480, 3500, 3500, 3500],
    Monthly: [3100, 3220, 3350, 3480, 3500],
    SixMonths: [2400, 2600, 2900, 3200, 3400, 3500],
    dates: {
      Weekly: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      Monthly: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Today'],
      SixMonths: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
    },
    mandis: [
      { name: 'Indore Mandi', price: '₹3,500', diff: 'Base', status: 'Stable' },
      { name: 'Dewas Mandi', price: '₹3,560', diff: '+₹60', status: 'High' },
      { name: 'Ujjain Mandi', price: '₹3,480', diff: '-₹20', status: 'Low' },
      { name: 'Dhar Mandi', price: '₹3,520', diff: '+₹20', status: 'Stable' },
    ]
  },
  'Tomato': {
    Weekly: [2900, 3050, 3100, 3150, 3200, 3200, 3200],
    Monthly: [2700, 2850, 2980, 3120, 3200],
    SixMonths: [2200, 2400, 2650, 2800, 3000, 3200],
    dates: {
      Weekly: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      Monthly: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Today'],
      SixMonths: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
    },
    mandis: [
      { name: 'Indore Mandi', price: '₹3,200', diff: 'Base', status: 'Stable' },
      { name: 'Dewas Mandi', price: '₹3,280', diff: '+₹80', status: 'High' },
      { name: 'Ujjain Mandi', price: '₹3,150', diff: '-₹50', status: 'Low' },
      { name: 'Dhar Mandi', price: '₹3,210', diff: '+₹10', status: 'Stable' },
    ]
  },
  'Rice': {
    Weekly: [5520, 5500, 5480, 5460, 5450, 5450, 5450],
    Monthly: [5600, 5550, 5500, 5470, 5450],
    SixMonths: [5800, 5720, 5650, 5580, 5500, 5450],
    dates: {
      Weekly: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      Monthly: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Today'],
      SixMonths: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
    },
    mandis: [
      { name: 'Indore Mandi', price: '₹5,450', diff: 'Base', status: 'Stable' },
      { name: 'Dewas Mandi', price: '₹5,520', diff: '+₹70', status: 'High' },
      { name: 'Ujjain Mandi', price: '₹5,410', diff: '-₹40', status: 'Low' },
      { name: 'Dhar Mandi', price: '₹5,460', diff: '+₹10', status: 'Stable' },
    ]
  }
};

export default function PriceHistory() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Parse incoming navigation parameters
  const params = useLocalSearchParams();
  const rawCropName = params.crop || params.name || 'Wheat';
  const role = params.role || 'farmer'; // 'farmer' or 'buyer'

  // Standardize crop mapping
  let cropKey = 'Wheat';
  if (rawCropName.toLowerCase().includes('potato')) cropKey = 'Potato';
  else if (rawCropName.toLowerCase().includes('onion')) cropKey = 'Onion';
  else if (rawCropName.toLowerCase().includes('corn')) cropKey = 'Corn';
  else if (rawCropName.toLowerCase().includes('tomato')) cropKey = 'Tomato';
  else if (rawCropName.toLowerCase().includes('rice')) cropKey = 'Rice';

  const cropMeta = CROP_DATASETS[cropKey];

  const [timeframe, setTimeframe] = useState('Weekly'); // 'Weekly', 'Monthly', 'SixMonths'
  const [selectedIndex, setSelectedIndex] = useState(cropMeta[timeframe].length - 1);
  const [loading, setLoading] = useState(false);

  const priceData = cropMeta[timeframe];
  const dateLabels = cropMeta.dates[timeframe];

  // Dynamically switch datasets with an aesthetic simulation delay
  const handleTimeframeChange = (tf) => {
    setLoading(true);
    setTimeout(() => {
      setTimeframe(tf);
      setSelectedIndex(cropMeta[tf].length - 1);
      setLoading(false);
    }, 300);
  };

  // SVG Chart calculation parameters
  const minVal = Math.min(...priceData) * 0.98;
  const maxVal = Math.max(...priceData) * 1.02;
  const valRange = maxVal - minVal;

  const chartWidth = SCREEN_WIDTH - CHART_PADDING * 2;
  const stepX = chartWidth / (priceData.length - 1);

  // Generate SVG coordinates path
  const points = priceData.map((val, idx) => {
    const x = idx * stepX;
    const y = CHART_HEIGHT - ((val - minVal) / valRange) * CHART_HEIGHT;
    return { x, y, value: val };
  });

  let pathD = '';
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      pathD += ` L ${points[i].x} ${points[i].y}`;
    }
  }

  // Shadow polygon fill underneath path
  const closedPathD = pathD
    ? `${pathD} L ${points[points.length - 1].x} ${CHART_HEIGHT} L ${points[0].x} ${CHART_HEIGHT} Z`
    : '';

  const activePoint = points[selectedIndex] || points[points.length - 1];

  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950 pt-12">
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View className="pb-4 px-5 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ChevronLeft color={isDark ? '#ffffff' : '#006e2f'} size={24} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xl font-black text-gray-900 dark:text-zinc-100">{rawCropName}</Text>
          <Text className="text-xs text-gray-400 dark:text-zinc-500 font-bold">Mandi price trend analysis</Text>
        </View>
        <View className="bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-full flex-row items-center border border-green-200 dark:border-green-700">
          <Sparkles color="#10b981" size={13} />
          <Text className="text-green-700 dark:text-green-400 text-[10px] font-black ml-1 uppercase tracking-wider">AI Forecast</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
        className="flex-1 px-4 pt-4"
      >
        
        {/* Highlight Stats Dashboard */}
        <View className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-[28px] p-6 mb-5 shadow-sm">
          <View className="flex flex-row justify-between items-start mb-6">
            <View>
              <Text className="text-[10px] text-gray-400 dark:text-zinc-500 font-black uppercase tracking-wider mb-1">Selected Date Price</Text>
              <Text className="text-3xl font-black text-gray-900 dark:text-zinc-100">
                ₹{activePoint.value.toLocaleString()}<Text className="text-xs font-bold text-gray-400">/qtl</Text>
              </Text>
              <Text className="text-[10px] text-gray-400 font-bold mt-1">Date: {dateLabels[selectedIndex]}</Text>
            </View>
            <View className="items-end">
              <Text className="text-[10px] text-gray-400 dark:text-zinc-500 font-black uppercase tracking-wider mb-1">AI 30D Forecast</Text>
              <View className="flex-row items-center">
                <TrendingUp color="#10b981" size={14} />
                <Text className="text-[#10b981] font-black ml-1 text-base">Bullish</Text>
              </View>
              <Text className="text-[10px] text-gray-400 font-bold mt-1">94% Confidence</Text>
            </View>
          </View>

          {/* Timeframe selector tabs */}
          <View className="flex-row bg-gray-50 dark:bg-zinc-800/40 p-1 rounded-2xl border border-gray-150 dark:border-zinc-800 mb-6">
            {['Weekly', 'Monthly', 'SixMonths'].map((tf) => (
              <TouchableOpacity
                key={tf}
                onPress={() => handleTimeframeChange(tf)}
                className="flex-grow py-2 rounded-xl items-center"
                style={timeframe === tf ? {
                  backgroundColor: '#006e2f',
                  shadowColor: '#006e2f',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 1,
                } : null}
              >
                <Text className={`text-[10px] font-black uppercase tracking-wider ${timeframe === tf ? 'text-white' : 'text-gray-400'}`}>
                  {tf === 'SixMonths' ? '6 Months' : tf}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* SVG Price Chart */}
          <View className="items-center justify-center relative my-2">
            {loading ? (
              <View style={{ height: CHART_HEIGHT + 30 }} className="items-center justify-center">
                <ActivityIndicator color="#006e2f" size="large" />
              </View>
            ) : (
              <View>
                {/* SVG canvas */}
                <Svg width={chartWidth} height={CHART_HEIGHT + 30}>
                  <Defs>
                    <LinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <Stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                      <Stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </LinearGradient>
                  </Defs>

                  {/* Horizontal grid lines */}
                  <Line x1="0" y1={CHART_HEIGHT * 0.25} x2={chartWidth} y2={CHART_HEIGHT * 0.25} stroke={isDark ? "#27272a" : "#f4f4f5"} strokeWidth="1" strokeDasharray="4,4" />
                  <Line x1="0" y1={CHART_HEIGHT * 0.5} x2={chartWidth} y2={CHART_HEIGHT * 0.5} stroke={isDark ? "#27272a" : "#f4f4f5"} strokeWidth="1" strokeDasharray="4,4" />
                  <Line x1="0" y1={CHART_HEIGHT * 0.75} x2={chartWidth} y2={CHART_HEIGHT * 0.75} stroke={isDark ? "#27272a" : "#f4f4f5"} strokeWidth="1" strokeDasharray="4,4" />

                  {/* Gradient Area under line */}
                  <Path d={closedPathD} fill="url(#chartGradient)" />

                  {/* Price Line */}
                  <Path d={pathD} fill="none" stroke="#10b981" strokeWidth="3" />

                  {/* Coordinate tap points */}
                  {points.map((pt, idx) => (
                    <Circle
                      key={idx}
                      cx={pt.x}
                      cy={pt.y}
                      r={selectedIndex === idx ? "7" : "4"}
                      fill={selectedIndex === idx ? "#006e2f" : "#10b981"}
                      stroke="#ffffff"
                      strokeWidth={selectedIndex === idx ? "3" : "1.5"}
                      onPress={() => setSelectedIndex(idx)}
                    />
                  ))}
                </Svg>

                {/* Date Labels below chart */}
                <View className="flex-row justify-between mt-3 px-1">
                  {dateLabels.map((lbl, idx) => (
                    <TouchableOpacity key={idx} onPress={() => setSelectedIndex(idx)} className="items-center">
                      <Text className={`text-[10px] font-black ${selectedIndex === idx ? 'text-[#006e2f] dark:text-[#4ade80]' : 'text-gray-400'}`}>
                        {lbl}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Dynamic Advisory Section based on Role */}
        <View className="bg-[#004b1e] dark:bg-[#002109] rounded-[28px] p-6 mb-5 relative overflow-hidden shadow-sm">
          <View className="absolute -top-10 -right-10 w-28 h-28 bg-[#10b981] rounded-full opacity-20 blur-xl" />
          
          <View className="flex-row items-center mb-3">
            <Sparkles color="#10b981" size={18} />
            <Text className="text-white text-base font-extrabold ml-2">Smart Advisor Insights</Text>
          </View>

          {role === 'farmer' ? (
            <View>
              <Text className="text-white/80 text-xs font-semibold leading-5 mb-4">
                Wheat supplies are thinning due to increased exports in adjacent regions. Holding your stock for another 7-10 days might yield a 4.5% premium.
              </Text>
              <View className="flex-row gap-2 mt-2">
                <TouchableOpacity
                  onPress={() => router.push('/(farmer)/add-listing')}
                  className="flex-1 bg-white h-12 rounded-2xl items-center justify-center"
                >
                  <Text className="text-[#004b1e] font-black text-xs uppercase tracking-wider">Sell Now</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push('/(farmer)/listings')}
                  className="flex-1 bg-white/10 h-12 rounded-2xl items-center justify-center border border-white/20"
                >
                  <Text className="text-white font-black text-xs uppercase tracking-wider">Hold Inventory</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <Text className="text-white/80 text-xs font-semibold leading-5 mb-4">
                Prices have bottomed out relative to seasonal averages. It is highly recommended to secure wholesale logistics procurement contracts before seasonal demand triggers a correction.
              </Text>
              <View className="flex-row gap-2 mt-2">
                <TouchableOpacity
                  onPress={() => router.push('/(buyer)/dashboard')}
                  className="flex-1 bg-white h-12 rounded-2xl items-center justify-center"
                >
                  <Text className="text-[#004b1e] font-black text-xs uppercase tracking-wider">Browse Listings</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push('/(buyer)/insights')}
                  className="flex-1 bg-white/10 h-12 rounded-2xl items-center justify-center border border-white/20"
                >
                  <Text className="text-white font-black text-xs uppercase tracking-wider">Alert Me</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Mandi Arbitrage Section */}
        <View className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-[28px] p-6 mb-5 shadow-sm">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <MapPin color="#006e2f" size={16} />
              <Text className="text-sm font-black text-gray-900 dark:text-zinc-100 ml-2">Regional Mandi Prices</Text>
            </View>
            <View className="bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-lg border border-blue-200 dark:border-blue-700">
              <ArrowRightLeft color="#2563eb" size={10} />
            </View>
          </View>

          <Text className="text-[10px] text-gray-400 font-bold mb-4 leading-4">
            Compare wholesale rates across primary logistics junctions near your region.
          </Text>

          <View className="gap-y-3">
            {cropMeta.mandis.map((mandi, idx) => (
              <View key={idx} className="flex-row items-center justify-between py-2 border-b border-gray-100 dark:border-zinc-800/60 last:border-b-0">
                <Text className="text-xs text-gray-700 dark:text-zinc-300 font-bold">{mandi.name}</Text>
                <View className="flex-row items-center">
                  <Text className="text-xs text-gray-900 dark:text-zinc-100 font-black mr-4">{mandi.price}</Text>
                  <View className={`px-2 py-0.5 rounded-md ${
                    mandi.status === 'High' ? 'bg-emerald-50 dark:bg-emerald-950' : mandi.status === 'Low' ? 'bg-red-50 dark:bg-red-950' : 'bg-gray-50 dark:bg-zinc-800'
                  }`}>
                    <Text className={`text-[9px] font-black uppercase ${
                      mandi.status === 'High' ? 'text-emerald-700 dark:text-emerald-400' : mandi.status === 'Low' ? 'text-red-700' : 'text-gray-400'
                    }`}>
                      {mandi.diff}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}
