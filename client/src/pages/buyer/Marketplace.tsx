import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Shield, ShoppingBag, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import apiClient from '@/api/client';

const Marketplace = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 space-y-8 animate-in slide-in-from-left-4 duration-500">
          <div>
            <h3 className="text-xl font-black text-gray-900 mb-6">Filters</h3>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-3">Category</label>
                <div className="flex flex-wrap gap-2">
                  {['ALL', 'GRAIN', 'VEGETABLE', 'FRUIT'].map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setFilters({...filters, category: cat})}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        filters.category === cat ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-3">Price Range</label>
                <input type="range" className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-green-600" />
                <div className="flex justify-between mt-2 text-xs font-bold text-gray-500">
                  <span>â‚¹0</span>
                  <span>â‚¹10,000+</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-3">Quality Grade</label>
                <div className="grid grid-cols-3 gap-2">
                  {['A', 'B', 'C'].map(g => (
                    <button 
                      key={g}
                      className="py-2 rounded-xl border border-gray-100 text-xs font-bold text-gray-500 hover:bg-green-50 hover:text-green-600 transition-all"
                    >
                      Grade {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <header className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search premium crops, farmers, or locations..." 
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-[1.5rem] focus:border-green-600 focus:outline-none shadow-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </header>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="h-80 bg-white rounded-[2rem] animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredListings.map(item => (
                <Link 
                  key={item._id}
                  to={`/buyer/listing/${item._id}`}
                  className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-gray-100 transition-all group flex flex-col"
                >
                  <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                    {item.images?.[0] ? (
                      <img src={item.images[0]} alt={item.cropName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ShoppingBag className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <div className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1 shadow-sm">
                        <Shield className="w-3 h-3" /> Grade {item.aiGrade || 'A'}
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-black text-orange-500 flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-orange-500" /> 4.8
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-black text-gray-900 capitalize group-hover:text-green-600 transition-colors">{item.cropName}</h4>
                      <div className="text-right">
                        <div className="text-2xl font-black text-gray-900">â‚¹{item.expectedPrice}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">per {item.unit || 'KG'}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-6">
                      <MapPin className="w-3 h-3" /> {item.location || 'Nashik, Maharashtra'}
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-100" />
                        ))}
                        <div className="w-6 h-6 rounded-full border-2 border-white bg-green-50 text-[8px] font-bold text-green-600 flex items-center justify-center">+12</div>
                      </div>
                      <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest flex items-center gap-1">
                        View Details <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Marketplace;

