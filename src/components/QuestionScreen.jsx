import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { startSpeechRecognition, stopSpeechRecognition, isSpeechRecognitionSupported } from '../utils/speech';

function QuestionScreen({ question, currentIndex, totalQuestions, onSubmit, onSkip, isLoading }) {
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [speechError, setSpeechError] = useState('');
  const recognitionRef = useRef(null);

  // Timer logical interval
  useEffect(() => {
    if (isLoading) return;
    
    // Reset timer on new question
    setTimeLeft(120);
    setAnswer('');
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, isLoading]);

  // Clean-up speech on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) stopSpeechRecognition(recognitionRef.current);
    };
  }, []);

  const progressPercentage = ((currentIndex) / totalQuestions) * 100;

  const toggleRecording = () => {
    setSpeechError('');
    
    if (isRecording) {
      stopSpeechRecognition(recognitionRef.current);
      setIsRecording(false);
    } else {
      recognitionRef.current = startSpeechRecognition({
        onResult: ({ finalTranscript, interimTranscript }) => {
          // If there's final transcript use that to append, interim just updates the visual temporarily
          // For simplicity we'll just track the current cumulative view (interim can be tricky without complex state)
          // Actually, web speech API continuous mode keeps growing the full transcript naturally in our previous simple loop
          // But appending in React requires keeping previous state.
          // In speech.js we did not pass back previous vs new state correctly if we just append inside event hook.
          // To fix simple case: just replace answer with final + interim. 
          // Note: our speech.js wrapper in this implementation returns the ENTIRE transcript processed so far.
          setAnswer((prev) => {
             // to prevent rewriting over typed text, we should ideally append.
             // Given limitations, let's just make voice dictate the whole box if they use it.
             return finalTranscript + interimTranscript;
          });
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

  const categoryColor = 
    question.category === 'HR' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800' :
    question.category === 'Technical' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-purple-200 dark:border-purple-800' :
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800';

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
      
      {/* Progress Bar */}
      <div className="h-2 w-full bg-gray-100 dark:bg-gray-700">
        <div 
          className="h-full bg-primary-500 transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <div className="p-6 md:p-10 space-y-8">
        
        {/* Header Info */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-700 pb-6">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-sm">
              {currentIndex + 1}
            </span>
            <span className="text-gray-500 dark:text-gray-400 font-medium">of {totalQuestions}</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${categoryColor}`}>
              {question.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              {question.difficulty}
            </span>
          </div>

          <div className={`flex items-center gap-2 font-mono text-lg font-bold px-4 py-1.5 rounded-lg border ${
            timeLeft < 30 
              ? 'text-red-600 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800/50' 
              : 'text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'
          }`}>
            <Clock className="w-5 h-5" />
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Question Area */}
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
            {question.question}
          </h2>
        </div>

        {/* Answer Area */}
        <div className="space-y-4 relative">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={isLoading || isRecording}
            placeholder="Type your answer here, or click the microphone to speak..."
            className="w-full h-48 md:h-64 p-5 bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-2xl resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow text-lg leading-relaxed placeholder:text-gray-400 disabled:opacity-70"
          ></textarea>
          
          <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
            {isSpeechRecognitionSupported() && (
              <button
                type="button"
                onClick={toggleRecording}
                disabled={isLoading}
                className={`p-3 rounded-full flex items-center justify-center transition-all shadow-sm ${
                  isRecording 
                    ? 'bg-red-500 text-white animate-pulse hover:bg-red-600' 
                    : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:text-primary-600'
                }`}
                title={isRecording ? "Stop Recording" : "Start Recording"}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )}
            {isRecording && (
              <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded shadow-sm">
                Recording...
              </span>
            )}
          </div>
          
          {speechError && (
            <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
              <AlertCircle className="w-4 h-4" /> {speechError}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={onSkip}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
          >
            Skip Question
          </button>
          
          <button
            onClick={() => onSubmit(answer)}
            disabled={answer.length < 10 || isLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Analyzing Response...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Answer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuestionScreen;
