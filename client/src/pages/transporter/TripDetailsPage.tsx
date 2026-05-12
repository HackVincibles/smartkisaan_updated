import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Phone, User, 
  Package, IndianRupee, Clock, CheckCircle2,
  QrCode, Navigation, ShieldCheck, AlertTriangle,
  Activity, Zap, ArrowRight, Truck, Database,
  Target, Layers, Globe, ChevronRight, Signal
} from 'lucide-react';
// @ts-ignore
import transporterService from '../../services/transporterService';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

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
        setOrder({
          _id: id,
          escrowState: 'PICKUP_ASSIGNED',
          listingId: { productName: 'Premium Wheat', unit: 'Quintal', quantity: 50 },
          farmerId: { name: 'Rajesh Kumar', phone: '9876543210', farmLocation: 'Sector 4, Bikaner' },
          buyerId: { businessName: 'Food Corp Ltd', address: 'RIICO Industrial Area, Jaipur' },
          totalAmount: 45000,
          freightCharge: 4500,
          distance: '180 km',
          createdAt: new Date()
        });
      }
    } catch (error) {
      console.error('Failed to fetch trip details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (state: string) => {
    switch (state) {
      case 'PICKUP_ASSIGNED': return { color: 'text-secondary bg-secondary/5', label: 'PICKUP_AWAITING' };
      case 'PICKED_UP': return { color: 'text-warning bg-warning/5', label: 'ASSET_SECURED' };
      case 'IN_TRANSIT': return { color: 'text-primary bg-primary/5', label: 'LOGISTICS_ACTIVE' };
      case 'DELIVERED': return { color: 'text-success bg-success/5', label: 'HANDOVER_COMPLETE' };
      default: return { color: 'text-gray-400 bg-gray-50', label: state };
    }
  };

  const pickupDone = ['PICKED_UP', 'IN_TRANSIT', 'DELIVERED'].includes(order?.escrowState);

  if (loading) return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="text-center space-y-8">
        <div className="w-24 h-24 bg-warning/10 rounded-[2.5rem] border border-warning/20 flex items-center justify-center shadow-2xl relative">
          <div className="absolute inset-0 border-4 border-warning/20 border-t-warning rounded-[2.5rem] animate-spin"></div>
          <Truck size={40} className="text-warning" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-warning italic">Loading Trip Registry...</p>
      </div>
    </div>
  );

  if (!order) return (
    <div className="flex items-center justify-center h-[80vh]">
      <p className="text-2xl font-black text-gray-300 italic uppercase">TRIP_NODE_NOT_FOUND</p>
    </div>
  );

  const conf = getStatusConfig(order.escrowState);

  return (
    <div className="max-w-7xl mx-auto space-y-20 pb-32 fade-in">
      {/* Trip Command Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative overflow-hidden p-4">
        <div className="space-y-6 relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] italic text-gray-400 hover:text-warning transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" /> BACK_TO_REGISTRY
          </button>
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-warning italic">
            <div className="w-1.5 h-1.5 bg-warning rounded-full animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.8)]"></div>
            Trip_Command_Terminal [ACTIVE_MISSION]
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gray-950 tracking-tighter italic leading-none uppercase">
            Trip <span className="not-italic text-warning">Detail.</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-xl text-xl leading-relaxed italic">
            Contract <span className="text-gray-950 font-black italic uppercase">#{id?.slice(-14).toUpperCase()}</span> — Full logistics manifest and handover protocol.
          </p>
        </div>

        <div className="flex items-center gap-8 relative z-10">
          <span className={`px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.5em] italic border border-current/10 shadow-sm ${conf.color}`}>
            {conf.label}
          </span>
        </div>

        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none -mr-40 -mt-10">
          <h1 className="text-[20rem] font-black italic tracking-tighter uppercase leading-none">TRIP</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 px-4">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-16">
          {/* Route Telemetry Map */}
          <div className="stitch-card overflow-hidden border-none shadow-2xl shadow-gray-200/50 bg-gray-950 aspect-video relative group">
            <div className="absolute inset-0 opacity-[0.05]">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <pattern id="trip-map-grid" width="5" height="5" patternUnits="userSpaceOnUse">
                  <path d="M 5 0 L 0 0 0 5" fill="none" stroke="white" strokeWidth="0.3"/>
                </pattern>
                <rect width="100%" height="100%" fill="url(#trip-map-grid)" />
              </svg>
            </div>
            {/* Route Path Visual */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full flex items-center px-20">
                <div className="flex items-center w-full gap-6">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-success border-4 border-white shadow-xl"></div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic">{order.farmerId?.name}</p>
                  </div>
                  <div className="flex-1 relative h-1">
                    <div className="absolute inset-0 border-t-2 border-dashed border-white/20"></div>
                    <div className="absolute inset-0 border-t-2 border-warning animate-pulse" style={{ width: pickupDone ? '100%' : '0%', transition: 'width 2s' }}></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="p-3 bg-white/10 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl">
                        <Truck size={24} className="text-warning animate-bounce" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-warning border-4 border-white shadow-xl"></div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic">{order.buyerId?.businessName}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 text-[10px] font-black text-white/40 uppercase tracking-[0.5em] italic bg-white/5 px-8 py-4 rounded-2xl border border-white/5">
              <Navigation size={14} className="text-warning animate-pulse" /> LIVE_ROUTE_TELEMETRY_CALCULATING
            </div>
          </div>

          {/* Trip Progression Pipeline */}
          <div className="stitch-card p-12 md:p-16 bg-white border-none shadow-2xl shadow-gray-200/50 space-y-16 relative overflow-hidden group">
            <div className="flex items-center gap-6 relative z-10">
              <div className="p-5 bg-gray-950 rounded-[1.8rem] text-white shadow-2xl group-hover:rotate-6 transition-transform duration-700"><Activity size={36} /></div>
              <div className="space-y-1.5">
                <h3 className="text-4xl font-black text-gray-950 tracking-tighter italic leading-none uppercase">Mission <span className="not-italic text-warning">Pipeline.</span></h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] italic leading-none">LOGISTICS_PROGRESSION_MATRIX</p>
              </div>
            </div>

            <div className="space-y-0 relative z-10">
              {/* Vertical Rail */}
              <div className="absolute left-[calc(2.5rem+3rem)] top-[calc(4rem+8rem)] bottom-24 w-0.5 bg-gray-100 pointer-events-none"></div>

              {/* Step 1: Pickup */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.6 }} className="flex items-start gap-10 pb-16">
                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center relative z-10 shrink-0 shadow-2xl border border-current/10 ${pickupDone ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                  <MapPin size={36} strokeWidth={1.5} />
                </div>
                <div className="flex-1 pt-2 space-y-8">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                    <div className="space-y-3">
                      <h4 className="text-3xl font-black text-gray-950 italic tracking-tighter leading-none uppercase">PICKUP::{order.farmerId?.name}</h4>
                      <p className="text-lg text-gray-400 font-medium italic">{order.farmerId?.farmLocation || 'Farm Location'}</p>
                      <div className="flex items-center gap-3 text-[11px] font-black text-secondary uppercase tracking-[0.3em] italic">
                        <Phone size={16} /> +91 {order.farmerId?.phone}
                      </div>
                    </div>
                    <Link
                      to={`/transporter/scan/${order._id}`}
                      className="flex items-center gap-5 px-10 py-6 bg-gray-950 text-white rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.4em] italic shadow-2xl hover:bg-warning transition-all group/qr shrink-0 relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-5"><QrCode size={22} /> SCAN_HANDOVER_QR</span>
                      <div className="absolute inset-0 bg-warning opacity-0 group-hover/qr:opacity-100 transition-opacity"></div>
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Step 2: Delivery */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className={`flex items-start gap-10 ${!pickupDone ? 'opacity-30' : ''}`}>
                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center relative z-10 shrink-0 shadow-2xl border border-current/10 ${order.escrowState === 'DELIVERED' ? 'bg-success/10 text-success' : 'bg-gray-50 text-gray-200'}`}>
                  <CheckCircle2 size={36} strokeWidth={1.5} />
                </div>
                <div className="flex-1 pt-2 space-y-8">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                    <div className="space-y-3">
                      <h4 className="text-3xl font-black text-gray-950 italic tracking-tighter leading-none uppercase">DELIVERY::{order.buyerId?.businessName}</h4>
                      <p className="text-lg text-gray-400 font-medium italic">{order.buyerId?.address || 'Buyer Location'}</p>
                    </div>
                    <button disabled={!pickupDone} className={`flex items-center gap-5 px-10 py-6 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.4em] italic shadow-sm shrink-0 ${pickupDone ? 'bg-gray-950 text-white hover:bg-warning transition-all shadow-2xl cursor-pointer' : 'bg-gray-50 text-gray-300 cursor-not-allowed'}`}>
                      <QrCode size={22} /> SCAN_DELIVERY_QR
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="absolute bottom-0 right-0 p-12 text-gray-50 opacity-[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-[2s]"><Truck size={250} /></div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-12">
          {/* Load Manifest */}
          <div className="stitch-card p-12 bg-white border-none shadow-2xl shadow-gray-200/50 space-y-12 relative overflow-hidden group">
            <div className="flex items-center gap-5 relative z-10">
              <div className="p-4 bg-gray-950 rounded-2xl text-white shadow-2xl group-hover:rotate-6 transition-transform duration-700"><Package size={28} /></div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-gray-950 italic tracking-tighter leading-none uppercase">Load <span className="text-warning not-italic">Manifest.</span></h3>
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.5em] italic leading-none">CARGO_SPECS</p>
              </div>
            </div>
            <div className="space-y-8 relative z-10">
              {[
                { label: 'COMMODITY', value: order.listingId?.productName?.toUpperCase(), Icon: Package },
                { label: 'WEIGHT_VECTOR', value: `${order.listingId?.quantity} ${order.listingId?.unit}`, Icon: Database },
                { label: 'FREIGHT_CAPITAL', value: `₹${order.freightCharge?.toLocaleString()}`, Icon: IndianRupee },
                { label: 'HAUL_DISTANCE', value: order.distance || '—', Icon: Navigation },
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-6 p-8 bg-gray-50 rounded-[2rem] shadow-inner border border-gray-100 group/m hover:bg-white hover:shadow-2xl transition-all">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-warning shadow-sm border border-gray-100 group-hover/m:rotate-12 transition-transform duration-700">
                    <m.Icon size={24} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.5em] italic leading-none">{m.label}</p>
                    <p className="text-xl font-black text-gray-950 italic tracking-tighter leading-none">{m.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-0 right-0 p-10 text-gray-50 opacity-[0.03] pointer-events-none"><Package size={150} /></div>
          </div>

          {/* Escrow Trust Badge */}
          <div className="stitch-card p-10 bg-success/5 border border-success/10 shadow-2xl shadow-success/5 relative overflow-hidden group">
            <div className="flex items-start gap-8 relative z-10">
              <div className="w-16 h-16 bg-success/10 text-success rounded-[1.5rem] flex items-center justify-center shrink-0 border border-success/20 shadow-inner group-hover:rotate-12 transition-transform duration-700">
                <ShieldCheck size={28} strokeWidth={1.5} />
              </div>
              <div className="space-y-3">
                <h4 className="font-black text-xl text-gray-950 italic uppercase leading-none">ESCROW_SECURED</h4>
                <p className="text-gray-400 font-medium italic text-lg leading-relaxed">
                  Your freight capital is protected. Released <span className="text-gray-950 font-black">12 hours</span> post confirmed delivery.
                </p>
              </div>
            </div>
            <div className="absolute top-0 right-0 p-8 text-success/5 pointer-events-none"><ShieldCheck size={100} /></div>
          </div>

          {/* Emergency Protocol */}
          <div className="stitch-card p-10 bg-error/5 border border-error/10 shadow-2xl shadow-error/5 relative overflow-hidden group">
            <div className="flex items-start gap-8 relative z-10">
              <div className="w-16 h-16 bg-error/10 text-error rounded-[1.5rem] flex items-center justify-center shrink-0 border border-error/20 shadow-inner group-hover:rotate-12 transition-transform duration-700">
                <AlertTriangle size={28} strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h4 className="font-black text-xl text-gray-950 italic uppercase leading-none">INCIDENT_PROTOCOL</h4>
                <p className="text-gray-400 font-medium italic text-lg leading-relaxed">
                  Facing an issue during transit? Escalate immediately to the arbiter network.
                </p>
                <button className="w-full py-6 bg-error text-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.5em] italic shadow-2xl shadow-error/20 hover:bg-gray-950 transition-all group/btn relative overflow-hidden">
                  <span className="relative z-10">REPORT_INCIDENT</span>
                  <div className="absolute inset-0 bg-gray-950 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetailsPage;
