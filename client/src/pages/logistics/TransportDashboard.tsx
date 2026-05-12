import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Navigation, Package, CheckCircle2, TrendingUp, Wallet, Clock, ArrowRight, ShieldCheck, Zap, Activity, History, ChevronRight, Map, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const TransportDashboard = () => {
  const [activeJobs, setActiveJobs] = useState([
    { id: '1', crop: 'Basmati Rice', qty: '500 KG', from: 'Nashik Cluster', to: 'Mumbai Hub', status: 'READY_FOR_PICKUP' },
    { id: '2', crop: 'Organic Wheat', qty: '1200 KG', from: 'Pune Mandi', to: 'Thane Center', status: 'IN_TRANSIT' }
  ]);

  const stats = [
    { label: 'Weekly Yield', value: '₹18,200', icon: Wallet, color: 'tertiary', change: '+12.5%' },
    { label: 'Active Rail', value: '04', icon: Truck, color: 'role-transporter', change: '2 On-time' },
    { label: 'Fleet Logic', value: '840 KM', icon: Activity, color: 'secondary', change: 'Avg 42km/h' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 fade-in">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-secondary-600 mb-1">
            <Activity size={14} />
            <span>Fulfillment Intelligence</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight italic">Fleet <span className="text-secondary not-italic">Command</span></h1>
          <p className="text-gray-400 font-medium max-w-md text-lg">Optimizing agricultural transit rails with real-time IoT telemetry and blockchain verification.</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <Link to="/logistics/pickup" className="btn btn-primary px-10 py-6 rounded-2xl text-[10px] uppercase tracking-widest flex items-center gap-4 group">
            <Navigation size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            Initialize Pickup
          </Link>
        </div>
      </div>

      {/* Control KPI Stream */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="stitch-card p-10 relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white bg-${stat.color}`}>
                <stat.icon size={28} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                <h3 className="text-4xl font-bold text-gray-900 italic tracking-tighter">{stat.value}</h3>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full bg-${stat.color === 'tertiary' ? 'tertiary' : 'secondary'} animate-pulse`}></div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 italic">{stat.change}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Assignment Stream */}
      <div className="space-y-8">
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-3">
            <Map className="text-gray-400" />
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight italic">Active <span className="not-italic">Rail</span></h3>
          </div>
          <button className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-secondary flex items-center gap-2">
            Regional Map <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnimatePresence>
            {activeJobs.map((job, index) => (
              <motion.div 
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="stitch-card p-10 group overflow-hidden"
              >
                <div className="space-y-8">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-secondary-50 group-hover:text-secondary transition-colors border border-transparent group-hover:border-secondary-100">
                        <Package size={32} />
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-gray-900 italic leading-tight group-hover:text-secondary transition-colors">{job.crop}</h4>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          <Zap size={12} className="text-secondary" />
                          {job.qty} • Secured Payload
                        </div>
                      </div>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-sm border ${
                      job.status === 'IN_TRANSIT' 
                        ? 'bg-secondary-50 text-secondary border-secondary-100' 
                        : 'bg-primary-50 text-primary border-primary-100'
                    }`}>
                      {job.status.replace(/_/g, ' ')}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-gray-50 relative">
                    <div className="space-y-2 relative z-10">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-success flex items-center gap-2">
                        <MapPin size={14} /> Pickup Origin
                      </p>
                      <p className="text-lg font-bold text-gray-900 tracking-tight leading-tight">{job.from}</p>
                    </div>
                    
                    <div className="space-y-2 relative z-10">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
                        <MapPin size={14} /> Destination
                      </p>
                      <p className="text-lg font-bold text-gray-900 tracking-tight leading-tight">{job.to}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <Link 
                      to={job.status === 'READY_FOR_PICKUP' ? '/logistics/pickup' : '/logistics/delivery'}
                      className="flex-1 btn btn-primary py-4 rounded-xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-3"
                    >
                      {job.status === 'READY_FOR_PICKUP' ? 'Initialize Pickup' : 'Manage Fulfillment'}
                      <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                    <button className="w-14 h-14 bg-gray-50 text-gray-400 rounded-xl hover:bg-secondary-50 hover:text-secondary transition-all border border-transparent hover:border-secondary-100 flex items-center justify-center">
                      <Map size={24} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Infrastructure Sidebar (Trust Widgets) */}
      <div className="grid lg:grid-cols-2 gap-8 mt-12">
        <div className="bg-gray-900 rounded-3xl p-12 text-white relative overflow-hidden group shadow-xl">
          <div className="relative z-10 space-y-6">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10">
              <ShieldCheck size={32} className="text-secondary-400" />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-bold italic tracking-tight leading-tight">Cryptographic Custody</h3>
              <p className="text-white/60 text-lg font-medium leading-relaxed">
                Every shipment handoff is cryptographically signed. Your reputation score increases with every verified delivery.
              </p>
            </div>
            <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary-400 group-hover:text-white transition-colors">
              Protocols <ChevronRight size={16} />
            </button>
          </div>
          <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="bg-secondary-600 rounded-3xl p-12 text-white relative overflow-hidden group shadow-xl">
          <div className="relative z-10 space-y-6">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10">
              <Bot size={32} className="text-secondary-100" />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-bold italic tracking-tight leading-tight">Route Optimization</h3>
              <p className="text-white/80 text-lg font-medium leading-relaxed">
                AI-driven pathfinding identifies the most fuel-efficient and timely routes through regional mandi clusters.
              </p>
            </div>
            <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white group-hover:underline transition-colors">
              Manage Fleet <ChevronRight size={16} />
            </button>
          </div>
          <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default TransportDashboard;
