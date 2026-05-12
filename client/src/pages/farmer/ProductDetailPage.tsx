import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Scale, 
  IndianRupee, 
  Shield, 
  Clock, 
  Eye, 
  Gavel,
  MessageCircle,
  FileText,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Target,
  Package,
  Workflow,
  Cpu,
  Globe,
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  Activity,
  Layers,
  ArrowUpRight,
  Handshake,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
// @ts-ignore
import farmerService from '../../services/farmerService';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import AIGradeCard from '../../components/farmer/AIGradeCard';
import SBTBadge from '../../components/farmer/SBTBadge';
import { toast } from 'react-hot-toast';
import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from 'framer-motion';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const sanitizeUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/') || url.startsWith('data:')) {
      return url;
    }
    return '';
  };

  useEffect(() => {
    fetchListingDetails();
  }, [id]);

  const fetchListingDetails = async () => {
    try {
      setLoading(true);
      const response = await farmerService.getListingById(id);
      const data = response.data.listing || response.data;
      setListing(data);
      
      // Simulating bids for now - in production this comes from the backend
      setBids([
        { id: '1', buyerName: 'AgriCorp Pvt Ltd', amount: 2100, quantity: 50, status: 'pending', date: new Date().toISOString() },
        { id: '2', buyerName: 'Suresh Trading', amount: 2050, quantity: 50, status: 'rejected', date: new Date(Date.now() - 86400000).toISOString() }
      ]);
    } catch (error) {
      console.error('Failed to fetch listing details:', error);
      toast.error('Asset Pulse Lost');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBid = async (bidId: string) => {
    try {
      await farmerService.acceptBid(bidId);
      toast.success('Protocol Executed: Bid Accepted');
      fetchListingDetails();
    } catch (error) {
      toast.error('Authorization Failed: Accept Protocol Error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh] fade-in">
        <div className="text-center space-y-8">
            <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] border border-primary/20 flex items-center justify-center mx-auto shadow-2xl">
                <Workflow className="text-primary animate-spin" size={40} />
            </div>
            <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary italic leading-none">Syncing Asset Node Alpha...</p>
                <p className="text-xs text-gray-400 font-medium italic leading-none">Scanning Quality Metadata...</p>
            </div>
        </div>
      </div>
    );
  }

  if (!listing) return (
    <div className="flex items-center justify-center h-[60vh] fade-in">
        <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto text-gray-200">
                <Package size={40} />
            </div>
            <p className="text-xl font-bold italic text-gray-400">Node Not Found in Registry</p>
            <button onClick={() => navigate(-1)} className="px-8 py-4 bg-gray-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] italic">RETURN TO HUB</button>
        </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32 fade-in">
      {/* Navigation Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 px-4">
        <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] italic text-gray-400 hover:text-gray-950 transition-colors"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-2 transition-transform" /> BACK TO INVENTORY
        </button>
        <div className="flex gap-6 w-full md:w-auto">
          <Link 
            to={`/farmer/listings/edit/${id}`} 
            className="flex-1 md:flex-none px-10 py-5 bg-white border border-gray-100 text-gray-950 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] italic shadow-sm hover:shadow-xl hover:border-primary/20 transition-all text-center"
          >
            EDIT PARAMS
          </Link>
          <button className="flex-1 md:flex-none px-10 py-5 bg-gray-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] italic shadow-2xl shadow-gray-200 hover:bg-error transition-all">
            DECOMMISSION NODE
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 px-4">
        {/* Main Intelligence Cluster */}
        <div className="lg:col-span-8 space-y-12">
          <div className="stitch-card overflow-hidden bg-white shadow-2xl shadow-gray-200/50">
            <div className="aspect-[21/10] bg-gray-950 relative overflow-hidden group/hero">
              {listing.images?.[0] ? (
                <img src={sanitizeUrl(listing.images[0])} alt={listing.productName} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-800 bg-gray-900">
                  <Package size={80} className="opacity-10" />
                </div>
              )}
              
              <div className="absolute top-8 left-8">
                <SBTBadge badge={{ name: 'CERTIFIED', type: 'quality', description: 'AI VERIFIED' }} size="md" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 relative z-10">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/20 text-primary rounded-xl text-[9px] font-black uppercase tracking-widest italic border border-primary/20">
                        <Activity size={14} className="animate-pulse" /> ACTIVE PULSE
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter italic leading-none">{listing.productName}</h1>
                    <div className="flex items-center gap-4 text-white/60 font-black italic text-xs uppercase tracking-[0.2em]">
                      <MapPin className="w-4 h-4 text-primary" /> {listing.location || 'REGIONAL CLUSTER ALPHA'}
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary italic leading-none">ASKING PRICE</p>
                    <div className="flex items-end justify-end gap-2">
                        <span className="text-5xl font-black text-white italic tracking-tighter leading-none">{formatCurrency(listing.expectedPrice)}</span>
                        <span className="text-xl font-black text-white/40 italic leading-none">/{listing.unit || 'Qtl'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Scanline Effect */}
              <div className="absolute inset-0 pointer-events-none bg-scanline opacity-5"></div>
            </div>
            
            <div className="p-12 space-y-12">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-4 group/stat hover:bg-white hover:shadow-2xl transition-all duration-500">
                  <div className="w-12 h-12 bg-gray-950 text-primary rounded-xl flex items-center justify-center shadow-2xl group-hover/stat:rotate-6 transition-transform">
                    <Scale size={24} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] italic leading-none mb-2">NET PAYLOAD</p>
                    <p className="text-2xl font-black text-gray-950 italic leading-none">{listing.quantity} {listing.unit || 'Qtl'}</p>
                  </div>
                </div>
                <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-4 group/stat hover:bg-white hover:shadow-2xl transition-all duration-500">
                  <div className="w-12 h-12 bg-gray-950 text-secondary rounded-xl flex items-center justify-center shadow-2xl group-hover/stat:rotate-6 transition-transform">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] italic leading-none mb-2">MARKET INTENSITY</p>
                    <p className="text-2xl font-black text-gray-950 italic leading-none">HIGH DELTA</p>
                  </div>
                </div>
                <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-4 group/stat hover:bg-white hover:shadow-2xl transition-all duration-500 hidden md:block">
                  <div className="w-12 h-12 bg-gray-950 text-tertiary rounded-xl flex items-center justify-center shadow-2xl group-hover/stat:rotate-6 transition-transform">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] italic leading-none mb-2">REGISTRY DATE</p>
                    <p className="text-2xl font-black text-gray-950 italic leading-none">{formatDateTime(listing.createdAt).split(',')[0].toUpperCase()}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border border-gray-100">
                    <FileText size={20} />
                  </div>
                  <h3 className="text-3xl font-black text-gray-950 tracking-tight italic leading-none">Asset <span className="not-italic text-primary">Specifications.</span></h3>
                </div>
                <div 
                  className="text-gray-500 leading-relaxed font-medium text-lg italic bg-gray-50/50 p-10 rounded-[2.5rem] border border-dashed border-gray-200"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(listing.description || 'NODE METADATA NOT PROVIDED.') }}
                />
              </div>
            </div>
          </div>

          {/* Bidding Nexus Surface */}
          <section className="stitch-card p-12 bg-white shadow-2xl shadow-gray-200/50 space-y-10 relative overflow-hidden">
            <div className="flex justify-between items-center relative z-10">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-gray-950 text-white rounded-2xl flex items-center justify-center shadow-2xl">
                    <Gavel size={28} />
                </div>
                <div className="space-y-1">
                    <h3 className="text-3xl font-black text-gray-950 tracking-tight italic leading-none">Negotiation <span className="not-italic text-primary">Nexus.</span></h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic leading-none">Inbound Liquidity Channels</p>
                </div>
              </div>
              <div className="px-6 py-2 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest italic border border-primary/10 shadow-sm">
                {bids.length} ACTIVE BIDS
              </div>
            </div>
            
            <div className="relative z-10">
                {bids.length === 0 ? (
                <div className="text-center py-20 space-y-6">
                    <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto text-gray-200 border border-gray-100">
                    <Gavel size={48} />
                    </div>
                    <p className="text-xl font-bold text-gray-400 italic">No inbound offers detected for this node registry yet.</p>
                </div>
                ) : (
                <div className="space-y-6">
                    {bids.map((bid, idx) => (
                    <motion.div 
                        key={bid.id} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-8 rounded-[2.5rem] bg-gray-50/50 border border-transparent hover:border-primary/10 hover:bg-white hover:shadow-2xl transition-all group/bid"
                    >
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex items-center gap-8 flex-1">
                                <div className="w-16 h-16 bg-gray-950 text-primary rounded-2xl flex items-center justify-center font-black text-2xl italic shadow-2xl group-hover/bid:rotate-6 transition-all duration-500">
                                    {bid.buyerName?.charAt(0)}
                                </div>
                                <div className="space-y-3">
                                    <p className="font-black text-gray-950 text-2xl italic tracking-tight leading-none group-hover/bid:text-primary transition-colors">{bid.buyerName}</p>
                                    <div className="flex flex-wrap items-center gap-6">
                                        <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic leading-none">
                                            <Scale size={14} className="text-secondary" /> {bid.quantity} {listing.unit || 'Qtl'}
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic leading-none">
                                            <Clock size={14} /> {formatDateTime(bid.date).toUpperCase()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-10">
                                <div className="text-right space-y-2">
                                    <p className="text-3xl font-black text-primary italic tracking-tighter leading-none">{formatCurrency(bid.amount)}<span className="text-sm not-italic text-gray-300 ml-1">/{listing.unit || 'Qtl'}</span></p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic leading-none">TOTAL VALUE: {formatCurrency(bid.amount * bid.quantity)}</p>
                                </div>
                                <div className="flex gap-4 opacity-0 group-hover/bid:opacity-100 transition-all">
                                    <button className="w-14 h-14 rounded-2xl bg-white text-gray-400 flex items-center justify-center hover:bg-gray-950 hover:text-white border border-gray-100 shadow-sm transition-all">
                                        <MessageCircle size={24} />
                                    </button>
                                    <button 
                                        onClick={() => handleAcceptBid(bid.id)}
                                        className="px-8 py-4 bg-gray-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] italic hover:bg-primary transition-all shadow-2xl shadow-gray-200"
                                    >
                                        AUTHORIZE
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    ))}
                </div>
                )}
            </div>

            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                <Handshake size={200} className="-rotate-12" />
            </div>
          </section>
        </div>

        {/* Intelligence Sidebar */}
        <div className="lg:col-span-4 space-y-12">
          <AIGradeCard 
            grade={listing.aiGrade || 'A'}
            qualityMetrics={{
              moisture: listing.moisture || '12.5%',
              purity: listing.purity || '98%',
              protein: listing.protein || '11.2%',
              size: '8.5mm'
            }}
            pricePrediction={{
              estimatedPrice: listing.expectedPrice,
              minPrice: listing.expectedPrice * 0.95,
              maxPrice: listing.expectedPrice * 1.05,
              confidence: 92,
              bestTimeframe: 'NOW'
            }}
          />

          <div className="stitch-card p-10 space-y-10 bg-white shadow-2xl shadow-gray-200/50 group overflow-hidden">
            <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-gray-950 text-white rounded-2xl flex items-center justify-center shadow-2xl group-hover:rotate-6 transition-all duration-700">
                    <BarChart3 size={28} />
                </div>
                <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-gray-950 italic tracking-tight leading-none">Market <span className="not-italic text-primary">Performance.</span></h3>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic leading-none">Real-time engagement telemetry</p>
                </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center justify-between group/perf">
                <div className="flex items-center gap-4 text-gray-500">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover/perf:bg-primary/10 group-hover/perf:text-primary transition-colors">
                    <Eye size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest italic">Platform Views</span>
                </div>
                <span className="text-xl font-black text-gray-950 italic tracking-tighter">{listing.views || 142}</span>
              </div>
              <div className="flex items-center justify-between group/perf">
                <div className="flex items-center gap-4 text-gray-500">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover/perf:bg-primary/10 group-hover/perf:text-primary transition-colors">
                    <Gavel size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest italic">Bids Synchronized</span>
                </div>
                <span className="text-xl font-black text-gray-950 italic tracking-tighter">{bids.length}</span>
              </div>
              <div className="flex items-center justify-between group/perf">
                <div className="flex items-center gap-4 text-gray-500">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover/perf:bg-primary/10 group-hover/perf:text-primary transition-colors">
                    <TrendingUp size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest italic">Node Velocity</span>
                </div>
                <span className="text-xl font-black text-primary italic tracking-tighter">8.4%</span>
              </div>
            </div>
            
            <div className="pt-8 border-t border-gray-50">
              <div className="bg-primary/5 rounded-[1.8rem] p-8 flex items-start gap-5 group/ai border border-primary/10 relative overflow-hidden">
                <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center shrink-0 shadow-2xl relative z-10">
                  <Target size={24} />
                </div>
                <div className="space-y-2 relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic leading-none">AI INSIGHT</p>
                  <p className="text-sm text-gray-600 font-bold italic leading-relaxed">High-intensity demand detected for <span className="text-gray-950">{listing.productName}</span> in nearby hub clusters.</p>
                </div>
                <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover/ai:opacity-[0.15] transition-opacity">
                    <Zap size={60} />
                </div>
              </div>
            </div>
          </div>

          <div className="stitch-card p-12 bg-gray-950 text-white space-y-8 relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4 text-primary">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/20 shadow-2xl">
                    <ShieldCheck size={24} />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] italic">ESCROW PROTECTED</h4>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed font-medium italic">
                All bids on <span className="text-white font-black">Smart-Kissan</span> are backed by blockchain-verified sovereign deposits. Payment is guaranteed upon successful logistical verification.
              </p>
              <div className="pt-4">
                <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary italic hover:text-white transition-colors group/btn">
                    PROTOCOL DETAILS <ChevronRight size={14} className="group-hover/btn:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] group-hover:opacity-30 transition-opacity duration-1000"></div>
            <div className="absolute top-0 left-0 p-8 opacity-[0.02]">
                <Globe size={120} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
