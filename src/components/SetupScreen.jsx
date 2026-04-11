import React, { useState } from 'react';
import { User, Briefcase, Settings2, Loader2, ArrowRight, FileText, UploadCloud, X, Brain, Zap, Smile, Timer, AlertOctagon } from 'lucide-react';
import toast from 'react-hot-toast';
import { extractTextFromPDF } from '../utils/pdf';

const roles = [
  "Software Engineer Intern",
  "Data Science Intern",
  "Product Manager Intern",
  "Business Analyst Intern",
  "Marketing Intern",
  "General Placement"
];

const types = [
  "HR/Behavioral",
  "Technical (CS/DSA)",
  "Mixed"
];

const personalities = [
  { id: 'friendly',    label: 'Friendly',    description: 'Warm & encouraging tone',      icon: Smile,        color: 'emerald' },
  { id: 'normal',      label: 'Professional', description: 'Balanced & structured',        icon: Brain,        color: 'indigo'  },
  { id: 'strict',      label: 'Strict',       description: 'Critical & challenging',       icon: AlertOctagon, color: 'amber'   },
  { id: 'rapid-fire',  label: 'Rapid-Fire',   description: 'Fast, sharp, no fluff',        icon: Zap,          color: 'rose'    },
];

const colorMap = {
  emerald: { ring: 'border-emerald-500 bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-500' },
  indigo:  { ring: 'border-indigo-500 bg-indigo-500/10',   text: 'text-indigo-400',  dot: 'bg-indigo-500'  },
  amber:   { ring: 'border-amber-500 bg-amber-500/10',     text: 'text-amber-400',   dot: 'bg-amber-500'   },
  rose:    { ring: 'border-rose-500 bg-rose-500/10',       text: 'text-rose-400',    dot: 'bg-rose-500'    },
};

function SetupScreen({ onStart, isLoading }) {
  const [role, setRole] = useState(roles[0]);
  const [type, setType] = useState(types[0]);
  const [count, setCount] = useState(5);
  const [personality, setPersonality] = useState('normal');
  const [pressureMode, setPressureMode] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
    } else if (file) {
      toast.error('Please upload a valid PDF document.');
    }
  };

  const removeFile = (e) => {
    e.preventDefault();
    setResumeFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let resumeText = '';
    if (resumeFile) {
      try {
        const arrayBuffer = await resumeFile.arrayBuffer();
        resumeText = await extractTextFromPDF(arrayBuffer);
        if (!resumeText || resumeText.length < 50) {
          toast.error('Resume parsing yielded too little text. Proceeding without resume context.');
          resumeText = '';
        } else {
          toast.success('Resume parsed successfully!');
        }
      } catch (err) {
        toast.error('Failed to parse PDF. Ensure it\'s not a scanned image.');
        return;
      }
    }

    onStart({ role, type, count, personality, pressureMode, resumeText });
  };

  return (
    <div className="w-full max-w-xl glass-card overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 mx-auto mt-6">
      <div className="p-8 pb-4 relative overflow-hidden">
        <h1 className="text-2xl font-extrabold text-white mb-2 tracking-tight">Configure Interview</h1>
        <p className="text-gray-400 font-medium text-sm">Tailor the AI precisely to your target scenario.</p>
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 pt-0 space-y-8 relative z-10">

        {/* Role */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-500" /> Target Role
          </label>
          <div className="relative">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isLoading}
              className="w-full appearance-none bg-gray-900/50 border border-gray-700 text-white rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium hover:border-gray-600 disabled:opacity-50"
            >
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        {/* Interview Type */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-500" /> Interview Type
          </label>
          <div className="grid grid-cols-1 gap-3">
            {types.map((t) => (
              <label key={t} className={`relative flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${type === t ? 'border-indigo-500 bg-indigo-900/20 ring-1 ring-indigo-500' : 'border-gray-700 hover:bg-gray-800'}`}>
                <div className="flex items-center gap-3">
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${type === t ? 'border-indigo-500 bg-indigo-500' : 'border-gray-600'}`}>
                    {type === t && <div className="h-2 w-2 rounded-full bg-white"></div>}
                  </div>
                  <span className={`text-sm font-semibold ${type === t ? 'text-indigo-100' : 'text-gray-300'}`}>{t}</span>
                </div>
                <input type="radio" name="type" value={t} checked={type === t} onChange={() => setType(t)} className="sr-only" disabled={isLoading} />
              </label>
            ))}
          </div>
        </div>

        {/* Interviewer Personality */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
            <Brain className="w-4 h-4 text-indigo-500" /> Interviewer Personality
          </label>
          <div className="grid grid-cols-2 gap-3">
            {personalities.map(({ id, label, description, icon: Icon, color }) => {
              const c = colorMap[color];
              const isSelected = personality === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPersonality(id)}
                  disabled={isLoading}
                  className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition-all ${isSelected ? `${c.ring} border-2` : 'border-gray-700 hover:bg-gray-800/60'}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? c.ring : 'bg-white/5'}`}>
                    <Icon className={`w-4 h-4 ${isSelected ? c.text : 'text-gray-400'}`} />
                  </div>
                  <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-gray-300'}`}>{label}</span>
                  <span className="text-[11px] text-gray-500 leading-tight">{description}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pressure Mode */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-700 hover:border-rose-500/40 transition-all bg-gray-900/30">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${pressureMode ? 'bg-rose-500/20 border border-rose-500/30' : 'bg-white/5 border border-white/10'}`}>
              <Timer className={`w-5 h-5 ${pressureMode ? 'text-rose-400' : 'text-gray-500'}`} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Pressure Mode</p>
              <p className="text-xs text-gray-500">60s timer · No skipping · AI interruptions</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPressureMode(!pressureMode)}
            disabled={isLoading}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none ${pressureMode ? 'bg-rose-500' : 'bg-gray-700'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ${pressureMode ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        {/* Resume Upload */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-500" />
            Resume Context <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-md text-gray-400 ml-2">Optional</span>
          </label>
          {!resumeFile ? (
            <label className={`block w-full border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${isLoading ? 'opacity-50 pointer-events-none' : 'hover:bg-white/5 border-gray-700 hover:border-indigo-500/50'}`}>
              <UploadCloud className="w-8 h-8 mx-auto text-gray-500 mb-2" />
              <p className="text-sm text-gray-300 font-medium">Upload PDF Resume</p>
              <p className="text-xs text-gray-500 mt-1">AI will formulate questions based on your experience</p>
              <input onChange={handleFileChange} type="file" accept="application/pdf" className="hidden" disabled={isLoading} />
            </label>
          ) : (
            <div className="flex items-center justify-between bg-indigo-500/10 border border-indigo-500/30 p-4 rounded-xl">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-200 truncate">{resumeFile.name}</p>
                  <p className="text-xs text-indigo-400">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button onClick={removeFile} disabled={isLoading} className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Question Count */}
        <div className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-indigo-500" /> Question Count
            </label>
            <span className="bg-indigo-900/50 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold">{count} Questions</span>
          </div>
          <input
            type="range" min="3" max="10" value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 disabled:opacity-50"
            disabled={isLoading}
          />
          <div className="flex justify-between text-xs text-gray-500 font-semibold px-1">
            <span>Quick (3)</span><span>Deep Dive (10)</span>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-white/5">
          <button type="submit" disabled={isLoading} className="w-full btn-primary group overflow-hidden relative">
            {isLoading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /><span>Initializing...</span></>
            ) : (
              <>{pressureMode && <span className="text-xs bg-rose-500/30 px-2 py-0.5 rounded-md mr-1">🔴 PRESSURE</span>} Initialize Interview <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SetupScreen;
