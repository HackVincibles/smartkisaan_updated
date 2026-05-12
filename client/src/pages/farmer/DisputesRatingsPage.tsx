import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, CheckCircle2, Clock, 
  Star, ChevronRight, Gavel,
  Search, Filter, MessageSquare,
  ThumbsUp, ThumbsDown
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import disputeService from '../../services/disputeService';
import ratingService from '../../services/ratingService';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

const DisputesRatingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'disputes' | 'reviews'>('disputes');
  const [disputes, setDisputes] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'disputes') {
        const response = await disputeService.getDisputes();
        const data = response.data?.data || response.data || [];
        setDisputes(Array.isArray(data) ? data : []);
      } else {
        if (user?._id) {
          const response = await ratingService.getUserReviews(user._id);
          const data = response.data?.data || response.data || [];
          setReviews(Array.isArray(data) ? data : []);
        }
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      // Mock data for demo
      if (activeTab === 'disputes') {
        setDisputes([
          { _id: '1', orderId: 'ORD-9988', reason: 'Payment not received', status: 'IN_REVIEW', createdAt: new Date() }
        ]);
      } else {
        setReviews([
          { _id: '1', reviewerName: 'Rahul Kumar', score: 5, comment: 'Great quality wheat, delivered on time!', createdAt: new Date() },
          { _id: '2', reviewerName: 'Mandi Trader', score: 4, comment: 'Good produce, but packaging could be better.', createdAt: new Date(Date.now() - 172800000) }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return 'bg-orange-100 text-orange-600';
      case 'RESOLVED': return 'bg-green-100 text-green-600';
      case 'IN_REVIEW': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Trust & Reputation</h1>
          <p className="text-gray-500 mt-1">Monitor your performance and resolve any issues</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-gray-100 rounded-2xl w-full md:w-80">
          <button 
            onClick={() => setActiveTab('disputes')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-black transition-all ${
              activeTab === 'disputes' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Disputes
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-black transition-all ${
              activeTab === 'reviews' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Reviews
          </button>
        </div>

        {loading ? (
          <div className="text-center py-24">
            <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">Fetching your records...</p>
          </div>
        ) : activeTab === 'disputes' ? (
          <div className="space-y-4">
            {disputes.length === 0 ? (
              <div className="card bg-white p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">All clear!</h3>
                  <p className="text-gray-500">You don't have any active disputes against you.</p>
                </div>
              </div>
            ) : (
              disputes.map((dispute) => (
                <div key={dispute._id} className="card bg-white p-6 hover:shadow-md transition-shadow group cursor-pointer border-l-4 border-l-primary-600">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${getStatusColor(dispute.status)}`}>
                        <AlertCircle size={24} />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-lg font-black text-gray-900">Order #{dispute.orderId}</span>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(dispute.status)}`}>
                            {dispute.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 font-medium">{dispute.reason}</p>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">
                          Received on {new Date(dispute.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className="text-gray-300 group-hover:text-primary-600 transition-colors" />
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.length === 0 ? (
              <div className="col-span-full card bg-white p-12 text-center space-y-4">
                <Star size={48} className="text-gray-200 mx-auto" />
                <h3 className="text-xl font-bold text-gray-900">No reviews yet</h3>
                <p className="text-gray-500">Complete more orders to start receiving feedback from buyers.</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="card bg-white p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
                        {review.reviewerName?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{review.reviewerName || 'Anonymous Buyer'}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          className={i < review.score ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} 
                        />
                      ))}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 leading-relaxed italic">
                    "{review.comment}"
                  </p>

                  <div className="pt-4 flex items-center gap-4 border-t border-gray-50">
                    <button className="flex items-center gap-1.5 text-[10px] font-black uppercase text-gray-400 hover:text-primary-600 transition-colors">
                      <ThumbsUp size={12} /> Useful
                    </button>
                    <button className="flex items-center gap-1.5 text-[10px] font-black uppercase text-gray-400 hover:text-red-500 transition-colors">
                      <ThumbsDown size={12} /> Report
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Reputation Summary Card */}
        <div className="card bg-primary-600 p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/30">
                <Award size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-black">Farmer Reputation</h3>
                <p className="text-primary-100">You are in the top 15% of farmers in your region!</p>
              </div>
            </div>
            
            <div className="flex gap-8">
              <div className="text-center">
                <p className="text-3xl font-black">{user?.trustScore || 100}%</p>
                <p className="text-[10px] uppercase font-bold opacity-70 tracking-widest">Trust Score</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black">4.8</p>
                <p className="text-[10px] uppercase font-bold opacity-70 tracking-widest">Avg Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DisputesRatingsPage;
