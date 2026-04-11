import React from 'react';
import { RefreshCw, LayoutDashboard, Target, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function SummaryScreen({ evaluations, onRestart }) {
  const navigate = useNavigate();

  const answered = evaluations.filter(e => !e.skipped);
  const averageScore = answered.length > 0 
    ? Math.round(answered.reduce((acc, curr) => acc + curr.evaluation.score, 0) / answered.length * 10) / 10
    : 0;

  const scoreColor = 
    averageScore >= 8 ? 'text-emerald-500' :
    averageScore >= 5 ? 'text-amber-500' : 'text-rose-500';

  const progressBg = 
    averageScore >= 8 ? 'bg-emerald-500' :
    averageScore >= 5 ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 py-6">
      
      {/* Header Card */}
      <div className="glass-card mb-8 overflow-hidden relative border-b-4 border-indigo-500">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="p-8 md:p-12 text-center relative z-10">
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-indigo-200 dark:border-indigo-800">
            <Trophy className="w-10 h-10" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Interview Completed!</h1>
          
          <div className="flex flex-col items-center mt-8">
            <div className="flex items-end gap-2 mb-2">
              <span className={`text-6xl font-black ${scoreColor}`}>{averageScore}</span>
              <span className="text-2xl font-bold text-gray-400 mb-2">/ 10</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider text-sm mb-6">Overall Average Score</p>
            
            {/* Minimal Progress Bar */}
            <div className="w-full max-w-md h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
              <div 
                className={`h-full ${progressBg} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${(averageScore / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50/80 dark:bg-[#0E1117]/80 p-6 flex flex-col sm:flex-row justify-center gap-4 relative z-10 border-t border-gray-100 dark:border-gray-800">
           <button onClick={() => navigate('/dashboard')} className="btn-secondary">
             <LayoutDashboard className="w-5 h-5" />
             Back to Dashboard
           </button>
           <button onClick={onRestart} className="btn-primary">
             <RefreshCw className="w-5 h-5" />
             Start New Interview
           </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 px-2">
         <Target className="w-5 h-5 text-indigo-500" />
         <h2 className="text-xl font-bold text-gray-900 dark:text-white">Question Breakdown</h2>
      </div>

      <div className="grid gap-6">
        {evaluations.map((evalItem, index) => {
          if (evalItem.skipped) {
            return (
              <div key={index} className="glass-card p-6 opacity-60 border-dashed">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-black text-gray-300 dark:text-gray-700">Q{index + 1}</span>
                  <div>
                    <h3 className="font-bold text-gray-700 dark:text-gray-300 line-through decoration-2 decoration-gray-400/50">{evalItem.question.question}</h3>
                    <span className="text-sm font-semibold text-gray-500 dark:text-gray-500">Skipped by user</span>
                  </div>
                </div>
              </div>
            );
          }

          const qScore = evalItem.evaluation.score;
          const qColor = qScore >= 8 ? 'text-emerald-500 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800/40' : 
                         qScore >= 5 ? 'text-amber-500 bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800/40' : 
                         'text-rose-500 bg-rose-50 border-rose-200 dark:bg-rose-900/10 dark:border-rose-800/40';

          return (
            <div key={index} className="glass-card p-6 overflow-hidden relative group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-400 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center flex-shrink-0 shadow-sm ${qColor}`}>
                  <span className="text-2xl font-black">{qScore}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Question {index + 1}</span>
                    {evalItem.evaluation.usesSTAR && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                        STAR Detected
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight mb-3">
                    {evalItem.question.question}
                  </h3>
                  <div className="p-4 bg-gray-50 dark:bg-[#0E1117]/80 rounded-xl border border-gray-100 dark:border-gray-800 shadow-inner">
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic line-clamp-3">
                      "{evalItem.answer}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-6 border-t border-gray-100 dark:border-gray-800/80">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    What went well
                  </h4>
                  <ul className="space-y-2">
                    {evalItem.evaluation.strengths.slice(0, 2).map((str, i) => (
                      <li key={i} className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-start gap-2">
                        <span className="text-emerald-500 mt-0.5">•</span>
                        {str}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                    How to improve
                  </h4>
                  <ul className="space-y-2">
                    {evalItem.evaluation.improvements.slice(0, 2).map((imp, i) => (
                      <li key={i} className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">•</span>
                        {imp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SummaryScreen;
