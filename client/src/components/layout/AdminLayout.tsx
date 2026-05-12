import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Truck, 
  Scale, 
  Shield, 
  Settings,
  Bell,
  Database,
  BarChart3,
  FileText
} from 'lucide-react';

const adminNavItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/users', label: 'User Management', icon: Users },
  { path: '/admin/orders', label: 'Global Orders', icon: ShoppingBag },
  { path: '/admin/logistics', label: 'Logistics Control', icon: Truck },
  { path: '/admin/escrow', label: 'Escrow & Finance', icon: Shield },
  { path: '/admin/disputes', label: 'Dispute Resolution', icon: Scale },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/admin/logs', label: 'Audit Logs', icon: Database },
  { path: '/admin/settings', label: 'System Settings', icon: Settings },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-100 text-gray-900 dark:text-gray-100">
      <div className="flex">
        <Sidebar 
          navItems={adminNavItems}
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          role="admin"
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
                <div className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-[10px] font-black uppercase tracking-widest">
                  Live Admin Mode
                </div>
                <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-300">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-black text-gray-900 dark:text-white">Admin Console</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-tighter">Root Access</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-black shadow-lg shadow-red-100 dark:shadow-none">
                    AD
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

export default AdminLayout;
