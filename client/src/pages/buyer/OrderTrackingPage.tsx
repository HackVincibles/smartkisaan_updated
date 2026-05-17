import React, { useState, useEffect, useMemo } from 'react';
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
  LocateFixed,
  Workflow,
  Cpu,
  Globe,
  Database,
  Target,
  MoreHorizontal,
  ChevronDown,
  ExternalLink,
  Scan,
  Compass,
  Radar,
  ShieldAlert,
  Lock,
  Layers
} from 'lucide-react';
// @ts-ignore
import buyerService from '../../services/buyerService';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import StatusBadge from '../../components/common/StatusBadge';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useOptimizedTracking } from '../../hooks/useOptimizedTracking';
import LiveMap from '../../components/logistics/LiveMap';
import { getMockOrderById } from '../../services/routeService';

const steps = [
  { key: 'ordered', label: 'CONTRACT_SIGNED', icon: Package },
  { key: 'packed', label: 'ASSET_SEALED', icon: ShoppingBag },
  { key: 'in-transit', label: 'LOGISTICS_RAIL', icon: Truck },
  { key: 'delivered', label: 'VAULT_DELIVERY', icon: CheckCircle }
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
          address: 'VASHI_LOGISTIC_HUB_NODE_7, MUMBAI'
        },
        lastUpdate: new Date()
      });
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      // Mock for high-fidelity demo using centralized dynamic lookups
      const mockOrderData = getMockOrderById(id);
      setOrder(mockOrderData);
    } finally {
      setLoading(false);
    }
  };

  // Connect our highly optimized hybrid tracking hook
  const trackingData = useOptimizedTracking(order, true, false);

  const getCurrentStep = () => {
    const current = tracking?.currentStep || 'in-transit';
    return steps.findIndex(s => s.key === current);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[80vh] fade-in">
      <div className="text-center space-y-10">
        <div className="w-24 h-24 bg-secondary/10 rounded-[2.5rem] border border-secondary/20 flex items-center justify-center shadow-2xl relative">
            <div className="absolute inset-0 border-4 border-secondary/20 border-t-secondary rounded-[2.5rem] animate-spin"></div>
            <Radar size={40} className="text-secondary animate-pulse" />
        </div>
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary italic leading-none">Connecting Logistics Rail...</p>
          <p className="text-xs text-gray-400 font-medium italic leading-none">Establishing Live Telemetry Stream...</p>
        </div>
      </div>
    </div>
  );

  if (!order) return <div className="p-40 text-center italic text-gray-400 text-2xl font-black uppercase tracking-widest">Order context not found.</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32 fade-in">
      {/* Premium Telemetry Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative overflow-hidden p-4">
        <div className="space-y-6 relative z-10">
          <Link to="/buyer/orders" className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-secondary transition-all group italic">
            <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> EXIT TERMINAL
          </Link>
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-secondary italic">
            <Activity size={16} /> <span>LIVE_TELEMETRY_PROTOCOL</span>
            <ChevronRight size={12} className="text-gray-200" />
            <span className="text-gray-400">SHIPMENT_ID::{id?.substring(0, 12).toUpperCase() || 'ORD-5521'}</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gray-950 tracking-tighter italic leading-none">
            Track <span className="not-italic text-secondary">Shipment.</span>
          </h1>
        </div>
        
        <div className="relative z-10">
          <StatusBadge status={order.status} variant={order.status === 'delivered' ? 'success' : 'primary'} />
        </div>

        {/* Decorative Background Text */}
        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none -mr-40 -mt-10">
            <h1 className="text-[20rem] font-black italic tracking-tighter uppercase">ACTIVE</h1>
        </div>
      </div>

      {/* Pipeline Visualizer Terminal */}
      <div className="stitch-card p-12 md:p-16 bg-white shadow-2xl shadow-gray-200/50 relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-20">
            <div className="flex items-center gap-6">
                <div className="p-4 bg-gray-950 rounded-2xl text-secondary shadow-2xl group-hover:rotate-6 transition-transform duration-700">
                    <Workflow size={28} />
                </div>
                <div className="space-y-1">
                    <h3 className="text-3xl font-bold text-gray-950 italic tracking-tight uppercase leading-none">Movement <span className="not-italic text-secondary">Registry.</span></h3>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] italic leading-none">Real-time sourcing pipeline active</p>
                </div>
            </div>
            <div className="px-8 py-5 bg-secondary/10 text-secondary text-[11px] font-black uppercase tracking-[0.4em] italic rounded-2xl border border-secondary/20 shadow-2xl shadow-secondary/5 flex items-center gap-4">
              <Clock size={18} /> ETA: {trackingData.timeRemainingMinutes > 0 ? `${Math.floor(trackingData.timeRemainingMinutes / 60)}h ${trackingData.timeRemainingMinutes % 60}m` : 'Arrived'} ({trackingData.distanceRemainingKm.toFixed(1)} km left)
            </div>
          </div>

          <div className="relative px-10">
            <div className="absolute top-9 left-0 right-0 h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-50">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(getCurrentStep() / (steps.length - 1)) * 100}%` }}
                className="h-full bg-secondary shadow-[0_0_30px_rgba(59,130,246,0.6)]"
                transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            
            <div className="relative flex justify-between">
              {steps.map((step, index) => {
                const isCompleted = index <= getCurrentStep();
                const isCurrent = index === getCurrentStep();
                const StepIcon = step.icon;
                
                return (
                  <div key={step.key} className="flex flex-col items-center group/step">
                    <div className={`
                      w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 relative z-10 transition-all duration-1000
                      ${isCompleted ? 'bg-secondary text-white shadow-2xl shadow-secondary/30' : 'bg-white text-gray-300 border border-gray-100 shadow-inner'}
                      ${isCurrent ? 'ring-[12px] ring-secondary/5 scale-110' : ''}
                    `}>
                      <StepIcon size={32} className="group-hover/step:scale-110 transition-transform" />
                    </div>
                    <div className="text-center space-y-2">
                      <p className={`text-[10px] font-black uppercase tracking-[0.4em] italic ${isCompleted ? 'text-gray-950' : 'text-gray-300'}`}>
                        {step.label}
                      </p>
                      <AnimatePresence>
                        {tracking?.timeline?.[step.key] && (
                          <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic leading-none"
                          >
                            {new Date(tracking.timeline[step.key]).toLocaleDateString([], { day: 'numeric', month: 'short' }).toUpperCase()}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 p-12 text-gray-50 opacity-[0.03] pointer-events-none">
            <Layers size={200} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-16 px-4">
        {/* Live Geospatial Data (Left) */}
        <div className="lg:col-span-2 space-y-16">
          <div className="stitch-card overflow-hidden bg-white border-none shadow-2xl shadow-gray-200/50 group/map">
            <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-gray-50/50">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-gray-950 rounded-[1.5rem] flex items-center justify-center text-secondary shadow-2xl group-hover/map:rotate-12 transition-transform duration-700">
                  <LocateFixed size={28} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-gray-950 italic tracking-tight uppercase leading-none">Geospatial Telemetry</h3>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] italic leading-none">Douglas-Peucker & Viewport optimized</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <div className="px-6 py-3 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.4em] italic rounded-2xl flex items-center gap-4 border border-primary/20 shadow-2xl shadow-primary/5">
                  <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
                  HYBRID_POLYGON_UPLINK
                </div>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">
                  Live tracking will appear when transporter starts trip
                </span>
              </div>
            </div>
            
            <div className="h-[550px] relative bg-gray-100 overflow-hidden">
               {/* High-Fidelity Interactive Leaflet Map */}
               <div className="absolute inset-0 z-10">
                 <LiveMap
                   center={trackingData.origin}
                   zoom={9}
                   route={trackingData.optimizedRoute}
                   waypoints={trackingData.visibleWaypoints}
                   vehiclePos={trackingData.vehiclePos}
                   bearing={trackingData.bearing}
                   onBoundsChange={trackingData.setViewportBounds}
                   onZoomChange={trackingData.setZoomLevel}
                 />
               </div>
               
               {/* Digital Grid Overlay */}
               <div className="absolute inset-0 bg-scanline opacity-[0.03] pointer-events-none z-20"></div>
               
               {/* Overlay HUD Panel - Location Label Card */}
               <div className="absolute top-6 left-6 z-20 pointer-events-none">
                 <motion.div 
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="px-8 py-5 bg-gray-950/90 backdrop-blur-3xl rounded-2xl shadow-2xl border border-white/10 whitespace-nowrap text-[11px] font-black uppercase tracking-[0.4em] text-white italic shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]"
                 >
                   CURRENT_POSITION::{trackingData.vehiclePos[0].toFixed(4)}° N, {trackingData.vehiclePos[1].toFixed(4)}° E [ESTIMATED]
                 </motion.div>
               </div>
               
               {/* Compass / Orientation overlay */}
               <div className="absolute top-6 right-6 p-4 bg-gray-950/70 backdrop-blur-3xl rounded-2xl border border-white/10 text-white/40 z-20 pointer-events-none">
                   <Compass size={32} className="animate-spin-slow" />
               </div>
               
               {/* Telemetry Widgets Overlay */}
               <div className="absolute bottom-12 left-12 right-12 flex flex-wrap gap-8 z-20">
                  <div className="flex-1 min-w-[200px] bg-gray-950/90 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 text-white flex items-center gap-8 shadow-2xl group/widget hover:bg-gray-950 transition-all duration-500">
                    <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-secondary shadow-inner group-hover/widget:rotate-12 transition-transform">
                      <Navigation size={32} />
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic leading-none">NEXT_LOG_NODE</p>
                      <p className="text-xl font-black tracking-tighter italic leading-none uppercase">{trackingData.destinationName}</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-[200px] bg-gray-950/90 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 text-white flex items-center gap-8 shadow-2xl group/widget hover:bg-gray-950 transition-all duration-500">
                    <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-secondary shadow-inner group-hover/widget:rotate-12 transition-transform">
                      <Activity size={32} />
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic leading-none">AVG_VELOCITY</p>
                      <p className="text-xl font-black tracking-tighter italic leading-none uppercase">50 KM/H [NOMINAL]</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Institutional Data Matrix */}
          <div className="grid md:grid-cols-2 gap-12">
            <div className="stitch-card p-12 bg-white shadow-2xl shadow-gray-200/50 group/logistics">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-1.5 h-6 bg-secondary rounded-full"></div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] italic leading-none">Shipment_Logistics_Core</h3>
              </div>
              <div className="space-y-10">
                <div className="flex justify-between items-end border-b border-gray-50 pb-6 group/item">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] italic leading-none">CARRIER_ENTITY</p>
                    <p className="text-2xl font-black text-gray-950 tracking-tighter italic leading-none uppercase group-hover/item:text-secondary transition-colors">{order.transporter?.name || 'RAJ CARGO EXPRESS'}</p>
                  </div>
                  <ExternalLink size={18} className="text-gray-100 group-hover/item:text-secondary transition-colors" />
                </div>
                <div className="flex justify-between items-end border-b border-gray-50 pb-6 group/item">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] italic leading-none">ASSET_SIGNATURE</p>
                    <p className="text-2xl font-black text-gray-950 tracking-tighter italic leading-none uppercase group-hover/item:text-secondary transition-colors">{order.vehicleNumber || 'MH-43-BE-1234'}</p>
                  </div>
                  <Cpu size={18} className="text-gray-100 group-hover/item:text-secondary transition-colors" />
                </div>
                <div className="flex justify-between items-end group/item">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] italic leading-none">TELEMETRY_SYNC</p>
                    <p className="text-2xl font-black text-secondary tracking-tighter italic leading-none uppercase">{new Date().toLocaleTimeString().toUpperCase()}</p>
                  </div>
                  <div className="w-2 h-2 bg-secondary rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
                </div>
              </div>
            </div>

            <div className="stitch-card p-12 bg-white shadow-2xl shadow-gray-200/50 group/terminal">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-1.5 h-6 bg-warning rounded-full"></div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] italic leading-none">Delivery_Terminal_Node</h3>
              </div>
              <div className="space-y-8">
                <div className="space-y-2">
                    <p className="text-3xl font-black text-gray-950 italic tracking-tighter leading-none uppercase group-hover/terminal:text-warning transition-colors">{order.deliveryAddress?.name || 'GLOBAL FOODS LTD'}</p>
                    <div className="w-10 h-1 bg-warning/20 rounded-full group-hover/terminal:w-20 transition-all duration-700"></div>
                </div>
                <div className="space-y-3 pl-6 border-l-2 border-gray-50 group-hover/terminal:border-warning transition-colors">
                  <p className="text-lg font-bold text-gray-400 italic leading-relaxed uppercase">{order.deliveryAddress?.address || 'PLOT 42, SECTOR 15, VASHI'}</p>
                  <p className="text-lg font-bold text-gray-400 italic uppercase">{order.deliveryAddress?.city || 'NAVI MUMBAI'}, {order.deliveryAddress?.state || 'MAHARASHTRA'}</p>
                </div>
                <div className="pt-6 flex items-center gap-4 text-warning font-black text-[11px] uppercase tracking-[0.4em] italic">
                  <ShieldCheck size={20} className="group-hover/terminal:rotate-12 transition-transform" /> VERIFIED_HUB_SIGNATURE
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Handover & Security Terminal (Right) */}
        <div className="lg:col-span-1 space-y-12">
          <div className="stitch-card p-12 bg-gray-950 text-white relative overflow-hidden group/handover shadow-2xl shadow-gray-950/40">
            <div className="relative z-10 flex flex-col items-center text-center space-y-10">
              <div className="space-y-3">
                <h3 className="text-3xl font-black tracking-tight italic leading-none uppercase">Handover <span className="text-secondary not-italic">Token.</span></h3>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] italic leading-none">Cryptographic Settlement Key</p>
              </div>
              
              <div className="p-8 bg-white rounded-[4rem] shadow-[0_40px_80px_-15px_rgba(59,130,246,0.3)] group-hover/handover:scale-105 transition-transform duration-1000 relative">
                <div className="w-56 h-56 bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=SECURE-ORD-5521')] bg-cover opacity-90 group-hover/handover:opacity-100 transition-opacity"></div>
                {/* Scanner Beam Effect */}
                <div className="absolute left-0 right-0 top-0 h-1 bg-secondary animate-scan pointer-events-none opacity-40"></div>
              </div>
              
              <p className="text-sm text-white/40 font-medium leading-relaxed italic max-w-xs">
                Present this cryptographic <span className="text-white font-black underline decoration-secondary/20 underline-offset-8 uppercase">Handover Node</span> to the transporter to authorize institutional settlement from the platform vault.
              </p>
              
              <div className="flex gap-6 w-full">
                <button className="flex-1 py-6 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all border border-white/5 shadow-inner">
                  <Download size={24} />
                </button>
                <button className="flex-1 py-6 bg-secondary text-white rounded-2xl flex items-center justify-center hover:bg-secondary-600 transition-all shadow-2xl shadow-secondary/20 group/btn relative overflow-hidden">
                  <span className="relative z-10"><Share2 size={24} /></span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity"></div>
                </button>
              </div>
            </div>
            
            {/* Background Decor */}
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-secondary rounded-full blur-[120px] opacity-10 group-hover/handover:opacity-30 transition-opacity duration-1000"></div>
            <div className="absolute top-0 right-0 p-12 text-white/5 pointer-events-none group-hover/handover:rotate-12 transition-transform">
                <Scan size={150} />
            </div>
          </div>

          {/* Logistics Relay Support */}
          <div className="stitch-card p-12 bg-white shadow-2xl shadow-gray-200/50 group/support">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] italic leading-none mb-12">Logistics_Relay_Support</h3>
            <div className="space-y-6">
              <button className="w-full py-8 bg-gray-950 text-white rounded-3xl flex items-center justify-center gap-5 text-[11px] font-black uppercase tracking-[0.4em] italic hover:bg-secondary transition-all group/btn shadow-2xl relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-5 uppercase">Contact Transporter <MessageCircle size={22} className="text-secondary group-hover/btn:text-white transition-colors" /></span>
                <div className="absolute inset-0 bg-secondary opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
              </button>
              <button className="w-full py-8 border border-gray-100 rounded-3xl flex items-center justify-center gap-5 text-[11px] font-black uppercase tracking-[0.4em] italic text-gray-400 hover:text-error hover:border-error/20 hover:bg-error/5 transition-all shadow-sm">
                <ShieldAlert size={22} />
                Raise Discrepancy
              </button>
            </div>
          </div>

          <div className="bg-secondary-50 p-12 rounded-[3.5rem] border border-secondary-100 shadow-2xl shadow-secondary-100/50 relative overflow-hidden group/shield">
            <div className="flex items-center gap-6 mb-8 relative z-10">
              <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center text-white shadow-2xl group-hover/shield:scale-110 transition-transform duration-700">
                <Shield size={28} className="stroke-[1.5]" />
              </div>
              <p className="text-xs font-black text-secondary uppercase tracking-[0.5em] italic leading-none">Escrow_Locked</p>
            </div>
            <p className="text-[13px] font-medium text-secondary-900/60 leading-relaxed italic relative z-10">
              Settlement assets are securely locked in the <span className="font-black text-secondary uppercase">SmartKissan Vault node</span>. Atomic release occurs only upon verified digital handover at the destination terminal.
            </p>
            <div className="absolute top-0 right-0 p-12 text-secondary/5 opacity-[0.03] group-hover/shield:rotate-12 transition-transform duration-1000">
                <Lock size={150} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
