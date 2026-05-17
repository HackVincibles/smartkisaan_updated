import React from 'react';
import { useColorScheme } from 'nativewind';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { Check, Globe, ArrowRight } from 'lucide-react-native';
import { useLanguage } from './(shared)/LanguageContext';

export default function LanguageSelection() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const { locale, setLocale, t } = useLanguage();

  const languages = [
    { id: 'en', name: 'English', native: 'English' },
    { id: 'hi', name: 'Hindi', native: 'हिन्दी' },
  ];

  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950 pt-16 px-6">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Visual Header */}
      <View className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/20 rounded-2xl items-center justify-center mb-8">
         <Globe color="#059669" size={32} />
      </View>
      
      <Text className="text-3xl text-gray-900 dark:text-zinc-100 font-black">
        {locale === 'hi' ? 'भाषा चुनें' : 'Choose Language'}
      </Text>
      <Text className="text-base text-gray-500 dark:text-zinc-400 mt-2">
        {locale === 'hi' 
          ? 'बेहतर अनुभव के लिए अपनी पसंदीदा भाषा चुनें।' 
          : 'Select your preferred language for a better experience.'}
      </Text>

      <View className="mt-10">
        {languages.map((lang) => {
          const isSelected = locale === lang.id;
          return (
            <TouchableOpacity 
              key={lang.id} 
              onPress={() => setLocale(lang.id)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 24,
                borderRadius: 16,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: isSelected 
                  ? '#059669' 
                  : (isDark ? '#27272a' : '#e4e4e7'),
                backgroundColor: isSelected 
                  ? (isDark ? 'rgba(5, 150, 105, 0.1)' : '#f0fdf4')
                  : (isDark ? '#18181b' : '#ffffff'),
              }}
            >
              <View>
                 <Text 
                   style={{
                     fontSize: 20,
                     fontWeight: 'bold',
                     color: isSelected ? '#059669' : (isDark ? '#f4f4f5' : '#111827')
                   }}
                 >
                   {lang.native}
                 </Text>
                 <Text className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">{lang.name}</Text>
              </View>
              {isSelected && (
                <View className="w-6 h-6 bg-emerald-500 rounded-full items-center justify-center">
                   <Check color="#ffffff" size={14} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View className="flex-1" />

      {/* Primary Action Button */}
      <TouchableOpacity
        onPress={() => router.push('/role-select')}
        style={{
          backgroundColor: '#059669',
          height: 56,
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          marginBottom: 48,
          shadowColor: '#059669',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 6,
          elevation: 3,
        }}
      >
        <Text className="text-white font-black text-base mr-2">
          {locale === 'hi' ? 'पुष्टि करें और आगे बढ़ें' : 'Confirm & Proceed'}
        </Text>
        <ArrowRight color="#ffffff" size={18} />
      </TouchableOpacity>
    </View>
  );
}
