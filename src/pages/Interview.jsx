import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SetupScreen from '../components/SetupScreen';
import QuestionScreen from '../components/QuestionScreen';
import FeedbackScreen from '../components/FeedbackScreen';
import SummaryScreen from '../components/SummaryScreen';
import { generateQuestions, evaluateAnswer } from '../utils/gemini';
import { saveInterview } from '../firebase/firestore';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function Interview() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [screen, setScreen] = useState('setup'); // 'setup', 'question', 'feedback', 'summary'
  const [interviewMeta, setInterviewMeta] = useState(null); // role, type
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [evaluations, setEvaluations] = useState([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async (preferences) => {
    setIsLoading(true);
    setError('');
    try {
      const generatedQs = await generateQuestions(
        preferences.role, 
        preferences.type, 
        preferences.count
      );
      setQuestions(generatedQs);
      setInterviewMeta({ role: preferences.role, type: preferences.type });
      setEvaluations([]);
      setCurrentQuestionIndex(0);
      setScreen('question');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSubmit = async (answer) => {
    setIsLoading(true);
    setError('');
    try {
      const evaluation = await evaluateAnswer(currentQuestion.question, answer);
      const newEvaluations = [...evaluations];
      newEvaluations[currentQuestionIndex] = {
        question: currentQuestion,
        answer,
        evaluation
      };
      setEvaluations(newEvaluations);
      setScreen('feedback');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const finishInterview = async (finalEvaluations) => {
    setScreen('summary');
    
    // Calculate average score
    const answered = finalEvaluations.filter(e => !e.skipped);
    const averageScore = answered.length > 0 
      ? Math.round(answered.reduce((acc, curr) => acc + curr.evaluation.score, 0) / answered.length * 10) / 10
      : 0;

    const interviewData = {
      role: interviewMeta.role,
      type: interviewMeta.type,
      evaluations: finalEvaluations,
      averageScore
    };

    if (currentUser) {
      const { error } = await saveInterview(currentUser.uid, interviewData);
      if (error) {
        toast.error("Could not save interview to history.");
      } else {
        toast.success("Interview saved to dashboard!");
      }
    }
  };

  const handleSkip = () => {
    const newEvaluations = [...evaluations];
    newEvaluations[currentQuestionIndex] = {
      question: currentQuestion,
      answer: '',
      skipped: true,
      evaluation: null
    };
    setEvaluations(newEvaluations);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setScreen('question');
    } else {
      finishInterview(newEvaluations);
    }
  };

  const handleNextStep = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setScreen('question');
    } else {
      finishInterview(evaluations);
    }
  };

  const handleRestart = () => {
    navigate('/dashboard');
  };

  return (
    <div className="py-10 px-4 min-h-[85vh] flex items-center justify-center container mx-auto max-w-4xl">
      {error && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-[90%] max-w-md text-center shadow-lg">
          <p className="font-bold">Error</p>
          <p className="text-sm">{error}</p>
          <button onClick={() => setError('')} className="absolute top-1 right-2 text-xl font-bold">&times;</button>
        </div>
      )}

      {screen === 'setup' && (
        <SetupScreen onStart={handleStart} isLoading={isLoading} />
      )}

      {screen === 'question' && (
        <QuestionScreen 
          question={currentQuestion}
          currentIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          onSubmit={handleAnswerSubmit}
          onSkip={handleSkip}
          isLoading={isLoading}
        />
      )}

      {screen === 'feedback' && (
        <FeedbackScreen 
          evaluation={evaluations[currentQuestionIndex]?.evaluation}
          onNext={handleNextStep}
          isLast={currentQuestionIndex === questions.length - 1}
        />
      )}

      {screen === 'summary' && (
        <SummaryScreen 
          evaluations={evaluations}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default Interview;
