import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Package, 
  Truck, 
  TrendingUp, 
  Star, 
  Clock, 
  CheckCircle,
  Search,
  ArrowRight
} from 'lucide-react';
// @ts-ignore
import buyerService from '../../services/buyerService';
import { formatCurrency, formatRelativeTime } from '../../lib/utils';
import ProductCard from '../../components/buyer/ProductCard';
import toast from 'react-hot-toast';

const BuyerDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalSpent: 0,
    savedSearches: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        buyerService.getOrders({ limit: 5 }),
        buyerService.searchProducts({ limit: 6, sort: 'trending' })
      ]);
      
      const orders = ordersRes.data.orders || [];
      setRecentOrders(orders);
      setStats({
        totalOrders: ordersRes.data.total || 0,
        pendingOrders: orders.filter((o: any) => !['COMPLETED', 'REFUNDED'].includes(o.escrowState)).length,
        totalSpent: ordersRes.data.totalSpent || 0,
        savedSearches: 0
      });
      setRecommendedProducts(productsRes.data.products || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatusIcon = (status: string) => {
    switch(status) {
      case 'COMPLETED': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'IN_TRANSIT':
      case 'DELIVERED': return <Truck className="w-4 h-4 text-blue-500" />;
      case 'BID_PLACED':
      case 'PENDING_PAYMENT':
      case 'PAID_ESCROW': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl p-8 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-primary-100 mb-6">
          Discover fresh produce directly from farmers
        </p>
        <Link 
          to="/buyer/search" 
          className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          Browse Products
          <Search className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart className="w-8 h-8 text-primary-600" />
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
          <p className="text-sm text-gray-500">Total Orders</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <Truck className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-2xl font-bold">{stats.pendingOrders}</p>
          <p className="text-sm text-gray-500">Active Orders</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-2xl font-bold">{formatCurrency(stats.totalSpent)}</p>
          <p className="text-sm text-gray-500">Total Spent</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-8 h-8 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold">{stats.savedSearches}</p>
          <p className="text-sm text-gray-500">Saved Searches</p>
        </div>
      </div>

      <div className="card">
        <div className="p-4 border-b border-gray-200 dark:border-dark-300 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Recent Orders</h3>
          <Link to="/buyer/orders" className="text-primary-600 text-sm hover:underline">
            View all
          </Link>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-dark-300">
          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No orders yet</p>
              <Link to="/buyer/search" className="text-primary-600 text-sm mt-2 inline-block">
                Start shopping →
              </Link>
            </div>
          ) : (
            recentOrders.map((order, index) => (
              <div key={index} className="p-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  {getOrderStatusIcon(order.escrowState)}
                  <div>
                    <p className="font-medium">{order.listingId?.productName || 'Product'}</p>
                    <p className="text-sm text-gray-500">{order.quantity} {order.unit} • {formatRelativeTime(order.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{formatCurrency(order.totalAmount)}</span>
                  <Link 
                    to={`/buyer/orders/${order.id}/track`}
                    className="text-primary-600 hover:underline text-sm"
                  >
                    Track Order →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recommended for You</h3>
          <Link to="/buyer/search" className="text-primary-600 text-sm hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Link 
          to="/buyer/demand/create"
          className="card p-6 flex items-center justify-between hover:shadow-lg transition-all bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20"
        >
          <div>
            <h3 className="font-semibold mb-1">Create Demand</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Let suppliers know what you need</p>
          </div>
          <ArrowRight className="w-6 h-6 text-primary-600" />
        </Link>
        <Link 
          to="/buyer/disputes"
          className="card p-6 flex items-center justify-between hover:shadow-lg transition-all"
        >
          <div>
            <h3 className="font-semibold mb-1">Need Help?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Raise a dispute or contact support</p>
          </div>
          <ArrowRight className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
};

export default BuyerDashboard;
