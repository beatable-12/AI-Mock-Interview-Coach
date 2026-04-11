import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserInterviews } from '../firebase/firestore';
import { 
  PlusCircle, Calendar, Trophy, Briefcase, FileQuestion, 
  ArrowRight, Loader2, Sparkles, TrendingUp, TrendingDown, 
  Zap, Lightbulb, Star
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { HeroVisualSvg, EmptyStateSvg } from '../components/illustrations/SvgIllustrations';

function Dashboard() {
  const { currentUser } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!currentUser) return;
      const { interviews, error } = await getUserInterviews(currentUser.uid);
      if (error) {
        toast.error("Error loading interview history: " + error);
      } else {
        setInterviews(interviews);
      }
      setLoading(false);
    }
    fetchData();
  }, [currentUser]);

  // Calculations
  const totalInterviews = interviews.length;
  
  const averageScoreAllTime = totalInterviews > 0 
    ? Math.round(interviews.reduce((acc, curr) => acc + (curr.averageScore || 0), 0) / totalInterviews * 10) / 10
    : 0;

  const bestScore = totalInterviews > 0 
    ? Math.max(...interviews.map(i => i.averageScore || 0))
    : 0;

  let improvement = 0;
  if (totalInterviews >= 2) {
    const newest = interviews[0].averageScore || 0;
    const older = interviews[1].averageScore || 0; // The previous one
    if (older > 0) {
      improvement = Math.round(((newest - older) / older) * 100);
    } else if (newest > 0) {
      improvement = 100;
    }
  }

  // Transform data for chart if there are multiple interviews
  const chartData = [...interviews]
    .reverse() // Sort oldest to newest for the chart timeline
    .map((int, index) => ({
      name: `Int ${index + 1}`,
      score: int.averageScore || 0
    }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Premium Hero Banner (Split Layout) */}
      <div className="glass-card p-0 mb-8 flex flex-col md:flex-row items-center justify-between relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-110"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        <div className="p-8 md:p-12 relative z-10 flex-1 w-full">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> Workspace Active
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight leading-tight">
            Level up your career, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">{currentUser.displayName || "User"}</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg leading-relaxed max-w-lg mb-8">
            Track your progress, review past feedback, and improve faster with AI-driven analytics.
          </p>
          <div className="flex gap-4">
            <Link to="/interview" className="btn-primary flex-1 md:flex-none justify-center">
              <PlusCircle className="w-5 h-5" /> Start Interview
            </Link>
          </div>
        </div>
        
        {/* Right Side Illustration */}
        <div className="hidden md:flex relative z-10 w-1/3 justify-center items-center p-8 bg-gradient-to-l from-indigo-50/50 to-transparent dark:from-indigo-900/10 h-full min-h-[300px]">
           <HeroVisualSvg className="w-full h-auto drop-shadow-xl" />
        </div>
      </div>

      {/* 4-Card Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        
        {/* Total Interviews */}
        <div className="glass-card p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Briefcase className="w-16 h-16 text-indigo-500" />
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 flex items-center justify-center mb-4 shadow-sm">
            <FileQuestion className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Total Interviews</p>
          <div className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors">{totalInterviews}</div>
        </div>

        {/* Avg Score */}
        <div className="glass-card p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Trophy className="w-16 h-16 text-indigo-500" />
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/50 flex items-center justify-center mb-4 shadow-sm">
            <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Average Score</p>
          <div className="flex items-baseline gap-1">
             <div className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors">{averageScoreAllTime}</div>
             <span className="text-sm font-semibold text-gray-400">/ 10</span>
          </div>
        </div>

        {/* Best Score */}
        <div className="glass-card p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Star className="w-16 h-16 text-emerald-500" />
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-center mb-4 shadow-sm">
            <Trophy className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Best Score</p>
          <div className="flex items-baseline gap-1">
             <div className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors">{bestScore}</div>
             <span className="text-sm font-semibold text-gray-400">/ 10</span>
          </div>
        </div>

        {/* Improvement */}
        <div className="glass-card p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            {improvement >= 0 ? <TrendingUp className="w-16 h-16 text-emerald-500" /> : <TrendingDown className="w-16 h-16 text-rose-500" />}
          </div>
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 shadow-sm ${improvement >= 0 ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50' : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/50'}`}>
            {improvement >= 0 ? <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> : <TrendingDown className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Latest Trend</p>
          <div className="flex items-center gap-1.5">
             <div className={`text-3xl md:text-4xl font-black ${improvement > 0 ? 'text-emerald-500' : improvement < 0 ? 'text-rose-500' : 'text-gray-900 dark:text-white'}`}>
               {improvement > 0 ? '+' : ''}{improvement}%
             </div>
          </div>
        </div>

      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Content Area (Recent Interviews) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Recent Interviews
            </h2>
          </div>

          {interviews.length === 0 ? (
            <div className="glass-card flex flex-col md:flex-row items-center border-dashed border-2 border-gray-200 dark:border-gray-800 p-8 gap-8">
              <div className="w-48 h-48 flex-shrink-0 animate-float">
                <EmptyStateSvg />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No history found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                  Your past interview records will appear here securely. Take your first interactive session to start generating powerful analytical insights.
                </p>
                <Link to="/interview" className="btn-primary w-full md:w-auto inline-flex">
                  Start Your First Interview
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {interviews.map((interview) => (
                <div key={interview.id} className="glass-card p-5 group flex flex-col sm:flex-row justify-between sm:items-center gap-4 cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-800/60 hover:shadow-md transition-all">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{interview.role}</h4>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-sm">
                        {interview.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> 
                        {interview.createdAt?.toDate().toLocaleDateString() || "Recently"}
                      </span>
                      <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> 
                        {interview.evaluations?.length || 0} QS
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                    <div className="flex flex-col items-end">
                       <span className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1">Score</span>
                       <div className={`flex items-center justify-center px-4 py-1.5 rounded-xl font-black border-2 shadow-sm ${
                        interview.averageScore >= 8 ? 'text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-800/30' :
                        interview.averageScore >= 5 ? 'text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800/30' :
                        'text-rose-600 border-rose-200 bg-rose-50 dark:bg-rose-900/10 dark:border-rose-800/30'
                      }`}>
                        {interview.averageScore}
                      </div>
                    </div>

                    <div className="p-2 text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-transform group-hover:translate-x-1">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Right Sidebar (Charts & Quick Actions) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Quick Actions Panel */}
          <div className="glass-card p-6 overflow-hidden relative">
             <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
             <h3 className="font-bold text-gray-900 dark:text-white mb-4 relative z-10">Quick Actions</h3>
             
             <div className="space-y-3 relative z-10">
                <Link to="/interview" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors group">
                   <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform shadow-sm">
                      <PlusCircle className="w-5 h-5" />
                   </div>
                   <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">New Interview</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Generate a new session</p>
                   </div>
                </Link>

                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors group cursor-pointer">
                   <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform shadow-sm">
                      <Lightbulb className="w-5 h-5" />
                   </div>
                   <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Tips & Tricks</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Learn the STAR method</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Chart Panel (Only visible if > 1 interviews) */}
          {totalInterviews > 1 && (
            <div className="glass-card p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-6">Performance Trend</h3>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.15} />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} domain={[0, 10]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#161b22', borderRadius: '12px', border: '1px solid #374151', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
                      itemStyle={{ color: '#8b5cf6', fontWeight: 'bold' }}
                      cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Line type="monotone" dataKey="score" stroke="url(#colorGradient)" strokeWidth={4} dot={{ r: 5, fill: '#1e1b4b', stroke: '#8b5cf6', strokeWidth: 2 }} activeDot={{ r: 7, stroke: '#fff', strokeWidth: 2 }} />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#d946ef" />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}

export default Dashboard;
