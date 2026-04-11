import React from 'react';
import { CheckCircle, ArrowRight, Star, TrendingUp, Award, AlertTriangle } from 'lucide-react';

function FeedbackScreen({ evaluation, onNext, isLast }) {
  if (!evaluation) return null;

  const { score, headline, summary, strengths, improvements, usesSTAR } = evaluation;

  const scoreColor = 
    score >= 8 ? 'text-emerald-500' :
    score >= 5 ? 'text-amber-500' : 'text-rose-500';

  const scoreRing = 
    score >= 8 ? 'border-emerald-500 shadow-emerald-500/30' :
    score >= 5 ? 'border-amber-500 shadow-amber-500/30' : 'border-rose-500 shadow-rose-500/30';

  return (
    <div className="w-full max-w-4xl mx-auto glass-card overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      
      {/* Top Banner */}
      <div className="bg-gray-50/50 dark:bg-[#0E1117]/50 border-b border-gray-100 dark:border-gray-800 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="flex-1 space-y-4 text-center md:text-left relative z-10">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-200 dark:border-indigo-800/50">
            Analysis Complete
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
            {headline}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 font-medium text-lg leading-relaxed">
            {summary}
          </p>
        </div>
        
        <div className="flex-shrink-0 relative z-10">
          <div className={`w-32 h-32 rounded-full border-4 ${scoreRing} flex flex-col items-center justify-center bg-white dark:bg-[#161B22] shadow-xl`}>
            <span className={`text-4xl font-black ${scoreColor}`}>
              {score}
            </span>
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">/ 10</span>
          </div>
        </div>
      </div>

      <div className="p-8 md:p-12 space-y-10">
        
        {/* STAR Badge */}
        <div className={`flex items-center gap-4 p-5 rounded-2xl border shadow-sm transition-all hover:shadow-md ${usesSTAR ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 dark:from-amber-900/10 dark:to-orange-900/10 dark:border-amber-800/40' : 'bg-gray-50 border-gray-200 dark:bg-gray-800/40 dark:border-gray-700'}`}>
          <div className={`w-12 h-12 flex items-center justify-center rounded-xl shadow-sm ${usesSTAR ? 'bg-amber-100 text-amber-600 dark:bg-amber-800/40 dark:text-amber-400 border border-amber-200 dark:border-amber-700' : 'bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700'}`}>
            <Star className="w-6 h-6" fill={usesSTAR ? "currentColor" : "none"} />
          </div>
          <div className="flex-1">
            <h4 className={`font-bold text-lg ${usesSTAR ? 'text-amber-900 dark:text-amber-300' : 'text-gray-800 dark:text-gray-200'}`}>
              {usesSTAR ? "Great STAR Method Usage!" : "STAR Method Not Detected"}
            </h4>
            <p className={`text-sm font-medium mt-1 ${usesSTAR ? 'text-amber-700/80 dark:text-amber-400/80' : 'text-gray-500 dark:text-gray-400'}`}>
              {usesSTAR 
                ? "You effectively structured your answer using Situation, Task, Action, and Result." 
                : "Tip: Try structuring your next answer using Situation, Task, Action, and Result."}
            </p>
          </div>
        </div>

        {/* Strengths & Improvements */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <h3 className="font-extrabold text-gray-900 dark:text-white flex items-center gap-2 text-lg">
              <Award className="w-5 h-5 text-emerald-500" />
              Key Strengths
            </h3>
            <ul className="space-y-3">
              {strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-3 bg-white dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 font-semibold">{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5">
            <h3 className="font-extrabold text-gray-900 dark:text-white flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              Focus Areas
            </h3>
            <ul className="space-y-3">
              {improvements.map((imp, i) => (
                <li key={i} className="flex items-start gap-3 bg-white dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 font-semibold">{imp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200/50 dark:border-gray-800/50 flex justify-end">
          <button
            onClick={onNext}
            className="btn-primary w-full md:w-auto px-10 py-3.5"
          >
            {isLast ? "View Final Summary" : "Next Question"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FeedbackScreen;
