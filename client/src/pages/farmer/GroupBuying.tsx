import React from 'react';
import { 
  Users, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Info,
  ChevronRight,
  Workflow,
  Cpu,
  Globe,
  Sparkles,
  Package,
  Layers,
  ArrowUpRight,
  Activity,
  UserPlus
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { motion } from 'framer-motion';

const groups = [
  { id: '1', item: 'NPK Fertilizer (50kg)', price: '₹1,200', original: '₹1,600', savings: '25%', members: 18, target: 25, daysLeft: 2 },
  { id: '2', item: 'Hybrid Tomato Seeds', price: '₹450', original: '₹600', savings: '25%', members: 42, target: 50, daysLeft: 4 },
  { id: '3', item: 'Organic Compost (1 Ton)', price: '₹8,500', original: '₹11,000', savings: '22%', members: 5, target: 10, daysLeft: 7 },
];

const GroupBuying = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32 fade-in">
      {/* Premium Procurement Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative overflow-hidden p-4">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
            Procurement Collective Protocol v4.2.1
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-gray-950 tracking-tighter italic leading-none">
            Group <span className="not-italic text-primary">Buying.</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-xl text-xl leading-relaxed italic">
            Join forces with local nodes to slash input costs. Synchronizing <span className="text-gray-900 font-black italic">bulk procurement channels</span> directly with manufacturers.
          </p>
        </div>
        
        <button className="px-12 py-6 bg-gray-950 text-white rounded-[2rem] font-black text-[12px] uppercase tracking-[0.5em] italic shadow-2xl shadow-gray-200 hover:bg-primary transition-all flex items-center gap-4 relative z-10">
            START NEW COLLECTIVE <UserPlus size={20} />
        </button>

        {/* Decorative Background Text */}
        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none -mr-20">
            <h1 className="text-[15rem] font-black italic tracking-tighter">BULK</h1>
        </div>
      </div>

      {/* Protocol Explanation Banner */}
      <div className="stitch-card p-12 bg-gray-50/50 backdrop-blur-xl border border-gray-100 flex flex-col md:flex-row items-center gap-10 group relative overflow-hidden mx-4">
        <div className="w-20 h-20 bg-white rounded-[1.8rem] flex items-center justify-center text-primary shadow-2xl border border-gray-100 group-hover:rotate-12 transition-transform duration-700">
          <Workflow size={36} />
        </div>
        <div className="flex-1 space-y-3 text-center md:text-left">
          <h4 className="text-2xl font-black text-gray-950 italic tracking-tight">Collective Operation Protocol</h4>
          <p className="text-gray-400 font-medium italic text-lg leading-relaxed">
            By ordering through collective channels, you unlock institutional pricing. Payments are held in <span className="text-gray-950 font-black">Polygon Smart-Escrow</span> and only released once the bulk threshold is reached.
          </p>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
            <Layers size={100} />
        </div>
      </div>

      {/* Collective Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 px-4">
        {groups.map((group, idx) => (
          <motion.div 
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="stitch-card p-12 group relative overflow-hidden bg-white shadow-2xl shadow-gray-200/50 hover:translate-y-[-8px] transition-all duration-500 flex flex-col"
          >
            <div className="flex justify-between items-start mb-10">
              <div className="w-20 h-20 bg-gray-950 rounded-[2rem] flex items-center justify-center text-primary shadow-2xl group-hover:rotate-6 transition-all duration-700">
                <Package size={36} />
              </div>
              <div className="text-right space-y-2">
                <div className="inline-flex px-4 py-1.5 rounded-xl bg-primary/10 text-[10px] font-black text-primary uppercase tracking-[0.2em] italic border border-primary/10">SAVE {group.savings}</div>
                <div className="text-4xl font-black text-gray-950 italic tracking-tighter leading-none">{group.price}</div>
                <div className="text-sm text-gray-300 line-through font-black italic tracking-widest">{group.original}</div>
              </div>
            </div>

            <h3 className="text-3xl font-black text-gray-950 mb-4 italic tracking-tight leading-none group-hover:text-primary transition-colors">{group.item}</h3>
            
            <div className="mt-auto space-y-8 pt-8 border-t border-gray-50">
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] italic">
                  <span className="text-gray-400">THRESHOLD PROGRESS</span>
                  <span className="text-gray-950">{group.members} / {group.target} NODES</span>
                </div>
                <div className="w-full h-2.5 bg-gray-50 rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(group.members / group.target) * 100}%` }}
                    transition={{ duration: 1.5, delay: idx * 0.2 }}
                    className="h-full bg-primary shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">
                <div className="flex items-center gap-3">
                  <Users size={16} className="text-primary" /> REGIONAL COLLECTIVE
                </div>
                <div className="flex items-center gap-2">
                    <Activity size={16} /> {group.daysLeft}D REMAINING
                </div>
              </div>

              <button className="w-full py-6 bg-gray-950 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.4em] italic hover:bg-primary transition-all shadow-2xl shadow-gray-200 flex items-center justify-center gap-4 group/btn overflow-hidden relative">
                <span className="relative z-10 flex items-center gap-4">JOIN COLLECTIVE <ArrowRight size={20} className="group-hover/btn:translate-x-3 transition-transform" /></span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Protection Infrastructure Advisory */}
      <div className="stitch-card p-16 bg-gray-950 text-white relative overflow-hidden group shadow-2xl shadow-gray-950/20 mx-4">
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
            <div className="w-28 h-28 bg-primary/20 backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-center text-primary border border-primary/20 shadow-2xl group-hover:rotate-12 transition-transform duration-1000">
                <ShieldCheck size={48} className="stroke-[1.5]" />
            </div>
            <div className="flex-1 text-center lg:text-left space-y-6">
                <div className="inline-flex items-center gap-4 px-6 py-2 bg-primary/20 text-primary rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic border border-primary/20 shadow-2xl">
                    <Sparkles size={18} /> ASSET PROTECTION ACTIVE
                </div>
                <h3 className="text-4xl md:text-5xl font-bold italic tracking-tighter leading-tight">Sovereign Buyer Protection</h3>
                <p className="text-gray-400 font-medium max-w-3xl leading-relaxed text-xl italic">
                    All group purchases are protected by <span className="text-primary font-black italic underline underline-offset-8 decoration-4 decoration-primary/20">Institutional Escrow</span>. If the collective fails to reach the target, your payment is refunded instantly to your digital vault.
                </p>
            </div>
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-16 py-8 bg-white text-gray-950 rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.5em] italic shadow-2xl shadow-black/20 hover:bg-primary hover:text-white transition-all"
            >
                VIEW SAFETY PROTOCOL
            </motion.button>
        </div>
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] -mr-80 -mt-80 group-hover:opacity-40 transition-opacity duration-1000"></div>
        <div className="absolute bottom-0 left-0 p-12 text-white/5 group-hover:text-white/10 transition-colors">
            <Globe size={160} />
        </div>
      </div>
    </div>
  );
};

export default GroupBuying;
