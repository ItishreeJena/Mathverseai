import React from 'react';
import { StreakInfo } from '../../types';
import { Flame, Award, Calendar, CheckCircle2, Zap, X, Shield, Sparkles } from 'lucide-react';

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  streakInfo: StreakInfo;
  onSimulateActivity: () => void;
}

export const StreakModal: React.FC<StreakModalProps> = ({
  isOpen,
  onClose,
  streakInfo,
  onSimulateActivity,
}) => {
  if (!isOpen) return null;

  const milestones = [
    { days: 3, title: 'Math Spark', xp: 50, achieved: streakInfo.currentStreak >= 3 },
    { days: 7, title: 'Weekly Inferno', xp: 150, achieved: streakInfo.currentStreak >= 7 },
    { days: 14, title: 'Calculus Constancy', xp: 350, achieved: streakInfo.currentStreak >= 14 },
    { days: 30, title: 'Deep Learning Sovereign', xp: 1000, achieved: streakInfo.currentStreak >= 30 },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-5">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Flame Banner */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-orange-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-950/30">
            <Flame className="w-9 h-9 fill-rose-500 text-rose-400 animate-pulse" />
          </div>

          <h2 className="text-2xl font-bold text-white tracking-tight">
            {streakInfo.currentStreak} Day Learning Streak!
          </h2>

          <p className="text-xs text-slate-300">
            {streakInfo.isActiveToday
              ? "You've practiced math today! Your streak is active and secure."
              : "Complete any lesson, quiz, or lab experiment today to keep your streak burning!"}
          </p>
        </div>

        {/* 7-Day Activity Calendar Strip */}
        <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              Past 7 Days Activity
            </span>
            <span className={streakInfo.isActiveToday ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
              {streakInfo.isActiveToday ? 'Active Today ✓' : 'Practice Pending Today'}
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center">
            {streakInfo.weeklyHistory.map((item, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg border text-xs flex flex-col items-center justify-between transition-colors ${
                  item.isActive
                    ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                    : item.isToday
                    ? 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}
              >
                <span className="text-[10px] font-mono uppercase mb-1">{item.dayName}</span>
                {item.isActive ? (
                  <Flame className="w-4 h-4 fill-rose-500 text-rose-400" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-700 my-0.5" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Streak Stats */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 font-mono text-[11px] block">Longest Record</span>
            <span className="text-lg font-bold font-mono text-amber-400">{streakInfo.longestStreak} Days</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 font-mono text-[11px] block">Total Active Days</span>
            <span className="text-lg font-bold font-mono text-cyan-400">{streakInfo.totalActiveDays} Days</span>
          </div>
        </div>

        {/* Milestones */}
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400">Streak Milestones</div>
          <div className="space-y-1.5">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                  m.achieved
                    ? 'bg-slate-950 border-emerald-900/50 text-slate-200'
                    : 'bg-slate-950/60 border-slate-800/60 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${m.achieved ? 'text-emerald-400' : 'text-slate-700'}`} />
                  <span className="font-medium text-white">{m.days} Days: {m.title}</span>
                </div>
                <span className="font-mono text-amber-400 text-[11px]">+{m.xp} XP</span>
              </div>
            ))}
          </div>
        </div>

        {/* Simulator Button for Instant Demonstration */}
        <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
          <button
            onClick={onSimulateActivity}
            className="w-full py-2 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-semibold text-xs rounded-lg shadow flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Record Daily Practice Activity (+Streak)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StreakModal;
