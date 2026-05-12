import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import { 
  LayoutDashboard, 
  Truck, 
  Navigation, 
  Wallet, 
  FileText,
  Settings,
  Bell,
  HelpCircle,
  History,
  Command,
  Search,
  Zap,
  Globe,
  User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const transporterNavItems = [
  { path: '/transporter', label: 'DASHBOARD', icon: LayoutDashboard },
  { path: '/transporter/loads', label: 'AVAILABLE_LOADS', icon: Navigation },
  { path: '/transporter/orders', label: 'MY_TRIPS', icon: Truck },
  { path: '/transporter/earnings', label: 'FINANCIAL_LEDGER', icon: Wallet },
  { path: '/transporter/profile', label: 'FLEET_SETTINGS', icon: Settings },
];

const TransporterLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-warning selection:text-white">
      <Sidebar 
        navItems={transporterNavItems}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        role="transporter"
      />
      
      <main className={`transition-all duration-[0.8s] ease-[0.16,1,0.3,1] ${sidebarOpen ? 'pl-[320px]' : 'pl-[100px]'}`}>
        {/* Logistics Top Bar */}
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
                placeholder="SEARCH_LOADS_OR_TRIPS..." 
                className="bg-transparent border-none outline-none text-[11px] font-black uppercase tracking-[0.2em] italic w-64 placeholder:text-gray-300"
              />
              <span className="text-[9px] font-black text-gray-300 bg-white px-2 py-1 rounded-md border border-gray-100 shadow-sm group-focus-within:opacity-0 transition-opacity">⌘K</span>
            </div>
          </div>

          <div className="flex items-center gap-10">
            <div className="hidden lg:flex items-center gap-3">
              <div className="w-2 h-2 bg-warning rounded-full animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.8)]"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic leading-none">SYS_LEVEL::OPERATOR</span>
            </div>

            <div className="flex items-center gap-6">
              <button className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-warning hover:bg-white hover:shadow-2xl transition-all relative group">
                <Bell size={22} />
                <span className="absolute top-4 right-4 w-2 h-2 bg-warning rounded-full border-2 border-white"></span>
              </button>
              
              <NavLink to="/transporter/profile" className="flex items-center gap-5 group cursor-pointer">
                <div className="text-right hidden sm:block">
                  <p className="text-[12px] font-black text-gray-950 uppercase tracking-tighter italic leading-none">LOGISTICS_LEAD</p>
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] italic leading-none mt-1">OPERATOR</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gray-950 flex items-center justify-center text-white font-black shadow-2xl group-hover:rotate-12 transition-all duration-700 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-warning/40 to-transparent"></div>
                  <span className="relative z-10 text-[12px] tracking-widest italic">TR</span>
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
          <div className="fixed bottom-12 right-12 opacity-[0.03] pointer-events-none select-none">
            <Globe size={300} className="text-gray-950" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TransporterLayout;
