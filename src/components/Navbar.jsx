import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logOut } from '../firebase/auth';
import toast from 'react-hot-toast';
import { LogOut, User as UserIcon, Menu } from 'lucide-react';

function Navbar() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    const { error } = await logOut();
    if (error) {
      toast.error(error);
    } else {
      toast.success("Logged out safely.");
      navigate('/');
    }
  };

  const navLinkClass = (path) => 
    `text-sm font-medium transition-all px-3 py-1.5 rounded-full ${
      location.pathname === path 
        ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800/50 shadow-sm' 
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/30'
    }`;

  return (
    <nav className="glass sticky top-0 z-50 border-b-0 border-b-gray-200/50 dark:border-b-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-glow-sm transition-transform group-hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">CoachAI</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/about" className={navLinkClass('/about')}>About</Link>
              <Link to="/how-it-works" className={navLinkClass('/how-it-works')}>How It Works</Link>
              <Link to="/contact" className={navLinkClass('/contact')}>Contact</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <>
                <Link to="/dashboard" className="hidden md:block text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Dashboard
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 glass px-3 py-1.5 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-all border border-gray-200 dark:border-gray-700/80">
                    <UserIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 hidden sm:block">
                      {currentUser.displayName || "User"}
                    </span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 glass rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right translate-y-2 group-hover:translate-y-0">
                    <div className="p-1.5">
                      <Link to="/dashboard" className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                        Dashboard
                      </Link>
                      <div className="h-px bg-gray-100 dark:bg-gray-800/80 my-1"></div>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Log out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Log in
                </Link>
                <Link to="/signup" className="text-sm font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-full transition-all hover:scale-105 hover:shadow-lg">
                  Sign up
                </Link>
              </div>
            )}
            <button className="md:hidden p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
               <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
