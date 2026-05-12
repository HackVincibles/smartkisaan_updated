import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Shield, 
  ShoppingBag, 
  ArrowRight, 
  Star,
  Zap,
  Award,
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  List,
  CheckCircle,
  TrendingUp,
  Package
} from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const Marketplace = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    category: 'ALL',
    minPrice: 0,
    maxPrice: 10000,
    grade: 'ALL'
  });

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await apiClient.get('/buyer/listings');
        setListings(res.data.data || []);
      } catch (e) {
        console.error('Error fetching marketplace', e);
        // Mock for demo
        setListings([
          { _id: '1', cropName: 'Premium Basmati Rice', expectedPrice: 4500, unit: 'Quintal', category: 'GRAIN', location: 'Nellore, AP', aiGrade: 'A+', images: [] },
          { _id: '2', cropName: 'Organic Alphonso Mangoes', expectedPrice: 1200, unit: 'Box', category: 'FRUIT', location: 'Ratnagiri, MH', aiGrade: 'A', images: [] },
          { _id: '3', cropName: 'Red Hybrid Onions', expectedPrice: 1800, unit: 'Quintal', category: 'VEGETABLE', location: 'Nashik, MH', aiGrade: 'B+', images: [] }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const filteredListings = listings.filter(l => {
    const matchesSearch = l.cropName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filters.category === 'ALL' || l.category === filters.category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 fade-in">
      {/* Header & Search Section */}
      <div className="flex flex-col gap-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <Sparkles size={12} className="text-secondary" />
              <span>Sourcing Engine</span>
              <ChevronRight size={10} />
              <span className="text-secondary-600">Global Marketplace</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight italic">Direct <span className="not-italic text-secondary">Sourcing.</span></h1>
          </div>
          
          <div className="flex items-center gap-3 p-1.5 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-secondary shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-secondary shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-secondary transition-colors">
            <Search size={28} />
          </div>
          <input 
            type="text" 
            placeholder="Search by commodity, cluster, or farmer identity..." 
            className="w-full pl-20 pr-48 py-8 bg-white border border-gray-100 rounded-[2.5rem] focus:ring-8 focus:ring-secondary-50 focus:border-secondary-100 outline-none shadow-2xl shadow-gray-200/40 transition-all text-xl font-bold placeholder:text-gray-300 italic"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 px-10 py-5 bg-gray-900 text-white rounded-[1.5rem] font-bold text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center gap-3 shadow-xl">
            <SlidersHorizontal size={16} className="text-secondary" /> Refine Query
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Advanced Filters Sidebar */}
        <aside className="w-full lg:w-80 space-y-8">
          <div className="stitch-card p-8 space-y-10">
            <div className="space-y-1">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Parameter Filtering</h3>
              <p className="text-[10px] text-gray-400 font-medium italic">Adjust sourcing constraints</p>
            </div>
            
            <div className="space-y-10">
              <div className="space-y-5">
                <label className="text-[10px] font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                  <Package size={12} className="text-secondary" />
                  Category Group
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['ALL', 'GRAIN', 'VEGETABLE', 'FRUIT'].map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setFilters({...filters, category: cat})}
                      className={`px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                        filters.category === cat 
                          ? 'bg-secondary text-white border-secondary shadow-lg shadow-secondary-100' 
                          : 'bg-white text-gray-400 border-gray-100 hover:border-secondary-200 hover:text-secondary'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Price Index</label>
                  <span className="text-[9px] font-bold text-secondary bg-secondary-50 px-2 py-1 rounded-lg">₹0 - ₹10k+</span>
                </div>
                <input type="range" className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-secondary" />
              </div>

              <div className="space-y-5">
                <label className="text-[10px] font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                  <Award size={12} className="text-secondary" />
                  Quality Threshold
                </label>
                <div className="space-y-2">
                  {['Grade A+', 'Grade A', 'Verified B+'].map(g => (
                    <button 
                      key={g}
                      className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:bg-secondary-50 hover:text-secondary hover:border-secondary-100 transition-all group"
                    >
                      {g}
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Intel Card */}
          <div className="bg-gray-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl">
            <div className="relative z-10 space-y-8">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-secondary-400 shadow-inner border border-white/5">
                <TrendingUp size={28} />
              </div>
              <div className="space-y-3">
                <h4 className="text-2xl font-bold tracking-tight italic">Market <span className="not-italic text-secondary">Pulse.</span></h4>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">
                  Wheat prices are trending up by <span className="text-white font-bold">4.2%</span> in northern clusters. Secure contracts now.
                </p>
              </div>
              <button className="btn btn-secondary w-full py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-secondary-900/20">
                Analyze Trends
              </button>
            </div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-secondary rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-1000"></div>
          </div>
        </aside>

        {/* Listings Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="h-[450px] bg-white rounded-[3.5rem] animate-pulse border border-gray-50 shadow-sm" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredListings.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link 
                      to={`/buyer/listing/${item._id}`}
                      className="stitch-card overflow-hidden hover:shadow-2xl hover:shadow-secondary-900/10 transition-all group flex flex-col h-full relative border-none"
                    >
                      {/* Image Area */}
                      <div className="aspect-[5/4] bg-gray-50 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        {item.images?.[0] ? (
                          <img src={item.images[0]} alt={item.cropName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-200">
                            <ShoppingBag size={64} />
                          </div>
                        )}
                        
                        {/* Badges Overlay */}
                        <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                          <div className="px-4 py-2 bg-white/95 backdrop-blur-xl rounded-2xl text-[10px] font-bold uppercase tracking-widest text-success flex items-center gap-2 shadow-xl border border-gray-50">
                            <CheckCircle size={14} className="text-success" /> 
                            <span>Grade {item.aiGrade || 'A'}</span>
                          </div>
                          <div className="px-4 py-2 bg-gray-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-xl border border-white/10">
                            <Zap size={14} className="text-secondary" /> Direct Source
                          </div>
                        </div>
                        
                        <div className="absolute top-6 right-6 z-20 bg-white/95 backdrop-blur-xl p-2.5 rounded-xl text-[12px] font-bold text-gray-900 flex items-center gap-1 shadow-xl border border-gray-50">
                          <Star size={16} className="fill-orange-400 text-orange-400" /> 
                          <span>4.8</span>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-10 flex-1 flex flex-col space-y-8">
                        <div className="space-y-3">
                          <h4 className="text-2xl font-bold text-gray-900 capitalize tracking-tight group-hover:text-secondary transition-colors leading-tight italic">
                            {item.cropName}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            <MapPin size={14} className="text-secondary" /> 
                            {item.location || 'Central India'}
                          </div>
                        </div>

                        <div className="flex items-end justify-between border-t border-gray-50 pt-8">
                          <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Exchange Price</p>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-3xl font-bold text-gray-900 italic tracking-tighter">₹{item.expectedPrice}</span>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">/ {item.unit || 'QU'}</span>
                            </div>
                          </div>
                          
                          <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                              <div key={i} className="w-10 h-10 rounded-xl border-4 border-white bg-gray-100 shadow-sm overflow-hidden" />
                            ))}
                            <div className="w-10 h-10 rounded-xl border-4 border-white bg-secondary-50 text-[10px] font-bold text-secondary flex items-center justify-center shadow-sm">
                              +12
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <div className="w-full py-5 bg-gray-50 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:bg-secondary group-hover:text-white group-hover:shadow-xl group-hover:shadow-secondary-200 transition-all duration-500">
                            Start Procurement <ArrowRight size={14} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          
          {/* Pagination/Load More */}
          {!loading && filteredListings.length > 0 && (
            <div className="mt-20 flex justify-center">
              <button className="px-16 py-6 bg-white border border-gray-100 rounded-[2rem] text-[10px] font-bold uppercase tracking-widest text-gray-900 hover:bg-gray-900 hover:text-white transition-all shadow-xl shadow-gray-100 flex items-center gap-4 group">
                Load More Inventory <ChevronDown size={18} className="group-hover:translate-y-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;

