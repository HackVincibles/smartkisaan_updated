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
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
// @ts-ignore
import buyerService from '../../services/buyerService';
import ProductCard from '../../components/buyer/ProductCard';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

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
      toast.error('Failed to load products');
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
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            <TrendingUp size={14} />
            Marketplace Discovery
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-4">
            Search Produce
          </h1>
          <p className="text-gray-500 font-medium text-lg leading-relaxed">
            Discover the highest quality agri-produce directly from verified farmers. Graded, tested, and ready for procurement.
          </p>
        </div>
        
        <Link 
          to="/buyer/demand/create"
          className="shrink-0 flex items-center gap-3 px-6 py-4 bg-gray-900 text-white rounded-[2rem] font-black text-sm hover:bg-black transition-all shadow-xl shadow-gray-200 group"
        >
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus size={18} />
          </div>
          Post New Demand
        </Link>
      </div>

      {/* Main Search & Discovery Bar */}
      <div className="sticky top-4 z-30">
        <div className="bg-white p-3 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-blue-50/50 flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative flex items-center">
            <Search className="absolute left-6 text-gray-300" size={20} />
            <input
              type="text"
              placeholder="Search by crop, variety, or farmer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchProducts()}
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-[1.5rem] focus:ring-2 focus:ring-blue-100 transition-all font-bold text-gray-900 placeholder:text-gray-300"
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-6 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all relative ${
                showFilters || activeFiltersCount > 0 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'bg-white border border-gray-100 text-gray-500 hover:bg-gray-50'
              }`}
            >
              <SlidersHorizontal size={18} />
              Filters
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] border-2 border-white">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            <button 
              onClick={fetchProducts}
              className="px-10 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-blue-700 hover:shadow-lg shadow-blue-200 transition-all"
            >
              Discover
            </button>
          </div>
        </div>

        {/* Floating Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 12, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute left-0 right-0 p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl z-40"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Commodity Category</label>
                  <select 
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="all">All Categories</option>
                    <option value="grains">Grains</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="spices">Spices</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Price Range (₹)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="minPrice"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-blue-100"
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">AI Quality Grade</label>
                  <select 
                    name="grade"
                    value={filters.grade}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="all">Any Quality</option>
                    <option value="A">Grade A (Premium)</option>
                    <option value="B">Grade B (Standard)</option>
                    <option value="C">Grade C (Industrial)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Sourcing Region</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="location"
                      placeholder="City or State"
                      value={filters.location}
                      onChange={handleFilterChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-50">
                <button 
                  onClick={() => {
                    setFilters({ category: 'all', minPrice: '', maxPrice: '', grade: 'all', location: '' });
                    fetchProducts();
                  }}
                  className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
                >
                  Clear All Filters
                </button>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-500 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      fetchProducts();
                      setShowFilters(false);
                    }}
                    className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all"
                  >
                    Apply Analysis
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results Section */}
      <div className="relative">
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Analyzing Sourcing Network...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-gray-100 shadow-sm flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-8">
              <Package size={48} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">No matching produce found</h3>
            <p className="text-gray-500 font-medium max-w-md mb-10">
              We couldn't find any products matching your current filters. Why not let our network of farmers know what you're looking for?
            </p>
            <Link 
              to="/buyer/demand/create"
              className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
            >
              Post a Demand Request
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Sourcing Insight Card */}
      {!loading && products.length > 0 && (
        <div className="bg-blue-600 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden mt-12">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="text-3xl font-black mb-4 leading-tight">Can't find exactly what you need?</h2>
              <p className="text-blue-100 font-medium text-lg">Create a demand request and verified suppliers will send you their best offers directly. Graded, verified, and delivered.</p>
            </div>
            <Link 
              to="/buyer/demand/create"
              className="shrink-0 px-10 py-5 bg-white text-blue-600 rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:shadow-2xl transition-all flex items-center gap-3"
            >
              Create New Demand
              <ArrowRight size={20} />
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-20"></div>
        </div>
      )}
    </div>
  );
};

export default SearchProductsPage;
