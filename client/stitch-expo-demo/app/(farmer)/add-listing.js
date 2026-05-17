import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StatusBar, Image, Alert, ActivityIndicator, Switch } from 'react-native';
import { 
  ChevronLeft, 
  Camera, 
  MapPin, 
  Info,
  Calendar,
  IndianRupee,
  Layers,
  ArrowRight,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useColorScheme } from 'nativewind';

const AddListing = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const params = useLocalSearchParams();

  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);
  const [isGrading, setIsGrading] = useState(false);
  const [grade, setGrade] = useState(null);

  // Auto pre-fill listing from AI Camera grading
  React.useEffect(() => {
    if (params.scannedGrade) {
      setGrade(params.scannedGrade);
      setImage(params.imageUri);
      if (params.suggestedPrice) {
        setPrice(params.suggestedPrice);
      }
      // Jump straight to step 2 to showcase the verified certificate!
      setStep(2);
    }
  }, [params.scannedGrade, params.suggestedPrice, params.imageUri]);
  
  // Form State
  const [cropType, setCropType] = useState('Wheat');
  const [variety, setVariety] = useState('');
  const [quantity, setQuantity] = useState('');
  const [insurance, setInsurance] = useState(false);
  const [unit, setUnit] = useState('kg');
  const [price, setPrice] = useState('');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      handleImageSelection(result.assets[0].uri);
    }
  };

  const takePhoto = () => {
    router.push('/(farmer)/camera-scanner');
  };

  const handleImageSelection = (uri) => {
    setImage(uri);
    setIsGrading(true);
    // Simulate AI grading
    setTimeout(() => {
      setIsGrading(false);
      setGrade('A+ Premium');
    }, 2000);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!cropType) {
        Alert.alert('Missing Info', 'Please select a crop type.');
        return;
      }
      if (!variety.trim()) {
        Alert.alert('Missing Info', 'Please enter the crop variety (e.g. Lokwan, Sharbati).');
        return;
      }
      if (!quantity.trim() || isNaN(quantity) || parseFloat(quantity) <= 0) {
        Alert.alert('Invalid Quantity', 'Please enter a valid positive quantity.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!image) {
        Alert.alert('Photo Required', 'Please capture or upload a crop photo for AI quality grading.');
        return;
      }
      setStep(3);
    } else {
      if (!price.trim() || isNaN(price) || parseFloat(price) <= 0) {
        Alert.alert('Invalid Price', 'Please enter a valid base price (greater than ₹0) for your produce.');
        return;
      }
      // Final submission (Simulate On-Chain Publish)
      Alert.alert(
        'Listing Published On-Chain!', 
        'Your harvest metadata has been hashed and verified on Polygon Amoy.\n\nHash: 0x8f2a...c391',
        [{ text: 'View on Explorer & Dashboard', onPress: () => router.push('/(farmer)/dashboard') }]
      );
    }
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950 pt-12">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Modern Cylindrical Header */}
      <View className="px-6 py-8 bg-[#004b1e] dark:bg-zinc-900 mx-2 mt-2 rounded-t-[100px] rounded-b-[40px] shadow-lg border border-gray-100 dark:border-zinc-800">
        <View className="flex-row items-center mb-1">
           <TouchableOpacity 
             onPress={() => step > 1 ? setStep(step - 1) : router.back()}
             className="w-10 h-10 bg-white/10 rounded-full items-center justify-center mr-3"
           >
              <ChevronLeft color="#ffffff" size={24} />
           </TouchableOpacity>
           <Text className="text-white/70 text-[10px] font-black uppercase tracking-widest">Step {step} of 3</Text>
        </View>
        <Text className="text-3xl text-white font-black">List Your Harvest</Text>
      </View>

      {/* Progress Bar */}
      <View className="flex-row h-1.5 bg-gray-200 dark:bg-zinc-800 mx-6 mt-6 rounded-full overflow-hidden">
        <View className={`flex-1 ${step >= 1 ? 'bg-[#10b981]' : ''}`} />
        <View className={`flex-1 ${step >= 2 ? 'bg-[#10b981]' : ''}`} />
        <View className={`flex-1 ${step >= 3 ? 'bg-[#10b981]' : ''}`} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-4 py-8">
        {step === 1 && (
          <View>
            <Text className="text-2xl text-gray-900 dark:text-zinc-100 font-black tracking-tight mb-1">Crop Details</Text>
            <Text className="text-sm text-gray-500 dark:text-zinc-400 font-bold mb-8">Tell us what you're selling today.</Text>

            <View className="mb-6">
              <Text className="text-xs text-gray-700 dark:text-zinc-400 font-black uppercase tracking-widest mb-3 ml-1">Select Crop Type</Text>
              <View className="flex-row flex-wrap">
                {['Wheat', 'Potato', 'Corn', 'Carrot', 'Rice', 'Onion'].map((crop) => (
                  <TouchableOpacity 
                    key={crop}
                    onPress={() => setCropType(crop)}
                    className={`${cropType === crop ? 'bg-[#10b981] border-[#10b981]' : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800'} border px-6 py-3 rounded-2xl mr-2 mb-2 shadow-sm`}
                  >
                    <Text className={`${cropType === crop ? 'text-white' : 'text-gray-700 dark:text-zinc-300'} font-black text-sm`}>{crop}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-xs text-gray-700 dark:text-zinc-400 font-black uppercase tracking-widest mb-3 ml-1">Variety / Type</Text>
              <TextInput 
                value={variety}
                onChangeText={setVariety}
                placeholder="e.g. Organic Roma, Hybrid"
                placeholderTextColor={isDark ? "#52525b" : "#9ca3af"}
                className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-5 rounded-2xl text-gray-900 dark:text-zinc-100 font-bold shadow-sm"
              />
            </View>

            <View className="flex-row justify-between mb-6">
              <View className="w-[48%]">
                <Text className="text-xs text-gray-700 dark:text-zinc-400 font-black uppercase tracking-widest mb-3 ml-1">Quantity</Text>
                <TextInput 
                  value={quantity}
                  onChangeText={setQuantity}
                  placeholder="e.g. 500"
                  placeholderTextColor={isDark ? "#52525b" : "#9ca3af"}
                  keyboardType="numeric"
                  className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-5 rounded-2xl text-gray-900 dark:text-zinc-100 font-bold shadow-sm"
                />
              </View>
              <View className="w-[48%]">
                <Text className="text-xs text-gray-700 dark:text-zinc-400 font-black uppercase tracking-widest mb-3 ml-1">Unit</Text>
                <TextInput 
                  value={unit}
                  onChangeText={setUnit}
                  placeholder="e.g. kg"
                  placeholderTextColor={isDark ? "#52525b" : "#9ca3af"}
                  className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-5 rounded-2xl text-gray-900 dark:text-zinc-100 font-bold shadow-sm"
                />
              </View>
            </View>
          </View>
        )}

        {step === 2 && (
          <View>
            <Text className="text-2xl text-gray-900 dark:text-zinc-100 font-black tracking-tight mb-1">Quality Analysis</Text>
            <Text className="text-sm text-gray-500 dark:text-zinc-400 font-bold mb-8">AI will help verify the grade of your crop.</Text>

            <View className="flex-row gap-4 mb-8">
              <TouchableOpacity 
                onPress={takePhoto}
                className="flex-1 bg-green-50 dark:bg-green-900/10 border-2 border-dashed border-[#10b981]/30 rounded-3xl h-48 items-center justify-center overflow-hidden"
              >
                {image ? (
                  <Image source={{ uri: image }} className="w-full h-full" resizeMode="cover" />
                ) : (
                  <>
                    <View className="w-14 h-14 bg-white dark:bg-zinc-800 rounded-2xl items-center justify-center mb-3 shadow-md">
                      <Camera color={isDark ? "#4ade80" : "#10b981"} size={28} />
                    </View>
                    <Text className="text-[#10b981] font-black text-xs uppercase tracking-widest">Take Photo</Text>
                  </>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={pickImage}
                className="flex-1 bg-white dark:bg-zinc-900 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl h-48 items-center justify-center"
              >
                <View className="w-14 h-14 bg-gray-50 dark:bg-zinc-800 rounded-2xl items-center justify-center mb-3">
                  <Layers color={isDark ? "#a1a1aa" : "#6b7280"} size={28} />
                </View>
                <Text className="text-gray-500 dark:text-zinc-400 font-black text-xs uppercase tracking-widest">Gallery</Text>
              </TouchableOpacity>
            </View>

            {(isGrading || grade) && (
              <View className="bg-white dark:bg-zinc-900 p-5 rounded-3xl flex-row items-center mb-8 border border-gray-100 dark:border-zinc-800 shadow-xl">
                <View className="w-14 h-14 bg-[#10b981] rounded-2xl items-center justify-center mr-4">
                  {isGrading ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <CheckCircle2 color="#ffffff" size={32} />
                  )}
                </View>
                <View className="flex-1">
                  <Text className="text-[10px] text-gray-500 dark:text-zinc-400 font-black uppercase tracking-widest mb-1">
                    {isGrading ? 'AI Analyzing...' : 'AI Predicted Grade'}
                  </Text>
                  <Text className={`text-2xl font-black ${isGrading ? 'text-gray-400 dark:text-zinc-600' : 'text-[#10b981]'}`}>
                    {isGrading ? 'Checking quality...' : grade}
                  </Text>
                </View>
              </View>
            )}
            
            {!image && (
               <View className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl flex-row items-center border border-blue-100 dark:border-blue-900/30">
                  <Info color={isDark ? "#60a5fa" : "#0061a4"} size={24} />
                  <Text className="flex-1 ml-4 text-xs text-blue-800 dark:text-blue-300 font-bold leading-5">
                    High resolution photos of the crop spread on a flat surface yield the most accurate results.
                  </Text>
               </View>
            )}
          </View>
        )}

        {step === 3 && (
          <View>
            <Text className="text-2xl text-gray-900 dark:text-zinc-100 font-black tracking-tight mb-1">Pricing & Logistics</Text>
            <Text className="text-sm text-gray-500 dark:text-zinc-400 font-bold mb-8">Finalize the financial and delivery details.</Text>

            <View className="mb-6">
              <Text className="text-xs text-gray-700 dark:text-zinc-400 font-black uppercase tracking-widest mb-3 ml-1">Base Price (per {unit === 'kg' ? 'quintal' : unit})</Text>
              <View className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex-row items-center px-5 rounded-2xl shadow-sm">
                <IndianRupee color={isDark ? "#a1a1aa" : "#64748b"} size={20} />
                <TextInput 
                  value={price}
                  onChangeText={setPrice}
                  placeholder="e.g. 2500"
                  placeholderTextColor={isDark ? "#52525b" : "#9ca3af"}
                  keyboardType="numeric"
                  className="flex-1 p-5 text-gray-900 dark:text-zinc-100 font-black text-lg"
                />
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-xs text-gray-700 dark:text-zinc-400 font-black uppercase tracking-widest mb-3 ml-1">Pickup Location</Text>
              <View className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-5 rounded-3xl flex-row items-center shadow-sm">
                <View className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-2xl items-center justify-center mr-4">
                  <MapPin color={isDark ? "#4ade80" : "#10b981"} size={24} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-black text-gray-900 dark:text-zinc-100">Indore Mandi, Area 7</Text>
                  <Text className="text-xs text-gray-500 dark:text-zinc-400 font-bold">Madhya Pradesh, India</Text>
                </View>
                <TouchableOpacity onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Location', description: 'Change location' } })}>
                   <Text className="text-[#10b981] font-black text-sm uppercase">Change</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Insurance Option */}
            <View className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-5 rounded-3xl mb-6 shadow-sm mt-6">
               <View className="flex-row justify-between items-center mb-3">
                  <View className="flex-row items-center">
                     <ShieldCheck color="#10b981" size={20} />
                     <Text className="text-base font-black text-gray-900 dark:text-zinc-100 ml-2">Opt for Insurance</Text>
                  </View>
                  <Switch 
                     value={insurance} 
                     onValueChange={setInsurance}
                     trackColor={{ false: '#e4e4e7', true: '#10b981' }}
                     thumbColor={isDark ? '#ffffff' : '#ffffff'}
                  />
               </View>
               <Text className="text-xs text-gray-500 dark:text-zinc-400 font-bold leading-5">Protect your crop against damage during transit or storage. Powered by our insurance partners.</Text>
            </View>
          </View>
        )}

        <View className="h-24" />
      </ScrollView>

      {/* Footer Button */}
      <View className="px-6 pb-32 pt-6 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 shadow-2xl">
        <TouchableOpacity 
          onPress={handleNext}
          className="bg-[#10b981] h-16 rounded-[24px] flex-row items-center justify-center shadow-xl shadow-green-500/30"
        >
          <Text className="text-white font-black text-lg uppercase tracking-widest mr-3">
            {step === 3 ? 'Publish Listing' : 'Next Step'}
          </Text>
          <ArrowRight color="#ffffff" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddListing;
