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
  Shield
} from 'lucide-react';
// @ts-ignore
import farmerService from '../../services/farmerService';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import AIGradeCard from '../../components/farmer/AIGradeCard';
import SBTBadge from '../../components/farmer/SBTBadge';
import toast from 'react-hot-toast';
import DOMPurify from 'dompurify';

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
      const response = await farmerService.getListingById(id);
      setListing(response.data.listing);
      // Simulating bids for now - in production this comes from the backend
      setBids([
        { id: '1', buyerName: 'AgriCorp Pvt Ltd', amount: 2100, quantity: 50, status: 'pending', date: new Date().toISOString() },
        { id: '2', buyerName: 'Suresh Trading', amount: 2050, quantity: 50, status: 'rejected', date: new Date(Date.now() - 86400000).toISOString() }
      ]);
    } catch (error) {
      console.error('Failed to fetch listing details:', error);
      toast.error('Failed to load listing details');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBid = async (bidId: string) => {
    try {
      await farmerService.acceptBid(bidId);
      toast.success('Bid accepted successfully!');
      fetchListingDetails();
    } catch (error) {
      toast.error('Failed to accept bid');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary-100 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 shimmer">Analyzing Quality Tokens...</p>
        </div>
      </div>
    );
  }

  if (!listing) return <div className="p-8 text-center italic text-gray-500">Listing not found</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 fade-in">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="btn btn-ghost gap-2 text-xs font-bold uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back to Inventory
        </button>
        <div className="flex gap-4">
          <Link to={`/farmer/listings/edit/${id}`} className="btn btn-outline text-xs uppercase tracking-widest px-6">Edit Listing</Link>
          <button className="btn bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 text-xs uppercase tracking-widest px-6">Deactivate</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-10">
          <div className="stitch-card overflow-hidden">
            <div className="aspect-[21/9] bg-gray-900 relative">
              {listing.images?.[0] ? (
                <img src={sanitizeUrl(listing.images[0])} alt={listing.product} className="w-full h-full object-cover opacity-80" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-700 bg-gray-100">
                  <Package size={64} className="opacity-20" />
                </div>
              )}
              <div className="absolute top-6 left-6">
                <SBTBadge badge={{ name: 'Certified', type: 'quality', description: 'AI Verified' }} size="md" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-gray-900 to-transparent">
                <div className="flex justify-between items-end">
                  <div className="space-y-2">
                    <div className="badge badge-farmer">Active Listing</div>
                    <h1 className="text-4xl font-bold text-white tracking-tight italic">{listing.product}</h1>
                    <p className="flex items-center gap-2 text-primary-100/60 font-medium">
                      <MapPin className="w-4 h-4" /> {listing.location || 'Regional Cluster'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary-400">Asking Price</p>
                    <p className="text-4xl font-bold text-white italic">{formatCurrency(listing.pricePerUnit)}<span className="text-lg not-italic text-white/40">/{listing.unit}</span></p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-10 space-y-10">
              <div className="grid grid-cols-3 gap-6">
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                  <Scale className="w-5 h-5 text-primary" />
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Net Quantity</p>
                  <p className="text-xl font-bold text-gray-900">{listing.quantity} {listing.unit}</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                  <TrendingUp className="w-5 h-5 text-secondary" />
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Market Demand</p>
                  <p className="text-xl font-bold text-gray-900">High</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                  <Clock className="w-5 h-5 text-tertiary" />
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Listed On</p>
                  <p className="text-xl font-bold text-gray-900">{formatDateTime(listing.createdAt).split(',')[0]}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="text-gray-400" size={20} />
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight italic">Product <span className="not-italic">Specs</span></h3>
                </div>
                <div 
                  className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(listing.description || 'No description provided.') }}
                />
              </div>
            </div>
          </div>

          <section className="stitch-card p-10 space-y-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Gavel className="text-gray-400" />
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight italic">Live <span className="not-italic">Bids</span></h3>
              </div>
              <span className="badge badge-farmer">{bids.length} Active</span>
            </div>
            
            {bids.length === 0 ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
                  <Gavel size={32} />
                </div>
                <p className="text-sm text-gray-400 italic">No bids received for this listing yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {bids.map((bid) => (
                  <div key={bid.id} className="py-6 flex items-center justify-between group">
                    <div className="space-y-1">
                      <p className="font-bold text-gray-900 text-lg">{bid.buyerName}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{bid.quantity} {listing.unit}</span>
                        <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{formatDateTime(bid.date)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary italic leading-none">{formatCurrency(bid.amount)}<span className="text-sm not-italic text-gray-300">/{listing.unit}</span></p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Value: {formatCurrency(bid.amount * bid.quantity)}</p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-primary-50 hover:text-primary border border-transparent hover:border-primary-100 transition-all">
                          <MessageCircle size={18} />
                        </button>
                        <button 
                          onClick={() => handleAcceptBid(bid.id)}
                          className="btn btn-primary py-2 px-6 rounded-xl text-[10px] uppercase tracking-widest"
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-10">
          <AIGradeCard 
            grade={listing.aiGrade || 'A'}
            qualityMetrics={{
              moisture: listing.moisture || '12.5%',
              purity: listing.purity || '98%',
              protein: listing.protein || '11.2%',
              size: '8.5mm'
            }}
            pricePrediction={{
              estimatedPrice: listing.pricePerUnit,
              minPrice: listing.pricePerUnit * 0.95,
              maxPrice: listing.pricePerUnit * 1.05,
              confidence: 92,
              bestTimeframe: 'Apply for Bidding'
            }}
          />

          <div className="stitch-card p-8 space-y-8">
            <h3 className="text-xl font-bold text-gray-900 italic tracking-tight">Market <span className="not-italic">Performance</span></h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-500">
                  <Eye size={18} />
                  <span className="text-xs font-medium">Platform Views</span>
                </div>
                <span className="font-bold text-gray-900">{listing.views || 142}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-500">
                  <Gavel size={18} />
                  <span className="text-xs font-medium">Bids Placed</span>
                </div>
                <span className="font-bold text-gray-900">{bids.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-500">
                  <TrendingUp size={18} />
                  <span className="text-xs font-medium">Conversion Rate</span>
                </div>
                <span className="font-bold text-primary">8.4%</span>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-100">
              <div className="bg-primary-50 rounded-2xl p-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
                  <Target size={20} className="text-white" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary leading-none">AI Insight</p>
                  <p className="text-xs text-primary-900/80 font-medium">High demand for {listing.product} in nearby clusters.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="stitch-card p-8 bg-gray-900 text-white space-y-6 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 text-primary-400">
                <Shield size={18} />
                <h4 className="text-[10px] font-bold uppercase tracking-widest">Escrow Protected</h4>
              </div>
              <p className="text-xs text-white/60 leading-relaxed font-medium">
                All bids on SmartKissan are backed by blockchain-verified escrow deposits. 
                Payment is guaranteed upon successful delivery verification.
              </p>
            </div>
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
