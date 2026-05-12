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
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import apiClient from '../../services/api';

const MyListings = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await apiClient.get('/farmer/listings');
        const data = res.data.data || [];
        setListings(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Error fetching listings', e);
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
    fetchListings();
  }, []);

  const filteredListings = listings.filter(l => 
    l.cropName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBids = listings.reduce((acc, curr) => acc + (curr.bidsCount || 0), 0);
  const totalValue = listings.reduce((acc, curr) => acc + (curr.basePrice * curr.quantity || 0), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <span>Marketplace</span>
            <ChevronRight size={10} />
            <span className="text-primary-600">Inventory</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight italic">
            Active <span className="not-italic text-tertiary">Harvests</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex gap-4 p-4 bg-tertiary-50 rounded-2xl border border-tertiary-100 px-6">
            <div className="text-center border-r border-tertiary-200 pr-6">
              <p className="text-[9px] font-bold text-tertiary-600 uppercase tracking-widest mb-0.5">Total Value</p>
              <p className="text-xl font-bold text-tertiary-900">₹{(totalValue / 100000).toFixed(1)}L</p>
            </div>
            <div className="text-center pl-2">
              <p className="text-[9px] font-bold text-tertiary-600 uppercase tracking-widest mb-0.5">Inquiries</p>
              <p className="text-xl font-bold text-tertiary-900">{totalBids}</p>
            </div>
          </div>
          
          <Link 
            to="/farmer/new-listing" 
            className="btn btn-farmer px-8 py-4 rounded-xl text-[10px] uppercase tracking-widest flex items-center gap-2"
          >
            <Plus size={16} /> New Listing
          </Link>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-tertiary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search your inventory..." 
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-tertiary-100 font-bold text-gray-900 placeholder:text-gray-300 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-tertiary shadow-sm' : 'text-gray-400'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-tertiary shadow-sm' : 'text-gray-400'}`}
            >
              <List size={18} />
            </button>
          </div>
          
          <button className="px-6 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all flex items-center gap-2">
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      {/* Listings Display */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="bg-white p-6 rounded-2xl border border-gray-50 space-y-4 animate-pulse shadow-sm">
              <div className="aspect-[4/3] bg-gray-50 rounded-xl" />
              <div className="space-y-2">
                <div className="h-5 bg-gray-50 rounded-lg w-3/4" />
                <div className="h-4 bg-gray-50 rounded-lg w-1/2" />
              </div>
              <div className="h-10 bg-gray-50 rounded-xl w-full" />
            </div>
          ))}
        </div>
      ) : filteredListings.length > 0 ? (
        <AnimatePresence>
          <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-3"}>
            {filteredListings.map((listing, idx) => (
              viewMode === 'grid' ? (
                <motion.div 
                  key={listing._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="stitch-card group flex flex-col relative overflow-hidden p-6"
                >
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4">
                    <img src={listing.images?.[0] || '/placeholder.png'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={listing.cropName} />
                    <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[9px] font-bold uppercase tracking-widest text-tertiary flex items-center gap-1.5 shadow-sm">
                      <ShieldCheck size={11} /> {listing.qualityScore || '--'}%
                    </div>
                  </div>

                  <div className="space-y-3 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-tertiary transition-colors leading-tight">{listing.cropName}</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                          <Clock size={10} /> {new Date(listing.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button className="p-1.5 text-gray-300 hover:text-gray-700 transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-50">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Quantity</p>
                        <p className="text-sm font-bold text-gray-900">{listing.quantity} {listing.unit}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Base Price</p>
                        <p className="text-sm font-bold text-tertiary">₹{listing.basePrice}/{listing.unit}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1.5">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-tertiary-100" />
                          ))}
                        </div>
                        <p className="text-[10px] font-bold text-tertiary">{listing.bidsCount || 0} Bids</p>
                      </div>
                      <Link to={`/farmer/listing/${listing._id}`} className="w-9 h-9 bg-gray-900 text-white rounded-xl hover:bg-tertiary flex items-center justify-center transition-all shadow-md">
                        <ArrowUpRight size={16} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key={listing._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="stitch-card flex items-center gap-5 group p-4"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <img src={listing.images?.[0] || '/placeholder.png'} className="w-full h-full object-cover" alt={listing.cropName} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 group-hover:text-tertiary transition-colors truncate">{listing.cropName}</h3>
                    <div className="flex gap-3 mt-0.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <span>{listing.quantity} {listing.unit}</span>
                      <span>₹{listing.basePrice}/unit</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 px-6 border-x border-gray-50">
                    <div className="text-center">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Quality</p>
                      <p className="font-bold text-tertiary">{listing.qualityScore || '--'}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Bids</p>
                      <p className="font-bold text-gray-900">{listing.bidsCount || 0}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-5 py-2 bg-gray-50 text-gray-600 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all">Edit</button>
                    <Link to={`/farmer/listing/${listing._id}`} className="w-9 h-9 bg-gray-900 text-white rounded-xl hover:bg-tertiary flex items-center justify-center transition-all">
                      <ExternalLink size={15} />
                    </Link>
                  </div>
                </motion.div>
              )
            ))}
          </div>
        </AnimatePresence>
      ) : (
        <div className="text-center py-24 stitch-card p-12">
          <div className="w-20 h-20 bg-tertiary-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sprout size={40} className="text-tertiary opacity-50" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">No active harvests</h3>
          <p className="text-gray-400 mt-2 max-w-sm mx-auto font-medium text-sm">
            {searchTerm ? "Try adjusting your search." : "List your premium produce to reach buyers across India."}
          </p>
          {!searchTerm && (
            <Link 
              to="/farmer/new-listing" 
              className="inline-flex items-center gap-2 mt-8 btn btn-farmer px-10 py-4 rounded-xl text-[10px] uppercase tracking-widest"
            >
              <Plus size={16} /> Create First Listing
            </Link>
          )}
        </div>
      )}

      {/* Market Intelligence Banner */}
      <div className="bg-gray-900 rounded-3xl p-10 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10 group shadow-xl">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-tertiary/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-tertiary border border-tertiary/20">
            <TrendingUp size={12} /> Market Alert
          </div>
          <h2 className="text-3xl font-bold leading-tight max-w-lg">
            Wheat prices are up 12% in Delhi Mandi today.
          </h2>
          <p className="text-gray-400 font-medium max-w-md text-sm">
            Your Golden Wheat listing is perfectly timed. Respond to active bids to lock in the premium rate.
          </p>
        </div>
        
        <div className="relative z-10 grid grid-cols-2 gap-4 shrink-0">
          <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-4xl font-bold text-tertiary mb-1">+12<span className="text-xl text-white">%</span></p>
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Price Surge</p>
          </div>
          <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-4xl font-bold text-tertiary mb-1">450<span className="text-xl text-white">+</span></p>
            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Active Buyers</p>
          </div>
        </div>

        <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-tertiary rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-1000"></div>
      </div>
    </div>
  );
};

export default MyListings;

