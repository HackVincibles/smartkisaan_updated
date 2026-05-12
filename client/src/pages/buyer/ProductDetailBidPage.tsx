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
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import buyerService from '../../services/buyerService';
import { formatCurrency, formatRelativeTime } from '../../lib/utils';
import AIGradeCard from '../../components/farmer/AIGradeCard';
import SBTBadge from '../../components/farmer/SBTBadge';
import toast from 'react-hot-toast';
import DOMPurify from 'dompurify';

const ProductDetailBidPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const sanitizeUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/') || url.startsWith('data:')) {
      return url;
    }
    return '';
  };
  const [bidAmount, setBidAmount] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await buyerService.getProductById(id);
      setProduct(response.data.product);
    } catch (error) {
      console.error('Failed to fetch product details:', error);
      // toast.error('Failed to load product details');
      // Mock data for demo
      setProduct({
        id: id,
        name: 'Organic Sona Masoori Wheat',
        farmerName: 'Ram Singh',
        farmerId: 'farmer-123',
        location: 'Karnal, Haryana',
        price: 2150,
        unit: 'Quintal',
        quantity: 120,
        aiGrade: 'A',
        description: 'Premium quality organic wheat grown using traditional methods. No chemical fertilizers used. High protein content and excellent for making rotis.',
        harvestDate: new Date(Date.now() - 86400000 * 15),
        images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80'],
        moisture: 12.5,
        purity: 98.5,
        protein: 11.2,
        farmerRating: 4.8,
        totalSales: 45
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
      toast.success('Bid placed successfully!');
      setBidAmount('');
    } catch (error) {
      toast.error('Failed to place bid');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-96">Loading product details...</div>;
  if (!product) return <div className="p-8 text-center">Product not found</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </button>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-2 rounded-lg border transition-all ${isFavorite ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white hover:bg-gray-50 text-gray-400'}`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button className="p-2 rounded-lg border bg-white hover:bg-gray-50 text-gray-400">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Images & Info */}
        <div className="space-y-8">
          <div className="aspect-square bg-gray-100 dark:bg-dark-300 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200 dark:shadow-none relative">
            <img src={sanitizeUrl(product.images?.[0])} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute top-6 left-6 flex gap-3">
              <SBTBadge id="trust-badge" level="Platinum" />
              <div className="px-4 py-2 bg-white/90 backdrop-blur rounded-2xl text-xs font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2 shadow-lg">
                <Shield className="w-4 h-4" /> Grade {product.aiGrade}
              </div>
            </div>
          </div>

          <div className="card p-8">
            <h3 className="text-xl font-bold mb-4">Farmer Details</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xl font-black">
                  {product.farmerName?.[0]}
                </div>
                <div>
                  <h4 className="text-lg font-bold">{product.farmerName}</h4>
                  <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    {product.farmerRating} 
                    <span className="text-gray-400 font-medium ml-1">({product.totalSales} successful deals)</span>
                  </div>
                </div>
              </div>
              <Link 
                to={`/buyer/messages/${product.farmerId}`}
                className="btn-secondary py-2 px-4 text-sm flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Message Farmer
              </Link>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Product Description</h3>
            <p 
              className="text-gray-600 dark:text-gray-400 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description || '') }}
            />
          </div>
        </div>

        {/* Right Column: Pricing & Bidding */}
        <div className="space-y-8">
          <div className="card p-8 bg-gradient-to-br from-white to-gray-50 dark:from-dark-200 dark:to-dark-300">
            <div className="mb-8">
              <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">{product.name}</h1>
              <p className="flex items-center gap-2 text-gray-500 font-bold">
                <MapPin className="w-5 h-5 text-primary-600" /> {product.location}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8 p-6 bg-white dark:bg-dark-100 rounded-3xl border border-gray-100 dark:border-dark-400 shadow-sm">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                  <Scale className="w-3 h-3" /> Quantity Available
                </p>
                <p className="text-2xl font-black text-gray-900 dark:text-white">{product.quantity} {product.unit}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                  <IndianRupee className="w-3 h-3" /> Asking Price
                </p>
                <p className="text-2xl font-black text-primary-600">₹{product.price} <span className="text-sm font-bold text-gray-400">/ {product.unit}</span></p>
              </div>
            </div>

            {/* AI Grading Module */}
            <div className="mb-8">
               <AIGradeCard 
                 grade={product.aiGrade}
                 qualityMetrics={{
                   moisture: product.moisture,
                   purity: product.purity,
                   protein: product.protein,
                   size: 8.5
                 }}
                 pricePrediction={{
                   marketAvg: product.price * 0.98,
                   recommended: product.price
                 }}
               />
            </div>

            {/* Bidding Section */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Gavel className="w-5 h-5 text-primary-600" />
                Place your Bid
              </h3>
              <form onSubmit={handlePlaceBid} className="flex gap-3">
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₹</div>
                  <input 
                    type="number" 
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter bid amount"
                    className="input pl-8 h-14 text-lg font-bold"
                  />
                </div>
                <button 
                  type="submit"
                  className="btn-primary h-14 px-8 text-lg font-black"
                >
                  Place Bid
                </button>
              </form>
              <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                <Clock className="w-4 h-4" />
                Bidding ends in 2 days, 4 hours
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-dark-400">
              <button className="w-full h-14 rounded-2xl bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                <CheckCircle className="w-6 h-6" />
                Buy Now at ₹{product.price}
              </button>
              <p className="text-[10px] text-center text-gray-400 mt-3 font-bold uppercase tracking-widest">
                Escrow Protected • Secure Blockchain Transaction
              </p>
            </div>
          </div>

          <div className="card p-6 border-blue-100 bg-blue-50/30 dark:bg-blue-900/10">
            <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Logistics Options
            </h4>
            <p className="text-sm text-blue-800/80 dark:text-blue-200/80">
              Estimated shipping to your location: <span className="font-bold">₹1,250 - ₹1,800</span>. Multiple verified transporters available for this route.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailBidPage;
