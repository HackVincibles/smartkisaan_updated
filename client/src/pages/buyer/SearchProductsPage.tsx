import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Package, 
  ChevronDown,
  X,
  MapPin,
  TrendingUp,
  Award,
  Plus,
  ArrowRight,
  Workflow,
  Cpu,
  Globe,
  Sparkles,
  Layers,
  Activity,
  Scan,
  Database,
  SearchCode,
  Target,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
// @ts-ignore
import buyerService from '../../services/buyerService';
import ProductCard from '../../components/buyer/ProductCard';
import Loader from '../../components/common/Loader';
import { toast } from 'react-hot-toast';

const SearchProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: '',
    maxPrice: '',
    grade: 'all',
    location: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        search: searchTerm || undefined,
        ...filters,
        category: filters.category === 'all' ? undefined : filters.category,
        grade: filters.grade === 'all' ? undefined : filters.grade
      };
      const response = await buyerService.searchProducts(params);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Market Uplink Lost');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== 'all' && v !== '').length;

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32 fade-in">
      {/* Premium Discovery Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative overflow-hidden p-4">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-secondary italic">
            <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
            Marketplace Discovery Protocol v7.2.1
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-gray-950 tracking-tighter italic leading-none">
            Find <span className="not-italic text-secondary">Produce.</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-xl text-xl leading-relaxed italic">
            Discover the highest quality agricultural assets directly from <span className="text-gray-950 font-black italic">verified farmer nodes</span>. AI-graded and ready for procurement.
          </p>
        </div>
        
        <Link 
          to="/buyer/demand/create"
          className="px-12 py-6 bg-gray-950 text-white rounded-[2rem] font-black text-[12px] uppercase tracking-[0.5em] italic shadow-2xl shadow-gray-200 hover:bg-secondary transition-all flex items-center gap-4 relative z-10 group"
        >
          POST NEW DEMAND <Plus size={20} className="group-hover:rotate-90 transition-transform" />
        </Link>

        {/* Decorative Background Text */}
        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none -mr-20">
            <h1 className="text-[15rem] font-black italic tracking-tighter">DISCOVER</h1>
        </div>
      </div>

      {/* Control Surface */}
      <div className="sticky top-4 z-40 px-4">
        <div className="stitch-card p-4 bg-white/80 backdrop-blur-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100/50 flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative group/input">
            <Search size={22} className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-secondary transition-colors" />
            <input
              type="text"
              placeholder="SEARCH BY CROP, VARIETY, OR FARMER ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchProducts()}
              className="w-full pl-20 pr-8 py-8 bg-gray-50/50 border border-transparent rounded-[2rem] focus:bg-white focus:border-secondary/20 transition-all font-black text-[11px] text-gray-950 uppercase tracking-[0.2em] italic outline-none"
            />
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-4 px-10 py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] italic transition-all relative overflow-hidden group ${
                showFilters || activeFiltersCount > 0 
                  ? 'bg-secondary text-white shadow-2xl' 
                  : 'bg-white border border-gray-100 text-gray-400 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal size={20} className="relative z-10" />
              <span className="relative z-10">FILTERS</span>
              {activeFiltersCount > 0 && (
                <span className="relative z-10 px-2 py-0.5 bg-white text-secondary rounded-lg ml-2">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            <button 
              onClick={fetchProducts}
              className="px-12 py-6 bg-gray-950 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.4em] italic hover:bg-secondary transition-all shadow-2xl overflow-hidden relative group"
            >
                <span className="relative z-10 flex items-center gap-3">INITIALIZE SCAN <Scan size={20} /></span>
                <div className="absolute inset-0 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>
        </div>

        {/* Floating Advanced Filters Overlay */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 16, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute left-4 right-4 p-12 bg-white rounded-[3rem] border border-gray-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] z-50 overflow-hidden group/overlay"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400 px-2 italic">Commodity Vector</label>
                  <div className="relative">
                    <select 
                        name="category"
                        value={filters.category}
                        onChange={handleFilterChange}
                        className="w-full px-8 py-5 bg-gray-50 border border-gray-50 rounded-2xl font-black text-[10px] uppercase tracking-widest italic text-gray-950 focus:ring-4 focus:ring-secondary/5 focus:bg-white focus:border-secondary/20 transition-all outline-none appearance-none cursor-pointer"
                    >
                        <option value="all">ALL CATEGORIES</option>
                        <option value="grains">GRAINS</option>
                        <option value="vegetables">VEGETABLES</option>
                        <option value="fruits">FRUITS</option>
                        <option value="spices">SPICES</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400 px-2 italic">Valuation Range (₹)</label>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      name="minPrice"
                      placeholder="MIN"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      className="w-full px-8 py-5 bg-gray-50 border border-gray-50 rounded-2xl font-black text-[10px] uppercase tracking-widest italic text-gray-950 focus:ring-4 focus:ring-secondary/5 focus:bg-white focus:border-secondary/20 transition-all outline-none"
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      placeholder="MAX"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      className="w-full px-8 py-5 bg-gray-50 border border-gray-50 rounded-2xl font-black text-[10px] uppercase tracking-widest italic text-gray-950 focus:ring-4 focus:ring-secondary/5 focus:bg-white focus:border-secondary/20 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400 px-2 italic">AI Grade Protocol</label>
                  <div className="relative">
                    <select 
                        name="grade"
                        value={filters.grade}
                        onChange={handleFilterChange}
                        className="w-full px-8 py-5 bg-gray-50 border border-gray-50 rounded-2xl font-black text-[10px] uppercase tracking-widest italic text-gray-950 focus:ring-4 focus:ring-secondary/5 focus:bg-white focus:border-secondary/20 transition-all outline-none appearance-none cursor-pointer"
                    >
                        <option value="all">ANY QUALITY GRADE</option>
                        <option value="A">GRADE A (PREMIUM)</option>
                        <option value="B">GRADE B (STANDARD)</option>
                        <option value="C">GRADE C (INDUSTRIAL)</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400 px-2 italic">Sourcing Node</label>
                  <div className="relative group/field">
                    <MapPin size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/field:text-secondary transition-colors" />
                    <input
                      type="text"
                      name="location"
                      placeholder="HUB ID OR CITY"
                      value={filters.location}
                      onChange={handleFilterChange}
                      className="w-full pl-16 pr-8 py-5 bg-gray-50 border border-gray-50 rounded-2xl font-black text-[10px] uppercase tracking-widest italic text-gray-950 focus:ring-4 focus:ring-secondary/5 focus:bg-white focus:border-secondary/20 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center mt-12 pt-10 border-t border-gray-50 gap-8">
                <button 
                  onClick={() => {
                    setFilters({ category: 'all', minPrice: '', maxPrice: '', grade: 'all', location: '' });
                    fetchProducts();
                  }}
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 hover:text-error transition-all italic"
                >
                  CLEAR ALL DISCOVERY PARAMS
                </button>
                <div className="flex gap-6 w-full sm:w-auto">
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="flex-1 sm:flex-none px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] italic text-gray-400 hover:bg-gray-50 transition-all"
                  >
                    CANCEL
                  </button>
                  <button 
                    onClick={() => {
                      fetchProducts();
                      setShowFilters(false);
                    }}
                    className="flex-1 sm:flex-none px-12 py-5 bg-gray-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] italic hover:bg-secondary transition-all shadow-2xl"
                  >
                    EXECUTE ANALYSIS
                  </button>
                </div>
              </div>
              
              {/* Background Decor */}
              <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                <Database size={120} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Asset Registry Viewport */}
      <div className="relative min-h-[500px] px-4">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="h-[50vh] flex flex-col items-center justify-center space-y-10">
              <div className="w-24 h-24 bg-secondary/10 rounded-[2.5rem] border border-secondary/20 flex items-center justify-center shadow-2xl">
                <Workflow size={40} className="text-secondary animate-spin" />
              </div>
              <div className="space-y-3 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary italic leading-none">Scanning Network Nodes...</p>
                <p className="text-xs text-gray-400 font-medium italic leading-none">Aggregating Global Inventory...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[4rem] p-40 text-center space-y-10 border border-gray-50 shadow-2xl shadow-gray-200/50 relative overflow-hidden"
            >
              <div className="relative z-10">
                  <div className="w-32 h-32 bg-gray-50 text-gray-200 rounded-[3rem] flex items-center justify-center mx-auto border border-gray-100 shadow-xl">
                      <Package size={72} />
                  </div>
                  <div className="space-y-4 pt-10">
                      <h3 className="text-4xl font-bold text-gray-950 italic tracking-tight">Market Void.</h3>
                      <p className="text-gray-400 font-medium italic text-xl max-w-xl mx-auto">No inventory nodes match your current sourcing parameters. Broadcast a demand signal to the network?</p>
                  </div>
                  <Link to="/buyer/demand/create" className="px-16 py-8 bg-gray-950 text-white rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.5em] italic shadow-2xl shadow-gray-200 hover:bg-secondary transition-all inline-block mt-12">
                    POST DEMAND SIGNAL
                  </Link>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
              {products.map((product, i) => (
                <motion.div
                  key={product._id || i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group/card"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Strategic Demand Banner */}
      {!loading && products.length > 0 && (
        <div className="stitch-card p-16 bg-gray-950 text-white relative overflow-hidden group shadow-2xl shadow-gray-950/20 mx-4">
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
              <div className="w-28 h-28 bg-secondary/20 backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-center text-secondary border border-secondary/20 shadow-2xl group-hover:rotate-12 transition-transform duration-1000">
                  <Target size={48} className="stroke-[1.5]" />
              </div>
              <div className="flex-1 text-center lg:text-left space-y-6">
                  <div className="inline-flex items-center gap-4 px-6 py-2 bg-secondary/20 text-secondary rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic border border-secondary/20 shadow-2xl">
                      <Sparkles size={18} /> SOURCING OPTIMIZATION ACTIVE
                  </div>
                  <h3 className="text-4xl md:text-5xl font-bold italic tracking-tighter leading-tight">Supply Chain Signal</h3>
                  <p className="text-gray-400 font-medium max-w-3xl leading-relaxed text-xl italic">
                      Cant find specific specs? Broadcast a <span className="text-secondary font-black italic underline underline-offset-8 decoration-4 decoration-secondary/20">Custom Demand Node</span> and receive institutional offers from verified producer clusters.
                  </p>
              </div>
              <Link 
                to="/buyer/demand/create" 
                className="px-16 py-8 bg-white text-gray-950 rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.5em] italic shadow-2xl shadow-black/20 hover:bg-secondary hover:text-white transition-all whitespace-nowrap"
              >
                INITIALIZE DEMAND
              </Link>
          </div>
          {/* Background Decor */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px] -mr-80 -mt-80 group-hover:opacity-40 transition-opacity duration-1000"></div>
          <div className="absolute bottom-0 left-0 p-12 text-white/5 group-hover:text-white/10 transition-colors">
              <Globe size={160} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchProductsPage;
