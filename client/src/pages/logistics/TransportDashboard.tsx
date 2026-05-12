import React, { useState } from 'react';
import { Truck, MapPin, Navigation, Package, CheckCircle2, TrendingUp, Wallet, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';

const TransportDashboard = () => {
  const [activeJobs, setActiveJobs] = useState([
    { id: '1', crop: 'Basmati Rice', qty: '500 KG', from: 'Nashik', to: 'Mumbai', status: 'READY_FOR_PICKUP' },
    { id: '2', crop: 'Organic Wheat', qty: '1200 KG', from: 'Pune', to: 'Thane', status: 'IN_TRANSIT' }
  ]);

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Logistics Dashboard</h1>
            <p className="text-gray-500 mt-1 text-lg">Managing routes and securing harvest transfers.</p>
          </div>
          <div className="flex gap-4">
            <Link to="/logistics/pickup" className="px-6 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black shadow-xl transition-all flex items-center gap-2">
              <Navigation className="w-5 h-5" /> Start Pickup
            </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Weekly Earnings', value: 'â‚¹18,200', icon: Wallet, color: 'blue' },
            { label: 'Active Shipments', value: '04', icon: Truck, color: 'green' },
            { label: 'Distance Covered', value: '840 KM', icon: TrendingUp, color: 'orange' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
              <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 mb-6`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="text-3xl font-black text-gray-900">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Active Jobs */}
        <div className="space-y-6">
          <h3 className="text-2xl font-black text-gray-900">Current Assignments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeJobs.map(job => (
              <div key={job.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all space-y-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                      <Package className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-gray-900">{job.crop}</h4>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{job.qty}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    job.status === 'IN_TRANSIT' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                  }`}>
                    {job.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                    <div className="text-sm font-bold text-gray-600">Pickup: <span className="text-gray-900">{job.from}</span></div>
                  </div>
                  <div className="w-[1px] h-4 bg-gray-200 ml-1"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                    <div className="text-sm font-bold text-gray-600">Dropoff: <span className="text-gray-900">{job.to}</span></div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Link 
                    to={job.status === 'READY_FOR_PICKUP' ? '/logistics/pickup' : '/logistics/delivery'}
                    className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-bold text-sm hover:bg-green-700 shadow-lg shadow-green-100 transition-all flex items-center justify-center gap-2"
                  >
                    {job.status === 'READY_FOR_PICKUP' ? 'Start Pickup' : 'Manage Delivery'} <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-all">
                    <MapPin className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TransportDashboard;

