import React, { useState, useEffect } from 'react';
import { 
  Truck, MapPin, Calendar, 
  ChevronRight, Search, Filter,
  Clock, Package, AlertCircle,
  Activity, Shield, Zap, Navigation,
  ArrowUpRight, MoreHorizontal, Radar,
  Database, Target, Workflow, Globe,
  IndianRupee, CheckCircle, Layers
} from 'lucide-react';
// @ts-ignore
import transporterService from '../../services/transporterService';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AssignedOrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await transporterService.getAssignedOrders();
      const data = response.data?.data?.orders || response.data?.orders || [];
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch assigned orders:', error);
      // Mock data for high-fidelity demo
      setOrders([
        { 
          _id: '1', 
          escrowState: 'PICKUP_ASSIGNED', 
          listingId: { productName: 'Premium Wheat', unit: 'Quintal', quantity: 50 },
          farmerId: { name: 'Rajesh Kumar', phone: '9876543210' },
          buyerId: { name: 'Food Corp Ltd', businessName: 'FCL Jaipur Hub' },
          createdAt: new Date(),
          freightCharge: 4500,
          distance: '180 km'
        },
        { 
          _id: '2', 
          escrowState: 'IN_TRANSIT', 
          listingId: { productName: 'Organic Tomatoes', unit: 'KG', quantity: 200 },
          farmerId: { name: 'Amit Singh', phone: '9887766554' },
          buyerId: { name: 'FreshMart', businessName: 'FreshMart Gurgaon Node' },
          createdAt: new Date(Date.now() - 86400000),
          freightCharge: 3200,
          distance: '95 km'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PICKUP_ASSIGNED': return { color: 'text-secondary bg-secondary/5', label: 'PICKUP_AWAITING' };
      case 'PICKED_UP': return { color: 'text-warning bg-warning/5', label: 'ASSET_SECURED' };
      case 'IN_TRANSIT': return { color: 'text-primary bg-primary/5', label: 'LOGISTICS_ACTIVE' };
      case 'DELIVERED': return { color: 'text-success bg-success/5', label: 'HANDOVER_COMPLETE' };
      default: return { color: 'text-gray-400 bg-gray-50', label: 'STATUS_UNKNOWN' };
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[80vh] fade-in">
      <div className="text-center space-y-10">
        <div className="w-24 h-24 bg-warning/10 rounded-[2.5rem] border border-warning/20 flex items-center justify-center shadow-2xl relative">
            <div className="absolute inset-0 border-4 border-warning/20 border-t-warning rounded-[2.5rem] animate-spin"></div>
            <Truck size={40} className="text-warning" />
        </div>
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-warning italic">Syncing Trip Registry...</p>
          <p className="text-xs text-gray-400 font-medium italic">Establishing Logistics Relay...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-20 pb-32 fade-in">
      {/* Trip Registry Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative overflow-hidden p-4">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-warning italic">
            <div className="w-1.5 h-1.5 bg-warning rounded-full animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.8)]"></div>
            Trip_Registry v3.1.0 [ACTIVE]
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gray-950 tracking-tighter italic leading-none uppercase">
            Assigned <span className="not-italic text-warning">Trips.</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-xl text-xl leading-relaxed italic">
            Manage your <span className="text-gray-950 font-black italic">active logistics contracts</span> and real-time freight rails on the procurement network.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-8 relative z-10">
          <div className="stitch-card p-8 bg-white shadow-2xl shadow-gray-200/50 flex items-center gap-6 group hover:rotate-1 transition-transform">
            <div className="w-14 h-14 bg-warning/10 text-warning rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
              <Activity size={28} />
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] italic leading-none">ACTIVE_TRIPS</p>
              <p className="text-3xl font-black text-gray-950 italic tracking-tighter leading-none">{orders.length} <span className="text-xs text-gray-400">NODES</span></p>
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none -mr-40 -mt-10">
          <h1 className="text-[20rem] font-black italic tracking-tighter uppercase leading-none">TRIP</h1>
        </div>
      </div>

      {/* Control Surface */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-10 px-4">
        <div className="relative w-full lg:flex-1 group">
          <Search size={24} className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-warning transition-colors" />
          <input 
            type="text" 
            placeholder="SCAN BY ORDER_ID, CARGO_TYPE, OR ROUTE..." 
            className="w-full pl-20 pr-10 py-10 bg-white border border-gray-100 rounded-[3rem] focus:ring-12 focus:ring-warning/5 focus:border-warning/20 outline-none font-black text-[11px] text-gray-950 uppercase tracking-[0.2em] italic placeholder:text-gray-200 shadow-2xl shadow-gray-200/50"
          />
        </div>
        <div className="flex gap-6 w-full lg:w-auto">
          <button className="flex-1 lg:flex-none px-10 py-8 bg-white border border-gray-100 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.4em] italic text-gray-400 flex items-center gap-4 hover:shadow-2xl transition-all">
            <Filter size={22} /> FILTER
          </button>
          <button className="flex-1 lg:flex-none px-10 py-8 bg-warning text-white rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.4em] italic flex items-center gap-4 shadow-2xl shadow-warning/20 hover:bg-gray-950 transition-all">
            <Navigation size={22} /> LIVE_MAP
          </button>
        </div>
      </div>

      {/* Trip Flow */}
      <div className="space-y-12 px-4">
        <AnimatePresence mode="popLayout">
          {orders.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="stitch-card py-48 text-center space-y-12 bg-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-48 h-48 bg-gray-50 rounded-[4rem] flex items-center justify-center mx-auto shadow-inner">
                  <Package size={90} className="text-gray-200" />
                </div>
                <div className="space-y-6 pt-10">
                  <h3 className="text-5xl font-black text-gray-950 italic uppercase">No Active <span className="text-warning not-italic">Trips.</span></h3>
                  <p className="text-gray-400 text-xl italic max-w-lg mx-auto">No assignments in the current registry. Browse available loads to initialize your freight pipeline.</p>
                </div>
              </div>
            </motion.div>
          ) : (
            orders.map((order, index) => {
              const config = getStatusConfig(order.escrowState);
              return (
                <motion.div key={order._id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="group">
                  <Link to={`/transporter/trips/${order._id}`} className="block stitch-card overflow-hidden border-none shadow-2xl shadow-gray-200/50 bg-white hover:translate-y-[-8px] transition-all duration-700 p-10 md:p-14 relative">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
                      <div className="space-y-8 flex-1">
                        <div className="flex flex-wrap items-center gap-6">
                          <span className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] italic border border-current/10 shadow-sm ${config.color}`}>
                            {config.label}
                          </span>
                          <span className="text-[10px] text-gray-300 font-black uppercase tracking-[0.4em] italic bg-gray-50 px-5 py-2.5 rounded-xl border border-gray-100">
                            CONTRACT::{order._id?.substring(0, 14).toUpperCase()}
                          </span>
                        </div>

                        <div className="space-y-3">
                          <h3 className="text-5xl font-black text-gray-950 tracking-tighter italic group-hover:text-warning transition-colors leading-none uppercase">
                            {order.listingId?.productName}
                          </h3>
                          <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] italic">
                            {order.listingId?.quantity} {order.listingId?.unit} · {order.distance || '—'} HAUL
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6 border-t border-gray-50">
                          <div className="space-y-4 group/loc">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] italic flex items-center gap-3"><MapPin size={14} className="text-success" /> PICKUP_NODE</p>
                            <p className="text-2xl font-black text-gray-950 italic tracking-tighter leading-none group-hover/loc:text-success transition-colors uppercase">{order.farmerId?.name}</p>
                          </div>
                          <div className="space-y-4 group/loc">
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] italic flex items-center gap-3"><MapPin size={14} className="text-warning" /> DELIVERY_HUB</p>
                            <p className="text-2xl font-black text-gray-950 italic tracking-tighter leading-none group-hover/loc:text-warning transition-colors uppercase">{order.buyerId?.businessName}</p>
                          </div>
                        </div>
                      </div>

                      <div className="w-full lg:w-72 p-10 bg-gray-950 text-white rounded-[3rem] shadow-2xl shadow-gray-950/20 group-hover:bg-warning transition-all duration-700 relative overflow-hidden shrink-0">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] italic mb-4">FREIGHT_CAPITAL</p>
                        <p className="text-5xl font-black tracking-tighter italic leading-none mb-4">₹{order.freightCharge?.toLocaleString()}</p>
                        <div className="flex items-center gap-3 text-[10px] font-black text-white/40 uppercase tracking-[0.3em] italic">
                          <Zap size={14} className="fill-current animate-pulse" /> ESCROW_SECURED
                        </div>
                        <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none">
                          <IndianRupee size={80} />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-10 pt-10 border-t border-gray-50">
                      <div className="flex items-center gap-4 text-[12px] font-black uppercase tracking-[0.5em] italic text-gray-400 group-hover:text-warning transition-colors">
                        VIEW_TRIP_DETAILS <ArrowUpRight size={24} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
                      </div>
                    </div>
                    <div className="absolute inset-0 pointer-events-none bg-scanline opacity-[0.01]"></div>
                  </Link>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Protocol Tip Panel */}
      <div className="px-4">
        <div className="stitch-card p-12 md:p-16 bg-warning/5 border border-warning/10 shadow-2xl shadow-warning/5 relative overflow-hidden group">
          <div className="flex items-start gap-10 relative z-10">
            <div className="w-24 h-24 bg-warning/10 text-warning rounded-[2.5rem] flex items-center justify-center shrink-0 border border-warning/20 shadow-inner group-hover:rotate-12 transition-transform duration-700">
              <AlertCircle size={48} strokeWidth={1.5} />
            </div>
            <div className="space-y-4">
              <h4 className="font-black text-3xl text-gray-950 italic tracking-tighter uppercase leading-none">Safety Protocol</h4>
              <p className="text-xl font-medium text-gray-400 italic leading-relaxed max-w-3xl">
                Always scan the <span className="font-black text-gray-950 uppercase">Farmer QR handover token</span> before initiating your trip. This secures your freight payment and enables real-time IoT cargo verification through the neural quality pipeline.
              </p>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-12 text-warning/5 pointer-events-none">
            <Shield size={200} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedOrdersPage;
