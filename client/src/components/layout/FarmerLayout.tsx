import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
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
  Bell
} from 'lucide-react';

const farmerNavItems = [
  { path: '/farmer', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/farmer/listings', label: 'My Listings', icon: Package },
  { path: '/farmer/orders', label: 'Orders & Sales', icon: Truck },
  { path: '/farmer/bids', label: 'Bids & Offers', icon: Gavel },
  { path: '/farmer/insights', label: 'Demand & Mandi', icon: TrendingUp },
  { path: '/farmer/advisor', label: 'AI Crop Advisor', icon: Bot },
  { path: '/farmer/disputes', label: 'Disputes & Ratings', icon: Scale },
  { path: '/farmer/profile', label: 'Settings', icon: Settings },
];

const FarmerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-100">
      <div className="flex">
        <Sidebar 
          navItems={farmerNavItems}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          role="farmer"
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
                <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-300">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium">Ramesh Yadav</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Farmer</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                    RY
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Page Content */}
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerLayout;
