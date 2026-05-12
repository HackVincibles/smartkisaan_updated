import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Truck, 
  MapPin, 
  Package, 
  Wallet, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
// @ts-ignore
import transporterService from '../../services/transporterService';
import { formatCurrency, formatRelativeTime } from '../../lib/utils';
import toast from 'react-hot-toast';

const TransporterDashboard = () => {
  const [stats, setStats] = useState<any>({
    activeTrips: 0,
    completedTrips: 0,
    totalEarnings: 0,
    rating: 0
  });
  const [recentTrips, setRecentTrips] = useState<any[]>([]);
  const [availableLoads, setAvailableLoads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, tripsRes, loadsRes] = await Promise.all([
        transporterService.getDashboardStats(),
        transporterService.getTrips({ limit: 5 }),
        transporterService.getAvailableLoads({ limit: 3 })
      ]);
      
      const d = statsRes.data;
      setStats({
        activeTrips: d.activeOrdersCount || 0,
        completedTrips: d.stats?.completed || 0,
        totalEarnings: d.totalEarnings || 0,
        rating: d.agency?.averageRating || 0
      });
      setRecentTrips(tripsRes.data.orders || []); // Backend returns .orders
      setAvailableLoads(loadsRes.data.loads || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Active Trips', value: stats.activeTrips, icon: Truck, color: 'bg-blue-500' },
    { title: 'Completed', value: stats.completedTrips, icon: CheckCircle, color: 'bg-green-500' },
    { title: 'Total Earnings', value: formatCurrency(stats.totalEarnings), icon: Wallet, color: 'bg-purple-500' },
    { title: 'Rating', value: `${stats.rating || 0}/5`, icon: Star, color: 'bg-yellow-500' }
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transporter Dashboard</h1>
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Online
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Active Trips */}
          <div className="card">
            <div className="p-4 border-b border-gray-200 dark:border-dark-300 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Active Trips</h3>
              <Link to="/transporter/orders" className="text-primary-600 text-sm hover:underline">
                View all
              </Link>
            </div>
            <div className="p-4">
              {recentTrips.filter(t => t.escrowState !== 'COMPLETED').length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  <Truck className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No active trips right now</p>
                  <Link to="/transporter/loads" className="text-primary-600 text-sm mt-2 inline-block">
                    Find new loads →
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentTrips.filter(t => t.escrowState !== 'COMPLETED').map((trip, index) => (
                    <div key={index} className="p-4 rounded-xl border border-gray-100 dark:border-dark-300 bg-gray-50 dark:bg-dark-300">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Order #{trip._id?.substring(0, 8)}</p>
                          <h4 className="font-bold text-lg">{trip.listingId?.productName || 'Product'}</h4>
                        </div>
                        <span className="px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-bold">
                          {trip.escrowState}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-primary-500" />
                          {trip.pickupAddress || 'Pickup'} → {trip.deliveryAddress || 'Delivery'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="w-4 h-4 text-primary-500" />
                          {trip.quantity} {trip.unit}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-green-600">{formatCurrency(trip.freightCharge)}</span>
                        <Link 
                          to={`/transporter/trips/${trip._id}`}
                          className="btn-primary py-1.5 px-4 text-sm"
                        >
                          Update Status
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Available Loads */}
          <div className="card">
            <div className="p-4 border-b border-gray-200 dark:border-dark-300 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Loads Available Near You</h3>
              <Link to="/transporter/loads" className="text-primary-600 text-sm hover:underline">
                Explore all
              </Link>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-dark-300">
              {availableLoads.map((load, index) => (
                <div key={index} className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{load.productName}</h4>
                    <p className="text-sm text-gray-500">{load.from} to {load.to}</p>
                    <p className="text-xs text-gray-400 mt-1">{load.weight} Quintal • {load.distance} km</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{formatCurrency(load.fee)}</p>
                    <button className="text-primary-600 text-sm hover:underline mt-1">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/transporter/scan" className="flex items-center justify-between p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 transition-colors text-primary-600 font-medium">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-600 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <span>Scan QR Proof</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/transporter/earnings" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-gray-500" />
                  <span>Withdraw Earnings</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/transporter/profile" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-gray-500" />
                  <span>Update KYC</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Earnings Chart Placeholder */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Earnings This Week</h3>
            <div className="h-40 flex items-end justify-between gap-2 px-2">
              {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                <div 
                  key={i} 
                  className="w-full bg-primary-500 rounded-t-md transition-all hover:bg-primary-600"
                  style={{ height: `${height}%` }}
                ></div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-gray-500 uppercase tracking-tighter">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { Star } from 'lucide-react';

export default TransporterDashboard;
