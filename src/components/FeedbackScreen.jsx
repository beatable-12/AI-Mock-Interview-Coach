import React from 'react';
import { CheckCircle, ArrowRight, Star, TrendingUp, Award, AlertTriangle } from 'lucide-react';

function FeedbackScreen({ evaluation, onNext, isLast }) {
  if (!evaluation) return null;

  const { score, headline, summary, strengths, improvements, usesSTAR } = evaluation;

  const scoreColor = 
    score >= 8 ? 'text-green-500' :
    score >= 5 ? 'text-amber-500' : 'text-red-500';

  const scoreRing = 
    score >= 8 ? 'border-green-500' :
    score >= 5 ? 'border-amber-500' : 'border-red-500';

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      
      {/* Top Banner */}
      <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 justify-between">
        <div className="flex-1 space-y-2 text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {headline}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {summary}
          </p>
        </div>
        
        <div className="flex-shrink-0 relative">
          <div className={`w-24 h-24 rounded-full border-4 ${scoreRing} flex flex-col items-center justify-center bg-white dark:bg-gray-800 shadow-inner`}>
            <span className={`text-3xl font-extrabold ${scoreColor}`}>
              {score}
            </span>
            <span className="text-xs font-bold text-gray-400">/ 10</span>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-8">
        
        {/* STAR Badge */}
        <div className={`flex items-center gap-3 p-4 rounded-2xl border ${usesSTAR ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/50' : 'bg-gray-50 border-gray-200 dark:bg-gray-700/50 dark:border-gray-600'}`}>
          <div className={`p-2 rounded-full ${usesSTAR ? 'bg-amber-100 text-amber-600 dark:bg-amber-800/50 dark:text-amber-400' : 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400'}`}>
            <Star className="w-6 h-6" fill={usesSTAR ? "currentColor" : "none"} />
          </div>
          <div className="flex-1">
            <h4 className={`font-bold ${usesSTAR ? 'text-amber-800 dark:text-amber-300' : 'text-gray-700 dark:text-gray-300'}`}>
              {usesSTAR ? "STAR Method Detected" : "STAR Method Not Detected"}
            </h4>
            <p className={`text-sm ${usesSTAR ? 'text-amber-700/80 dark:text-amber-400/80' : 'text-gray-500 dark:text-gray-400'}`}>
              {usesSTAR 
                ? "Great job structuring your answer with Situation, Task, Action, and Result." 
                : "Tip: Try structuring your next answer using Situation, Task, Action, and Result."}
            </p>
          </div>
        </div>

        {/* Strengths & Improvements */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4 bg-green-50/50 dark:bg-green-900/10 p-5 rounded-2xl border border-green-100 dark:border-green-900/30">
            <h3 className="font-bold text-green-800 dark:text-green-400 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Strengths
            </h3>
            <ul className="space-y-2">
              {strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 bg-amber-50/50 dark:bg-amber-900/10 p-5 rounded-2xl border border-amber-100 dark:border-amber-900/30">
            <h3 className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Areas to Improve
            </h3>
            <ul className="space-y-2">
              {improvements.map((imp, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{imp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
          <button
            onClick={onNext}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 w-full md:w-auto"
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
