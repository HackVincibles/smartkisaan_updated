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
  BadgeCheck,
  Fingerprint,
  Globe,
  Activity,
  Workflow,
  Lock,
  ArrowRight,
  MoreHorizontal,
  Clock,
  Cpu,
  Star,
  Shield,
  Target,
  Database,
  Cpu as CpuIcon,
  Layers,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const BuyerProfilePage = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const stats = [
    { label: 'NETWORK_REPUTATION', value: `${user.trustScore || 100}%`, icon: Award, color: 'text-secondary bg-secondary/5' },
    { label: 'PROCUREMENT_TIER', value: 'BULK_MERCHANT', icon: Building2, color: 'text-primary bg-primary/5' },
    { label: 'SOURCING_PULSE', value: 'VERIFIED_NODE', icon: Activity, color: 'text-success bg-success/5' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-20 pb-32 fade-in">
      {/* Premium Procurement Identity Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative overflow-hidden p-4">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-secondary italic">
            <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
            Authorized_Procurement_Identity v4.0.2 [SECURE]
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gray-950 tracking-tighter italic leading-none uppercase">
            Identity <span className="not-italic text-secondary">Vault.</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-xl text-xl leading-relaxed italic">
            Managing the institutional profile of <span className="text-gray-950 font-black italic uppercase">{user.name}</span>. Synchronized with the <span className="text-gray-950 font-black italic">global procurement lattice</span>.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-8 relative z-10">
            <button className="px-10 py-6 bg-white border border-gray-100 rounded-[2rem] flex items-center gap-5 font-black text-[11px] uppercase tracking-[0.4em] italic shadow-2xl shadow-gray-200/50 hover:bg-gray-950 hover:text-white transition-all text-gray-400 group">
                NETWORK_STATUS <Globe size={18} className="group-hover:rotate-180 transition-transform duration-1000" />
            </button>
            <button onClick={logout} className="px-10 py-6 bg-gray-950 text-white rounded-[2rem] flex items-center gap-5 font-black text-[11px] uppercase tracking-[0.4em] italic shadow-2xl shadow-gray-900/30 hover:bg-secondary transition-all group relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-5">TERMINATE_SESSION <LogOut size={18} /></span>
                <div className="absolute inset-0 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
        </div>

        {/* Decorative Background Text */}
        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none -mr-40 -mt-10">
            <h1 className="text-[20rem] font-black italic tracking-tighter uppercase leading-none">MERCHANT</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 px-4">
        {/* Merchant Identity Sidebar */}
        <div className="lg:col-span-4 space-y-16">
          <div className="stitch-card overflow-hidden group bg-white shadow-2xl shadow-gray-200/50 relative border-none">
            {/* High-Fidelity Banner */}
            <div className="h-56 bg-gray-950 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/40 to-transparent"></div>
                <div className="absolute inset-0 opacity-[0.05]">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <pattern id="buyer-grid-profile" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#buyer-grid-profile)" />
                    </svg>
                </div>
                {/* Scanner Beam */}
                <div className="absolute left-0 right-0 top-0 h-1 bg-secondary animate-scan opacity-40"></div>
            </div>
            
            <div className="px-12 pb-16 relative">
              <div className="relative -mt-28 mb-12 flex justify-center">
                <div className="w-56 h-56 rounded-[4rem] bg-white p-2 shadow-2xl group-hover:scale-105 transition-all duration-[1.5s] relative group/photo">
                  <div className="w-full h-full rounded-[3.5rem] overflow-hidden bg-gray-50 border border-gray-100">
                    {user.profilePhoto ? (
                      <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-200">
                        <User size={100} strokeWidth={1} />
                      </div>
                    )}
                  </div>
                  <button className="absolute bottom-6 right-6 p-6 bg-gray-950 text-white rounded-[1.8rem] shadow-2xl hover:bg-secondary transition-all group/btn border border-white/10 group-hover/photo:scale-110">
                    <Camera size={28} className="group-hover/btn:rotate-12 transition-transform" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-10 text-center">
                <div className="space-y-4">
                  <h2 className="text-5xl font-black text-gray-950 italic tracking-tighter leading-none uppercase group-hover:text-secondary transition-colors">{user.name}</h2>
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <span className="px-5 py-2 bg-secondary/10 text-secondary rounded-xl text-[10px] font-black uppercase tracking-[0.4em] italic border border-secondary/10 shadow-sm">
                      BULK_MERCHANT
                    </span>
                    <span className="px-5 py-2 bg-gray-50 text-gray-300 rounded-xl text-[10px] font-black uppercase tracking-[0.4em] italic border border-gray-100">
                      NODE_ID::{user._id?.slice(-12).toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <p className="text-lg font-bold text-gray-400 leading-relaxed italic px-6 uppercase opacity-60">
                  "Registered procurement lead specializing in regional cluster aggregation and institutional supply chain optimization."
                </p>

                <div className="pt-8">
                  <button className="w-full py-8 bg-gray-950 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.5em] italic hover:bg-secondary transition-all shadow-2xl shadow-gray-200 flex items-center justify-center gap-6 group/btn relative overflow-hidden">
                    <span className="relative z-10 flex items-center gap-6 uppercase">MODIFY_IDENTITY <Fingerprint size={24} className="group-hover/btn:scale-110 transition-transform duration-500" /></span>
                    <div className="absolute inset-0 bg-secondary opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Subtle Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-scanline opacity-[0.01]"></div>
          </div>

          {/* Sourcing Metrics Matrix */}
          <div className="stitch-card p-12 bg-gray-950 text-white space-y-12 shadow-2xl shadow-gray-950/40 relative overflow-hidden group">
            <div className="flex items-center gap-6 relative z-10">
                <div className="p-4 bg-white/5 rounded-2xl text-secondary border border-white/5 shadow-inner group-hover:rotate-12 transition-transform duration-700">
                    <Activity size={32} />
                </div>
                <h3 className="text-2xl font-black italic text-white tracking-tight uppercase">Sourcing Telemetry</h3>
            </div>
            <div className="space-y-10 relative z-10">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center justify-between group/stat">
                  <div className="flex items-center gap-8">
                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl border border-white/5 group-hover/stat:scale-110 transition-transform duration-700 ${stat.color}`}>
                      <stat.icon size={28} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-1.5 pt-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 italic leading-none group-hover/stat:text-white/60 transition-colors">{stat.label}</p>
                        <p className="text-2xl font-black italic tracking-tighter text-white leading-none uppercase">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-12 text-white/5 pointer-events-none group-hover:rotate-12 transition-transform duration-[3000ms]">
                <Cpu size={150} />
            </div>
          </div>
        </div>

        {/* Procurement Identity Ledger Area */}
        <div className="lg:col-span-8 space-y-16">
          {/* Institutional Credentials Terminal */}
          <div className="stitch-card p-12 md:p-16 bg-white shadow-2xl shadow-gray-200/50 space-y-16 relative overflow-hidden group/ledger border-none">
            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-6">
                  <div className="p-5 bg-gray-950 rounded-[1.8rem] text-white shadow-2xl group-hover/ledger:rotate-6 transition-transform duration-700">
                    <Building2 size={36} />
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <h3 className="text-4xl font-black text-gray-950 tracking-tighter italic leading-none uppercase">Institutional <span className="not-italic text-secondary">Ledger.</span></h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] italic leading-none">CORPORATE_PROCUREMENT_VERIFICATION</p>
                  </div>
                </div>
                <button className="p-5 bg-gray-50 rounded-[1.5rem] text-gray-300 hover:text-secondary hover:bg-white transition-all shadow-inner border border-transparent hover:border-gray-100">
                    <MoreHorizontal size={28} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
              <div className="space-y-12">
                <div className="flex items-start gap-8 group/item">
                  <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200 group-hover/item:text-secondary group-hover/item:bg-secondary/5 transition-all duration-700 border border-transparent group-hover/item:border-secondary/10 shadow-inner">
                    <Phone size={32} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-3 pt-2">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] italic leading-none">MOBILE_RELAY</p>
                    <p className="text-3xl font-black text-gray-950 italic tracking-tighter leading-none group-hover/item:text-secondary transition-colors">+91 {user.phone || '0000 000 000'}</p>
                    <button className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] italic flex items-center gap-3 group-hover/item:translate-x-2 transition-transform">
                        ENCRYPTED_UPLINK <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-8 group/item">
                  <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200 group-hover/item:text-secondary group-hover/item:bg-secondary/5 transition-all duration-700 border border-transparent group-hover/item:border-secondary/10 shadow-inner">
                    <Mail size={32} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-3 pt-2">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] italic leading-none">DIGITAL_MAIL_PROTOCOL</p>
                    <p className="text-3xl font-black text-gray-950 italic tracking-tighter leading-none truncate max-w-[280px] group-hover/item:text-secondary transition-colors uppercase">{user.email || 'NODE_OFFLINE'}</p>
                    <button className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] italic flex items-center gap-3 group-hover/item:translate-x-2 transition-transform">
                        SYNC_NEURAL_RELAY <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-12">
                <div className="flex items-start gap-8 group/item">
                  <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200 group-hover/item:text-secondary group-hover/item:bg-secondary/5 transition-all duration-700 border border-transparent group-hover/item:border-secondary/10 shadow-inner">
                    <MapPin size={32} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-3 pt-2">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] italic leading-none">GEOGRAPHIC_NODE_POSITION</p>
                    <p className="text-3xl font-black text-gray-950 italic tracking-tighter leading-none group-hover/item:text-secondary transition-colors uppercase">
                      {user.location?.lat ? 'SATELLITE_LOCK_ACTIVE' : 'MARKET_GPS_EMPTY'}
                    </p>
                    <button className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] italic flex items-center gap-3 group-hover/item:translate-x-2 transition-transform">
                        RECALIBRATE_POSITION <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-8 group/item">
                  <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-inner transition-all duration-700 border border-transparent ${user.isVerified ? 'bg-emerald-50 text-emerald-500 border-emerald-500/10' : 'bg-gray-50 text-gray-200 group-hover/item:border-secondary/10'}`}>
                    <BadgeCheck size={36} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-4 pt-2">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] italic leading-none">REPUTATION_TRUST_INDEX</p>
                    <p className={`text-3xl font-black italic tracking-tighter leading-none uppercase ${user.isVerified ? 'text-emerald-500' : 'text-gray-950'}`}>VERIFIED_MERCHANT</p>
                    <div className="flex gap-2 pt-1">
                      {[1, 2, 3, 4, 5].map(star => <Star key={star} size={16} className="fill-warning text-warning animate-pulse" style={{ animationDelay: `${star * 0.2}s` }} />)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] -mr-40 -mt-40 group-hover:scale-125 transition-transform duration-[3s]"></div>
            <div className="absolute bottom-0 right-0 p-12 text-gray-50 opacity-[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-[2s]">
                <Database size={250} />
            </div>
          </div>

          {/* Capital Settlement Rails Terminal */}
          <div className="stitch-card p-12 md:p-16 bg-white shadow-2xl shadow-gray-200/50 space-y-16 relative overflow-hidden group/rails border-none">
            <div className="flex justify-between items-center relative z-10">
              <div className="flex items-center gap-6">
                <div className="p-5 bg-gray-950 rounded-[1.8rem] text-white shadow-2xl group-hover/rails:rotate-6 transition-transform duration-700">
                    <CreditCard size={36} />
                </div>
                <div className="space-y-1.5 pt-1">
                    <h3 className="text-4xl font-black text-gray-950 tracking-tighter italic leading-none uppercase">Settlement <span className="not-italic text-secondary">Rails.</span></h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] italic leading-none">INSTITUTIONAL_CLEARING_INFRASTRUCTURE</p>
                </div>
              </div>
              <button className="p-5 bg-gray-50 rounded-[1.5rem] text-gray-300 hover:text-gray-950 hover:bg-white transition-all shadow-inner group/settings">
                <Settings size={32} className="group-hover/settings:rotate-90 transition-transform duration-700" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
              {/* UPI Rail */}
              <div className="p-12 rounded-[3.5rem] bg-gray-50 border border-gray-100 flex flex-col justify-between h-72 relative overflow-hidden group/card hover:bg-white hover:border-secondary/20 transition-all duration-1000 shadow-inner cursor-pointer">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                      <div className="w-1.5 h-6 bg-secondary rounded-full"></div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] italic leading-none">MERCHANT_UPI_PROTOCOL</p>
                  </div>
                  <p className="text-4xl font-black text-gray-950 italic tracking-tighter leading-none group-hover/card:text-secondary transition-colors uppercase">{user.upiId || 'BRIDGE_OFFLINE'}</p>
                </div>
                <div className="flex items-center gap-4 text-secondary font-black text-[11px] uppercase tracking-[0.3em] italic bg-secondary/5 w-fit px-6 py-3 rounded-2xl border border-secondary/10 shadow-2xl shadow-secondary/5 relative z-10">
                  <Zap size={18} className="fill-secondary animate-pulse" /> SETTLEMENT_ACTIVE_NOMINAL
                </div>
                <div className="absolute top-0 right-0 p-12 text-gray-100 group-hover/card:text-secondary/10 transition-all duration-[1.5s] group-hover/card:rotate-12">
                  <Workflow size={100} />
                </div>
              </div>

              {/* Bank Rail */}
              <div className="p-12 rounded-[3.5rem] bg-gray-950 text-white flex flex-col justify-between h-72 relative overflow-hidden group/bank shadow-2xl cursor-pointer">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                      <div className="w-1.5 h-6 bg-secondary rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] italic leading-none">CORPORATE_CLEARING_INTERFACE</p>
                  </div>
                  <p className="text-4xl font-black italic tracking-tighter leading-none group-hover/bank:text-secondary transition-colors">
                    {user.bankAccount?.accountNumber ? `•••• •••• ${user.bankAccount.accountNumber.slice(-4)}` : 'NODE_NOT_LINKED'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-6 relative z-10">
                   <div className="px-5 py-2.5 bg-white/5 backdrop-blur-3xl rounded-xl text-[10px] font-black uppercase tracking-[0.4em] italic border border-white/5 group-hover/bank:bg-white/10 transition-colors">
                     IFSC::{user.bankAccount?.ifscCode || 'NULL'}
                   </div>
                   <div className="px-5 py-2.5 bg-secondary/20 text-secondary rounded-xl text-[10px] font-black uppercase tracking-[0.4em] italic border border-secondary/20 shadow-2xl shadow-secondary/5">
                     VERIFIED_SIG_X6
                   </div>
                </div>
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-secondary/20 rounded-full blur-[120px] opacity-20 group-hover/bank:opacity-60 transition-opacity duration-[2s]"></div>
                <div className="absolute top-0 right-0 p-12 text-white/5 group-hover/bank:rotate-12 transition-transform duration-[1.5s]">
                    <Building2 size={120} />
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Governance Grid Terminal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
            <button className="flex items-center justify-between p-12 bg-white rounded-[4rem] border-none shadow-2xl shadow-gray-200/50 hover:shadow-secondary/10 hover:translate-y-[-5px] transition-all group overflow-hidden relative">
              <div className="flex items-center gap-8 relative z-10">
                <div className="w-20 h-20 rounded-[2.5rem] bg-secondary/5 text-secondary flex items-center justify-center group-hover:scale-110 transition-transform duration-700 shadow-inner border border-secondary/10">
                  <ShieldCheck size={36} className="stroke-[1.5]" />
                </div>
                <div className="text-left space-y-2 pt-1">
                  <p className="text-2xl font-black text-gray-950 italic tracking-tighter leading-none group-hover:text-secondary transition-colors uppercase">Security Vault</p>
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] italic leading-none">NEURAL_AUTH_DATA_LOCK</p>
                </div>
              </div>
              <ChevronRight size={32} className="text-gray-100 group-hover:text-secondary group-hover:translate-x-4 transition-all duration-700 relative z-10" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <div className="absolute bottom-0 right-0 p-12 text-gray-50 opacity-[0.03] pointer-events-none group-hover:rotate-12 transition-transform">
                  <Lock size={150} />
              </div>
            </button>
            
            <button className="flex items-center justify-between p-12 bg-white rounded-[4rem] border-none shadow-2xl shadow-gray-200/50 hover:shadow-primary/10 hover:translate-y-[-5px] transition-all group overflow-hidden relative">
              <div className="flex items-center gap-8 relative z-10">
                <div className="w-20 h-20 rounded-[2.5rem] bg-primary/5 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-700 shadow-inner border border-primary/10">
                  <FileText size={36} className="stroke-[1.5]" />
                </div>
                <div className="text-left space-y-2 pt-1">
                  <p className="text-2xl font-black text-gray-950 italic tracking-tighter leading-none group-hover:text-primary transition-colors uppercase">Trade Licenses</p>
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] italic leading-none">TAX_ID_COMPLIANCE_DOCS</p>
                </div>
              </div>
              <ChevronRight size={32} className="text-gray-100 group-hover:text-primary group-hover:translate-x-4 transition-all duration-700 relative z-10" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <div className="absolute bottom-0 right-0 p-12 text-gray-50 opacity-[0.03] pointer-events-none group-hover:rotate-12 transition-transform">
                  <Layers size={150} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerProfilePage;
