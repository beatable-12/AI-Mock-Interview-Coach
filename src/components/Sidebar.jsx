import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logOut } from '../firebase/auth';
import toast from 'react-hot-toast';
import {
  LayoutDashboard,
  MessageSquare,
  History,
  LogOut,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

const NAV_LINKS = [
  { name: 'Dashboard',     path: '/dashboard', icon: LayoutDashboard },
  { name: 'New Interview', path: '/interview',  icon: MessageSquare   },
  { name: 'History',       path: '/dashboard',  icon: History         },
];

function Sidebar() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logOut();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch {
      toast.error('Failed to log out');
    } finally {
      setLoggingOut(false);
    }
  };

  if (!currentUser) return null;

  const initials = currentUser.displayName
    ? currentUser.displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : currentUser.email[0].toUpperCase();

  return (
    <aside className="w-64 h-full flex flex-col flex-shrink-0 z-50 relative"
      style={{ background: 'linear-gradient(180deg, rgba(11,15,25,0.95) 0%, rgba(15,23,42,0.98) 100%)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>

      {/* Sidebar inner glow blob */}
      <div className="absolute top-0 left-0 w-full h-48 bg-indigo-600/10 blur-[80px] pointer-events-none rounded-b-full" />

      {/* Brand */}
      <div className="p-6 pb-5 relative z-10">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300 group-hover:scale-105">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0b0f19] shadow-sm" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tight leading-none">
              Coach<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">AI</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-400/70 font-bold mt-0.5">Pro Workspace</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 mt-3 relative z-10">
        <p className="px-3 text-[10px] font-black uppercase tracking-[0.15em] text-gray-600 mb-3">Navigation</p>
        {NAV_LINKS.map(({ name, path, icon: Icon }) => {
          const isActive = location.pathname === path && !(name === 'History' && path === '/dashboard' && location.pathname === '/interview');
          return (
            <NavLink
              key={name}
              to={path}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                isActive
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              {/* Active background pill */}
              {isActive && (
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600/20 to-violet-600/10 border border-indigo-500/20 shadow-inner" />
              )}
              {/* Left accent bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-gradient-to-b from-indigo-400 to-violet-500 shadow-sm shadow-indigo-500/50" />
              )}
              <div className={`relative z-10 transition-all duration-200 ${isActive ? 'text-indigo-400' : 'text-gray-600 group-hover:text-gray-300'}`}>
                <Icon className="w-4.5 h-4.5 w-5 h-5" />
              </div>
              <span className="relative z-10 flex-1">{name}</span>
              {isActive && (
                <ChevronRight className="relative z-10 w-3.5 h-3.5 text-indigo-400/60" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* User footer */}
      <div className="p-4 relative z-10">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all cursor-default mb-3 group">
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/40 to-violet-600/40 text-indigo-200 flex items-center justify-center font-black text-xs border border-indigo-500/30 shadow-sm select-none">
              {initials}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border border-[#0b0f19]" />
          </div>
          <div className="flex flex-col flex-1 overflow-hidden min-w-0">
            <span className="text-sm font-bold text-gray-200 truncate leading-none mb-0.5">
              {currentUser.displayName || 'User'}
            </span>
            <span className="text-[11px] text-gray-600 truncate">{currentUser.email}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 border border-transparent font-semibold text-sm transition-all duration-200 group disabled:opacity-50"
        >
          <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
          {loggingOut ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
