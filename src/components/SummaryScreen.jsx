import React from 'react';
import { RotateCcw, Target, Trophy, XCircle, ChevronRight } from 'lucide-react';

function SummaryScreen({ evaluations, onRestart }) {
  const answered = evaluations.filter(e => !e.skipped);
  const skipped = evaluations.filter(e => e.skipped);
  
  const averageScore = answered.length > 0 
    ? Math.round(answered.reduce((acc, curr) => acc + curr.evaluation.score, 0) / answered.length * 10) / 10
    : 0;
    
  const bestScore = answered.length > 0
    ? Math.max(...answered.map(e => e.evaluation.score))
    : 0;

  // Aggregate improvements
  const allImprovements = answered.flatMap(e => e.evaluation.improvements);
  const topImprovements = [...new Set(allImprovements)].slice(0, 3);

  const scoreColor = 
    averageScore >= 8 ? 'text-green-500' :
    averageScore >= 5 ? 'text-amber-500' : 'text-red-500';

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
      
      {/* Top Hero Section */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-primary-600 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>
          <h1 className="relative z-10 text-3xl font-extrabold tracking-tight mb-2">Interview Complete!</h1>
          <p className="relative z-10 text-primary-100">Here's how you performed overall.</p>
        </div>
        
        <div className="p-8 pb-10 flex flex-col md:flex-row items-center justify-center gap-10">
          <div className="flex flex-col items-center">
            <p className="text-gray-500 dark:text-gray-400 font-bold mb-2">Average Score</p>
            <div className={`text-6xl font-extrabold ${scoreColor}`}>
              {averageScore}<span className="text-2xl text-gray-400">/10</span>
            </div>
          </div>
          
          <div className="h-px w-full md:w-px md:h-24 bg-gray-200 dark:bg-gray-700"></div>
          
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <StatCard icon={<Target className="w-5 h-5 text-blue-500" />} label="Answered" value={answered.length} />
            <StatCard icon={<XCircle className="w-5 h-5 text-gray-400" />} label="Skipped" value={skipped.length} />
            <StatCard icon={<Trophy className="w-5 h-5 text-amber-500" />} label="Best Score" value={bestScore} className="col-span-2" />
          </div>
        </div>
      </div>

      {/* Aggregate Feedback */}
      {topImprovements.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-amber-800 dark:text-amber-400 mb-4 flex items-center gap-2">
            Top focus areas for next time
          </h3>
          <div className="flex flex-wrap gap-2">
            {topImprovements.map((imp, i) => (
              <span key={i} className="bg-white dark:bg-gray-800 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm">
                {imp}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Breakdown per Question */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Question Breakdown</h3>
        <div className="space-y-4">
          {evaluations.map((ev, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 font-bold text-gray-700 dark:text-gray-300 shadow-sm">
                Q{i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white truncate">
                  {ev.question.question}
                </p>
                {ev.skipped ? (
                  <p className="text-sm text-gray-500 mt-1 italic">You skipped this question.</p>
                ) : (
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-bold rounded">
                      Score: {ev.evaluation.score}/10
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {ev.evaluation.headline}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center pb-8">
         <button
            onClick={onRestart}
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-white text-white dark:text-gray-900 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            <RotateCcw className="w-5 h-5" />
            Start Another Interview
          </button>
      </div>

    </div>
  );
}

function StatCard({ icon, label, value, className = '' }) {
  return (
    <div className={`bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center gap-3 ${className}`}>
      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
        <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

export default SummaryScreen;
