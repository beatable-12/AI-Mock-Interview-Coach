import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Send, Clock, AlertCircle, RefreshCw, Layers, Video, VideoOff, Volume2, VolumeX, Sparkles, User, Circle, Zap, AlertOctagon } from 'lucide-react';
import { startSpeechRecognition, stopSpeechRecognition, isSpeechRecognitionSupported } from '../utils/speech';
import { detectFillerWords, getFillerFeedback } from '../utils/fillerDetection';

// Pressure mode interruption messages
const INTERRUPTION_MESSAGES = [
  "Be more specific.",
  "That's too vague.",
  "Give a concrete example.",
  "You're running out of time.",
  "Push yourself harder.",
  "Don't generalize — be precise.",
];

function QuestionScreen({ question, currentIndex, totalQuestions, onSubmit, onSkip, isLoading, globalStream, pressureMode, personality }) {
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(pressureMode ? 60 : 120);
  const [speechError, setSpeechError] = useState('');
  const recognitionRef = useRef(null);

  const [isCameraUIOn, setIsCameraUIOn] = useState(true);
  const [isAIVoiceOn, setIsAIVoiceOn] = useState(true);
  const [isAISpeaking, setIsAISpeaking] = useState(false);

  // Pressure Mode state
  const [interruption, setInterruption] = useState(null);
  const [isShaking, setIsShaking] = useState(false);
  const [fillerCount, setFillerCount] = useState(0);
  const interruptionTimerRef = useRef(null);
  const shakeTimeoutRef = useRef(null);

  const videoRef = useRef(null);

  // Bind global stream to the local video
  useEffect(() => {
    if (globalStream && videoRef.current) {
      videoRef.current.srcObject = globalStream;
    }
  }, [globalStream, isCameraUIOn]);

  // Question change effect
  useEffect(() => {
    if (isLoading) return;
    const duration = pressureMode ? 60 : 120;
    setTimeLeft(duration);
    setAnswer('');
    setFillerCount(0);
    setInterruption(null);
    clearTimeout(interruptionTimerRef.current);
    clearTimeout(shakeTimeoutRef.current);

    if (isAIVoiceOn && question?.question) {
      playAIQuestion(question.question);
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // In pressure mode: auto-advance when time is up
          if (pressureMode) {
            triggerInterruption("⏱ Time's up! Moving on...");
            setTimeout(() => onSkip(), 1200); // slight delay so user sees the flash
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Pressure Mode: schedule random interruptions
    if (pressureMode) {
      const scheduleInterruption = () => {
        const delay = 15000 + Math.random() * 15000; // between 15s and 30s
        interruptionTimerRef.current = setTimeout(() => {
          const msg = INTERRUPTION_MESSAGES[Math.floor(Math.random() * INTERRUPTION_MESSAGES.length)];
          triggerInterruption(msg);
          scheduleInterruption(); // chain next
        }, delay);
      };
      scheduleInterruption();
    }

    return () => {
      clearInterval(timer);
      clearTimeout(interruptionTimerRef.current);
      clearTimeout(shakeTimeoutRef.current);
      window.speechSynthesis.cancel();
    };
  }, [currentIndex, isLoading]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) stopSpeechRecognition(recognitionRef.current);
    };
  }, []);

  const triggerInterruption = (message) => {
    setInterruption(message);
    setIsShaking(true);
    shakeTimeoutRef.current = setTimeout(() => {
      setIsShaking(false);
      setTimeout(() => setInterruption(null), 3000);
    }, 600);
  };

  const playAIQuestion = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.includes('en') && v.name.includes('Google'));
    if (englishVoice) utterance.voice = englishVoice;
    utterance.rate = personality === 'rapid-fire' ? 1.2 : 0.95;
    utterance.onstart = () => setIsAISpeaking(true);
    utterance.onend = () => setIsAISpeaking(false);
    utterance.onerror = () => setIsAISpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const manuallyReplayQuestion = () => {
    if (!isAIVoiceOn) setIsAIVoiceOn(true);
    playAIQuestion(question.question);
  };

  const toggleRecording = () => {
    setSpeechError('');
    if (isRecording) {
      stopSpeechRecognition(recognitionRef.current);
      setIsRecording(false);
    } else {
      if (isAISpeaking) window.speechSynthesis.cancel();
      recognitionRef.current = startSpeechRecognition({
        onResult: ({ finalTranscript, interimTranscript }) => {
          const fullText = finalTranscript + interimTranscript;
          setAnswer(fullText);
          // Live filler detection
          const { count } = detectFillerWords(fullText);
          setFillerCount(count);
        },
        onError: (err) => { setSpeechError(err.message); setIsRecording(false); },
        onEnd: () => setIsRecording(false),
      });
      if (recognitionRef.current) setIsRecording(true);
    }
  };

  const handleSubmit = () => {
    if (isAISpeaking) window.speechSynthesis.cancel();
    clearTimeout(interruptionTimerRef.current);
    onSubmit(answer);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const personalityBadge = {
    strict:      { label: 'Strict Mode',     color: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
    friendly:    { label: 'Friendly Mode',   color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
    'rapid-fire': { label: 'Rapid-Fire',     color: 'bg-rose-500/10 text-rose-300 border-rose-500/20' },
    normal:      { label: 'Professional',    color: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' },
  };
  const badge = personalityBadge[personality] || personalityBadge.normal;

  return (
    <div className="w-full max-w-5xl mx-auto h-full flex flex-col justify-between py-6 px-4 animate-in fade-in duration-700">

      {/* Top HUD */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-gray-300">
            Q {currentIndex + 1} / {totalQuestions}
          </span>
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
            <Layers className="w-3 h-3" /> {question.category}
          </span>
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badge.color}`}>
            {badge.label}
          </span>
          {pressureMode && (
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-300 border border-rose-500/20 flex items-center gap-1">
              <AlertOctagon className="w-3 h-3" /> Pressure
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-sm">
            <Circle className="w-2.5 h-2.5 fill-rose-500 animate-pulse text-transparent" />
            <span className="text-[10px] font-black uppercase tracking-wider">REC</span>
          </div>
          <button onClick={() => setIsCameraUIOn(!isCameraUIOn)} className={`p-2 rounded-xl transition-all ${isCameraUIOn ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'}`}>
            {isCameraUIOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>
          <button onClick={() => { setIsAIVoiceOn(!isAIVoiceOn); if (isAIVoiceOn) window.speechSynthesis.cancel(); }} className={`p-2 rounded-xl transition-all ${isAIVoiceOn ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'}`}>
            {isAIVoiceOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <div className={`flex items-center gap-2 font-mono text-sm font-bold px-3 py-2 rounded-xl border transition-all ${
            timeLeft < (pressureMode ? 15 : 30) ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse' :
            pressureMode ? 'bg-rose-500/5 text-rose-300 border-rose-500/20' : 'bg-white/5 text-gray-300 border-white/10'
          }`}>
            <Clock className="w-4 h-4" /> {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Floating Camera */}
      {isCameraUIOn && (
        <div className="fixed top-24 right-8 w-40 h-52 bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 z-50 hover:scale-105 transition-transform group">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" style={{ transform: 'rotateY(180deg)' }} />
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-white flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <User className="w-3 h-3" /> You
          </div>
          <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></div>
        </div>
      )}

      {/* Pressure Mode Interruption Flash */}
      {interruption && (
        <div className="fixed top-32 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in zoom-in-90 duration-200">
          <div className="flex items-center gap-3 px-5 py-3 bg-rose-950/95 border-2 border-rose-500 rounded-2xl shadow-2xl backdrop-blur-xl">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
            <AlertOctagon className="w-4 h-4 text-rose-400" />
            <span className="text-rose-200 font-black text-sm tracking-wide uppercase">{interruption}</span>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto pr-4 space-y-8 pb-10">
        {/* AI Bubble */}
        <div className="flex items-start gap-4 max-w-3xl animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-glow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col items-start gap-2">
            <span className="text-xs font-bold text-gray-400 pl-1 uppercase tracking-wider">Coach AI</span>
            <div className="chat-bubble-ai p-5 md:p-6 text-lg leading-relaxed relative group cursor-pointer" onClick={manuallyReplayQuestion}>
              {question.question}
              {isAISpeaking && (
                <div className="absolute -bottom-6 left-2 flex items-center gap-1 opacity-70">
                  {[0, 150, 300].map((d) => (
                    <div key={d} className="w-1 h-2 bg-indigo-400 animate-pulse rounded-full" style={{ animationDelay: `${d}ms` }} />
                  ))}
                  <span className="text-[10px] text-indigo-300 ml-1">Speaking...</span>
                </div>
              )}
            </div>
            {!isAISpeaking && (
              <span className="text-[10px] text-gray-500 pl-1 cursor-pointer hover:text-indigo-400" onClick={manuallyReplayQuestion}>Click bubble to replay</span>
            )}
          </div>
        </div>

        {/* User Bubble */}
        {answer.length > 0 && (
          <div className="flex items-start gap-4 flex-row-reverse max-w-3xl ml-auto animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 border border-white/10">
              <User className="w-5 h-5 text-gray-300" />
            </div>
            <div className="flex flex-col items-end gap-1 max-w-[75%]">
              <span className="text-xs font-bold text-gray-400 pr-1 uppercase tracking-wider">You</span>
              <div className="chat-bubble-user p-5 text-base leading-relaxed break-words whitespace-pre-wrap">
                {answer}
                {isRecording && <span className="inline-block w-1.5 h-4 ml-1 bg-white/70 animate-pulse align-middle" />}
              </div>
              {/* Live filler badge */}
              {fillerCount > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[11px] font-bold text-amber-300 mr-1">
                  <Zap className="w-3 h-3" />
                  {fillerCount} filler word{fillerCount > 1 ? 's' : ''} detected
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Input */}
      <div className={`glass-card p-4 flex flex-col mt-4 border shadow-glow-sm relative transition-all ${isShaking ? 'animate-shake border-rose-500/50' : 'border-white/5'}`}>
        {speechError && (
          <div className="absolute -top-10 right-0 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-3 h-3" /> {speechError}
          </div>
        )}

        <div className="flex items-end gap-4 relative">
          <textarea
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              const { count } = detectFillerWords(e.target.value);
              setFillerCount(count);
            }}
            disabled={isLoading || isRecording}
            placeholder={isRecording ? 'Listening to your response...' : 'Type your answer or use the microphone...'}
            className="w-full h-24 max-h-48 bg-transparent text-gray-100 placeholder:text-gray-500 resize-none outline-none text-base disabled:opacity-50 py-2 custom-scrollbar"
          />

          <div className="flex flex-col justify-end gap-2 shrink-0 pb-1">
            {isSpeechRecognitionSupported() && (
              <button
                type="button"
                onClick={toggleRecording}
                disabled={isLoading}
                className={`p-3.5 rounded-xl transition-all shadow-md flex items-center justify-center ${isRecording ? 'bg-rose-500 text-white shadow-rose-500/50 animate-pulse' : 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/30'}`}
                title={isRecording ? 'Stop Recording' : 'Speak to answer'}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )}

            <button
              onClick={handleSubmit}
              disabled={answer.length < 10 || isLoading}
              className="p-3.5 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white rounded-xl shadow-glow-sm hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all flex items-center justify-center"
              title="Submit Answer"
            >
              {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Skip (disabled in pressure mode) */}
        {!pressureMode && (
          <div className="absolute -bottom-8 left-0 right-0 flex justify-center">
            <button onClick={onSkip} disabled={isLoading} className="text-xs font-semibold text-gray-500 hover:text-gray-300 transition-colors">
              Skip this question
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuestionScreen;
