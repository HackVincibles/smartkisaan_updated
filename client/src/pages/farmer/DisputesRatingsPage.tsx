import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Star, 
  ChevronRight, 
  Gavel,
  Search, 
  Filter, 
  MessageSquare,
  ThumbsUp, 
  ThumbsDown,
  ShieldCheck,
  Zap,
  Award,
  MoreVertical,
  Activity,
  History
} from 'lucide-react';
import disputeService from '../../services/disputeService';
import ratingService from '../../services/ratingService';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

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
      
      // Mock data if empty for demo
      if (activeTab === 'disputes' && disputes.length === 0) {
        setDisputes([
          { _id: 'D-101', orderId: 'ORD-9988', reason: 'Logistics Delay (Non-Farmer Error)', status: 'IN_REVIEW', createdAt: new Date() }
        ]);
      } else if (activeTab === 'reviews' && reviews.length === 0) {
        setReviews([
          { _id: 'R-1', reviewerName: 'Rahul Kumar', score: 5, comment: 'Premium grade Basmati. Packaging was exceptional.', createdAt: new Date() },
          { _id: 'R-2', reviewerName: 'Mandi Trader', score: 4, comment: 'Good consistency. Verified weight matched perfectly.', createdAt: new Date(Date.now() - 172800000) }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'RESOLVED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'IN_REVIEW': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
            <span>Identity</span>
            <ChevronRight size={10} />
            <span className="text-gray-900">Trust Center</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900">Reputation & Protection</h1>
        </div>
        
        <div className="flex gap-2 p-1 bg-gray-50 rounded-2xl w-fit border border-gray-100 shadow-inner">
          {[
            { label: 'Active Disputes', value: 'disputes' },
            { label: 'Buyer Feedback', value: 'reviews' }
          ].map((tab) => (
            <button 
              key={tab.value}
              onClick={() => setActiveTab(tab.value as any)}
              className={`px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab.value 
                  ? 'bg-white text-emerald-600 shadow-md' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trust KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-emerald-900 rounded-[3rem] p-10 text-white relative overflow-hidden group col-span-1 md:col-span-2">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
              <ShieldCheck size={48} className="text-emerald-400" />
            </div>
            <div className="flex-1 text-center md:text-left space-y-2">
              <h3 className="text-3xl font-black italic">Elite Status</h3>
              <p className="text-emerald-50/70 font-medium leading-relaxed max-w-md">
                Your account is in the <span className="text-white font-black">Top 15%</span> of verified farmers. You qualify for Instant Escrow Payouts and 0% Dispute Surcharge.
              </p>
              <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-4">
                <div className="px-4 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Award size={14} className="text-orange-400" /> Platinum Tier
                </div>
                <div className="px-4 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Zap size={14} className="text-emerald-400" /> Verified Seller
                </div>
              </div>
            </div>
            
            <div className="shrink-0 flex gap-8 border-l border-white/10 pl-10 hidden lg:flex">
              <div className="text-center">
                <p className="text-5xl font-black text-emerald-400">{user?.trustScore || 100}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-50/50 mt-2">Trust Score</p>
              </div>
              <div className="text-center">
                <p className="text-5xl font-black text-emerald-400">4.8</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-50/50 mt-2">Avg Rating</p>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-[120px] opacity-20 -mr-40 -mt-40 group-hover:opacity-30 transition-opacity duration-1000"></div>
        </div>

        <div className="bg-white rounded-[3rem] border border-gray-100 p-10 shadow-sm flex flex-col justify-center text-center space-y-4">
          <div className="w-20 h-20 bg-gray-50 rounded-[1.5rem] flex items-center justify-center mx-auto text-emerald-600 border border-gray-100">
            <Activity size={32} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Response Velocity</p>
            <h4 className="text-2xl font-black text-gray-900">Excellent</h4>
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Avg: 1.2 Hours</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map(n => (
              <div key={n} className="h-48 bg-white rounded-[3rem] animate-pulse border border-gray-50" />
            ))}
          </div>
        ) : activeTab === 'disputes' ? (
          <div className="space-y-6">
            {disputes.length === 0 ? (
              <div className="bg-white rounded-[4rem] p-24 text-center space-y-6 border border-gray-50 shadow-sm">
                <div className="w-32 h-32 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 size={64} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-gray-900">Zero Pending Disputes</h3>
                  <p className="text-gray-500 font-medium max-w-sm mx-auto">Your track record is flawless. Keep up the high-quality fulfillment!</p>
                </div>
              </div>
            ) : (
              disputes.map((dispute) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={dispute._id} 
                  className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-emerald-100/30 transition-all group cursor-pointer relative overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
                    <div className="flex items-start gap-8 flex-1">
                      <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shrink-0 shadow-inner border border-transparent ${getStatusVariant(dispute.status)}`}>
                        <AlertCircle size={32} />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <h4 className="text-2xl font-black text-gray-900 group-hover:text-emerald-600 transition-colors">Case #{dispute.orderId}</h4>
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusVariant(dispute.status)}`}>
                            {dispute.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-lg font-bold text-gray-500 max-w-xl">{dispute.reason}</p>
                        <div className="flex items-center gap-6 pt-2">
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-2">
                            <History size={14} /> Reported: {new Date(dispute.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest flex items-center gap-2">
                            <ShieldCheck size={14} /> Kissan-Justice Mediation
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <button className="flex-1 md:flex-none px-10 py-5 bg-gray-900 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-gray-100">
                        View Case Logs
                      </button>
                      <button className="p-5 bg-gray-50 rounded-2xl text-gray-400 hover:text-gray-600 transition-all">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>
                  {/* Progress Line */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-50">
                    <div className="h-full bg-emerald-500 w-1/3" />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.length === 0 ? (
              <div className="col-span-full bg-white rounded-[4rem] p-24 text-center space-y-6 border border-gray-50 shadow-sm">
                <Star size={64} className="text-gray-200 mx-auto" />
                <h3 className="text-3xl font-black text-gray-900">Awaiting Feedback</h3>
                <p className="text-gray-500 font-medium max-w-sm mx-auto">Complete more successful deliveries to start seeing buyer appraisals here.</p>
              </div>
            ) : (
              reviews.map((review) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={review._id} 
                  className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-emerald-100/30 transition-all group space-y-8"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-gray-50 text-emerald-600 flex items-center justify-center font-black text-xl border border-gray-100 shadow-inner group-hover:scale-110 transition-transform">
                        {review.reviewerName?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xl font-black text-gray-900">{review.reviewerName || 'Anonymous Buyer'}</p>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">
                          Verified Contract Partner
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-2 rounded-2xl flex items-center gap-1.5">
                      <Star size={16} className="fill-orange-400 text-orange-400" />
                      <span className="text-lg font-black text-gray-900">{review.score}.0</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-50 relative">
                    <div className="absolute -top-3 left-6 px-2 bg-white text-[10px] font-black uppercase text-gray-300">Testimonial</div>
                    <p className="text-lg font-medium text-gray-700 italic leading-relaxed">
                      "{review.comment}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-emerald-600 transition-all shadow-sm">
                        <ThumbsUp size={14} /> Helpful
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-all shadow-sm">
                        <MessageSquare size={14} /> Reply
                      </button>
                    </div>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                      {new Date(review.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Advisory Section */}
      <div className="bg-gray-50 rounded-[4rem] p-12 border border-gray-100 relative overflow-hidden group">
        <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
          <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-emerald-600 shadow-xl shadow-emerald-200/30 group-hover:scale-110 transition-transform">
            <Gavel size={48} />
          </div>
          <div className="flex-1 text-center lg:text-left space-y-4">
            <h3 className="text-3xl font-black text-gray-900">How we protect your reputation.</h3>
            <p className="text-gray-500 font-medium max-w-3xl leading-relaxed text-lg">
              Smart-Kissan uses AI-led meditation to resolve disputes without bias. We prioritize photographic evidence and IoT sensor data to ensure your hard work is always protected.
            </p>
          </div>
          <button className="px-12 py-5 bg-white border border-gray-200 text-gray-900 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all shadow-xl shadow-gray-100">
            Read Policy
          </button>
        </div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-500 rounded-full blur-[120px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
      </div>
    </div>
  );
};

export default DisputesRatingsPage;
