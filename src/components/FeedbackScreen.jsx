import React, { useState } from 'react';
import { CheckCircle, ArrowRight, Star, TrendingUp, Award, AlertTriangle, ChevronDown, ChevronUp, Sparkles, Zap } from 'lucide-react';
import { getFillerFeedback } from '../utils/fillerDetection';

function FeedbackScreen({ evaluation, onNext, isLast, fillerCount = 0 }) {
  const [showIdealAnswer, setShowIdealAnswer] = useState(false);

  if (!evaluation) return null;

  const { score, headline, summary, strengths, improvements, usesSTAR, idealAnswer } = evaluation;

  const scoreColor =
    score >= 8 ? 'text-emerald-500' :
    score >= 5 ? 'text-amber-500' : 'text-rose-500';

  const scoreRing =
    score >= 8 ? 'border-emerald-500 shadow-emerald-500/30' :
    score >= 5 ? 'border-amber-500 shadow-amber-500/30' : 'border-rose-500 shadow-rose-500/30';

  const fillerFeedback = getFillerFeedback(fillerCount);

  return (
    <div className="w-full max-w-4xl mx-auto glass-card overflow-hidden animate-in fade-in zoom-in-95 duration-500">

      {/* Top Banner */}
      <div className="bg-white/5 border-b border-white/5 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="flex-1 space-y-4 text-center md:text-left relative z-10">
          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-500/30">
            Analysis Complete
          </span>
          <h2 className="text-3xl font-extrabold text-white leading-tight">{headline}</h2>
          <p className="text-gray-400 font-medium text-lg leading-relaxed">{summary}</p>
        </div>

        <div className="flex-shrink-0 relative z-10">
          <div className={`w-32 h-32 rounded-full border-4 ${scoreRing} flex flex-col items-center justify-center bg-[#0E1117] shadow-xl`}>
            <span className={`text-4xl font-black ${scoreColor}`}>{score}</span>
            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">/ 10</span>
          </div>
        </div>
      </div>

      <div className="p-8 md:p-12 space-y-8">

        {/* Filler Word Alert */}
        {fillerFeedback && (
          <div className="flex items-center gap-4 p-4 rounded-xl border bg-amber-500/5 border-amber-500/20">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-sm font-semibold text-amber-300">{fillerFeedback}</p>
          </div>
        )}

        {/* STAR Badge */}
        <div className={`flex items-center gap-4 p-5 rounded-2xl border shadow-sm transition-all hover:shadow-md ${usesSTAR ? 'bg-amber-500/5 border-amber-500/20' : 'bg-white/5 border-white/5'}`}>
          <div className={`w-12 h-12 flex items-center justify-center rounded-xl shadow-sm ${usesSTAR ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-white/5 text-gray-500 border border-white/10'}`}>
            <Star className="w-6 h-6" fill={usesSTAR ? 'currentColor' : 'none'} />
          </div>
          <div className="flex-1">
            <h4 className={`font-bold text-lg ${usesSTAR ? 'text-amber-300' : 'text-gray-300'}`}>
              {usesSTAR ? 'Great STAR Method Usage!' : 'STAR Method Not Detected'}
            </h4>
            <p className={`text-sm font-medium mt-1 ${usesSTAR ? 'text-amber-400/80' : 'text-gray-500'}`}>
              {usesSTAR ? 'You effectively structured your answer: Situation, Task, Action, Result.' : 'Tip: Structure your next answer using Situation, Task, Action, and Result.'}
            </p>
          </div>
        </div>

        {/* Strengths & Improvements */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <h3 className="font-extrabold text-white flex items-center gap-2 text-lg">
              <Award className="w-5 h-5 text-emerald-500" /> Key Strengths
            </h3>
            <ul className="space-y-3">
              {strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5 shadow-sm">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-gray-300 font-semibold">{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5">
            <h3 className="font-extrabold text-white flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-amber-500" /> Focus Areas
            </h3>
            <ul className="space-y-3">
              {improvements.map((imp, i) => (
                <li key={i} className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5 shadow-sm">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  <span className="text-gray-300 font-semibold">{imp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Perfect Answer Section */}
        {idealAnswer && (
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 overflow-hidden">
            <button
              onClick={() => setShowIdealAnswer(!showIdealAnswer)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-indigo-500/10 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-bold text-indigo-300 text-sm uppercase tracking-wider">View Ideal Answer</h3>
                  <p className="text-xs text-indigo-400/70 mt-0.5">AI-generated STAR method response</p>
                </div>
              </div>
              <div className="text-indigo-400 group-hover:text-indigo-300 transition-colors">
                {showIdealAnswer ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>

            {showIdealAnswer && (
              <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="h-px bg-indigo-500/20 mb-4" />
                <div className="p-4 bg-white/5 rounded-xl border border-white/5 shadow-inner">
                  <p className="text-gray-300 text-sm leading-relaxed">{idealAnswer}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Next Button */}
        <div className="pt-4 border-t border-white/5 flex justify-end">
          <button onClick={onNext} className="btn-primary w-full md:w-auto px-10 py-3.5">
            {isLast ? 'View Final Summary' : 'Next Question'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FeedbackScreen;
