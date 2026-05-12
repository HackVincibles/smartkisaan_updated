import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  ShoppingBag, 
  Truck, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  CheckCircle,
  Filter,
  MoreVertical,
  Download,
  Search,
  Bell,
  Scale,
  Shield,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
// @ts-ignore
import adminService from '../../services/adminService';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>({});
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, auditRes, alertsRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAuditLogs({ limit: 5 }),
        adminService.getPendingListings() // Better use pending listings for alerts
      ]);
      
      const d = statsRes.data;
      setStats({
        revenue: d.financials?.platformCommission || 0,
        totalMarketValue: d.financials?.grossMarketValue || 0,
        totalUsers: d.users?.reduce((acc: number, curr: any) => acc + curr.count, 0) || 0,
        activeOrders: d.inventory?.activeOrders || 0,
        totalListings: d.inventory?.totalListings || 0
      });

      setRecentTransactions(auditRes.data || []);
      
      const pendingListings = alertsRes.data || [];
      setAlerts(pendingListings.map((l: any) => ({
        id: l._id,
        title: 'Listing Approval Required',
        description: `${l.productName} by ${l.farmerId?.name || 'Farmer'}`,
        type: 'kyc', // Using kyc icon for now
        orderId: l._id
      })));
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Platform Profit', value: formatCurrency(stats.revenue), change: '+12.5%', isPositive: true, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Active Users', value: stats.totalUsers, change: '+5.2%', isPositive: true, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Active Orders', value: stats.activeOrders, change: '-2.1%', isPositive: false, icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Gross Volume', value: formatCurrency(stats.totalMarketValue), change: '+8.4%', isPositive: true, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' }
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Admin Control Center</h1>
          <p className="text-gray-500 text-sm">Platform overview and management</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Bell className="w-4 h-4" />
            System Alert
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="p-4 border-b border-gray-200 dark:border-dark-300 flex justify-between items-center">
            <h3 className="text-lg font-semibold">System Alerts & Approvals</h3>
            <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-bold">
              {alerts.length} Urgent
            </span>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-dark-300">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-300 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    alert.type === 'kyc' ? 'bg-blue-100 text-blue-600' :
                    alert.type === 'dispute' ? 'bg-red-100 text-red-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {alert.type === 'kyc' ? <Users className="w-5 h-5" /> : 
                     alert.type === 'dispute' ? <Scale className="w-5 h-5" /> : 
                     <AlertTriangle className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{alert.title}</p>
                    <p className="text-sm text-gray-500">{alert.description || `Order #${alert.orderId}`}</p>
                  </div>
                </div>
                <button className="px-4 py-1.5 rounded-lg border border-gray-200 text-sm font-bold hover:bg-gray-100">
                  Take Action
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-6">Quick Management</h3>
          <div className="space-y-4">
            <Link to="/admin/users" className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-primary-500 hover:shadow-md transition-all group">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
                <span className="font-bold">Verify Users</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-primary-600" />
            </Link>
            <Link to="/admin/disputes" className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-primary-500 hover:shadow-md transition-all group">
              <div className="flex items-center gap-3">
                <Scale className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
                <span className="font-bold">Manage Disputes</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-primary-600" />
            </Link>
            <Link to="/admin/escrow" className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-primary-500 hover:shadow-md transition-all group">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-400 group-hover:text-primary-600" />
                <span className="font-bold">Escrow Control</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-primary-600" />
            </Link>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-dark-300 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Filter className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white dark:bg-dark-300 text-gray-400 uppercase text-[10px] font-black tracking-widest border-b">
              <tr>
                <th className="px-6 py-4 text-left">Transaction</th>
                <th className="px-6 py-4 text-left">User</th>
                <th className="px-6 py-4 text-left">Amount</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-300">
              {recentTransactions.map((tx, index) => (
                <tr key={index} className="hover:bg-gray-50/50 dark:hover:bg-dark-300 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900 dark:text-white">{tx.action?.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-gray-400 font-mono">{tx._id?.substring(0, 8)}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">{tx.performedBy?.name || 'System'}</td>
                  <td className="px-6 py-4">
                    <span className="font-black text-gray-900">{tx.details?.split('amount')?.[1] || 'N/A'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-green-100 text-green-700">
                      Success
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400 font-bold">{formatDateTime(tx.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 hover:bg-gray-100 rounded text-gray-400">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
