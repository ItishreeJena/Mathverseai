import React, { useState } from 'react';
import { MODULES, LESSONS } from '../../data/curriculumData';
import { UserProgress } from '../../types';
import { BookOpen, CheckCircle2, ChevronRight, Lock, Sparkles, Clock, ArrowRight } from 'lucide-react';

interface CurriculumViewProps {
  progress: UserProgress;
  onSelectLesson: (lessonId: string) => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({
  progress,
  onSelectLesson,
}) => {
  const [selectedStage, setSelectedStage] = useState<number | 'all'>('all');

  const filteredModules = selectedStage === 'all'
    ? MODULES
    : MODULES.filter(m => m.stage === selectedStage);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold mb-1">
              Complete Mathematics Syllabus
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              7-Stage Mathematics Curriculum for AI
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1">
              Progression from arithmetic foundations to linear algebra, multivariate calculus, probability, and transformer self-attention.
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs self-start sm:self-auto">
            <button
              onClick={() => setSelectedStage('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedStage === 'all'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              All Stages
            </button>
            {[1, 2, 3, 4, 5, 6, 7].map(s => (
              <button
                key={s}
                onClick={() => setSelectedStage(s)}
                className={`px-2.5 py-1.5 rounded-lg font-mono font-medium transition-colors ${
                  selectedStage === s
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                S{s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modules & Lessons List */}
      <div className="space-y-6">
        {filteredModules.map(module => {
          const completedInModule = module.lessonIds.filter(id => progress.completedLessonIds.includes(id)).length;
          const percent = Math.round((completedInModule / module.lessonIds.length) * 100);

          return (
            <div
              key={module.id}
              className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <div className="text-xs font-mono text-cyan-400 uppercase font-semibold">
                    Stage {module.stage} · {module.title}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {module.description}
                  </p>
                </div>
                <div className="text-xs font-mono text-slate-400 self-start sm:self-auto">
                  {completedInModule}/{module.lessonIds.length} Mastered ({percent}%)
                </div>
              </div>

              {/* Lesson Cards within Module */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {module.lessonIds.map(lessonId => {
                  const lesson = LESSONS[lessonId];
                  if (!lesson) return null;

                  const isDone = progress.completedLessonIds.includes(lessonId);

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => onSelectLesson(lesson.id)}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                        isDone
                          ? 'bg-slate-950/60 border-emerald-900/40 hover:border-emerald-500/60'
                          : 'bg-slate-950 border-slate-800 hover:border-cyan-500/60 hover:bg-slate-900/60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                          <span className="flex items-center gap-1.5 font-mono text-[11px]">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {lesson.estimatedMinutes} mins
                          </span>
                          <span className="font-mono text-amber-400 text-[11px] font-semibold">
                            +{lesson.xpReward} XP
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-white mb-1">
                          {lesson.title}
                        </h4>

                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3">
                          {lesson.summary}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
                        {isDone ? (
                          <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                          </span>
                        ) : (
                          <span className="text-cyan-400 font-medium flex items-center gap-1 text-[11px]">
                            Start Lesson <ArrowRight className="w-3 h-3" />
                          </span>
                        )}

                        <span className="text-[10px] font-mono text-slate-500 uppercase">
                          {lesson.interactiveType || 'concept'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CurriculumView;
