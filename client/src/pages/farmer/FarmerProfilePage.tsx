import React from 'react';
import { 
  User, Mail, Phone, MapPin, 
  ShieldCheck, CreditCard, Award, 
  ChevronRight, Camera, Settings,
  LogOut,
  Zap,
  Globe,
  Briefcase,
  Star,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';

const FarmerProfilePage = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const stats = [
    { label: 'Trust Score', value: `${user.trustScore || 100}%`, icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Verification', value: user.isVerified ? 'Elite' : 'Standard', icon: Award, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Network', value: 'Level 4', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
          <span>Account</span>
          <ChevronRight size={10} />
          <span className="text-gray-900">Farmer Digital ID</span>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-all shadow-sm">
            Public View
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Card Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-sm overflow-hidden group">
            {/* Banner */}
            <div className="h-40 bg-gradient-to-br from-emerald-600 to-emerald-900 relative">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            </div>
            
            <div className="px-10 pb-10 relative">
              <div className="relative -mt-20 mb-6 flex justify-center lg:justify-start">
                <div className="w-40 h-40 rounded-[2.5rem] bg-white p-1 shadow-2xl group-hover:scale-105 transition-transform duration-500 relative">
                  {user.profilePhoto ? (
                    <img src={user.profilePhoto} alt={user.name} className="w-full h-full rounded-[2.25rem] object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-[2.25rem] bg-gray-50 flex items-center justify-center text-emerald-600">
                      <User size={64} />
                    </div>
                  )}
                  <button className="absolute bottom-2 right-2 p-4 bg-gray-900 text-white rounded-2xl shadow-xl hover:bg-emerald-600 transition-all">
                    <Camera size={20} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-4 text-center lg:text-left">
                <div>
                  <h1 className="text-3xl font-black text-gray-900 tracking-tight">{user.name}</h1>
                  <div className="flex items-center justify-center lg:justify-start gap-2 mt-1">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                      {user.role}
                    </span>
                    <span className="px-3 py-1 bg-gray-50 text-gray-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-100">
                      ID: {user._id?.slice(-6).toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm font-medium text-gray-500 leading-relaxed">
                  Third-generation farmer specializing in organic pulses and precision wheat cultivation. Rajasthan Cluster Hub.
                </p>

                <div className="pt-6 grid grid-cols-2 gap-4">
                  <button className="py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100">
                    Edit Identity
                  </button>
                  <button onClick={logout} className="py-4 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-all flex items-center justify-center gap-2">
                    <LogOut size={14} /> Exit
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gray-900 rounded-[3rem] p-8 text-white space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Performance Metrics</h3>
            <div className="space-y-6">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shadow-lg shadow-white/5`}>
                      <stat.icon size={20} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-tight text-gray-400">{stat.label}</span>
                  </div>
                  <span className="text-xl font-black italic">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Details Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Contact & Business Info */}
          <div className="bg-white rounded-[3.5rem] border border-gray-100 p-12 shadow-sm space-y-10">
            <div>
              <h3 className="text-2xl font-black text-gray-900 flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-gray-100">
                  <Globe size={24} />
                </div>
                Business Identification
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div className="flex items-start gap-5 group">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-emerald-600 transition-colors">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Mobile Interface</p>
                    <p className="text-xl font-black text-gray-900">+91 {user.phone || '0000 000 000'}</p>
                    <button className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1 hover:underline">Verify Linked SIM</button>
                  </div>
                </div>

                <div className="flex items-start gap-5 group">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-emerald-600 transition-colors">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Official Relay</p>
                    <p className="text-xl font-black text-gray-900">{user.email || 'Not connected'}</p>
                    <button className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1 hover:underline">Link Professional Email</button>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-5 group">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-emerald-600 transition-colors">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Geographic Node</p>
                    <p className="text-xl font-black text-gray-900">
                      {user.location?.lat ? `${user.location.lat.toFixed(4)}° N, ${user.location.lng.toFixed(4)}° E` : 'GPS Not Calibrated'}
                    </p>
                    <button className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1 hover:underline">Recalibrate Home Node</button>
                  </div>
                </div>

                <div className="flex items-start gap-5 group">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-emerald-600 transition-colors">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Farming Experience</p>
                    <p className="text-xl font-black text-gray-900">12 Harvest Cycles</p>
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map(star => <Star key={star} size={10} className="fill-orange-400 text-orange-400" />)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Infrastructure */}
          <div className="bg-white rounded-[3.5rem] border border-gray-100 p-12 shadow-sm space-y-10">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-gray-900 flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-gray-100">
                  <CreditCard size={24} />
                </div>
                Escrow Settlement Rails
              </h3>
              <button className="p-4 bg-gray-50 rounded-2xl text-emerald-600 hover:bg-emerald-50 transition-all border border-transparent hover:border-emerald-100">
                <Settings size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 rounded-[2.5rem] bg-gray-50 border border-gray-100 flex flex-col justify-between h-48 relative overflow-hidden group hover:bg-white hover:border-emerald-200 transition-all">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Primary UPI Bridge</p>
                  <p className="text-2xl font-black text-gray-900">{user.upiId || 'Not linked'}</p>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                  <ShieldCheck size={14} /> Encrypted Settlement
                </div>
                <div className="absolute top-0 right-0 p-8 text-gray-100 group-hover:text-emerald-50 transition-colors">
                  <ExternalLink size={40} />
                </div>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-gray-900 text-white flex flex-col justify-between h-48 relative overflow-hidden group">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Linked Clearing Account</p>
                  <p className="text-2xl font-black italic">
                    {user.bankAccount?.accountNumber ? `•••• •••• ${user.bankAccount.accountNumber.slice(-4)}` : 'No Bank Linked'}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                   <div className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest">
                     IFSC: {user.bankAccount?.ifscCode || 'NULL'}
                   </div>
                   <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
                     Verified
                   </div>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfilePage;
