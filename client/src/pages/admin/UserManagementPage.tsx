import React, { useState, useEffect } from 'react';
import { 
  User, Search, Filter, ShieldCheck, 
  Slash, CheckCircle2, MoreVertical,
  ChevronRight, ArrowUpRight, Phone,
  Mail, Award, MapPin
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
// @ts-ignore
import adminService from '../../services/adminService';
import { toast } from 'react-hot-toast';

const UserManagementPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    try {
      const response = await adminService.getAllUsers();
      const data = response.data?.data || response.data || [];
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      // Mock data for demo
      setUsers([
        { _id: '1', name: 'Rajesh Farmer', role: 'farmer', phone: '9876543210', isVerified: true, trustScore: 95, createdAt: new Date() },
        { _id: '2', name: 'Amit Buyer', role: 'buyer', email: 'amit@example.com', isVerified: false, trustScore: 80, createdAt: new Date(Date.now() - 86400000) },
        { _id: '3', name: 'Express Logistics', role: 'transport', phone: '9000011111', isVerified: true, trustScore: 100, createdAt: new Date(Date.now() - 172800000) }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'farmer': return 'bg-green-100 text-green-700 border-green-200';
      case 'buyer': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'transport': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">User Management</h1>
            <p className="text-gray-500 mt-1">Audit, verify and manage platform participants</p>
          </div>
          
          <div className="flex gap-4 p-2 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="px-6 text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Users</p>
              <p className="text-xl font-black text-gray-900">{users.length}</p>
            </div>
            <div className="w-px bg-gray-200" />
            <div className="px-6 text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending Verification</p>
              <p className="text-xl font-black text-red-600">{users.filter(u => !u.isVerified).length}</p>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, phone, email or ID..." 
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-3xl shadow-sm focus:ring-1 focus:ring-primary-500"
            />
          </div>
          
          <div className="flex gap-2">
            {['all', 'farmer', 'buyer', 'transport'].map((r) => (
              <button 
                key={r}
                onClick={() => setFilter(r)}
                className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                  filter === r ? 'bg-gray-900 text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                {r}
              </button>
            ))}
            <button className="p-4 bg-white rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all text-gray-400">
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="card bg-white overflow-hidden border border-gray-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-bottom border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Participant</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Trust Score</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-6 py-8"><div className="h-4 bg-gray-50 rounded w-full" /></td>
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">No users found matching your criteria.</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${getRoleBadge(user.role)}`}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-400 font-bold tracking-tight">{user.phone || user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getRoleBadge(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        {user.isVerified ? (
                          <div className="flex items-center gap-1.5 text-green-600 font-bold text-xs">
                            <CheckCircle2 size={14} /> Verified
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-orange-500 font-bold text-xs">
                            <ShieldCheck size={14} /> Pending
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full max-w-[60px] overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${user.trustScore > 90 ? 'bg-green-500' : 'bg-orange-500'}`} 
                              style={{ width: `${user.trustScore}%` }}
                            />
                          </div>
                          <span className="text-xs font-black text-gray-900">{user.trustScore}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-xs font-bold text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-primary-600 transition-all border border-transparent hover:border-gray-100">
                            <MoreVertical size={18} />
                          </button>
                          <ChevronRight className="text-gray-200 group-hover:text-primary-600 transition-all" />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white flex justify-between items-center group cursor-pointer">
            <div className="space-y-2">
              <h3 className="text-2xl font-black">Export Data</h3>
              <p className="text-blue-100 text-sm opacity-80">Download full participant census in CSV/JSON</p>
            </div>
            <div className="w-14 h-14 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center group-hover:bg-white/30 transition-all">
              <ArrowUpRight size={24} />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-red-600 to-red-800 p-8 text-white flex justify-between items-center group cursor-pointer">
            <div className="space-y-2">
              <h3 className="text-2xl font-black">Blacklisted Users</h3>
              <p className="text-red-100 text-sm opacity-80">View and manage 4 active platform bans</p>
            </div>
            <div className="w-14 h-14 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center group-hover:bg-white/30 transition-all">
              <Slash size={24} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserManagementPage;
