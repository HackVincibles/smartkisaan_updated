import React, { useState, useEffect } from 'react';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Plus, ShieldCheck, History, CreditCard, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../layout/DashboardLayout';
import WithdrawalModal from '@/components/wallet/WithdrawalModal';
import api from '../services/api';

const DigitalWallet = () => {
  const [balance, setBalance] = useState(124500);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [history, setHistory] = useState([
    { id: 1, type: 'CREDIT', amount: 45000, desc: 'Sale: Premium Basmati Rice', date: 'May 10, 2026', status: 'COMPLETED' },
    { id: 2, type: 'DEBIT', amount: 1200, desc: 'Group Buy: NPK Fertilizer', date: 'May 09, 2026', status: 'COMPLETED' },
    { id: 3, type: 'CREDIT', amount: 18000, desc: 'Sale: Organic Wheat', date: 'May 08, 2026', status: 'COMPLETED' },
  ]);

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <header>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Financial Vault</h1>
          <p className="text-gray-500 mt-1 text-lg">Secure earnings management and instant settlements.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Card */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-green-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="flex justify-between items-start relative z-10">
                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                  <WalletIcon className="w-8 h-8 text-green-400" />
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                  <ShieldCheck className="w-4 h-4 text-green-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-400">Escrow Protected</span>
                </div>
              </div>

              <div className="mt-12 relative z-10">
                <p className="text-gray-400 text-sm font-bold uppercase tracking-[0.2em] mb-4">Total Settled Balance</p>
                <div className="flex items-baseline gap-4">
                  <h2 className="text-6xl font-black tracking-tight">INR {balance.toLocaleString()}</h2>
                  <span className="text-2xl text-green-400 font-bold">.00</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-12 relative z-10">
                <button className="flex-1 py-5 bg-white text-black rounded-[1.5rem] font-black text-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-3">
                  <Plus className="w-6 h-6" /> Load Funds
                </button>
                <button 
                  onClick={() => setShowWithdraw(true)}
                  className="flex-1 py-5 bg-green-600 text-white rounded-[1.5rem] font-black text-lg hover:bg-green-700 shadow-xl shadow-green-900/40 transition-all flex items-center justify-center gap-3"
                >
                  <ArrowUpRight className="w-6 h-6" /> Withdraw to Bank
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex items-center gap-6">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Monthly Growth</p>
                  <h4 className="text-2xl font-black text-gray-900">+12,400</h4>
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex items-center gap-6">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                  <CreditCard className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pending Escrow</p>
                  <h4 className="text-2xl font-black text-gray-900">42,000</h4>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black text-gray-900">Activity</h3>
              <History className="w-6 h-6 text-gray-300" />
            </div>

            <div className="space-y-8 flex-1">
              {history.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                      tx.type === 'CREDIT' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {tx.type === 'CREDIT' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-gray-900 group-hover:text-green-600 transition-all">{tx.desc}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{tx.date}</p>
                    </div>
                  </div>
                  <div className={`text-sm font-black ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-gray-900'}`}>
                    {tx.type === 'CREDIT' ? '+' : '-'} {tx.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full py-4 mt-10 bg-gray-50 text-gray-400 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all">
              View All Transactions
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showWithdraw && (
          <WithdrawalModal 
            balance={balance} 
            onClose={() => setShowWithdraw(false)} 
            onSuccess={() => setBalance(prev => prev - 0)} // Real logic: balance - withdrawalAmount
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default DigitalWallet;
