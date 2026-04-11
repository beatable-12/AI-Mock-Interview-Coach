import React from 'react';
import { Link } from 'react-router-dom';
import { Settings2, Mic, Target, ArrowRight } from 'lucide-react';
import { CareerSvg } from '../components/illustrations/SvgIllustrations';

function HowItWorks() {
  const steps = [
    {
      icon: <Settings2 className="w-7 h-7 text-indigo-500" />,
      title: "1. Configure",
      description: "Select your target role, choose the interview type (HR, Technical, or Mixed), and set the duration."
    },
    {
      icon: <Mic className="w-7 h-7 text-indigo-500" />,
      title: "2. Answer Out Loud",
      description: "Use your microphone to speak your answer natively. A smart timer simulates high-pressure environments."
    },
    {
      icon: <Target className="w-7 h-7 text-indigo-500" />,
      title: "3. Instant Feedback",
      description: "Receive AI grading out of 10. We highlight your strengths, areas to improve, and check your STAR method."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      <div className="text-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-32 bg-indigo-500/10 blur-3xl rounded-full"></div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6 relative z-10">How It Works</h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium relative z-10">Three simple steps to supercharging your interview skills and tracking your growth.</p>
      </div>

      <div className="flex flex-col-reverse md:flex-row items-center gap-12 mb-16 px-4">
        <div className="w-full md:w-1/2 space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="glass-card p-6 flex gap-6 hover:-translate-y-1 transition-transform group">
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center flex-shrink-0 border border-indigo-100 dark:border-indigo-800/30 group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm font-medium">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
           <CareerSvg className="w-full max-w-md drop-shadow-2xl" />
        </div>
      </div>

      <div className="text-center">
        <Link to="/login" className="btn-primary inline-flex gap-2 px-10 py-4 text-lg">
          Start Preparing Now
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}

export default HowItWorks;
