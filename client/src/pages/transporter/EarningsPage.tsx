import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, CreditCard, ArrowUpRight, 
  ArrowDownRight, Calendar, DollarSign,
  ChevronRight, Filter, Download,
  Wallet, PieChart
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
// @ts-ignore
import transporterService from '../../services/transporterService';

const EarningsPage = () => {
  const [stats, setStats] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const response = await transporterService.getDashboardStats();
      const data = response.data?.data || response.data;
      setStats(data);
      
      // Mock transactions
      setTransactions([
        { id: 'T1', type: 'Credit', amount: 4500, orderId: 'ORD-123', date: new Date(), status: 'Paid' },
        { id: 'T2', type: 'Credit', amount: 3200, orderId: 'ORD-124', date: new Date(Date.now() - 86400000), status: 'Paid' },
        { id: 'T3', type: 'Payout', amount: -5000, date: new Date(Date.now() - 172800000), status: 'Completed' },
        { id: 'T4', type: 'Credit', amount: 8500, orderId: 'ORD-125', date: new Date(Date.now() - 259200000), status: 'Processing' }
      ]);
    } catch (error) {
      console.error('Failed to fetch earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Financial Overview</h1>
            <p className="text-gray-500 mt-1">Track your income, payouts, and trip revenue</p>
          </div>
          
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2">
              <Download size={18} />
              Statement
            </button>
            <button className="btn-primary flex items-center gap-2 shadow-xl shadow-primary-100">
              <Wallet size={18} />
              Request Payout
            </button>
          </div>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-primary-600 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp size={80} />
            </div>
            <div className="relative z-10 space-y-4">
              <p className="text-xs font-black uppercase tracking-widest opacity-70">Total Earnings</p>
              <h2 className="text-5xl font-black">₹{stats?.totalEarnings?.toLocaleString() || '1,24,500'}</h2>
              <div className="flex items-center gap-2 text-primary-100 text-xs font-bold">
                <ArrowUpRight size={14} />
                <span>+12% from last month</span>
              </div>
            </div>
          </div>

          <div className="card bg-white p-8 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 text-blue-50 opacity-20">
              <CreditCard size={80} />
            </div>
            <div className="relative z-10 space-y-4">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Pending Payout</p>
              <h2 className="text-5xl font-black text-gray-900">₹{stats?.pendingPayout?.toLocaleString() || '14,200'}</h2>
              <div className="flex items-center gap-2 text-blue-600 text-xs font-bold">
                <Clock size={14} />
                <span>Next settlement in 2 days</span>
              </div>
            </div>
          </div>

          <div className="card bg-white p-8 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 text-orange-50 opacity-20">
              <PieChart size={80} />
            </div>
            <div className="relative z-10 space-y-4">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Completed Trips</p>
              <h2 className="text-5xl font-black text-gray-900">124</h2>
              <div className="flex items-center gap-2 text-orange-600 text-xs font-bold">
                <ArrowUpRight size={14} />
                <span>Top performer badge</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transaction History */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-gray-900">Recent Transactions</h3>
              <div className="flex items-center gap-2 text-sm font-bold text-primary-600 cursor-pointer hover:underline">
                View All <ChevronRight size={16} />
              </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="card bg-white p-6 animate-pulse h-20" />
                ))
              ) : (
                transactions.map((t) => (
                  <div key={t.id} className="card bg-white p-6 flex items-center justify-between hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        t.amount > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {t.amount > 0 ? <ArrowDownRight size={24} /> : <ArrowUpRight size={24} />}
                      </div>
                      <div>
                        <p className="font-black text-gray-900">{t.type === 'Credit' ? `Payment for ${t.orderId}` : 'Withdrawal to Bank'}</p>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                          {new Date(t.date).toLocaleDateString()} • {t.status}
                        </p>
                      </div>
                    </div>
                    <p className={`text-xl font-black ${t.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {t.amount > 0 ? '+' : ''}₹{Math.abs(t.amount).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Side Info */}
          <div className="space-y-6">
            <div className="card bg-gray-50 p-6 border border-gray-100">
              <h4 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-primary-600" />
                Weekly Performance
              </h4>
              <div className="space-y-6">
                <div className="flex justify-between items-end h-32 gap-2">
                  {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                    <div key={i} className="flex-1 bg-primary-100 rounded-t-lg relative group">
                      <div 
                        className="absolute bottom-0 left-0 w-full bg-primary-600 rounded-t-lg transition-all duration-1000"
                        style={{ height: `${h}%` }}
                      />
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ₹{h*100}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
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

            <div className="card bg-gradient-to-br from-gray-900 to-black p-6 text-white space-y-4">
              <h4 className="font-black">SmartTip™</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Transporters in your region are earning 20% more by accepting night trips to Delhi Mandi. 
              </p>
              <button className="text-[10px] font-black uppercase text-primary-400 flex items-center gap-1 hover:text-primary-300 transition-colors">
                Enable Night Loads <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EarningsPage;
