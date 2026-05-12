import React from 'react';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      {/* Main content area */}
      <main className="flex-1 pt-24 pb-24 md:pb-8 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default DashboardLayout;
