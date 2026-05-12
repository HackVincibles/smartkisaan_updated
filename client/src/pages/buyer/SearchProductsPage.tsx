import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, Package, ChevronDown } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Search Products</h1>
          <p className="text-gray-600 dark:text-gray-400">Find the best quality produce from verified farmers</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card p-2 flex flex-wrap gap-2">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for crops (e.g. Wheat, Rice, Tomato)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchProducts()}
            className="input pl-10 border-none shadow-none focus:ring-0"
          />
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            showFilters ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 dark:bg-dark-300 hover:bg-gray-200'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
        <button onClick={fetchProducts} className="btn-primary px-8">
          Search
        </button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="card p-6 overflow-hidden"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select 
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="input"
              >
                <option value="all">All Categories</option>
                <option value="grains">Grains</option>
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="spices">Spices</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  className="input"
                />
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className="input"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">AI Grade</label>
              <select 
                name="grade"
                value={filters.grade}
                onChange={handleFilterChange}
                className="input"
              >
                <option value="all">All Grades</option>
                <option value="A">Grade A (Excellent)</option>
                <option value="B">Grade B (Good)</option>
                <option value="C">Grade C (Average)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                name="location"
                placeholder="City or State"
                value={filters.location}
                onChange={handleFilterChange}
                className="input"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4 gap-2">
            <button 
              onClick={() => {
                setFilters({ category: 'all', minPrice: '', maxPrice: '', grade: 'all', location: '' });
                fetchProducts();
              }}
              className="text-sm text-gray-500 hover:text-primary-600"
            >
              Reset Filters
            </button>
            <button onClick={fetchProducts} className="btn-primary py-1.5 px-4 text-sm">
              Apply Filters
            </button>
          </div>
        </motion.div>
      )}

      {/* Results */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader />
        </div>
      ) : products.length === 0 ? (
        <div className="card p-12 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your filters or search term</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchProductsPage;
