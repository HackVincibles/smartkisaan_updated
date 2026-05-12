import React from 'react';
import { 
  User, Mail, ShieldCheck, Award, 
  ChevronRight, Camera, Settings,
  LogOut, Lock, Database, Globe,
  Activity, Fingerprint, Workflow,
  Zap, Clock, ArrowRight, MoreHorizontal,
  Cpu, Terminal, ShieldAlert, CheckCircle,
  Layers, Target, Signal, Radar, Star
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const AdminProfilePage = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const stats = [
    { label: 'ACCESS_CLEARANCE', value: 'SUPER_ADMIN', icon: Lock, color: 'text-error bg-error/5' },
    { label: 'SYSTEM_UPTIME', value: '99.9%', icon: Activity, color: 'text-success bg-success/5' },
    { label: 'NETWORK_CLUSTER', value: 'NORTH_1', icon: Globe, color: 'text-secondary bg-secondary/5' },
  ];

  const permissions = [
    { label: 'USER_GOVERNANCE', icon: Database, status: 'AUTHORIZED', color: 'text-success bg-success/5' },
    { label: 'FINANCIAL_AUDIT', icon: ShieldCheck, status: 'AUTHORIZED', color: 'text-success bg-success/5' },
    { label: 'NODE_MANAGEMENT', icon: Cpu, status: 'AUTHORIZED', color: 'text-success bg-success/5' },
    { label: 'MASTER_CONFIG', icon: Award, status: 'LOCKED', color: 'text-error bg-error/5' }
  ];

  const activityLogs = [
    { event: 'Modified Marketplace Commission Rails', time: '2_HOURS_AGO', icon: Zap, color: 'text-secondary' },
    { event: 'Authorized 14 Regional Farmer Clusters', time: 'YESTERDAY', icon: CheckCircle, color: 'text-success' },
    { event: 'Terminated Suspicious Node Activity', time: '2_DAYS_AGO', icon: ShieldAlert, color: 'text-error' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-20 pb-32 fade-in">
      {/* Root Identity Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative overflow-hidden p-4">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-error italic">
            <div className="w-1.5 h-1.5 bg-error rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
            Root_Auth_Node v4.0.2 [ELEVATED_CLEARANCE]
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gray-950 tracking-tighter italic leading-none uppercase">
            Overseer <span className="not-italic text-error">Core.</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-xl text-xl leading-relaxed italic">
            Managing root administrative profile of <span className="text-gray-950 font-black italic uppercase">{user.name}</span>. Total sovereignty over the <span className="text-gray-950 font-black italic">pan-India agricultural grid</span>.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-8 relative z-10">
          <button className="px-10 py-6 bg-white border border-gray-100 rounded-[2rem] flex items-center gap-5 font-black text-[11px] uppercase tracking-[0.4em] italic shadow-2xl shadow-gray-200/50 hover:bg-gray-950 hover:text-white transition-all text-gray-400 group">
            <Terminal size={20} className="group-hover:animate-pulse" /> SYS_DIAGNOSTICS
          </button>
          <button onClick={logout} className="px-10 py-6 bg-error text-white rounded-[2rem] flex items-center gap-5 font-black text-[11px] uppercase tracking-[0.4em] italic shadow-2xl shadow-error/20 hover:bg-gray-950 transition-all group relative overflow-hidden">
            <span className="relative z-10 flex items-center gap-5"><LogOut size={20} /> DEACTIVATE_NODE</span>
            <div className="absolute inset-0 bg-gray-950 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>

        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none -mr-40 -mt-10">
          <h1 className="text-[20rem] font-black italic tracking-tighter uppercase leading-none">ROOT</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 px-4">
        {/* Root Operator Sidebar */}
        <div className="lg:col-span-4 space-y-16">
          <div className="stitch-card overflow-hidden group bg-white shadow-2xl shadow-gray-200/50 relative border-none">
            {/* Banner */}
            <div className="h-56 bg-gray-950 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-error/40 to-transparent"></div>
              <div className="absolute inset-0 opacity-[0.05]">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <pattern id="admin-grid-profile" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#admin-grid-profile)" />
                </svg>
              </div>
              <div className="absolute left-0 right-0 top-0 h-1 bg-error animate-scan opacity-40"></div>
            </div>
            
            <div className="px-12 pb-16 relative">
              <div className="relative -mt-28 mb-12 flex justify-center">
                <div className="w-56 h-56 rounded-[4rem] bg-white p-2 shadow-2xl group-hover:scale-105 transition-all duration-[1.5s] relative group/photo">
                  <div className="w-full h-full rounded-[3.5rem] overflow-hidden bg-gray-50 border border-gray-100">
                    {user.profilePhoto ? (
                      <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-error/20">
                        <ShieldCheck size={100} strokeWidth={1} />
                      </div>
                    )}
                  </div>
                  <button className="absolute bottom-6 right-6 p-6 bg-gray-950 text-white rounded-[1.8rem] shadow-2xl hover:bg-error transition-all group/btn border border-white/10 group-hover/photo:scale-110">
                    <Camera size={28} className="group-hover/btn:rotate-12 transition-transform" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-10 text-center">
                <div className="space-y-4">
                  <h2 className="text-5xl font-black text-gray-950 italic tracking-tighter leading-none uppercase group-hover:text-error transition-colors">{user.name}</h2>
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <span className="px-5 py-2 bg-error/10 text-error rounded-xl text-[10px] font-black uppercase tracking-[0.4em] italic border border-error/10 shadow-sm">MASTER_CONFIG</span>
                    <span className="px-5 py-2 bg-gray-50 text-gray-300 rounded-xl text-[10px] font-black uppercase tracking-[0.4em] italic border border-gray-100">NODE::ROOT-01</span>
                  </div>
                </div>
                
                <p className="text-lg font-bold text-gray-400 leading-relaxed italic px-6 uppercase opacity-60">
                  "Sovereign root administrator governing global protocol consensus, capital rails, and platform-wide governance."
                </p>

                <div className="pt-8">
                  <button className="w-full py-8 bg-gray-950 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.5em] italic hover:bg-error transition-all shadow-2xl flex items-center justify-center gap-6 group/btn relative overflow-hidden">
                    <span className="relative z-10 flex items-center gap-6">MODIFY_PROTOCOL <Fingerprint size={24} className="group-hover/btn:scale-110 transition-transform" /></span>
                    <div className="absolute inset-0 bg-error opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                  </button>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 pointer-events-none bg-scanline opacity-[0.01]"></div>
          </div>

          {/* System Telemetry Matrix */}
          <div className="stitch-card p-12 bg-gray-950 text-white space-y-12 shadow-2xl shadow-gray-950/40 relative overflow-hidden group">
            <div className="flex items-center gap-6 relative z-10">
              <div className="p-4 bg-white/5 rounded-2xl text-error border border-white/5 shadow-inner group-hover:rotate-12 transition-transform duration-700">
                <Cpu size={32} />
              </div>
              <h3 className="text-2xl font-black italic text-white tracking-tight uppercase">Sys Telemetry</h3>
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

        {/* Root Ledger Area */}
        <div className="lg:col-span-8 space-y-16">
          {/* Permission Protocol Terminal */}
          <div className="stitch-card p-12 md:p-16 bg-white shadow-2xl shadow-gray-200/50 space-y-16 relative overflow-hidden group/perm border-none">
            <div className="flex items-center gap-6 relative z-10">
              <div className="p-5 bg-gray-950 rounded-[1.8rem] text-white shadow-2xl group-hover/perm:rotate-6 transition-transform duration-700"><Lock size={36} /></div>
              <div className="space-y-1.5">
                <h3 className="text-4xl font-black text-gray-950 tracking-tighter italic leading-none uppercase">Security <span className="not-italic text-error">Vault.</span></h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] italic leading-none">ENCRYPTED_PERMISSION_PROTOCOL</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              {permissions.map((perm, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="flex items-center justify-between p-10 bg-gray-50 rounded-[2.5rem] hover:bg-white hover:shadow-2xl hover:border-gray-100 border border-transparent transition-all group/item shadow-inner cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-inner border border-current/10 group-hover/item:rotate-12 transition-transform duration-700 ${perm.color}`}>
                      <perm.icon size={28} strokeWidth={1.5} />
                    </div>
                    <span className="text-[12px] font-black uppercase tracking-[0.3em] italic text-gray-950 group-hover/item:text-error transition-colors">{perm.label}</span>
                  </div>
                  <span className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] italic border border-current/10 shadow-sm ${perm.color}`}>
                    {perm.status}
                  </span>
                </motion.div>
              ))}
            </div>
            
            <div className="absolute top-0 right-0 w-80 h-80 bg-error/5 rounded-full blur-[100px] -mr-40 -mt-40 group-hover/perm:scale-125 transition-transform duration-[3s]"></div>
            <div className="absolute bottom-0 right-0 p-12 text-gray-50 opacity-[0.03] pointer-events-none group-hover/perm:rotate-12 transition-transform duration-[2s]"><Lock size={250} /></div>
          </div>

          {/* Activity Log Terminal */}
          <div className="stitch-card p-12 md:p-16 bg-white shadow-2xl shadow-gray-200/50 space-y-16 relative overflow-hidden group/log border-none">
            <div className="flex justify-between items-center relative z-10">
              <div className="flex items-center gap-6">
                <div className="p-5 bg-gray-950 rounded-[1.8rem] text-white shadow-2xl group-hover/log:rotate-6 transition-transform duration-700"><Terminal size={36} /></div>
                <div className="space-y-1.5">
                  <h3 className="text-4xl font-black text-gray-950 tracking-tighter italic leading-none uppercase">Activity <span className="not-italic text-error">Logs.</span></h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] italic leading-none">REAL_TIME_INFRA_EVENTS</p>
                </div>
              </div>
              <button className="p-5 bg-gray-50 rounded-[1.5rem] text-gray-300 hover:text-gray-950 hover:bg-white transition-all shadow-inner group/s">
                <Settings size={32} className="group-hover/s:rotate-90 transition-transform duration-700" />
              </button>
            </div>

            <div className="space-y-8 relative z-10">
              {activityLogs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="flex items-center gap-8 p-10 rounded-[2.5rem] bg-gray-50 hover:bg-white hover:shadow-2xl border border-transparent hover:border-gray-100 transition-all group/item cursor-pointer shadow-inner"
                >
                  <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shrink-0 shadow-inner border border-current/10 group-hover/item:rotate-12 transition-transform duration-700 bg-white ${log.color}`}>
                    <log.icon size={36} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 space-y-2 min-w-0">
                    <h4 className="text-2xl font-black text-gray-950 italic tracking-tighter leading-none uppercase group-hover/item:text-error transition-colors truncate">{log.event}</h4>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300 italic leading-none flex items-center gap-3"><Clock size={14} /> {log.time}</p>
                  </div>
                  <ChevronRight size={28} className="text-gray-200 group-hover/item:text-error group-hover/item:translate-x-3 transition-all shrink-0" />
                </motion.div>
              ))}
            </div>
            <div className="absolute bottom-0 right-0 p-12 text-gray-50 opacity-[0.03] pointer-events-none group-hover/log:rotate-12 transition-transform duration-[2s]"><Activity size={250} /></div>
          </div>

          {/* Root Infrastructure Uplink */}
          <div className="stitch-card p-12 md:p-16 bg-gray-950 text-white relative overflow-hidden group shadow-2xl shadow-gray-950/40">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-16">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-4 px-6 py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-error italic border border-white/5">
                  <Signal size={16} className="fill-error animate-pulse" /> SECURE_UPLINK_CHANNEL
                </div>
                <h3 className="text-5xl font-black italic tracking-tighter leading-tight uppercase">Infrastructure <span className="text-error not-italic">Uplink.</span></h3>
                <p className="text-white/40 text-xl font-medium leading-relaxed italic max-w-md">
                  Direct encrypted channel to the <span className="text-white font-black">global infrastructure core</span> and development network.
                </p>
              </div>
              <button className="px-12 py-8 bg-white text-gray-950 rounded-[3rem] font-black text-[12px] uppercase tracking-[0.5em] italic shadow-2xl hover:bg-error hover:text-white transition-all group/btn relative overflow-hidden shrink-0">
                <span className="relative z-10 flex items-center gap-5">OPEN_SECURE_COMMS <ArrowRight size={22} className="group-hover/btn:translate-x-3 transition-transform" /></span>
                <div className="absolute inset-0 bg-error opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
              </button>
            </div>
            
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" />
                <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.5" />
              </svg>
            </div>
            <div className="absolute -right-40 -bottom-40 w-[500px] h-[500px] bg-error/20 rounded-full blur-[150px] opacity-20 group-hover:opacity-40 transition-opacity duration-[2s]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
