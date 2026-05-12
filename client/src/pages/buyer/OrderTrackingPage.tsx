import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  MapPin, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Download, 
  Share2, 
  MessageCircle,
  ShoppingBag,
  ChevronRight,
  ArrowLeft,
  Navigation,
  Shield,
  Zap,
  Activity,
  Box,
  LocateFixed
} from 'lucide-react';
// @ts-ignore
import buyerService from '../../services/buyerService';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import StatusBadge from '../../components/common/StatusBadge';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const steps = [
  { key: 'ordered', label: 'Order Signed', icon: Package },
  { key: 'packed', label: 'Sealed & Ready', icon: ShoppingBag },
  { key: 'in-transit', label: 'Logistics Rail', icon: Truck },
  { key: 'delivered', label: 'Vault Delivery', icon: CheckCircle }
];

const OrderTrackingPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [tracking, setTracking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await buyerService.getOrderById(id);
      setOrder(response.data.order);
      setTracking(response.data.tracking || {
        currentStep: 'in-transit',
        timeline: {
          ordered: new Date(Date.now() - 86400000 * 2),
          packed: new Date(Date.now() - 86400000),
          'in-transit': new Date()
        },
        currentLocation: {
          lat: 19.0760,
          lng: 72.8777,
          address: 'Vashi Logistic Hub, Mumbai'
        },
        lastUpdate: new Date()
      });
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      // Mock for demo
      setOrder({
        id: 'ORD-5521',
        productName: 'Premium Basmati Rice',
        status: 'IN_TRANSIT',
        transporter: { name: 'Raj Cargo Express' },
        vehicleNumber: 'MH-43-BE-1234',
        deliveryAddress: { name: 'Global Foods Ltd', address: 'Plot 42, Sector 15, Vashi', city: 'Navi Mumbai', state: 'Maharashtra' }
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStep = () => {
    const current = tracking?.currentStep || 'ordered';
    return steps.findIndex(s => s.key === current);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh] fade-in">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 border-4 border-secondary-100 border-t-secondary-600 rounded-full animate-spin mx-auto shadow-2xl"></div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 italic">Connecting Logistics Rail...</p>
      </div>
    </div>
  );

  if (!order) return <div className="p-20 text-center italic text-gray-400">Order context not found.</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="space-y-4">
          <Link to="/buyer/orders" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-secondary transition-colors mb-2 group">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Vault
          </Link>
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-secondary">
            <Activity size={14} /> <span>Live Telemetry</span>
            <ChevronRight size={10} className="text-gray-300" />
            <span className="text-gray-400">Shipment #{id?.substring(0, 8)}</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight italic leading-none">
            Track <span className="not-italic text-secondary">Shipment.</span>
          </h1>
        </div>
        <StatusBadge status={order.status} variant={order.status === 'delivered' ? 'success' : 'primary'} />
      </div>

      {/* Pipeline Visualizer */}
      <div className="stitch-card p-12 bg-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-16">
            <div className="space-y-1">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sourcing Pipeline</h3>
              <p className="text-2xl font-bold text-gray-900 italic">Movement Protocol</p>
            </div>
            <div className="px-4 py-2 bg-secondary-50 text-secondary text-[10px] font-bold uppercase tracking-widest rounded-xl border border-secondary-100 animate-pulse">
              Estimated Delivery: Tomorrow, 16:00
            </div>
          </div>

          <div className="relative">
            <div className="absolute top-7 left-0 right-0 h-1.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(getCurrentStep() / (steps.length - 1)) * 100}%` }}
                className="h-full bg-secondary shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
            
            <div className="relative flex justify-between">
              {steps.map((step, index) => {
                const isCompleted = index <= getCurrentStep();
                const isCurrent = index === getCurrentStep();
                const StepIcon = step.icon;
                
                return (
                  <div key={step.key} className="flex flex-col items-center group">
                    <div className={`
                      w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-4 relative z-10 transition-all duration-500
                      ${isCompleted ? 'bg-secondary text-white shadow-xl shadow-secondary-200' : 'bg-white text-gray-300 border border-gray-100 shadow-inner'}
                      ${isCurrent ? 'ring-8 ring-secondary-50 scale-110' : ''}
                    `}>
                      <StepIcon size={28} />
                    </div>
                    <div className="text-center space-y-1">
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                      </p>
                      {tracking?.timeline?.[step.key] && (
                        <p className="text-[9px] font-bold text-gray-400 italic">
                          {new Date(tracking.timeline[step.key]).toLocaleDateString([], { day: 'numeric', month: 'short' })}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Live Map / Location */}
        <div className="lg:col-span-2 space-y-10">
          <div className="stitch-card overflow-hidden bg-white border-none shadow-2xl shadow-gray-200/50">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-white shadow-lg">
                  <LocateFixed size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 italic tracking-tight">Geospatial Telemetry</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active GPS Link</p>
                </div>
              </div>
              <span className="px-4 py-2 bg-success/10 text-success text-[9px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 border border-success/20">
                <div className="w-1.5 h-1.5 bg-success rounded-full animate-ping"></div>
                Real-Time Node
              </span>
            </div>
            
            <div className="h-[450px] relative bg-gray-100 group">
               <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/72.8777,19.0760,11/1200x600?access_token=YOUR_TOKEN')] bg-cover">
                  <div className="absolute inset-0 bg-secondary/5"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-24 h-24 bg-secondary/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                    >
                      <div className="w-12 h-12 bg-secondary rounded-[1.2rem] flex items-center justify-center text-white shadow-2xl shadow-secondary-500">
                        <Truck size={24} />
                      </div>
                    </motion.div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 px-6 py-3 bg-white rounded-xl shadow-2xl border border-gray-100 whitespace-nowrap text-[10px] font-bold uppercase tracking-widest text-gray-900 z-20">
                      Currently at {tracking?.currentLocation?.address}
                    </div>
                  </div>
               </div>
               
               {/* Overlay Widgets */}
               <div className="absolute bottom-8 left-8 right-8 flex justify-between gap-4">
                  <div className="bg-gray-900/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10 text-white flex items-center gap-5 shadow-2xl">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-secondary">
                      <Navigation size={24} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Next Transit Node</p>
                      <p className="text-sm font-bold tracking-tight italic">JNPT Port Terminal</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-900/90 backdrop-blur-xl p-6 rounded-2xl border border-white/10 text-white flex items-center gap-5 shadow-2xl">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-secondary">
                      <Zap size={24} />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Avg Velocity</p>
                      <p className="text-sm font-bold tracking-tight italic">42 km/h</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="stitch-card p-10 bg-white">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8">Shipment Logistics</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Carrier Entity</span>
                  <span className="text-sm font-bold text-gray-900 tracking-tight italic">{order.transporter?.name}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Asset Signature</span>
                  <span className="text-sm font-bold text-gray-900 tracking-tight">{order.vehicleNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Tele-Update</span>
                  <span className="text-xs font-bold text-secondary">{new Date(tracking?.lastUpdate).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            <div className="stitch-card p-10 bg-white">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8">Delivery Terminal</h3>
              <div className="space-y-4">
                <p className="text-sm font-bold text-gray-900 italic tracking-tight">{order.deliveryAddress?.name}</p>
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 font-medium leading-relaxed">{order.deliveryAddress?.address}</p>
                  <p className="text-xs text-gray-400 font-medium">{order.deliveryAddress?.city}, {order.deliveryAddress?.state}</p>
                </div>
                <div className="pt-4 flex items-center gap-2 text-secondary text-[10px] font-bold uppercase italic">
                  <Shield size={12} /> Verified Hub Signature
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Handover Security */}
        <div className="space-y-10">
          <div className="stitch-card p-10 bg-gray-900 text-white relative overflow-hidden group shadow-2xl">
            <div className="relative z-10 flex flex-col items-center text-center space-y-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-tight italic leading-none">Handover <span className="not-italic text-secondary">Token.</span></h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Handover Security Hash</p>
              </div>
              
              <div className="p-6 bg-white rounded-[2.5rem] shadow-2xl shadow-secondary-900/50 group-hover:scale-105 transition-transform duration-700">
                <div className="w-48 h-48 bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=SECURE-ORD-5521')] bg-cover"></div>
              </div>
              
              <p className="text-xs text-gray-400 font-medium leading-relaxed italic max-w-[200px]">
                Transporter must scan this cryptographic token to unlock final payment from escrow.
              </p>
              
              <div className="flex gap-4 w-full">
                <button className="flex-1 py-5 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all border border-white/5">
                  <Download size={20} />
                </button>
                <button className="flex-1 py-5 bg-secondary text-white rounded-xl flex items-center justify-center hover:bg-secondary-600 transition-all shadow-xl shadow-secondary-900/20">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-secondary rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
          </div>

          {/* Support / Contact */}
          <div className="stitch-card p-10 bg-white">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8">Logistics Support</h3>
            <div className="space-y-6">
              <button className="w-full py-5 bg-gray-50 rounded-2xl flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-600 hover:bg-secondary hover:text-white transition-all group">
                <MessageCircle size={20} className="text-secondary group-hover:text-white" />
                Contact Transporter
              </button>
              <button className="w-full py-5 border border-gray-100 rounded-2xl flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-all">
                <AlertCircle size={20} />
                Raise Discrepancy
              </button>
            </div>
          </div>

          <div className="bg-secondary-50 p-10 rounded-[2.5rem] border border-secondary-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-white">
                <Shield size={20} />
              </div>
              <p className="text-xs font-bold text-secondary uppercase tracking-widest">Escrow Locked</p>
            </div>
            <p className="text-[11px] font-medium text-secondary-900/60 leading-relaxed italic">
              Settlement funds are securely locked in the <span className="font-bold text-secondary">SmartKissan Vault</span> and will be released only upon verified digital handover at the destination hub.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
