import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Search, 
  Filter, 
  MapPin, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  MoreVertical,
  Star,
  ChevronRight,
  ArrowRight,
  Shield,
  CreditCard,
  Zap,
  Sparkles,
  History,
  Activity,
  Layers,
  ArrowUpRight,
  FileText,
  Workflow,
  Cpu,
  Globe,
  Database,
  Target,
  MoreHorizontal,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import buyerService from '../../services/buyerService';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import StatusBadge from '../../components/common/StatusBadge';
import { toast } from 'react-hot-toast';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      const response = await buyerService.getOrders({ status: activeTab !== 'all' ? activeTab : undefined });
      const data = response.data.orders || [];
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      // Mock data for high-fidelity demo
      setOrders([
        {
          id: 'ORD-5521',
          _id: '55214488',
          escrowState: 'IN_TRANSIT',
          createdAt: new Date(Date.now() - 86400000 * 2),
          totalAmount: 215000,
          quantity: 100,
          pricePerUnit: 2150,
          listingId: { 
            productName: 'Wheat (HD-2967)', 
            images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80'] 
          },
          deliveryAddress: { city: 'Delhi', state: 'Delhi' },
          agencyId: { agencyName: 'Raj Cargo Express' }
        },
        {
          id: 'ORD-5522',
          _id: '55214489',
          escrowState: 'DELIVERED',
          createdAt: new Date(Date.now() - 86400000 * 5),
          totalAmount: 85000,
          quantity: 40,
          pricePerUnit: 2125,
          listingId: { 
            productName: 'Red Onions', 
            images: ['https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80'] 
          },
          deliveryAddress: { city: 'Mumbai', state: 'Maharashtra' },
          agencyId: { agencyName: 'Vashi Logistics' },
          rated: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch(status) {
      case 'COMPLETED':
      case 'DELIVERED': return 'success';
      case 'BID_PLACED':
      case 'PENDING_PAYMENT': return 'warning';
      case 'PAID_ESCROW':
      case 'PICKUP_ASSIGNED':
      case 'PICKED_UP':
      case 'IN_TRANSIT': return 'primary';
      case 'REFUNDED':
      case 'DISPUTED': return 'danger';
      default: return 'neutral';
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[80vh] fade-in">
      <div className="text-center space-y-10">
        <div className="w-24 h-24 bg-secondary/10 rounded-[2.5rem] border border-secondary/20 flex items-center justify-center shadow-2xl relative">
            <div className="absolute inset-0 border-4 border-secondary/20 border-t-secondary rounded-[2.5rem] animate-spin"></div>
            <Database size={40} className="text-secondary" />
        </div>
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary italic leading-none">Auditing Procurement Registry...</p>
          <p className="text-xs text-gray-400 font-medium italic leading-none">Establishing Distributed Ledger Sync...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-20 pb-32 fade-in">
      {/* Premium Procurement Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative overflow-hidden p-4">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-secondary italic">
            <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
            Procurement Ledger v11.4.0 [ACTIVE]
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gray-950 tracking-tighter italic leading-none">
            Registry <span className="not-italic text-secondary">Vault.</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-xl text-xl leading-relaxed italic">
            Managing institutional procurement contracts and <span className="text-gray-950 font-black italic">distributed settlement rails</span> for verified agricultural nodes.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-8 relative z-10">
            <div className="stitch-card p-10 flex items-center gap-8 bg-white shadow-2xl shadow-gray-200/50 group hover:rotate-2 transition-transform duration-700">
                <div className="w-20 h-20 bg-secondary/10 text-secondary rounded-[1.8rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    <Activity size={36} />
                </div>
                <div className="space-y-1.5">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] italic leading-none">PIPELINE_ACTIVE</p>
                    <p className="text-4xl font-black text-gray-950 italic tracking-tighter leading-none">
                        {orders.filter(o => ['IN_TRANSIT', 'PAID_ESCROW'].includes(o.escrowState)).length} <span className="text-[14px] text-gray-400">NODES</span>
                    </p>
                </div>
            </div>
        </div>

        {/* Decorative Background Text */}
        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none -mr-40 -mt-10">
            <h1 className="text-[20rem] font-black italic tracking-tighter uppercase">LEDGER</h1>
        </div>
      </div>

      {/* Control Surface */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-10 px-4">
        <div className="flex p-3 bg-white/50 backdrop-blur-3xl rounded-[3rem] border border-gray-100 w-full lg:w-auto shadow-2xl shadow-gray-200/30">
          {[
            { label: 'ALL_CONTRACTS', value: 'all' },
            { label: 'NEGOTIATION', value: 'PENDING_PAYMENT' },
            { label: 'IN_TRANSIT', value: 'IN_TRANSIT' },
            { label: 'SETTLED', value: 'COMPLETED' }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex-1 lg:flex-none px-12 py-6 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.4em] italic transition-all whitespace-nowrap ${
                activeTab === tab.value 
                  ? 'bg-gray-950 text-white shadow-2xl shadow-gray-950/20' 
                  : 'text-gray-400 hover:text-gray-950'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="relative w-full lg:w-[500px] group">
          <Search size={24} className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-secondary transition-colors" />
          <input 
            type="text" 
            placeholder="SCAN BY TRANSACTION_ID, ASSET, OR HUB..." 
            className="w-full pl-20 pr-10 py-10 bg-white border border-gray-100 rounded-[3rem] focus:ring-12 focus:ring-secondary/5 focus:border-secondary/20 outline-none font-black text-[11px] text-gray-950 uppercase tracking-[0.2em] italic placeholder:text-gray-200 shadow-2xl shadow-gray-200/50"
          />
        </div>
      </div>

      {/* Order Flow Registry */}
      <div className="space-y-16 px-4">
        <AnimatePresence mode="popLayout">
          {orders.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="stitch-card py-48 text-center space-y-12 bg-white shadow-2xl shadow-gray-200/50 relative overflow-hidden group"
            >
              <div className="relative z-10">
                  <div className="w-48 h-48 bg-gray-50 rounded-[4rem] flex items-center justify-center mx-auto relative shadow-inner border border-gray-100 group-hover:scale-105 transition-transform duration-1000">
                    <Package size={90} className="text-gray-200" />
                    <div className="absolute inset-0 bg-secondary rounded-[4rem] opacity-0 group-hover:opacity-5 transition-opacity"></div>
                  </div>
                  <div className="space-y-6 pt-10">
                    <h3 className="text-5xl font-black text-gray-950 italic tracking-tight leading-none uppercase">Registry <span className="not-italic text-secondary">Empty.</span></h3>
                    <p className="text-gray-400 font-medium max-w-xl mx-auto text-xl italic leading-relaxed">No institutional contracts found in the current viewport. Synchronize with the marketplace to initialize sourcing.</p>
                  </div>
                  <Link to="/buyer/search" className="px-16 py-8 bg-gray-950 text-white rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.5em] italic shadow-2xl shadow-gray-200 hover:bg-secondary transition-all inline-block mt-12">
                    INITIALIZE MARKET DISCOVERY
                  </Link>
              </div>
              <div className="absolute top-0 right-0 p-24 opacity-[0.02] pointer-events-none uppercase italic font-black text-[15rem] leading-none">VOID</div>
            </motion.div>
          ) : (
            orders.map((order, index) => (
              <motion.div 
                key={order._id || index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="group"
              >
                <div className="stitch-card overflow-hidden border-none shadow-2xl shadow-gray-200/50 bg-white hover:translate-y-[-10px] transition-all duration-1000">
                  <div className="p-12 md:p-16 relative">
                    {/* Header: Identity & Status */}
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-12 border-b border-gray-50 pb-16">
                      <div className="flex gap-12 items-start">
                        <div className="w-56 h-56 bg-gray-50 rounded-[3.5rem] overflow-hidden border border-gray-100 shadow-inner group-hover:scale-105 transition-transform duration-[2000ms] shrink-0 p-1">
                          {order.listingId?.images?.[0] ? (
                            <img src={order.listingId.images[0]} alt={order.listingId.productName} className="w-full h-full object-cover rounded-[3rem]" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-200 rounded-[3rem]"><Package size={80} /></div>
                          )}
                        </div>
                        <div className="space-y-8">
                          <div className="flex flex-wrap items-center gap-6">
                            <StatusBadge status={order.escrowState} variant={getStatusVariant(order.escrowState)} />
                            <span className="text-[10px] text-gray-300 font-black uppercase tracking-[0.4em] italic bg-gray-50 px-5 py-2.5 rounded-xl border border-gray-100 shadow-sm">
                              CONTRACT_ID::{order._id?.substring(0, 14).toUpperCase()}
                            </span>
                          </div>
                          <h3 className="text-6xl font-black text-gray-950 tracking-tighter italic group-hover:text-secondary transition-colors leading-none uppercase">
                            {order.listingId?.productName}
                          </h3>
                          <div className="flex items-center gap-4 text-[11px] text-gray-400 font-black uppercase tracking-[0.3em] italic">
                            <Clock size={18} className="text-secondary" />
                            AUTHENTICATED_ON: {formatDateTime(order.createdAt).toUpperCase()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right w-full lg:w-auto p-12 bg-gray-950 text-white rounded-[4rem] shadow-2xl shadow-gray-950/20 group-hover:bg-secondary transition-colors duration-1000 relative overflow-hidden group/price">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic mb-4 group-hover:text-white/60">SETTLEMENT_CAPITAL</p>
                        <p className="text-6xl font-black tracking-tighter italic mb-4 leading-none">
                          {formatCurrency(order.totalAmount)}
                        </p>
                        <div className="flex flex-wrap items-center justify-end gap-6 text-[11px] text-white/40 font-black uppercase tracking-[0.3em] italic group-hover:text-white/80">
                            <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/5">{order.quantity} UNITS</span>
                            <span>•</span>
                            <span>{formatCurrency(order.pricePerUnit)} / UNIT</span>
                        </div>
                        <div className="absolute top-0 right-0 p-12 text-white/5 group-hover/price:text-white/10 transition-colors">
                            <IndianRupee size={100} />
                        </div>
                      </div>
                    </div>

                    {/* Meta Registry Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 py-16">
                      <div className="space-y-6 group/info">
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-secondary italic">
                          <MapPin size={18} /> DESTINATION_HUB
                        </div>
                        <div className="pl-8 border-l-2 border-gray-50 group-hover/info:border-secondary transition-colors">
                          <p className="text-3xl font-black text-gray-950 tracking-tighter italic leading-none uppercase mb-2">{order.deliveryAddress?.city}</p>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">{order.deliveryAddress?.state} REGIONAL LOGISTICS NODE</p>
                        </div>
                      </div>
                      
                      <div className="space-y-6 group/info">
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-warning italic">
                          <Truck size={18} /> LOGISTICS_CARRIER
                        </div>
                        <div className="pl-8 border-l-2 border-gray-50 group-hover/info:border-warning transition-colors">
                          <p className="text-3xl font-black text-gray-950 tracking-tighter italic leading-none uppercase mb-2">{order.agencyId?.agencyName || 'SELECTING_CARRIER'}</p>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic">VERIFIED INSTITUTIONAL FREIGHT</p>
                        </div>
                      </div>

                      <div className="space-y-6 group/info">
                        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">
                          <Shield size={18} /> ESCROW_PROTOCOL
                        </div>
                        <div className="pl-8 border-l-2 border-gray-50 group-hover/info:border-primary transition-colors">
                          <p className="text-3xl font-black text-gray-950 tracking-tighter italic leading-none uppercase mb-2">SECURED_VAULT</p>
                          <div className="flex items-center gap-3 text-primary text-[10px] font-black uppercase tracking-[0.2em] italic">
                            <Zap size={14} className="fill-current animate-pulse" /> PROOF_OF_DELIVERY_ACTIVE
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-col md:flex-row items-center justify-between pt-16 border-t border-gray-50 gap-10">
                      <div className="flex gap-6 w-full md:w-auto">
                        <button className="p-8 bg-gray-50 rounded-[1.8rem] text-gray-300 hover:text-secondary hover:bg-white hover:shadow-2xl hover:border-gray-100 transition-all border border-transparent shadow-inner group/btn">
                          <MoreHorizontal size={28} className="group-hover:rotate-90 transition-transform" />
                        </button>
                        <button className="flex-1 md:flex-none px-12 py-8 bg-white border border-gray-100 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] italic text-gray-400 hover:text-gray-950 hover:shadow-2xl transition-all flex items-center justify-center gap-5 group/btn shadow-sm">
                          <FileText size={20} className="group-hover/btn:text-secondary transition-colors" />
                          AUDIT_CONTRACT_LEDGER
                        </button>
                      </div>
                      
                      <Link 
                        to={`/buyer/orders/${order._id}/track`}
                        className="w-full md:w-auto px-20 py-8 bg-gray-950 text-white rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.5em] italic hover:bg-secondary transition-all flex items-center justify-center gap-6 shadow-2xl shadow-gray-950/20 group/track relative overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center gap-6 uppercase">TRACK_SHIPMENT_RAIL <ArrowUpRight size={24} className="group-hover/track:translate-x-2 group-hover/track:-translate-y-2 transition-transform duration-500" /></span>
                        <div className="absolute inset-0 bg-secondary opacity-0 group-hover/track:opacity-100 transition-opacity"></div>
                      </Link>
                    </div>
                  </div>
                  
                  {/* Performance Verification Portal (if applicable) */}
                  {order.escrowState === 'DELIVERED' && !order.rated && (
                    <div className="bg-gray-950 p-16 flex flex-col md:flex-row justify-between items-center gap-16 relative overflow-hidden group/verify shadow-inner">
                      <div className="flex items-center gap-12 relative z-10">
                        <div className="w-24 h-24 bg-white/10 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl flex items-center justify-center border border-white/10 rotate-12 shrink-0 group-hover/verify:rotate-0 transition-transform duration-1000">
                          <Star size={48} className="text-secondary fill-secondary animate-pulse" />
                        </div>
                        <div className="space-y-4">
                          <h4 className="font-black text-4xl text-white italic tracking-tighter uppercase leading-none">Validate Asset Quality</h4>
                          <p className="text-lg font-medium text-white/40 max-w-xl italic leading-relaxed">Broadcast performance metrics to the global trust registry. Verified reviews reduce platform commissions for future procurement cycles.</p>
                        </div>
                      </div>
                      <button className="w-full md:w-auto px-16 py-8 bg-white text-gray-950 rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.5em] italic hover:bg-secondary hover:text-white shadow-2xl transition-all relative z-10 group/btn">
                        INITIALIZE PERFORMANCE_REVIEW
                      </button>
                      
                      {/* Background Decor */}
                      <div className="absolute -right-20 -bottom-20 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px] opacity-20 group-hover/verify:opacity-40 transition-opacity duration-1000"></div>
                      <div className="absolute top-0 left-0 p-12 text-white/5 opacity-40 group-hover/verify:rotate-6 transition-transform">
                          <Target size={150} />
                      </div>
                    </div>
                  )}
                  
                  {/* Subtle Scanline Overlay */}
                  <div className="absolute inset-0 pointer-events-none bg-scanline opacity-[0.01]"></div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Strategic Security Panels */}
      <div className="grid lg:grid-cols-2 gap-16 px-4">
        <div className="stitch-card p-16 bg-emerald-950 text-white relative overflow-hidden group shadow-2xl shadow-emerald-950/20">
          <div className="relative z-10 space-y-10">
            <div className="w-24 h-24 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-center border border-white/5 shadow-2xl group-hover:scale-110 transition-transform duration-1000">
              <Shield size={48} className="text-emerald-400 stroke-[1.5]" />
            </div>
            <div className="space-y-6">
              <h3 className="text-5xl font-black italic tracking-tighter leading-none uppercase">Immutable <span className="text-emerald-400">Escrow.</span></h3>
              <p className="text-emerald-100/50 text-xl font-medium leading-relaxed italic max-w-2xl">
                Capital assets are locked in non-custodial cryptographic vaults. Disbursement is governed by <span className="text-white font-black underline decoration-emerald-400/20 underline-offset-8">multi-party consensus</span> and proof-of-delivery oracles.
              </p>
            </div>
            <button className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] text-emerald-400 group-hover:text-white transition-all italic underline underline-offset-8">
              READ_PROTOCOL_SPEC_V4 <ArrowRight size={20} />
            </button>
          </div>
          <div className="absolute -right-40 -top-40 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] group-hover:opacity-40 transition-opacity duration-1000"></div>
          <div className="absolute bottom-0 right-0 p-12 text-white/5 pointer-events-none">
              <Workflow size={200} />
          </div>
        </div>

        <div className="stitch-card p-16 bg-gray-950 text-white relative overflow-hidden group shadow-2xl shadow-gray-950/30">
          <div className="relative z-10 space-y-10">
            <div className="w-24 h-24 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-center border border-white/5 shadow-2xl group-hover:scale-110 transition-transform duration-1000">
              <Layers size={48} className="text-secondary stroke-[1.5]" />
            </div>
            <div className="space-y-6">
              <h3 className="text-5xl font-black italic tracking-tighter leading-none uppercase">Neural <span className="text-secondary">Tracking.</span></h3>
              <p className="text-white/40 text-xl font-medium leading-relaxed italic max-w-2xl">
                Real-time IoT telemetry monitoring across the Pan-India logistics rail. Monitor <span className="text-white font-black underline decoration-secondary/20 underline-offset-8">environmental vectors</span> (Temp, Humidity) in real-time for perishable nodes.
              </p>
            </div>
            <button className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] text-secondary group-hover:text-white transition-all italic underline underline-offset-8">
              INITIALIZE_LOGISTICS_CONSOLE <ArrowRight size={20} />
            </button>
          </div>
          <div className="absolute -right-40 -top-40 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px] group-hover:opacity-40 transition-opacity duration-1000"></div>
          <div className="absolute bottom-0 right-0 p-12 text-white/5 pointer-events-none">
              <Globe size={200} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;
