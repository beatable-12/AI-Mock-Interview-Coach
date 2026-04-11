import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logIn } from '../firebase/auth';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn, Loader2, Sparkles } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Basic validation
    if (!email || !password) {
      toast.error('Please enter all fields');
      setLoading(false);
      return;
    }

    const { error } = await logIn(email, password);
    
    if (error) {
      toast.error(error.includes('auth/invalid-credential') ? 'Invalid email or password' : error);
      setLoading(false);
    } else {
      toast.success('Welcome back!');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-card overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 relative">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl"></div>

        <div className="p-8 relative z-10">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center mx-auto mb-6 shadow-indigo-500/30 shadow-lg">
              <Sparkles className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Continue your interview preparation journey.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium disabled:opacity-50 shadow-sm"
                  placeholder="you@university.edu"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium disabled:opacity-50 shadow-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary mt-8"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5 -ml-1" />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-100 dark:border-gray-800 pt-6">
            <p className="text-gray-500 dark:text-gray-400 font-medium">
              Don't have an account?{' '}
              <Link to="/signup" className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
