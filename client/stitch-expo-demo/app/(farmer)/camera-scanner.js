import React, { useEffect, useRef, useState } from 'react';
import { useColorScheme } from 'nativewind';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, Easing, Modal, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { 
  ChevronLeft, 
  Image as ImageIcon, 
  Info, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  ScanLine
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');
const SCAN_BOX = width * 0.78;

export default function CameraScanner() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState('single');   // 'single' | 'multiple'
  const [scanningStage, setScanningStage] = useState('idle'); // 'idle' | 'analyzing' | 'done'
  const [countdown, setCountdown] = useState(3);
  const [gradeResult, setGradeResult] = useState(null);
  
  const cameraRef = useRef(null);
  const insets = useSafeAreaInsets();
  
  // Animated values for scanner grid
  const scanY = useRef(new Animated.Value(0)).current;
  const analysisPulse = useRef(new Animated.Value(0)).current;

  // Scanner sweep animation
  useEffect(() => {
    Animated.loop(
      Animated.timing(scanY, {
        toValue: SCAN_BOX - 4,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [scanY]);

  // Pulse animation during analysis
  useEffect(() => {
    if (scanningStage === 'analyzing') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(analysisPulse, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(analysisPulse, { toValue: 0, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
        ])
      ).start();

      // Countdown loop
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setScanningStage('done');
            setGradeResult({
              crop: 'Premium Wheat (Lot A)',
              grade: 'Grade A++',
              moisture: '14.1%',
              uniformity: '98.4%',
              impurities: '0.2%',
              suggestedPrice: '₹2,450 / qtl',
              gaslessHash: '0x8f2d...c34b'
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [scanningStage]);

  if (!permission) return <View style={styles.root} />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionBox}>
        <Text style={styles.permText}>Camera access needed to scan crops</Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function startScanningSimulation() {
    setCountdown(3);
    setScanningStage('analyzing');
  }

  function pickFromGallery() {
    Alert.alert("Gallery Selected", "Importing crop picture from local storage...", [
      { text: "Confirm", onPress: () => startScanningSimulation() }
    ]);
  }

  function finishInspection() {
    router.push({
      pathname: '/(farmer)/add-listing',
      params: { 
        scannedGrade: 'Grade A++', 
        suggestedPrice: '2450', 
        imageUri: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=600' 
      }
    });
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* FULL SCREEN CAMERA */}
      <CameraView style={StyleSheet.absoluteFillObject} facing="back" ref={cameraRef} />

      {/* DARK VIGNETTE OVERLAY */}
      <View style={styles.vignette} />

      {/* SCAN BOX OVERLAY */}
      <View style={styles.scanArea}>
        {/* Corner brackets */}
        {[
          {top:0,left:0,borderTopWidth:3,borderLeftWidth:3},
          {top:0,right:0,borderTopWidth:3,borderRightWidth:3},
          {bottom:0,left:0,borderBottomWidth:3,borderLeftWidth:3},
          {bottom:0,right:0,borderBottomWidth:3,borderRightWidth:3},
        ].map((s, i) => (
          <View key={i} style={[styles.corner, s]} />
        ))}

        {/* Animated scan line */}
        <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanY }] }]} />

        {/* FUTURISTIC AI BOUNDING BOX OVERLAY DURING SCAN */}
        {scanningStage === 'analyzing' && (
          <View className="absolute inset-0 items-center justify-center">
            {/* Main Center Box */}
            <View className="border border-emerald-400 bg-emerald-500/10 p-3 rounded-xl absolute top-10 left-6">
              <Text className="text-[8px] font-black text-emerald-400 uppercase tracking-wider">Lot Area #1</Text>
              <Text className="text-[10px] font-bold text-white">Wheat Grain Lot</Text>
              <Text className="text-[8px] text-emerald-300 font-bold">Purity: 99.8%</Text>
            </View>

            {/* Minor Spot Box */}
            <View className="border border-yellow-400 bg-yellow-500/10 p-2 rounded-lg absolute bottom-12 right-6">
              <Text className="text-[7px] font-black text-yellow-400 uppercase tracking-wider">Zone B</Text>
              <Text className="text-[8px] font-bold text-white">Moisture Node</Text>
              <Text className="text-[7px] text-yellow-300 font-bold">14.1% Optimal</Text>
            </View>

            {/* Glowing Scan Status Indicator */}
            <Animated.View 
              style={{ opacity: analysisPulse }} 
              className="bg-emerald-500 px-4 py-1.5 rounded-full flex-row items-center border border-emerald-400"
            >
              <Activity color="#ffffff" size={10} />
              <Text className="text-white text-[9px] font-black uppercase tracking-wider ml-1.5">
                AI Spec-Scan Active · {countdown}s
              </Text>
            </Animated.View>
          </View>
        )}
      </View>

      {/* FLOATING DIAGNOSTICS STATS PANEL */}
      {scanningStage === 'analyzing' && (
        <View className="absolute top-[68%] left-6 right-6 bg-black/85 border border-emerald-500/40 rounded-2xl p-4 flex-row justify-between items-center shadow-lg">
          <View>
            <Text className="text-[8px] font-black text-emerald-400 uppercase tracking-wider">Spectroscopic Diagnostics</Text>
            <Text className="text-sm font-black text-white mt-1">Analyzing Crop Moisture & Starch</Text>
          </View>
          <View className="items-end">
            <Text className="text-[10px] font-bold text-emerald-400">Moisture: 14.1%</Text>
            <Text className="text-[10px] font-bold text-emerald-400">Purity: 99.8%</Text>
          </View>
        </View>
      )}

      {/* TOP BAR */}
      <View style={[styles.topBar, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={{ position: 'absolute', left: 20, top: insets.top + 10 }} onPress={() => router.back()}>
          <ChevronLeft color="#fff" size={28} />
        </TouchableOpacity>
        <Text style={styles.topLabel}>AI Crop Inspector Camera</Text>
      </View>

      {/* MODE TOGGLE PILLS */}
      {scanningStage === 'idle' && (
        <View style={styles.toggleRow}>
          {['single', 'multiple'].map(m => (
            <TouchableOpacity 
              key={m} 
              style={[styles.pill, mode === m && styles.pillActive]}
              onPress={() => setMode(m)}
            >
              <Text style={[styles.pillText, mode === m && styles.pillTextActive]}>
                {m === 'single' ? 'Auto-Grade' : 'Batch Scan'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* BOTTOM ACTION BAR */}
      {scanningStage === 'idle' && (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 30 }]}>
          <TouchableOpacity style={styles.bottomAction} onPress={pickFromGallery}>
            <View style={styles.iconCircle}>
              <ImageIcon color="#fff" size={20} />
            </View>
            <Text style={styles.bottomLabel}>Gallery</Text>
          </TouchableOpacity>

          {/* Main scan button */}
          <TouchableOpacity style={styles.scanBtn} onPress={startScanningSimulation}>
            <View style={styles.scanBtnInner} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.bottomAction} 
            onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Photo Tips', description: 'Tips on how to take the best photos of your harvest' } })}
          >
            <View style={styles.iconCircle}>
              <Info color="#fff" size={20} />
            </View>
            <Text style={styles.bottomLabel}>Photo Tips</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* FULL SCREEN INSPECTION REPORT MODAL (done) */}
      <Modal transparent visible={scanningStage === 'done'} animationType="slide">
        <View className="flex-1 bg-black/80 justify-end">
          <View className="bg-white dark:bg-zinc-900 w-full rounded-t-[36px] p-6 pb-12 border-t border-gray-200 dark:border-zinc-800">
            {/* Header Lock */}
            <View className="align-self-center w-12 h-1 bg-gray-250 dark:bg-zinc-800 rounded-full mb-6" />

            <View className="flex-row items-center mb-6">
              <View className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/20 rounded-full items-center justify-center mr-4">
                <ShieldCheck color="#10b981" size={24} />
              </View>
              <View>
                <Text className="text-xs text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-wider">AI Quality Grading Complete</Text>
                <Text className="text-xl font-black text-gray-900 dark:text-zinc-100">Official Inspector Report</Text>
              </View>
            </View>

            {/* Results Grid */}
            <View className="bg-gray-50 dark:bg-zinc-800/40 border border-gray-150 dark:border-zinc-800 rounded-2xl p-5 mb-6">
               <View className="flex-row justify-between mb-3">
                 <Text className="text-xs text-gray-500 dark:text-zinc-400 font-bold">Projected Grade</Text>
                 <Text className="text-xs font-black text-[#10b981]">{gradeResult?.grade}</Text>
               </View>
               <View className="flex-row justify-between mb-3">
                 <Text className="text-xs text-gray-500 dark:text-zinc-400 font-bold">Moisture Content</Text>
                 <Text className="text-xs font-black text-gray-900 dark:text-zinc-100">{gradeResult?.moisture} (Ideal)</Text>
               </View>
               <View className="flex-row justify-between mb-3">
                 <Text className="text-xs text-gray-500 dark:text-zinc-400 font-bold">Impurity Factor</Text>
                 <Text className="text-xs font-black text-gray-900 dark:text-zinc-100">{gradeResult?.impurities}</Text>
               </View>
               <View className="flex-row justify-between mb-3">
                 <Text className="text-xs text-gray-500 dark:text-zinc-400 font-bold">Starch Uniformity</Text>
                 <Text className="text-xs font-black text-gray-900 dark:text-zinc-100">{gradeResult?.uniformity}</Text>
               </View>
               <View className="h-[1px] bg-gray-200 dark:bg-zinc-800 my-2" />
               <View className="flex-row justify-between">
                 <Text className="text-xs text-gray-600 dark:text-zinc-300 font-bold">Suggested Base Price</Text>
                 <Text className="text-xs font-black text-blue-600 dark:text-blue-400">{gradeResult?.suggestedPrice}</Text>
               </View>
            </View>

            <View className="flex-row items-start bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/40 mb-6">
               <Zap color="#059669" size={16} className="mt-0.5" />
               <View className="ml-3 flex-1">
                  <Text className="text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider mb-1">On-Chain Metadata Hash Signed</Text>
                  <Text className="text-emerald-700 dark:text-emerald-400 text-[9px] font-bold leading-4">
                    Grade verified under-the-hood. Metadata hash `{gradeResult?.gaslessHash}` locked inside platform database records to prevent post-inspection cargo manipulation.
                  </Text>
               </View>
            </View>

            {/* Confirm & Close Button */}
            <TouchableOpacity 
              onPress={finishInspection}
              className="bg-emerald-600 h-14 rounded-2xl items-center justify-center flex-row shadow-sm"
            >
              <Text className="text-white font-black text-base mr-2">Confirm & Apply Grade</Text>
              <ArrowRight color="#ffffff" size={18} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },

  vignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },

  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    alignItems: 'center', paddingHorizontal: 20,
    zIndex: 10,
  },
  topLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },

  scanArea: {
    position: 'absolute',
    top: '22%', alignSelf: 'center',
    width: SCAN_BOX, height: SCAN_BOX,
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute', width: 28, height: 28,
    borderColor: '#10b981',
  },
  scanLine: {
    position: 'absolute', left: 0, right: 0, height: 2,
    backgroundColor: 'rgba(16,185,129,0.85)',
  },

  toggleRow: {
    position: 'absolute', bottom: 140,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 100, padding: 4, gap: 4,
  },
  pill: { paddingHorizontal: 22, paddingVertical: 8, borderRadius: 100 },
  pillActive: { backgroundColor: '#10b981' },
  pillText: { color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: '700' },
  pillTextActive: { color: '#fff' },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 36,
  },
  bottomAction: { alignItems: 'center', gap: 4 },
  iconCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  bottomLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '700' },

  scanBtn: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#10b981',
    alignItems: 'center', justifyContent: 'center',
  },
  scanBtnInner: {
    width: 56, height: 56, borderRadius: 28,
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)',
  },

  permissionBox: { flex:1, alignItems:'center', justifyContent:'center', gap:16, backgroundColor:'#000' },
  permText: { color:'#fff', fontSize:15, fontWeight: '700' },
  permBtn: { backgroundColor:'#10b981', paddingHorizontal:24, paddingVertical:12, borderRadius:12 },
  permBtnText: { color:'#fff', fontWeight:'800' },
});
