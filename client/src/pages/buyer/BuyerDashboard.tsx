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
  CreditCard
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
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatusIcon = (status: string) => {
    switch(status) {
      case 'COMPLETED': return <CheckCircle size={18} className="text-success" />;
      case 'IN_TRANSIT':
      case 'DELIVERED': return <Truck size={18} className="text-secondary" />;
      case 'BID_PLACED':
      case 'PENDING_PAYMENT':
      case 'PAID_ESCROW': return <Clock size={18} className="text-warning" />;
      default: return <Package size={18} className="text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-secondary-100 border-t-secondary rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 shimmer">Syncing Market Intelligence...</p>
        </div>
      </div>
    );
  }

  const kpiCards = [
    { label: 'Active Pipeline', value: stats.totalOrders, icon: ShoppingCart, color: 'secondary', sub: 'Orders in cycle' },
    { label: 'Bidding Ops', value: stats.pendingOrders, icon: Target, color: 'warning', sub: 'Live negotiations' },
    { label: 'Capital Flow', value: `₹${(stats.totalSpent / 1000).toFixed(1)}k`, icon: BarChart3, color: 'success', sub: 'Gross volume' },
    { label: 'Trust Index', value: '4.8', icon: ShieldCheck, color: 'primary', sub: 'Verified rating' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 fade-in">
      {/* Premium Hero Header */}
      <div className="relative overflow-hidden bg-gray-900 rounded-[2.5rem] p-8 md:p-16 text-white shadow-2xl group">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,_#3b82f6_0%,_transparent_50%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,_#2563eb_0%,_transparent_50%)]"></div>
        </div>
        
        <div className="relative z-10 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-xl rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10">
              <Sparkles size={12} className="text-secondary-400" />
              Verified Sourcing Network
            </div>
            <h1 className="text-4xl md:text-7xl font-bold leading-tight tracking-tighter italic">
              Procurement<br />
              <span className="text-secondary-400 not-italic">Engine.</span>
            </h1>
            <p className="text-secondary-100/60 text-lg font-medium leading-relaxed max-w-xl">
              Aggregate premium inventory from verified farmer clusters. Secure your entire supply chain with institutional-grade escrow protocols.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/buyer/search" className="btn btn-secondary px-10 py-5 rounded-2xl text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-secondary-500/20">
                Explore Markets
                <SearchCode size={18} />
              </Link>
              <Link to="/buyer/demand/create" className="btn btn-outline border-white/10 text-white hover:bg-white hover:text-black px-10 py-5 rounded-2xl text-xs uppercase tracking-widest">
                Post Demand
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 hidden lg:block">
            <div className="bg-white/5 backdrop-blur-3xl rounded-[2rem] p-10 border border-white/10 shadow-2xl space-y-8 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary-400">System Liquidity</h4>
                  <p className="text-3xl font-bold italic tracking-tighter">₹12.4M</p>
                </div>
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center shadow-lg">
                  <Activity size={24} />
                </div>
              </div>
              
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 group-hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-secondary/20 border border-secondary/20" />
                      <div className="h-2 w-32 bg-white/10 rounded-full" />
                    </div>
                    <div className="h-2 w-12 bg-white/10 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stream */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="stitch-card p-8 relative overflow-hidden group"
          >
            <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-${stat.color} shadow-lg shadow-${stat.color}-100`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                <h3 className="text-4xl font-bold text-gray-900 italic tracking-tighter">{stat.value}</h3>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-secondary-600">{stat.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Marketplace - Best Deals */}
        <div className="lg:col-span-8 space-y-10">
          <div className="flex justify-between items-end px-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-secondary-600 mb-1">Intelligence Match</p>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight italic">Recommended <span className="not-italic">Inventory</span></h2>
            </div>
            <Link to="/buyer/search" className="btn btn-outline text-[10px] uppercase tracking-widest">Global View</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence>
              {recommendedProducts.length > 0 ? recommendedProducts.map((product, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={index}
                >
                  <ProductCard product={product} />
                </motion.div>
              )) : (
                <div className="col-span-2 py-20 text-center stitch-card">
                  <Package size={48} className="mx-auto text-gray-200 mb-4" />
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 italic">No inventory matches found</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar Tracking */}
        <div className="lg:col-span-4 space-y-8">
          <div className="stitch-card p-10 space-y-10">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-gray-900 italic">Active <span className="not-italic">Logistics</span></h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Live supply tracking</p>
              </div>
              <Link to="/buyer/orders" className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-secondary hover:bg-secondary-50 transition-all border border-gray-100 shadow-sm">
                <History size={20} />
              </Link>
            </div>
            
            <div className="space-y-8">
              {recentOrders.length === 0 ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
                    <Package size={32} />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Pipeline Empty</p>
                </div>
              ) : (
                recentOrders.map((order, i) => (
                  <Link key={i} to={`/buyer/orders/${order.id}/track`} className="flex items-start gap-5 group">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 group-hover:scale-110 group-hover:bg-white group-hover:border-secondary-100 transition-all shadow-sm">
                      {getOrderStatusIcon(order.escrowState)}
                    </div>
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-secondary transition-colors">
                          {order.listingId?.productName || 'Order Batch'}
                        </h4>
                        <span className="text-[10px] font-bold text-gray-900">{formatCurrency(order.totalAmount)}</span>
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                        <MapPin size={12} className="text-secondary" /> 
                        {order.listingId?.location || 'Regional Hub'}
                      </p>
                      <div className="w-full h-1.5 bg-gray-50 rounded-full mt-3 overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '65%' }}
                          className="h-full bg-secondary" 
                        />
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Procurement Advisor */}
          <div className="bg-secondary-50 rounded-[2.5rem] p-10 border border-secondary-100 relative overflow-hidden group">
            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center shadow-xl shadow-secondary-200">
                  <Bot size={28} className="text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold italic leading-none text-gray-900">Market Advisor</h4>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-secondary-600">Proactive Analysis</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                Basmati Rice prices are projected to drop <span className="text-secondary-600 font-bold">5%</span> in the Nashik cluster next week. Wait for better margins?
              </p>
              <button className="btn btn-secondary w-full py-4 rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-secondary-100">
                Run Margin Audit
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
          </div>

          {/* Infrastructure Sidebar (Trust Widgets) */}
          <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl">
            <div className="relative z-10 space-y-8">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/5 shadow-inner">
                <ShieldCheck size={32} className="text-secondary-400" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold italic tracking-tight">Escrow <span className="text-secondary-400 not-italic">Shield.</span></h3>
                <p className="text-white/40 text-sm font-medium leading-relaxed">
                  Institutional-grade protection for every transaction. Payment release is governed by proof-of-delivery consensus.
                </p>
              </div>
              <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-secondary-400 hover:text-white transition-colors group">
                Protocol Specs <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-secondary rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-1000"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
