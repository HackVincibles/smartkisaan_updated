import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Phone, User, 
  Package, IndianRupee, Clock, CheckCircle2,
  QrCode, Navigation, ShieldCheck, AlertTriangle
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
// @ts-ignore
import transporterService from '../../services/transporterService';
import { toast } from 'react-hot-toast';

const TripDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await transporterService.getAssignedOrders();
      const allOrders = response.data?.data?.orders || response.data?.orders || [];
      const foundOrder = allOrders.find((o: any) => o._id === id);
      
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        // Mock fallback for demo
        setOrder({
          _id: id,
          escrowState: 'PICKUP_ASSIGNED',
          listingId: { productName: 'Premium Wheat', unit: 'Quintal', quantity: 50, images: [] },
          farmerId: { name: 'Rajesh Kumar', phone: '9876543210', farmLocation: 'Sector 4, Bikaner' },
          buyerId: { businessName: 'Food Corp Ltd', address: 'RIICO Industrial Area, Jaipur' },
          totalAmount: 45000,
          freightCharge: 4500,
          createdAt: new Date()
        });
      }
    } catch (error) {
      console.error('Failed to fetch trip details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardLayout>Loading...</DashboardLayout>;
  if (!order) return <DashboardLayout>Trip not found</DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Trip Details</h1>
              <p className="text-gray-500 font-medium uppercase text-xs tracking-widest mt-1">Order #{id?.slice(-8).toUpperCase()}</p>
            </div>
          </div>
          
          <div className={`px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest ${
            order.escrowState === 'PICKUP_ASSIGNED' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
          }`}>
            {order.escrowState.replace('_', ' ')}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Route Map (Placeholder) */}
            <div className="card bg-gray-100 aspect-video relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=26.9124,75.7873&zoom=10&size=800x400&sensor=false')] bg-cover opacity-50 grayscale" />
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="p-4 bg-white/90 backdrop-blur rounded-3xl shadow-2xl flex items-center gap-3">
                  <Navigation className="text-blue-600 animate-pulse" />
                  <span className="font-black text-gray-900">Calculating Live Route...</span>
                </div>
              </div>
            </div>

            {/* Delivery Steps */}
            <div className="card bg-white p-8 space-y-8">
              <h3 className="text-xl font-black text-gray-900">Trip Progression</h3>
              
              <div className="space-y-12 relative">
                <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-gray-100" />
                
                {/* Step 1: Pickup */}
                <div className="relative flex items-start gap-8">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center relative z-10 ${
                    ['PICKED_UP', 'IN_TRANSIT', 'DELIVERED'].includes(order.escrowState) ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
                  }`}>
                    <MapPin size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-black text-lg text-gray-900">Pickup: {order.farmerId?.name}</h4>
                        <p className="text-gray-500 font-medium">{order.farmerId?.farmLocation}</p>
                      </div>
                      <Link to={`/transporter/scan/${order._id}`} className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-black transition-all">
                        <QrCode size={18} />
                        Scan Pickup
                      </Link>
                    </div>
                    <div className="mt-4 flex items-center gap-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600 font-bold">
                        <Phone size={14} className="text-primary-600" />
                        {order.farmerId?.phone}
                      </div>
                      <button className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">Get Directions</button>
                    </div>
                  </div>
                </div>

                {/* Step 2: Delivery */}
                <div className="relative flex items-start gap-8 opacity-50">
                  <div className="w-12 h-12 rounded-2xl bg-gray-200 text-gray-500 flex items-center justify-center relative z-10">
                    <CheckCircle2 size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-black text-lg text-gray-900">Delivery: {order.buyerId?.businessName}</h4>
                        <p className="text-gray-500 font-medium">{order.buyerId?.address}</p>
                      </div>
                      <button disabled className="px-6 py-3 bg-gray-100 text-gray-400 rounded-2xl font-black text-sm">
                        Waiting for Pickup
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="card bg-white p-6 space-y-6">
              <h3 className="font-black text-gray-900">Load Details</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary-600 shadow-sm">
                    <Package size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Product</p>
                    <p className="font-black text-gray-900">{order.listingId?.productName}</p>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary-600 shadow-sm">
                    <IndianRupee size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Your Freight</p>
                    <p className="font-black text-gray-900">₹{order.freightCharge?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-green-50 border border-green-100 p-6 space-y-4">
              <div className="flex items-center gap-2 text-green-700">
                <ShieldCheck size={20} />
                <h4 className="font-black uppercase tracking-widest text-xs">Trust Assured</h4>
              </div>
              <p className="text-sm text-green-800 opacity-80 leading-relaxed">
                This trip is secured by SmartKissan Escrow. Your payment will be released 12 hours after successful delivery confirmation.
              </p>
            </div>

            <div className="card bg-red-50 border border-red-100 p-6 space-y-4">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle size={20} />
                <h4 className="font-black uppercase tracking-widest text-xs">Emergency</h4>
              </div>
              <p className="text-xs text-red-800 opacity-80 mb-2">Facing an issue during transit? Report immediately to the arbiter team.</p>
              <button className="w-full py-3 bg-red-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all">
                Report Incident
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TripDetailsPage;
