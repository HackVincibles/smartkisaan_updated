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
  ChevronLeft,
  Fingerprint,
  Cpu,
  Workflow,
  Lock,
  ArrowRight,
  MoreHorizontal,
  Clock,
  Activity,
  Layers,
  Sparkles,
  ChevronDown,
  Target
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const FarmerProfilePage = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const stats = [
    { label: 'Trust Score', value: `${user.trustScore || 100}%`, icon: ShieldCheck, color: 'primary' },
    { label: 'Verification', value: user.isVerified ? 'Elite Node' : 'Standard', icon: Award, color: 'secondary' },
    { label: 'Network Pulse', value: 'Level 4', icon: Activity, color: 'tertiary' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-20 pb-32 fade-in">
      {/* Premium Profile Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative overflow-hidden p-4">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
            Sovereign Digital Identity v9.1.0 [AUTHORIZED]
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gray-950 tracking-tighter italic leading-none">
            Identity <span className="not-italic text-primary">Core.</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-xl text-xl leading-relaxed italic">
            Managing the institutional profile of <span className="text-gray-950 font-black italic">{user.name}</span>. Synchronized with the <span className="text-gray-950 font-black italic">global agricultural ledger</span> and regional hub verification.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-8 relative z-10">
            <button className="px-10 py-6 bg-white border border-gray-100 rounded-[2rem] flex items-center gap-4 font-black text-[10px] uppercase tracking-[0.4em] italic shadow-2xl shadow-gray-200/50 hover:bg-gray-50 transition-all text-gray-400">
                PUBLIC VIEW <Globe size={18} />
            </button>
            <button onClick={logout} className="px-10 py-6 bg-gray-950 text-white rounded-[2rem] flex items-center gap-4 font-black text-[10px] uppercase tracking-[0.4em] italic shadow-2xl shadow-gray-950/20 hover:bg-error transition-all">
                TERMINATE SESSION <LogOut size={18} />
            </button>
        </div>

        {/* Decorative Background Text */}
        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none -mr-20 -mt-10">
            <h1 className="text-[20rem] font-black italic tracking-tighter uppercase">NODE</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 px-4">
        {/* Profile Identity Sidebar */}
        <div className="lg:col-span-4 space-y-12">
          <div className="stitch-card overflow-hidden group bg-white shadow-2xl shadow-gray-200/50 relative">
            {/* High-Fidelity Banner */}
            <div className="h-64 bg-gray-950 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-transparent opacity-60"></div>
                {/* Abstract Data Viz Elements */}
                <div className="absolute inset-0 opacity-[0.03]">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <pattern id="profile-grid-premium" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.2"/>
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#profile-grid-premium)" />
                        <circle cx="80" cy="20" r="30" fill="white" fillOpacity="0.5" />
                    </svg>
                </div>
            </div>
            
            <div className="px-12 pb-16 relative">
              <div className="relative -mt-32 mb-12 flex justify-center">
                <div className="w-56 h-56 rounded-[3.5rem] bg-white p-2 shadow-2xl group-hover:scale-105 transition-all duration-1000 relative">
                  <div className="w-full h-full rounded-[3rem] overflow-hidden bg-gray-50 border border-gray-100">
                    {user.profilePhoto ? (
                      <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary/20">
                        <User size={100} className="stroke-[1]" />
                      </div>
                    )}
                  </div>
                  <button className="absolute bottom-4 right-4 p-6 bg-gray-950 text-white rounded-[1.8rem] shadow-2xl hover:bg-primary transition-all group/btn border border-white/10">
                    <Camera size={24} className="group-hover/btn:rotate-12 transition-transform" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-10 text-center">
                <div className="space-y-4">
                  <h2 className="text-5xl font-black text-gray-950 italic tracking-tighter leading-none">{user.name}</h2>
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <span className="px-5 py-2 bg-primary/10 text-primary rounded-xl text-[9px] font-black uppercase tracking-[0.2em] italic border border-primary/10">
                      {user.role?.toUpperCase()} OPERATOR
                    </span>
                    <span className="px-5 py-2 bg-gray-50 text-gray-400 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] italic border border-gray-100">
                      ID: {user._id?.slice(-8).toUpperCase() || 'ROOT-NODE'}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-500 font-medium leading-relaxed italic text-lg px-4 border-x border-gray-50">
                  "Specializing in institutional-grade organic pulse cultivation and neural-assisted yield optimization protocols."
                </p>

                <div className="pt-6">
                  <button className="w-full py-6 bg-gray-950 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.5em] italic hover:bg-primary transition-all shadow-2xl shadow-gray-200/50 flex items-center justify-center gap-5 group/btn relative overflow-hidden">
                    <span className="relative z-10 flex items-center gap-5">MODIFY IDENTITY <Fingerprint size={20} className="group-hover/btn:scale-110 transition-transform" /></span>
                    <div className="absolute inset-0 bg-primary opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Background Decor */}
            <div className="absolute top-0 left-0 p-8 opacity-[0.02]">
                <Layers size={100} />
            </div>
          </div>

          {/* Core Telemetry */}
          <div className="stitch-card p-12 bg-gray-950 text-white space-y-12 shadow-2xl shadow-gray-950/20 relative overflow-hidden group">
            <div className="flex items-center gap-5 relative z-10">
                <div className="p-4 bg-primary/20 rounded-2xl text-primary border border-primary/20 shadow-2xl group-hover:rotate-6 transition-transform duration-700">
                    <Activity size={28} />
                </div>
                <div className="space-y-1">
                    <h3 className="text-2xl font-bold italic text-white tracking-tight leading-none">Identity Metrics</h3>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40 italic">Real-time status tracking</p>
                </div>
            </div>
            <div className="space-y-10 relative z-10">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center justify-between group/stat">
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-[1.5rem] bg-white/5 text-${stat.color} flex items-center justify-center shadow-2xl border border-white/5 group-hover/stat:bg-${stat.color}/10 transition-all duration-500`}>
                      <stat.icon size={28} className="stroke-[1.5]" />
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 italic leading-none">{stat.label}</p>
                        <p className="text-2xl font-black italic tracking-tighter text-white leading-none">{stat.value}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-white/10 group-hover/stat:text-primary transition-colors group-hover/stat:translate-x-2 transition-transform" />
                </div>
              ))}
            </div>
            {/* Decorative Pulse */}
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
          </div>
        </div>

        {/* Main Identity Ledger Area */}
        <div className="lg:col-span-8 space-y-12">
          {/* Institutional Credentials */}
          <div className="stitch-card p-16 bg-white shadow-2xl shadow-gray-200/50 space-y-16 relative overflow-hidden group">
            <div className="flex justify-between items-start relative z-10">
              <div className="flex items-center gap-6">
                <div className="p-5 bg-gray-950 rounded-[1.5rem] text-primary shadow-2xl group-hover:rotate-6 transition-transform duration-700">
                  <Globe size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-4xl font-bold text-gray-950 tracking-tight italic leading-none">Institutional <span className="not-italic text-primary">Ledger.</span></h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic">Global Operational Sync [Verified]</p>
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] italic text-gray-400">
                SYNC_READY
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
              <div className="space-y-12">
                <div className="flex items-start gap-8 group/info">
                  <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-300 group-hover/info:text-primary group-hover/info:bg-primary/5 transition-all duration-500 border border-transparent group-hover/info:border-primary/10 shadow-sm group-hover/info:shadow-xl">
                    <Phone size={32} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic leading-none">SECURE UPLINK</p>
                    <p className="text-3xl font-black text-gray-950 italic tracking-tighter leading-none">+91 {user.phone || '8842 119 042'}</p>
                    <button className="text-[10px] font-black text-primary uppercase tracking-[0.3em] italic flex items-center gap-3 hover:underline underline-offset-4">
                        VERIFY ENCRYPTION <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-8 group/info">
                  <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-300 group-hover/info:text-secondary group-hover/info:bg-secondary/5 transition-all duration-500 border border-transparent group-hover/info:border-secondary/10 shadow-sm group-hover/info:shadow-xl">
                    <Mail size={32} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic leading-none">INSTITUTIONAL RELAY</p>
                    <p className="text-3xl font-black text-gray-950 italic tracking-tighter leading-none truncate max-w-[300px]">{user.email?.toUpperCase() || 'NODE_OFFLINE'}</p>
                    <button className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] italic flex items-center gap-3 hover:underline underline-offset-4">
                        CALIBRATE RELAY <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-12">
                <div className="flex items-start gap-8 group/info">
                  <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-300 group-hover/info:text-primary group-hover/info:bg-primary/5 transition-all duration-500 border border-transparent group-hover/info:border-primary/10 shadow-sm group-hover/info:shadow-xl">
                    <MapPin size={32} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic leading-none">GPS COORDINATES</p>
                    <p className="text-3xl font-black text-gray-950 italic tracking-tighter leading-none">
                      {user.location?.lat ? `${user.location.lat.toFixed(4)}° N, ${user.location.lng.toFixed(4)}° E` : '26.9124° N, 75.7873° E'}
                    </p>
                    <button className="text-[10px] font-black text-primary uppercase tracking-[0.3em] italic flex items-center gap-3 hover:underline underline-offset-4">
                        SYNC SATELLITE HUB <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-8 group/info">
                  <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-300 group-hover/info:text-warning group-hover/info:bg-warning/5 transition-all duration-500 border border-transparent group-hover/info:border-warning/10 shadow-sm group-hover/info:shadow-xl">
                    <Briefcase size={32} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic leading-none">OPERATIONAL HISTORY</p>
                    <p className="text-3xl font-black text-gray-950 italic tracking-tighter leading-none">12 HARVEST PHASES</p>
                    <div className="flex gap-2 pt-2">
                      {[1, 2, 3, 4, 5].map(star => <Star key={star} size={16} className="fill-warning text-warning" />)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48 group-hover:bg-primary/10 transition-colors duration-1000"></div>
            <div className="absolute bottom-0 left-0 p-12 text-gray-50/50 opacity-[0.03]">
                <Cpu size={200} />
            </div>
          </div>

          {/* Financial Settlement Rails */}
          <div className="stitch-card p-16 bg-white shadow-2xl shadow-gray-200/50 space-y-16 relative overflow-hidden group">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 relative z-10">
              <div className="flex items-center gap-6">
                <div className="p-5 bg-gray-950 rounded-[1.8rem] text-white shadow-2xl group-hover:rotate-12 transition-transform duration-1000">
                    <CreditCard size={36} />
                </div>
                <div className="space-y-2">
                    <h3 className="text-4xl font-bold text-gray-950 tracking-tight italic leading-none">Escrow <span className="not-italic text-primary">Rails.</span></h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic leading-none">Sovereign settlement infrastructure active</p>
                </div>
              </div>
              <button className="p-5 bg-gray-50 rounded-2xl text-gray-400 hover:text-gray-950 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100">
                <Settings size={28} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
              <div className="p-12 rounded-[3rem] bg-gray-50 border border-gray-100 flex flex-col justify-between h-72 relative overflow-hidden group/card hover:bg-white hover:border-primary/20 transition-all duration-700 shadow-sm hover:shadow-2xl">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic mb-6">PRIMARY UPI PROTOCOL</p>
                  <p className="text-4xl font-black text-gray-950 italic tracking-tighter leading-none">{user.upiId || 'BRIDGE_ID_NULL'}</p>
                </div>
                <div className="flex items-center gap-4 text-primary font-black text-[10px] uppercase tracking-[0.3em] italic bg-primary/10 w-fit px-6 py-3 rounded-2xl border border-primary/10 shadow-sm animate-pulse">
                  <ShieldCheck size={16} /> SETTLEMENT ACTIVE
                </div>
                <div className="absolute top-0 right-0 p-12 text-gray-100 group-hover/card:text-primary/10 transition-colors duration-700">
                  <Zap size={100} />
                </div>
              </div>

              <div className="p-12 rounded-[3rem] bg-gray-950 text-white flex flex-col justify-between h-72 relative overflow-hidden group/card shadow-2xl shadow-gray-950/20">
                <div className="relative z-10">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] italic mb-6">INSTITUTIONAL CLEARING NODE</p>
                  <p className="text-4xl font-black italic tracking-tighter leading-none">
                    {user.bankAccount?.accountNumber ? `•••• •••• ${user.bankAccount.accountNumber.slice(-4)}` : 'XXXX XXXX 4421'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-6 relative z-10">
                   <div className="px-5 py-2.5 bg-white/5 backdrop-blur-3xl rounded-xl text-[10px] font-black uppercase tracking-[0.3em] italic border border-white/10 shadow-inner">
                     IFSC: {user.bankAccount?.ifscCode || 'HDFC0001202'}
                   </div>
                   <div className="px-5 py-2.5 bg-primary/20 text-primary rounded-xl text-[10px] font-black uppercase tracking-[0.3em] italic border border-primary/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                     VERIFIED SIG
                   </div>
                </div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[120px] opacity-20 group-hover/card:opacity-40 transition-opacity duration-1000"></div>
                <div className="absolute top-0 right-0 p-12 text-white/5 group-hover/card:text-white/10 transition-colors duration-700">
                    <Workflow size={100} />
                </div>
              </div>
            </div>
            
            {/* Signature Block */}
            <div className="pt-12 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                <div className="flex items-center gap-5">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.6)]"></div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-950 italic leading-none">SIGNATURE AUTHENTICATED</p>
                        <p className="text-[9px] font-black text-gray-300 italic uppercase tracking-[0.2em] leading-none">PLATFORM ROOT AUTHORITY SECURE</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 italic bg-gray-50 px-6 py-2 rounded-xl border border-gray-100">
                    <Clock size={14} /> LAST LEDGER SYNC: {new Date().toLocaleTimeString().toUpperCase()}
                </div>
            </div>
          </div>

          {/* Verification Protocol Banner */}
          <div className="stitch-card p-16 bg-gray-950 text-white relative overflow-hidden group shadow-2xl shadow-gray-950/20">
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
                <div className="w-28 h-28 bg-primary/20 backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-center text-primary border border-primary/20 shadow-2xl group-hover:rotate-12 transition-transform duration-1000">
                    <Target size={48} className="stroke-[1.5]" />
                </div>
                <div className="flex-1 text-center lg:text-left space-y-6">
                    <div className="inline-flex items-center gap-4 px-6 py-2 bg-primary/20 text-primary rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic border border-primary/20 shadow-2xl">
                        <Sparkles size={18} /> KYC ENHANCEMENT ACTIVE
                    </div>
                    <h3 className="text-4xl md:text-5xl font-bold italic tracking-tighter leading-tight">Elevate Node Status</h3>
                    <p className="text-gray-400 font-medium max-w-3xl leading-relaxed text-xl italic">
                        Nodes with <span className="text-primary font-black italic underline underline-offset-8 decoration-4 decoration-primary/20">Elite Verification</span> status receive <span className="text-white font-black italic">40% lower escrow commissions</span> and priority market visibility.
                    </p>
                </div>
                <button className="px-16 py-8 bg-white text-gray-950 rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.5em] italic shadow-2xl shadow-black/20 hover:bg-primary hover:text-white transition-all whitespace-nowrap">
                    UPGRADE PROTOCOL
                </button>
            </div>
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] -mr-80 -mt-80 group-hover:opacity-40 transition-opacity duration-1000"></div>
            <div className="absolute bottom-0 left-0 p-12 text-white/5">
                <Globe size={160} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfilePage;
