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
  FileText
} from 'lucide-react';
// @ts-ignore
import buyerService from '../../services/buyerService';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import StatusBadge from '../../components/common/StatusBadge';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

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
      // Mock data for demo
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
            images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80'] 
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
            images: ['https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=400&q=80'] 
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
    <div className="flex items-center justify-center h-[60vh] fade-in">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 border-4 border-secondary-100 border-t-secondary-600 rounded-full animate-spin mx-auto shadow-2xl"></div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 italic">Auditing Procurement Vault...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">
            <History size={14} />
            <span>Market Ledger</span>
            <ChevronRight size={10} className="text-gray-300" />
            <span className="text-gray-400">Order Vault</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight italic leading-none">
            Your <span className="not-italic text-secondary">Procurement.</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-md italic">Direct-from-farm contracts and real-time settlement tracking.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="stitch-card p-6 flex items-center gap-6 bg-white shadow-xl shadow-gray-200/50">
            <div className="w-16 h-16 bg-secondary-50 text-secondary rounded-2xl flex items-center justify-center shadow-inner">
              <Activity size={32} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Active Pipeline</p>
              <p className="text-2xl font-bold text-gray-900 italic tracking-tighter">
                {orders.filter(o => ['IN_TRANSIT', 'PAID_ESCROW'].includes(o.escrowState)).length} Active
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation & Search */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
        <div className="flex p-2 bg-gray-50 rounded-[2.5rem] border border-gray-100 w-full lg:w-auto shadow-inner">
          {[
            { label: 'All Contracts', value: 'all' },
            { label: 'Pipeline', value: 'PENDING_PAYMENT' },
            { label: 'Transit', value: 'IN_TRANSIT' },
            { label: 'Settled', value: 'COMPLETED' }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex-1 lg:flex-none px-8 py-5 rounded-[2rem] text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.value 
                  ? 'bg-white text-secondary shadow-xl shadow-secondary-100' 
                  : 'text-gray-400 hover:text-secondary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-secondary transition-colors" size={24} />
          <input 
            type="text" 
            placeholder="Audit by ID, crop, or location..." 
            className="w-full pl-20 pr-8 py-6 bg-white border border-gray-100 rounded-[2.5rem] focus:ring-8 focus:ring-secondary-50 outline-none font-bold text-gray-900 placeholder:text-gray-300 shadow-xl shadow-gray-100/50"
          />
        </div>
      </div>

      {/* Order Stream */}
      <div className="space-y-10">
        <AnimatePresence mode="popLayout">
          {orders.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="stitch-card py-32 text-center space-y-10 bg-white"
            >
              <div className="w-48 h-48 bg-gray-50 rounded-full flex items-center justify-center mx-auto relative shadow-inner">
                <Package size={80} strokeWidth={1} className="text-gray-200" />
                <div className="absolute inset-0 bg-secondary rounded-full opacity-5 animate-pulse"></div>
              </div>
              <div className="space-y-3">
                <h3 className="text-4xl font-bold text-gray-900 italic tracking-tight">No Active <span className="not-italic text-secondary">Contracts.</span></h3>
                <p className="text-gray-400 font-medium max-w-sm mx-auto text-lg italic">Your procurement vault is empty. Start sourcing from verified farmer clusters.</p>
              </div>
              <Link to="/buyer/search" className="btn btn-secondary inline-flex px-12 py-6 rounded-[2rem] shadow-2xl shadow-secondary-200">
                Explore Direct Marketplace
              </Link>
            </motion.div>
          ) : (
            orders.map((order, index) => (
              <motion.div 
                key={order._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="stitch-card group overflow-hidden border-none shadow-2xl shadow-gray-200/40 hover:shadow-secondary-900/10 transition-all duration-500">
                  <div className="p-10 md:p-14">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
                      <div className="flex gap-10 items-start">
                        <div className="w-40 h-40 bg-gray-50 rounded-[3rem] overflow-hidden border border-gray-100 shadow-inner group-hover:scale-110 transition-transform duration-1000 shrink-0">
                          {order.listingId?.images?.[0] ? (
                            <img src={order.listingId.images[0]} alt={order.listingId.productName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-secondary-50 text-secondary-200"><Package size={64} /></div>
                          )}
                        </div>
                        <div className="space-y-5">
                          <div className="flex flex-wrap items-center gap-4">
                            <StatusBadge status={order.escrowState} variant={getStatusVariant(order.escrowState)} />
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                              TX: {order._id?.substring(0, 12)}
                            </span>
                          </div>
                          <h3 className="text-4xl font-bold text-gray-900 tracking-tight italic group-hover:text-secondary transition-colors leading-none">
                            {order.listingId?.productName}
                          </h3>
                          <div className="flex items-center gap-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">
                            <Clock size={14} className="text-secondary" />
                            Signed {formatDateTime(order.createdAt)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right w-full lg:w-auto p-10 bg-gray-900 rounded-[3rem] text-white shadow-2xl shadow-gray-900/10 group-hover:bg-secondary transition-colors duration-700">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 group-hover:text-white/60">Settlement Amount</p>
                        <p className="text-5xl font-bold tracking-tighter italic mb-2">
                          {formatCurrency(order.totalAmount)}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest group-hover:text-white/80">
                          {order.quantity} Units • {formatCurrency(order.pricePerUnit)} / UNIT
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-14 mt-14 border-y border-gray-50">
                      <div className="space-y-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
                          <MapPin size={14} /> Destination
                        </p>
                        <div>
                          <p className="text-xl font-bold text-gray-900 tracking-tight italic">{order.deliveryAddress?.city}</p>
                          <p className="text-sm font-medium text-gray-400">{order.deliveryAddress?.state} Logistics Hub</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500 flex items-center gap-2">
                          <Truck size={14} /> Logistics Rail
                        </p>
                        <div>
                          <p className="text-xl font-bold text-gray-900 tracking-tight italic">{order.agencyId?.agencyName || 'Selecting Agency'}</p>
                          <p className="text-sm font-medium text-gray-400">Verified Direct Carrier</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-success flex items-center gap-2">
                          <Shield size={14} /> Smart Contract
                        </p>
                        <div>
                          <p className="text-xl font-bold text-gray-900 tracking-tight italic">Secured in Escrow</p>
                          <div className="flex items-center gap-2 text-success text-[10px] font-bold uppercase">
                            <Zap size={10} className="fill-success" /> Proof of Funds Active
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between mt-12 gap-8">
                      <div className="flex gap-4 w-full md:w-auto">
                        <button className="p-6 bg-gray-50 rounded-2xl text-gray-400 hover:text-secondary hover:bg-secondary-50 transition-all border border-gray-100 shadow-inner">
                          <MoreVertical size={24} />
                        </button>
                        <button className="flex-1 md:flex-none px-10 py-6 bg-white border border-gray-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 hover:border-gray-300 transition-all flex items-center justify-center gap-4 shadow-sm group/btn">
                          <FileText size={18} className="group-hover/btn:text-secondary transition-colors" />
                          Audit Ledger
                        </button>
                      </div>
                      
                      <Link 
                        to={`/buyer/orders/${order._id}/track`}
                        className="w-full md:w-auto px-16 py-7 bg-gray-900 text-white rounded-[2rem] text-[10px] font-bold uppercase tracking-widest hover:bg-secondary transition-all flex items-center justify-center gap-4 shadow-2xl shadow-gray-900/10 group/track"
                      >
                        Track Shipment Rail
                        <ArrowUpRight size={20} className="group-hover/track:translate-x-1 group-hover/track:-translate-y-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                  
                  {order.escrowState === 'DELIVERED' && !order.rated && (
                    <div className="bg-secondary-50 p-12 flex flex-col md:flex-row justify-between items-center gap-10 border-t border-secondary-100 relative overflow-hidden">
                      <div className="flex items-center gap-10 relative z-10">
                        <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center border border-secondary-100 rotate-6 shrink-0">
                          <Star size={36} className="text-secondary fill-secondary" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-bold text-2xl text-secondary italic tracking-tight uppercase leading-none">Validate Batch Quality</h4>
                          <p className="text-sm font-medium text-secondary-900/60 max-w-md">Contribute to the market trust index by reviewing the delivered produce.</p>
                        </div>
                      </div>
                      <button className="w-full md:w-auto px-12 py-6 bg-secondary text-white rounded-[1.5rem] text-[10px] font-bold uppercase tracking-widest hover:bg-gray-900 shadow-2xl shadow-secondary-900/20 transition-all relative z-10">
                        Submit Performance Review
                      </button>
                      <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/40 rounded-full blur-[100px]"></div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Security Widgets */}
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="bg-emerald-600 rounded-[4rem] p-16 text-white relative overflow-hidden group shadow-2xl shadow-emerald-900/20">
          <div className="relative z-10 space-y-8">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/20">
              <Shield size={40} className="text-white" />
            </div>
            <div className="space-y-4">
              <h3 className="text-4xl font-bold italic tracking-tight leading-tight">Immutable <span className="not-italic">Escrow Protection.</span></h3>
              <p className="text-emerald-50 text-lg font-medium opacity-80 leading-relaxed italic">
                Your capital is locked in non-custodial smart contracts. Disbursement only occurs upon verified delivery.
              </p>
            </div>
            <button className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-emerald-200 group-hover:text-white transition-all">
              Review Protocol <ArrowRight size={16} />
            </button>
          </div>
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000"></div>
        </div>

        <div className="bg-secondary-900 rounded-[4rem] p-16 text-white relative overflow-hidden group shadow-2xl shadow-secondary-900/40">
          <div className="relative z-10 space-y-8">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/10">
              <Layers size={40} className="text-secondary" />
            </div>
            <div className="space-y-4">
              <h3 className="text-4xl font-bold italic tracking-tight leading-tight">IoT Telemetry <span className="not-italic">Audit.</span></h3>
              <p className="text-secondary-100 text-lg font-medium opacity-80 leading-relaxed italic">
                Monitor temperature, humidity, and location in real-time across the Pan-India logistics rail.
              </p>
            </div>
            <button className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-secondary-400 group-hover:text-white transition-all">
              Logistics Framework <ArrowRight size={16} />
            </button>
          </div>
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-secondary/20 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000"></div>
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;
