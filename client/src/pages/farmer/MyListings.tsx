import React, { useState, useEffect } from 'react';
import { Plus, Package, Search, Filter, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';
import ListingCard from '@/components/farmer/ListingCard';
import DashboardLayout from '@/components/layout/DashboardLayout';
import apiClient from '@/api/client';

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await apiClient.get('/farmer/listings');
        setListings(res.data.data || []);
      } catch (e) {
        console.error('Error fetching listings', e);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const filteredListings = listings.filter(l => 
    l.cropName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Harvests</h1>
            <p className="text-gray-500 mt-1">Manage and track your active produce listings</p>
          </div>
          <Link 
            to="/farmer/new-listing" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 shadow-lg shadow-green-100 transition-all"
          >
            <Plus className="w-5 h-5" /> Add New Produce
          </Link>
        </header>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by crop name..." 
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:border-green-600 focus:outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all">
            <Filter className="w-5 h-5" /> Filters
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-[400px] bg-white rounded-[2rem] animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map(listing => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sprout className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">No Listings Found</h3>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto px-4">
              {searchTerm ? "We couldn't find anything matching your search." : "You haven't listed any produce yet. Start selling to reach thousands of buyers!"}
            </p>
            {!searchTerm && (
              <Link 
                to="/farmer/new-listing" 
                className="inline-block mt-8 px-8 py-3 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-all"
              >
                List Your First Crop
              </Link>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyListings;

