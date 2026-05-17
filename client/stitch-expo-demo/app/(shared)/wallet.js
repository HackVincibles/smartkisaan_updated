import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { 
  ChevronLeft, 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History,
  CreditCard,
  Plus
} from 'lucide-react-native';

const WalletScreen = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const transactions = [
    { id: 1, title: 'Payment for Order #8422', date: 'Oct 24, 2025', amount: '+₹12,450', type: 'credit' },
    { id: 2, title: 'Fuel Expense - V8821', date: 'Oct 23, 2025', amount: '-₹3,200', type: 'debit' },
    { id: 3, title: 'Withdrawal to HDFC Bank', date: 'Oct 20, 2025', amount: '-₹10,000', type: 'debit' },
    { id: 4, title: 'Payment for Order #8311', date: 'Oct 18, 2025', amount: '+₹8,900', type: 'credit' },
  ];

  const [balance, setBalance] = React.useState(24850.00);
  const [txs, setTxs] = React.useState(transactions);

  const handleAddMoney = () => {
    alert('Razorpay modal opening... simulating addition of ₹5,000');
    setBalance(prev => prev + 5000);
    setTxs([{ id: Date.now(), title: 'Added via UPI', date: 'Just now', amount: '+₹5,000', type: 'credit' }, ...txs]);
  };

  const handleWithdraw = () => {
    if(balance < 1000) return alert('Insufficient balance');
    alert('Withdrawal initiated! Funds moving to HDFC...');
    setBalance(prev => prev - 1000);
    setTxs([{ id: Date.now(), title: 'Withdrawal to HDFC Bank', date: 'Just now', amount: '-₹1,000', type: 'debit' }, ...txs]);
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-zinc-950">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View className="pt-14 pb-6 px-6 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ChevronLeft color={isDark ? "#ffffff" : "#0f172a"} size={24} />
        </TouchableOpacity>
        <Text className="text-2xl font-black text-gray-900 dark:text-zinc-100">My Wallet</Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <View className="bg-gray-900 dark:bg-zinc-100 rounded-[40px] p-8 mb-8 shadow-2xl relative overflow-hidden">
           <View className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 dark:bg-black/10 rounded-full" />
           
           <View className="flex-row items-center mb-6">
              <View className="w-10 h-10 bg-white/10 dark:bg-black/10 rounded-full items-center justify-center mr-3">
                 <WalletIcon color={isDark ? "#1e293b" : "#ffffff"} size={20} />
              </View>
              <Text className="text-white/60 dark:text-zinc-500 font-black text-[10px] uppercase tracking-widest">Available Balance</Text>
           </View>
           
           <Text className="text-white dark:text-zinc-900 text-5xl font-black tracking-tighter">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
           
            <View className="flex-row mt-8 gap-3">
              <TouchableOpacity 
                onPress={handleWithdraw}
                className="flex-1 bg-white/10 dark:bg-black/10 h-14 rounded-2xl items-center justify-center flex-row"
              >
                 <ArrowUpRight color={isDark ? "#1e293b" : "#ffffff"} size={18} />
                 <Text className="text-white dark:text-zinc-900 font-black ml-2">Withdraw</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleAddMoney}
                className="flex-1 bg-[#10b981] h-14 rounded-2xl items-center justify-center flex-row"
              >
                 <Plus color="#ffffff" size={18} />
                 <Text className="text-white font-black ml-2">Add Money</Text>
              </TouchableOpacity>
           </View>
        </View>

        {/* Bank Accounts */}
        <View className="flex-row justify-between items-center mb-4 px-1">
           <Text className="text-xl font-black text-gray-900 dark:text-zinc-100">Linked Accounts</Text>
           <TouchableOpacity onPress={() => router.push('/(shared)/payment-methods')}>
              <Text className="text-[#10b981] font-black text-sm">Manage</Text>
           </TouchableOpacity>
        </View>

        <View className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-5 mb-8 flex-row items-center shadow-sm">
           <View className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl items-center justify-center mr-4">
              <CreditCard color="#2563eb" size={24} />
           </View>
           <View className="flex-1">
              <Text className="text-gray-900 dark:text-zinc-100 font-black text-base">HDFC Bank</Text>
              <Text className="text-gray-500 dark:text-zinc-400 text-xs font-bold">•••• 8422</Text>
           </View>
           <View className="bg-green-100 dark:bg-green-900/40 px-3 py-1 rounded-full">
              <Text className="text-green-700 dark:text-green-400 text-[10px] font-black uppercase">Primary</Text>
           </View>
        </View>

        {/* Transactions */}
        <View className="flex-row justify-between items-center mb-4 px-1">
           <Text className="text-xl font-black text-gray-900 dark:text-zinc-100">Recent Activity</Text>
           <TouchableOpacity>
              <History color={isDark ? "#a1a1aa" : "#64748b"} size={20} />
           </TouchableOpacity>
        </View>

        {txs.map((tx) => (
          <TouchableOpacity 
            key={tx.id}
            className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl p-4 mb-3 flex-row items-center shadow-sm"
          >
            <View className={`w-12 h-12 rounded-2xl items-center justify-center mr-4 ${tx.type === 'credit' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
               {tx.type === 'credit' ? <ArrowDownLeft color="#10b981" size={20} /> : <ArrowUpRight color="#ef4444" size={20} />}
            </View>
            <View className="flex-1">
               <Text className="text-gray-900 dark:text-zinc-100 font-black text-sm mb-1">{tx.title}</Text>
               <Text className="text-gray-500 dark:text-zinc-400 text-[10px] font-bold uppercase">{tx.date}</Text>
            </View>
            <Text className={`font-black text-base ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>{tx.amount}</Text>
          </TouchableOpacity>
        ))}

        <View className="h-20" />
      </ScrollView>
    </View>
  );
};

export default WalletScreen;
