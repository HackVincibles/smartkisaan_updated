import React from 'react';
import { 
  User, Mail, Phone, MapPin, 
  ShieldCheck, CreditCard, Award, 
  ChevronRight, Camera, Settings,
  LogOut, ShoppingBag, 
  Zap, 
  Sparkles,
  Building2,
  FileText,
  BadgeCheck
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';

const BuyerProfilePage = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const stats = [
    { label: 'Network Trust', value: `${user.trustScore || 100}%`, icon: Award, color: 'blue', desc: 'Market Reputation' },
    { label: 'Procurement Tier', value: 'Bulk Merchant', icon: Building2, color: 'emerald', desc: 'Enterprise Access' },
    { label: 'KYC Verified', value: 'Verified', icon: BadgeCheck, color: 'purple', desc: 'Secure Identity' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* Premium Digital ID Header */}
      <div className="bg-gray-900 rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,_#3b82f6_0%,_transparent_40%)]"></div>
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,_#2563eb_0%,_transparent_40%)]"></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-12">
          <div className="relative group">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-48 h-48 rounded-[3.5rem] bg-white p-2 shadow-2xl relative z-10 overflow-hidden"
            >
              {user.profilePhoto ? (
                <img src={user.profilePhoto} alt={user.name} className="w-full h-full rounded-[3rem] object-cover" />
              ) : (
                <div className="w-full h-full rounded-[3rem] bg-gray-100 flex items-center justify-center text-blue-600">
                  <User size={80} strokeWidth={1} />
                </div>
              )}
            </motion.div>
            <button className="absolute -bottom-4 -right-4 p-5 bg-blue-600 text-white rounded-3xl shadow-2xl hover:scale-110 transition-transform z-20 border-4 border-gray-900">
              <Camera size={24} />
            </button>
            <div className="absolute -inset-4 bg-blue-500/20 rounded-[4rem] blur-2xl group-hover:bg-blue-500/30 transition-colors"></div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="space-y-2"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                <Sparkles size={14} className="text-blue-400" />
                Authorized Procurement ID
              </div>
              <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter">{user.name}</h1>
              <p className="text-blue-100/60 font-black uppercase tracking-[0.2em] text-xs">Registered Merchant • Global Network</p>
            </motion.div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <button className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-400 hover:text-white transition-all">
                Settings
              </button>
              <button onClick={logout} className="px-8 py-4 bg-white/10 backdrop-blur-xl text-white border border-white/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500/20 hover:border-red-500/50 transition-all">
                Terminate Session
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Reputation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden group"
          >
            <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
              <div className={`w-14 h-14 bg-${stat.color}-50 rounded-2xl flex items-center justify-center text-${stat.color}-600 border border-${stat.color}-100`}>
                <stat.icon size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black text-gray-900 italic tracking-tighter">{stat.value}</h3>
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">{stat.desc}</p>
            </div>
            <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-${stat.color}-400/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700`}></div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info Card */}
        <div className="bg-white rounded-[3.5rem] p-12 border border-gray-100 shadow-sm space-y-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <User size={24} />
            </div>
            <h3 className="text-2xl font-black text-gray-900">Communication Rails</h3>
          </div>
          
          <div className="space-y-8">
            {[
              { label: 'Mobile Link', value: user.phone || 'Not Synchronized', icon: Phone },
              { label: 'Digital Mail', value: user.email || 'Not Synchronized', icon: Mail },
              { label: 'Sourcing Hub', value: user.location?.lat ? 'Geographic Lock Active' : 'Market Location Empty', icon: MapPin }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <item.icon size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{item.label}</p>
                  <p className="text-lg font-black text-gray-900 tracking-tight">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Rails Card */}
        <div className="bg-white rounded-[3.5rem] p-12 border border-gray-100 shadow-sm space-y-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <CreditCard size={24} />
            </div>
            <h3 className="text-2xl font-black text-gray-900">Escrow Settlement</h3>
          </div>

          <div className="space-y-6">
            <div className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100 flex items-center justify-between group hover:bg-emerald-50 hover:border-emerald-100 transition-all cursor-pointer">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-emerald-600">Active UPI Rail</p>
                <p className="text-lg font-black text-gray-900">{user.upiId || 'Secure Link Missing'}</p>
              </div>
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-emerald-600 shadow-sm">
                <Zap size={20} />
              </div>
            </div>

            <div className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100 flex items-center justify-between group hover:bg-blue-50 hover:border-blue-100 transition-all cursor-pointer">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-blue-600">Banking Interface</p>
                <p className="text-lg font-black text-gray-900">
                  {user.bankAccount?.accountNumber ? `Linked (••${user.bankAccount.accountNumber.slice(-2)})` : 'Connect Core Account'}
                </p>
              </div>
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 shadow-sm">
                <Building2 size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <button className="flex items-center justify-between p-8 bg-white rounded-[2.5rem] border border-gray-100 hover:shadow-2xl hover:shadow-blue-900/5 transition-all group">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <div className="text-left space-y-1">
              <p className="font-black text-gray-900 tracking-tight">Security Vault</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Authentication & Data Lock</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
        </button>
        
        <button className="flex items-center justify-between p-8 bg-white rounded-[2.5rem] border border-gray-100 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all group">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div className="text-left space-y-1">
              <p className="font-black text-gray-900 tracking-tight">Enterprise Docs</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tax ID & Trade Licenses</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
        </button>
      </div>
    </div>
  );
};

export default BuyerProfilePage;
  );
};

export default BuyerProfilePage;
