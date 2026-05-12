import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import { 
  LayoutDashboard, 
  Package, 
  Gavel, 
  TrendingUp, 
  Bot, 
  Scale, 
  Truck,
  Settings,
  Bell,
  Search,
  Command,
  User as UserIcon,
  Globe,
  Layers,
  Workflow,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

const farmerNavItems = [
  { path: '/farmer', label: 'COMMAND_HUB', icon: LayoutDashboard },
  { path: '/farmer/listings', label: 'ASSET_INVENTORY', icon: Package },
  { path: '/farmer/orders', label: 'SALES_REGISTRY', icon: Truck },
  { path: '/farmer/bids', label: 'BIDS_&_OFFERS', icon: Gavel },
  { path: '/farmer/insights', label: 'MANDI_TELEMETRY', icon: TrendingUp },
  { path: '/farmer/advisor', label: 'NEURAL_ADVISOR', icon: Bot },
  { path: '/farmer/disputes', label: 'TRUST_REGISTRY', icon: Scale },
  { path: '/farmer/profile', label: 'IDENTITY_NODE', icon: Settings },
];

const FarmerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-primary selection:text-white">
      <Sidebar 
        navItems={farmerNavItems}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        role="farmer"
      />
      
      <main className={`transition-all duration-[0.8s] ease-[0.16,1,0.3,1] ${sidebarOpen ? 'pl-[320px]' : 'pl-[100px]'}`}>
        {/* Command Center Top Bar */}
        <header className="h-28 flex items-center justify-between px-12 border-b border-gray-100 bg-white/80 backdrop-blur-xl sticky top-0 z-[40]">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-950 hover:bg-white hover:shadow-2xl transition-all group"
            >
              <Command size={22} className="group-hover:rotate-12 transition-transform" />
            </button>
            <div className="hidden md:flex items-center gap-4 px-6 py-3 bg-gray-50 rounded-2xl border border-gray-100 group focus-within:bg-white focus-within:shadow-2xl focus-within:border-gray-200 transition-all">
              <Search size={18} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="SCAN_REGISTRY_OR_COMMANDS..." 
                className="bg-transparent border-none outline-none text-[11px] font-black uppercase tracking-[0.2em] italic w-64 placeholder:text-gray-300"
              />
              <span className="text-[9px] font-black text-gray-300 bg-white px-2 py-1 rounded-md border border-gray-100 shadow-sm group-focus-within:opacity-0 transition-opacity">⌘K</span>
            </div>
          </div>

          <div className="flex items-center gap-10">
            <div className="hidden lg:flex items-center gap-6 border-r border-gray-100 pr-10">
              <div className="flex flex-col items-end">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-300 italic leading-none">NODE_LATENCY</p>
                <p className="text-sm font-black text-primary italic tracking-tight">14MS [OPTIMAL]</p>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-inner">
                <Workflow size={18} />
              </div>
            </div>

            <div className="flex items-center gap-8">
              <button className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-white hover:shadow-2xl transition-all relative group">
                <Bell size={22} />
                <span className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full border-2 border-white animate-pulse"></span>
              </button>
              
              <NavLink to="/farmer/profile" className="flex items-center gap-5 group cursor-pointer">
                <div className="text-right hidden sm:block">
                  <p className="text-[12px] font-black text-gray-950 uppercase tracking-tighter italic leading-none">{user?.name?.split(' ')[0].toUpperCase()}_NODE</p>
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] italic leading-none mt-1">SOVEREIGN_OPERATOR</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gray-950 p-0.5 shadow-2xl group-hover:rotate-12 transition-all duration-700 relative overflow-hidden">
                  {user?.profilePhoto ? (
                    <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover rounded-[0.9rem] opacity-90 group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary font-black italic text-lg rounded-[0.9rem]">
                      {user?.name?.slice(0, 2).toUpperCase() || 'RY'}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity"></div>
                </div>
              </NavLink>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-12 min-h-[calc(100vh-112px)] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>

          {/* Decorative Elements */}
          <div className="fixed bottom-12 left-12 opacity-[0.03] pointer-events-none select-none">
            <Layers size={300} className="text-gray-950" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default FarmerLayout;
