import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Building, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface WithdrawalModalProps {
  balance: number;
  onClose: () => void;
  onSuccess: () => void;
}

const WithdrawalModal = ({ balance, onClose, onSuccess }: WithdrawalModalProps) => {
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleWithdraw = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl relative overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-50 rounded-xl transition-all">
          <X className="w-6 h-6 text-gray-400" />
        </button>

        {step === 1 ? (
          <div className="p-10 space-y-8">
            <div className="text-center space-y-2">
              <h3 className="text-3xl font-black text-gray-900">Withdraw Funds</h3>
              <p className="text-gray-500 font-medium">Transfer money to your linked bank account</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-[2rem] space-y-4">
              <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span>Available Balance</span>
                <span>INR {balance.toLocaleString()}</span>
              </div>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-400">INR</span>
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-20 pr-6 py-6 bg-white border-2 border-transparent rounded-2xl focus:border-green-600 focus:outline-none transition-all text-3xl font-black text-gray-900"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="bg-green-50 border border-green-100 p-6 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-green-600 shadow-sm">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Linked Bank</p>
                <p className="text-sm font-black text-gray-900">SBI •••• 8210</p>
              </div>
            </div>

            <button
              onClick={handleWithdraw}
              disabled={!amount || Number(amount) > balance || loading}
              className="w-full py-5 bg-green-600 text-white rounded-2xl font-black text-lg hover:bg-green-700 shadow-xl shadow-green-100 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : <>Withdraw Now <ArrowRight className="w-5 h-5" /></>}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-green-600" /> Instant Settlement Protected
            </div>
          </div>
        ) : (
          <div className="p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto text-white shadow-xl shadow-green-100">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-gray-900">Transfer Initiated</h3>
              <p className="text-gray-500 font-medium mt-2">INR {Number(amount).toLocaleString()} will be credited to your account within 2 hours.</p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-black transition-all"
            >
              Done
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default WithdrawalModal;
