import React, { useState, useEffect } from 'react';
import { 
  Gavel, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight,
  MessageCircle,
  IndianRupee,
  Scale,
  ShieldCheck,
  TrendingUp,
  MapPin,
  ChevronRight,
  User,
  Zap,
  Handshake,
  ArrowUpRight,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
// @ts-ignore
import farmerService from '../../services/farmerService';
import { formatCurrency, formatRelativeTime } from '../../lib/utils';
import toast from 'react-hot-toast';

const BidsOffersPage = () => {
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('received');

  useEffect(() => {
    fetchBids();
  }, [activeTab]);

  const fetchBids = async () => {
    try {
      setLoading(true);
      const response = await farmerService.getBids();
      const bidData = response.data.data || response.data;
      setBids(Array.isArray(bidData) ? bidData : []);
      
      if (Array.isArray(bidData) && bidData.length === 0) {
        setBids([
          {
            _id: 'B-9981',
            escrowState: 'BID_PLACED',
            createdAt: new Date(),
            pricePerUnit: 4250,
            quantity: 50,
            unit: 'Quintal',
            agreedPrice: 212500,
            listingId: { productName: 'Basmati Rice (Organic)' },
            buyerId: { businessName: 'Global Grains Pvt Ltd', address: { city: 'Delhi' }, rating: 4.8 }
          },
          {
            _id: 'B-9982',
            escrowState: 'PAID_ESCROW',
            createdAt: new Date(Date.now() - 3600000 * 5),
            pricePerUnit: 2180,
            quantity: 100,
            unit: 'Quintal',
            agreedPrice: 218000,
            listingId: { productName: 'Golden Wheat' },
            buyerId: { businessName: 'Mandi Direct', address: { city: 'Amritsar' }, rating: 4.9 }
          }
        ]);
      }
    } catch (error) {
      console.error('Fetch bids error:', error);
      toast.error('Failed to load bids');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (bidId: string, action: 'accept' | 'reject') => {
    try {
      if (action === 'accept') {
        await farmerService.acceptBid(bidId);
        toast.success('Bid accepted! Funds secured in escrow.');
      } else {
        toast.error('Reject feature coming soon');
        return;
      }
      fetchBids();
    } catch (error) {
      toast.error(`Failed to ${action} bid`);
    }
  };

  const getStatusVariant = (status: string) => {
    switch(status?.toUpperCase()) {
      case 'COMPLETED': return 'bg-success/10 text-success border-success/20';
      case 'DISPUTED': return 'bg-red-50 text-red-600 border-red-100';
      case 'BID_PLACED': return 'bg-tertiary-50 text-tertiary border-tertiary-100';
      case 'PAID_ESCROW': return 'bg-primary-50 text-primary border-primary-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-tertiary-100 border-t-tertiary rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 shimmer">Syncing Negotiation Grid...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <span>Marketplace</span>
            <ChevronRight size={10} />
            <span className="text-primary-600">Negotiations</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight italic">Bids & <span className="not-italic text-tertiary">Offers</span></h1>
        </div>
        
        <div className="flex gap-4 p-4 bg-tertiary-50 rounded-2xl border border-tertiary-100 shadow-sm">
          <div className="px-6 border-r border-tertiary-200">
            <p className="text-[10px] font-bold text-tertiary-600 uppercase tracking-widest mb-1">New Offers</p>
            <p className="text-2xl font-bold text-tertiary-900">{bids.filter(b => b.escrowState === 'BID_PLACED').length}</p>
          </div>
          <div className="px-6">
            <p className="text-[10px] font-bold text-tertiary-600 uppercase tracking-widest mb-1">Market Edge</p>
            <p className="text-2xl font-bold text-tertiary-900">+8.4%</p>
          </div>
        </div>
      </div>

      {/* Tabs & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-1 p-1 bg-gray-50 rounded-xl border border-gray-100 shadow-inner">
          {[
            { label: 'Active', value: 'received' },
            { label: 'Successful', value: 'history' }
          ].map((tab) => (
            <button 
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-8 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeTab === tab.value 
                  ? 'bg-white text-tertiary shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-tertiary transition-colors" size={16} />
            <input type="text" placeholder="Filter negotiations..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-tertiary-50 transition-all" />
          </div>
          <button className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-tertiary transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Bids List */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {bids.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="stitch-card p-24 text-center space-y-6"
            >
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                <Gavel size={48} className="text-gray-200" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900 italic">No active offers</h3>
                <p className="text-gray-500 font-medium max-w-xs mx-auto text-sm uppercase tracking-widest">Awaiting buyer engagement...</p>
              </div>
              <Link to="/farmer/listings" className="btn btn-outline py-4 px-10 rounded-xl text-[10px] uppercase tracking-widest">
                Manage Inventory
              </Link>
            </motion.div>
          ) : (
            bids.map((bid, idx) => (
              <motion.div 
                key={bid._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="stitch-card group overflow-hidden"
              >
                <div className="p-8 md:p-10">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
                    <div className="flex-1 space-y-6 min-w-0">
                      <div className="flex items-center gap-4">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${getStatusVariant(bid.escrowState)}`}>
                          {bid.escrowState?.replace('_', ' ')}
                        </span>
                        <span className="text-[9px] text-gray-300 font-bold uppercase tracking-widest italic">Protocol ID: {bid._id?.slice(-8)}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-3xl font-bold text-gray-900 italic tracking-tight truncate">
                          {bid.listingId?.productName}
                        </h3>
                        <div className="flex flex-wrap items-center gap-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-tertiary-50 flex items-center justify-center text-tertiary shadow-sm">
                              <User size={20} />
                            </div>
                            <span className="text-sm font-bold text-gray-700">{bid.buyerId?.businessName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <MapPin size={14} className="text-tertiary" />
                            {bid.buyerId?.address?.city}
                          </div>
                          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                            <StarRating rating={bid.buyerId?.rating || 5} />
                            <span className="text-[10px] font-bold text-gray-900 ml-1">{bid.buyerId?.rating || '5.0'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-900 rounded-3xl p-8 text-white min-w-[300px] text-right shadow-2xl relative overflow-hidden group/price">
                      <div className="relative z-10">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Offer Valuation</p>
                        <p className="text-4xl font-bold tracking-tighter mb-1 leading-none italic">
                          ₹{bid.pricePerUnit}<span className="text-lg text-tertiary font-normal not-italic">/{bid.unit || 'Qtl'}</span>
                        </p>
                        <p className="text-[10px] font-bold text-tertiary/80 uppercase tracking-widest">Total Net: {formatCurrency(bid.agreedPrice)}</p>
                      </div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary rounded-full blur-3xl opacity-5 group-hover/price:opacity-10 transition-opacity" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-gray-50 my-10">
                    <div className="space-y-1.5">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Order Quantity</p>
                      <div className="flex items-center gap-2 font-bold text-gray-900">
                        <Scale size={16} className="text-tertiary" />
                        <span>{bid.quantity} {bid.unit || 'Qtl'}</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Secured Layer</p>
                      <div className="flex items-center gap-2 font-bold text-gray-900">
                        <ShieldCheck size={16} className="text-primary" />
                        <span>Polygon Escrow</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Buyer Status</p>
                      <div className="flex items-center gap-2 font-bold text-success">
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                        <span>KYC Verified</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Timestamp</p>
                      <div className="flex items-center gap-2 font-bold text-gray-500 italic">
                        <Clock size={16} />
                        <span>{formatRelativeTime(bid.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex gap-3">
                      <button className="btn btn-outline px-6 py-3 rounded-xl text-[9px] uppercase tracking-widest flex items-center gap-2">
                        <MessageCircle size={16} className="text-tertiary" />
                        Communicate
                      </button>
                      <button className="btn btn-outline px-6 py-3 rounded-xl text-[9px] uppercase tracking-widest flex items-center gap-2">
                        <Zap size={16} className="text-secondary" />
                        Mandi Sync
                      </button>
                    </div>
                    
                    <div className="flex gap-4 w-full sm:w-auto">
                      {bid.escrowState === 'BID_PLACED' ? (
                        <>
                          <button 
                            onClick={() => handleAction(bid._id, 'reject')}
                            className="flex-1 sm:flex-none px-8 py-4 border border-red-100 rounded-xl text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all"
                          >
                            Decline
                          </button>
                          <button 
                            onClick={() => handleAction(bid._id, 'accept')}
                            className="flex-1 sm:flex-none btn btn-farmer px-10 py-4 rounded-xl text-[10px] uppercase tracking-widest flex items-center gap-2 group/btn shadow-lg"
                          >
                            <Handshake size={18} className="group-hover/btn:scale-110 transition-transform" />
                            Secure Contract
                          </button>
                        </>
                      ) : (
                        <Link 
                          to={`/farmer/orders`}
                          className="btn btn-primary px-10 py-4 rounded-xl text-[10px] uppercase tracking-widest flex items-center gap-2"
                        >
                          Lifecycle View
                          <ArrowUpRight size={18} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Negotiation Tip Sidebar */}
      <div className="bg-gray-900 rounded-[3rem] p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 group shadow-xl">
        <div className="relative z-10 space-y-6 max-w-xl">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-tertiary border border-white/5 group-hover:rotate-6 transition-transform">
            <Sparkles size={32} />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-bold leading-tight italic tracking-tight">
              Negotiation <span className="not-italic text-tertiary">Nexus</span>
            </h2>
            <p className="text-gray-400 font-medium leading-relaxed text-lg">
              Respond within 2 hours to increase your closure rate by <span className="text-white font-bold italic">65%</span>. Secured Polygon smart contracts ensure zero payment default.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-gray-900 bg-tertiary-500/20 backdrop-blur-md" />
              ))}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-tertiary">1.2k+ Successful Escrows Today</p>
          </div>
        </div>
        
        <div className="relative z-10 p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md min-w-[320px] space-y-6">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-tertiary">Contract Shield</h4>
          <div className="space-y-4">
            <FeatureItem text="Encrypted Protocol Terms" />
            <FeatureItem text="Instant Fiat Settlement" />
            <FeatureItem text="AI Dispute Resolution" />
          </div>
        </div>

        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-tertiary rounded-full blur-[120px] opacity-10 group-hover:opacity-20 transition-opacity duration-1000"></div>
      </div>
    </div>
  );
};

const FeatureItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-200">
    <div className="w-6 h-6 bg-tertiary/20 rounded-lg flex items-center justify-center text-tertiary border border-tertiary/20">
      <CheckCircle size={14} />
    </div>
    {text}
  </div>
);

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <svg 
        key={i}
        className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-tertiary fill-current' : 'text-gray-200'}`} 
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

export default BidsOffersPage;

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <svg 
        key={i}
        className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-orange-400 fill-current' : 'text-gray-300'}`} 
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

export default BidsOffersPage;
