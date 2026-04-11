import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SetupScreen from '../components/SetupScreen';
import QuestionScreen from '../components/QuestionScreen';
import FeedbackScreen from '../components/FeedbackScreen';
import SummaryScreen from '../components/SummaryScreen';
import { generateFirstQuestion, generateFollowUpQuestion, evaluateAnswer } from '../utils/gemini';
import { saveInterview } from '../firebase/firestore';
import { updateUserAnalytics } from '../utils/analytics';
import { detectFillerWords } from '../utils/fillerDetection';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function Interview() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [screen, setScreen] = useState('setup');
  const [interviewMeta, setInterviewMeta] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [evaluations, setEvaluations] = useState([]);
  const [targetCount, setTargetCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Global Video Recording State
  const [globalStream, setGlobalStream] = useState(null);
  const [videoBlobUrl, setVideoBlobUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const streamRef = useRef(null);

  // Smart Follow-Up: keep last 3 Q&A pairs in memory
  const conversationHistoryRef = useRef([]);

  // Per-question filler counts (index → count)
  const fillerCountsRef = useRef({});

  useEffect(() => {
    return () => stopRecordingAndStream(true);
  }, []);

  const stopRecordingAndStream = (destroyStreamOnly = false) => {
    if (!destroyStreamOnly && mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (destroyStreamOnly) setGlobalStream(null);
  };

  const handleStart = async (preferences) => {
    setIsLoading(true);
    setError('');

    // 1. Request camera + mic
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      setGlobalStream(stream);

      recordedChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp9,opus' });
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunksRef.current.push(e.data); };
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        setVideoBlobUrl(URL.createObjectURL(blob));
      };
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
    } catch {
      toast.error('Camera/Microphone access required for live interviews.');
      setIsLoading(false);
      return;
    }

    // 2. Generate only the FIRST question (Smart Follow-Up mode)
    try {
      const firstQ = await generateFirstQuestion(
        preferences.role,
        preferences.type,
        preferences.personality,
        preferences.resumeText
      );
      conversationHistoryRef.current = [];
      fillerCountsRef.current = {};
      setQuestions([firstQ]);
      setTargetCount(preferences.count);
      setInterviewMeta({
        role: preferences.role,
        type: preferences.type,
        personality: preferences.personality,
        pressureMode: preferences.pressureMode,
      });
      setEvaluations([]);
      setCurrentQuestionIndex(0);
      setScreen('question');
    } catch (err) {
      setError(err.message);
      stopRecordingAndStream(true);
    } finally {
      setIsLoading(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSubmit = async (answer) => {
    setIsLoading(true);
    setError('');

    // Calculate filler count for this answer
    const { count: fillerCount } = detectFillerWords(answer);
    fillerCountsRef.current[currentQuestionIndex] = fillerCount;

    try {
      const evaluation = await evaluateAnswer(
        currentQuestion.question,
        answer,
        interviewMeta.personality
      );

      const newEvaluations = [...evaluations];
      newEvaluations[currentQuestionIndex] = {
        question: currentQuestion,
        answer,
        evaluation,
        fillerCount,
      };
      setEvaluations(newEvaluations);

      // Update conversation history (keep last 3)
      conversationHistoryRef.current = [
        ...conversationHistoryRef.current,
        { question: currentQuestion.question, answer },
      ].slice(-3);

      // Pre-generate the next follow-up question if we haven't reached targetCount
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < targetCount && questions.length <= nextIndex) {
        try {
          const nextQ = await generateFollowUpQuestion(
            interviewMeta.role,
            interviewMeta.type,
            interviewMeta.personality,
            conversationHistoryRef.current
          );
          setQuestions(prev => [...prev, nextQ]);
        } catch {
          // Silently fail — we'll end the interview instead
        }
      }

      setScreen('feedback');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const finishInterview = async (finalEvaluations) => {
    stopRecordingAndStream(false);
    setScreen('summary');

    const answered = finalEvaluations.filter(e => !e.skipped);
    const averageScore = answered.length > 0
      ? Math.round(answered.reduce((acc, curr) => acc + curr.evaluation.score, 0) / answered.length * 10) / 10
      : 0;

    const totalFillerCount = Object.values(fillerCountsRef.current).reduce((a, b) => a + b, 0);

    const interviewData = {
      role: interviewMeta.role,
      type: interviewMeta.type,
      personality: interviewMeta.personality,
      pressureMode: interviewMeta.pressureMode,
      evaluations: finalEvaluations,
      averageScore,
      totalFillerCount,
    };

    if (currentUser) {
      const [saveResult, analyticsResult] = await Promise.all([
        saveInterview(currentUser.uid, interviewData),
        updateUserAnalytics(currentUser.uid, finalEvaluations, totalFillerCount, averageScore),
      ]);
      if (saveResult.error) toast.error('Could not save interview to history.');
      else toast.success('Interview completed & analytics updated!');
    }
  };

  const handleSkip = () => {
    if (interviewMeta?.pressureMode) return; // block skip in pressure mode

    const newEvaluations = [...evaluations];
    newEvaluations[currentQuestionIndex] = {
      question: currentQuestion,
      answer: '',
      skipped: true,
      evaluation: null,
      fillerCount: 0,
    };
    setEvaluations(newEvaluations);

    const nextIndex = currentQuestionIndex + 1;
    const hasNextQ = questions.length > nextIndex;
    const reachedTarget = nextIndex >= targetCount;

    if (!reachedTarget && hasNextQ) {
      setCurrentQuestionIndex(nextIndex);
      setScreen('question');
    } else if (!reachedTarget && !hasNextQ) {
      finishInterview(newEvaluations);
    } else {
      finishInterview(newEvaluations);
    }
  };

  const handleNextStep = () => {
    const nextIndex = currentQuestionIndex + 1;
    const hasNextQ = questions.length > nextIndex;
    const reachedTarget = nextIndex >= targetCount;

    if (!reachedTarget && hasNextQ) {
      setCurrentQuestionIndex(nextIndex);
      setScreen('question');
    } else {
      finishInterview(evaluations);
    }
  };

  const handleRestart = () => {
    stopRecordingAndStream(true);
    navigate('/dashboard');
  };

  return (
    <div className="py-10 px-4 min-h-[85vh] flex items-center justify-center container mx-auto max-w-4xl relative z-20">
      {error && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-900/90 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl w-[90%] max-w-md text-center shadow-lg backdrop-blur-md">
          <p className="font-bold">Error</p>
          <p className="text-sm">{error}</p>
          <button onClick={() => setError('')} className="absolute top-1 right-2 text-xl font-bold">&times;</button>
        </div>
      )}

      {screen === 'setup' && <SetupScreen onStart={handleStart} isLoading={isLoading} />}

      {screen === 'question' && (
        <QuestionScreen
          question={currentQuestion}
          currentIndex={currentQuestionIndex}
          totalQuestions={targetCount}
          onSubmit={handleAnswerSubmit}
          onSkip={handleSkip}
          isLoading={isLoading}
          globalStream={globalStream}
          pressureMode={interviewMeta?.pressureMode}
          personality={interviewMeta?.personality}
        />
      )}

      {screen === 'feedback' && (
        <FeedbackScreen
          evaluation={evaluations[currentQuestionIndex]?.evaluation}
          fillerCount={evaluations[currentQuestionIndex]?.fillerCount || 0}
          onNext={handleNextStep}
          isLast={currentQuestionIndex + 1 >= targetCount || questions.length <= currentQuestionIndex + 1}
        />
      )}

      {screen === 'summary' && (
        <SummaryScreen
          evaluations={evaluations}
          onRestart={handleRestart}
          videoBlobUrl={videoBlobUrl}
        />
      )}
    </div>
  );
}

export default Interview;
