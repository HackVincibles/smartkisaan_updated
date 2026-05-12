import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Gavel, 
  TrendingUp, 
  Wallet, 
  Star, 
  Truck, 
  ArrowUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
// @ts-ignore
import farmerService from '../../services/farmerService';
import SBTBadge from '../../components/farmer/SBTBadge';
import AIGradeCard from '../../components/farmer/AIGradeCard';
import toast from 'react-hot-toast';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>({
    activeListings: 0,
    totalBids: 0,
    totalEarnings: 0,
    rating: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        farmerService.getDashboardStats(),
        farmerService.getOrders({ limit: 5 })
      ]);
      
      const d = statsRes.data;
      setStats({
        activeListings: d.listings?.active || 0,
        totalBids: d.orders?.activeBids || 0,
        totalEarnings: d.totalRevenue || 0,
        rating: d.farmer?.averageRating || 0,
        trustScore: d.trustScore || 100
      });
      setRecentActivity(activityRes.data.orders || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      title: 'Active Listings', 
      value: stats.activeListings, 
      change: '+2', 
      icon: Package, 
      color: 'bg-blue-500',
      link: '/farmer/listings'
    },
    { 
      title: 'Bids Received', 
      value: stats.totalBids, 
      change: '+5', 
      icon: Gavel, 
      color: 'bg-green-500',
      link: '/farmer/bids'
    },
    { 
      title: 'Total Earnings', 
      value: `₹${stats.totalEarnings}`, 
      change: '+18%', 
      icon: Wallet, 
      color: 'bg-purple-500',
      link: '/farmer/payments'
    },
    { 
      title: 'Rating', 
      value: `${stats.rating}/5`, 
      change: '+0.2', 
      icon: Star, 
      color: 'bg-yellow-500',
      link: '/farmer/disputes'
    }
  ];

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
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            Good Morning, {user?.name?.split(' ')[0]}! 🌾
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's your farm activity overview
          </p>
        </div>
        
        <div className="flex gap-2">
          <SBTBadge 
            badge={{ name: 'Trusted Farmer', type: 'trust', description: 'Verified for 500+ successful deliveries' }}
            size="sm"
          />
          <SBTBadge 
            badge={{ name: 'Quality Champion', type: 'quality', description: 'Consistently high-quality produce' }}
            size="sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-6 hover:shadow-lg transition-shadow"
          >
            <Link to={stat.link} className="block">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                  {stat.change}
                  <ArrowUp className="w-3 h-3" />
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.title}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AIGradeCard 
            grade="Excellent"
            qualityMetrics={{
              moisture: '12.5%',
              purity: '98%',
              protein: '11.5%',
              weight: '100 Quintal'
            }}
            pricePrediction={{
              estimatedPrice: 2180,
              minPrice: 2100,
              maxPrice: 2300,
              confidence: 85,
              bestTimeframe: '7-10 days'
            }}
          />
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link 
              to="/farmer/listings/add"
              className="flex items-center justify-between p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-primary-600" />
                <span>Add New Listing</span>
              </div>
              <ArrowUp className="w-4 h-4 text-primary-600 rotate-45" />
            </Link>
            <Link 
              to="/farmer/insights"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5" />
                <span>Check Market Prices</span>
              </div>
              <ArrowUp className="w-4 h-4 rotate-45" />
            </Link>
            <Link 
              to="/farmer/advisor"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5" />
                <span>Track Orders</span>
              </div>
              <ArrowUp className="w-4 h-4 rotate-45" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
