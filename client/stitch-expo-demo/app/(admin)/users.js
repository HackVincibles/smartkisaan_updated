import React from 'react';
import { useColorScheme } from 'nativewind';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, TextInput, Alert } from 'react-native';
import { 
  ChevronLeft, 
  Search, 
  Filter, 
  UserCheck, 
  UserMinus, 
  ShieldAlert,
  MoreVertical,
  CheckCircle2
} from 'lucide-react-native';
import { router } from 'expo-router';

const UserManagement = () => {
  const users = [
    { id: 1, name: 'Amit Patel', role: 'Farmer', location: 'Surat, GJ', status: 'Verified', rating: 4.8 },
    { id: 2, name: 'FreshMart Ltd.', role: 'Buyer', location: 'Pune, MH', status: 'Pending', rating: 4.2 },
    { id: 3, name: 'LogiLink Pro', role: 'Transporter', location: 'Indore, MP', status: 'Verified', rating: 4.9 },
    { id: 4, name: 'Kishan Sahay', role: 'Farmer', location: 'Nagpur, MH', status: 'Flagged', rating: 3.5 },
  ];

  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950 pt-12">
      <StatusBar style={isDark ? "light" : "dark"} />
      
      {/* Header */}
      <View className="px-4 flex-row items-center py-2 border-b border-gray-200 dark:border-zinc-800">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center mr-2">
          <ChevronLeft color={isDark ? "#ffffff" : "#0b1c30"} size={24} />
        </TouchableOpacity>
        <Text className="text-xl text-gray-900 dark:text-zinc-100 font-bold">User Management</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-4">
        
        {/* Search & Filter */}
        <View className="flex-row items-center mt-4 space-x-sm">
           <View className="flex-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 h-12 rounded-xl flex-row items-center px-4 shadow-sm">
              <Search color={isDark ? "#a1a1aa" : "#64748b"} size={18} />
              <TextInput placeholder="Search by name or role..." className="flex-1 ml-4" />
           </View>
           <TouchableOpacity 
             onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Filter', description: 'Advanced user filters' } })}
             className="w-12 h-12 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl items-center justify-center"
           >
              <Filter color={isDark ? "#ffffff" : "#0f172a"} size={20} />
           </TouchableOpacity>
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-6 py-2">
           {['All Users', 'Farmers', 'Buyers', 'Transporters', 'Flagged'].map((tab, i) => (
             <TouchableOpacity 
               key={tab} 
               onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'Filter Applied', description: 'Filtering by: ${tab}' } })}
               className={`px-4 py-2 rounded-full mr-2 border ${i === 0 ? 'bg-primary border-primary' : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800'}`}
             >
                <Text className={`text-sm font-bold ${i === 0 ? 'text-white' : 'text-gray-500 dark:text-zinc-400'}`}>{tab}</Text>
             </TouchableOpacity>
           ))}
        </ScrollView>

        <Text className="text-xs text-gray-500 dark:text-zinc-400 font-bold mt-8 mb-4 uppercase">ACTIVE DIRECTORY</Text>

        {users.map((user) => (
          <TouchableOpacity 
            key={user.id} 
            onPress={() => router.push({ pathname: '/coming-soon', params: { title: 'User Profile', description: 'Viewing profile for ${user.name}' } })}
            className="bg-white dark:bg-zinc-900 rounded-2xl p-4 mb-4 border border-gray-200 dark:border-zinc-800 shadow-sm"
          >
             <View className="flex-row justify-between items-start">
                <View className="flex-row items-center">
                   <View className="w-12 h-12 bg-gray-100 dark:bg-zinc-800/50 rounded-full items-center justify-center mr-4">
                      <Text className="text-gray-900 dark:text-zinc-100 font-bold text-xl">{user.name[0]}</Text>
                   </View>
                   <View>
                      <Text className="text-lg font-bold text-gray-900 dark:text-zinc-100">{user.name}</Text>
                      <View className="flex-row items-center">
                         <Text className="text-xs text-gray-500 dark:text-zinc-400">{user.role} • {user.location}</Text>
                      </View>
                   </View>
                </View>
                <TouchableOpacity 
                  onPress={(e) => {
                    e.stopPropagation();
                    router.push({ pathname: '/coming-soon', params: { title: 'Options', description: 'More options for ${user.name}' } });
                  }}
                  className="p-1"
                >
                   <MoreVertical color={isDark ? "#a1a1aa" : "#64748b"} size={18} />
                </TouchableOpacity>
             </View>

             <View className="h-[1px] bg-outline-variant/30 my-md" />

             <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                   <View className={`px-2 py-0.5 rounded flex-row items-center ${
                      user.status === 'Verified' ? 'bg-green-100' : 
                      user.status === 'Pending' ? 'bg-amber-100' : 'bg-red-100'
                   }`}>
                      {user.status === 'Verified' ? <UserCheck color="#006e2f" size={12} /> : 
                       user.status === 'Pending' ? <CheckCircle2 color="#d97706" size={12} /> : 
                       <ShieldAlert color="#dc2626" size={12} />}
                      <Text className={`text-[10px] font-bold ml-1 uppercase ${
                         user.status === 'Verified' ? 'text-green-700' : 
                         user.status === 'Pending' ? 'text-amber-700' : 'text-red-700'
                      }`}>{user.status}</Text>
                   </View>
                   <Text className="text-xs text-gray-500 dark:text-zinc-400 font-bold ml-4">★ {user.rating}</Text>
                </View>
                <View className="flex-row space-x-sm">
                   <TouchableOpacity 
                     onPress={(e) => {
                       e.stopPropagation();
                       router.push({ pathname: '/coming-soon', params: { title: 'Edit User', description: 'Edit permissions for ${user.name}' } });
                     }}
                     className="bg-gray-100 dark:bg-zinc-800/50-high px-4 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-800"
                   >
                      <Text className="text-gray-900 dark:text-zinc-100 font-bold text-[10px]">EDIT</Text>
                   </TouchableOpacity>
                   <TouchableOpacity 
                     onPress={(e) => {
                       e.stopPropagation();
                       router.push({ pathname: '/coming-soon', params: { title: 'Block User', description: 'Are you sure you want to block ${user.name}?' } });
                     }}
                     className="bg-error-container px-4 py-1.5 rounded-lg border border-error/20"
                   >
                      <Text className="text-error font-bold text-[10px]">BLOCK</Text>
                   </TouchableOpacity>
                </View>
             </View>
          </TouchableOpacity>
        ))}

        <View className="h-10" />
      </ScrollView>
    </View>
  );
};

export default UserManagement;
