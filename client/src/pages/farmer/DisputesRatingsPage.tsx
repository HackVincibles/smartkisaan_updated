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
  History,
  Fingerprint,
  Sparkles,
  Shield,
  Workflow,
  Cpu,
  MoreHorizontal,
  ArrowRight,
  TrendingUp,
  MessageCircle,
  CheckCircle
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
      if (activeTab === 'disputes' && (disputes.length === 0 || !disputes)) {
        setDisputes([
          { _id: 'D-101', orderId: 'ORD-9988', reason: 'Logistics Delay (Non-Farmer Error)', status: 'IN_REVIEW', createdAt: new Date() }
        ]);
      } 
      if (activeTab === 'reviews' && (reviews.length === 0 || !reviews)) {
        setReviews([
          { _id: 'R-1', reviewerName: 'Rahul Kumar', score: 5, comment: 'Premium grade Basmati. Packaging was exceptional.', createdAt: new Date() },
          { _id: 'R-2', reviewerName: 'Mandi Trader', score: 4, comment: 'Good consistency. Verified weight matched perfectly.', createdAt: new Date(Date.now() - 172800000) }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Trust Nexus Uplink Failed');
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return 'warning';
      case 'RESOLVED': return 'success';
      case 'IN_REVIEW': return 'secondary';
      default: return 'primary';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32 fade-in">
      {/* Premium Trust Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative overflow-hidden p-4">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
            Reputation & Protection Protocol v5.0.2
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-gray-950 tracking-tighter italic leading-none">
            Trust <span className="not-italic text-primary">Nexus.</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-xl text-xl leading-relaxed italic">
            Managing <span className="text-gray-900 font-black italic">institutional reputation score</span>. Real-time sovereign trust synchronization active.
          </p>
        </div>
        
        <div className="flex items-center gap-4 p-2 bg-gray-50/50 backdrop-blur-xl rounded-[2.5rem] border border-gray-100 relative z-10">
            {[
                { label: 'ACTIVE DISPUTES', value: 'disputes' },
                { label: 'BUYER REVIEWS', value: 'reviews' }
            ].map((tab) => (
                <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value as any)}
                    className={`px-8 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] italic transition-all ${
                        activeTab === tab.value 
                        ? 'bg-white text-primary shadow-xl border border-primary/10' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>

        {/* Decorative Background Text */}
        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none -mr-20">
            <h1 className="text-[15rem] font-black italic tracking-tighter">REPUTE</h1>
        </div>
      </div>

      {/* Trust Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 px-4">
        <div className="lg:col-span-8 stitch-card p-12 bg-gray-950 text-white relative overflow-hidden group shadow-2xl shadow-gray-950/20">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="w-28 h-28 bg-white/10 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-1000">
              <ShieldCheck size={56} className="text-primary" />
            </div>
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/20 text-primary rounded-xl text-[9px] font-black uppercase tracking-widest italic border border-primary/20">
                <Award size={14} /> Platinum Tier Asset
              </div>
              <h3 className="text-4xl font-bold italic tracking-tighter leading-none">Sovereign Elite Status</h3>
              <p className="text-gray-400 font-medium italic text-lg leading-relaxed max-w-lg">
                Your node is in the <span className="text-white font-black italic">Top 15%</span> of verified farmers. Global priority routing enabled.
              </p>
              <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-6">
                <div className="px-6 py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest italic flex items-center gap-3 border border-white/5 group-hover:border-primary/20 transition-colors">
                  <Fingerprint size={16} className="text-primary" /> Biometric Verified
                </div>
                <div className="px-6 py-3 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest italic flex items-center gap-3 border border-white/5 group-hover:border-primary/20 transition-colors">
                  <Zap size={16} className="text-primary" /> Instant Liquidity
                </div>
              </div>
            </div>
            
            <div className="shrink-0 flex gap-12 border-l border-white/5 pl-12 hidden xl:flex">
              <div className="text-center space-y-2">
                <p className="text-6xl font-black text-primary italic tracking-tighter leading-none">{user?.trustScore || 100}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/20 italic leading-none">TRUST INDEX</p>
              </div>
              <div className="text-center space-y-2">
                <p className="text-6xl font-black text-primary italic tracking-tighter leading-none">4.8</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/20 italic leading-none">HUB RATING</p>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] -mr-64 -mt-64 group-hover:opacity-40 transition-opacity duration-1000"></div>
        </div>

        <div className="lg:col-span-4 stitch-card p-12 bg-white shadow-2xl shadow-gray-200/50 flex flex-col justify-center text-center space-y-8 group">
          <div className="w-20 h-20 bg-gray-50 rounded-[1.8rem] flex items-center justify-center mx-auto text-primary border border-gray-100 group-hover:scale-110 group-hover:bg-gray-950 group-hover:text-white transition-all duration-700 shadow-inner">
            <Activity size={36} />
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 italic leading-none">RESPONSE VELOCITY</p>
            <h4 className="text-4xl font-bold text-gray-950 italic tracking-tighter">Excellent</h4>
            <div className="inline-flex px-4 py-1.5 rounded-xl bg-success/10 text-[10px] font-black text-success uppercase tracking-widest italic border border-success/10">
              AVG: 1.2 HOURS
            </div>
          </div>
        </div>
      </div>

      {/* content Surface */}
      <div className="relative min-h-[400px] px-4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[1, 2].map(n => (
              <div key={n} className="h-60 bg-white rounded-[3.5rem] animate-pulse border border-gray-50 shadow-sm" />
            ))}
          </div>
        ) : activeTab === 'disputes' ? (
          <div className="space-y-12">
            {disputes.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[4rem] p-40 text-center space-y-10 border border-gray-50 shadow-2xl shadow-gray-200/50 relative overflow-hidden"
              >
                <div className="relative z-10">
                    <div className="w-32 h-32 bg-primary/5 text-primary rounded-[2.5rem] flex items-center justify-center mx-auto border border-primary/10 shadow-2xl shadow-primary/10 group-hover:scale-110 transition-transform">
                        <CheckCircle2 size={72} />
                    </div>
                    <div className="space-y-4 pt-10">
                        <h3 className="text-4xl font-bold text-gray-950 italic tracking-tight">Registry Absolute.</h3>
                        <p className="text-gray-400 font-medium italic text-xl max-w-xl mx-auto">Your track record is flawless. All regional nodes operating within trust parameters.</p>
                    </div>
                </div>
                {/* Background Decor */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </svg>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-8">
                {disputes.map((dispute, idx) => (
                    <motion.div 
                        key={dispute._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        className="stitch-card p-12 bg-white shadow-2xl shadow-gray-200/50 group relative overflow-hidden"
                    >
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
                            <div className="flex items-center gap-10 flex-1">
                                <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center shrink-0 shadow-inner border border-transparent bg-${getStatusVariant(dispute.status)}/10 text-${getStatusVariant(dispute.status)} group-hover:scale-110 transition-transform duration-700`}>
                                    <AlertCircle size={48} />
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex flex-wrap items-center gap-6">
                                        <h4 className="text-3xl font-bold text-gray-950 italic tracking-tight group-hover:text-primary transition-colors leading-none">CASE #{dispute.orderId}</h4>
                                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest italic bg-${getStatusVariant(dispute.status)}/10 text-${getStatusVariant(dispute.status)} border border-${getStatusVariant(dispute.status)}/10`}>
                                            {dispute.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <p className="text-xl font-bold text-gray-400 italic max-w-xl leading-relaxed">{dispute.reason}</p>
                                    <div className="flex flex-wrap items-center gap-10 pt-2">
                                        <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.2em] italic flex items-center gap-3">
                                            <History size={16} /> REPORTED: {new Date(dispute.createdAt).toLocaleDateString()}
                                        </p>
                                        <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] italic flex items-center gap-3">
                                            <Shield size={16} /> KISSAN-JUSTICE MEDIATION ACTIVE
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 w-full lg:w-auto">
                                <button className="flex-1 lg:flex-none px-12 py-6 bg-gray-950 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.4em] italic hover:bg-primary transition-all shadow-2xl shadow-gray-200 group/btn relative overflow-hidden">
                                    <span className="relative z-10 flex items-center justify-center gap-4">
                                        ANALYZE CASE LOGS <ArrowRight size={20} className="group-hover/btn:translate-x-3 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </button>
                                <button className="p-5 bg-gray-50 rounded-2xl text-gray-300 hover:text-gray-950 transition-all shadow-sm">
                                    <MoreHorizontal size={28} />
                                </button>
                            </div>
                        </div>
                        {/* Status Progress Line */}
                        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-50">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '33.33%' }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className={`h-full bg-${getStatusVariant(dispute.status)} shadow-2xl`} 
                            />
                        </div>
                    </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {reviews.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="col-span-full bg-white rounded-[4rem] p-40 text-center space-y-10 border border-gray-50 shadow-2xl shadow-gray-200/50 relative overflow-hidden"
              >
                <div className="relative z-10">
                    <div className="w-32 h-32 bg-gray-50 text-gray-200 rounded-[2.5rem] flex items-center justify-center mx-auto border border-gray-100 shadow-xl">
                        <Star size={72} />
                    </div>
                    <div className="space-y-4 pt-10">
                        <h3 className="text-4xl font-bold text-gray-950 italic tracking-tight">Signal Lost.</h3>
                        <p className="text-gray-400 font-medium italic text-xl max-w-xl mx-auto">Awaiting buyer appraisal nodes. Complete more successful cycles to populate this grid.</p>
                    </div>
                </div>
              </motion.div>
            ) : (
              reviews.map((review, idx) => (
                <motion.div 
                    key={review._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="stitch-card p-12 bg-white shadow-2xl shadow-gray-200/50 group space-y-10 relative overflow-hidden"
                >
                    <div className="flex justify-between items-start relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-[1.8rem] bg-gray-950 text-primary flex items-center justify-center font-black text-3xl italic shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-700">
                                {review.reviewerName?.charAt(0)}
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl font-black text-gray-950 italic tracking-tight leading-none truncate max-w-[200px]">{review.reviewerName || 'Anonymous Node'}</p>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] italic leading-none">
                                    VERIFIED CONTRACT PARTNER
                                </p>
                            </div>
                        </div>
                        <div className="bg-gray-950 px-6 py-3 rounded-[1.5rem] flex items-center gap-3 shadow-2xl border border-white/5 group-hover:bg-primary transition-colors">
                            <Star size={20} className="fill-white text-white" />
                            <span className="text-2xl font-black text-white italic leading-none">{review.score}.0</span>
                        </div>
                    </div>
                    
                    <div className="bg-gray-50/50 p-10 rounded-[2.5rem] border border-gray-50 relative group-hover:bg-white group-hover:shadow-2xl transition-all duration-700">
                        <div className="absolute -top-3 left-8 px-3 bg-white text-[9px] font-black uppercase tracking-[0.3em] text-gray-300 italic border border-gray-50 rounded-lg">INSTITUTIONAL TESTIMONIAL</div>
                        <p className="text-xl font-medium text-gray-700 italic leading-relaxed">
                            "{review.comment}"
                        </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 relative z-10">
                        <div className="flex items-center gap-6">
                            <button className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] italic text-gray-400 hover:text-primary transition-all shadow-sm">
                                <ThumbsUp size={16} /> HELPFUL
                            </button>
                            <button className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] italic text-gray-400 hover:text-secondary transition-all shadow-sm">
                                <MessageCircle size={16} /> RESPOND
                            </button>
                        </div>
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] italic leading-none">
                            {new Date(review.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                        </p>
                    </div>
                    
                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 p-8 text-primary/5 group-hover:text-primary/10 transition-colors">
                        <Sparkles size={100} />
                    </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Trust Infrastructure Advisory */}
      <div className="stitch-card p-16 bg-gray-950 text-white relative overflow-hidden group shadow-2xl shadow-gray-950/20">
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
            <div className="w-28 h-28 bg-white/10 backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-center text-primary border border-white/10 shadow-2xl group-hover:rotate-12 transition-transform duration-1000">
                <Gavel size={48} className="stroke-[1.5]" />
            </div>
            <div className="flex-1 text-center lg:text-left space-y-6">
                <div className="inline-flex items-center gap-4 px-6 py-2 bg-primary/20 text-primary rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic border border-primary/20 shadow-2xl">
                    <ShieldCheck size={18} /> REPUTATION SHIELD ACTIVE
                </div>
                <h3 className="text-4xl md:text-5xl font-bold italic tracking-tighter leading-tight">Institutional Trust Protection</h3>
                <p className="text-gray-400 font-medium max-w-3xl leading-relaxed text-xl italic">
                    Smart-Kissan uses <span className="text-primary font-black italic underline underline-offset-8 decoration-4 decoration-primary/20">AI-Meditation Protocols</span> to resolve disputes. Photographic evidence and IoT sensor telemetry ensure your hard work is always protected.
                </p>
            </div>
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-16 py-8 bg-white text-gray-950 rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.5em] italic shadow-2xl shadow-black/20 hover:bg-primary hover:text-white transition-all"
            >
                READ POLICY DOCUMENT
            </motion.button>
        </div>
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] -mr-80 -mt-80 group-hover:opacity-40 transition-opacity duration-1000"></div>
        <div className="absolute bottom-0 left-0 p-12 text-white/5 group-hover:text-white/10 transition-colors">
            <Cpu size={160} />
        </div>
      </div>
    </div>
  );
};

export default DisputesRatingsPage;
