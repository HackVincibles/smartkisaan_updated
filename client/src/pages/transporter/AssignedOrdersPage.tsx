import React, { useState, useEffect } from 'react';
import { 
  Truck, MapPin, Calendar, 
  ChevronRight, Search, Filter,
  Clock, Package, AlertCircle
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
// @ts-ignore
import transporterService from '../../services/transporterService';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

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
      // Mock data for demo
      setOrders([
        { 
          _id: '1', 
          escrowState: 'PICKUP_ASSIGNED', 
          listingId: { productName: 'Premium Wheat', unit: 'Quintal', quantity: 50 },
          farmerId: { name: 'Rajesh Kumar', phone: '9876543210' },
          buyerId: { name: 'Food Corp Ltd', businessName: 'FCL Jaipur' },
          createdAt: new Date()
        },
        { 
          _id: '2', 
          escrowState: 'IN_TRANSIT', 
          listingId: { productName: 'Organic Tomatoes', unit: 'KG', quantity: 200 },
          farmerId: { name: 'Amit Singh', phone: '9887766554' },
          buyerId: { name: 'FreshMart', businessName: 'FreshMart Gurgaon' },
          createdAt: new Date(Date.now() - 86400000)
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PICKUP_ASSIGNED': return 'bg-blue-100 text-blue-600';
      case 'PICKED_UP': return 'bg-orange-100 text-orange-600';
      case 'IN_TRANSIT': return 'bg-purple-100 text-purple-600';
      case 'DELIVERED': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Assigned Deliveries</h1>
            <p className="text-gray-500 mt-1">Manage your active and upcoming trips</p>
          </div>
          
          <div className="flex gap-2">
            <button className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2">
              <Filter size={18} />
              Filter
            </button>
            <button className="btn-primary flex items-center gap-2">
              <Truck size={18} />
              View Map
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by order ID, product or location..." 
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-1 focus:ring-primary-500"
          />
        </div>

        {/* Orders List */}
        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <div className="text-center py-24 bg-white rounded-[2.5rem]">
              <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500 font-medium tracking-wide">Loading your assignments...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="card bg-white p-16 text-center space-y-6">
              <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto">
                <Package size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900">No active assignments</h3>
                <p className="text-gray-500 max-w-sm mx-auto">New delivery requests will appear here once assigned. Keep your profile updated to get more leads.</p>
              </div>
              <button className="btn-primary">Browse Available Loads</button>
            </div>
          ) : (
            orders.map((order) => (
              <Link 
                to={`/transporter/trips/${order._id}`} 
                key={order._id} 
                className="card bg-white p-6 hover:shadow-xl hover:-translate-y-1 transition-all group border border-transparent hover:border-primary-100"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Left Section: Status & Order Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between lg:justify-start lg:gap-4">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyle(order.escrowState)}`}>
                        {order.escrowState.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-2xl font-black text-gray-900 group-hover:text-primary-600 transition-colors">
                        {order.listingId?.productName || 'Bulk Order'}
                      </h3>
                      <p className="text-gray-500 font-medium">
                        Order #{order._id.slice(-8).toUpperCase()} • {order.listingId?.quantity} {order.listingId?.unit}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0 mt-1">
                          <MapPin size={16} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pickup</p>
                          <p className="text-sm font-bold text-gray-900 truncate">{order.farmerId?.name || 'Farmer Location'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                          <MapPin size={16} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delivery</p>
                          <p className="text-sm font-bold text-gray-900 truncate">{order.buyerId?.businessName || 'Buyer Location'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Section: Actions & Metrics */}
                  <div className="lg:w-64 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-8">
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Estimated Earnings</p>
                        <p className="text-2xl font-black text-gray-900">₹4,500</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Active Tracking</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between lg:justify-end gap-4 mt-6">
                      <span className="text-sm font-bold text-primary-600 group-hover:mr-2 transition-all">View Details</span>
                      <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Tip Card */}
        <div className="card bg-orange-50 border border-orange-100 p-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
            <AlertCircle size={24} />
          </div>
          <div>
            <h4 className="font-bold text-orange-900">Transporter Tip</h4>
            <p className="text-sm text-orange-800 opacity-80 leading-relaxed">
              Always ensure you have the Farmer's QR code scanned before starting your trip. This protects your payment and verifies the cargo quality through AI.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AssignedOrdersPage;
