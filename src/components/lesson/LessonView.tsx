import React, { useState } from 'react';
import { Lesson } from '../../types';
import MathView from '../common/MathView';
import QuizComponent from '../quiz/QuizComponent';
import VectorPlayground from '../playgrounds/VectorPlayground';
import MatrixLaboratory from '../playgrounds/MatrixLaboratory';
import FunctionDerivativeExplorer from '../playgrounds/FunctionDerivativeExplorer';
import GradientDescentSimulator from '../playgrounds/GradientDescentSimulator';
import ProbabilitySimulator from '../playgrounds/ProbabilitySimulator';
import StatisticsLaboratory from '../playgrounds/StatisticsLaboratory';
import NeuralNetworkSandbox from '../playgrounds/NeuralNetworkSandbox';
import LossFunctionExplorer from '../playgrounds/LossFunctionExplorer';
import PcaPlayground from '../playgrounds/PcaPlayground';

import {
  Sparkles,
  BookOpen,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  Bookmark,
  Edit3,
  Bot,
  Layers,
  ArrowRight
} from 'lucide-react';

interface LessonViewProps {
  lesson: Lesson;
  savedNote: string;
  isBookmarked: boolean;
  onSaveNote: (note: string) => void;
  onToggleBookmark: () => void;
  onCompleteQuiz: (score: number, earnedXp: number) => void;
  onOpenTutor: (contextPrompt?: string) => void;
  onSelectNextLesson?: () => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  lesson,
  savedNote,
  isBookmarked,
  onSaveNote,
  onToggleBookmark,
  onCompleteQuiz,
  onOpenTutor,
  onSelectNextLesson,
}) => {
  const [noteText, setNoteText] = useState(savedNote || '');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'experiment' | 'practice' | 'notes'>('content');

  const handleSaveNote = () => {
    onSaveNote(noteText);
    setIsEditingNote(false);
  };

  // Render associated interactive playground
  const renderPlayground = () => {
    switch (lesson.interactiveType) {
      case 'vectors':
        return <VectorPlayground />;
      case 'matrices':
        return <MatrixLaboratory />;
      case 'derivatives':
        return <FunctionDerivativeExplorer />;
      case 'gradient_descent':
        return <GradientDescentSimulator />;
      case 'probability':
        return <ProbabilitySimulator />;
      case 'statistics':
        return <StatisticsLaboratory />;
      case 'neural_network':
        return <NeuralNetworkSandbox />;
      case 'loss_functions':
        return <LossFunctionExplorer />;
      case 'pca':
        return <PcaPlayground />;
      default:
        return <VectorPlayground />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Lesson Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
              <span>Stage {lesson.stage}</span>
              <span aria-hidden="true">·</span>
              <span>{lesson.estimatedMinutes} min read</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400 font-semibold">+{lesson.xpReward} XP</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {lesson.title}
            </h1>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {lesson.summary}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={onToggleBookmark}
              className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
                isBookmarked
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Lesson'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
              <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Bookmark'}</span>
            </button>

            <button
              onClick={() => onOpenTutor(`Explain the intuition behind ${lesson.title} and how it is applied in AI models.`)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow transition-colors"
            >
              <Bot className="w-4 h-4" />
              <span>Ask AI Tutor</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs within Lesson */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/80 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === 'content'
                ? 'bg-slate-800 text-cyan-300 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Lesson Guide
          </button>
          <button
            onClick={() => setActiveTab('experiment')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'experiment'
                ? 'bg-slate-800 text-cyan-300 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Interactive Lab
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'practice'
                ? 'bg-slate-800 text-cyan-300 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Mastery Quiz ({lesson.quiz.length})
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'notes'
                ? 'bg-slate-800 text-cyan-300 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
            Personal Notes {noteText ? '•' : ''}
          </button>
        </div>
      </div>

      {/* TAB 1: Structured 11-step Lesson Experience */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          {/* 1. WHY THIS CONCEPT MATTERS */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center text-xs font-mono">1</span>
              Why This Matters in Artificial Intelligence
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed pl-8">
              {lesson.whyItMatters}
            </p>
          </div>

          {/* 2. EVERYDAY ANALOGY */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-amber-950 border border-amber-800 text-amber-400 flex items-center justify-center text-xs font-mono">2</span>
              Everyday Intuition & Analogy
            </h2>
            <div className="pl-8 text-sm text-slate-300 leading-relaxed bg-amber-950/10 border-l-2 border-amber-500/40 p-3 rounded-r-lg">
              {lesson.everydayAnalogy}
            </div>
          </div>

          {/* 3. INTUITIVE EXPLANATION */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-indigo-950 border border-indigo-800 text-indigo-400 flex items-center justify-center text-xs font-mono">3</span>
              Intuitive Explanation (Plain English)
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed pl-8">
              {lesson.intuitiveExplanation}
            </p>
          </div>

          {/* 4. MATHEMATICAL DEFINITION & FORMULA */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-purple-950 border border-purple-800 text-purple-400 flex items-center justify-center text-xs font-mono">4</span>
              Formal Mathematical Definition & Notation
            </h2>

            <div className="pl-8 space-y-4">
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-center">
                <MathView math={lesson.keyFormula} display={true} className="text-lg text-cyan-300" />
              </div>

              {lesson.symbolsExplained && lesson.symbolsExplained.length > 0 && (
                <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/80">
                  <div className="text-xs uppercase font-mono text-slate-400 mb-2">Meaning of Every Mathematical Symbol:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {lesson.symbolsExplained.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-1.5 rounded bg-slate-900/50">
                        <MathView math={item.symbol} className="font-bold text-cyan-400 shrink-0" />
                        <span className="text-slate-300">{item.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 5. WORKED EXAMPLES (NO JUMPED STEPS) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center text-xs font-mono">5</span>
              Step-by-Step Worked Problem (Zero Jumped Steps)
            </h2>

            <div className="pl-8 space-y-3">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-amber-300">
                <b>Problem:</b> {lesson.workedExample.problem}
              </div>

              <div className="space-y-3">
                {lesson.workedExample.steps.map((st, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/60 border border-slate-800/70 rounded-lg text-xs space-y-1.5">
                    <div className="font-semibold text-emerald-400">{st.stepTitle}</div>
                    <p className="text-slate-300">{st.explanation}</p>
                    <div className="bg-slate-900 p-2 rounded text-center">
                      <MathView math={st.math} display={true} className="text-cyan-300" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-lg text-xs font-mono text-emerald-300 flex items-center justify-between">
                <span>Final Analytical Result:</span>
                <MathView math={lesson.workedExample.finalResult} className="text-emerald-300 font-bold" />
              </div>
            </div>
          </div>

          {/* 6. INTERACTIVE EXPERIMENT CALLOUT */}
          <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-900/50 rounded-xl p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  Hands-On Interactive Laboratory
                </h2>
                <p className="text-xs text-slate-300">
                  Experiment live with parameter values, vectors, gradients, or distributions right inside your browser.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('experiment')}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow transition-colors shrink-0"
              >
                Launch Laboratory
              </button>
            </div>
          </div>

          {/* 7. PRACTICAL AI APPLICATION */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-sky-950 border border-sky-800 text-sky-400 flex items-center justify-center text-xs font-mono">7</span>
              Real-World Machine Learning Application
            </h2>
            <div className="pl-8 space-y-1.5 text-xs">
              <div className="text-sm font-semibold text-sky-300">{lesson.aiApplication.title}</div>
              <p className="text-slate-300 leading-relaxed">{lesson.aiApplication.description}</p>
              <div className="pt-2 text-slate-400">
                Associated Algorithm: <span className="font-mono text-cyan-400">{lesson.aiApplication.algorithm}</span>
              </div>
            </div>
          </div>

          {/* 8. REVISION SHEET & COMMON MISTAKES */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-rose-950 border border-rose-800 text-rose-400 flex items-center justify-center text-xs font-mono">8</span>
              Revision Sheet & Classic Trap to Avoid
            </h2>
            <div className="pl-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-slate-400 font-mono block mb-1">Key Takeaway:</span>
                <p className="text-slate-200">{lesson.revisionSummary.keyTakeaway}</p>
              </div>
              <div className="p-3 bg-rose-950/20 border border-rose-900/30 rounded-lg">
                <span className="text-rose-400 font-mono block mb-1">Classic Mistake / Trap:</span>
                <p className="text-rose-200">{lesson.revisionSummary.commonMistake}</p>
              </div>
            </div>
          </div>

          {/* Call to Quiz */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setActiveTab('practice')}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white rounded-lg text-xs font-semibold shadow-lg flex items-center gap-2"
            >
              Take Mastery Quiz (+{lesson.xpReward} XP)
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: Interactive Playground */}
      {activeTab === 'experiment' && (
        <div className="space-y-4">
          {renderPlayground()}
        </div>
      )}

      {/* TAB 3: Mastery Quiz */}
      {activeTab === 'practice' && (
        <div className="space-y-4">
          <QuizComponent
            questions={lesson.quiz}
            xpReward={lesson.xpReward}
            onComplete={onCompleteQuiz}
            topicTitle={lesson.title}
          />
        </div>
      )}

      {/* TAB 4: Personal Notes */}
      {activeTab === 'notes' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-indigo-400" />
              Personal Study Notes for {lesson.title}
            </h3>
            <div className="flex items-center gap-2">
              {noteText && (
                <button
                  onClick={() => {
                    const blob = new Blob([`# ${lesson.title} — Study Notes\n\n${noteText}\n\n---\nExported from MathVerse AI`], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${lesson.id}_notes.md`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700"
                >
                  Download .md
                </button>
              )}
              {isEditingNote ? (
                <button
                  onClick={handleSaveNote}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow"
                >
                  Save Notes
                </button>
              ) : (
                <button
                  onClick={() => setIsEditingNote(true)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700"
                >
                  Edit Notes
                </button>
              )}
            </div>
          </div>

          {isEditingNote ? (
            <textarea
              rows={8}
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Write your personal intuition, questions, or key formulas for this lesson..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs sm:text-sm text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            />
          ) : (
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-xs sm:text-sm text-slate-300 min-h-[140px] whitespace-pre-wrap font-sans">
              {noteText ? noteText : (
                <span className="text-slate-500 italic">
                  No notes recorded yet for this lesson. Click "Edit Notes" to capture your personal takeaways!
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LessonView;
