import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Dumbbell, 
  History, 
  LogOut, 
  Settings,
  BrainCircuit,
  User,
  Zap,
  Trophy
} from 'lucide-react';

const Sidebar = () => {
  const { logout } = useAuth();
  
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/exercises', icon: Dumbbell, label: 'Exercises' },
    { to: '/history', icon: History, label: 'History' },
    { to: '/records', icon: Trophy, label: 'PR Hall' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="w-72 bg-slate-950 flex flex-col p-8 hidden lg:flex h-screen sticky top-0 shrink-0 border-r border-white/5">
      {/* Brand */}
      <div className="flex items-center gap-3 mb-12 px-2 group cursor-pointer">
        <div className="p-2.5 bg-primary-500 rounded-2xl shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform duration-300">
          <Dumbbell className="h-6 w-6 text-white" />
        </div>
        <div>
          <span className="block font-black text-2xl tracking-tighter text-white leading-none italic">FITCHECK</span>
          <span className="text-[10px] font-bold text-primary-500 tracking-[0.2em] uppercase opacity-80">AI Powered</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="space-y-1.5 flex-1">
        <p className="px-4 text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Main Menu</p>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                `w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 group ${
                  isActive 
                  ? 'bg-white/10 text-white border border-white/10 shadow-xl' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'
                }`
              }
            >
              <item.icon size={20} className="transition-transform group-hover:scale-110" />
              <span className="tracking-tight">{item.label}</span>
              {item.to === '/' && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="mt-auto pt-8 border-t border-white/5">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-4 px-4 py-3.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-2xl font-bold transition-all duration-300 group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="tracking-tight">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
