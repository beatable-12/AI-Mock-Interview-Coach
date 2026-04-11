import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logOut } from '../firebase/auth';
import toast from 'react-hot-toast';
import {
  PanelLeft,
  X,
  LayoutDashboard,
  MessageSquare,
  History,
  Info,
  LogOut,
  Bot,
} from 'lucide-react';

const NAV_LINKS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'New Interview', path: '/interview', icon: MessageSquare },
  { name: 'History', path: '/dashboard', icon: History },
  { name: 'About', path: '/about', icon: Info },
];

function Sidebar({ collapsed, onToggle, isMobile, mobileOpen, onCloseMobile }) {
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
      if (isMobile) onCloseMobile();
    } catch {
      toast.error('Failed to log out');
    } finally {
      setLoggingOut(false);
    }
  };

  if (!currentUser) return null;

  const initials = currentUser.displayName
    ? currentUser.displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : currentUser.email[0].toUpperCase();

  const sidebarWidthClass = isMobile ? 'w-60' : (collapsed ? 'w-16' : 'w-60');

  const onNavClick = () => {
    if (isMobile) onCloseMobile();
  };

  const isActiveRoute = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {isMobile && (
        <div
          onClick={onCloseMobile}
          className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen z-50 flex flex-col bg-white/5 backdrop-blur-lg border-r border-white/10 transition-all duration-300 ${sidebarWidthClass} ${
          isMobile ? `transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}` : 'translate-x-0'
        }`}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 -left-10 h-44 w-44 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute bottom-6 -right-8 h-32 w-32 rounded-full bg-violet-500/20 blur-3xl" />
        </div>

        <div className={`relative z-10 flex items-center ${collapsed ? 'justify-center px-2 py-3' : 'justify-between px-3 py-3'} border-b border-white/10`}>
          <button
            onClick={() => {
              navigate('/about');
              onNavClick();
            }}
            className={`group flex items-center ${collapsed ? 'justify-center' : 'gap-3'} rounded-xl px-2 py-2 transition-all duration-300 hover:bg-white/10`}
            aria-label="Go to about"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/40">
              <Bot className="h-4 w-4 text-white" />
            </span>
            {!collapsed && (
              <span className="text-left">
                <span className="block text-sm font-semibold text-white">Coach AI</span>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-indigo-300/80">Workspace</span>
              </span>
            )}
          </button>

          {!collapsed && !isMobile && (
            <button
              onClick={onToggle}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
              aria-label="Toggle sidebar"
              title="Toggle sidebar"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          )}

          {isMobile && (
            <button
              onClick={onCloseMobile}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
              aria-label="Close sidebar"
              title="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {!isMobile && collapsed && (
          <div className="relative z-10 px-2 py-2 border-b border-white/10">
            <button
              onClick={onToggle}
              className="w-full flex h-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
              aria-label="Expand sidebar"
              title="Expand sidebar"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          </div>
        )}

        <nav className="relative z-10 flex-1 px-2 py-3 space-y-1 overflow-y-auto">
          {NAV_LINKS.map(({ name, path, icon: Icon }) => {
            const active = isActiveRoute(path);

            return (
              <button
                key={name}
                onClick={() => {
                  navigate(path);
                  onNavClick();
                }}
                title={collapsed ? name : undefined}
                className={`group relative w-full flex items-center rounded-xl transition-all duration-300 ${
                  collapsed ? 'justify-center h-11' : 'gap-3 px-3 h-11'
                } ${
                  active
                    ? 'bg-gradient-to-r from-indigo-500/25 to-violet-500/25 border border-indigo-400/40 text-indigo-100 shadow-[0_0_24px_rgba(99,102,241,0.25)]'
                    : 'text-gray-300 border border-transparent hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]'
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? 'text-indigo-200' : 'text-gray-300 group-hover:text-white'}`} />
                {!collapsed && <span className="text-sm font-medium">{name}</span>}
              </button>
            );
          })}
        </nav>

        <div className="relative z-10 border-t border-white/10 p-2 space-y-2">
          <div
            className={`flex items-center rounded-xl bg-white/5 border border-white/10 ${
              collapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2.5'
            }`}
            title={collapsed ? (currentUser.displayName || currentUser.email) : undefined}
          >
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-semibold text-sm flex items-center justify-center shrink-0">
              {initials}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{currentUser.displayName || 'User'}</p>
                <p className="truncate text-xs text-gray-400">{currentUser.email}</p>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            title={collapsed ? 'Sign Out' : undefined}
            className={`w-full flex items-center rounded-xl border border-white/10 bg-white/5 text-gray-200 hover:bg-rose-500/15 hover:border-rose-400/40 hover:text-rose-200 transition-all duration-300 ${
              collapsed ? 'justify-center h-10' : 'gap-3 px-3 h-10'
            }`}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="text-sm font-medium">{loggingOut ? 'Signing out...' : 'Sign Out'}</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
