import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, LogOut, Bell, User, Search } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100 px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="p-2 bg-green-600 rounded-lg shadow-lg shadow-green-100">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 hidden sm:inline-block">SmartKisan</span>
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-green-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search crops, mandi rates..." 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-green-600 focus:outline-none transition-all text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button className="p-2.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          
          <div className="h-8 w-[1px] bg-gray-100 mx-1 hidden sm:block" />

          {user && (
            <button className="p-1 pr-3 flex items-center gap-2 hover:bg-gray-50 rounded-full transition-all border border-transparent hover:border-gray-100">
              <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
                {getInitials(user.name)}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-gray-900">{user.name}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{user.role}</div>
              </div>
            </button>
          )}

          <button 
            onClick={handleLogout}
            className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
