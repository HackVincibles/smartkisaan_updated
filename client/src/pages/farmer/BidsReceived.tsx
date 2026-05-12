import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Gavel, 
  ChevronRight, 
  ArrowRight, 
  Zap, 
  Activity, 
  Activity as ActivityIcon,
  Workflow,
  Cpu,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  MoreHorizontal
} from 'lucide-react';
import BidCard from '../../components/farmer/BidCard';
import DashboardLayout from '../../components/layout/DashboardLayout';
import apiClient from '../../services/api';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const BidsReceived = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/farmer/bids');
      setBids(res.data.data || []);
    } catch (e) {
      console.error('Error fetching bids', e);
      toast.error('Bidding Nexus Uplink Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: string) => {
    try {
      await apiClient.post(`/farmer/bids/${id}/accept`);
      setBids(bids.filter((b: any) => b._id !== id));
      toast.success('Protocol Executed: Order Initialized');
    } catch (e) {
      toast.error('Authorization Failed: Bid Rejection Error');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await apiClient.post(`/farmer/bids/${id}/reject`);
      setBids(bids.filter((b: any) => b._id !== id));
      toast.success('Bid Terminated Successfully');
    } catch (e) {
      toast.error('Protocol Error: Rejection Failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32 fade-in">
      {/* Premium Bidding Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative overflow-hidden p-4">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-secondary italic">
            <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse"></div>
            Market Bidding Protocol v2.1.0
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-gray-950 tracking-tighter italic leading-none">
            Bidding <span className="not-italic text-secondary">Nexus.</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-xl text-xl leading-relaxed italic">
            Review and authorize inbound procurement offers. Your assets are currently attracting <span className="text-gray-900 font-black italic">{bids.length} active bids</span>.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 relative z-10">
            <div className="flex items-center gap-4 px-8 py-5 bg-white border border-gray-100 rounded-[1.8rem] shadow-xl shadow-gray-200/50">
                <TrendingUp size={20} className="text-success" />
                <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-none">Market Demand</p>
                    <p className="text-lg font-bold text-success italic tracking-tight leading-none">+12.4%</p>
                </div>
            </div>
            <button className="px-10 py-5 bg-gray-950 text-white rounded-[1.8rem] flex items-center gap-4 font-black text-[10px] uppercase tracking-[0.3em] italic shadow-2xl shadow-gray-200 hover:bg-secondary transition-all">
                Export Ledger <Workflow size={16} />
            </button>
        </div>

        {/* Decorative Background Text */}
        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none -mr-20">
            <h1 className="text-[15rem] font-black italic tracking-tighter">BIDS</h1>
        </div>
      </div>

      {/* Control Surface */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 px-4">
        <div className="flex items-center gap-4 p-2 bg-gray-50/50 backdrop-blur-xl rounded-[2.5rem] border border-gray-100">
            {['active', 'archived', 'rejected'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-8 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] italic transition-all ${
                        activeTab === tab 
                        ? 'bg-white text-secondary shadow-xl border border-secondary/10' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    {tab} Offers
                </button>
            ))}
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
                <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search Buyer Node / ID..." 
                    className="w-full pl-16 pr-8 py-5 bg-white border border-gray-100 rounded-[1.8rem] text-sm font-medium italic focus:ring-4 focus:ring-secondary/5 focus:border-secondary/20 transition-all outline-none shadow-sm"
                />
            </div>
            <button className="p-5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-950 transition-all shadow-sm">
                <Filter size={20} />
            </button>
        </div>
      </div>

      {/* Bidding Grid */}
      <div className="relative min-h-[400px]">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="h-[450px] bg-white rounded-[3.5rem] animate-pulse border border-gray-50 shadow-sm" />
            ))}
          </div>
        ) : bids.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <AnimatePresence mode="popLayout">
                {bids.map((bid: any) => (
                    <BidCard 
                        key={bid._id} 
                        bid={bid} 
                        onAccept={handleAccept} 
                        onReject={handleReject} 
                    />
                ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-40 stitch-card bg-white border border-dashed border-gray-200 relative overflow-hidden"
          >
            <div className="relative z-10 space-y-8">
                <div className="w-24 h-24 bg-secondary/5 rounded-[2.5rem] flex items-center justify-center mx-auto border border-secondary/10 shadow-2xl shadow-secondary/10">
                    <Gavel size={48} className="text-secondary" />
                </div>
                <div className="space-y-3">
                    <h3 className="text-3xl font-bold text-gray-950 italic tracking-tight">Nexus Silent.</h3>
                    <p className="text-gray-400 font-medium italic max-w-sm mx-auto">
                        Your nodes are operational, but no inbound offers have been intercepted yet. Market visibility is optimized.
                    </p>
                </div>
                <button className="px-10 py-5 bg-gray-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] italic shadow-2xl shadow-gray-200 hover:bg-secondary transition-all">
                    Initialize Market Push
                </button>
            </div>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </svg>
            </div>
          </motion.div>
        )}
      </div>

      {/* Analytics Summary Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-16 border-t border-gray-100">
        {[
          { label: 'Avg Bid Intensity', value: '3.2 Per Listing', icon: ActivityIcon, color: 'primary' },
          { label: 'Conversion Delta', value: '+18.4%', icon: TrendingUp, color: 'success' },
          { label: 'Buyer Verification', value: 'Elite Level', icon: ShieldCheck, color: 'secondary' }
        ].map((metric, i) => (
            <div key={i} className="flex items-center gap-6 group">
                <div className={`w-16 h-16 rounded-[1.5rem] bg-gray-50 flex items-center justify-center text-${metric.color} border border-gray-100 group-hover:bg-gray-950 group-hover:text-white transition-all duration-500 shadow-sm`}>
                    <metric.icon size={28} />
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic leading-none">{metric.label}</p>
                    <p className="text-2xl font-black text-gray-950 italic tracking-tight leading-none">{metric.value}</p>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default BidsReceived;
