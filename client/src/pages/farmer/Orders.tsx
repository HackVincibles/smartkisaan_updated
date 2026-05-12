import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Clock, 
  ShoppingBag,
  ChevronRight,
  ArrowRight,
  IndianRupee,
  ShieldCheck,
  Zap,
  MoreVertical,
  Scale,
  Activity,
  Workflow,
  Cpu,
  Fingerprint,
  ArrowUpRight,
  MoreHorizontal,
  Layers,
  History,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import apiClient from '../../services/api';
import { formatCurrency } from '../../lib/utils';
import { toast } from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/farmer/orders');
      const data = res.data.data || [];
      setOrders(Array.isArray(data) ? data : []);
      
      if (Array.isArray(data) && data.length === 0) {
        // Mock data for demo
        setOrders([
          {
            _id: 'ORD-1122',
            cropName: 'Basmati Rice (Organic)',
            quantity: 50,
            unit: 'Quintal',
            agreedPrice: 4250,
            escrowState: 'PAID_ESCROW',
            createdAt: new Date(Date.now() - 86400000),
            buyerName: 'Global Grains Pvt Ltd'
          },
          {
            _id: 'ORD-1123',
            cropName: 'Golden Wheat',
            quantity: 120,
            unit: 'Quintal',
            agreedPrice: 2180,
            escrowState: 'COMPLETED',
            createdAt: new Date(Date.now() - 86400000 * 5),
            buyerName: 'Mandi Direct'
          }
        ]);
      }
    } catch (e) {
      console.error('Error fetching orders', e);
      toast.error('Orders Nexus Uplink Failed');
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'DISPUTED': return 'error';
      case 'IN_TRANSIT': return 'secondary';
      default: return 'warning';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32 fade-in">
      {/* Premium Orders Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative overflow-hidden p-4">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
            Sales Registry & Settlement Protocol v4.0.2
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-gray-950 tracking-tighter italic leading-none">
            Sales <span className="not-italic text-primary">Ledger.</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-xl text-xl leading-relaxed italic">
            Monitoring <span className="text-gray-900 font-black italic">{orders.length} active settlement cycles</span>. Real-time capital flow synchronization enabled.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 relative z-10">
            <div className="flex items-center gap-8 p-6 bg-white border border-gray-100 rounded-[1.8rem] shadow-xl shadow-gray-200/50">
                <div className="text-center border-r border-gray-100 pr-8">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic mb-1">Pending Payout</p>
                    <p className="text-2xl font-black text-primary italic tracking-tight leading-none">₹2.1L</p>
                </div>
                <div className="text-center">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic mb-1">Total Volume</p>
                    <p className="text-2xl font-black text-gray-950 italic tracking-tight leading-none">170 Qtl</p>
                </div>
            </div>
            <button className="px-10 py-5 bg-gray-950 text-white rounded-[1.8rem] flex items-center gap-4 font-black text-[10px] uppercase tracking-[0.3em] italic shadow-2xl shadow-gray-200 hover:bg-primary transition-all">
                Full Audit Log <Workflow size={16} />
            </button>
        </div>

        {/* Decorative Background Text */}
        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none -mr-20">
            <h1 className="text-[15rem] font-black italic tracking-tighter">REGISTRY</h1>
        </div>
      </div>

      {/* Control Surface */}
      <div className="flex flex-col md:flex-row gap-6 items-center px-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search order hash / buyer node..." 
            className="w-full pl-16 pr-8 py-5 bg-white border border-gray-100 rounded-[1.8rem] text-sm font-medium italic focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all outline-none shadow-sm"
          />
        </div>
        <div className="flex gap-4">
            <button className="p-5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-950 transition-all shadow-sm">
                <History size={20} />
            </button>
            <button className="p-5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-950 transition-all shadow-sm">
                <Activity size={20} />
            </button>
        </div>
      </div>

      {/* Order Registry */}
      <div className="relative min-h-[400px]">
        {loading ? (
          <div className="space-y-8">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-40 bg-white rounded-[3.5rem] animate-pulse border border-gray-50 shadow-sm" />
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-8">
            <AnimatePresence mode="popLayout">
                {orders.map((order: any, idx: number) => (
                    <motion.div 
                        key={order._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        className="stitch-card p-10 bg-white shadow-2xl shadow-gray-200/50 group flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative overflow-hidden"
                    >
                        <div className="flex items-center gap-10 relative z-10">
                            <div className="w-24 h-24 rounded-[2rem] bg-gray-50 flex items-center justify-center text-gray-200 border border-gray-100 shadow-inner group-hover:scale-110 group-hover:text-primary transition-all duration-700">
                                <Package size={40} />
                            </div>
                            <div className="space-y-3">
                                <div className="flex flex-wrap items-center gap-4">
                                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest italic bg-${getStatusVariant(order.escrowState)}/10 text-${getStatusVariant(order.escrowState)} border border-${getStatusVariant(order.escrowState)}/10`}>
                                        {order.escrowState.replace('_', ' ')}
                                    </span>
                                    <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic">SIGNATURE: #{order._id?.slice(-8)}</span>
                                </div>
                                <h4 className="text-3xl font-bold text-gray-950 italic tracking-tight leading-none truncate max-w-[300px]">{order.cropName}</h4>
                                <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-none">
                                    <span>BUYER: <span className="text-primary">{order.buyerName || 'Verified Node'}</span></span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                                    <span>SYNCHRONIZED: {new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 px-12 lg:border-x lg:border-gray-50 relative z-10 flex-1">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] italic leading-none mb-1">Payload Volume</p>
                                <p className="text-xl font-black text-gray-950 italic tracking-tight leading-none flex items-center gap-3">
                                    <Scale size={18} className="text-primary" /> {order.quantity} {order.unit || 'Qtl'}
                                </p>
                            </div>
                            
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] italic leading-none mb-1">Capital Settlement</p>
                                <p className="text-2xl font-black text-gray-950 italic tracking-tight leading-none">{formatCurrency(order.quantity * order.agreedPrice)}</p>
                            </div>

                            <div className="hidden md:block space-y-1 text-right lg:text-left">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] italic leading-none mb-1">Sovereign Protection</p>
                                <p className="text-sm font-black text-primary italic flex items-center gap-2 justify-end lg:justify-start">
                                    <ShieldCheck size={16} /> Escrow Protocol Active
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 relative z-10">
                            <button className="p-4 bg-gray-50 rounded-2xl text-gray-300 hover:text-gray-950 transition-all shadow-sm">
                                <MoreHorizontal size={24} />
                            </button>
                            <button className="px-10 py-5 bg-gray-950 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] italic hover:bg-primary transition-all shadow-2xl shadow-gray-100 flex items-center gap-4 group/btn">
                                ANALYZE NODES <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                            </button>
                        </div>
                        
                        {/* Background Decor */}
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-${getStatusVariant(order.escrowState)}/5 rounded-full blur-[60px] -mr-16 -mt-16`}></div>
                    </motion.div>
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
                <div className="w-24 h-24 bg-primary/5 rounded-[2.5rem] flex items-center justify-center mx-auto border border-primary/10 shadow-2xl shadow-primary/10">
                    <History size={48} className="text-primary" />
                </div>
                <div className="space-y-3">
                    <h3 className="text-3xl font-bold text-gray-950 italic tracking-tight">Registry Silent.</h3>
                    <p className="text-gray-400 font-medium italic max-w-sm mx-auto">
                        No sales history detected in your regional sector. Active nodes are live and awaiting buyer synchronization.
                    </p>
                </div>
                <Link to="/farmer/listings" className="px-10 py-5 bg-gray-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] italic shadow-2xl shadow-gray-200 hover:bg-primary transition-all inline-block">
                    SYNCHRONIZE LISTINGS
                </Link>
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

      {/* Settlement Intel Banner */}
      <div className="stitch-card p-12 bg-gray-950 text-white relative overflow-hidden group shadow-2xl shadow-gray-950/20">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/20 text-primary rounded-xl text-[9px] font-black uppercase tracking-widest italic border border-primary/20">
                    <CheckCircle size={14} /> Settlement Protocols Verified
                </div>
                <h2 className="text-4xl font-bold italic tracking-tighter leading-tight max-w-xl">
                    Guaranteed <span className="text-primary">Settlement.</span> No Hidden Delta.
                </h2>
                <p className="text-gray-400 font-medium italic text-lg leading-relaxed max-w-lg">
                    Smart-Kissan uses <span className="text-white font-black italic">Polygon Blockchain</span> to lock procurement capital. Payout release is automated post-delivery.
                </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 shrink-0 relative z-10">
                <div className="p-8 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/5 text-center group-hover:border-primary/20 transition-colors">
                    <p className="text-5xl font-black text-primary italic tracking-tighter leading-none mb-2">24<span className="text-xl text-white">h</span></p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic leading-none">Max Liquidity Cycle</p>
                </div>
                <div className="p-8 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/5 text-center group-hover:border-primary/20 transition-colors">
                    <p className="text-5xl font-black text-white italic tracking-tighter leading-none mb-2">0<span className="text-xl text-white">%</span></p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic leading-none">Intermediary Delta</p>
                </div>
            </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48 group-hover:opacity-40 transition-opacity duration-1000"></div>
        <div className="absolute bottom-0 left-0 p-12 text-white/5 group-hover:text-white/10 transition-colors">
            <Fingerprint size={120} />
        </div>
      </div>
    </div>
  );
};

export default Orders;
