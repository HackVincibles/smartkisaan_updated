import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, LayoutGrid, ShoppingBag, PieChart, Truck, User } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const BottomNav = () => {
  const { user } = useAuthStore();
  const role = user?.role || 'farmer';

  const navConfigs = {
    farmer: [
      { icon: Home, label: 'Home', path: '/farmer/dashboard' },
      { icon: LayoutGrid, label: 'Listings', path: '/farmer/listings' },
      { icon: PlusCircle, label: 'Sell', path: '/farmer/create-listing', primary: true },
      { icon: ShoppingBag, label: 'Bids', path: '/farmer/bids' },
      { icon: PieChart, label: 'Market', path: '/farmer/prices' },
    ],
    buyer: [
      { icon: Home, label: 'Home', path: '/buyer/dashboard' },
      { icon: LayoutGrid, label: 'Browse', path: '/' },
      { icon: PlusCircle, label: 'Cart', path: '/buyer/orders', primary: true },
      { icon: ShoppingBag, label: 'My Bids', path: '/buyer/dashboard' },
      { icon: User, label: 'Profile', path: '/wallet' },
    ],
    transport: [
      { icon: Home, label: 'Home', path: '/transport/dashboard' },
      { icon: Truck, label: 'Shipments', path: '/transport/dashboard' },
      { icon: PlusCircle, label: 'Scan', path: '/tracking', primary: true },
      { icon: PieChart, label: 'Routes', path: '/transport/dashboard' },
      { icon: User, label: 'Wallet', path: '/wallet' },
    ]
  };

  const navItems = navConfigs[role as keyof typeof navConfigs] || navConfigs.farmer;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Soft shadow overlay */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-gray-900/5 to-transparent pointer-events-none" />
      
      <div className="bg-white/90 backdrop-blur-2xl border-t border-gray-100 px-4 py-2 pb-6 flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center gap-1 transition-all
              ${item.primary 
                ? 'p-4 -mt-10 bg-green-600 rounded-full shadow-xl shadow-green-200 text-white active:scale-95' 
                : isActive ? 'text-green-600' : 'text-gray-400 hover:text-green-500'}
            `}
          >
            <item.icon className={item.primary ? 'w-7 h-7' : 'w-6 h-6'} />
            {!item.primary && <span className="text-[10px] font-bold uppercase tracking-wide">{item.label}</span>}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
