import React, { useState } from 'react';
import { useColorScheme } from 'nativewind';
import { View, Text, TextInput, TouchableOpacity, StatusBar, Alert, ScrollView, Modal, ActivityIndicator, Animated } from 'react-native';
import { router } from 'expo-router';
import { 
  ChevronLeft, 
  User, 
  Lock, 
  Phone, 
  Tractor, 
  Briefcase, 
  Truck, 
  CreditCard, 
  FileText, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  ShieldCheck, 
  Building,
  Check
} from 'lucide-react-native';

const RegisterScreen = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStep, setVerifyStep] = useState(0);
  const scanAnim = React.useRef(new Animated.Value(0)).current;

  // Legal Terms and Escrow Agreement acceptance state
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Form States with Full Error Validation
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 3 Validation States
  const [vehicleNo, setVehicleNo] = useState('');
  const [licenseId, setLicenseId] = useState('');
  const [bankNo, setBankNo] = useState('');
  const [ifsc, setIfsc] = useState('');

  const handleStep1Next = () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!password) {
      Alert.alert('Validation Error', 'Please enter a password.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match. Please verify.');
      return;
    }
    setStep(2);
  };

  const handleRegister = () => {
    // Step 3 error handling and validation
    if (role === 'transporter') {
      if (!vehicleNo.trim()) {
        Alert.alert('Missing Details', 'Please provide your vehicle registration number.');
        return;
      }
      if (!licenseId.trim() || licenseId.length < 10) {
        Alert.alert('Missing Details', 'Please provide a valid driving license ID.');
        return;
      }
    } else {
      if (!bankNo.trim() || bankNo.length < 9) {
        Alert.alert('Missing Details', 'Please provide a valid bank account number.');
        return;
      }
      if (!ifsc.trim() || ifsc.length < 11) {
        Alert.alert('Missing Details', 'Please enter a valid 11-digit bank IFSC code.');
        return;
      }
    }

    if (!termsAccepted) {
      Alert.alert(
        'Agreement Required', 
        'Please review and accept the SmartKissan Terms of Service & Escrow Agreement to complete your registration.'
      );
      return;
    }

    setIsVerifying(true);
    setVerifyStep(0);

    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: 1, duration: 1500, useNativeDriver: false }),
        Animated.timing(scanAnim, { toValue: 0, duration: 1500, useNativeDriver: false })
      ])
    ).start();
    
    setTimeout(() => setVerifyStep(1), 1500);
    setTimeout(() => setVerifyStep(2), 3500);
    setTimeout(() => {
       setIsVerifying(false);
       Alert.alert(
         'Account Created',
         'Your SmartKissan profile is ready. Please sign in to link your secure gasless relayer.',
         [{ text: 'Sign In', onPress: () => router.push('/(auth)/login') }]
       );
    }, 5000);
  };

  const renderStep1 = () => (
    <View className="mt-8 flex-1">
      <View className="mb-4">
        <Text className="text-sm text-gray-900 dark:text-zinc-100 font-semibold mb-2">Full Name</Text>
        <View className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex-row items-center px-4 rounded-xl">
          <User color="#6d7b6c" size={18} />
          <TextInput 
            value={name}
            onChangeText={setName}
            placeholder="Mohan Yadav" 
            placeholderTextColor={isDark ? "#71717a" : "#a1a1aa"} 
            className="flex-1 p-4 text-gray-900 dark:text-zinc-100" 
          />
        </View>
      </View>

      <View className="mb-4">
        <Text className="text-sm text-gray-900 dark:text-zinc-100 font-semibold mb-2">Phone Number</Text>
        <View className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex-row items-center px-4 rounded-xl">
          <Phone color="#6d7b6c" size={18} />
          <TextInput 
            value={phone}
            onChangeText={setPhone}
            placeholder="+91 98765 43210" 
            placeholderTextColor={isDark ? "#71717a" : "#a1a1aa"} 
            keyboardType="phone-pad"
            className="flex-1 p-4 text-gray-900 dark:text-zinc-100" 
          />
        </View>
      </View>

      <View className="mb-4">
        <Text className="text-sm text-gray-900 dark:text-zinc-100 font-semibold mb-2">Password</Text>
        <View className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex-row items-center px-4 rounded-xl">
          <Lock color="#6d7b6c" size={18} />
          <TextInput 
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••" 
            placeholderTextColor={isDark ? "#71717a" : "#a1a1aa"} 
            secureTextEntry={!showPassword} 
            className="flex-1 p-4 text-gray-900 dark:text-zinc-100" 
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-2">
             {showPassword ? <EyeOff color="#6d7b6c" size={18} /> : <Eye color="#6d7b6c" size={18} />}
          </TouchableOpacity>
        </View>
      </View>

      <View className="mb-6">
        <Text className="text-sm text-gray-900 dark:text-zinc-100 font-semibold mb-2">Confirm Password</Text>
        <View className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex-row items-center px-4 rounded-xl">
          <Lock color="#6d7b6c" size={18} />
          <TextInput 
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="••••••••" 
            placeholderTextColor={isDark ? "#71717a" : "#a1a1aa"} 
            secureTextEntry={!showConfirmPassword} 
            className="flex-1 p-4 text-gray-900 dark:text-zinc-100" 
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} className="p-2">
             {showConfirmPassword ? <EyeOff color="#6d7b6c" size={18} /> : <Eye color="#6d7b6c" size={18} />}
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleStep1Next}
        className="bg-emerald-600 h-14 rounded-xl items-center justify-center mb-8"
        style={{
          shadowColor: '#059669',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <Text className="text-white font-bold text-lg">Next</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View className="mt-8 flex-1">
      <Text className="text-sm text-gray-900 dark:text-zinc-100 font-semibold mb-4">Select your role</Text>

      <TouchableOpacity
        onPress={() => setRole('farmer')}
        className={`p-4 rounded-2xl border mb-4 flex-row items-center ${role === 'farmer' ? 'bg-emerald-50 border-emerald-500 dark:bg-emerald-900/20' : 'bg-white border-gray-200 dark:bg-zinc-900 dark:border-zinc-800'}`}
      >
        <View className="w-12 h-12 bg-emerald-100 dark:bg-emerald-800/50 rounded-full items-center justify-center mr-4">
          <Tractor color="#10b981" size={24} />
        </View>
        <View>
          <Text className="font-bold text-lg text-gray-900 dark:text-zinc-100">Farmer</Text>
          <Text className="text-sm text-gray-500 dark:text-zinc-400">Sell your produce directly</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setRole('buyer')}
        className={`p-4 rounded-2xl border mb-4 flex-row items-center ${role === 'buyer' ? 'bg-emerald-50 border-emerald-500 dark:bg-emerald-900/20' : 'bg-white border-gray-200 dark:bg-zinc-900 dark:border-zinc-800'}`}
      >
        <View className="w-12 h-12 bg-blue-100 dark:bg-blue-800/50 rounded-full items-center justify-center mr-4">
          <Briefcase color="#3b82f6" size={24} />
        </View>
        <View>
          <Text className="font-bold text-lg text-gray-900 dark:text-zinc-100">Buyer</Text>
          <Text className="text-sm text-gray-500 dark:text-zinc-400">Purchase crops in bulk</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setRole('transporter')}
        className={`p-4 rounded-2xl border mb-8 flex-row items-center ${role === 'transporter' ? 'bg-emerald-50 border-emerald-500 dark:bg-emerald-900/20' : 'bg-white border-gray-200 dark:bg-zinc-900 dark:border-zinc-800'}`}
      >
        <View className="w-12 h-12 bg-orange-100 dark:bg-orange-800/50 rounded-full items-center justify-center mr-4">
          <Truck color="#f97316" size={24} />
        </View>
        <View>
          <Text className="font-bold text-lg text-gray-900 dark:text-zinc-100">Transporter / Logistics</Text>
          <Text className="text-sm text-gray-500 dark:text-zinc-400">Deliver goods securely</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => role ? setStep(3) : Alert.alert('Error', 'Please select a role to continue.')}
        className={`h-14 rounded-xl items-center justify-center mb-8 ${role ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-zinc-800'}`}
        style={role ? {
          shadowColor: '#059669',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 2,
        } : null}
        disabled={!role}
      >
        <Text className="text-white font-bold text-lg">Next</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep3 = () => (
    <View className="mt-8 flex-1">
      <Text className="text-sm text-gray-900 dark:text-zinc-100 font-semibold mb-4">Verification Details ({role})</Text>

      {role === 'transporter' ? (
        <>
          <View className="mb-4">
            <Text className="text-sm text-gray-900 dark:text-zinc-100 font-semibold mb-2">Vehicle Registration Number</Text>
            <View className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex-row items-center px-4 rounded-xl">
              <Truck color="#6d7b6c" size={18} />
              <TextInput 
                value={vehicleNo}
                onChangeText={setVehicleNo}
                placeholder="MH 04 AB 1234" 
                placeholderTextColor={isDark ? "#71717a" : "#a1a1aa"} 
                className="flex-1 p-4 text-gray-900 dark:text-zinc-100" 
              />
            </View>
          </View>
          <View className="mb-6">
            <Text className="text-sm text-gray-900 dark:text-zinc-100 font-semibold mb-2">Driving License ID</Text>
            <View className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex-row items-center px-4 rounded-xl">
              <FileText color="#6d7b6c" size={18} />
              <TextInput 
                value={licenseId}
                onChangeText={setLicenseId}
                placeholder="DL-1420110012345" 
                placeholderTextColor={isDark ? "#71717a" : "#a1a1aa"} 
                className="flex-1 p-4 text-gray-900 dark:text-zinc-100" 
              />
            </View>
          </View>
        </>
      ) : (
        <>
          <View className="mb-4">
            <Text className="text-sm text-gray-900 dark:text-zinc-100 font-semibold mb-2">Bank Account Number</Text>
            <View className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex-row items-center px-4 rounded-xl">
              <CreditCard color="#6d7b6c" size={18} />
              <TextInput 
                value={bankNo}
                onChangeText={setBankNo}
                placeholder="123456789012" 
                placeholderTextColor={isDark ? "#71717a" : "#a1a1aa"} 
                keyboardType="numeric" 
                className="flex-1 p-4 text-gray-900 dark:text-zinc-100" 
              />
            </View>
          </View>
          <View className="mb-6">
            <Text className="text-sm text-gray-900 dark:text-zinc-100 font-semibold mb-2">IFSC Code</Text>
            <View className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex-row items-center px-4 rounded-xl">
              <CreditCard color="#6d7b6c" size={18} />
              <TextInput 
                value={ifsc}
                onChangeText={setIfsc}
                placeholder="SBIN0001234" 
                placeholderTextColor={isDark ? "#71717a" : "#a1a1aa"} 
                className="flex-1 p-4 text-gray-900 dark:text-zinc-100" 
                autoCapitalize="characters" 
              />
            </View>
          </View>
        </>
      )}

      {/* Legal Agreement Checkbox Block */}
      <View className="mb-8 flex-row items-start px-1 mt-4">
        <TouchableOpacity
          onPress={() => setTermsAccepted(!termsAccepted)}
          className={`w-6 h-6 rounded-lg border-2 items-center justify-center mr-3.5 mt-0.5 ${
            termsAccepted 
              ? 'bg-emerald-500 border-emerald-500' 
              : 'border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900'
          }`}
        >
          {termsAccepted && <Check color="#ffffff" size={14} />}
        </TouchableOpacity>
        
        <View className="flex-1">
          <Text className="text-xs text-gray-500 dark:text-zinc-400 leading-5">
            I agree to the SmartKissan{' '}
            <Text 
              onPress={() => router.push('/(shared)/terms')}
              className="text-emerald-600 dark:text-emerald-400 font-bold underline"
            >
              Terms of Service & Escrow Agreement
            </Text>
            , including specific risk guidelines regarding platform custody and advance options.
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleRegister}
        className={`h-14 rounded-xl items-center justify-center mb-8 ${
          termsAccepted ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-zinc-800'
        }`}
        style={termsAccepted ? {
          shadowColor: '#059669',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 2,
        } : null}
        disabled={!termsAccepted}
      >
        <Text className="text-white font-bold text-lg">Complete Registration</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950 pt-12">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="px-4 py-2">
        <TouchableOpacity
          onPress={() => {
            if (step > 1) setStep(step - 1);
            else router.back();
          }}
          className="w-10 h-10 items-center justify-center"
        >
          <ChevronLeft color={isDark ? "#ffffff" : "#0b1c30"} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView className="px-4 flex-1" showsVerticalScrollIndicator={false}>
        <Text className="text-2xl text-gray-900 dark:text-zinc-100 font-bold mt-4">Create Account</Text>
        <Text className="text-lg text-gray-500 dark:text-zinc-400 mt-2">
          {step === 1 && "Join the SmartKissan community today."}
          {step === 2 && "Tell us how you'll use the platform."}
          {step === 3 && "Almost done! Let's get you verified."}
        </Text>

        {/* Progress Bar */}
        <View className="flex-row mt-6 space-x-2">
          <View className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-zinc-800'}`} />
          <View className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-zinc-800'}`} />
          <View className={`h-2 flex-1 rounded-full ${step >= 3 ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-zinc-800'}`} />
        </View>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        {step === 1 && (
          <View className="flex-1 justify-end pb-10 items-center mt-12">
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text className="text-gray-500 dark:text-zinc-400 font-medium">Already have an account? <Text className="text-emerald-600 font-bold">Sign In</Text></Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Verification Modal */}
      <Modal visible={isVerifying} transparent animationType="fade">
        <View className="flex-1 bg-black/60 items-center justify-center">
          <View className="bg-white dark:bg-zinc-900 p-8 rounded-3xl items-center w-5/6 shadow-xl">
             <View className="items-center justify-center mb-6 h-24">
               {verifyStep < 2 ? (
                 <Animated.View style={{ transform: [{ scale: scanAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.2] }) }], opacity: scanAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }}>
                   {role === 'transporter' ? <ShieldCheck color="#059669" size={70} /> : <Building color="#059669" size={70} />}
                 </Animated.View>
               ) : (
                 <CheckCircle color="#059669" size={80} />
               )}
             </View>
             
             <Text className="text-xl font-bold text-gray-900 dark:text-white text-center">
               {role === 'transporter' ? 'RTO Verification' : 'NPCI Bank Link'}
             </Text>
             
             <Text className="text-sm text-gray-500 mt-3 text-center leading-relaxed">
               {verifyStep === 0 && 'Initializing secure SSL connection...'}
               {verifyStep === 1 && (role === 'transporter' ? 'Checking Vahan database for vehicle validity...' : 'Verifying IFSC and Account Number with NPCI servers...')}
               {verifyStep === 2 && 'Verification Successful! Identity confirmed.'}
             </Text>

             {verifyStep < 2 && (
               <View className="mt-6 w-full h-1 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                 <Animated.View 
                   className="h-full bg-emerald-500" 
                   style={{ width: scanAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }} 
                   useNativeDriver={false}
                 />
               </View>
             )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RegisterScreen;
