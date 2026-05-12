import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  ShoppingBag, 
  Truck, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  CheckCircle,
  Filter,
  MoreVertical,
  Download,
  Search,
  Bell,
  Scale,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
  Globe,
  Database,
  ChevronRight,
  Sparkles,
  Command,
  LayoutGrid,
  History,
  Target,
  Bot,
  Workflow,
  Cpu,
  Fingerprint,
  Lock,
  ArrowRight,
  Settings,
  MoreHorizontal,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
// @ts-ignore
import adminService from '../../services/adminService';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>({
    revenue: 0,
    totalMarketValue: 0,
    totalUsers: 0,
    activeOrders: 0,
    totalListings: 0
  });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, auditRes, alertsRes] = await Promise.allSettled([
        adminService.getDashboardStats(),
        adminService.getAuditLogs({ limit: 5 }),
        adminService.getPendingListings()
      ]);
      
      if (statsRes.status === 'fulfilled') {
        const d = statsRes.value.data;
        setStats({
          revenue: d.financials?.platformCommission || 0,
          totalMarketValue: d.financials?.grossMarketValue || 0,
          totalUsers: d.users?.reduce((acc: number, curr: any) => acc + curr.count, 0) || 0,
          activeOrders: d.inventory?.activeOrders || 0,
          totalListings: d.inventory?.totalListings || 0
        });
      }

      if (auditRes.status === 'fulfilled') {
        setRecentTransactions(auditRes.value.data || []);
      }
      
      if (alertsRes.status === 'fulfilled') {
        const pendingListings = alertsRes.value.data || [];
        setAlerts(pendingListings.map((l: any) => ({
          id: l._id,
          title: 'Listing Authorization Required',
          description: `${l.productName} by ${l.farmerId?.name || 'Farmer Node'}`,
          type: 'kyc',
          orderId: l._id,
          time: '2m ago'
        })));
      }
    } catch (error) {
      console.error('Nexus Uplink Failed:', error);
      toast.error('Global Operations Nexus Offline');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[75vh] fade-in">
        <div className="text-center space-y-8">
          <div className="w-24 h-24 border-4 border-gray-100 border-t-gray-900 rounded-[2.5rem] animate-spin mx-auto shadow-2xl shadow-gray-200"></div>
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 italic shimmer">Synchronizing Global Nexus...</p>
            <p className="text-xs text-gray-300 font-medium italic">Establishing Root Infrastructure Protocol...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32 fade-in">
      {/* Premium Operations Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative overflow-hidden p-4">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-tertiary italic">
            <div className="w-1.5 h-1.5 bg-tertiary rounded-full animate-pulse"></div>
            Root Infrastructure Control v4.0.2
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-gray-950 tracking-tighter italic leading-none">
            Network <span className="not-italic text-tertiary">Nexus.</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-xl text-xl leading-relaxed italic">
            Overseeing the pan-India agricultural grid. Real-time telemetry across <span className="text-gray-900 font-black">1.2M nodes</span> and active global clusters.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 relative z-10">
          <div className="px-8 py-4 bg-tertiary/10 text-tertiary rounded-[1.8rem] border border-tertiary/10 flex items-center gap-4 font-black text-[10px] uppercase tracking-[0.3em] italic shadow-2xl shadow-tertiary/5">
            <Activity size={16} className="animate-pulse" />
            Grid Status: Optimal
          </div>
          <div className="flex gap-4">
            <button className="p-4 bg-white border border-gray-100 rounded-2xl shadow-xl hover:bg-gray-50 transition-all text-gray-400">
              <Download size={20} />
            </button>
            <button className="p-4 bg-white border border-gray-100 rounded-2xl shadow-xl hover:bg-gray-50 transition-all relative text-gray-400">
              <Bell size={20} />
              <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-error border-2 border-white rounded-full animate-ping"></span>
            </button>
          </div>
        </div>

        {/* Decorative Background Text */}
        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none -mr-20">
            <h1 className="text-[15rem] font-black italic tracking-tighter">OVERSEER</h1>
        </div>
      </div>

      {/* Global Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { title: 'Global Participants', value: stats.totalUsers.toLocaleString(), change: '+12%', icon: Users, color: 'gray' },
          { title: 'Nexus Commission', value: formatCurrency(stats.revenue), change: '+8.4%', icon: DollarSign, color: 'tertiary' },
          { title: 'Gross Flow Volume', value: formatCurrency(stats.totalMarketValue), change: '+15.2%', icon: TrendingUp, color: 'secondary' },
          { title: 'Active Payloads', value: stats.activeOrders, change: '-2%', icon: Activity, color: 'warning' }
        ].map((stat, i) => (
          <div key={i} className="stitch-card p-10 group bg-white hover:translate-y-[-5px] transition-all relative overflow-hidden">
            <div className="relative z-10 space-y-8 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className={`w-14 h-14 bg-${stat.color === 'gray' ? 'gray-950' : stat.color} rounded-2xl flex items-center justify-center text-white shadow-2xl group-hover:rotate-3 transition-transform`}>
                  <stat.icon size={28} />
                </div>
                <div className={`px-3 py-1 rounded-xl text-[9px] font-black tracking-widest uppercase italic ${stat.change.startsWith('+') ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                  {stat.change}
                </div>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-gray-950 italic tracking-tighter mb-1 leading-none">{stat.value}</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{stat.title}</p>
              </div>
            </div>
            <div className={`absolute -bottom-12 -right-12 w-32 h-32 bg-${stat.color === 'gray' ? 'gray-900' : stat.color}/5 rounded-full blur-[60px]`}></div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Core Operations Command */}
        <div className="lg:col-span-8 space-y-12">
          {/* Authorization Queue */}
          <section className="space-y-8">
            <div className="flex justify-between items-end px-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-tertiary italic">Operations Queue</p>
                <h2 className="text-3xl font-bold text-gray-950 tracking-tight italic leading-none">Authorization <span className="not-italic text-tertiary">Nexus.</span></h2>
              </div>
              <Link to="/admin/notifications" className="text-[11px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-[0.2em] italic flex items-center gap-2 transition-colors">
                Audit Stream <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {alerts.length === 0 ? (
                  <div className="stitch-card p-24 text-center space-y-6 bg-gray-50/50 border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-2xl">
                      <CheckCircle size={36} className="text-success" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-xl font-bold text-gray-400 italic tracking-tight">Queue Depleted.</p>
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">No pending administrative authorizations required.</p>
                    </div>
                  </div>
                ) : (
                  alerts.map((alert, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="stitch-card p-8 flex items-center justify-between group hover:border-tertiary/20 transition-all relative overflow-hidden"
                    >
                      <div className="flex items-center gap-8 relative z-10">
                        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 ${alert.type === 'kyc' ? 'bg-tertiary/10 text-tertiary' : 'bg-error/10 text-error'} border border-white/10 shadow-xl group-hover:scale-110 transition-transform`}>
                          {alert.type === 'kyc' ? <Shield size={28} /> : <AlertTriangle size={28} />}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-2xl font-bold text-gray-950 tracking-tight italic leading-tight group-hover:text-tertiary transition-colors">{alert.title}</h4>
                          <div className="flex items-center gap-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">{alert.description}</p>
                            <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 italic flex items-center gap-2"><Clock size={12} /> {alert.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 relative z-10">
                        <button className="px-8 py-4 bg-gray-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] italic hover:bg-tertiary transition-all shadow-2xl shadow-gray-200">
                          Authorize Node
                        </button>
                        <button className="p-4 bg-gray-50 hover:bg-error hover:text-white rounded-2xl text-gray-400 transition-all shadow-sm">
                            <MoreHorizontal size={20} />
                        </button>
                      </div>
                      <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* Infrastructure Ledger */}
          <section className="stitch-card overflow-hidden bg-white shadow-2xl shadow-gray-200/50">
            <div className="p-10 border-b border-gray-50 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-950 rounded-xl text-white shadow-xl">
                    <History size={24} />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-950 tracking-tight italic leading-none">Audit <span className="not-italic text-tertiary">Ledger.</span></h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic mt-1">Immutable Network Logs</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-gray-900 transition-colors"><Filter size={18} /></button>
                <button className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-gray-900 transition-colors"><Settings size={18} /></button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic">Protocol Event</th>
                    <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic">Authorized By</th>
                    <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic">Signature Status</th>
                    <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 italic">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentTransactions.map((tx, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-all group cursor-pointer">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                            <div className="space-y-1">
                                <p className="font-bold text-gray-950 text-base italic tracking-tight group-hover:text-tertiary transition-colors">{tx.action?.replace(/_/g, ' ')}</p>
                                <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Hash ID: {tx._id?.substring(0, 16)}</p>
                            </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gray-950 text-white flex items-center justify-center font-black text-xs shadow-xl">
                            {tx.performedBy?.name?.charAt(0) || 'R'}
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-sm font-bold text-gray-950 italic">{tx.performedBy?.name || 'System Root'}</span>
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Administrator Node</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 text-success text-[9px] font-black uppercase tracking-[0.2em] italic border border-success/20 shadow-sm">
                          <Fingerprint size={12} />
                          Verified Sig
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <p className="text-[11px] text-gray-950 font-black italic">{formatDateTime(tx.createdAt)}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Standard Time</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Intelligence Command Sidebar */}
        <div className="lg:col-span-4 space-y-12">
          {/* Network Pulse Visualization */}
          <div className="stitch-card p-10 bg-gray-950 text-white relative overflow-hidden group shadow-2xl">
            <div className="relative z-10 space-y-12">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-bold italic tracking-tight">Network <span className="text-tertiary">Pulse.</span></h3>
                        <Activity size={20} className="text-tertiary animate-pulse" />
                    </div>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest italic">Global Commodity Flux Index</p>
                </div>
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-tertiary shadow-2xl border border-white/5">
                  <Globe size={24} />
                </div>
              </div>
              
              <div className="space-y-8">
                {[
                  { name: 'Wheat Cluster', orders: '2.8k Assigned', val: '₹4.12 Cr', color: 'tertiary', width: '85%' },
                  { name: 'Rice Cluster', orders: '1.9k Assigned', val: '₹3.25 Cr', color: 'secondary', width: '70%' },
                  { name: 'Chickpea Cluster', orders: '1.5k Assigned', val: '₹2.15 Cr', color: 'warning', width: '55%' }
                ].map((prod, i) => (
                  <div key={i} className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="font-bold text-white text-lg italic tracking-tight">{prod.name}</p>
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic">{prod.orders} Assigned</p>
                      </div>
                      <p className="font-black text-tertiary text-sm tracking-widest italic">{prod.val}</p>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: prod.width }}
                        transition={{ delay: 0.3 + (i * 0.15), duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className={`h-full bg-${prod.color} rounded-full shadow-[0_0_12px_rgba(0,0,0,0.5)]`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full py-5 bg-white text-gray-950 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] italic hover:bg-tertiary hover:text-white transition-all shadow-2xl shadow-black">
                Full Network Report
              </button>
            </div>
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none -z-0">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>
          </div>

          {/* Rapid Hub Navigation */}
          <div className="stitch-card p-10 bg-white shadow-2xl shadow-gray-200/50 space-y-12">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-950 rounded-xl text-white shadow-xl">
                    <Target size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-950 tracking-tight italic leading-none">Hub <span className="not-italic text-tertiary">Rails.</span></h3>
            </div>
            <div className="space-y-4">
              {[
                { label: 'KYC Authorization', icon: Shield, link: '/admin/users', color: 'gray-950' },
                { label: 'Settlement Disputes', icon: Scale, link: '/admin/disputes', color: 'warning' },
                { label: 'Escrow Sovereignty', icon: Database, link: '/admin/escrow', color: 'tertiary' },
                { label: 'Mandi Node Matrix', icon: Globe, link: '/admin/mandi', color: 'secondary' }
              ].map((action, i) => (
                <Link 
                  key={i}
                  to={action.link}
                  className="flex items-center justify-between p-6 rounded-[2rem] bg-gray-50/50 hover:bg-gray-950 hover:text-white transition-all group border border-transparent hover:border-gray-900"
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${action.color} text-white shadow-xl group-hover:scale-110 transition-transform`}>
                      <action.icon size={20} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">{action.label}</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-tertiary transition-all" />
                </Link>
              ))}
            </div>
          </div>

          {/* Neural Advisor Protocol */}
          <div className="stitch-card p-10 bg-gradient-to-br from-tertiary to-tertiary-700 rounded-[3.5rem] text-white shadow-2xl shadow-tertiary/20 relative overflow-hidden group">
            <div className="relative z-10 space-y-8">
              <div className="flex gap-5">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-2xl rounded-2xl flex items-center justify-center shrink-0 border border-white/20 shadow-2xl group-hover:scale-110 transition-transform duration-700">
                    <Bot size={32} className="text-white" />
                </div>
                <div className="space-y-1">
                    <h4 className="text-2xl font-bold italic tracking-tight leading-none">Root Advisor</h4>
                    <p className="text-white/60 text-[9px] font-black uppercase tracking-[0.3em] italic">Active Intelligence Stream</p>
                </div>
              </div>
              <p className="text-sm font-medium leading-relaxed italic text-white/80">
                Network volume is diverging by <span className="text-white font-black underline decoration-white/20">+22%</span> in the Southern Hub. 
                Authorize automated throughput scaling for the Logistics cluster?
              </p>
              <button className="w-full py-5 bg-white text-tertiary rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] italic shadow-2xl shadow-black/10 transition-all">
                Execute Root Suggestion
              </button>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[60px] -mr-24 -mt-24 group-hover:opacity-40 transition-opacity"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
