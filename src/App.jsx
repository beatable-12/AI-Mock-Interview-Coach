import React, { useState, useEffect } from 'react';
import SetupScreen from './components/SetupScreen';
import QuestionScreen from './components/QuestionScreen';
import FeedbackScreen from './components/FeedbackScreen';
import SummaryScreen from './components/SummaryScreen';
import { generateQuestions, evaluateAnswer } from './utils/gemini';

function App() {
  const [screen, setScreen] = useState('setup'); // 'setup', 'question', 'feedback', 'summary'
  const [theme, setTheme] = useState('light');
  
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [evaluations, setEvaluations] = useState([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle system dark mode preference
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

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
      setScreen('summary');
    }
  };

  const handleNextStep = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setScreen('question');
    } else {
      setScreen('summary');
    }
  };

  const handleRestart = () => {
    setScreen('setup');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setEvaluations([]);
  };

  return (
    <div className="min-h-screen">
      {/* Global Header */}
      <header className="absolute top-0 w-full p-4 flex justify-between items-center z-10">
        <div className="font-bold text-xl text-primary-600 dark:text-primary-400 flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          </div>
          CoachAI
        </div>
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          title="Toggle Dark Mode"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="pt-20 pb-10 px-4 min-h-screen flex items-center justify-center container mx-auto max-w-4xl">
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
      </main>
    </div>
  );
}

export default App;
