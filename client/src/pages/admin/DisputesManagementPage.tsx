import React, { useState, useEffect } from 'react';
import { 
  Gavel, Search, Filter, AlertCircle,
  CheckCircle2, Clock, MessageSquare,
  ChevronRight, ArrowUpRight, ShieldAlert,
  Scales
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
// @ts-ignore
import disputeService from '../../services/disputeService';
import { toast } from 'react-hot-toast';

const DisputesManagementPage = () => {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchDisputes();
  }, [statusFilter]);

  const fetchDisputes = async () => {
    try {
      const response = await disputeService.getAllDisputes();
      const data = response.data?.data || response.data || [];
      setDisputes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch disputes:', error);
      // Mock data for demo
      setDisputes([
        { _id: 'D1', orderId: 'ORD-101', reason: 'Quality Mismatch', status: 'PENDING', raisedBy: 'Buyer', createdAt: new Date() },
        { _id: 'D2', orderId: 'ORD-102', reason: 'Payment Dispute', status: 'IN_REVIEW', raisedBy: 'Farmer', createdAt: new Date(Date.now() - 3600000) },
        { _id: 'D3', orderId: 'ORD-103', reason: 'Delayed Delivery', status: 'RESOLVED', raisedBy: 'Buyer', createdAt: new Date(Date.now() - 86400000) }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'IN_REVIEW': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'RESOLVED': return 'bg-green-100 text-green-600 border-green-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <Scales className="text-primary-600" />
              Arbiter Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Resolve platform disputes and ensure trust</p>
          </div>
          
          <div className="flex gap-4 p-2 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="px-6 text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Disputes</p>
              <p className="text-xl font-black text-gray-900">{disputes.filter(d => d.status !== 'RESOLVED').length}</p>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="px-6 text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avg Resolution Time</p>
              <p className="text-xl font-black text-blue-600">4.2h</p>
            </div>
          </div>
        </div>

        {/* Global Alert */}
        <div className="card bg-red-50 border border-red-100 p-6 flex items-start gap-4">
          <ShieldAlert className="text-red-600 mt-1" size={24} />
          <div>
            <h4 className="font-bold text-red-900">Priority Resolution Required</h4>
            <p className="text-sm text-red-800 opacity-80 leading-relaxed">
              There are 2 disputes older than 24 hours that require immediate arbitration. Delayed resolution impacts platform trust scores.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Dispute ID or Order ID..." 
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-3xl shadow-sm focus:ring-1 focus:ring-primary-500"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
            {['ALL', 'PENDING', 'IN_REVIEW', 'RESOLVED'].map((s) => (
              <button 
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  statusFilter === s ? 'bg-primary-600 text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Disputes Grid */}
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="card bg-white p-8 animate-pulse h-32" />
            ))
          ) : disputes.length === 0 ? (
            <div className="card bg-white p-20 text-center space-y-4">
              <CheckCircle2 size={64} className="text-green-100 mx-auto" />
              <h3 className="text-2xl font-black text-gray-900">All disputes resolved!</h3>
              <p className="text-gray-500">The platform is running smoothly with no active conflicts.</p>
            </div>
          ) : (
            disputes.map((dispute) => (
              <div key={dispute._id} className="card bg-white p-8 hover:shadow-xl transition-all border border-transparent hover:border-primary-100 group cursor-pointer">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(dispute.status)}`}>
                        {dispute.status}
                      </span>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Raised by {dispute.raisedBy}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl font-black text-gray-900 group-hover:text-primary-600 transition-colors">
                        Order #{dispute.orderId}
                      </h3>
                      <p className="text-gray-600 font-bold mt-1">{dispute.reason}</p>
                    </div>

                    <div className="flex items-center gap-6 pt-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <Clock size={14} />
                        {new Date(dispute.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <MessageSquare size={14} />
                        5 Messages
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-72 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-8 space-y-4">
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Escrow Amount</p>
                      <p className="text-xl font-black text-gray-900">₹45,000</p>
                    </div>
                    
                    <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2">
                      Enter Arbitration <ArrowUpRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DisputesManagementPage;
