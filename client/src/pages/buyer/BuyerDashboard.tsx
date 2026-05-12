import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Package, 
  Truck, 
  TrendingUp, 
  Star, 
  Clock, 
  CheckCircle,
  Search,
  ArrowRight,
  ShieldCheck,
  Award,
  Zap,
  MapPin,
  ChevronRight,
  Sparkles,
  SearchCode,
  Layers,
  Activity,
  History,
  Bot,
  Target,
  BarChart3,
  CreditCard,
  Settings,
  MoreHorizontal,
  ArrowUpRight,
  Fingerprint,
  Cpu,
  Globe
} from 'lucide-react';
// @ts-ignore
import buyerService from '../../services/buyerService';
import { formatCurrency, formatRelativeTime } from '../../lib/utils';
import ProductCard from '../../components/buyer/ProductCard';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const BuyerDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalSpent: 0,
    savedSearches: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.allSettled([
        buyerService.getOrders({ limit: 5 }),
        buyerService.searchProducts({ limit: 6, sort: 'trending' })
      ]);
      
      if (ordersRes.status === 'fulfilled') {
        const orders = ordersRes.value.data.orders || [];
        setRecentOrders(orders);
        setStats(prev => ({
          ...prev,
          totalOrders: ordersRes.value.data.total || 0,
          pendingOrders: orders.filter((o: any) => !['COMPLETED', 'REFUNDED'].includes(o.escrowState)).length,
          totalSpent: ordersRes.value.data.totalSpent || 0
        }));
      }

      if (productsRes.status === 'fulfilled') {
        setRecommendedProducts(productsRes.value.data.products || []);
      }

    } catch (error) {
      console.error('Market Nexus Uplink Failed:', error);
      toast.error('Procurement Intelligence Offline');
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatusIcon = (status: string) => {
    switch(status) {
      case 'COMPLETED': return <CheckCircle size={24} className="text-success" />;
      case 'IN_TRANSIT':
      case 'DELIVERED': return <Truck size={24} className="text-secondary" />;
      case 'BID_PLACED':
      case 'PENDING_PAYMENT':
      case 'PAID_ESCROW': return <Clock size={24} className="text-warning" />;
      default: return <Package size={24} className="text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[75vh] fade-in">
        <div className="text-center space-y-8">
          <div className="w-24 h-24 border-4 border-gray-100 border-t-secondary rounded-[2.5rem] animate-spin mx-auto shadow-2xl shadow-secondary-200"></div>
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 italic shimmer">Synchronizing Market Intelligence...</p>
            <p className="text-xs text-gray-300 font-medium italic">Establishing Neural Procurement Protocol...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32 fade-in">
      {/* Premium Procurement Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative overflow-hidden p-4">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-secondary italic">
            <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse"></div>
            Sourcing Infrastructure Active
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-gray-950 tracking-tighter italic leading-none">
            Sourcing <span className="not-italic text-secondary">Engine.</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-xl text-xl leading-relaxed italic">
            Aggregate premium inventory from verified farmer nodes. Secure your supply chain with <span className="text-gray-900 font-black italic">institutional-grade</span> protocols.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 relative z-10">
            <Link to="/buyer/search" className="px-10 py-5 bg-secondary text-white rounded-[1.8rem] flex items-center gap-4 font-black text-[10px] uppercase tracking-[0.3em] italic shadow-2xl shadow-secondary/20 hover:bg-secondary-600 transition-all">
                Explore Markets <SearchCode size={16} fill="white" />
            </Link>
            <div className="flex items-center gap-4 px-6 py-4 bg-white border border-gray-100 rounded-[1.8rem] shadow-xl shadow-gray-200/50">
                <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                    <Fingerprint size={20} />
                </div>
                <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-none">Status</p>
                    <p className="text-sm font-bold text-gray-950 italic tracking-tight leading-none">Verified Buyer</p>
                </div>
            </div>
        </div>

        {/* Decorative Background Text */}
        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none -mr-20">
            <h1 className="text-[15rem] font-black italic tracking-tighter">PROCURE</h1>
        </div>
      </div>

      {/* Market Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'Active Pipeline', value: stats.totalOrders, sub: 'Orders in cycle', icon: ShoppingCart, color: 'secondary' },
          { label: 'Bidding Ops', value: stats.pendingOrders, sub: 'Live negotiations', icon: Target, color: 'warning' },
          { label: 'Capital Flow', value: formatCurrency(stats.totalSpent), sub: 'Gross volume', icon: BarChart3, color: 'success' },
          { label: 'Trust Index', value: '4.8', sub: 'Verified rating', icon: ShieldCheck, color: 'primary' }
        ].map((stat, i) => (
          <div key={i} className="stitch-card p-10 group bg-white hover:translate-y-[-5px] transition-all relative overflow-hidden">
            <div className="relative z-10 space-y-8 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className={`w-14 h-14 bg-${stat.color} rounded-2xl flex items-center justify-center text-white shadow-2xl group-hover:rotate-3 transition-transform`}>
                  <stat.icon size={28} />
                </div>
                <span className="text-[9px] font-black tracking-widest uppercase italic text-gray-400">
                  {stat.sub}
                </span>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-gray-950 italic tracking-tighter mb-1 leading-none">{stat.value}</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{stat.label}</p>
              </div>
            </div>
            <div className={`absolute -bottom-12 -right-12 w-32 h-32 bg-${stat.color}/5 rounded-full blur-[60px]`}></div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Marketplace - Intelligence Match */}
        <div className="lg:col-span-8 space-y-12">
          <section className="space-y-8">
            <div className="flex justify-between items-end px-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary italic">Intelligence Match</p>
                <h2 className="text-3xl font-bold text-gray-950 tracking-tight italic leading-none">Recommended <span className="not-italic text-secondary">Inventory.</span></h2>
              </div>
              <Link to="/buyer/search" className="text-[11px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-[0.2em] italic flex items-center gap-2 transition-colors">
                Global View <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatePresence>
                {recommendedProducts.length > 0 ? recommendedProducts.map((product, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    key={index}
                    className="group"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                )) : (
                  <div className="col-span-2 p-24 text-center stitch-card bg-gray-50/50 border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-2xl mb-6">
                        <Package size={36} className="text-gray-200" />
                    </div>
                    <p className="text-xl font-bold text-gray-400 italic tracking-tight">No inventory nodes found.</p>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mt-2 italic">Refine your procurement filters to discover new clusters.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>

        {/* Supply Chain Sidebar */}
        <div className="lg:col-span-4 space-y-12">
          {/* Active Logistics Terminal */}
          <section className="stitch-card p-10 bg-white shadow-2xl shadow-gray-200/50 space-y-10 relative overflow-hidden">
            <div className="flex justify-between items-center relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-950 rounded-xl text-white shadow-xl">
                    <Truck size={24} />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-950 tracking-tight italic leading-none">Supply <span className="not-italic text-secondary">Chain.</span></h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic mt-1">Real-time Node Tracking</p>
                </div>
              </div>
              <Link to="/buyer/orders" className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-gray-900 transition-colors shadow-sm">
                <History size={18} />
              </Link>
            </div>
            
            <div className="space-y-6 relative z-10">
              {recentOrders.length === 0 ? (
                <div className="text-center py-10 space-y-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                        <Activity size={32} className="text-gray-200" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 italic">No active payloads in transit.</p>
                </div>
              ) : (
                recentOrders.map((order, i) => (
                  <Link key={i} to={`/buyer/orders/${order.id}/track`} className="flex items-center gap-6 p-6 rounded-[2rem] bg-gray-50/50 hover:bg-white hover:shadow-xl hover:border-gray-100 border border-transparent transition-all group">
                    <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 bg-white border border-gray-100 text-gray-950 shadow-sm group-hover:scale-110 transition-transform">
                      {getOrderStatusIcon(order.escrowState)}
                    </div>
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="text-lg font-bold text-gray-950 truncate italic leading-none group-hover:text-secondary transition-colors">
                          {order.listingId?.productName || 'Order Batch'}
                        </h4>
                        <span className="text-[10px] font-black text-gray-950 italic">{formatCurrency(order.totalAmount)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin size={12} className="text-secondary" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 italic truncate">
                            {order.listingId?.location || 'Regional Nexus Hub'}
                        </p>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden border border-gray-200/50">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: '65%' }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full bg-secondary shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
                        />
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>

          {/* Market Advisor Protocol */}
          <div className="stitch-card p-10 bg-secondary-50 border border-secondary-100 rounded-[3.5rem] relative overflow-hidden group shadow-2xl shadow-secondary-100/50">
            <div className="relative z-10 space-y-8">
              <div className="flex gap-5">
                <div className="w-16 h-16 bg-secondary rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-2xl group-hover:scale-110 transition-transform duration-700">
                    <Bot size={32} className="text-white" />
                </div>
                <div className="space-y-1">
                    <h4 className="text-2xl font-bold italic tracking-tight leading-none text-gray-950">Market Advisor</h4>
                    <p className="text-secondary-600 text-[9px] font-black uppercase tracking-[0.3em] italic">Active Sourcing Feed</p>
                </div>
              </div>
              <p className="text-sm font-medium leading-relaxed italic text-gray-500">
                Basmati clusters are diverging by <span className="text-secondary font-black underline decoration-secondary/20">-5%</span> in the Nashik region. 
                Execute bulk procurement to capture peak margin arbitrage?
              </p>
              <button className="w-full py-5 bg-secondary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] italic shadow-2xl shadow-secondary/20 transition-all hover:bg-secondary-600">
                Run Margin Audit
              </button>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/5 rounded-full blur-[60px] -mr-24 -mt-24 group-hover:opacity-40 transition-opacity"></div>
          </div>

          {/* Institutional Protection */}
          <div className="stitch-card p-10 bg-gray-950 text-white relative overflow-hidden group shadow-2xl">
            <div className="relative z-10 space-y-10">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <h3 className="text-2xl font-bold italic tracking-tight">Escrow <span className="text-secondary">Shield.</span></h3>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest italic">Institutional Trust Protocol</p>
                </div>
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-secondary shadow-2xl border border-white/5">
                  <ShieldCheck size={24} />
                </div>
              </div>
              
              <p className="text-sm font-medium leading-relaxed italic text-white/50">
                Institutional-grade protection for every transaction. Payment release is governed by proof-of-delivery <span className="text-white font-bold underline decoration-white/20">blockchain consensus</span>.
              </p>
              
              <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-secondary hover:text-white transition-all group/btn italic">
                Protocol Specs <ArrowRight size={14} className="group-hover/btn:translate-x-2 transition-transform" />
              </button>
            </div>
            
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </svg>
            </div>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-secondary rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-1000"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
