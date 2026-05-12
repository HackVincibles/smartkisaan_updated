import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, 
  LogOut, 
  Menu, 
  ChevronLeft, 
  Circle, 
  LayoutGrid,
  Zap,
  Globe,
  Activity,
  Cpu,
  Layers,
  Fingerprint,
  Boxes,
  Radar
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  navItems: any[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  role: string;
}

const Sidebar = ({ navItems, isOpen, setIsOpen, role }: SidebarProps) => {
  const { logout } = useAuth();

  // Role-based accent colors
  const accentColor = role === 'buyer' ? 'secondary' : 'primary';

  return (
    <motion.aside
      initial={{ width: isOpen ? 320 : 100 }}
      animate={{ width: isOpen ? 320 : 100 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-0 top-0 h-full bg-gray-950 text-white z-[50] overflow-hidden border-r border-white/5 shadow-[30px_0_60px_-15px_rgba(0,0,0,0.5)]"
    >
      <div className="flex flex-col h-full relative">
        {/* Abstract Background Decor */}
        <div className={`absolute top-0 right-0 w-80 h-80 bg-${accentColor}/10 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none opacity-60`}></div>
        <div className={`absolute bottom-0 left-0 w-80 h-80 bg-${accentColor}/5 rounded-full blur-[120px] -ml-40 -mb-40 pointer-events-none opacity-60`}></div>

        {/* Logo Section */}
        <div className="h-28 flex items-center px-10 shrink-0 relative z-10">
          <div className={`w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-gray-950 shadow-[0_0_30px_rgba(255,255,255,0.1)] shrink-0 group hover:rotate-12 transition-all duration-700`}>
            <Smartphone size={28} className="stroke-[2.5]" />
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="ml-6 space-y-1"
              >
                <span className="text-sm font-black uppercase tracking-[0.5em] italic leading-none block">
                    SMART<span className={`text-${accentColor} italic`}>.KISSAN</span>
                </span>
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 bg-${accentColor} rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]`}></div>
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] italic">NODE_ALPHA_v4</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Registry */}
        <nav className="flex-1 py-12 overflow-y-auto px-6 relative z-10 scrollbar-hide">
          <div className="mb-10 px-4">
             <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/10 italic leading-none">Command_Registry</p>
          </div>
          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-6 px-6 py-5 rounded-[1.8rem] transition-all duration-700 group relative overflow-hidden border border-transparent
                    ${isActive 
                      ? `bg-white text-gray-950 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.1)] translate-x-3` 
                      : 'text-white/30 hover:text-white hover:bg-white/5 hover:border-white/5'
                    }
                  `}
                >
                  <div className={`shrink-0 transition-all duration-700 ${isOpen ? 'group-hover:scale-125' : ''}`}>
                    <item.icon size={24} className="stroke-[1.5]" />
                  </div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.span 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-[12px] font-black uppercase tracking-[0.4em] italic whitespace-nowrap pt-0.5"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {/* Hover Indicator */}
                  <div className={`absolute left-0 top-0 w-1.5 h-full bg-${accentColor} scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-700`}></div>
                  
                  {/* Subtle Glow (Active) */}
                  <AnimatePresence>
                    {isOpen && (
                        <div className={`absolute inset-0 bg-gradient-to-r from-${accentColor}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                    )}
                  </AnimatePresence>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer Identity Terminal */}
        <div className="p-8 border-t border-white/5 relative z-10 bg-black/40 backdrop-blur-xl">
          <button
            onClick={logout}
            className="flex items-center gap-6 w-full px-6 py-5 rounded-2xl text-white/20 hover:text-error hover:bg-error/10 transition-all duration-500 group overflow-hidden border border-transparent hover:border-error/20"
          >
            <div className="shrink-0 group-hover:rotate-90 transition-transform duration-700">
                <LogOut size={24} className="stroke-[1.5]" />
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[12px] font-black uppercase tracking-[0.5em] italic pt-0.5"
                >
                    Terminate
                </motion.span>
              )}
            </AnimatePresence>
            
            {/* Background Icon Decor */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                <Radar size={80} />
            </div>
          </button>
        </div>
        
        {/* Sidebar Overlay Scanline */}
        <div className="absolute inset-0 pointer-events-none bg-scanline opacity-[0.02]"></div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
