import React, { useState, useEffect } from 'react';
import { 
  Gavel, Search, Filter, AlertCircle,
  CheckCircle2, Clock, MessageSquare,
  ChevronRight, ArrowUpRight, ShieldAlert,
  Scale, Activity, Database, Target,
  Cpu, ArrowRight, MoreHorizontal,
  Zap, Shield, Layers, Globe
} from 'lucide-react';
// @ts-ignore
import disputeService from '../../services/disputeService';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const DisputesManagementPage = () => {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchDisputes();
  }, [statusFilter]);

  const fetchDisputes = async () => {
    try {
      const response = await disputeService.getAllDisputes();
      const data = response.data?.data || response.data || [];
      setDisputes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch disputes:', error);
      setDisputes([
        { _id: 'D1', orderId: 'ORD-A101', reason: 'Quality Mismatch — Grade B vs Grade A Certified', status: 'PENDING', raisedBy: 'Buyer', createdAt: new Date(), escrowAmount: 45000 },
        { _id: 'D2', orderId: 'ORD-B102', reason: 'Payment Release Dispute — Escrow Timeout', status: 'IN_REVIEW', raisedBy: 'Farmer', createdAt: new Date(Date.now() - 3600000), escrowAmount: 78000 },
        { _id: 'D3', orderId: 'ORD-C103', reason: 'Delayed Delivery — 48hr SLA Breached', status: 'RESOLVED', raisedBy: 'Buyer', createdAt: new Date(Date.now() - 86400000), escrowAmount: 32000 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return { color: 'text-warning bg-warning/5', label: 'ARBITRATION_QUEUED' };
      case 'IN_REVIEW': return { color: 'text-secondary bg-secondary/5', label: 'ARBITER_ACTIVE' };
      case 'RESOLVED': return { color: 'text-success bg-success/5', label: 'SETTLEMENT_COMPLETE' };
      default: return { color: 'text-gray-400 bg-gray-50', label: status };
    }
  };

  const filtered = statusFilter === 'ALL' ? disputes : disputes.filter(d => d.status === statusFilter);
  const activeCount = disputes.filter(d => d.status !== 'RESOLVED').length;

  return (
    <div className="max-w-7xl mx-auto space-y-20 pb-32 fade-in">
      {/* Arbiter Command Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative overflow-hidden p-4">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
            Arbitration_Nexus v3.0 [ELEVATED_ACCESS]
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gray-950 tracking-tighter italic leading-none uppercase">
            Arbiter <span className="not-italic text-primary">Nexus.</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-xl text-xl leading-relaxed italic">
            Manage and resolve <span className="text-gray-950 font-black italic">{disputes.length} conflict threads</span> across the SmartKissan procurement network with full escrow control.
          </p>
        </div>

        <div className="flex flex-wrap gap-8 relative z-10">
          <div className="stitch-card p-8 bg-white shadow-2xl shadow-gray-200/50 flex items-center gap-6 group hover:rotate-1 transition-transform">
            <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
              <Scale size={28} />
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] italic leading-none">ACTIVE_DISPUTES</p>
              <p className="text-3xl font-black text-gray-950 italic tracking-tighter leading-none">{activeCount}</p>
            </div>
          </div>
          <div className="stitch-card p-8 bg-secondary/5 border border-secondary/10 shadow-2xl shadow-secondary/5 flex items-center gap-6 group hover:-rotate-1 transition-transform">
            <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
              <Clock size={28} />
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] italic leading-none">AVG_RESOLUTION</p>
              <p className="text-3xl font-black text-gray-950 italic tracking-tighter leading-none">4.2<span className="text-base text-gray-400">H</span></p>
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none -mr-40 -mt-10">
          <h1 className="text-[20rem] font-black italic tracking-tighter uppercase leading-none">LAW</h1>
        </div>
      </div>

      {/* Priority Alert Banner */}
      {activeCount > 0 && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mx-4">
          <div className="stitch-card p-10 md:p-12 bg-error/5 border border-error/10 shadow-2xl shadow-error/5 relative overflow-hidden group">
            <div className="flex items-start gap-10 relative z-10">
              <div className="w-20 h-20 bg-error/10 text-error rounded-[2rem] flex items-center justify-center shrink-0 border border-error/20 shadow-inner group-hover:rotate-12 transition-transform duration-700">
                <ShieldAlert size={40} strokeWidth={1.5} />
              </div>
              <div className="space-y-3">
                <h4 className="font-black text-3xl text-gray-950 italic tracking-tighter uppercase leading-none">Priority Resolution <span className="text-error not-italic">Required.</span></h4>
                <p className="text-xl font-medium text-gray-400 italic leading-relaxed max-w-3xl">
                  <span className="text-gray-950 font-black uppercase">{activeCount} disputes</span> are pending arbitration. Unresolved conflicts older than 24 hours reduce platform trust scores and may trigger automated escrow freezes.
                </p>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-12 text-error/5 pointer-events-none">
              <ShieldAlert size={250} />
            </div>
          </div>
        </motion.div>
      )}

      {/* Filter Control */}
      <div className="flex flex-col lg:flex-row gap-8 px-4">
        <div className="relative flex-1 group">
          <Search size={24} className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="SCAN BY DISPUTE_ID OR ORDER_REF..." 
            className="w-full pl-20 pr-10 py-10 bg-white border border-gray-100 rounded-[3rem] focus:ring-12 focus:ring-primary/5 focus:border-primary/20 outline-none font-black text-[11px] text-gray-950 uppercase tracking-[0.2em] italic placeholder:text-gray-200 shadow-2xl shadow-gray-200/50"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex p-3 bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/30 gap-2">
            {['ALL', 'PENDING', 'IN_REVIEW', 'RESOLVED'].map((s) => (
              <button 
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-8 py-5 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.4em] italic transition-all whitespace-nowrap ${
                  statusFilter === s ? 'bg-gray-950 text-white shadow-2xl shadow-gray-950/20' : 'text-gray-400 hover:text-gray-950'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dispute Cards */}
      <div className="space-y-10 px-4">
        <AnimatePresence mode="popLayout">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="stitch-card p-12 bg-white border-none shadow-2xl animate-pulse h-52" />
            ))
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="stitch-card py-48 text-center space-y-10 bg-white shadow-2xl">
              <CheckCircle2 size={100} className="text-gray-100 mx-auto" strokeWidth={1} />
              <div className="space-y-6">
                <h3 className="text-5xl font-black text-gray-950 italic uppercase">All Clear <span className="text-success not-italic">✓</span></h3>
                <p className="text-gray-400 text-xl italic">No disputes match the current filter. The platform is running smoothly.</p>
              </div>
            </motion.div>
          ) : (
            filtered.map((dispute, index) => {
              const conf = getStatusConfig(dispute.status);
              return (
                <motion.div
                  key={dispute._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="group"
                >
                  <div className="stitch-card p-12 md:p-16 bg-white border-none shadow-2xl shadow-gray-200/50 hover:translate-y-[-6px] transition-all duration-700 relative overflow-hidden">
                    <div className="flex flex-col lg:flex-row gap-12 justify-between">
                      <div className="flex-1 space-y-10">
                        <div className="flex flex-wrap items-center gap-6">
                          <span className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] italic border border-current/10 shadow-sm ${conf.color}`}>
                            {conf.label}
                          </span>
                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] italic bg-gray-50 px-5 py-2.5 rounded-xl border border-gray-100">
                            RAISED_BY::{dispute.raisedBy.toUpperCase()}
                          </span>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-4xl font-black text-gray-950 italic tracking-tighter leading-none uppercase group-hover:text-primary transition-colors">
                            ORDER::{dispute.orderId}
                          </h3>
                          <p className="text-xl font-medium text-gray-400 italic leading-relaxed">{dispute.reason}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-8 pt-4 border-t border-gray-50">
                          <div className="flex items-center gap-3 text-[11px] font-black text-gray-300 uppercase tracking-[0.4em] italic">
                            <Clock size={16} /> {new Date(dispute.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-3 text-[11px] font-black text-gray-300 uppercase tracking-[0.4em] italic">
                            <MessageSquare size={16} /> 5 ARBITRATION_THREADS
                          </div>
                        </div>
                      </div>

                      <div className="w-full lg:w-80 flex flex-col justify-between gap-8 shrink-0">
                        <div className="p-10 bg-gray-950 text-white rounded-[3rem] relative overflow-hidden group/escrow shadow-2xl shadow-gray-950/20">
                          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] italic mb-4">ESCROW_VAULT_LOCKED</p>
                          <p className="text-5xl font-black italic tracking-tighter leading-none group-hover/escrow:text-warning transition-colors">₹{dispute.escrowAmount?.toLocaleString()}</p>
                          <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none">
                            <Scale size={80} />
                          </div>
                        </div>
                        
                        <button className="w-full py-8 bg-primary text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.5em] italic flex items-center justify-center gap-5 shadow-2xl shadow-primary/20 hover:bg-gray-950 transition-all group/btn relative overflow-hidden">
                          <span className="relative z-10 flex items-center gap-5">ENTER_ARBITRATION <ArrowRight size={22} className="group-hover/btn:translate-x-3 transition-transform" /></span>
                          <div className="absolute inset-0 bg-gray-950 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                        </button>
                      </div>
                    </div>
                    <div className="absolute inset-0 pointer-events-none bg-scanline opacity-[0.01]"></div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DisputesManagementPage;
