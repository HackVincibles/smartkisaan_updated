import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, 
  MapPin, 
  Package, 
  Wallet, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Star,
  Bell,
  Navigation,
  ShieldCheck,
  ChevronRight,
  Calendar,
  Fuel,
  Activity,
  Zap,
  Target,
  Workflow,
  ArrowUpRight,
  Settings,
  MoreVertical
} from 'lucide-react';
import { Link } from 'react-router-dom';
// @ts-ignore
import transporterService from '../../services/transporterService';
import { formatCurrency, formatRelativeTime } from '../../lib/utils';
import toast from 'react-hot-toast';

const TransporterDashboard = () => {
  const [stats, setStats] = useState<any>({
    activeTrips: 0,
    completedTrips: 0,
    totalEarnings: 0,
    rating: 0
  });
  const [recentTrips, setRecentTrips] = useState<any[]>([]);
  const [availableLoads, setAvailableLoads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, tripsRes, loadsRes] = await Promise.all([
        transporterService.getDashboardStats(),
        transporterService.getTrips({ limit: 5 }),
        transporterService.getAvailableLoads({ limit: 3 })
      ]);
      
      const d = statsRes.data;
      setStats({
        activeTrips: d.activeOrdersCount || 0,
        completedTrips: d.stats?.completed || 0,
        totalEarnings: d.totalEarnings || 0,
        rating: d.agency?.averageRating || 0
      });
      setRecentTrips(tripsRes.data.orders || []);
      setAvailableLoads(loadsRes.data.loads || []);
    } catch (error) {
      console.error('Fleet Link Failed:', error);
      toast.error('Logistics Node Synchronization Failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh] fade-in">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 border-4 border-secondary-100 border-t-secondary rounded-[2rem] animate-spin mx-auto shadow-2xl"></div>
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-secondary italic">Connecting to Fleet Command...</p>
            <p className="text-xs text-gray-400 font-medium italic">Synchronizing regional logistics nodes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 fade-in">
      {/* Header with Fleet Status */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-secondary">
            <Workflow size={14} /> <span>Logistics Protocol v4.0</span>
            <ChevronRight size={10} className="text-gray-300" />
            <span className="text-gray-400 italic">Fleet Hub</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight italic leading-none">
            Fleet <span className="not-italic text-secondary">Command.</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4 p-3 bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50">
          <div className="px-6 py-3 bg-success/10 text-success rounded-2xl border border-success/10 flex items-center gap-3 font-black text-[10px] uppercase tracking-widest italic">
            <div className="w-2.5 h-2.5 bg-success rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            Neural Link Active
          </div>
          <div className="w-px h-8 bg-gray-100 mx-1" />
          <button className="p-3.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-2xl transition-all relative">
            <Bell size={20} />
            <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-error border-2 border-white rounded-full"></span>
          </button>
        </div>
      </div>

      {/* High-Fidelity Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { title: 'Active Payloads', value: stats.activeTrips, meta: 'Real-time transit', icon: Navigation, color: 'secondary' },
          { title: 'Pending Clusters', value: '03', meta: 'Next 24h Window', icon: Activity, color: 'warning' },
          { title: 'Cycle Earnings', value: formatCurrency(stats.totalEarnings), meta: 'Current Month', icon: Wallet, color: 'success' },
          { title: 'Fleet Authority', value: `${stats.rating || 4.8}/5`, meta: 'Verified Elite', icon: Star, color: 'secondary' }
        ].map((stat, i) => (
          <div key={i} className="stitch-card p-8 group relative overflow-hidden bg-white hover:translate-y-[-5px] transition-transform">
            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-start">
                <div className={`w-14 h-14 bg-${stat.color} rounded-2xl flex items-center justify-center text-white shadow-xl shadow-${stat.color}/20 group-hover:rotate-3 transition-transform`}>
                  <stat.icon size={24} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">{stat.meta}</span>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-gray-900 mb-1 italic tracking-tighter leading-none">{stat.value}</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic leading-none">{stat.title}</p>
              </div>
            </div>
            <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-${stat.color}/5 rounded-full blur-[60px]`}></div>
          </div>
        ))}
      </div>

      {/* Operational Nexus Grid */}
      <div className="grid lg:grid-cols-12 gap-12">
        {/* Active Dispatch Center */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex justify-between items-end px-4">
            <div className="space-y-1">
                <h2 className="text-2xl font-bold italic tracking-tight">Active <span className="not-italic text-secondary">Dispatch.</span></h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Live Logistics Monitoring</p>
            </div>
            <Link to="/transporter/orders" className="text-[11px] font-bold text-secondary uppercase tracking-[0.2em] hover:opacity-70 transition-opacity flex items-center gap-2 italic">
                Full Schedule <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="space-y-6">
            {recentTrips.filter(t => t.escrowState !== 'COMPLETED').length === 0 ? (
              <div className="stitch-card p-20 text-center space-y-8 bg-gray-50/50 border-dashed">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl">
                    <Truck size={40} className="text-gray-200" />
                </div>
                <div className="space-y-2">
                    <p className="text-xl font-bold text-gray-400 italic">No active payloads detected in your sector.</p>
                    <p className="text-xs text-gray-400 font-medium">Scanning regional marketplace for available loads...</p>
                </div>
                <Link to="/transporter/loads" className="inline-flex px-10 py-5 bg-secondary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-secondary/20 hover:bg-secondary-600 transition-all">
                  Initialize Scan
                </Link>
              </div>
            ) : (
              recentTrips.filter(t => t.escrowState !== 'COMPLETED').map((trip, i) => (
                <div key={i} className="stitch-card p-8 bg-white hover:border-secondary/20 transition-all group overflow-hidden relative">
                  <div className="relative z-10 flex flex-col md:flex-row justify-between gap-10">
                    <div className="space-y-8 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 rounded-[1.5rem] bg-gray-900 text-white flex items-center justify-center font-black text-xs shadow-2xl relative">
                            <Truck size={24} className="group-hover:translate-x-1 transition-transform" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full border-2 border-white"></div>
                          </div>
                          <div>
                            <h4 className="text-2xl font-bold text-gray-900 italic tracking-tight">{trip.listingId?.productName || 'Agri Payload'}</h4>
                            <div className="flex items-center gap-3">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Node ID: #{trip._id?.substring(0, 8)}</p>
                                <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-secondary italic">Priority Freight</p>
                            </div>
                          </div>
                        </div>
                        <span className="px-5 py-2.5 rounded-xl bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-[0.2em] italic border border-secondary/10">
                          {trip.escrowState}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-8 relative py-4 bg-gray-50/50 rounded-[2rem] px-8 border border-gray-100/50">
                        <div className="shrink-0 flex flex-col items-center gap-2">
                          <div className="w-3.5 h-3.5 rounded-full bg-success shadow-[0_0_10px_rgba(34,197,94,0.4)]"></div>
                          <div className="w-px h-10 bg-gradient-to-b from-success to-warning"></div>
                          <div className="w-3.5 h-3.5 rounded-full bg-warning shadow-[0_0_10px_rgba(245,158,11,0.4)]"></div>
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Origin Node</p>
                            <p className="text-lg font-bold text-gray-900 italic leading-none">{trip.pickupAddress || 'Regional Hub, India'}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Destination Node</p>
                            <p className="text-lg font-bold text-gray-900 italic leading-none">{trip.deliveryAddress || 'Terminal Hub, India'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex md:flex-col justify-end gap-4 shrink-0 md:border-l border-gray-100 md:pl-10">
                      <div className="text-right hidden md:block mb-4 space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Settlement</p>
                        <p className="text-3xl font-bold text-success tracking-tighter italic leading-none">{formatCurrency(trip.freightCharge)}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">{trip.quantity} {trip.unit} Load</p>
                      </div>
                      <div className="flex gap-3">
                        <Link 
                          to={`/transporter/trips/${trip._id}`}
                          className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl flex-1 md:flex-none text-center"
                        >
                          Access Logs
                        </Link>
                        <button className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-secondary hover:text-white transition-all shadow-sm">
                          <MapPin size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              ))
            )}
          </div>

          {/* Available Marketplace Section */}
          <section className="stitch-card p-10 bg-gray-900 text-white relative overflow-hidden group shadow-2xl">
            <div className="relative z-10">
              <div className="flex justify-between items-end mb-10">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold italic tracking-tight flex items-center gap-3">
                        Marketplace <span className="not-italic text-secondary">Neural Link.</span>
                        <Zap size={20} className="text-secondary fill-secondary animate-pulse" />
                    </h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">High-Priority Regional Payloads</p>
                </div>
                <Link to="/transporter/loads" className="text-[11px] font-black uppercase tracking-[0.3em] text-secondary hover:text-white transition-colors italic">Access All Nodes →</Link>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {availableLoads.map((load, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-center justify-between p-6 bg-white/5 rounded-[2.5rem] border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer group/item"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover/item:scale-110 transition-transform">
                        <Fuel size={28} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white italic tracking-tight">{load.productName}</h4>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">{load.from} → {load.to}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-secondary text-xl tracking-tighter italic leading-none">₹{load.fee.toLocaleString()}</p>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-gray-600 mt-1">{load.weight} Qtl Payload</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="absolute -right-40 -bottom-40 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
          </section>
        </div>

        {/* Sidebar Intelligence Column */}
        <div className="lg:col-span-4 space-y-8">
          {/* Growth Accelerator */}
          <div className="stitch-card p-10 bg-gradient-to-br from-secondary to-secondary-700 rounded-[3.5rem] text-white shadow-2xl shadow-secondary/20 relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-2xl rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-2xl group-hover:scale-110 transition-transform duration-700">
                    <TrendingUp size={32} />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-black italic tracking-tighter leading-tight">Scale Your <br /> Authority.</h3>
                    <p className="text-white/70 text-sm font-medium leading-relaxed italic">Activate smart-notifications to capture high-value freight clusters before competitive nodes.</p>
                </div>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-5 bg-white text-secondary rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-black/10 transition-all italic"
                >
                  Authorize Alerts
                </motion.button>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[60px] -mr-24 -mt-24 group-hover:opacity-40 transition-opacity"></div>
          </div>

          {/* Quick Hub Navigation */}
          <div className="stitch-card p-10 bg-white shadow-2xl shadow-gray-200/50 space-y-10">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold italic tracking-tight leading-none">Hub <span className="not-italic text-secondary">Operations.</span></h3>
                <Settings size={20} className="text-gray-300 hover:text-secondary cursor-pointer transition-colors" />
            </div>
            <div className="space-y-4">
              {[
                { label: 'Asset Verification', icon: ShieldCheck, link: '/transporter/scan', color: 'secondary' },
                { label: 'Settlement Ledger', icon: TrendingUp, link: '/transporter/earnings', color: 'success' },
                { label: 'Fleet Documents', icon: Package, link: '/transporter/documents', color: 'warning' }
              ].map((action, i) => (
                <Link 
                  key={i}
                  to={action.link}
                  className="flex items-center justify-between p-6 rounded-[1.8rem] bg-gray-50/50 border border-transparent hover:border-secondary/10 hover:bg-secondary/5 transition-all group"
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${action.color}/10 text-${action.color} group-hover:scale-110 transition-transform`}>
                      <action.icon size={20} />
                    </div>
                    <span className="font-bold text-gray-700 italic tracking-tight">{action.label}</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-secondary transition-all" />
                </Link>
              ))}
            </div>
          </div>

          {/* Fleet Status Card */}
          <div className="stitch-card p-10 bg-white shadow-2xl shadow-gray-200/50 relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold italic tracking-tight leading-none">Fleet <span className="not-italic text-secondary">Node.</span></h3>
                <MoreVertical size={20} className="text-gray-300" />
              </div>
              <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 group-hover:bg-white group-hover:border-secondary/10 transition-all duration-500">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">Operational Chassis</span>
                  <div className="flex items-center gap-2 px-3 py-1 bg-success/10 text-success rounded-lg text-[8px] font-black uppercase tracking-widest border border-success/10">
                    <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></div>
                    Verified
                  </div>
                </div>
                <h4 className="font-black text-gray-900 text-2xl italic tracking-tighter mb-1">RJ 14 GH 1234</h4>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">Tata 1613 • 16 Ton Payload Node</p>
              </div>
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-2 italic">
                <span className="flex items-center gap-2"><Clock size={12} className="text-secondary" /> Next Sync: 12 Jun</span>
                <Link to="/transporter/profile" className="text-secondary hover:underline">Update Terminal</Link>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-secondary/5 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransporterDashboard;
