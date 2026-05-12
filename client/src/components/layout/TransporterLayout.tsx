import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
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
  History
} from 'lucide-react';

const transporterNavItems = [
  { path: '/transporter', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/transporter/loads', label: 'Available Loads', icon: Navigation },
  { path: '/transporter/orders', label: 'My Trips', icon: Truck },
  { path: '/transporter/earnings', label: 'Earnings', icon: Wallet },
  { path: '/transporter/history', label: 'History', icon: History },
  { path: '/transporter/documents', label: 'KYC & Documents', icon: FileText },
  { path: '/transporter/support', label: 'Help & Support', icon: HelpCircle },
  { path: '/transporter/profile', label: 'Settings', icon: Settings },
];

const TransporterLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-100">
      <div className="flex">
        <Sidebar 
          navItems={transporterNavItems}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          role="transporter"
        />
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
          {/* Top Bar */}
          <div className="sticky top-0 z-10 bg-white dark:bg-dark-200 border-b border-gray-200 dark:border-dark-300 px-6 py-3">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Online
                </div>
                <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-300">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium">Logistics Pro</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Transporter</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-semibold">
                    LP
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransporterLayout;
