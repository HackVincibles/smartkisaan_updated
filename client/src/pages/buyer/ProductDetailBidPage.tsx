import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Scale, 
  IndianRupee, 
  Shield, 
  Clock, 
  CheckCircle,
  Truck,
  MessageCircle,
  Gavel,
  Star,
  Heart,
  Share2,
  AlertCircle,
  Award,
  ChevronRight,
  TrendingUp,
  Database,
  Info,
  ShieldCheck,
  Zap,
  Lock,
  Box,
  Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import buyerService from '../../services/buyerService';
import { formatCurrency, formatRelativeTime } from '../../lib/utils';
import AIGradeCard from '../../components/farmer/AIGradeCard';
import SBTBadge from '../../components/farmer/SBTBadge';
import toast from 'react-hot-toast';

const ProductDetailBidPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  const sanitizeUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/') || url.startsWith('data:')) {
      return url;
    }
    return '';
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await buyerService.getProductById(id);
      setProduct(response.data.product);
    } catch (error) {
      console.error('Failed to fetch product details:', error);
      // Mock data for premium demo
      setProduct({
        id: id,
        name: 'Organic Sharbati Wheat',
        farmerName: 'Vikas Choudhary',
        farmerId: 'farmer-552',
        location: 'Sehore, Madhya Pradesh',
        price: 2850,
        unit: 'Quintal',
        quantity: 850,
        minOrder: 100,
        aiGrade: 'A+',
        description: 'Premium Sharbati Wheat, known as the "Golden Grain" of India. Grown in the Sehore region using traditional organic methods. This batch features high protein content, exceptional luster, and a sweet taste profile. Lab-tested and AI-verified for zero adulteration.',
        harvestDate: new Date(Date.now() - 86400000 * 10),
        images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1200&q=80'],
        moisture: 10.5,
        purity: 99.8,
        protein: 13.2,
        foreignMatter: 0.2,
        damage: 0.1,
        farmerRating: 4.9,
        totalSales: 412,
        onTimeDelivery: '99.5%',
        productsListed: 12,
        leadTime: '3 - 5 Days'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bidAmount) return;

    try {
      await buyerService.placeBid(id, { amount: parseFloat(bidAmount) });
      toast.success('Negotiation Sequence Initiated');
      setBidAmount('');
    } catch (error) {
      toast.error('Connection to Negotiation Node Failed');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[70vh] fade-in">
      <div className="text-center space-y-6">
        <div className="w-24 h-24 border-4 border-secondary-50 border-t-secondary rounded-[2rem] animate-spin mx-auto shadow-2xl"></div>
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-secondary italic">Asset Verification Protocol...</p>
          <p className="text-xs text-gray-400 font-medium italic">Connecting to distributed ledger...</p>
        </div>
      </div>
    </div>
  );

  if (!product) return <div className="p-20 text-center italic text-gray-400">Resource context not found.</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 fade-in">
      {/* Top Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="space-y-4">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-secondary transition-colors group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Exit Terminal
          </button>
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-secondary">
            <Box size={14} /> <span>SK-COMMODITY-INDEX</span>
            <ChevronRight size={10} className="text-gray-300" />
            <span className="text-gray-400">Node #{id?.substring(0, 8)}</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight italic leading-none">
            {product.name}. <span className="not-italic text-secondary">Asset.</span>
          </h1>
        </div>
        
        <div className="flex gap-4">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFavorite(!isFavorite)}
            className={`flex items-center gap-3 px-8 py-5 rounded-[1.5rem] font-bold text-[10px] uppercase tracking-widest transition-all shadow-xl ${
              isFavorite ? 'bg-error/10 text-error shadow-error/10' : 'bg-white text-gray-400 border border-gray-100 hover:border-error hover:text-error'
            }`}
          >
            <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
            {isFavorite ? 'Watchlisted' : 'Watchlist Asset'}
          </motion.button>
          <button className="p-5 bg-white rounded-[1.5rem] border border-gray-100 text-gray-400 hover:text-secondary hover:border-secondary transition-all shadow-xl">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-12">
          {/* Main Visual */}
          <div className="stitch-card p-4 bg-white relative group overflow-hidden">
            <div className="aspect-[16/9] rounded-[2.5rem] overflow-hidden relative shadow-2xl shadow-gray-200">
              <img src={sanitizeUrl(product.images?.[0])} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent"></div>
              <div className="absolute top-10 left-10 flex flex-col gap-4">
                <SBTBadge id="trust-badge" level="Platinum" />
                <div className="px-6 py-4 bg-white/90 backdrop-blur-xl rounded-2xl text-[10px] font-bold uppercase tracking-widest text-success flex items-center gap-3 shadow-2xl border border-white/50">
                  <Award size={18} /> AI-Grade: {product.aiGrade}
                </div>
              </div>
              <div className="absolute bottom-10 left-10 flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center text-white border border-white/10">
                  <TrendingUp size={24} />
                </div>
                <div className="text-white">
                  <p className="text-[9px] font-bold uppercase tracking-widest opacity-80">Supply Index</p>
                  <p className="text-sm font-bold tracking-tight italic">Highly Liquid</p>
                </div>
              </div>
            </div>
            {/* Visual Navigation Overlay */}
            <div className="absolute right-12 bottom-12 flex gap-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === 1 ? 'bg-white w-6' : 'bg-white/40'}`}></div>
              ))}
            </div>
          </div>

          {/* Tech Specs Matrix */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Moisture Protocol', val: `${product.moisture}%`, icon: <Zap size={20} />, color: 'secondary' },
              { label: 'Protein Density', val: `${product.protein}%`, icon: <Activity size={20} />, color: 'warning' },
              { label: 'Foreign Matter', val: `${product.foreignMatter}%`, icon: <Shield size={20} />, color: 'error' },
              { label: 'Luster Score', val: 'Premium', icon: <Star size={20} />, color: 'success' }
            ].map((spec, i) => (
              <div key={i} className="stitch-card p-8 bg-white border-none shadow-xl shadow-gray-200/50 flex flex-col items-center text-center space-y-4 hover:translate-y-[-4px] transition-transform">
                <div className={`w-12 h-12 rounded-xl bg-${spec.color}/10 text-${spec.color} flex items-center justify-center shadow-lg`}>
                  {spec.icon}
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1 italic">{spec.label}</p>
                  <p className="text-xl font-bold text-gray-900 tracking-tight">{spec.val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Narrative */}
          <div className="stitch-card p-12 bg-white space-y-10 relative overflow-hidden">
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-1.5 h-8 bg-secondary rounded-full"></div>
                <h3 className="text-2xl font-bold text-gray-900 italic tracking-tight uppercase">Asset Narrative</h3>
              </div>
              <p className="text-gray-500 font-medium leading-relaxed text-xl italic max-w-3xl">
                "{product.description}"
              </p>
              
              <div className="grid md:grid-cols-3 gap-10 pt-10 border-t border-gray-50">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2"><Clock size={12} /> Origin Protocol</p>
                  <p className="font-bold text-gray-900 italic tracking-tight">{new Date(product.harvestDate).toLocaleDateString([], { month: 'long', year: 'numeric' })} Harvest</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2"><MapPin size={12} /> Geo-Signature</p>
                  <p className="font-bold text-gray-900 italic tracking-tight">{product.location}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2"><Truck size={12} /> Logistics Rail</p>
                  <p className="font-bold text-gray-900 italic tracking-tight">{product.leadTime} Fulfillment</p>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
          </div>

          {/* Secure Escrow Protocol */}
          <div className="bg-gray-900 rounded-[3rem] p-12 md:p-16 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 space-y-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-secondary shadow-2xl border border-white/10">
                    <ShieldCheck size={32} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold tracking-tight italic leading-none">SmartKissan <span className="text-secondary not-italic">Vault.</span></h3>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                      <Lock size={12} /> Multi-Sig Escrow Active
                    </p>
                  </div>
                </div>
                <div className="px-6 py-3 bg-secondary/20 rounded-xl border border-secondary/30 text-secondary text-[10px] font-bold uppercase tracking-widest">
                  Polygon-ZKEVM Protocol
                </div>
              </div>
              
              <div className="grid md:grid-cols-4 gap-10">
                {[
                  { title: 'Bid Signature', desc: 'Immutable Intent' },
                  { title: 'Vault Lock', desc: 'Proof of Funds' },
                  { title: 'Quality Gate', desc: 'AI Verification' },
                  { title: 'Final Release', desc: 'Smart Release' }
                ].map((step, i) => (
                  <div key={i} className="space-y-4 group">
                    <p className="text-5xl font-bold text-white/5 group-hover:text-secondary/20 transition-colors">{i + 1}</p>
                    <h4 className="font-bold text-[11px] uppercase tracking-widest text-white">{step.title}</h4>
                    <p className="text-xs text-gray-400 font-medium italic leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]"></div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-10">
          {/* Terminal Transaction Card */}
          <div className="stitch-card p-10 bg-white border-none shadow-2xl shadow-gray-200/50 sticky top-10 overflow-hidden">
            <div className="space-y-8 relative z-10">
              <div className="pb-8 border-b border-gray-50 flex justify-between items-end">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 italic">Market Benchmark</p>
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-5xl font-bold text-gray-900 tracking-tighter italic">₹{product.price}</h2>
                    <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">/ {product.unit}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-success flex items-center justify-end gap-1">
                    <TrendingUp size={10} /> +2.4%
                  </p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Weekly Trend</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2 italic">Liquid Inventory</p>
                  <p className="font-bold text-gray-900 tracking-tight italic">{product.quantity} <span className="text-[10px] not-italic text-gray-400">{product.unit}</span></p>
                </div>
                <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2 italic">Minimum Threshold</p>
                  <p className="font-bold text-gray-900 tracking-tight italic">{product.minOrder} <span className="text-[10px] not-italic text-gray-400">{product.unit}</span></p>
                </div>
              </div>

              {/* Bidding Terminal */}
              <div className="space-y-6 pt-4">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-900 flex items-center gap-2">
                    <Gavel size={14} className="text-secondary" /> Negotiate Node
                  </h3>
                  <button className="text-[9px] font-bold uppercase tracking-widest text-secondary hover:underline flex items-center gap-1 italic">
                    <Info size={10} /> Analysis
                  </button>
                </div>
                
                <form onSubmit={handlePlaceBid} className="space-y-4">
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-gray-300 group-focus-within:text-secondary transition-colors">₹</div>
                    <input 
                      type="number" 
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder="Enter Bid Amount"
                      className="w-full pl-12 pr-6 py-6 bg-gray-50 border-none rounded-[1.5rem] focus:ring-4 focus:ring-secondary/5 font-bold text-2xl text-gray-900 placeholder:text-gray-200 italic"
                    />
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-6 bg-secondary text-white rounded-[1.5rem] font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-secondary-600 shadow-2xl shadow-secondary/20 transition-all flex items-center justify-center gap-3"
                  >
                    Confirm Negotiation
                  </motion.button>
                </form>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-50"></div>
                  </div>
                  <div className="relative flex justify-center text-[9px] font-bold uppercase tracking-widest">
                    <span className="bg-white px-4 text-gray-300 italic">Protocol Bypass</span>
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-6 bg-gray-900 text-white rounded-[1.5rem] font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-3 shadow-2xl"
                >
                  <Database size={16} /> Instant Settlement
                </motion.button>
                
                <div className="flex items-center justify-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] pt-4 italic">
                  <div className="w-1.5 h-1.5 bg-error rounded-full animate-pulse"></div>
                  Terminal Closes: 2d 14h 25m
                </div>
              </div>

              {/* Tape Feed (Recent Bids) */}
              <div className="mt-12 space-y-6">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1 italic border-l-2 border-secondary pl-3">Live Bidding Tape</h4>
                <div className="space-y-4">
                  {[
                    { name: 'AGRO-CORP', qty: '100 Qtl', price: '₹2,150', time: '2m ago', isUser: true },
                    { name: 'V.P. FOODS', qty: '200 Qtl', price: '₹2,120', time: '1h ago' },
                    { name: 'S.T. EXPORTS', qty: '150 Qtl', price: '₹2,100', time: '4h ago' }
                  ].map((bid, i) => (
                    <div key={i} className={`p-6 rounded-2xl flex items-center justify-between transition-all hover:bg-gray-50 border-l-4 ${bid.isUser ? 'bg-secondary/5 border-secondary shadow-lg' : 'bg-gray-50/50 border-gray-100'}`}>
                      <div>
                        <p className="font-bold text-xs text-gray-900 italic">{bid.name} {bid.isUser && '(ME)'}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{bid.qty}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-gray-900 tracking-tight italic">{bid.price}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{bid.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary/0 via-secondary to-secondary/0"></div>
          </div>

          {/* Supplier Protocol */}
          <div className="stitch-card p-10 bg-white border-none shadow-xl shadow-gray-200/50 space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-[2rem] bg-secondary/5 flex items-center justify-center text-secondary font-bold text-3xl shadow-inner border border-secondary/10 relative">
                {product.farmerName?.[0]}
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-success rounded-full border-4 border-white flex items-center justify-center text-white">
                  <ShieldCheck size={14} />
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-gray-900 tracking-tight italic leading-tight">{product.farmerName}</h4>
                <div className="flex items-center gap-2 text-warning font-bold text-[10px] uppercase tracking-widest">
                  <Star size={14} className="fill-current" />
                  {product.farmerRating} Trust Index
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 py-2">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 italic">Protocol Deals</p>
                <p className="font-bold text-gray-900 text-lg italic tracking-tight">{product.totalSales}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 italic">Punctuality Score</p>
                <p className="font-bold text-success text-lg italic tracking-tight">{product.onTimeDelivery}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button className="w-full py-5 bg-white border border-gray-100 text-gray-600 rounded-[1.2rem] font-bold text-[10px] uppercase tracking-widest hover:border-secondary hover:text-secondary transition-all flex items-center justify-center gap-3">
                <MessageCircle size={18} /> Secure Message
              </button>
              <button className="w-full py-5 bg-gray-50 text-gray-400 rounded-[1.2rem] font-bold text-[10px] uppercase tracking-widest hover:bg-gray-100 hover:text-gray-900 transition-all flex items-center justify-center gap-3 italic">
                <Fingerprint size={18} /> View Supplier Meta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailBidPage;
