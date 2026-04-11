import React from 'react';
import { AnalyticsSvg } from '../components/illustrations/SvgIllustrations';

function About() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 animate-in fade-in zoom-in-95 duration-500">
      
      <div className="glass-card overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

        <div className="flex flex-col md:flex-row items-center gap-12 p-8 md:p-16 relative z-10">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 tracking-tight leading-tight">
              About CoachAI
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
              Your personal AI-powered mock interview workspace.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              We believe that practice is the key to landing your dream job. Interviews can be intimidating, especially for students and entry-level professionals. Our mission is to democratize interview preparation by providing free, accessible, and highly accurate AI-driven mock interviews right in your browser.
            </p>
          </div>
          
          <div className="w-full md:w-1/2 flex justify-center drop-shadow-xl animate-float">
            <AnalyticsSvg className="w-full max-w-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
