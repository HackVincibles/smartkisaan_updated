import React from 'react';
import { 
  User, Mail, Phone, MapPin, 
  ShieldCheck, CreditCard, Award, 
  ChevronRight, Camera, Settings,
  LogOut, Truck, Package
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import DashboardLayout from '../../components/layout/DashboardLayout';

const TransporterProfilePage = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const stats = [
    { label: 'Trust Score', value: user.trustScore || 100, icon: Award, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Completed Trips', value: 124, icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Deliveries', value: 342, icon: Package, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="card bg-white p-8 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-gray-700 to-gray-900" />
          
          <div className="relative pt-16 flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-3xl bg-white p-1 shadow-xl">
                {user.profilePhoto ? (
                  <img src={user.profilePhoto} alt={user.name} className="w-full h-full rounded-[1.25rem] object-cover" />
                ) : (
                  <div className="w-full h-full rounded-[1.25rem] bg-gray-100 flex items-center justify-center text-gray-600">
                    <Truck size={48} />
                  </div>
                )}
              </div>
              <button className="absolute bottom-2 right-2 p-2 bg-gray-900 text-white rounded-xl shadow-lg hover:bg-black transition-colors">
                <Camera size={16} />
              </button>
            </div>
            
            <div className="flex-1 text-center md:text-left mb-2">
              <h1 className="text-3xl font-black text-gray-900">{user.name}</h1>
              <p className="text-gray-500 font-medium capitalize">Verified Transporter</p>
            </div>

            <div className="flex gap-3 mb-2">
              <button className="btn-outline flex items-center gap-2">
                <Settings size={18} />
                Edit Profile
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
            <div key={i} className="card bg-white p-6 flex items-center gap-4">
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
          {/* Contact Information */}
          <div className="card bg-white p-6 space-y-6">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <User size={20} className="text-gray-900" />
              Contact Information
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</p>
                  <p className="font-bold text-gray-900">{user.phone || 'Not linked'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                  <p className="font-bold text-gray-900">{user.email || 'Not linked'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Base Location</p>
                  <p className="font-bold text-gray-900">
                    {user.location?.lat ? 'Location Tracked' : 'Not set'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle & Documents */}
          <div className="card bg-white p-6 space-y-6">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Truck size={20} className="text-gray-900" />
              Vehicle & Documents
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Vehicle Plate</p>
                  <p className="font-bold text-gray-900 uppercase">RJ 14 CC 1234</p>
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-[10px] font-black uppercase">Active</div>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Driving License</p>
                  <p className="font-bold text-gray-900 uppercase">Verified (Expires 2028)</p>
                </div>
                <ShieldCheck size={20} className="text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Earnings */}
        <div className="card bg-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-gray-900">Earnings & Payments</h3>
            <button className="text-blue-600 text-sm font-bold">View History</button>
          </div>
          
          <div className="p-6 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Available for Payout</p>
              <p className="text-4xl font-black text-blue-900">₹14,500</p>
            </div>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors">
              Withdraw
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TransporterProfilePage;
