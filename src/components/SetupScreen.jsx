import React, { useState } from 'react';
import { User, Briefcase, Settings2, Loader2, ArrowRight } from 'lucide-react';

const roles = [
  "Software Engineer Intern",
  "Data Science Intern",
  "Product Manager Intern",
  "Business Analyst Intern",
  "Marketing Intern",
  "General Placement"
];

const types = [
  "HR/Behavioral",
  "Technical (CS/DSA)",
  "Mixed"
];

function SetupScreen({ onStart, isLoading }) {
  const [role, setRole] = useState(roles[0]);
  const [type, setType] = useState(types[0]);
  const [count, setCount] = useState(3);

  const handleSubmit = (e) => {
    e.preventDefault();
    onStart({ role, type, count });
  };

  return (
    <div className="w-full max-w-lg glass-card overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 mx-auto mt-6">
      
      <div className="p-8 pb-4 relative overflow-hidden">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Configure Interview</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">Tailor the AI exactly to your requirements.</p>
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 pt-0 space-y-8 relative z-10">
        
        {/* Role Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-500" />
            Target Role
          </label>
          <div className="relative group">
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="w-full appearance-none bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer font-medium shadow-sm hover:border-gray-300 dark:hover:border-gray-600 disabled:opacity-50"
              disabled={isLoading}
            >
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
              <svg className="fill-current h-4 w-4 transition-transform group-hover:translate-y-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        {/* Interview Type */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-500" />
            Interview Type
          </label>
          <div className="grid grid-cols-1 gap-3">
            {types.map((t) => (
              <label 
                key={t}
                className={`relative flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all shadow-sm ${
                  type === t 
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 ring-1 ring-indigo-500' 
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${type === t ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300 dark:border-gray-600 shadow-inner'}`}>
                    {type === t && <div className="h-2 w-2 rounded-full bg-white shadow-sm"></div>}
                  </div>
                  <span className={`text-sm font-semibold ${type === t ? 'text-indigo-900 dark:text-indigo-100' : 'text-gray-700 dark:text-gray-300'}`}>{t}</span>
                </div>
                <input 
                  type="radio" 
                  name="type" 
                  value={t} 
                  checked={type === t} 
                  onChange={() => setType(t)} 
                  className="sr-only"
                  disabled={isLoading}
                />
              </label>
            ))}
          </div>
        </div>

        {/* Number of Questions */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-indigo-500" />
              Question Count
            </label>
            <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
              {count} Questions
            </span>
          </div>
          <div className="relative">
            <input 
              type="range" 
              min="3" 
              max="10" 
              value={count} 
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 disabled:opacity-50 hover:accent-indigo-400 transition-all"
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 font-semibold px-1">
            <span>Quick (3)</span>
            <span>Deep Dive (10)</span>
          </div>
        </div>

        {/* Submit action */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800/50">
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full btn-primary group overflow-hidden relative"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Preparing Interface...</span>
              </>
            ) : (
              <>
                Initialize Interview
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
            
            {/* Shimmer effect */}
            {!isLoading && (
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SetupScreen;
