import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, CheckCircle2, Clock, 
  MessageSquare, ChevronRight, Gavel,
  Search, Filter
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import disputeService from '../../services/disputeService';
import { toast } from 'react-hot-toast';

const DisputesPage = () => {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      const response = await disputeService.getDisputes();
      const data = response.data?.data || response.data || [];
      setDisputes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch disputes:', error);
      // toast.error('Failed to load disputes');
      // Mock data for demo if API fails
      setDisputes([
        { _id: '1', orderId: 'ORD-1234', reason: 'Quality not as described', status: 'PENDING', createdAt: new Date() },
        { _id: '2', orderId: 'ORD-5678', reason: 'Delayed delivery', status: 'RESOLVED', createdAt: new Date(Date.now() - 86400000) }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return 'bg-orange-100 text-orange-600';
      case 'RESOLVED': return 'bg-green-100 text-green-600';
      case 'REJECTED': return 'bg-red-100 text-red-600';
      case 'IN_REVIEW': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return <Clock size={16} />;
      case 'RESOLVED': return <CheckCircle2 size={16} />;
      case 'REJECTED': return <AlertCircle size={16} />;
      case 'IN_REVIEW': return <Search size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Disputes & Resolutions</h1>
            <p className="text-gray-500 mt-1">Manage and track your active disputes</p>
          </div>
          
          <button className="btn-primary flex items-center gap-2">
            <Gavel size={18} />
            Raise New Dispute
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 p-4 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by Order ID or reason..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button className="p-3 bg-gray-50 text-gray-600 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-colors">
            <Filter size={20} />
          </button>
        </div>

        {/* Disputes List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading disputes...</p>
            </div>
          ) : disputes.length === 0 ? (
            <div className="card bg-white p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">No active disputes</h3>
                <p className="text-gray-500">Everything looks great! You haven't raised any disputes yet.</p>
              </div>
            </div>
          ) : (
            disputes.map((dispute) => (
              <div key={dispute._id} className="card bg-white p-6 hover:shadow-md transition-shadow group cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${getStatusColor(dispute.status)}`}>
                      {getStatusIcon(dispute.status)}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-lg font-black text-gray-900">Order #{dispute.orderId}</span>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(dispute.status)}`}>
                          {dispute.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 font-medium">{dispute.reason}</p>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">
                        Raised on {new Date(dispute.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-600">
                      <MessageSquare size={14} />
                      3 messages
                    </div>
                    <ChevronRight className="text-gray-300 group-hover:text-blue-600 transition-colors" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Help Banner */}
        <div className="card bg-gradient-to-br from-gray-900 to-black p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-black">Need assistance?</h3>
              <p className="text-gray-400 max-w-md">Our specialized arbiter team is available 24/7 to help resolve any issues with your orders.</p>
            </div>
            <button className="px-8 py-4 bg-white text-black rounded-2xl font-black hover:bg-gray-100 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DisputesPage;
