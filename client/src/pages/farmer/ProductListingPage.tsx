import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Package
} from 'lucide-react';
// @ts-ignore
import farmerService from '../../services/farmerService';
import { formatCurrency } from '../../lib/utils';
import toast from 'react-hot-toast';

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
      const params = {
        status: statusFilter !== 'all' ? statusFilter : undefined,
        sort: sortBy,
        search: searchTerm || undefined
      };
      const response = await farmerService.getListings(params);
      setListings(response.data.listings || []);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await farmerService.deleteListing(id);
        toast.success('Listing deleted successfully');
        fetchListings();
      } catch (error) {
        toast.error('Failed to delete listing');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, any> = {
      active: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle, label: 'Active' },
      pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: Clock, label: 'Pending' },
      draft: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400', icon: AlertCircle, label: 'Draft' },
      sold: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: CheckCircle, label: 'Sold Out' },
      inactive: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: AlertCircle, label: 'Inactive' }
    };
    const badge = badges[status?.toLowerCase()] || badges.inactive;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {badge.label}
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
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-2">My Listings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your farm produce listings</p>
        </div>
        <Link to="/farmer/listings/add" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Listing
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-sm text-gray-500 mb-1">Total Listings</p>
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs text-green-600 mt-1">{stats.active} active</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-500 mb-1">Total Views</p>
          <p className="text-2xl font-bold">{stats.totalViews}</p>
          <p className="text-xs text-gray-500 mt-1">+18 this week</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-500 mb-1">Total Bids</p>
          <p className="text-2xl font-bold">{stats.totalBids}</p>
          <p className="text-xs text-green-600 mt-1">+3 this week</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-500 mb-1">Total Earnings</p>
          <p className="text-2xl font-bold">₹48,750</p>
          <p className="text-xs text-green-600 mt-1">This Month</p>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search your products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchListings()}
                className="input pl-9"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input w-40"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="draft">Draft</option>
            <option value="sold">Sold Out</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input w-40"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="price_high">Price: High to Low</option>
            <option value="price_low">Price: Low to High</option>
            <option value="views">Most Viewed</option>
            <option value="bids">Most Bids</option>
          </select>
          <button onClick={fetchListings} className="btn-secondary">
            Apply Filters
          </button>
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="card p-12 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
          <p className="text-gray-500 mb-4">Start selling your produce by creating your first listing</p>
          <Link to="/farmer/listings/add" className="btn-primary inline-flex items-center gap-2 mx-auto">
            <Plus className="w-4 h-4" />
            Create Listing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {listings.map((listing, index) => (
            <motion.div
              key={listing._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card hover:shadow-lg transition-all"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{listing.productName}</h3>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(listing.status)}
                      <span className="text-sm text-gray-500">{listing.quantity} {listing.unit || 'Quintal'}</span>
                    </div>
                  </div>
                  <div className="relative group">
                    <button className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-300">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-dark-200 rounded-lg shadow-lg border border-gray-200 dark:border-dark-300 hidden group-hover:block z-10">
                      <Link
                        to={`/farmer/listings/${listing._id}`}
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-300 rounded-t-lg"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </Link>
                      <Link
                        to={`/farmer/listings/${listing._id}/edit`}
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-300"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(listing._id)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-dark-300 rounded-b-lg w-full text-left"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-2xl font-bold text-primary-600">{formatCurrency(listing.expectedPrice)}<span className="text-sm text-gray-500">/{listing.unit || 'Quintal'}</span></p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {listing.viewCount || 0} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Gavel className="w-3 h-3" />
                        {listing.bids || 0} bids
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/farmer/bids`}
                    className="text-primary-600 hover:underline text-sm"
                  >
                    View Bids →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListingPage;
