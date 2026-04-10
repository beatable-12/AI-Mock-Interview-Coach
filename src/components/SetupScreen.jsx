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
    <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-500">
      <div className="bg-primary-600 p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-700 rounded-full blur-3xl opacity-50 -ml-20 -mb-20"></div>
        
        <h1 className="relative z-10 text-3xl font-extrabold text-white mb-2 tracking-tight">AI Mock Interview Coach</h1>
        <p className="relative z-10 text-primary-100 font-medium">Practice. Improve. Land the Job.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 pb-10 space-y-8">
        
        {/* Role Selection */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <User className="w-4 h-4 text-primary-500" />
            Target Role
          </label>
          <div className="relative">
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="w-full appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow disabled:opacity-50"
              disabled={isLoading}
            >
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        {/* Interview Type */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary-500" />
            Interview Type
          </label>
          <div className="flex flex-col gap-2">
            {types.map((t) => (
              <label 
                key={t}
                className={`relative flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  type === t 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-500' 
                  : 'border-gray-200 dark:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full border ${type === t ? 'border-primary-500 bg-primary-500' : 'border-gray-300 dark:border-gray-500'}`}>
                    {type === t && <div className="h-2 w-2 rounded-full bg-white"></div>}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{t}</span>
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
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-primary-500" />
              Number of Questions
            </div>
            <span className="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono">
              {count}
            </span>
          </label>
          <input 
            type="range" 
            min="3" 
            max="10" 
            value={count} 
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary-500 disabled:opacity-50"
            disabled={isLoading}
          />
          <div className="flex justify-between text-xs text-gray-500 font-medium px-1">
            <span>3</span>
            <span>10</span>
          </div>
        </div>

        {/* Submit action */}
        <div className="pt-2">
          <button 
            type="submit" 
            disabled={isLoading}
            className="group relative w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent text-base font-bold rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg dark:focus:ring-offset-gray-900 overflow-hidden"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Preparing Interface...</span>
              </>
            ) : (
              <>
                Start Interview
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
            
            {/* Shimmer effect */}
            {!isLoading && (
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SetupScreen;
