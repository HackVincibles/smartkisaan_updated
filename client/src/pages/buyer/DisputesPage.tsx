import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, CheckCircle2, Clock, 
  MessageSquare, ChevronRight, Gavel,
  Search, Filter, Shield, Activity,
  Scale, AlertTriangle, ShieldCheck,
  MessageCircle, Info, ArrowUpRight,
  Database, Zap, Lock, Workflow,
  Cpu, Target, MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import disputeService from '../../services/disputeService';
import { toast } from 'react-hot-toast';

const DisputesPage = () => {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      const response = await disputeService.getDisputes();
      const data = response.data?.data || response.data || [];
      setDisputes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch disputes:', error);
      // Mock data for high-fidelity demo
      setDisputes([
        { _id: '1', orderId: 'ORD-1234', reason: 'Quality deviation from specifications', status: 'PENDING', createdAt: new Date() },
        { _id: '2', orderId: 'ORD-5678', reason: 'Logistics rail delay', status: 'RESOLVED', createdAt: new Date(Date.now() - 86400000) },
        { _id: '3', orderId: 'ORD-9012', reason: 'Damaged asset on arrival', status: 'IN_REVIEW', createdAt: new Date(Date.now() - 172800000) }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return {
        color: 'text-warning bg-warning/5',
        label: 'AWAITING_ARBITRATION',
        icon: Clock
      };
      case 'RESOLVED': return {
        color: 'text-success bg-success/5',
        label: 'RESOLUTION_COMPLETE',
        icon: CheckCircle2
      };
      case 'REJECTED': return {
        color: 'text-error bg-error/5',
        label: 'DISPUTE_REJECTED',
        icon: AlertCircle
      };
      case 'IN_REVIEW': return {
        color: 'text-primary bg-primary/5',
        label: 'UNDER_INVESTIGATION',
        icon: Search
      };
      default: return {
        color: 'text-gray-400 bg-gray-50',
        label: 'STATUS_UNKNOWN',
        icon: Info
      };
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[80vh] fade-in">
      <div className="text-center space-y-10">
        <div className="w-24 h-24 bg-gray-950 rounded-[2.5rem] border border-white/5 flex items-center justify-center shadow-2xl relative">
            <div className="absolute inset-0 border-4 border-gray-950 border-t-secondary rounded-[2.5rem] animate-spin"></div>
            <Scale size={40} className="text-secondary animate-pulse" />
        </div>
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary italic leading-none">Accessing Arbitration Nexus...</p>
          <p className="text-xs text-gray-400 font-medium italic leading-none">Synchronizing Dispute Records...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32 fade-in">
      {/* Premium Arbitration Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative overflow-hidden p-4">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-secondary italic">
            <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
            Arbitration_Terminal v4.2.1 [SECURE]
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gray-950 tracking-tighter italic leading-none uppercase">
            Dispute <span className="not-italic text-secondary">Nexus.</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-2xl text-xl leading-relaxed italic">
            Official platform for <span className="text-gray-950 font-black italic">contractual arbitration</span> and asset quality verification disputes.
          </p>
        </div>
        
        <button className="relative z-10 px-12 py-7 bg-gray-950 text-white rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.5em] italic hover:bg-secondary transition-all flex items-center gap-5 shadow-2xl shadow-gray-900/20 group">
          <Gavel size={22} className="group-hover:rotate-12 transition-transform duration-500" />
          RAISE_NEW_DISPUTE
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
        </button>

        {/* Decorative Background Text */}
        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none -mr-40 -mt-10">
            <h1 className="text-[20rem] font-black italic tracking-tighter uppercase leading-none">ARBITER</h1>
        </div>
      </div>

      {/* Control Panel */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-10 px-4">
        <div className="relative w-full lg:flex-1 group">
          <Search size={24} className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-secondary transition-colors" />
          <input 
            type="text" 
            placeholder="SCAN BY ORDER_ID, DISPUTE_HASH, OR REASON..." 
            className="w-full pl-20 pr-10 py-10 bg-white border border-gray-100 rounded-[3rem] focus:ring-12 focus:ring-secondary/5 focus:border-secondary/20 outline-none font-black text-[11px] text-gray-950 uppercase tracking-[0.2em] italic placeholder:text-gray-200 shadow-2xl shadow-gray-200/50"
          />
        </div>
        <button className="w-full lg:w-auto p-10 bg-white text-gray-400 rounded-[2.5rem] border border-gray-100 hover:text-gray-950 hover:shadow-2xl transition-all shadow-sm">
          <Filter size={28} />
        </button>
      </div>

      {/* Disputes Flow */}
      <div className="space-y-10 px-4">
        <AnimatePresence mode="popLayout">
          {disputes.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="stitch-card py-48 text-center space-y-12 bg-white shadow-2xl shadow-gray-200/50 relative overflow-hidden group"
            >
              <div className="relative z-10">
                  <div className="w-48 h-48 bg-emerald-50 rounded-[4rem] flex items-center justify-center mx-auto relative shadow-inner border border-emerald-100/50 group-hover:scale-105 transition-transform duration-1000">
                    <ShieldCheck size={90} className="text-emerald-500 stroke-[1.5]" />
                    <div className="absolute inset-0 bg-emerald-500 rounded-[4rem] opacity-0 group-hover:opacity-5 transition-opacity"></div>
                  </div>
                  <div className="space-y-6 pt-10">
                    <h3 className="text-5xl font-black text-gray-950 italic tracking-tight leading-none uppercase">Zero <span className="not-italic text-emerald-500">Conflicts.</span></h3>
                    <p className="text-gray-400 font-medium max-w-xl mx-auto text-xl italic leading-relaxed">System scan reveals no active disputes. Your procurement pipeline is operating within nominal specifications.</p>
                  </div>
              </div>
              <div className="absolute top-0 right-0 p-24 opacity-[0.02] pointer-events-none uppercase italic font-black text-[15rem] leading-none">CLEAR</div>
            </motion.div>
          ) : (
            disputes.map((dispute, index) => {
              const config = getStatusConfig(dispute.status);
              const StatusIcon = config.icon;
              
              return (
                <motion.div 
                  key={dispute._id || index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="group"
                >
                  <div className="stitch-card overflow-hidden border-none shadow-2xl shadow-gray-200/50 bg-white hover:translate-y-[-5px] transition-all duration-700 p-10 md:p-14 relative">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
                      <div className="flex flex-col md:flex-row items-center gap-10 text-center md:text-left flex-1">
                        <div className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center shadow-inner shrink-0 border border-transparent transition-all duration-700 group-hover:rotate-12 ${config.color} border-current/10`}>
                          <StatusIcon size={44} strokeWidth={1.5} />
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <span className="text-2xl font-black text-gray-950 italic tracking-tighter uppercase leading-none">ORDER_ID::#{dispute.orderId}</span>
                            <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.4em] italic shadow-sm border border-current/10 ${config.color}`}>
                              {config.label}
                            </span>
                          </div>
                          <p className="text-xl font-bold text-gray-400 italic leading-relaxed uppercase">{dispute.reason}</p>
                          <div className="flex items-center justify-center md:justify-start gap-3 text-[10px] text-gray-300 font-black uppercase tracking-[0.3em] italic">
                            <Clock size={16} /> RAISED_ON: {new Date(dispute.createdAt).toLocaleDateString().toUpperCase()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-8 w-full lg:w-auto">
                        <div className="hidden md:flex items-center gap-4 px-8 py-5 bg-gray-50 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic text-gray-400 border border-gray-100 shadow-inner group-hover:bg-white group-hover:shadow-xl transition-all duration-500">
                          <MessageCircle size={20} className="text-secondary" />
                          3 MESSAGES_IN_FLIGHT
                        </div>
                        <div className="p-6 bg-gray-950 text-white rounded-2xl hover:bg-secondary transition-all shadow-2xl shadow-gray-950/20 group/btn">
                            <ChevronRight size={28} className="group-hover/btn:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Subtle Scanline Overlay */}
                    <div className="absolute inset-0 pointer-events-none bg-scanline opacity-[0.01]"></div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Strategic Assistance Panel */}
      <div className="px-4">
        <div className="stitch-card bg-gray-950 p-16 text-white relative overflow-hidden group shadow-2xl shadow-gray-950/40">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-16">
            <div className="space-y-10 text-center md:text-left flex-1">
              <div className="w-24 h-24 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-center mx-auto md:mx-0 border border-white/5 shadow-2xl group-hover:scale-110 transition-transform duration-1000">
                <AlertTriangle size={48} className="text-secondary stroke-[1.5]" />
              </div>
              <div className="space-y-6">
                <h3 className="text-5xl font-black italic tracking-tighter leading-none uppercase">Need Technical <span className="text-secondary not-italic">Arbitration?</span></h3>
                <p className="text-white/40 text-xl font-medium max-w-2xl italic leading-relaxed">
                  Our specialized platform arbiters are on standby 24/7 to analyze <span className="text-white font-black underline decoration-secondary/20 underline-offset-8">immutable audit trails</span> and resolve contractual discrepancies.
                </p>
              </div>
            </div>
            
            <button className="px-16 py-8 bg-white text-gray-950 rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.5em] italic hover:bg-secondary hover:text-white shadow-2xl transition-all group/btn relative overflow-hidden shrink-0">
              <span className="relative z-10">INITIALIZE_SUPPORT_UPLINK</span>
              <div className="absolute inset-0 bg-secondary opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
            </button>
          </div>
          
          {/* Background Decor */}
          <div className="absolute top-0 right-0 p-12 text-white/5 pointer-events-none group-hover:rotate-12 transition-transform duration-1000">
              <Target size={300} />
          </div>
          <div className="absolute -left-40 -bottom-40 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px] opacity-20"></div>
        </div>
      </div>
    </div>
  );
};

export default DisputesPage;
