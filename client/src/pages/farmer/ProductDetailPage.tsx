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
  CheckCircle,
  Truck,
  MessageCircle,
  FileText
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

  const sanitizeUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/') || url.startsWith('data:')) {
      return url;
    }
    return '';
  };
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListingDetails();
  }, [id]);

  const fetchListingDetails = async () => {
    try {
      const response = await farmerService.getListingById(id);
      setListing(response.data.listing);
      // Simulating bids
      setBids([
        { id: 1, buyerName: 'AgriCorp Pvt Ltd', amount: 2100, quantity: 50, status: 'pending', date: new Date() },
        { id: 2, buyerName: 'Suresh Trading', amount: 2050, quantity: 50, status: 'rejected', date: new Date() }
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
      await farmerService.acceptBid(id, bidId);
      toast.success('Bid accepted successfully!');
      fetchListingDetails();
    } catch (error) {
      toast.error('Failed to accept bid');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-96">Loading...</div>;
  if (!listing) return <div className="p-8 text-center">Listing not found</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary-600 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to My Listings
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card overflow-hidden">
            <div className="aspect-video bg-gray-100 dark:bg-dark-300 relative">
              {listing.images?.[0] ? (
                <img src={sanitizeUrl(listing.images[0])} alt={listing.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
              )}
              <div className="absolute top-4 left-4">
                <SBTBadge id="trust-badge" level="Gold" />
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{listing.name}</h1>
                  <p className="flex items-center gap-2 text-gray-500">
                    <MapPin className="w-4 h-4" /> {listing.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Asking Price</p>
                  <p className="text-3xl font-bold text-primary-600">{formatCurrency(listing.price)}/Qtl</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-100 dark:border-dark-300">
                <div className="text-center">
                  <Scale className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Quantity</p>
                  <p className="font-bold">{listing.quantity} Quintal</p>
                </div>
                <div className="text-center border-x border-gray-100 dark:border-dark-300">
                  <Shield className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                  <p className="text-xs text-gray-500 uppercase tracking-wider">AI Grade</p>
                  <p className="font-bold">Grade {listing.aiGrade || 'A'}</p>
                </div>
                <div className="text-center">
                  <Clock className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Listed</p>
                  <p className="font-bold">{formatDateTime(listing.createdAt).split(',')[0]}</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p 
                  className="text-gray-600 dark:text-gray-400"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(listing.description || '') }}
                />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Incoming Bids</h3>
            {bids.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Gavel className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>No bids received yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bids.map((bid) => (
                  <div key={bid.id} className="p-4 rounded-xl border border-gray-100 dark:border-dark-300 flex items-center justify-between">
                    <div>
                      <p className="font-bold">{bid.buyerName}</p>
                      <p className="text-sm text-gray-500">{bid.quantity} Quintal • {formatDateTime(bid.date)}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-bold text-lg text-primary-600">{formatCurrency(bid.amount)}/Qtl</p>
                        <p className="text-xs text-gray-400">Total: {formatCurrency(bid.amount * bid.quantity)}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleAcceptBid(bid.id)}
                          className="btn-primary py-2 px-4 text-sm"
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <AIGradeCard 
            grade={listing.aiGrade || 'A'}
            qualityMetrics={{
              moisture: listing.moisture || 12.5,
              purity: listing.purity || 98,
              protein: listing.protein || 11.2,
              size: 8.5
            }}
            pricePrediction={{
              marketAvg: listing.price * 0.95,
              recommended: listing.price
            }}
          />

          <div className="card p-6">
            <h3 className="font-semibold mb-4">Listing Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Visibility</span>
                <span className="font-bold text-green-600">Active</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Views</span>
                <span className="font-bold">{listing.views || 42}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Total Bids</span>
                <span className="font-bold">{bids.length}</span>
              </div>
              <button className="btn-secondary w-full py-2 text-sm mt-2">
                Edit Listing
              </button>
              <button className="w-full text-red-600 text-sm py-2 hover:bg-red-50 rounded-lg transition-colors">
                Deactivate Listing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
