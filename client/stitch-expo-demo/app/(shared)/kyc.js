import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { ArrowLeft, ShieldCheck, Upload, FileText, Clock } from 'lucide-react-native';

export default function KYCVerification() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [isUploading, setIsUploading] = useState(false);
  const [extraDocs, setExtraDocs] = useState([]);

  const handleUpload = () => {
    Alert.alert(
      "Upload Document",
      "Choose a document type to upload",
      [
        { text: "GST Certificate", onPress: () => startMockUpload("GST Certificate") },
        { text: "Trade License", onPress: () => startMockUpload("Trade License") },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const startMockUpload = (docType) => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setExtraDocs(prev => [...prev, {
        id: Date.now().toString(),
        name: docType,
        sub: 'Verification in progress...',
        status: 'Pending'
      }]);
      Alert.alert("Success", `${docType} uploaded successfully and is currently under review.`);
    }, 2000);
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950">
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View className="px-6 pt-14 pb-4 flex-row items-center border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-full items-center justify-center mr-4">
          <ArrowLeft color={isDark ? "#ffffff" : "#000000"} size={20} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 dark:text-zinc-100">KYC Verification</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        <View className="bg-[#10b981]/10 border border-[#10b981]/30 p-5 rounded-2xl mb-8 flex-row items-center">
          <ShieldCheck color="#10b981" size={32} />
          <View className="ml-4 flex-1">
            <Text className="text-[#10b981] font-black text-lg">Verified Account</Text>
            <Text className="text-green-800 dark:text-green-400 text-xs mt-1">Your identity documents have been approved.</Text>
          </View>
        </View>

        <Text className="text-sm font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest mb-4 ml-1">Submitted Documents</Text>

        <View className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-4 mb-3 flex-row items-center shadow-sm">
          <View className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl items-center justify-center mr-4">
            <FileText color="#3b82f6" size={24} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-gray-900 dark:text-zinc-100">Aadhaar Card</Text>
            <Text className="text-sm text-gray-500 dark:text-zinc-400">xxxx-xxxx-4921</Text>
          </View>
          <View className="bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
            <Text className="text-green-700 dark:text-green-400 text-[10px] font-black uppercase">Approved</Text>
          </View>
        </View>

        <View className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-4 mb-3 flex-row items-center shadow-sm">
          <View className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl items-center justify-center mr-4">
            <FileText color="#a855f7" size={24} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-gray-900 dark:text-zinc-100">PAN Card</Text>
            <Text className="text-sm text-gray-500 dark:text-zinc-400">ABCDE1234F</Text>
          </View>
          <View className="bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
            <Text className="text-green-700 dark:text-green-400 text-[10px] font-black uppercase">Approved</Text>
          </View>
        </View>

        {extraDocs.map((doc) => (
          <View key={doc.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-4 mb-3 flex-row items-center shadow-sm">
            <View className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-xl items-center justify-center mr-4">
              <Clock color="#d97706" size={24} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-gray-900 dark:text-zinc-100">{doc.name}</Text>
              <Text className="text-sm text-gray-500 dark:text-zinc-400">{doc.sub}</Text>
            </View>
            <View className="bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded">
              <Text className="text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase">{doc.status}</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity 
          onPress={handleUpload}
          disabled={isUploading}
          className="mt-6 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-2xl p-6 items-center justify-center bg-gray-50 dark:bg-zinc-900/50"
        >
          {isUploading ? (
            <ActivityIndicator size="small" color="#10b981" />
          ) : (
            <Upload color={isDark ? "#a1a1aa" : "#9ca3af"} size={28} />
          )}
          <Text className="text-gray-500 dark:text-zinc-400 font-bold mt-2">
            {isUploading ? "Uploading to secure vault..." : "Upload Additional Document"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

