import React from 'react';
import { 
  User, Mail, Phone, MapPin, 
  ShieldCheck, CreditCard, Award, 
  ChevronRight, Camera, Settings,
  LogOut, Truck, Package,
  Zap, Activity, Globe,
  Fingerprint, Workflow, Clock,
  ArrowRight, MoreHorizontal,
  Navigation,
  ShieldAlert,
  Star,
  Layers,
  Cpu,
  Target,
  Signal,
  Radar
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const TransporterProfilePage = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const stats = [
    { label: 'TRUST_RATING', value: `${user.trustScore || 100}%`, icon: Award, color: 'text-warning bg-warning/5' },
    { label: 'FLEET_INDEX', value: '342_DELIVERED', icon: Package, color: 'text-secondary bg-secondary/5' },
    { label: 'SYSTEM_CLEARANCE', value: 'OPERATOR_GOLD', icon: Activity, color: 'text-primary bg-primary/5' },
  ];

  const fleetAssets = [
    { id: 'RJ 14 CC 1234', type: 'Heavy Duty Truck', status: 'ACTIVE', telemetry: 'LOCKED' },
    { id: 'UP 16 AA 5678', type: 'Refrigerated Unit', status: 'MAINTENANCE', telemetry: 'STALE' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-20 pb-32 fade-in">
      {/* Sovereign Logistics Identity Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative overflow-hidden p-4">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-secondary italic">
            <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
            Verified_Logistics_Operator v4.0.2 [AUTHORIZED]
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gray-950 tracking-tighter italic leading-none uppercase">
            Fleet <span className="not-italic text-secondary">Node.</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-xl text-xl leading-relaxed italic">
            Managing the operational identity of <span className="text-gray-950 font-black italic uppercase">{user.name}</span>. Synchronized with the <span className="text-gray-950 font-black italic">pan-India logistics grid</span>.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-8 relative z-10">
          <button className="px-10 py-6 bg-white border border-gray-100 rounded-[2rem] flex items-center gap-5 font-black text-[11px] uppercase tracking-[0.4em] italic shadow-2xl shadow-gray-200/50 hover:bg-gray-950 hover:text-white transition-all text-gray-400 group">
            <Navigation size={20} className="group-hover:animate-pulse" /> ROUTE_DIAGNOSTICS
          </button>
          <button onClick={logout} className="px-10 py-6 bg-error text-white rounded-[2rem] flex items-center gap-5 font-black text-[11px] uppercase tracking-[0.4em] italic shadow-2xl shadow-error/20 hover:bg-gray-950 transition-all group relative overflow-hidden">
            <span className="relative z-10 flex items-center gap-5"><LogOut size={20} /> TERMINATE_SESSION</span>
            <div className="absolute inset-0 bg-gray-950 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>

        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none -mr-40 -mt-10">
          <h1 className="text-[20rem] font-black italic tracking-tighter uppercase leading-none">NODE</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 px-4">
        {/* Logistics Identity Sidebar */}
        <div className="lg:col-span-4 space-y-16">
          <div className="stitch-card overflow-hidden group bg-white shadow-2xl shadow-gray-200/50 relative border-none">
            {/* High-Fidelity Banner */}
            <div className="h-56 bg-gray-950 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/40 to-transparent"></div>
              <div className="absolute inset-0 opacity-[0.05]">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <pattern id="operator-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#operator-grid)" />
                </svg>
              </div>
              <div className="absolute left-0 right-0 top-0 h-1 bg-secondary animate-scan opacity-40"></div>
            </div>
            
            <div className="px-12 pb-16 relative">
              <div className="relative -mt-28 mb-12 flex justify-center">
                <div className="w-56 h-56 rounded-[4rem] bg-white p-2 shadow-2xl group-hover:scale-105 transition-all duration-[1.5s] relative group/photo">
                  <div className="w-full h-full rounded-[3.5rem] overflow-hidden bg-gray-50 border border-gray-100">
                    {user.profilePhoto ? (
                      <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-secondary/20">
                        <Truck size={100} strokeWidth={1} />
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
                    <span className="px-5 py-2 bg-secondary/10 text-secondary rounded-xl text-[10px] font-black uppercase tracking-[0.4em] italic border border-secondary/10 shadow-sm">LOGISTICS_LEAD</span>
                    <span className="px-5 py-2 bg-gray-50 text-gray-300 rounded-xl text-[10px] font-black uppercase tracking-[0.4em] italic border border-gray-100">NODE::T-LOG-42</span>
                  </div>
                </div>
                
                <p className="text-lg font-bold text-gray-400 leading-relaxed italic px-6 uppercase opacity-60">
                  "Sovereign logistics operator specializing in cold-chain agricultural clusters and pan-India distribution."
                </p>

                <div className="pt-8">
                  <button className="w-full py-8 bg-gray-950 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.5em] italic hover:bg-secondary transition-all shadow-2xl flex items-center justify-center gap-6 group/btn relative overflow-hidden">
                    <span className="relative z-10 flex items-center gap-6">MODIFY_IDENTITY <Fingerprint size={24} className="group-hover/btn:scale-110 transition-transform" /></span>
                    <div className="absolute inset-0 bg-secondary opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                  </button>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 pointer-events-none bg-scanline opacity-[0.01]"></div>
          </div>

          {/* Operational Metrics Matrix */}
          <div className="stitch-card p-12 bg-gray-950 text-white space-y-12 shadow-2xl shadow-gray-950/40 relative overflow-hidden group">
            <div className="flex items-center gap-6 relative z-10">
              <div className="p-4 bg-white/5 rounded-2xl text-secondary border border-white/5 shadow-inner group-hover:rotate-12 transition-transform duration-700">
                <Activity size={32} />
              </div>
              <h3 className="text-2xl font-black italic text-white tracking-tight uppercase">Fleet Telemetry</h3>
            </div>
            <div className="space-y-10 relative z-10">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-8 group/stat">
                  <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl border border-white/5 group-hover/stat:scale-110 transition-transform duration-700 ${stat.color}`}>
                    <stat.icon size={28} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 italic leading-none">{stat.label}</p>
                    <p className="text-2xl font-black italic tracking-tighter text-white leading-none uppercase">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute top-0 right-0 p-12 text-white/5 pointer-events-none group-hover:rotate-12 transition-transform duration-[3s]">
              <Radar size={150} />
            </div>
          </div>
        </div>

        {/* Operational Identity Ledger Area */}
        <div className="lg:col-span-8 space-y-16">
          {/* Compliance & Identity Rails */}
          <div className="stitch-card p-12 md:p-16 bg-white shadow-2xl shadow-gray-200/50 space-y-16 relative overflow-hidden group/ledger border-none">
            <div className="flex items-center gap-6 relative z-10">
              <div className="p-5 bg-gray-950 rounded-[1.8rem] text-white shadow-2xl group-hover/ledger:rotate-6 transition-transform duration-700"><ShieldCheck size={36} /></div>
              <div className="space-y-1.5">
                <h3 className="text-4xl font-black text-gray-950 tracking-tighter italic leading-none uppercase">Identity <span className="not-italic text-secondary">Ledger.</span></h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] italic leading-none">FLEET_COMPLIANCE_PROTOCOL</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
              <div className="space-y-12">
                <div className="flex items-start gap-8 group/item">
                  <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-gray-300 group-hover/item:text-secondary group-hover/item:bg-secondary/5 transition-all border border-transparent group-hover/item:border-secondary/10 shadow-inner group-hover/item:rotate-12 duration-700">
                    <Phone size={28} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] italic leading-none">Operator_Uplink</p>
                    <p className="text-2xl font-black text-gray-950 italic tracking-tighter leading-none uppercase">+91 {user.phone || '88229 11922'}</p>
                    <button className="text-[9px] font-black text-secondary uppercase tracking-[0.3em] italic flex items-center gap-3 hover:translate-x-2 transition-transform">
                      SECURE_COMMS_LOCK <ArrowRight size={10} />
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-8 group/item">
                  <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-gray-300 group-hover/item:text-secondary group-hover/item:bg-secondary/5 transition-all border border-transparent group-hover/item:border-secondary/10 shadow-inner group-hover/item:rotate-12 duration-700">
                    <Mail size={28} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] italic leading-none">Digital_Mail</p>
                    <p className="text-2xl font-black text-gray-950 italic tracking-tighter leading-none uppercase truncate max-w-[200px]">{user.email || 'admin@smartkissan.in'}</p>
                    <button className="text-[9px] font-black text-secondary uppercase tracking-[0.3em] italic flex items-center gap-3 hover:translate-x-2 transition-transform">
                      SYNC_NEURAL_RELAY <ArrowRight size={10} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-12">
                <div className="flex items-start gap-8 group/item">
                  <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-gray-300 group-hover/item:text-secondary group-hover/item:bg-secondary/5 transition-all border border-transparent group-hover/item:border-secondary/10 shadow-inner group-hover/item:rotate-12 duration-700">
                    <MapPin size={28} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] italic leading-none">Home_Terminal</p>
                    <p className="text-2xl font-black text-gray-950 italic tracking-tighter leading-none uppercase">Base_Lock_Active</p>
                    <button className="text-[9px] font-black text-secondary uppercase tracking-[0.3em] italic flex items-center gap-3 hover:translate-x-2 transition-transform">
                      CALIBRATE_TERMINAL <ArrowRight size={10} />
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-8 group/item">
                  <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-gray-300 group-hover/item:text-secondary group-hover/item:bg-secondary/5 transition-all border border-transparent group-hover/item:border-secondary/10 shadow-inner group-hover/item:rotate-12 duration-700">
                    <ShieldCheck size={28} />
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] italic leading-none">Safety_Compliance</p>
                    <p className="text-2xl font-black text-gray-950 italic tracking-tighter leading-none uppercase">FLEET_STATUS_5.0</p>
                    <div className="flex gap-2 pt-1">
                      {[1, 2, 3, 4, 5].map(star => <Star key={star} size={16} className="fill-warning text-warning" />)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] -mr-40 -mt-40 group-hover/ledger:scale-125 transition-transform duration-[3s]"></div>
            <div className="absolute bottom-0 right-0 p-12 text-gray-50 opacity-[0.03] pointer-events-none group-hover/ledger:rotate-12 transition-transform duration-[2s]"><ShieldCheck size={250} /></div>
          </div>

          {/* Asset & Fleet Infrastructure */}
          <div className="stitch-card p-12 md:p-16 bg-white shadow-2xl shadow-gray-200/50 space-y-16 relative overflow-hidden group/asset border-none">
            <div className="flex justify-between items-center relative z-10">
              <div className="flex items-center gap-6">
                <div className="p-5 bg-gray-950 rounded-[1.8rem] text-white shadow-2xl group-hover/asset:rotate-6 transition-transform duration-700"><Truck size={36} /></div>
                <div className="space-y-1.5">
                  <h3 className="text-4xl font-black text-gray-950 tracking-tighter italic leading-none uppercase">Asset <span className="not-italic text-secondary">Sovereignty.</span></h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] italic leading-none">VERIFIED_FLEET_INFRASTRUCTURE</p>
                </div>
              </div>
              <button className="p-5 bg-gray-50 rounded-[1.5rem] text-gray-300 hover:text-gray-950 hover:bg-white transition-all shadow-inner group/s">
                <Settings size={32} className="group-hover/s:rotate-90 transition-transform duration-700" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              {fleetAssets.map((asset, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className={`p-10 rounded-[3rem] flex flex-col justify-between h-72 relative overflow-hidden group/item transition-all duration-700 shadow-inner border border-transparent ${asset.status === 'ACTIVE' ? 'bg-gray-50 hover:bg-white hover:border-secondary/20' : 'bg-error/5 hover:bg-error/10 border-error/5'}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <p className={`text-[10px] font-black uppercase tracking-[0.4em] italic mb-4 ${asset.status === 'ACTIVE' ? 'text-gray-400' : 'text-error'}`}>Vehicle_Identifier</p>
                      <p className={`text-4xl font-black italic tracking-tighter leading-none uppercase ${asset.status === 'ACTIVE' ? 'text-gray-950' : 'text-error'}`}>{asset.id}</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">{asset.type.toUpperCase()}</p>
                    </div>
                    <span className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.4em] italic border border-current/10 shadow-sm ${asset.status === 'ACTIVE' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                      {asset.status}
                    </span>
                  </div>
                  <div className={`flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] italic w-fit px-6 py-3 rounded-2xl border border-current/10 ${asset.status === 'ACTIVE' ? 'bg-secondary/5 text-secondary' : 'bg-gray-200/20 text-gray-400'}`}>
                    <Workflow size={18} /> NEURAL_TRACKING_{asset.telemetry}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="absolute bottom-0 right-0 p-12 text-gray-50 opacity-[0.03] pointer-events-none group-hover/asset:rotate-12 transition-transform duration-[2s]"><Globe size={250} /></div>
          </div>

          {/* Capital Settlement Rails */}
          <div className="stitch-card p-12 md:p-16 bg-white shadow-2xl shadow-gray-200/50 space-y-16 relative overflow-hidden group/capital border-none">
            <div className="flex justify-between items-center relative z-10">
              <div className="flex items-center gap-6">
                <div className="p-5 bg-gray-950 rounded-[1.8rem] text-white shadow-2xl group-hover/capital:rotate-6 transition-transform duration-700"><CreditCard size={36} /></div>
                <div className="space-y-1.5">
                  <h3 className="text-4xl font-black text-gray-950 tracking-tighter italic leading-none uppercase">Capital <span className="not-italic text-secondary">Flow.</span></h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] italic leading-none">OPERATIONAL_SETTLEMENT_RAILS</p>
                </div>
              </div>
              <button className="text-[11px] font-black uppercase tracking-[0.5em] text-secondary hover:text-gray-950 transition-all italic border-b border-secondary/20 pb-1">FULL_SETTLEMENT_ARCHIVES</button>
            </div>

            <div className="p-16 rounded-[4rem] bg-secondary text-white relative overflow-hidden group/wallet shadow-2xl">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-16">
                <div className="space-y-6 text-center md:text-left">
                  <p className="text-[11px] font-black uppercase tracking-[0.5em] text-white/50 italic leading-none">AVAILABLE_FOR_SETTLEMENT</p>
                  <p className="text-8xl font-black italic tracking-tighter leading-none uppercase">₹14,500<span className="text-2xl text-white/30 not-italic font-bold ml-4">.00</span></p>
                </div>
                <button className="px-12 py-8 bg-white text-secondary rounded-[3rem] font-black text-[12px] uppercase tracking-[0.5em] italic shadow-2xl shadow-black/10 hover:bg-gray-950 hover:text-white transition-all group/btn relative overflow-hidden shrink-0">
                  <span className="relative z-10 flex items-center gap-5">INITIALIZE_PAYOUT <ArrowRight size={22} className="group-hover/btn:translate-x-3 transition-transform" /></span>
                  <div className="absolute inset-0 bg-gray-950 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                </button>
              </div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-48 -mt-48 group-hover/wallet:scale-125 transition-transform duration-[3s]"></div>
              <div className="absolute -left-20 -bottom-20 p-12 text-white/5 pointer-events-none group-hover/wallet:rotate-12 transition-transform duration-[2s]"><Activity size={300} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransporterProfilePage;
