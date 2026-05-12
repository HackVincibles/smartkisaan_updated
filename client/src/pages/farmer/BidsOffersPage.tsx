import React, { useState, useEffect } from 'react';
import { 
  Gavel, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight,
  MessageCircle,
  IndianRupee,
  Scale
} from 'lucide-react';
import { motion } from 'framer-motion';
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
      // Handle backend structure { success: true, data: [...] }
      const bidData = response.data.data || response.data;
      setBids(Array.isArray(bidData) ? bidData : []);
      setLoading(false);
    } catch (error) {
      console.error('Fetch bids error:', error);
      toast.error('Failed to load bids');
      setLoading(false);
    }
  };

  const handleAction = async (bidId: string, action: 'accept' | 'reject') => {
    try {
      if (action === 'accept') {
        await farmerService.acceptBid(bidId);
      } else {
        // reject not implemented on backend yet, we can mark as ignored or add endpoint later
        toast.error('Reject not yet implemented on backend');
        return;
      }
      toast.success(`Bid ${action}ed successfully`);
      fetchBids();
    } catch (error) {
      toast.error(`Failed to ${action} bid`);
    }
  };

  const getStatusStyle = (status: string) => {
    switch(status?.toUpperCase()) {
      case 'COMPLETED': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'DISPUTED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'BID_PLACED': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'PAID_ESCROW': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) return <div className="flex items-center justify-center h-96">Loading bids...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bids & Offers</h1>
        <p className="text-gray-500">Manage incoming offers for your produce</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-dark-300">
        <button 
          onClick={() => setActiveTab('received')}
          className={`px-6 py-3 text-sm font-bold transition-colors relative ${
            activeTab === 'received' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Received Bids
          {activeTab === 'received' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`px-6 py-3 text-sm font-bold transition-colors relative ${
            activeTab === 'history' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Bid History
          {activeTab === 'history' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600"></div>}
        </button>
      </div>

      <div className="space-y-4">
        {bids.length === 0 ? (
          <div className="card p-12 text-center text-gray-500">
            <Gavel className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg">No bids found</p>
          </div>
        ) : (
          bids.map((bid) => (
            <motion.div 
              key={bid.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card overflow-hidden"
            >
              <div className="p-5">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${getStatusStyle(bid.escrowState)}`}>
                        {bid.escrowState?.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold">#{bid._id?.slice(-6)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{bid.listingId?.productName || 'Unnamed Product'}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 font-medium">
                      From: <span className="text-primary-600">{bid.buyerId?.businessName || 'Buyer'}</span> • {bid.buyerId?.address?.city || 'India'}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase font-black tracking-tighter">Offered Price</p>
                    <div className="flex items-center gap-1 text-2xl font-black text-primary-600">
                      <IndianRupee className="w-5 h-5" />
                      {bid.pricePerUnit}
                      <span className="text-sm font-bold text-gray-400">/{bid.unit || 'Qtl'}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-dark-300 rounded-xl mb-4">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-black">Quantity</p>
                    <p className="font-bold flex items-center gap-1"><Scale className="w-3 h-3" /> {bid.quantity} {bid.unit || 'Qtl'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-black">Total Value</p>
                    <p className="font-bold text-green-600">{formatCurrency(bid.agreedPrice)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-black">Escrow Status</p>
                    <p className="font-bold text-xs">{bid.escrowState}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-black">Received</p>
                    <p className="font-bold">{formatRelativeTime(bid.createdAt)}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button className="flex items-center gap-2 text-primary-600 hover:bg-primary-50 px-3 py-2 rounded-lg transition-colors font-bold text-sm">
                    <MessageCircle className="w-4 h-4" />
                    Chat with Buyer
                  </button>
                  
                  {bid.escrowState === 'BID_PLACED' && (
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleAction(bid._id, 'reject')}
                        className="px-6 py-2 rounded-xl border border-red-200 text-red-600 font-bold hover:bg-red-50 transition-all text-sm flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                      <button 
                        onClick={() => handleAction(bid._id, 'accept')}
                        className="px-6 py-2 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 shadow-lg shadow-primary-100 transition-all text-sm flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Accept Bid
                      </button>
                    </div>
                  )}
                  
                  {bid.escrowState !== 'BID_PLACED' && (
                    <Link 
                      to={`/farmer/orders`}
                      className="px-6 py-2 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-all text-sm flex items-center gap-2"
                    >
                      View in Orders
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default BidsOffersPage;
