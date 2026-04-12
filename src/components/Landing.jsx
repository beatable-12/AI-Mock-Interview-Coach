import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Brain, LineChart, Sparkles, Headphones, Bot, Gauge, BarChart3 } from 'lucide-react';

const features = [
  { icon: Mic, title: 'Voice & Text Input', body: 'Answer by speaking or typing' },
  { icon: Brain, title: 'AI-Powered Feedback', body: 'Instant scoring and tips' },
  { icon: LineChart, title: 'Track Progress', body: 'See your improvement over time' },
];

const testimonials = [
  { name: 'Riya S.', role: 'SWE Intern Candidate', quote: 'The feedback felt like a real interviewer. My confidence jumped in one week.' },
  { name: 'Arjun K.', role: 'Data Science Student', quote: 'The score ring and STAR hints helped me fix weak answers quickly.' },
  { name: 'Megha P.', role: 'Placement Prep', quote: 'Best part is voice practice. It finally feels like interview rehearsal, not theory.' },
];

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0d0d1a]/85 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-lavender font-semibold">
            <span className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 inline-flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </span>
            Coach AI
          </button>
          <button onClick={() => navigate('/interview')} className="btn-primary rounded-full px-6">Start Practicing</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-14 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <section className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#e8e0ff] mb-4 leading-[1.15]">Voice-powered AI interview practice</h1>
            <h2 className="text-2xl font-semibold text-[#a8a0c8] mb-4">Ace your next placement interview!</h2>
            <p className="text-[#a8a0c8] text-base leading-7 max-w-xl mb-8">
              Practice with our AI-powered interview coach. Get real-time feedback on your answers. Built for college students preparing for placements and internships.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate('/interview')} className="btn-primary rounded-full px-7">Start Interview -&gt;</button>
              <button onClick={() => navigate('/how-it-works')} className="btn-secondary rounded-full px-7">See how it works</button>
            </div>
          </div>

          <div className="glass-card p-6 md:p-8">
            <div className="text-xs uppercase tracking-[0.16em] text-[#6b6490] mb-4">Live mockup</div>
            <div className="space-y-4">
              <div className="bg-[#12122a] border border-white/10 rounded-2xl p-4">
                <p className="text-sm text-[#a8a0c8]">How would you optimize a slow API endpoint under heavy load?</p>
              </div>
              <div className="rounded-2xl p-4 text-sm text-white bg-gradient-to-br from-indigo-500/80 to-violet-600/80 ml-8">
                I'd profile the bottleneck first, then cache read-heavy paths and optimize DB indexes...
              </div>
              <div className="flex items-center justify-between text-xs text-[#6b6490] pt-2">
                <span>Category: Technical</span>
                <span className="px-2 py-1 rounded-full border border-amber-400/50 bg-amber-500/15 text-amber-200">Medium</span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, body }) => (
            <article key={title} className="glass-card p-6">
              <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-[#e8e0ff]" />
              </div>
              <h3 className="text-lg font-semibold text-[#e8e0ff] mb-1">{title}</h3>
              <p className="text-[#a8a0c8] text-sm">{body}</p>
            </article>
          ))}
        </section>

        <section className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-4xl font-semibold text-[#e8e0ff] mb-3">Personalized for you</h3>
            <p className="text-[#a8a0c8] leading-7">Each session adapts to your role, interview type, and target difficulty. Questions feel realistic and context-aware.</p>
          </div>
          <div className="glass-card p-6">
            <p className="text-sm text-[#e8e0ff] mb-3">Question preview</p>
            <p className="text-[#a8a0c8] mb-4">Tell me about a project where you handled unclear requirements and still delivered on time.</p>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full text-xs border border-white/20 text-[#a8a0c8]">Behavioral</span>
              <span className="px-3 py-1 rounded-full text-xs border border-red-400/50 bg-red-500/15 text-red-200">Hard</span>
            </div>
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full border-8 border-indigo-500/60 flex items-center justify-center text-2xl font-bold text-[#e8e0ff]">8.4</div>
              <div>
                <p className="text-[#e8e0ff] font-semibold">Actionable feedback</p>
                <p className="text-[#a8a0c8] text-sm">Strengths and improvements after every answer.</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold text-green-200 border border-green-400/40 bg-green-500/15">Clear structure</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold text-green-200 border border-green-400/40 bg-green-500/15">Strong examples</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold text-amber-200 border border-amber-400/40 bg-amber-500/15">Shorten intro</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold text-amber-200 border border-amber-400/40 bg-amber-500/15">Use STAR explicitly</span>
            </div>
          </div>
          <div>
            <h3 className="text-4xl font-semibold text-[#e8e0ff] mb-3">Actionable feedback</h3>
            <p className="text-[#a8a0c8] leading-7">Get score, headline, summary, strengths, and exact areas to improve so every attempt makes you better.</p>
          </div>
        </section>

        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Headphones, title: 'Voice Chat' },
            { icon: Bot, title: 'Realistic Questions' },
            { icon: Gauge, title: 'Instant Feedback' },
            { icon: BarChart3, title: 'Multiple Difficulty Levels' },
          ].map(({ icon: Icon, title }) => (
            <article key={title} className="glass-card p-5">
              <Icon className="w-5 h-5 text-[#e8e0ff] mb-3" />
              <h4 className="text-base font-semibold text-[#e8e0ff]">{title}</h4>
            </article>
          ))}
        </section>

        <section>
          <h3 className="text-4xl font-semibold text-[#e8e0ff] mb-6 text-center">What students say</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <article key={t.name} className="glass-card p-5">
                <p className="text-[#a8a0c8] text-sm leading-6">"{t.quote}"</p>
                <div className="mt-4 border-t border-white/10 pt-3">
                  <p className="text-[#e8e0ff] font-semibold text-sm">{t.name}</p>
                  <p className="text-[#6b6490] text-xs">{t.role}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-card p-8 text-center">
          <h3 className="text-4xl font-semibold text-[#e8e0ff] mb-3">Ready to ace your next interview?</h3>
          <p className="text-[#a8a0c8] mb-6">Start practicing with AI now and build interview confidence every day.</p>
          <button onClick={() => navigate('/interview')} className="btn-primary rounded-full px-7">Start Interview</button>
        </section>
      </main>
    </div>
  );
}

export default Landing;
