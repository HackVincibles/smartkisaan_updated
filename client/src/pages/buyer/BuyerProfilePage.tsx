import React from 'react';
import { 
  User, Mail, Phone, MapPin, 
  ShieldCheck, CreditCard, Award, 
  ChevronRight, Camera, Settings,
  LogOut, ShoppingBag
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import DashboardLayout from '../../components/layout/DashboardLayout';

const BuyerProfilePage = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const stats = [
    { label: 'Trust Score', value: user.trustScore || 100, icon: Award, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Account Type', value: user.role === 'buyer' ? 'Bulk Buyer' : user.role, icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'KYC Status', value: user.isKYCDone ? 'Complete' : 'Pending', icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="card bg-white p-8 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-500 to-blue-700" />
          
          <div className="relative pt-16 flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-3xl bg-white p-1 shadow-xl">
                {user.profilePhoto ? (
                  <img src={user.profilePhoto} alt={user.name} className="w-full h-full rounded-[1.25rem] object-cover" />
                ) : (
                  <div className="w-full h-full rounded-[1.25rem] bg-gray-100 flex items-center justify-center text-blue-600">
                    <User size={48} />
                  </div>
                )}
              </div>
              <button className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-colors">
                <Camera size={16} />
              </button>
            </div>
            
            <div className="flex-1 text-center md:text-left mb-2">
              <h1 className="text-3xl font-black text-gray-900">{user.name}</h1>
              <p className="text-gray-500 font-medium capitalize">Registered {user.role}</p>
            </div>

            <div className="flex gap-3 mb-2">
              <button className="btn-outline flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50">
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
              <User size={20} className="text-blue-600" />
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
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delivery Region</p>
                  <p className="font-bold text-gray-900">
                    {user.location?.lat ? 'Location Set' : 'Not set'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Settings */}
          <div className="card bg-white p-6 space-y-6">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <CreditCard size={20} className="text-blue-600" />
              Payment Methods
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Primary UPI</p>
                  <p className="font-bold text-gray-900">{user.upiId || 'Not linked'}</p>
                </div>
                <button className="text-blue-600 text-xs font-bold">Change</button>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Bank Account</p>
                  <p className="font-bold text-gray-900">
                    {user.bankAccount?.accountNumber ? `Linked Account (••${user.bankAccount.accountNumber.slice(-2)})` : 'No account linked'}
                  </p>
                </div>
                <button className="text-blue-600 text-xs font-bold">Manage</button>
              </div>
            </div>
          </div>
        </div>

        {/* Support & Legal */}
        <div className="card bg-white divide-y divide-gray-100">
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900">Privacy & Security</p>
                <p className="text-xs text-gray-500">Manage your data and security preferences</p>
              </div>
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-blue-600 transition-colors" />
          </button>
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <ShoppingBag size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900">Business Documents</p>
                <p className="text-xs text-gray-500">View and upload tax IDs or business licenses</p>
              </div>
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-orange-600 transition-colors" />
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BuyerProfilePage;
