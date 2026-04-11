import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logOut } from '../firebase/auth';
import toast from 'react-hot-toast';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Clock, 
  Settings, 
  LogOut, 
  Sparkles 
} from 'lucide-react';

function Sidebar() {
  const { currentUser } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'New Interview', path: '/interview', icon: <MessageSquare className="w-5 h-5" /> },
    // History currently maps to Dashboard where recent interviews are shown
    { name: 'History', path: '/dashboard', icon: <Clock className="w-5 h-5" /> }, 
  ];

  if (!currentUser) return null;

  return (
    <aside className="w-64 h-full glass-sidebar flex flex-col justify-between flex-shrink-0 z-50">
      
      {/* Brand & Nav */}
      <div>
        <div className="p-6 pb-8 border-b border-white/5">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-glow-sm">
                <Sparkles className="w-5 h-5 text-white" />
             </div>
             <div>
                <h1 className="text-xl font-extrabold text-white tracking-tight">Coach<span className="text-indigo-400">AI</span></h1>
                <p className="text-[10px] uppercase tracking-widest text-indigo-300 font-bold opacity-80">Pro Workspace</p>
             </div>
          </div>
        </div>

        <nav className="p-4 space-y-2 mt-4">
          <p className="px-3 text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Main Menu</p>
          {navLinks.map((link) => {
            // Very simple active check
            const isActive = location.pathname === link.path && link.name !== 'History'; 
            
            return (
              <NavLink 
                key={link.name} 
                to={link.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl font-semibold transition-all group ${
                  isActive 
                  ? 'bg-indigo-500/10 text-indigo-400' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }`}
              >
                <div className={`${isActive ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-300'} transition-colors`}>
                  {link.icon}
                </div>
                {link.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-white/5">
         <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 border border-white/5 mb-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold uppercase border border-indigo-500/30">
               {currentUser.displayName ? currentUser.displayName.charAt(0) : <Settings className="w-5 h-5" />}
            </div>
            <div className="flex flex-col flex-1 overflow-hidden">
               <span className="text-sm font-bold text-gray-200 truncate">{currentUser.displayName || "User"}</span>
               <span className="text-xs text-gray-500 truncate">{currentUser.email}</span>
            </div>
         </div>
         
         <button 
           onClick={handleLogout}
           className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-rose-500/10 hover:text-rose-400 font-semibold transition-colors"
         >
           <LogOut className="w-5 h-5" />
           Sign Out
         </button>
      </div>

    </aside>
  );
}

export default Sidebar;
