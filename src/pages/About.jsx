import React from 'react';
import { Target, Rocket, Brain, Lightbulb, Flame, Sprout, Heart, Mail } from 'lucide-react';
import { AnalyticsSvg } from '../components/illustrations/SvgIllustrations';

function About() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-12 pb-24">
      
      {/* Hero Section */}
      <div className="glass-card overflow-hidden relative border-t-2 border-indigo-500/50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

        <div className="flex flex-col md:flex-row items-center gap-12 p-8 md:p-12 relative z-10">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight leading-tight">
              About Us
            </h1>
            
            <div className="space-y-4">
               <div>
                  <h2 className="text-xl font-bold text-white flex items-center justify-center md:justify-start gap-2 mb-2">
                     <Target className="w-5 h-5 text-indigo-400" /> Our Mission
                  </h2>
                  <p className="text-gray-400 leading-relaxed text-base">
                     Preparing for interviews shouldn’t feel like guesswork. Our mission is to help students and early professionals build confidence through realistic, AI-powered mock interviews — so they can perform their best when it matters most.
                  </p>
               </div>
               
               <div>
                  <h2 className="text-xl font-bold text-white flex items-center justify-center md:justify-start gap-2 mb-2 mt-6">
                     <Rocket className="w-5 h-5 text-indigo-400" /> What We Do
                  </h2>
                  <p className="text-gray-400 leading-relaxed text-base">
                     We built an intelligent mock interview platform that simulates real interview scenarios. Instead of just reading questions, users experience a structured interview flow with instant feedback, helping them improve both technical knowledge and communication skills.
                  </p>
               </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex justify-center drop-shadow-xl animate-float">
            <AnalyticsSvg className="w-full max-w-xs md:max-w-sm" />
          </div>
        </div>
      </div>

      {/* Grid Features */}
      <div className="grid md:grid-cols-2 gap-8">
         
         <div className="glass-card p-8 group hover:-translate-y-1 transition-transform">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
               <Brain className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300" /> How It Works
            </h2>
            <ul className="space-y-3 text-gray-400 text-sm">
               <li className="flex items-start gap-2">
                 <span className="text-indigo-400 mt-1">•</span>
                 Choose your target role and interview type
               </li>
               <li className="flex items-start gap-2">
                 <span className="text-indigo-400 mt-1">•</span>
                 Practice with AI-generated interview questions
               </li>
               <li className="flex items-start gap-2">
                 <span className="text-indigo-400 mt-1">•</span>
                 Answer using text or voice (just like real interviews)
               </li>
               <li className="flex items-start gap-2">
                 <span className="text-indigo-400 mt-1">•</span>
                 Receive instant feedback with scores, strengths, and improvement areas
               </li>
            </ul>
            <p className="mt-4 text-gray-400 text-sm italic">
               Our system is designed to replicate real interview pressure while giving you the space to learn and improve.
            </p>
         </div>

         <div className="glass-card p-8 group hover:-translate-y-1 transition-transform">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
               <Lightbulb className="w-5 h-5 text-amber-400 group-hover:text-amber-300" /> Why We Built This
            </h2>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
               Many students struggle in interviews not because they lack knowledge, but because they lack <strong className="text-white">practice and structured feedback</strong>. Traditional preparation methods don’t simulate real interview environments.
            </p>
            <p className="text-gray-400 text-sm mb-2 font-semibold">We wanted to solve this by creating a tool that:</p>
            <ul className="space-y-2 text-gray-400 text-sm">
               <li className="flex items-start gap-2">
                 <span className="text-amber-400 mt-1">•</span> Feels like a real interview
               </li>
               <li className="flex items-start gap-2">
                 <span className="text-amber-400 mt-1">•</span> Provides actionable feedback
               </li>
               <li className="flex items-start gap-2">
                 <span className="text-amber-400 mt-1">•</span> Helps users track their progress over time
               </li>
            </ul>
         </div>

         <div className="glass-card p-8 group hover:-translate-y-1 transition-transform md:col-span-2 lg:col-span-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
               <Flame className="w-5 h-5 text-rose-400 group-hover:text-rose-300" /> What Makes Us Different
            </h2>
            <ul className="grid sm:grid-cols-2 gap-4 text-gray-400 text-sm">
               <li className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                 <span>🎤</span> Voice-based interview practice
               </li>
               <li className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                 <span>📷</span> Live interview simulation with camera support
               </li>
               <li className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                 <span>📊</span> Detailed feedback with scoring and insights
               </li>
               <li className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                 <span>🎯</span> Role-based and adaptive questioning
               </li>
               <li className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                 <span>⚡</span> Fast, accessible, and completely online
               </li>
            </ul>
         </div>

         <div className="flex flex-col gap-8 md:col-span-2 lg:col-span-1">
            <div className="glass-card p-8 group hover:-translate-y-1 transition-transform flex-1">
               <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                  <Sprout className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" /> Our Vision
               </h2>
               <p className="text-gray-400 text-sm leading-relaxed">
                  We aim to become a go-to platform for interview preparation, helping millions of students transition from learning to confidently landing their first job.
               </p>
            </div>

            <div className="glass-card p-8 group hover:-translate-y-1 transition-transform flex-1">
               <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-rose-500 group-hover:text-rose-400" /> Built For You
               </h2>
               <p className="text-gray-400 text-sm leading-relaxed">
                  Whether you're preparing for your first internship or your dream job, this platform is designed to support your journey — one interview at a time.
               </p>
            </div>
         </div>

      </div>

      {/* Footer Contact */}
      <div className="glass-card p-10 text-center relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent"></div>
         <div className="w-16 h-16 mx-auto bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30 mb-6 shadow-glow-sm">
            <Mail className="w-8 h-8 text-indigo-400" />
         </div>
         <h2 className="text-2xl font-bold text-white mb-3 relative z-10">Get in Touch</h2>
         <p className="text-gray-400 text-base max-w-xl mx-auto relative z-10 leading-relaxed">
            Have feedback or suggestions? We’d love to hear from you.<br />
            Your input helps us improve and build a better experience for everyone.
         </p>
      </div>

    </div>
  );
}

export default About;
