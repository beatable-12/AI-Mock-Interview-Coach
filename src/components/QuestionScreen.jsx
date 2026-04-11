import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Clock, AlertCircle, RefreshCw, Layers, Video, VideoOff, Volume2, VolumeX, Sparkles, User } from 'lucide-react';
import { startSpeechRecognition, stopSpeechRecognition, isSpeechRecognitionSupported } from '../utils/speech';

function QuestionScreen({ question, currentIndex, totalQuestions, onSubmit, onSkip, isLoading }) {
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); 
  const [speechError, setSpeechError] = useState('');
  const recognitionRef = useRef(null);

  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isAIVoiceOn, setIsAIVoiceOn] = useState(true);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Timer & AI Voice Effect
  useEffect(() => {
    if (isLoading) return;
    setTimeLeft(120);
    setAnswer('');
    
    if (isAIVoiceOn && question?.question) {
      playAIQuestion(question.question);
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      window.speechSynthesis.cancel();
    };
  }, [currentIndex, isLoading]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) stopSpeechRecognition(recognitionRef.current);
    };
  }, []);

  useEffect(() => {
    if (isCameraOn) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isCameraOn]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
    } catch (err) {
      setIsCameraOn(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const playAIQuestion = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.includes('en') && v.name.includes('Google'));
    if (englishVoice) utterance.voice = englishVoice;
    
    utterance.rate = 0.95;
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
          setAnswer((prev) => finalTranscript + interimTranscript);
        },
        onError: (err) => {
          setSpeechError(err.message);
          setIsRecording(false);
        },
        onEnd: () => {
          setIsRecording(false);
        }
      });
      if (recognitionRef.current) setIsRecording(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto h-full flex flex-col justify-between py-6 px-4 animate-in fade-in duration-700">
      
      {/* Top HUD */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-gray-300">
            Q {currentIndex + 1} / {totalQuestions}
          </span>
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
            <Layers className="w-3 h-3" /> {question.category}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 mr-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider">Live</span>
          </div>

          <button 
            onClick={() => setIsCameraOn(!isCameraOn)}
            className={`p-2 rounded-xl transition-all ${isCameraOn ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'}`}
          >
            {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={() => {
              setIsAIVoiceOn(!isAIVoiceOn);
              if (isAIVoiceOn) window.speechSynthesis.cancel();
            }}
            className={`p-2 rounded-xl transition-all ${isAIVoiceOn ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'}`}
          >
            {isAIVoiceOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          <div className={`flex items-center gap-2 font-mono text-sm font-bold px-3 py-2 rounded-xl border ${
            timeLeft < 30 ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse' : 'bg-white/5 text-gray-300 border-white/10'
          }`}>
            <Clock className="w-4 h-4" /> {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Floating Camera UI */}
      {isCameraOn && (
        <div className="fixed top-24 right-8 w-40 h-52 bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 z-50 transition-all duration-500 hover:scale-105 group">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover mirror" style={{ transform: 'rotateY(180deg)' }} />
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-white flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <User className="w-3 h-3" /> You
          </div>
          {isRecording && <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></div>}
        </div>
      )}

      {/* Chat Transcript Area */}
      <div className="flex-1 overflow-y-auto pr-4 space-y-8 pb-10">
        
        {/* AI Question Bubble */}
        <div className="flex items-start gap-4 max-w-3xl animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-glow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col items-start gap-2">
            <span className="text-xs font-bold text-gray-400 pl-1 uppercase tracking-wider">Coach AI</span>
            <div className="chat-bubble-ai p-5 md:p-6 text-lg leading-relaxed relative group cursor-pointer" onClick={manuallyReplayQuestion}>
              {question.question}
              
              {/* Speaking Indicator inside bubble */}
              {isAISpeaking && (
                <div className="absolute -bottom-6 left-2 flex items-center gap-1 opacity-70">
                  <div className="w-1 h-2 bg-indigo-400 animate-pulse rounded-full" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1 h-3 bg-violet-400 animate-pulse rounded-full" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1 h-2 bg-indigo-400 animate-pulse rounded-full" style={{ animationDelay: '300ms' }}></div>
                  <span className="text-[10px] text-indigo-300 ml-1">Speaking...</span>
                </div>
              )}
            </div>
            {!isAISpeaking && (
              <span className="text-[10px] text-gray-500 pl-1 cursor-pointer hover:text-indigo-400" onClick={manuallyReplayQuestion}>
                Click bubble to replay
              </span>
            )}
          </div>
        </div>

        {/* User Answer Bubble (Only shows if there is text) */}
        {answer.length > 0 && (
          <div className="flex items-start gap-4 flex-row-reverse max-w-3xl ml-auto animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 border border-white/10">
               <User className="w-5 h-5 text-gray-300" />
             </div>
             <div className="flex flex-col items-end gap-1">
               <span className="text-xs font-bold text-gray-400 pr-1 uppercase tracking-wider">You</span>
               <div className="chat-bubble-user p-5 text-base leading-relaxed break-words whitespace-pre-wrap">
                 {answer}
                 {isRecording && <span className="inline-block w-1.5 h-4 ml-1 bg-white/70 animate-pulse align-middle"></span>}
               </div>
             </div>
          </div>
        )}

      </div>

      {/* Bottom Input Area */}
      <div className="glass-card p-4 flex flex-col mt-4 border border-white/5 shadow-glow-sm relative">
        {speechError && (
          <div className="absolute -top-10 right-0 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-3 h-3" /> {speechError}
          </div>
        )}

        <div className="flex items-end gap-4 relative">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={isLoading || isRecording}
            placeholder={isRecording ? "Listening to your response..." : "Type your answer or use the microphone..."}
            className="w-full h-24 max-h-48 bg-transparent text-gray-100 placeholder:text-gray-500 resize-none outline-none text-base disabled:opacity-50 py-2 custom-scrollbar"
          />

          <div className="flex flex-col justify-end gap-2 shrink-0 pb-1">
            {isSpeechRecognitionSupported() && (
              <button
                type="button"
                onClick={toggleRecording}
                disabled={isLoading}
                className={`p-3.5 rounded-xl transition-all shadow-md flex items-center justify-center ${
                  isRecording 
                    ? 'bg-rose-500 text-white shadow-rose-500/50 animate-pulse' 
                    : 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/30'
                }`}
                title={isRecording ? "Stop Recording" : "Speak to answer"}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )}

            <button
              onClick={() => {
                if(isAISpeaking) window.speechSynthesis.cancel();
                onSubmit(answer);
              }}
              disabled={answer.length < 10 || isLoading}
              className="p-3.5 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white rounded-xl shadow-glow-sm hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all flex items-center justify-center"
              title="Submit Answer"
            >
              {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 translate-x-[-1px]" />}
            </button>
          </div>
        </div>

        <div className="absolute -bottom-8 left-0 right-0 flex justify-center">
          <button onClick={onSkip} disabled={isLoading} className="text-xs font-semibold text-gray-500 hover:text-gray-300 transition-colors">
            Skip this question
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuestionScreen;
