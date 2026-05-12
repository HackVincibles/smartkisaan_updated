import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Filter, Gavel } from 'lucide-react';
import BidCard from '@/components/farmer/BidCard';
import DashboardLayout from '../../components/layout/DashboardLayout';
import apiClient from '../../services/api';
import { toast } from 'sonner';

const BidsReceived = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await apiClient.get('/farmer/bids');
        setBids(res.data.data || []);
      } catch (e) {
        console.error('Error fetching bids', e);
      } finally {
        setLoading(false);
      }
    };
    fetchBids();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      await apiClient.post(`/farmer/bids/${id}/accept`);
      setBids(bids.filter((b: any) => b._id !== id));
      toast.success('Bid accepted successfully! Order created.');
    } catch (e) {
      toast.error('Failed to accept bid');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await apiClient.post(`/farmer/bids/${id}/reject`);
      setBids(bids.filter((b: any) => b._id !== id));
      toast.success('Bid rejected');
    } catch (e) {
      toast.error('Failed to reject bid');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Bids Received</h1>
          <p className="text-gray-500 mt-1">Review and accept offers from interested buyers</p>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-[300px] bg-white rounded-[2rem] animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : bids.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bids.map((bid: any) => (
              <BidCard 
                key={bid._id} 
                bid={bid} 
                onAccept={handleAccept} 
                onReject={handleReject} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gavel className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">No Bids Yet</h3>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto px-4">
              Your listings are live! You'll see offers from buyers here once they start bidding.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BidsReceived;

