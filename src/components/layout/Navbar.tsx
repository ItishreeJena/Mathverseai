import React from 'react';
import { UserProgress, UserAccount } from '../../types';
import { calculateLevel } from '../../services/storageService';
import { Bot, Flame, Code2, Dumbbell, GitPullRequest } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: 'dashboard' | 'curriculum' | 'playgrounds' | 'missions' | 'mythbusters' | 'formulas') => void;
  onOpenDiagnostic: () => void;
  onOpenTutor: () => void;
  onOpenStreak: () => void;
  onOpenAuth: () => void;
  onOpenCodeLab: () => void;
  onOpenGym: () => void;
  onOpenGitHubSync: () => void;
  progress: UserProgress;
  currentUser: UserAccount;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenTutor,
  onOpenStreak,
  onOpenAuth,
  onOpenCodeLab,
  onOpenGym,
  onOpenGitHubSync,
  progress,
  currentUser,
}) => {
  const levelInfo = calculateLevel(progress.xp);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 py-3">
        {/* Brand */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-cyan-300 transition-colors flex items-center gap-2"
        >
          <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white text-xs font-mono font-bold shadow-md">
            M
          </span>
          <span className="font-display">MathVerse AI</span>
        </button>

        {/* Primary Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs sm:text-sm font-medium text-slate-300">
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
            Formulas
          </button>
        </nav>

        {/* Feature Actions & Status Hub */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Math to Code Lab */}
          <button
            onClick={onOpenCodeLab}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-cyan-800/50 hover:border-cyan-500/80 text-cyan-300 text-xs font-medium transition shadow-sm"
            title="Convert Math Formulas to PyTorch & NumPy Code"
          >
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden xl:inline">PyTorch Lab</span>
          </button>

          {/* AI Math Gym */}
          <button
            onClick={onOpenGym}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-amber-800/50 hover:border-amber-500/80 text-amber-300 text-xs font-medium transition shadow-sm"
            title="Dynamic AI Practice Problem Gym"
          >
            <Dumbbell className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline">AI Gym</span>
          </button>

          {/* GitHub Sync Button */}
          <button
            onClick={onOpenGitHubSync}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white text-xs font-medium transition shadow-sm"
            title="GitHub Repository Sync & Push"
          >
            <GitPullRequest className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400" />
            <span className="hidden md:inline">GitHub</span>
          </button>

          {/* Daily Streak Indicator */}
          <button
            onClick={onOpenStreak}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-950/30 border border-rose-500/30 hover:border-rose-400/60 text-rose-300 text-xs font-mono font-bold transition-all shadow-sm"
            title="View Daily Streak Details & 7-Day Activity Calendar"
          >
            <Flame className="w-4 h-4 fill-rose-500 text-rose-400 animate-pulse shrink-0" />
            <span className="tabular-nums">{progress.streakDays}</span>
            <span className="hidden sm:inline font-sans text-[11px] font-normal text-rose-200">d</span>
          </button>

          {/* User Profile / Auth Button */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs transition-colors"
            title={`Logged in as ${currentUser.name} (Click to switch or authenticate)`}
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <span className="hidden xl:inline max-w-[80px] truncate font-medium">
              {currentUser.name}
            </span>
          </button>

          {/* AI Tutor Action */}
          <button
            onClick={onOpenTutor}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Tutor</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
