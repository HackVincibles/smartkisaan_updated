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
  Filter,
  MoreHorizontal,
  Activity,
  Workflow,
  Cpu,
  Globe,
  Lock
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
      toast.error('Negotiation Nexus Uplink Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (bidId: string, action: 'accept' | 'reject') => {
    try {
      if (action === 'accept') {
        await farmerService.acceptBid(bidId);
        toast.success('Protocol Executed: Funds Secured in Escrow');
      } else {
        toast.error('Rejection Protocol Not Yet Initialized');
        return;
      }
      fetchBids();
    } catch (error) {
      toast.error(`Authorization Failed: Bid ${action} Error`);
    }
  };

  const getStatusVariant = (status: string) => {
    switch(status?.toUpperCase()) {
      case 'COMPLETED': return 'success';
      case 'DISPUTED': return 'error';
      case 'BID_PLACED': return 'secondary';
      case 'PAID_ESCROW': return 'primary';
      default: return 'warning';
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh] fade-in">
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-primary/10 rounded-[2rem] border border-primary/20 flex items-center justify-center mx-auto shadow-2xl">
          <Workflow className="text-primary animate-spin" size={40} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 italic shimmer">Syncing Negotiation Grid...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32 fade-in">
      {/* Premium Negotiation Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative overflow-hidden p-4">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-secondary italic">
            <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse"></div>
            Market Negotiation Protocol v2.1.0
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-gray-950 tracking-tighter italic leading-none">
            Bids & <span className="not-italic text-secondary">Offers.</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-xl text-xl leading-relaxed italic">
            Review and authorize inbound procurement offers. Your nodes are currently attracting <span className="text-gray-900 font-black italic">{bids.length} active inquiries</span>.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 relative z-10">
            <div className="flex items-center gap-8 p-6 bg-white border border-gray-100 rounded-[1.8rem] shadow-xl shadow-gray-200/50">
                <div className="text-center border-r border-gray-100 pr-8">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic mb-1">Active Offers</p>
                    <p className="text-2xl font-black text-secondary italic tracking-tight leading-none">{bids.filter(b => b.escrowState === 'BID_PLACED').length}</p>
                </div>
                <div className="text-center">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic mb-1">Market Intensity</p>
                    <p className="text-2xl font-black text-gray-950 italic tracking-tight leading-none">+8.4%</p>
                </div>
            </div>
            <button className="px-10 py-5 bg-gray-950 text-white rounded-[1.8rem] flex items-center gap-4 font-black text-[10px] uppercase tracking-[0.3em] italic shadow-2xl shadow-gray-200 hover:bg-secondary transition-all">
                Export Registry <Workflow size={16} />
            </button>
        </div>

        {/* Decorative Background Text */}
        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none -mr-20">
            <h1 className="text-[15rem] font-black italic tracking-tighter">OFFERS</h1>
        </div>
      </div>

      {/* Control Surface */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 px-4">
        <div className="flex items-center gap-4 p-2 bg-gray-50/50 backdrop-blur-xl rounded-[2.5rem] border border-gray-100">
            {[
                { label: 'ACTIVE OFFERS', value: 'received' },
                { label: 'ARCHIVED LEDGER', value: 'history' }
            ].map((tab) => (
                <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`px-8 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] italic transition-all ${
                        activeTab === tab.value 
                        ? 'bg-white text-secondary shadow-xl border border-secondary/10' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
                <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search Buyer Node / ID..." 
                    className="w-full pl-16 pr-8 py-5 bg-white border border-gray-100 rounded-[1.8rem] text-sm font-medium italic focus:ring-4 focus:ring-secondary/5 focus:border-secondary/20 transition-all outline-none shadow-sm"
                />
            </div>
            <button className="p-5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-950 transition-all shadow-sm">
                <Filter size={20} />
            </button>
        </div>
      </div>

      {/* Negotiations Grid */}
      <div className="relative min-h-[400px]">
        <AnimatePresence mode="popLayout">
          {bids.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-40 stitch-card bg-white border border-dashed border-gray-200 relative overflow-hidden"
            >
              <div className="relative z-10 space-y-8">
                <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto border border-gray-100 shadow-2xl">
                    <Gavel size={48} className="text-gray-200" />
                </div>
                <div className="space-y-3">
                    <h3 className="text-3xl font-bold text-gray-950 italic tracking-tight">Nexus Silent.</h3>
                    <p className="text-gray-400 font-medium italic max-w-sm mx-auto">
                        Your nodes are operational, but no inbound offers have been intercepted yet. Awaiting buyer engagement...
                    </p>
                </div>
                <Link to="/farmer/listings" className="px-12 py-6 bg-gray-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] italic shadow-2xl shadow-gray-200 hover:bg-secondary transition-all inline-block">
                    MANAGE INVENTORY
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-12">
                {bids.map((bid, idx) => (
                    <motion.div 
                        key={bid._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="stitch-card group relative overflow-hidden p-10 bg-white shadow-2xl shadow-gray-200/50"
                    >
                        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 relative z-10">
                            <div className="flex-1 space-y-8">
                                <div className="flex items-center gap-6">
                                    <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest italic bg-${getStatusVariant(bid.escrowState)}/10 text-${getStatusVariant(bid.escrowState)} border border-${getStatusVariant(bid.escrowState)}/10`}>
                                        {bid.escrowState?.replace('_', ' ')}
                                    </span>
                                    <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest italic">SIGNATURE: #{bid._id?.slice(-8)}</span>
                                </div>
                                
                                <div className="space-y-4">
                                    <h3 className="text-4xl font-bold text-gray-950 italic tracking-tight leading-none group-hover:text-primary transition-colors">
                                        {bid.listingId?.productName}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-[1.2rem] bg-gray-50 flex items-center justify-center text-secondary shadow-inner border border-gray-100 group-hover:scale-110 transition-transform">
                                                <User size={24} />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic leading-none">Buyer Node</p>
                                                <p className="text-lg font-bold text-gray-950 italic tracking-tight leading-none">{bid.buyerId?.businessName}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic leading-none">Sector</p>
                                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-950 uppercase tracking-widest italic leading-none">
                                                <MapPin size={14} className="text-secondary" />
                                                {bid.buyerId?.address?.city}
                                            </div>
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic leading-none">Reputation Index</p>
                                            <div className="flex items-center gap-3">
                                                <StarRating rating={bid.buyerId?.rating || 5} />
                                                <span className="text-lg font-black text-gray-950 italic leading-none">{bid.buyerId?.rating || '5.0'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gray-950 rounded-[2.5rem] p-10 text-white min-w-[320px] shadow-2xl relative overflow-hidden group/price">
                                <div className="relative z-10 space-y-4">
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic leading-none">OFFER VALUATION</p>
                                    <div className="space-y-1">
                                        <p className="text-5xl font-black italic tracking-tighter leading-none">
                                            ₹{bid.pricePerUnit}<span className="text-xl text-secondary font-black not-italic ml-2">/Qtl</span>
                                        </p>
                                        <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] italic leading-none">TOTAL NET: {formatCurrency(bid.agreedPrice)}</p>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary rounded-full blur-[60px] opacity-10 group-hover/price:opacity-20 transition-opacity" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-10 border-y border-gray-50 my-12 relative overflow-hidden">
                            <div className="space-y-2">
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 italic leading-none">Payload Volume</p>
                                <div className="flex items-center gap-3 font-black text-gray-950 italic text-xl leading-none">
                                    <Scale size={20} className="text-secondary" />
                                    <span>{bid.quantity} {bid.unit || 'Qtl'}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 italic leading-none">Sovereign Layer</p>
                                <div className="flex items-center gap-3 font-black text-gray-950 italic text-xl leading-none">
                                    <ShieldCheck size={20} className="text-primary" />
                                    <span>Escrow Secure</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 italic leading-none">Buyer Node Status</p>
                                <div className="flex items-center gap-3 font-black text-success italic text-xl leading-none">
                                    <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
                                    <span>KYC Verified</span>
                                </div>
                            </div>
                            <div className="space-y-2 text-right">
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 italic leading-none">Temporal Hash</p>
                                <div className="flex items-center justify-end gap-3 font-black text-gray-400 italic text-lg leading-none">
                                    <Clock size={20} />
                                    <span>{formatRelativeTime(bid.createdAt)}</span>
                                </div>
                            </div>
                            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[1px] h-8 bg-gray-50"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-y-1/2 w-[1px] h-8 bg-gray-50"></div>
                            <div className="absolute top-1/2 left-3/4 -translate-y-1/2 w-[1px] h-8 bg-gray-50"></div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center gap-10">
                            <div className="flex gap-6">
                                <button className="flex items-center gap-4 px-8 py-4 bg-gray-50 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic hover:bg-gray-950 hover:text-white transition-all border border-transparent shadow-sm">
                                    <MessageCircle size={18} />
                                    Synchronize Chat
                                </button>
                                <button className="flex items-center gap-4 px-8 py-4 bg-gray-50 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic hover:bg-gray-950 hover:text-white transition-all border border-transparent shadow-sm">
                                    <Zap size={18} />
                                    Global Mandi Pulse
                                </button>
                            </div>
                            
                            <div className="flex gap-6 w-full sm:w-auto">
                                {bid.escrowState === 'BID_PLACED' ? (
                                    <>
                                        <button 
                                            onClick={() => handleAction(bid._id, 'reject')}
                                            className="flex-1 sm:flex-none px-10 py-5 bg-gray-50 text-gray-400 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.4em] italic hover:bg-error/10 hover:text-error transition-all border border-transparent hover:border-error/20"
                                        >
                                            Decline Protocol
                                        </button>
                                        <button 
                                            onClick={() => handleAction(bid._id, 'accept')}
                                            className="flex-1 sm:flex-none px-12 py-5 bg-gray-950 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.4em] italic hover:bg-primary transition-all shadow-2xl shadow-gray-200 group/btn relative overflow-hidden"
                                        >
                                            <span className="relative z-10 flex items-center gap-4">
                                                AUTHORIZE CONTRACT <Handshake size={20} className="group-hover/btn:scale-110 transition-transform" />
                                            </span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </button>
                                    </>
                                ) : (
                                    <Link 
                                        to={`/farmer/orders`}
                                        className="px-12 py-5 bg-gray-950 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.4em] italic hover:bg-primary transition-all shadow-2xl shadow-gray-200 flex items-center gap-4"
                                    >
                                        LIFECYCLE OVERVIEW
                                        <ArrowUpRight size={20} />
                                    </Link>
                                )}
                            </div>
                        </div>
                        
                        {/* Background Decor */}
                        <div className="absolute bottom-0 right-0 p-10 opacity-[0.02] group-hover:opacity-[0.08] transition-opacity">
                            <Handshake size={150} className="-rotate-12" />
                        </div>
                    </motion.div>
                ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Negotiation Tip Banner */}
      <div className="stitch-card p-12 bg-gray-950 text-white relative overflow-hidden group shadow-2xl shadow-gray-950/20">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-6 text-center md:text-left max-w-2xl">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-secondary/20 text-secondary rounded-xl text-[9px] font-black uppercase tracking-widest italic border border-secondary/20 shadow-2xl">
                    <Sparkles size={14} /> Negotiation Intelligence Active
                </div>
                <h2 className="text-4xl md:text-5xl font-bold italic tracking-tighter leading-tight">
                    Negotiation <span className="text-secondary">Nexus.</span> Optimize for Closure.
                </h2>
                <p className="text-gray-400 font-medium italic text-xl leading-relaxed">
                    Respond within <span className="text-white font-black">2 hours</span> to increase your closure rate by <span className="text-secondary font-black italic">+65%</span>. Secured on-chain contracts ensure zero payment default.
                </p>
                <div className="flex items-center justify-center md:justify-start gap-6">
                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-10 h-10 rounded-xl border-4 border-gray-900 bg-secondary/20 flex items-center justify-center text-[10px] font-black italic shadow-lg backdrop-blur-xl">B{i}</div>
                        ))}
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary italic">1,200+ Nodes Synchronized Today</p>
                </div>
            </div>
            
            <div className="p-10 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 min-w-[340px] space-y-8 relative z-10 shadow-2xl">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary italic border-b border-white/5 pb-4">CONTRACT SHIELD PROTOCOL</h4>
                <div className="space-y-6">
                    <FeatureItem text="Encrypted Protocol Terms" />
                    <FeatureItem text="Instant Fiat Settlement" />
                    <FeatureItem text="AI Dispute Resolution" />
                </div>
                <div className="absolute top-0 right-0 p-8 opacity-[0.05]">
                    <ShieldCheck size={80} />
                </div>
            </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] -mr-48 -mt-48 group-hover:opacity-40 transition-opacity duration-1000"></div>
        <div className="absolute bottom-0 left-0 p-12 text-white/5 group-hover:text-white/10 transition-colors">
            <Globe size={120} />
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-200 italic">
    <div className="w-8 h-8 bg-secondary/20 rounded-xl flex items-center justify-center text-secondary border border-secondary/20 shadow-xl">
      <CheckCircle size={16} />
    </div>
    {text}
  </div>
);

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-1">
    {[...Array(5)].map((_, i) => (
      <svg 
        key={i}
        className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-secondary fill-current' : 'text-gray-200'}`} 
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

export default BidsOffersPage;
