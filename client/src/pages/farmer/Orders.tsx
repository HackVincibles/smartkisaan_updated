import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle2, AlertCircle, Search, Clock } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import apiClient from '../../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await apiClient.get('/farmer/orders');
        setOrders(res.data.data || []);
      } catch (e) {
        console.error('Error fetching orders', e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      case 'DISPUTED': return 'bg-red-100 text-red-700';
      case 'IN_TRANSIT': return 'bg-blue-100 text-blue-700';
      default: return 'bg-orange-100 text-orange-700';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Orders & Sales</h1>
          <p className="text-gray-500 mt-1">Track your sales, payments, and delivery status</p>
        </header>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-24 bg-white rounded-2xl animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div key={order._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                    <Package className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{order.cropName}</h4>
                    <p className="text-sm text-gray-500 font-medium">Qty: {order.quantity} KG â€¢ â‚¹{order.agreedPrice}/KG</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-8">
                  <div className="text-center">
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Payout</div>
                    <div className="text-lg font-black text-gray-900">â‚¹{order.quantity * order.agreedPrice}</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Status</div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.escrowState)}`}>
                      {order.escrowState.replace('_', ' ')}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Date</div>
                    <div className="text-sm font-bold text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>

                <button className="px-6 py-3 bg-gray-50 text-gray-900 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all flex items-center gap-2">
                  View Details <Clock className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">No Orders Yet</h3>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto px-4">
              Once you accept a bid, your orders will appear here for tracking.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Orders;

