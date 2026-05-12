import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Package, 
  Search, 
  Filter, 
  Sprout, 
  ChevronRight, 
  LayoutGrid, 
  List,
  MoreVertical,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  ExternalLink,
  Zap,
  ArrowRight,
  Activity,
  Workflow,
  Cpu,
  MoreHorizontal,
  Box,
  Layers,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import apiClient from '../../services/api';
import { toast } from 'react-hot-toast';

const MyListings = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/farmer/listings');
      const data = res.data.data || [];
      setListings(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Error fetching listings', e);
      // Fallback for demo
      setListings([
        {
          _id: 'L1',
          cropName: 'Basmati Rice (Organic)',
          quantity: 50,
          unit: 'Quintal',
          basePrice: 4200,
          status: 'active',
          bidsCount: 12,
          qualityScore: 94,
          createdAt: new Date(),
          images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80']
        },
        {
          _id: 'L2',
          cropName: 'Golden Wheat',
          quantity: 120,
          unit: 'Quintal',
          basePrice: 2150,
          status: 'active',
          bidsCount: 8,
          qualityScore: 88,
          createdAt: new Date(Date.now() - 86400000),
          images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter(l => 
    l.cropName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBids = listings.reduce((acc, curr) => acc + (curr.bidsCount || 0), 0);
  const totalValue = listings.reduce((acc, curr) => acc + (curr.basePrice * curr.quantity || 0), 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32 fade-in">
      {/* Premium Inventory Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative overflow-hidden p-4">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
            Inventory Management Protocol v4.0.2
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-gray-950 tracking-tighter italic leading-none">
            Active <span className="not-italic text-primary">Harvests.</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-xl text-xl leading-relaxed italic">
            Managing <span className="text-gray-900 font-black italic">{listings.length} active commodity nodes</span>. Global market synchronization enabled.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 relative z-10">
            <div className="hidden lg:flex gap-8 p-6 bg-white border border-gray-100 rounded-[1.8rem] shadow-xl shadow-gray-200/50">
                <div className="text-center border-r border-gray-100 pr-8">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic mb-1">Portfolio Value</p>
                    <p className="text-2xl font-black text-gray-950 italic tracking-tight leading-none">{formatCurrency(totalValue)}</p>
                </div>
                <div className="text-center">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic mb-1">Global Inquiries</p>
                    <p className="text-2xl font-black text-primary italic tracking-tight leading-none">{totalBids}</p>
                </div>
            </div>
            <Link to="/farmer/listings/add" className="px-10 py-5 bg-gray-950 text-white rounded-[1.8rem] flex items-center gap-4 font-black text-[10px] uppercase tracking-[0.3em] italic shadow-2xl shadow-gray-200 hover:bg-primary transition-all">
                Initialize Listing <Plus size={16} />
            </Link>
        </div>

        {/* Decorative Background Text */}
        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none -mr-20">
            <h1 className="text-[15rem] font-black italic tracking-tighter">INVENTORY</h1>
        </div>
      </div>

      {/* Control Surface */}
      <div className="flex flex-col md:flex-row gap-6 items-center px-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search regional inventory..." 
            className="w-full pl-16 pr-8 py-5 bg-white border border-gray-100 rounded-[1.8rem] text-sm font-medium italic focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all outline-none shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="flex bg-gray-50 p-2 rounded-[1.5rem] border border-gray-100 shadow-sm">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-primary shadow-xl border border-primary/10' : 'text-gray-400'}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-primary shadow-xl border border-primary/10' : 'text-gray-400'}`}
            >
              <List size={20} />
            </button>
          </div>
          
          <button className="px-8 py-2 bg-white border border-gray-100 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] italic text-gray-400 hover:text-gray-950 transition-all flex items-center gap-4 shadow-sm">
            <Filter size={18} /> Protocol Filters
          </button>
        </div>
      </div>

      {/* Inventory Nodes */}
      <div className="relative min-h-[400px]">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="h-[500px] bg-white rounded-[3.5rem] animate-pulse border border-gray-50 shadow-sm" />
            ))}
          </div>
        ) : filteredListings.length > 0 ? (
          <AnimatePresence mode="popLayout">
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12" : "space-y-6"}>
              {filteredListings.map((listing, idx) => (
                viewMode === 'grid' ? (
                  <motion.div 
                    key={listing._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="stitch-card group flex flex-col relative overflow-hidden p-8 bg-white shadow-2xl shadow-gray-200/50"
                  >
                    <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-8">
                      <img src={listing.images?.[0] || '/placeholder.png'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={listing.cropName} />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute top-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-xl rounded-xl text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 shadow-2xl border border-white/20 italic">
                        <ShieldCheck size={14} /> Quality: {listing.qualityScore || '--'}%
                      </div>
                      <div className="absolute bottom-4 right-4 p-4 bg-gray-950/80 backdrop-blur-xl text-white rounded-2xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                        <ArrowUpRight size={24} />
                      </div>
                    </div>

                    <div className="space-y-6 flex-1">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="text-2xl font-bold text-gray-950 group-hover:text-primary transition-colors italic tracking-tight leading-none truncate max-w-[200px]">{listing.cropName}</h3>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic flex items-center gap-2 leading-none">
                            <Clock size={12} /> Synchronized: {new Date(listing.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button className="p-2 text-gray-200 hover:text-gray-950 transition-colors">
                          <MoreHorizontal size={24} />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-50 relative overflow-hidden">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 italic leading-none mb-1">Capacity</p>
                          <p className="text-xl font-black text-gray-950 italic tracking-tight leading-none">{listing.quantity} {listing.unit}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 italic leading-none mb-1">Base Protocol</p>
                          <p className="text-xl font-black text-primary italic tracking-tight leading-none">₹{listing.basePrice}</p>
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-8 bg-gray-100"></div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-4">
                          <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                              <div key={i} className="w-8 h-8 rounded-xl border-4 border-white bg-gray-50 flex items-center justify-center text-[10px] font-black italic shadow-lg">B{i}</div>
                            ))}
                          </div>
                          <p className="text-[11px] font-black text-primary italic tracking-tight">{listing.bidsCount || 0} active inquiries</p>
                        </div>
                        <Link to={`/farmer/listing/${listing._id}`} className="px-6 py-3 bg-gray-950 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] italic hover:bg-primary transition-all shadow-xl shadow-gray-200">
                          DETAILS
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key={listing._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    className="stitch-card flex items-center gap-10 group p-6 bg-white shadow-xl shadow-gray-200/30 hover:border-primary/20 transition-all"
                  >
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-lg border border-gray-50">
                      <img src={listing.images?.[0] || '/placeholder.png'} className="w-full h-full object-cover" alt={listing.cropName} />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <h3 className="text-xl font-bold text-gray-950 group-hover:text-primary transition-colors italic tracking-tight truncate">{listing.cropName}</h3>
                      <div className="flex gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-none">
                        <span className="flex items-center gap-2"><Box size={12} /> {listing.quantity} {listing.unit}</span>
                        <span className="flex items-center gap-2"><Zap size={12} /> {formatCurrency(listing.basePrice)}/unit</span>
                      </div>
                    </div>
                    <div className="hidden lg:flex items-center gap-12 px-12 border-x border-gray-50">
                      <div className="text-center space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 italic">Quality Index</p>
                        <p className="text-xl font-black text-primary italic tracking-tight leading-none">{listing.qualityScore || '--'}%</p>
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 italic">Bid Inbound</p>
                        <p className="text-xl font-black text-gray-950 italic tracking-tight leading-none">{listing.bidsCount || 0}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button className="px-8 py-4 bg-gray-50 text-gray-400 rounded-xl font-black text-[10px] uppercase tracking-widest italic hover:bg-gray-950 hover:text-white transition-all border border-transparent">MODIFY</button>
                      <Link to={`/farmer/listing/${listing._id}`} className="w-14 h-14 bg-gray-950 text-white rounded-xl hover:bg-primary flex items-center justify-center transition-all shadow-xl shadow-gray-200">
                        <ArrowRight size={20} />
                      </Link>
                    </div>
                  </motion.div>
                )
              ))}
            </div>
          </AnimatePresence>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-40 stitch-card bg-white border border-dashed border-gray-200 relative overflow-hidden shadow-2xl shadow-gray-200/50"
          >
            <div className="relative z-10 space-y-8">
                <div className="w-24 h-24 bg-primary/5 rounded-[2.5rem] flex items-center justify-center mx-auto border border-primary/10 shadow-2xl shadow-primary/10">
                    <Layers size={48} className="text-primary" />
                </div>
                <div className="space-y-3">
                    <h3 className="text-3xl font-bold text-gray-950 italic tracking-tight">Vault Empty.</h3>
                    <p className="text-gray-400 font-medium italic max-w-sm mx-auto">
                        No active harvest nodes detected in your regional sector. Initialize a new listing to synchronize with the global market.
                    </p>
                </div>
                <Link to="/farmer/listings/add" className="px-12 py-6 bg-gray-950 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] italic shadow-2xl shadow-gray-200 hover:bg-primary transition-all inline-block">
                    INITIALIZE FIRST NODE
                </Link>
            </div>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <rect width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                </svg>
            </div>
          </motion.div>
        )}
      </div>

      {/* Market Pulse Banner */}
      <div className="stitch-card p-12 bg-gray-950 text-white relative overflow-hidden group shadow-2xl shadow-gray-950/20">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/20 text-primary rounded-xl text-[9px] font-black uppercase tracking-widest italic border border-primary/20">
                    <TrendingUp size={14} /> Market Intelligence Active
                </div>
                <h2 className="text-4xl font-bold italic tracking-tighter leading-tight max-w-xl">
                    Commodity <span className="text-primary">Surge</span> detected in your sector.
                </h2>
                <p className="text-gray-400 font-medium italic text-lg leading-relaxed max-w-lg">
                    Real-time demand for <span className="text-white font-black italic">Basmati Rice</span> has increased by <span className="text-primary font-black">+14.2%</span>. Capture the delta now.
                </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 shrink-0 relative z-10">
                <div className="p-8 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/5 text-center group-hover:border-primary/20 transition-colors">
                    <p className="text-5xl font-black text-primary italic tracking-tighter leading-none mb-2">+12%</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic leading-none">Price Delta</p>
                </div>
                <div className="p-8 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/5 text-center group-hover:border-primary/20 transition-colors">
                    <p className="text-5xl font-black text-white italic tracking-tighter leading-none mb-2">450+</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic leading-none">Active Buyers</p>
                </div>
            </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48 group-hover:opacity-40 transition-opacity duration-1000"></div>
        <div className="absolute bottom-0 left-0 p-12 text-white/5 group-hover:text-white/10 transition-colors">
            <Sparkles size={120} />
        </div>
      </div>
    </div>
  );
};

export default MyListings;
