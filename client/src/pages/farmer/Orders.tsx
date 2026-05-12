import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Clock, 
  ShoppingBag,
  ChevronRight,
  ArrowRight,
  IndianRupee,
  ShieldCheck,
  Zap,
  MoreVertical,
  Scale
} from 'lucide-react';
import apiClient from '../../services/api';
import { formatCurrency } from '../../lib/utils';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await apiClient.get('/farmer/orders');
        const data = res.data.data || [];
        setOrders(Array.isArray(data) ? data : []);
        
        if (Array.isArray(data) && data.length === 0) {
          // Mock data for demo
          setOrders([
            {
              _id: 'ORD-1122',
              cropName: 'Basmati Rice (Organic)',
              quantity: 50,
              unit: 'Quintal',
              agreedPrice: 4250,
              escrowState: 'PAID_ESCROW',
              createdAt: new Date(Date.now() - 86400000),
              buyerName: 'Global Grains Pvt Ltd'
            },
            {
              _id: 'ORD-1123',
              cropName: 'Golden Wheat',
              quantity: 120,
              unit: 'Quintal',
              agreedPrice: 2180,
              escrowState: 'COMPLETED',
              createdAt: new Date(Date.now() - 86400000 * 5),
              buyerName: 'Mandi Direct'
            }
          ]);
        }
      } catch (e) {
        console.error('Error fetching orders', e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'DISPUTED': return 'bg-red-50 text-red-600 border-red-100';
      case 'IN_TRANSIT': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-orange-50 text-orange-600 border-orange-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
            <span>Marketplace</span>
            <ChevronRight size={10} />
            <span className="text-gray-900">Sales Registry</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900">Orders & Settlements</h1>
        </div>
        
        <div className="flex gap-4 p-4 bg-emerald-50 rounded-[2rem] border border-emerald-100 shadow-sm">
          <div className="px-6 border-r border-emerald-200">
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Pending Payout</p>
            <p className="text-2xl font-black text-emerald-900">₹2.1L</p>
          </div>
          <div className="px-6">
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Total Sales</p>
            <p className="text-2xl font-black text-emerald-900">₹12.4L</p>
          </div>
        </div>
      </div>

      {/* List Display */}
      <div className="space-y-6">
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-32 bg-white rounded-[2.5rem] animate-pulse border border-gray-50" />
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <div key={order._id} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-emerald-100/30 transition-all group flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-[2rem] bg-gray-50 flex items-center justify-center text-gray-200 border border-gray-100 shadow-inner group-hover:scale-110 transition-transform">
                    <Package size={32} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusVariant(order.escrowState)}`}>
                        {order.escrowState.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest">ID: #{order._id?.slice(-6)}</span>
                    </div>
                    <h4 className="text-2xl font-black text-gray-900">{order.cropName}</h4>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-2 mt-1">
                      Buyer: <span className="text-emerald-600">{order.buyerName || 'Verified Buyer'}</span> • {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-12 px-10 lg:border-x lg:border-gray-50">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Volume</p>
                    <p className="text-sm font-black text-gray-900 flex items-center gap-2">
                      <Scale size={14} className="text-emerald-600" /> {order.quantity} {order.unit || 'Qtl'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Settlement</p>
                    <p className="text-lg font-black text-gray-900">{formatCurrency(order.quantity * order.agreedPrice)}</p>
                  </div>

                  <div className="hidden md:block">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Protection</p>
                    <p className="text-sm font-black text-emerald-600 flex items-center gap-2">
                      <ShieldCheck size={14} /> Escrow Secured
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-gray-600 transition-all">
                    <MoreVertical size={20} />
                  </button>
                  <button className="px-8 py-5 bg-gray-900 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-gray-100 flex items-center gap-3">
                    View Details <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[4rem] border border-dashed border-gray-200">
            <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag size={64} className="text-emerald-400 opacity-50" />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black text-gray-900">No sales history yet</h3>
              <p className="text-gray-500 font-medium max-w-sm mx-auto">
                Start accepting offers for your produce to see your sales registry populate here.
              </p>
            </div>
            <Link 
              to="/farmer/listings" 
              className="inline-flex px-12 py-5 bg-gray-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all mt-10 shadow-xl shadow-gray-100"
            >
              Check My Listings
            </Link>
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="bg-gray-900 rounded-[3rem] p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 group">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-400">
            <Zap size={14} /> Verified Payments
          </div>
          <h2 className="text-4xl font-black leading-tight max-w-lg">
            Guaranteed Settlement. No Hidden Deductions.
          </h2>
          <p className="text-gray-400 font-medium max-w-md leading-relaxed">
            Smart-Kissan uses Polygon blockchain to lock buyer funds. Your payout is released automatically within 24 hours of delivery confirmation.
          </p>
        </div>
        
        <div className="relative z-10 grid grid-cols-2 gap-8 shrink-0">
          <div className="text-center p-8 bg-white/5 rounded-[2.5rem] border border-white/5 backdrop-blur-sm">
            <p className="text-5xl font-black text-emerald-500 mb-2">24<span className="text-2xl text-white">h</span></p>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Max Settlement</p>
          </div>
          <div className="text-center p-8 bg-white/5 rounded-[2.5rem] border border-white/5 backdrop-blur-sm">
            <p className="text-5xl font-black text-emerald-500 mb-2">0<span className="text-2xl text-white">%</span></p>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Hidden Fees</p>
          </div>
        </div>

        {/* Decorative */}
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-600 rounded-full blur-[120px] opacity-10 group-hover:opacity-20 transition-opacity duration-1000"></div>
      </div>
    </div>
  );
};

export default Orders;

