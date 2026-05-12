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
  ChevronRight
} from 'lucide-react';
// @ts-ignore
import buyerService from '../../services/buyerService';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import StatusBadge from '../../components/common/StatusBadge';
import toast from 'react-hot-toast';

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
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
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

  if (loading) return <div className="flex items-center justify-center h-96">Loading orders...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">My Orders</h1>
          <p className="text-gray-500 text-sm">Track and manage your purchases</p>
        </div>
        <Link to="/buyer/search" className="btn-primary py-2 text-sm flex items-center gap-2">
          <Search className="w-4 h-4" />
          Buy More
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-dark-300 rounded-lg w-fit overflow-x-auto">
        {[
          { label: 'All', value: 'all' },
          { label: 'Pending', value: 'PENDING_PAYMENT' },
          { label: 'In Transit', value: 'IN_TRANSIT' },
          { label: 'Delivered', value: 'DELIVERED' },
          { label: 'Completed', value: 'COMPLETED' }
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === tab.value 
                ? 'bg-white dark:bg-dark-100 text-primary-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="card p-12 text-center text-gray-500">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-bold mb-2">No orders found</h3>
            <p className="text-sm">You haven't placed any orders in this category yet.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="card overflow-hidden hover:border-primary-200 transition-colors">
              <div className="p-5">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-dark-300 rounded-xl overflow-hidden">
                      {order.listingId?.images?.[0] ? (
                        <img src={order.listingId.images[0]} alt={order.listingId.productName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Package className="w-8 h-8 text-gray-300" /></div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <StatusBadge status={order.escrowState} variant={getStatusVariant(order.escrowState)} />
                        <span className="text-[10px] text-gray-400 font-bold">#{order._id?.substring(0, 8)}</span>
                      </div>
                      <h3 className="text-lg font-bold">{order.listingId?.productName || 'Product'}</h3>
                      <p className="text-xs text-gray-500">Ordered on {formatDateTime(order.createdAt).split(',')[0]}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-gray-900 dark:text-white">{formatCurrency(order.totalAmount)}</p>
                    <p className="text-xs text-gray-500 font-medium">{order.quantity} Quintal @ {formatCurrency(order.pricePerUnit)}/Qtl</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-dark-300">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MapPin className="w-4 h-4" />
                      {order.deliveryAddress?.city}, {order.deliveryAddress?.state}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Truck className="w-4 h-4" />
                      {order.agencyId?.agencyName || 'Pending Assignment'}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button className="p-2 rounded-lg hover:bg-gray-100">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                    <Link 
                      to={`/buyer/orders/${order.id}/track`}
                      className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg text-xs font-bold hover:bg-primary-100 transition-colors flex items-center gap-2"
                    >
                      Track Order
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
              
              {order.escrowState === 'DELIVERED' && !order.rated && (
                <div className="bg-yellow-50 dark:bg-yellow-900/10 p-3 border-t border-yellow-100 dark:border-yellow-900/20 flex justify-between items-center">
                  <p className="text-xs text-yellow-800 dark:text-yellow-400 font-medium flex items-center gap-2">
                    <Star className="w-4 h-4 fill-current" />
                    How was your experience? Rate this order to help the farmer.
                  </p>
                  <button className="text-xs font-black text-yellow-800 dark:text-yellow-400 uppercase tracking-widest hover:underline">
                    Rate Now
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
