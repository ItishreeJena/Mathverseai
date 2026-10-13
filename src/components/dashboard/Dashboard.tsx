import React from 'react';
import { UserProgress, ModuleInfo, Lesson } from '../../types';
import { calculateLevel } from '../../services/storageService';
import { MODULES, LESSONS } from '../../data/curriculumData';
import {
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Target,
  Zap,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface DashboardProps {
  progress: UserProgress;
  onSelectLesson: (lessonId: string) => void;
  onOpenMissions: () => void;
  onOpenDiagnostic: () => void;
  onOpenPlayground: (type: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  progress,
  onSelectLesson,
  onOpenMissions,
  onOpenDiagnostic,
  onOpenPlayground,
}) => {
  const levelInfo = calculateLevel(progress.xp);

  // Find next recommended lesson
  const allLessonIds = MODULES.flatMap(m => m.lessonIds);
  const nextLessonId = allLessonIds.find(id => !progress.completedLessonIds.includes(id)) || allLessonIds[0];
  const nextLesson = LESSONS[nextLessonId];

  // Recently completed lessons
  const completedLessons = progress.completedLessonIds.map(id => LESSONS[id]).filter(Boolean);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Hero Welcome & Resume Learning Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
              <span>Mathematics for AI & Machine Learning</span>
              <span aria-hidden="true">·</span>
              <span>Stage {nextLesson?.stage || 1} Curriculum</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Welcome back to MathVerse AI
            </h1>

            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Resume your structured path towards mastering linear algebra, multivariable calculus, probability, and transformer mathematics.
            </p>

            {!progress.diagnosticTaken && (
              <div className="pt-2">
                <button
                  onClick={onOpenDiagnostic}
                  className="text-xs text-amber-300 hover:text-amber-200 underline flex items-center gap-1 font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Not sure where to begin? Take the 2-minute diagnostic skill assessment →
                </button>
              </div>
            )}
          </div>

          {/* Resume Next Lesson Action Card */}
          {nextLesson && (
            <div className="bg-slate-950/80 border border-indigo-900/60 p-4 rounded-xl shrink-0 max-w-xs w-full shadow-lg">
              <div className="text-[11px] text-cyan-400 uppercase font-mono tracking-wider font-semibold mb-1">
                Recommended Next Step
              </div>
              <div className="text-sm font-bold text-white mb-1 truncate">
                {nextLesson.title}
              </div>
              <div className="text-xs text-slate-400 mb-3 flex items-center gap-2">
                <span>{nextLesson.estimatedMinutes} mins</span>
                <span>·</span>
                <span className="text-amber-400 font-medium">+{nextLesson.xpReward} XP</span>
              </div>
              <button
                onClick={() => onSelectLesson(nextLesson.id)}
                className="w-full py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs rounded-lg shadow flex items-center justify-center gap-2 transition-all"
              >
                <span>Continue Lesson</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* KPI Stats Strip (Anti-slop clean design with tabular numbers) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Total Experience
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {progress.xp} <span className="text-xs text-amber-400 font-sans font-semibold">XP</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {levelInfo.title}
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            Student Level
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            Lvl {levelInfo.level}
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
            <div style={{ width: `${levelInfo.progressPercent}%` }} className="bg-cyan-500 h-full" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            Active Streak
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {progress.streakDays} <span className="text-xs text-rose-400 font-sans font-semibold">Days</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Keep practicing daily!
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Curriculum Progress
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {progress.completedLessonIds.length} <span className="text-xs text-slate-400 font-sans">/ {allLessonIds.length}</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            {Math.round((progress.completedLessonIds.length / allLessonIds.length) * 100)}% Mastered
          </div>
        </div>
      </div>

      {/* Curriculum Stages Breakdown Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            Core Mathematics Curriculum Stages
          </h2>
          <span className="text-xs text-slate-400 font-mono">Stage 1 through 7</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map(module => {
            const completedInModule = module.lessonIds.filter(id => progress.completedLessonIds.includes(id)).length;
            const percent = Math.round((completedInModule / module.lessonIds.length) * 100);

            return (
              <div
                key={module.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-xl p-5 shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-mono text-cyan-400 font-medium">Stage {module.stage}</span>
                    <span className="font-mono">{completedInModule}/{module.lessonIds.length} Lessons</span>
                  </div>

                  <h3 className="text-base font-semibold text-white mb-1.5">
                    {module.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {module.description}
                  </p>
                </div>

                <div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mb-3 border border-slate-800/60">
                    <div style={{ width: `${percent}%` }} className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-full" />
                  </div>

                  <button
                    onClick={() => onSelectLesson(module.lessonIds[0])}
                    className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>{percent === 100 ? 'Review Stage' : 'Explore Stage'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Visual Math Playgrounds Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Interactive Science Lab Playgrounds
            </h3>
            <p className="text-xs text-slate-400">
              Manipulate vectors, matrices, derivatives, distributions, and optimizers with verified mathematical accuracy.
            </p>
          </div>
          <button
            onClick={onOpenMissions}
            className="text-xs px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg hover:bg-amber-500/20 font-medium transition-colors"
          >
            Play Daily Missions
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'vectors', title: '2D Vector Space', desc: 'Dot product & angles', color: 'border-cyan-500/30' },
            { id: 'matrices', title: 'Matrix Laboratory', desc: 'Space warping & det', color: 'border-pink-500/30' },
            { id: 'gradient_descent', title: 'Gradient Descent', desc: 'Loss surface race', color: 'border-amber-500/30' },
            { id: 'neural_network', title: 'Neural Net Sandbox', desc: 'Forward pass & backprop', color: 'border-indigo-500/30' },
          ].map(p => (
            <button
              key={p.id}
              onClick={() => onOpenPlayground(p.id)}
              className={`p-3 text-left rounded-lg bg-slate-950/70 border ${p.color} hover:bg-slate-800/80 transition-colors`}
            >
              <div className="text-xs font-bold text-white mb-0.5">{p.title}</div>
              <div className="text-[11px] text-slate-400">{p.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
