import React from 'react';
import { UserProgress } from '../../types';
import { calculateLevel } from '../../services/storageService';
import { Bot, Sparkles, Flame, Zap } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: 'dashboard' | 'curriculum' | 'playgrounds' | 'missions' | 'mythbusters' | 'formulas') => void;
  onOpenDiagnostic: () => void;
  onOpenTutor: () => void;
  progress: UserProgress;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenDiagnostic,
  onOpenTutor,
  progress,
}) => {
  const levelInfo = calculateLevel(progress.xp);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-cyan-300 transition-colors flex items-center gap-2"
        >
          <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white text-xs font-mono font-bold shadow-md">
            M
          </span>
          <span>MathVerse AI</span>
        </button>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-300">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'dashboard' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('curriculum')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'curriculum' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Curriculum
          </button>
          <button
            onClick={() => onNavigate('playgrounds')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'playgrounds' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Playgrounds
          </button>
          <button
            onClick={() => onNavigate('missions')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'missions' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Missions
          </button>
          <button
            onClick={() => onNavigate('mythbusters')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'mythbusters' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Myth Busters
          </button>
          <button
            onClick={() => onNavigate('formulas')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              currentView === 'formulas' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Formula Sheet
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-300 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg">
            <span className="text-amber-400 flex items-center gap-1 font-semibold">
              <Zap className="w-3.5 h-3.5" /> {progress.xp} XP
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-300">Lvl {levelInfo.level}</span>
          </div>

          <button
            onClick={onOpenTutor}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Tutor</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
