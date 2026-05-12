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
  Fingerprint,
  Cpu,
  Workflow,
  Activity,
  Layers,
  Sparkles,
  ChevronDown,
  Target,
  ArrowUpRight,
  MoreHorizontal,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import buyerService from '../../services/buyerService';
import { formatCurrency, formatRelativeTime } from '../../lib/utils';
import AIGradeCard from '../../components/farmer/AIGradeCard';
import SBTBadge from '../../components/farmer/SBTBadge';
import { toast } from 'react-hot-toast';

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
    <div className="flex items-center justify-center h-[80vh] fade-in">
      <div className="text-center space-y-10">
        <div className="w-24 h-24 bg-secondary/10 rounded-[2.5rem] border border-secondary/20 flex items-center justify-center shadow-2xl relative">
            <div className="absolute inset-0 border-4 border-secondary/20 border-t-secondary rounded-[2.5rem] animate-spin"></div>
            <Cpu size={40} className="text-secondary" />
        </div>
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary italic leading-none">Asset Verification Protocol...</p>
          <p className="text-xs text-gray-400 font-medium italic leading-none">Synchronizing with Distributed Ledger...</p>
        </div>
      </div>
    </div>
  );

  if (!product) return <div className="p-40 text-center italic text-gray-400 text-2xl font-black uppercase tracking-widest">Resource context not found.</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32 fade-in">
      {/* Premium Navigation & Context */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative overflow-hidden p-4">
        <div className="space-y-6 relative z-10">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-secondary transition-all group italic">
            <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> TERMINATE SESSION
          </button>
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-secondary italic">
            <Box size={16} /> <span>COMMODITY_INDEX_ALPHA</span>
            <ChevronRight size={12} className="text-gray-200" />
            <span className="text-gray-400">NODE_ID::{id?.substring(0, 12).toUpperCase()}</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gray-950 tracking-tighter italic leading-none">
            {product.name} <span className="not-italic text-secondary">Asset.</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-6 relative z-10">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFavorite(!isFavorite)}
            className={`flex items-center gap-4 px-10 py-6 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] transition-all italic shadow-2xl ${
              isFavorite ? 'bg-error/10 text-error shadow-error/10 border border-error/10' : 'bg-white text-gray-400 border border-gray-100 hover:border-error hover:text-error hover:bg-error/5 shadow-gray-200/50'
            }`}
          >
            <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
            {isFavorite ? 'WATCHLISTED' : 'ADD_WATCHLIST'}
          </motion.button>
          <button className="p-6 bg-white rounded-[2rem] border border-gray-100 text-gray-400 hover:text-secondary hover:border-secondary transition-all shadow-2xl shadow-gray-200/50">
            <Share2 size={24} />
          </button>
        </div>

        {/* Decorative Background Text */}
        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none -mr-40 -mt-10">
            <h1 className="text-[20rem] font-black italic tracking-tighter">ASSET</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 px-4">
        {/* Intelligence Cluster (Left) */}
        <div className="lg:col-span-8 space-y-16">
          {/* Main Visual Display */}
          <div className="stitch-card p-6 bg-white relative group overflow-hidden shadow-2xl shadow-gray-200/50">
            <div className="aspect-[16/9] rounded-[3rem] overflow-hidden relative shadow-inner">
              <img src={sanitizeUrl(product.images?.[0])} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3000ms] opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent"></div>
              
              <div className="absolute top-12 left-12 flex flex-col gap-6">
                <SBTBadge id="trust-badge-premium" level="Platinum" />
                <div className="px-8 py-5 bg-white/10 backdrop-blur-3xl rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-white flex items-center gap-4 shadow-2xl border border-white/10 italic">
                  <Award size={20} className="text-secondary" /> AI_GRADE_VERIFIED: {product.aiGrade}
                </div>
              </div>

              <div className="absolute bottom-12 left-12 flex items-center gap-6">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-3xl rounded-[1.5rem] flex items-center justify-center text-white border border-white/10 shadow-2xl">
                  <TrendingUp size={32} className="text-secondary" />
                </div>
                <div className="text-white space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-60 italic leading-none">SUPPLY_TELEMETRY</p>
                  <p className="text-2xl font-black tracking-tight italic leading-none uppercase">Highly Liquid Node</p>
                </div>
              </div>
            </div>
            
            {/* Asset Overlay Scanners */}
            <div className="absolute right-12 top-12 opacity-20 pointer-events-none">
                <Scan size={100} className="text-white" />
            </div>
          </div>

          {/* Neural Metrics Matrix */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'MOISTURE_SIG', val: `${product.moisture}%`, icon: Zap, color: 'secondary' },
              { label: 'PROTEIN_DENSITY', val: `${product.protein}%`, icon: Activity, color: 'warning' },
              { label: 'IMPURITY_COEFF', val: `${product.foreignMatter}%`, icon: ShieldAlert, color: 'error' },
              { label: 'LUSTER_PROTOCOL', val: 'PREMIUM', icon: Sparkles, color: 'primary' }
            ].map((spec, i) => (
              <div key={i} className="stitch-card p-10 bg-white border border-gray-50 shadow-xl shadow-gray-200/50 flex flex-col items-center text-center space-y-6 group hover:translate-y-[-10px] transition-all duration-700">
                <div className={`w-16 h-16 rounded-[1.8rem] bg-gray-50 text-gray-300 flex items-center justify-center shadow-inner group-hover:bg-${spec.color}/10 group-hover:text-${spec.color} transition-all duration-500`}>
                  <spec.icon size={28} className="stroke-[1.5]" />
                </div>
                <div className="space-y-1.5">
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400 italic leading-none">{spec.label}</p>
                  <p className="text-2xl font-black text-gray-950 tracking-tighter italic leading-none">{spec.val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Institutional Narrative */}
          <div className="stitch-card p-16 bg-white space-y-12 relative overflow-hidden group shadow-2xl shadow-gray-200/50">
            <div className="relative z-10 space-y-10">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-gray-950 rounded-2xl text-secondary shadow-2xl group-hover:rotate-6 transition-transform duration-700">
                    <Database size={28} />
                </div>
                <div className="space-y-1">
                    <h3 className="text-3xl font-bold text-gray-950 italic tracking-tight uppercase leading-none">Asset <span className="not-italic text-secondary">Telemetry.</span></h3>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] italic leading-none">Deep metadata extraction complete</p>
                </div>
              </div>
              <p className="text-gray-500 font-medium leading-relaxed text-2xl italic max-w-4xl border-l-4 border-gray-50 pl-10 py-4">
                "{product.description}"
              </p>
              
              <div className="grid md:grid-cols-3 gap-16 pt-12 border-t border-gray-50">
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 italic flex items-center gap-3"><Clock size={16} /> HARVEST_CYCLE</p>
                  <p className="text-2xl font-black text-gray-950 italic tracking-tighter leading-none">{new Date(product.harvestDate).toLocaleDateString([], { month: 'long', year: 'numeric' }).toUpperCase()}</p>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 italic flex items-center gap-3"><MapPin size={16} /> GEO_COORDINATES</p>
                  <p className="text-2xl font-black text-gray-950 italic tracking-tighter leading-none uppercase">{product.location}</p>
                </div>
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 italic flex items-center gap-3"><Truck size={16} /> LOGISTICS_HUB</p>
                  <p className="text-2xl font-black text-gray-950 italic tracking-tighter leading-none uppercase">{product.leadTime} WINDOW</p>
                </div>
              </div>
            </div>
            {/* Background Branding */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 group-hover:bg-secondary/10 transition-colors"></div>
            <div className="absolute bottom-0 left-0 p-12 text-gray-50 opacity-[0.03] pointer-events-none">
                <Cpu size={250} />
            </div>
          </div>

          {/* Secure Settlement Protocols */}
          <div className="stitch-card p-16 bg-gray-950 text-white relative overflow-hidden shadow-2xl group shadow-gray-950/20">
            <div className="relative z-10 space-y-16">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-white/5 backdrop-blur-3xl rounded-[2rem] flex items-center justify-center text-secondary shadow-2xl border border-white/5 group-hover:rotate-12 transition-transform duration-1000">
                    <ShieldCheck size={40} className="stroke-[1.5]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-4xl font-bold italic tracking-tight leading-none uppercase">SK.VAULT <span className="text-secondary not-italic">PROTOCOL.</span></h3>
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em] italic leading-none">Institutional Multi-Sig Settlement Infrastructure Active</p>
                  </div>
                </div>
                <div className="px-8 py-4 bg-secondary/10 rounded-2xl border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-[0.4em] italic shadow-2xl shadow-secondary/5">
                  POLYGON_ZKEVM_V2
                </div>
              </div>
              
              <div className="grid md:grid-cols-4 gap-12">
                {[
                  { title: 'BID_SIG', desc: 'Immutable intent binding' },
                  { title: 'VAULT_LOCK', desc: 'Cryptographic proof of funds' },
                  { title: 'QUALITY_GATE', desc: 'Neural asset verification' },
                  { title: 'FINAL_SYNC', desc: 'Atomic smart release' }
                ].map((step, i) => (
                  <div key={i} className="space-y-6 group/step relative">
                    <p className="text-6xl font-black text-white/5 group-hover/step:text-secondary/10 transition-colors italic leading-none">{i + 1}</p>
                    <div className="space-y-2 relative z-10">
                        <h4 className="font-black text-[11px] uppercase tracking-[0.4em] text-white italic">{step.title}</h4>
                        <p className="text-xs text-white/40 font-medium italic leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Background Decor */}
            <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
            <div className="absolute top-0 right-0 p-12 text-white/5 pointer-events-none">
                <Workflow size={200} />
            </div>
          </div>
        </div>

        {/* Transaction Terminal (Right) */}
        <div className="lg:col-span-4 space-y-12">
          {/* Main Bidding Engine */}
          <div className="stitch-card p-12 bg-white border border-gray-100 shadow-2xl shadow-gray-200/50 sticky top-12 overflow-hidden group/terminal">
            <div className="space-y-10 relative z-10">
              {/* Price Display */}
              <div className="pb-10 border-b border-gray-50 flex justify-between items-end relative overflow-hidden">
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300 italic leading-none">MARKET_BENCHMARK</p>
                  <div className="flex items-baseline gap-3">
                    <h2 className="text-6xl font-black text-gray-950 tracking-tighter italic leading-none">₹{product.price}</h2>
                    <span className="text-gray-400 font-black uppercase text-[10px] tracking-[0.3em] italic">/ {product.unit}</span>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex items-center justify-end gap-2 text-success font-black text-[11px] uppercase tracking-widest italic">
                    <TrendingUp size={14} /> +2.4%
                  </div>
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] italic leading-none">WEEKLY_DELTA</p>
                </div>
                
                {/* Scanline Effect */}
                <div className="absolute inset-0 bg-scanline opacity-[0.02] pointer-events-none"></div>
              </div>
              
              {/* Inventory Meta */}
              <div className="grid grid-cols-2 gap-8">
                <div className="p-8 bg-gray-50/50 rounded-[2rem] border border-gray-50 flex flex-col justify-between group/meta hover:bg-white hover:shadow-xl transition-all duration-500">
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400 italic leading-none mb-4">LIQUID_INDEX</p>
                  <p className="text-2xl font-black text-gray-950 tracking-tighter italic leading-none group-hover:text-secondary transition-colors">
                    {product.quantity} <span className="text-[10px] not-italic text-gray-300">{product.unit}</span>
                  </p>
                </div>
                <div className="p-8 bg-gray-50/50 rounded-[2rem] border border-gray-50 flex flex-col justify-between group/meta hover:bg-white hover:shadow-xl transition-all duration-500">
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400 italic leading-none mb-4">MIN_THRESHOLD</p>
                  <p className="text-2xl font-black text-gray-950 tracking-tighter italic leading-none group-hover:text-warning transition-colors">
                    {product.minOrder} <span className="text-[10px] not-italic text-gray-300">{product.unit}</span>
                  </p>
                </div>
              </div>

              {/* Bidding Control Interface */}
              <div className="space-y-8 pt-4">
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-950 flex items-center gap-4 italic">
                    <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                    NEGOTIATION_TERMINAL
                  </h3>
                  <button className="text-[9px] font-black uppercase tracking-[0.4em] text-secondary hover:underline underline-offset-4 flex items-center gap-3 italic transition-all">
                    <Info size={14} /> LIVE_ANALYSIS
                  </button>
                </div>
                
                <form onSubmit={handlePlaceBid} className="space-y-6">
                  <div className="relative group/field">
                    <div className="absolute left-8 top-1/2 -translate-y-1/2 font-black text-gray-200 text-2xl group-focus-within/field:text-secondary transition-colors italic leading-none">₹</div>
                    <input 
                      type="number" 
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder="SET_BID_VALUE"
                      className="w-full pl-16 pr-8 py-10 bg-gray-50 border border-transparent rounded-[2.5rem] focus:ring-8 focus:ring-secondary/5 focus:bg-white focus:border-secondary/20 transition-all font-black text-4xl text-gray-950 placeholder:text-gray-100 italic outline-none"
                    />
                  </div>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-8 bg-secondary text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.5em] italic hover:bg-secondary-600 shadow-[0_20px_50px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-4 relative overflow-hidden group/btn"
                  >
                    <span className="relative z-10 flex items-center gap-4">CONFIRM_NEGOTIATION <Gavel size={20} /></span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity"></div>
                  </motion.button>
                </form>
                
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-50"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.6em]">
                    <span className="bg-white px-6 text-gray-200 italic">SYSTEM_BYPASS</span>
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-8 bg-gray-950 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.5em] italic hover:bg-black transition-all flex items-center justify-center gap-4 shadow-2xl shadow-gray-950/20 group/instant"
                >
                  <Database size={18} className="text-secondary group-hover:rotate-12 transition-transform" /> INSTANT_SETTLEMENT
                </motion.button>
                
                <div className="flex items-center justify-center gap-4 text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] pt-6 italic leading-none">
                  <div className="w-1.5 h-1.5 bg-error rounded-full animate-ping"></div>
                  TERMINAL_CLOSURE_V3: 2D 14H 25M
                </div>
              </div>

              {/* Tape Feed (Live Market Data) */}
              <div className="mt-16 space-y-10">
                <div className="flex items-center gap-4 px-2">
                    <Activity size={18} className="text-secondary" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 italic">Live_Bidding_Tape</h4>
                </div>
                <div className="space-y-5">
                  {[
                    { name: 'AGRO-CORP-IX', qty: '100 QTL', price: '₹2,150', time: '2M_AGO', isUser: true },
                    { name: 'V.P. FOODS_X', qty: '200 QTL', price: '₹2,120', time: '1H_AGO' },
                    { name: 'S.T. EXPORTS_01', qty: '150 QTL', price: '₹2,100', time: '4H_AGO' }
                  ].map((bid, i) => (
                    <div key={i} className={`p-8 rounded-[2rem] flex items-center justify-between transition-all group/bid relative overflow-hidden ${bid.isUser ? 'bg-secondary/5 border border-secondary/10 shadow-xl' : 'bg-gray-50/50 border border-transparent hover:bg-white hover:shadow-lg'}`}>
                      <div className="relative z-10 space-y-2">
                        <p className="font-black text-[11px] text-gray-950 italic tracking-tight flex items-center gap-3">
                            {bid.name} {bid.isUser && <span className="px-2 py-0.5 bg-secondary text-white rounded-md text-[8px] not-italic">ME</span>}
                        </p>
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] italic leading-none">{bid.qty}</p>
                      </div>
                      <div className="relative z-10 text-right space-y-2">
                        <p className="font-black text-xl text-gray-950 tracking-tighter italic leading-none">{bid.price}</p>
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] italic leading-none">{bid.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Top Border Glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-40"></div>
          </div>

          {/* Supplier Identity Card */}
          <div className="stitch-card p-12 bg-white border border-gray-50 shadow-2xl shadow-gray-200/50 space-y-10 group/supplier">
            <div className="flex items-center gap-8">
              <div className="w-24 h-24 rounded-[2.5rem] bg-secondary/5 flex items-center justify-center text-secondary font-black text-4xl shadow-inner border border-secondary/10 relative group-hover:scale-105 transition-transform duration-700">
                {product.farmerName?.[0]}
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full border-4 border-white flex items-center justify-center text-white shadow-2xl">
                  <ShieldCheck size={16} />
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-black text-gray-950 tracking-tighter italic leading-none uppercase">{product.farmerName}</h4>
                <div className="flex items-center gap-3 text-warning font-black text-[10px] uppercase tracking-[0.4em] italic">
                  <Star size={16} className="fill-current" />
                  {product.farmerRating} TRUST_SCORE
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10 py-4 border-y border-gray-50">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 italic leading-none">PROTOCOL_DEALS</p>
                <p className="font-black text-gray-950 text-2xl italic tracking-tighter leading-none">{product.totalSales}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 italic leading-none">PUNCTUALITY</p>
                <p className="font-black text-primary text-2xl italic tracking-tighter leading-none">{product.onTimeDelivery}</p>
              </div>
            </div>

            <div className="flex flex-col gap-5 pt-4">
              <button className="w-full py-6 bg-white border border-gray-100 text-gray-950 rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.4em] italic hover:bg-gray-50 hover:border-secondary/20 transition-all flex items-center justify-center gap-4 shadow-sm">
                <MessageCircle size={20} className="text-secondary" /> SECURE_RELIANCE_RELAY
              </button>
              <button className="w-full py-6 bg-gray-50 text-gray-400 rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.4em] italic hover:bg-gray-100 hover:text-gray-950 transition-all flex items-center justify-center gap-4 group/meta">
                <Fingerprint size={20} className="group-hover:text-secondary transition-colors" /> VIEW_NODE_METADATA
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailBidPage;
