import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../firebase/auth';
import toast from 'react-hot-toast';
import { Mail, Lock, User, UserPlus, Loader2, Sparkles, ArrowRight } from 'lucide-react';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!name || !email || !password) {
      toast.error('Please enter all fields');
      setLoading(false);
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password, name);
    
    if (error) {
      toast.error(error.includes('email-already-in-use') ? 'Email is already taken' : error);
      setLoading(false);
    } else {
      toast.success('Account created successfully!');
      navigate('/dashboard');
    }
  };

  const inputClass = "w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all font-medium disabled:opacity-50 text-sm";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Floating brand */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tl from-indigo-500 to-violet-600 flex items-center justify-center mx-auto shadow-xl shadow-violet-500/30">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0f172a] shadow-sm" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-5 mb-2 tracking-tight">Create account</h1>
          <p className="text-gray-500 text-sm font-medium">Join and start acing your interviews</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-40 h-40 bg-violet-500/5 rounded-full blur-2xl -ml-10 -mt-10" />

          <form onSubmit={handleSignup} className="space-y-5 relative z-10">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-gray-600 group-focus-within:text-indigo-400 transition-colors duration-200" />
                </div>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} className={inputClass} placeholder="John Doe" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-gray-600 group-focus-within:text-indigo-400 transition-colors duration-200" />
                </div>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} className={inputClass} placeholder="you@university.edu" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-gray-600 group-focus-within:text-indigo-400 transition-colors duration-200" />
                </div>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} className={inputClass} placeholder="At least 6 characters" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary mt-4 group">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              {loading ? 'Creating account...' : 'Create Account'}
              {!loading && <ArrowRight className="w-4 h-4 ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6 relative z-10">
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
