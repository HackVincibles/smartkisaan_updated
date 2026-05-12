import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Gavel, 
  TrendingUp, 
  Wallet, 
  Truck, 
  Cloud, 
  Droplets,
  Wind,
  Thermometer,
  Zap,
  Sparkles,
  Target,
  ChevronRight,
  Activity,
  Users,
  ShieldCheck,
  Bot,
  Workflow,
  Cpu,
  Fingerprint,
  Lock,
  ArrowRight,
  Settings,
  MoreHorizontal,
  Clock,
  ArrowUpRight,
  MapPin,
  Leaf
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
// @ts-ignore
import farmerService from '../../services/farmerService';
import SBTBadge from '../../components/farmer/SBTBadge';
import AIGradeCard from '../../components/farmer/AIGradeCard';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>({
    activeListings: 0,
    totalBids: 0,
    totalEarnings: 0,
    rating: 0,
    trustScore: 98
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [clusters, setClusters] = useState<any[]>([]);
  const [insurance, setInsurance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, clustersRes, insuranceRes] = await Promise.allSettled([
        farmerService.getDashboardStats(),
        farmerService.getClusters(),
        farmerService.checkInsurance()
      ]);
      
      if (statsRes.status === 'fulfilled') {
        const d = statsRes.value.data;
        setStats({
          activeListings: d.listings?.active || 0,
          totalBids: d.orders?.activeBids || 0,
          totalEarnings: d.totalRevenue || 0,
          rating: d.farmer?.averageRating || 0,
          trustScore: d.trustScore || 98
        });
        setRecentActivity(d.recentOrders || []);
      }

      if (clustersRes.status === 'fulfilled') {
        setClusters(clustersRes.value.data || []);
      }

      if (insuranceRes.status === 'fulfilled') {
        setInsurance(insuranceRes.value.data);
      }

    } catch (error) {
      console.error('Nexus Uplink Failed:', error);
      toast.error('Farm Intelligence Nexus Offline');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[75vh] fade-in">
        <div className="text-center space-y-8">
          <div className="w-24 h-24 border-4 border-gray-100 border-t-primary rounded-[2.5rem] animate-spin mx-auto shadow-2xl shadow-primary-200"></div>
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 italic shimmer">Synchronizing Farm Intelligence...</p>
            <p className="text-xs text-gray-300 font-medium italic">Establishing Neural Agriculture Protocol...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32 fade-in">
      {/* Premium Hero Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative overflow-hidden p-4">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-primary italic">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
            Agricultural Protocol v4.0.2 Active
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-gray-950 tracking-tighter italic leading-none">
            Farm <span className="not-italic text-primary">Command.</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-xl text-xl leading-relaxed italic">
            Welcome back, <span className="text-gray-900 font-black">{user?.fullName?.split(' ')[0] || 'Operator'}</span>. Your regional cluster is synchronized across <span className="text-gray-900 font-black">{stats.activeListings} active nodes</span>.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 relative z-10">
            <Link to="/farmer/listings/add" className="px-10 py-5 bg-primary text-white rounded-[1.8rem] flex items-center gap-4 font-black text-[10px] uppercase tracking-[0.3em] italic shadow-2xl shadow-primary/20 hover:bg-primary-600 transition-all">
                Initialize Listing <Zap size={16} fill="white" />
            </Link>
            <div className="flex items-center gap-4 px-6 py-4 bg-white border border-gray-100 rounded-[1.8rem] shadow-xl shadow-gray-200/50">
                <SBTBadge 
                  badge={{ name: 'Elite', type: 'trust', description: 'Top Tier' }}
                  size="sm"
                />
                <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-none">Trust Score</p>
                    <p className="text-lg font-bold text-primary italic tracking-tight leading-none">{stats.trustScore}</p>
                </div>
            </div>
        </div>

        {/* Decorative Background Text */}
        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none -mr-20">
            <h1 className="text-[15rem] font-black italic tracking-tighter">OPERATOR</h1>
        </div>
      </div>

      {/* KPI Intelligence Stream */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { title: 'Active Inventory', value: stats.activeListings, meta: '+2 Clusters', icon: Package, color: 'primary', link: '/farmer/listings' },
          { title: 'Market Bids', value: stats.totalBids, meta: '5 Priority', icon: Gavel, color: 'secondary', link: '/farmer/bids' },
          { title: 'Supply Pipeline', value: recentActivity.filter(o => o.status !== 'COMPLETED').length, meta: 'Real-time Tracking', icon: Truck, color: 'warning', link: '/farmer/orders' },
          { title: 'Yield Capital', value: formatCurrency(stats.totalEarnings), meta: 'Cycle Earnings', icon: Wallet, color: 'success', link: '/farmer/payments' }
        ].map((stat, i) => (
          <Link key={i} to={stat.link} className="stitch-card p-10 group bg-white hover:translate-y-[-5px] transition-all relative overflow-hidden block">
            <div className="relative z-10 space-y-8 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className={`w-14 h-14 bg-${stat.color} rounded-2xl flex items-center justify-center text-white shadow-2xl group-hover:rotate-3 transition-transform`}>
                  <stat.icon size={28} />
                </div>
                <span className="text-[9px] font-black tracking-widest uppercase italic text-gray-400">
                  {stat.meta}
                </span>
              </div>
              <div>
                <h3 className="text-4xl font-bold text-gray-950 italic tracking-tighter mb-1 leading-none">{stat.value}</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{stat.title}</p>
              </div>
            </div>
            <div className={`absolute -bottom-12 -right-12 w-32 h-32 bg-${stat.color}/5 rounded-full blur-[60px]`}></div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Core Operations Nexus */}
        <div className="lg:col-span-8 space-y-12">
          {/* Yield Analysis Terminal */}
          <section className="space-y-8">
            <div className="flex justify-between items-end px-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic">Intelligence Feed</p>
                <h2 className="text-3xl font-bold text-gray-950 tracking-tight italic leading-none">Yield <span className="not-italic text-primary">Analysis.</span></h2>
              </div>
              <Link to="/farmer/insights" className="text-[11px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-[0.2em] italic flex items-center gap-2 transition-colors">
                Mandi Intelligence <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="group transition-all duration-700">
                <AIGradeCard 
                  grade="Premium A+"
                  qualityMetrics={{
                    moisture: '11.8%',
                    purity: '99.2%',
                    protein: '12.4%',
                    weight: '240 Quintal'
                  }}
                  pricePrediction={{
                    estimatedPrice: 2240,
                    minPrice: 2150,
                    maxPrice: 2400,
                    confidence: 92,
                    bestTimeframe: 'Market Peak Expected'
                  }}
                />
            </div>
          </section>

          {/* Infrastructure Clusters */}
          {clusters.length > 0 && (
            <section className="space-y-8">
              <div className="flex justify-between items-end px-4">
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary italic">Consolidated Operations</p>
                    <h2 className="text-3xl font-bold text-gray-950 tracking-tight italic leading-none">Agri <span className="not-italic text-secondary">Clusters.</span></h2>
                </div>
                <div className="px-5 py-2 bg-secondary/10 text-secondary rounded-xl text-[10px] font-black uppercase tracking-widest italic border border-secondary/10">
                    Active Nodes
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {clusters.map((cluster, i) => (
                  <div key={i} className="stitch-card p-10 bg-white hover:border-secondary/20 transition-all group overflow-hidden relative">
                    <div className="relative z-10 flex flex-col justify-between h-full gap-10">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h4 className="text-2xl font-bold text-gray-950 italic tracking-tight">{cluster.clusterId}</h4>
                                <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></div>
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic flex items-center gap-2">
                                <MapPin size={12} className="text-secondary" /> {cluster.center?.address || 'Regional Command Hub'}
                            </p>
                          </div>
                          <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary border border-secondary/10 group-hover:scale-110 transition-transform">
                            <TrendingUp size={24} />
                          </div>
                        </div>
                        <div className="flex justify-between items-end">
                          <div className="flex -space-x-3">
                            {cluster.members.slice(0, 4).map((_: any, idx: number) => (
                              <div key={idx} className="w-10 h-10 rounded-xl bg-gray-950 border-4 border-white flex items-center justify-center text-[10px] font-black text-white italic shadow-xl">
                                N{idx + 1}
                              </div>
                            ))}
                            {cluster.members.length > 4 && (
                              <div className="w-10 h-10 rounded-xl bg-secondary border-4 border-white flex items-center justify-center text-[10px] font-black text-white italic shadow-xl">
                                +{cluster.members.length - 4}
                              </div>
                            )}
                          </div>
                          <button className="text-[11px] font-black uppercase tracking-[0.2em] text-secondary hover:underline italic flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                            Initialize Sync <ArrowRight size={14} />
                          </button>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* System Event Stream */}
          <section className="stitch-card p-10 space-y-10 bg-white shadow-2xl shadow-gray-200/50 relative overflow-hidden">
            <div className="flex justify-between items-center relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-950 rounded-xl text-white shadow-xl">
                    <Activity size={24} />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-950 tracking-tight italic leading-none">System <span className="not-italic text-gray-400">Events.</span></h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic mt-1">Real-time Operations Log</p>
                </div>
              </div>
              <button className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-300 hover:text-gray-900 transition-colors italic">Full Archives</button>
            </div>
            
            <div className="space-y-6 relative z-10">
              {recentActivity.length > 0 ? recentActivity.map((activity, i) => (
                <div key={i} className="flex items-center gap-8 p-6 rounded-[2rem] bg-gray-50/50 hover:bg-white hover:shadow-xl hover:border-gray-100 border border-transparent transition-all group cursor-pointer">
                  <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 bg-white border border-gray-100 text-gray-950 shadow-sm group-hover:scale-110 transition-transform">
                    <Package size={28} className="group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="text-xl font-bold text-gray-950 tracking-tight italic group-hover:text-primary transition-colors leading-none">{activity.status}</h4>
                    <div className="flex items-center gap-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Signature: #{activity.id.slice(-8)}</p>
                        <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                        <p className="text-[10px] font-black text-success uppercase tracking-widest italic">₹{activity.totalAmount} Settlement</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-200 group-hover:text-primary group-hover:translate-x-2 transition-all" />
                </div>
              )) : (
                <div className="text-center py-10 space-y-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                        <Activity size={32} className="text-gray-200" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 italic">No operational anomalies detected.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Intelligence Command Sidebar */}
        <div className="lg:col-span-4 space-y-12">
          {/* Climate Radar Visualization */}
          <div className="stitch-card p-10 bg-gray-950 text-white relative overflow-hidden group shadow-2xl">
            <div className="relative z-10 space-y-12">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-bold italic tracking-tight">Climate <span className="text-primary">Radar.</span></h3>
                        <Cloud size={20} className="text-primary animate-pulse" />
                    </div>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest italic">Regional Cluster Metrics</p>
                </div>
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-primary shadow-2xl border border-white/5">
                  <Activity size={24} />
                </div>
              </div>
              
              <div className="flex items-end gap-3">
                <span className="text-7xl font-bold tracking-tighter italic leading-none">32°</span>
                <div className="mb-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-primary leading-none italic">Optimal Range</p>
                    <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">Soil Biosphere Active</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-10 border-t border-white/5">
                {[
                  { label: 'Humid Index', value: '41%', icon: Droplets, color: 'primary' },
                  { label: 'Air Velocity', value: '12km', icon: Wind, color: 'secondary' },
                  { label: 'UV Index', value: 'Mod', icon: Thermometer, color: 'warning' }
                ].map((env, i) => (
                  <div key={i} className="text-center space-y-3">
                    <env.icon size={20} className={`mx-auto text-${env.color}/40`} />
                    <div className="space-y-1">
                        <p className="text-[8px] font-black uppercase tracking-widest text-white/20 italic">{env.label}</p>
                        <p className="text-sm font-bold italic tracking-tight">{env.value}</p>
                    </div>
                  </div>
                ))}
              </div>
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

          {/* Insurance Sovereignty */}
          <div className={`stitch-card p-10 relative overflow-hidden group shadow-2xl transition-all duration-700 ${insurance?.eligible ? 'bg-primary text-white border-transparent' : 'bg-white'}`}>
            <div className="relative z-10 flex gap-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl group-hover:scale-110 transition-transform ${insurance?.eligible ? 'bg-white/20 border border-white/20 text-white' : 'bg-primary/10 border border-primary/10 text-primary'}`}>
                <ShieldCheck size={32} />
              </div>
              <div className="space-y-4">
                <div>
                    <h4 className="text-2xl font-bold italic tracking-tight leading-none">Agri-Shield.</h4>
                    <p className={`text-[9px] font-black uppercase tracking-[0.3em] mt-1 italic ${insurance?.eligible ? 'text-white/60' : 'text-gray-400'}`}>Asset Sovereignty Protection</p>
                </div>
                <p className={`text-sm font-medium leading-relaxed italic ${insurance?.eligible ? 'text-white/80' : 'text-gray-500'}`}>
                  {insurance?.eligible 
                    ? `Institutional protection via ${insurance.scheme} active. Sovereign coverage for ${insurance.coverage} enforced.`
                    : 'Analyze eligibility for PMFBY institutional protection to secure harvest capital.'}
                </p>
                {!insurance?.eligible && (
                  <button className="text-[11px] font-black uppercase tracking-[0.2em] text-primary hover:underline italic flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                    Authorize Verification <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] ${insurance?.eligible ? 'bg-white/10' : 'bg-primary/5'}`}></div>
          </div>

          {/* Rapid Hub Navigation */}
          <div className="stitch-card p-10 bg-white shadow-2xl shadow-gray-200/50 space-y-12">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-950 rounded-xl text-white shadow-xl">
                    <Workflow size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-950 tracking-tight italic leading-none">Hub <span className="not-italic text-primary">Rails.</span></h3>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Inventory Pipeline', icon: Package, link: '/farmer/listings', color: 'primary' },
                { label: 'Bidding Engine', icon: Gavel, link: '/farmer/bids', color: 'secondary' },
                { label: 'Supply Tracking', icon: Truck, link: '/farmer/orders', color: 'warning' },
                { label: 'Financial Vault', icon: Wallet, link: '/farmer/payments', color: 'success' }
              ].map((action, i) => (
                <Link 
                  key={i}
                  to={action.link}
                  className="flex items-center justify-between p-6 rounded-[2rem] bg-gray-50/50 hover:bg-gray-950 hover:text-white transition-all group border border-transparent hover:border-gray-900"
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white border border-gray-100 shadow-sm group-hover:scale-110 transition-transform`}>
                      <action.icon size={20} className={`text-${action.color}`} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] italic leading-none">{action.label}</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-primary transition-all" />
                </Link>
              ))}
            </div>
          </div>

          {/* Neural Copilot Protocol */}
          <div className="stitch-card p-10 bg-gradient-to-br from-primary to-primary-700 rounded-[3.5rem] text-white shadow-2xl shadow-primary-900/20 relative overflow-hidden group">
            <div className="relative z-10 space-y-8">
              <div className="flex gap-5">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-2xl rounded-2xl flex items-center justify-center shrink-0 border border-white/20 shadow-2xl group-hover:scale-110 transition-transform duration-700">
                    <Bot size={32} className="text-white" />
                </div>
                <div className="space-y-1">
                    <h4 className="text-2xl font-bold italic tracking-tight leading-none">Agri Copilot</h4>
                    <p className="text-white/60 text-[9px] font-black uppercase tracking-[0.3em] italic">Active Intelligence Stream</p>
                </div>
              </div>
              <p className="text-sm font-medium leading-relaxed italic text-white/80">
                Wheat cluster prices are diverging by <span className="text-white font-black underline decoration-white/20">+14.2%</span> in your sector. 
                Need to optimize your sell-order timing to capture the peak?
              </p>
              <Link to="/farmer/chat" className="w-full py-5 bg-white text-primary rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] italic shadow-2xl shadow-black/10 transition-all block text-center">
                Initialize Copilot
              </Link>
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[60px] -mr-24 -mt-24 group-hover:opacity-40 transition-opacity"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
