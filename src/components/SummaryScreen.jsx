import React, { useRef, useState } from 'react';
import { RefreshCw, LayoutDashboard, Target, Trophy, Video, Download, PlayCircle, PauseCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function SummaryScreen({ evaluations, onRestart, videoBlobUrl }) {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

  const togglePlayback = () => {
    if(!videoRef.current) return;
    if(videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 py-6">
      
      {/* Header Card */}
      <div className="glass-card mb-8 overflow-hidden relative border-b-4 border-indigo-500">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="p-8 md:p-12 text-center relative z-10">
          <div className="w-20 h-20 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-indigo-500/30">
            <Trophy className="w-10 h-10" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">Interview Completed!</h1>
          
          <div className="flex flex-col items-center mt-8">
            <div className="flex items-end gap-2 mb-2">
              <span className={`text-6xl font-black ${scoreColor}`}>{averageScore}</span>
              <span className="text-2xl font-bold text-gray-500 mb-2">/ 10</span>
            </div>
            <p className="text-gray-400 font-semibold uppercase tracking-wider text-sm mb-6">Overall Average Score</p>
            
            {/* Minimal Progress Bar */}
            <div className="w-full max-w-md h-3 bg-gray-900 rounded-full overflow-hidden shadow-inner border border-white/5">
              <div 
                className={`h-full ${progressBg} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${(averageScore / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 p-6 flex flex-col sm:flex-row justify-center gap-4 relative z-10 border-t border-white/5">
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

      {/* Video Recording Breakdown */}
      {videoBlobUrl && (
        <div className="glass-card mb-8 p-6 lg:p-8 animate-in fade-in zoom-in-95 duration-700">
           <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                    <Video className="w-5 h-5" />
                 </div>
                 <div>
                    <h2 className="text-xl font-bold text-white leading-tight">Session Recording</h2>
                    <p className="text-sm text-gray-400">Review your physical posture and speaking speed</p>
                 </div>
              </div>
              <a 
                href={videoBlobUrl} 
                download={`MockInterview_Recording_${new Date().getTime()}.webm`}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-xl transition-all font-semibold text-sm"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Save Video</span>
              </a>
           </div>

           <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video group shadow-2xl">
              <video 
                ref={videoRef}
                src={videoBlobUrl}
                className="w-full h-full object-cover"
                onEnded={() => setIsPlaying(false)}
                controls={false}
              />
              
              {/* Custom Overlay Controls */}
              <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
                 <button onClick={togglePlayback} className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110 border border-white/20 shadow-glow-sm">
                    {isPlaying ? <PauseCircle className="w-8 h-8" /> : <PlayCircle className="w-8 h-8 ml-1" />}
                 </button>
              </div>
           </div>
        </div>
      )}

      <div className="flex items-center gap-2 mb-6 px-2">
         <Target className="w-5 h-5 text-indigo-400" />
         <h2 className="text-xl font-bold text-white">Question Breakdown</h2>
      </div>

      <div className="grid gap-6">
        {evaluations.map((evalItem, index) => {
          if (evalItem.skipped) {
            return (
              <div key={index} className="glass-card p-6 opacity-60 border-dashed border-white/20">
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-black text-gray-600">Q{index + 1}</span>
                  <div>
                    <h3 className="font-bold text-gray-500 line-through decoration-2 decoration-gray-600/50">{evalItem.question.question}</h3>
                    <span className="text-sm font-semibold text-gray-600">Skipped by user</span>
                  </div>
                </div>
              </div>
            );
          }

          const qScore = evalItem.evaluation.score;
          const qColor = qScore >= 8 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 
                         qScore >= 5 ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 
                         'text-rose-400 bg-rose-500/10 border-rose-500/20';

          return (
            <div key={index} className="glass-card p-6 overflow-hidden relative group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-400 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center flex-shrink-0 shadow-sm ${qColor}`}>
                  <span className="text-2xl font-black">{qScore}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Question {index + 1}</span>
                    {evalItem.evaluation.usesSTAR && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20">
                        STAR Detected
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg text-white leading-tight mb-3">
                    {evalItem.question.question}
                  </h3>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5 shadow-inner">
                    <p className="text-sm text-gray-400 italic line-clamp-3">
                      "{evalItem.answer}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-6 border-t border-white/5">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    What went well
                  </h4>
                  <ul className="space-y-2">
                    {evalItem.evaluation.strengths.slice(0, 2).map((str, i) => (
                      <li key={i} className="text-sm font-medium text-gray-300 flex items-start gap-2">
                        <span className="text-emerald-500 mt-0.5">•</span>
                        {str}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                    How to improve
                  </h4>
                  <ul className="space-y-2">
                    {evalItem.evaluation.improvements.slice(0, 2).map((imp, i) => (
                      <li key={i} className="text-sm font-medium text-gray-300 flex items-start gap-2">
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
