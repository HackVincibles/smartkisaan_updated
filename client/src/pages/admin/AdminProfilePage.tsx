import React from 'react';
import { 
  User, Mail, ShieldCheck, Award, 
  ChevronRight, Camera, Settings,
  LogOut, Lock, Database, Globe
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import DashboardLayout from '../../components/layout/DashboardLayout';

const AdminProfilePage = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const stats = [
    { label: 'Access Level', value: 'Super Admin', icon: Lock, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'System Health', value: '99.9%', icon: Database, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Region', value: 'North India', icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="card bg-white p-8 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-gray-800 to-black" />
          
          <div className="relative pt-16 flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-3xl bg-white p-1 shadow-xl border border-gray-100">
                {user.profilePhoto ? (
                  <img src={user.profilePhoto} alt={user.name} className="w-full h-full rounded-[1.25rem] object-cover" />
                ) : (
                  <div className="w-full h-full rounded-[1.25rem] bg-gray-900 flex items-center justify-center text-white">
                    <ShieldCheck size={48} />
                  </div>
                )}
              </div>
              <button className="absolute bottom-2 right-2 p-2 bg-gray-900 text-white rounded-xl shadow-lg hover:bg-black transition-colors border border-gray-700">
                <Camera size={16} />
              </button>
            </div>
            
            <div className="flex-1 text-center md:text-left mb-2">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-3xl font-black text-gray-900">{user.name}</h1>
                <div className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-black uppercase rounded-md tracking-widest">Admin</div>
              </div>
              <p className="text-gray-500 font-medium">{user.email}</p>
            </div>

            <div className="flex gap-3 mb-2">
              <button className="btn-outline flex items-center gap-2">
                <Settings size={18} />
                Settings
              </button>
              <button onClick={logout} className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="card bg-white p-6 flex items-center gap-4 border border-gray-50 shadow-sm">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-xl font-black text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* System Permissions */}
          <div className="card bg-white p-6 space-y-6">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Lock size={20} className="text-red-600" />
              Security & Permissions
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400 border border-gray-100">
                    <Database size={16} />
                  </div>
                  <span className="text-sm font-bold text-gray-700">User Management</span>
                </div>
                <div className="w-10 h-6 bg-green-500 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400 border border-gray-100">
                    <ShieldCheck size={16} />
                  </div>
                  <span className="text-sm font-bold text-gray-700">Financial Auditing</span>
                </div>
                <div className="w-10 h-6 bg-green-500 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400 border border-gray-100">
                    <Award size={16} />
                  </div>
                  <span className="text-sm font-bold text-gray-700">Master Config</span>
                </div>
                <div className="w-10 h-6 bg-gray-300 rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="card bg-white p-6 space-y-6">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Database size={20} className="text-blue-600" />
              Recent System Activity
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                <div>
                  <p className="text-sm font-bold text-gray-900">Modified Marketplace Fees</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                <div>
                  <p className="text-sm font-bold text-gray-900">Approved 14 New Farmers</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Yesterday</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2" />
                <div>
                  <p className="text-sm font-bold text-gray-900">Banned 1 Suspicious Buyer</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Controls Banner */}
        <div className="card bg-gray-900 p-8 text-white relative overflow-hidden group cursor-pointer">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-black">Admin Support Channel</h3>
              <p className="text-gray-400 max-w-sm">Direct encrypted channel to technical infrastructure team.</p>
            </div>
            <button className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-colors">
              Open Secure Comms
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminProfilePage;
