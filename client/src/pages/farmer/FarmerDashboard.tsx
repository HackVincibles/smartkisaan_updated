import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  Package, 
  TrendingUp, 
  Users, 
  Truck, 
  Wallet, 
  BarChart3,
  CheckCircle,
  AlertCircle,
  Activity
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../lib/utils';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeListings: 0,
    totalBids: 0,
    pendingOrders: 0,
    totalEarnings: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Mock data - in real app, this would fetch from API
    setStats({
      activeListings: 12,
      totalBids: 8,
      pendingOrders: 3,
      totalEarnings: 45000
    });
    setRecentActivity([
      { id: 1, title: 'Wheat Order #123', status: 'COMPLETED', time: '2 hours ago', amount: 12000 },
      { id: 2, title: 'Rice Order #124', status: 'PENDING', time: '5 hours ago', amount: 8500 },
      { id: 3, title: 'Corn Order #125', status: 'IN_TRANSIT', time: '1 day ago', amount: 6700 }
    ]);
  }, []);

  const weatherData = {
    temperature: 28,
    humidity: 65,
    condition: 'Partly Cloudy',
    windSpeed: 12
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Smart<span className="text-green-600">Kissan</span></span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/farmer" className="text-green-600 font-medium">Dashboard</Link>
              <Link to="/farmer/listings" className="text-gray-600 hover:text-green-600 font-medium">My Products</Link>
              <Link to="/farmer/orders" className="text-gray-600 hover:text-green-600 font-medium">Orders</Link>
              <Link to="/farmer/profile" className="text-gray-600 hover:text-green-600 font-medium">Profile</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user?.name || 'Farmer'}</h3>
                  <p className="text-sm text-gray-600">Premium Member</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Listings</span>
                  <span className="font-semibold text-gray-900">{stats.activeListings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Bids</span>
                  <span className="font-semibold text-gray-900">{stats.totalBids}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pending Orders</span>
                  <span className="font-semibold text-gray-900">{stats.pendingOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Earnings</span>
                  <span className="font-semibold text-green-600">{formatCurrency(stats.totalEarnings)}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/farmer/listings/add" className="flex items-center space-x-3 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                  <Package className="w-5 h-5" />
                  <span className="font-medium">Add Product</span>
                </Link>
                <Link to="/farmer/orders" className="flex items-center space-x-3 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                  <Truck className="w-5 h-5" />
                  <span className="font-medium">View Orders</span>
                </Link>
                <Link to="/farmer/analytics" className="flex items-center space-x-3 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                  <BarChart3 className="w-5 h-5" />
                  <span className="font-medium">Analytics</span>
                </Link>
              </div>
            </div>

            {/* Weather Widget */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Weather</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-yellow-600">{weatherData.temperature}°</span>
                  </div>
                  <span className="text-sm text-gray-600">Temperature</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">{weatherData.humidity}%</span>
                  </div>
                  <span className="text-sm text-gray-600">Humidity</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-600">{weatherData.windSpeed}</span>
                  </div>
                  <span className="text-sm text-gray-600">Wind Speed</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{weatherData.condition}</p>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Listings</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeListings}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Bids</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalBids}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Truck className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalEarnings)}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                <Link to="/farmer/activity" className="text-green-600 hover:text-green-700 text-sm font-medium">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.time}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        activity.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        activity.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {activity.status.replace('_', ' ')}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(activity.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Farm Tips */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Farm Tips</h3>
                <Link to="/farmer/tips" className="text-green-600 hover:text-green-700 text-sm font-medium">
                  More Tips
                </Link>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Optimize irrigation timing</p>
                    <p className="text-sm text-gray-600">Water early morning or late evening for better absorption</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Monitor market prices</p>
                    <p className="text-sm text-gray-600">Check local mandi rates before listing</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <Activity className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Crop rotation benefits</p>
                    <p className="text-sm text-gray-600">Rotate crops annually to maintain soil health</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FarmerDashboard;
