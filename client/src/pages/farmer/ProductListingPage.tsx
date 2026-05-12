import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Eye, 
  Gavel, 
  Edit, 
  Trash2, 
  MoreVertical,
  AlertCircle,
  CheckCircle,
  Clock,
  Package,
  Filter,
  BarChart3,
  TrendingUp,
  MapPin,
  Scale,
  Zap,
  MoreHorizontal,
  ChevronRight,
  Workflow,
  Sparkles,
  Layers,
  Activity,
  ShieldCheck,
  Globe,
  Cpu
} from 'lucide-react';
// @ts-ignore
import farmerService from '../../services/farmerService';
import { formatCurrency } from '../../lib/utils';
import { toast } from 'react-hot-toast';

const ProductListingPage = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  useEffect(() => {
    fetchListings();
  }, [statusFilter, sortBy]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = {
        status: statusFilter !== 'all' ? statusFilter : undefined,
        sort: sortBy,
        search: searchTerm || undefined
      };
      const response = await farmerService.getListings(params);
      const data = response.data.listings || response.data || [];
      setListings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
      toast.error('Inventory Sync Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Authorize deletion of this asset node?')) {
      try {
        await farmerService.deleteListing(id);
        toast.success('Asset Protocol Decommissioned');
        fetchListings();
      } catch (error) {
        toast.error('Deletion Protocol Failed');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      active: 'success',
      pending: 'warning',
      draft: 'primary',
      sold: 'secondary',
      inactive: 'error'
    };
    const variant = statusMap[status?.toLowerCase()] || 'error';
    return (
      <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest italic bg-${variant}/10 text-${variant} border border-${variant}/10`}>
        {status?.replace('_', ' ')}
      </span>
    );
  };

  const stats = {
    total: listings.length,
    active: listings.filter(l => l.status === 'active').length,
    totalViews: listings.reduce((sum, l) => sum + (l.views || 0), 0),
    totalBids: listings.reduce((sum, l) => sum + (l.bids || 0), 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh] fade-in">
        <div className="text-center space-y-8">
            <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] border border-primary/20 flex items-center justify-center mx-auto shadow-2xl">
                <Workflow className="text-primary animate-spin" size={40} />
            </div>
            <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary italic leading-none">Syncing Asset Registry...</p>
                <p className="text-xs text-gray-400 font-medium italic leading-none">Connecting to Global Mandi Pulse...</p>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32 fade-in">
      {/* Premium Inventory Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative overflow-hidden p-4">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
            Inventory Management Protocol v9.2.0
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-gray-950 tracking-tighter italic leading-none">
            Digital <span className="not-italic text-primary">Harvest.</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-xl text-xl leading-relaxed italic">
            Manage your sovereign agricultural asset nodes. Real-time market demand synchronization enabled across <span className="text-gray-900 font-black italic">regional hubs</span>.
          </p>
        </div>
        
        <Link 
            to="/farmer/listings/add" 
            className="px-12 py-6 bg-gray-950 text-white rounded-[2rem] font-black text-[12px] uppercase tracking-[0.5em] italic shadow-2xl shadow-gray-200 hover:bg-primary transition-all flex items-center gap-4 relative z-10"
        >
            ADD NEW ASSET <Plus size={20} />
        </Link>

        {/* Decorative Background Text */}
        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none -mr-20">
            <h1 className="text-[15rem] font-black italic tracking-tighter">ASSET</h1>
        </div>
      </div>

      {/* KPI Intelligence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 px-4">
        <StatCard 
          label="Total Nodes" 
          value={stats.total.toString()} 
          subtext={`${stats.active} Active Pulses`}
          icon={<Package size={28} />}
          color="primary"
        />
        <StatCard 
          label="Network Reach" 
          value={stats.totalViews.toLocaleString()} 
          subtext="+18.4% This Cycle"
          icon={<Eye size={28} />}
          color="secondary"
        />
        <StatCard 
          label="Bidding Velocity" 
          value={stats.totalBids.toString()} 
          subtext="High Liquidity Signal"
          icon={<Gavel size={28} />}
          color="success"
        />
        <StatCard 
          label="Settled Value" 
          value="₹48.7K" 
          subtext="Total Net Revenue"
          icon={<Zap size={28} />}
          color="warning"
        />
      </div>

      {/* Control Surface */}
      <div className="stitch-card p-10 bg-white shadow-2xl shadow-gray-200/50 flex flex-col lg:flex-row gap-10 items-center mx-4">
        <div className="relative flex-1 w-full lg:w-auto">
            <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
                type="text" 
                placeholder="Search Asset ID / Product Name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchListings()}
                className="w-full pl-16 pr-8 py-6 bg-gray-50 border border-gray-100 rounded-[2rem] text-sm font-medium italic focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all outline-none"
            />
        </div>
        
        <div className="flex flex-wrap items-center gap-6 w-full lg:w-auto">
            <div className="flex items-center gap-4 px-8 py-5 bg-gray-50 border border-gray-100 rounded-[2rem] shadow-sm">
                <Filter size={18} className="text-gray-400" />
                <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-transparent border-none text-[10px] font-black uppercase tracking-[0.2em] text-gray-950 focus:ring-0 cursor-pointer italic outline-none"
                >
                    <option value="all">All Status Nodes</option>
                    <option value="active">Active Pulses</option>
                    <option value="pending">Pending Validation</option>
                    <option value="draft">Draft Nodes</option>
                    <option value="sold">Sold Out</option>
                </select>
            </div>

            <div className="flex items-center gap-4 px-8 py-5 bg-gray-50 border border-gray-100 rounded-[2rem] shadow-sm">
                <TrendingUp size={18} className="text-gray-400" />
                <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent border-none text-[10px] font-black uppercase tracking-[0.2em] text-gray-950 focus:ring-0 cursor-pointer italic outline-none"
                >
                    <option value="latest">Latest Registry</option>
                    <option value="oldest">Oldest Registry</option>
                    <option value="price_high">Price: Maximum Delta</option>
                    <option value="price_low">Price: Minimum Delta</option>
                    <option value="views">Network Visibility</option>
                    <option value="bids">Bidding Intensity</option>
                </select>
            </div>

            <button 
                onClick={fetchListings}
                className="px-10 py-5 bg-gray-950 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] italic hover:bg-primary transition-all shadow-xl"
            >
                APPLY FILTERS
            </button>
        </div>
      </div>

      {/* Asset Grid */}
      <div className="relative min-h-[400px] px-4">
        <AnimatePresence mode="popLayout">
          {listings.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[4rem] p-40 text-center space-y-10 border border-gray-50 shadow-2xl shadow-gray-200/50 relative overflow-hidden"
            >
              <div className="relative z-10">
                  <div className="w-32 h-32 bg-gray-50 text-gray-200 rounded-[2.5rem] flex items-center justify-center mx-auto border border-gray-100 shadow-xl">
                      <Package size={72} />
                  </div>
                  <div className="space-y-4 pt-10">
                      <h3 className="text-4xl font-bold text-gray-950 italic tracking-tight">Registry Void.</h3>
                      <p className="text-gray-400 font-medium italic text-xl max-w-xl mx-auto">Start your digital harvest by initializing your first sovereign asset node.</p>
                  </div>
                  <Link to="/farmer/listings/add" className="px-16 py-8 bg-gray-950 text-white rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.5em] italic shadow-2xl shadow-gray-200 hover:bg-primary transition-all inline-block mt-12">
                    INITIALIZE FIRST ASSET
                  </Link>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {listings.map((listing, idx) => (
                    <motion.div 
                        key={listing._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        className="stitch-card p-12 bg-white shadow-2xl shadow-gray-200/50 group relative overflow-hidden hover:translate-y-[-8px] transition-all duration-500"
                    >
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div className="space-y-4">
                                <h3 className="text-3xl font-bold text-gray-950 italic tracking-tight group-hover:text-primary transition-colors leading-none">{listing.productName}</h3>
                                <div className="flex items-center gap-6">
                                    {getStatusBadge(listing.status)}
                                    <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-none">
                                        <Scale size={14} className="text-secondary" />
                                        <span>{listing.quantity} {listing.unit || 'QUINTAL'}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="relative">
                                <button className="p-4 bg-gray-50 rounded-2xl text-gray-300 hover:text-gray-950 transition-all shadow-sm">
                                    <MoreHorizontal size={24} />
                                </button>
                                {/* Floating Overlay Controls */}
                                <div className="absolute right-0 top-16 w-56 bg-gray-950 text-white rounded-[2rem] shadow-2xl shadow-gray-950/50 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all p-4 z-20">
                                    <Link to={`/farmer/listings/${listing._id}`} className="flex items-center gap-4 px-6 py-4 rounded-xl hover:bg-white/10 transition-colors text-[10px] font-black uppercase tracking-widest italic">
                                        <Eye size={16} className="text-primary" /> VIEW PULSE
                                    </Link>
                                    <Link to={`/farmer/listings/${listing._id}/edit`} className="flex items-center gap-4 px-6 py-4 rounded-xl hover:bg-white/10 transition-colors text-[10px] font-black uppercase tracking-widest italic">
                                        <Edit size={16} className="text-secondary" /> EDIT PARAMS
                                    </Link>
                                    <button onClick={() => handleDelete(listing._id)} className="flex items-center gap-4 px-6 py-4 rounded-xl hover:bg-error/20 transition-colors text-[10px] font-black uppercase tracking-widest italic text-error w-full text-left">
                                        <Trash2 size={16} /> DECOMMISSION
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-end gap-10 mt-12 pt-10 border-t border-gray-50 relative z-10">
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic leading-none">EXPECTED DELTA</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-4xl font-black text-primary italic tracking-tighter leading-none">{formatCurrency(listing.expectedPrice)}</span>
                                    <span className="text-sm text-gray-400 font-black italic tracking-widest leading-none">/{listing.unit || 'QUINTAL'}</span>
                                </div>
                                <div className="flex items-center gap-8 pt-2">
                                    <div className="flex items-center gap-3 text-[10px] font-black text-gray-300 uppercase tracking-widest italic leading-none">
                                        <Eye size={14} /> {listing.viewCount || 0} NETWORK REACH
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-black text-gray-300 uppercase tracking-widest italic leading-none">
                                        <Gavel size={14} /> {listing.bids || 0} ACTIVE BIDS
                                    </div>
                                </div>
                            </div>
                            <Link 
                                to={`/farmer/bids`}
                                className="px-10 py-5 bg-gray-50 text-gray-950 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.4em] italic hover:bg-primary hover:text-white transition-all shadow-sm flex items-center gap-4 group/link"
                            >
                                VIEW BIDS <ChevronRight size={18} className="group-hover/link:translate-x-2 transition-transform" />
                            </Link>
                        </div>
                        
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-[0.08] transition-opacity">
                            <Layers size={120} className="-rotate-12" />
                        </div>
                    </motion.div>
                ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Strategic Intelligence Banner */}
      <div className="stitch-card p-16 bg-gray-950 text-white relative overflow-hidden group shadow-2xl shadow-gray-950/20 mx-4">
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
            <div className="w-28 h-28 bg-primary/20 backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-center text-primary border border-primary/20 shadow-2xl group-hover:rotate-12 transition-transform duration-1000">
                <Workflow size={48} className="stroke-[1.5]" />
            </div>
            <div className="flex-1 text-center lg:text-left space-y-6">
                <div className="inline-flex items-center gap-4 px-6 py-2 bg-primary/20 text-primary rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic border border-primary/20 shadow-2xl">
                    <Sparkles size={18} /> INVENTORY OPTIMIZATION ACTIVE
                </div>
                <h3 className="text-4xl md:text-5xl font-bold italic tracking-tighter leading-tight">Asset Visibility Protocol</h3>
                <p className="text-gray-400 font-medium max-w-3xl leading-relaxed text-xl italic">
                    Nodes with high-fidelity imagery and <span className="text-primary font-black italic underline underline-offset-8 decoration-4 decoration-primary/20">Verified Quality Certifications</span> receive <span className="text-white font-black italic">+85% higher network visibility</span>.
                </p>
            </div>
            <Link 
                to="/farmer/listings/add" 
                className="px-16 py-8 bg-white text-gray-950 rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.5em] italic shadow-2xl shadow-black/20 hover:bg-primary hover:text-white transition-all"
            >
                OPTIMIZE LISTINGS
            </Link>
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

const StatCard = ({ label, value, subtext, icon, color }: any) => (
  <div className="stitch-card p-12 group relative overflow-hidden bg-white shadow-2xl shadow-gray-200/50 hover:translate-y-[-8px] transition-all duration-500">
    <div className="relative z-10 space-y-10">
      <div className={`w-16 h-16 rounded-[1.5rem] bg-gray-950 text-white shadow-2xl flex items-center justify-center group-hover:rotate-6 group-hover:bg-${color} transition-all duration-700`}>
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2 italic leading-none">{label}</p>
        <h3 className="text-5xl font-black text-gray-950 italic tracking-tighter leading-none">{value}</h3>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic opacity-60 leading-none">{subtext}</p>
      </div>
    </div>
    <div className={`absolute -bottom-10 -right-10 w-40 h-40 bg-${color}/5 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000`}></div>
  </div>
);

export default ProductListingPage;
