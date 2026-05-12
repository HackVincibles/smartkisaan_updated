import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smartphone, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  navItems: any[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  role: string;
}

const Sidebar = ({ navItems, isOpen, setIsOpen, role }: SidebarProps) => {
  const { logout } = useAuth();

  return (
    <motion.aside
      initial={{ width: isOpen ? 256 : 80 }}
      animate={{ width: isOpen ? 256 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-full bg-white dark:bg-dark-200 border-r border-gray-200 dark:border-dark-300 z-20 overflow-hidden"
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-dark-300">
          <Smartphone className="w-8 h-8 text-primary-600" />
          {isOpen && (
            <span className="ml-2 text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
              Smart-Kissan
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200
                    ${isActive 
                      ? `bg-opacity-10 text-opacity-100` 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-300'
                    }
                  `}
                  style={({ isActive }) => isActive ? { 
                    backgroundColor: `var(--role-${role})1a`, 
                    color: `var(--role-${role})` 
                  } : {}}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {isOpen && (
                    <span className="text-sm font-medium whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-dark-300 p-4">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {isOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
