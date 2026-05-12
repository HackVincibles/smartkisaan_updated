import React from 'react';
import { 
  ShoppingBag, 
  Calendar, 
  Check, 
  X, 
  Phone, 
  User, 
  ArrowUpRight, 
  ShieldCheck, 
  Zap,
  Activity,
  Workflow,
  Clock,
  ChevronRight,
  Gavel
} from 'lucide-react';
import { motion } from 'framer-motion';

interface BidCardProps {
  bid: any;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

const BidCard = ({ bid, onAccept, onReject }: BidCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="stitch-card p-10 bg-white shadow-2xl shadow-gray-200/50 group relative overflow-hidden flex flex-col justify-between"
    >
      <div className="relative z-10 space-y-10">
        {/* Header: Buyer Identity & Price */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-[1.5rem] bg-gray-950 flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform">
              <User size={32} />
            </div>
            <div className="space-y-1">
              <h4 className="text-2xl font-bold text-gray-950 italic tracking-tight leading-none truncate max-w-[150px]">
                {bid.buyerName || 'Premium Buyer'}
              </h4>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic flex items-center gap-2">
                  <Clock size={12} /> {new Date(bid.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          <div className="text-right space-y-1">
            <div className="text-4xl font-black text-success italic tracking-tighter leading-none">
              ₹{bid.amount}
            </div>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] italic">Offer Value</p>
          </div>
        </div>

        {/* Commodity Intelligence */}
        <div className="grid grid-cols-2 gap-6">
          <div className="p-6 bg-gray-50/50 rounded-[1.8rem] border border-gray-100/50 group-hover:bg-white group-hover:border-primary/20 transition-all duration-500">
            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest italic mb-2">Commodity</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-primary shadow-sm">
                <ShoppingBag size={14} />
              </div>
              <h5 className="text-lg font-black text-gray-950 italic tracking-tight">{bid.cropName || 'Wheat (Hybrid)'}</h5>
            </div>
          </div>
          <div className="p-6 bg-gray-50/50 rounded-[1.8rem] border border-gray-100/50 group-hover:bg-white group-hover:border-primary/20 transition-all duration-500">
            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest italic mb-2">Volume</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-secondary shadow-sm">
                <Workflow size={14} />
              </div>
              <h5 className="text-lg font-black text-gray-950 italic tracking-tight">{bid.quantity || '500'} KG</h5>
            </div>
          </div>
        </div>

        {/* Action Protocol */}
        <div className="flex gap-4 pt-2">
          <button 
            onClick={() => onReject(bid._id)}
            className="flex-1 flex items-center justify-center gap-4 py-5 bg-gray-50 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] italic hover:bg-error/10 hover:text-error transition-all border border-transparent hover:border-error/20"
          >
            <X size={16} /> Decline
          </button>
          <button 
            onClick={() => onAccept(bid._id)}
            className="flex-[2] flex items-center justify-center gap-4 py-5 bg-gray-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] italic hover:bg-success transition-all shadow-2xl shadow-gray-200 group/btn overflow-hidden relative"
          >
            <span className="relative z-10 flex items-center gap-4">
              Authorize Bid <ArrowUpRight size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-success to-success-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>
      </div>

      {/* Background Decorative Pattern */}
      <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
        <Gavel size={120} className="-rotate-12" />
      </div>
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-success/5 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
    </motion.div>
  );
};

export default BidCard;
