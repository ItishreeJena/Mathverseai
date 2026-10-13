import React, { useState } from 'react';
import MathView from '../common/MathView';
import { Dumbbell, Sparkles, CheckCircle2, XCircle, Lightbulb, RefreshCw, Award, ChevronRight, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AiMathGymModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestionCompleted: (earnedXp: number) => void;
}

interface GeneratedQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hints: string[];
}

const TOPICS = [
  'Linear Algebra (Vectors & Matrices)',
  'Multivariable Calculus & Gradients',
  'Probability & Bayes Theorem',
  'Statistics & Hypothesis Testing',
  'Optimization & Loss Landscapes',
  'Information Theory & Entropy',
  'Transformers & Attention Math'
];

export const AiMathGymModal: React.FC<AiMathGymModalProps> = ({
  isOpen,
  onClose,
  onQuestionCompleted,
}) => {
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
  const [difficulty, setDifficulty] = useState<'Novice' | 'Intermediate' | 'Master'>('Intermediate');
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState<GeneratedQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [revealedHintIndex, setRevealedHintIndex] = useState(-1);
  const [questionsSolved, setQuestionsSolved] = useState(0);

  if (!isOpen) return null;

  const handleGenerateQuestion = async () => {
    setIsLoading(true);
    setSelectedOption(null);
    setIsSubmitted(false);
    setRevealedHintIndex(-1);

    try {
      const res = await fetch('/api/tutor/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: selectedTopic,
          difficulty: difficulty,
        }),
      });
      const data = await res.json();
      if (data.question) {
        setQuestion(data.question);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  if (!question && !isLoading) {
    handleGenerateQuestion();
  }

  const handleSubmit = () => {
    if (selectedOption === null || !question) return;
    setIsSubmitted(true);
    const isCorrect = selectedOption === question.correctAnswer;
    if (isCorrect) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      const xpReward = difficulty === 'Master' ? 50 : difficulty === 'Intermediate' ? 35 : 20;
      onQuestionCompleted(xpReward);
      setQuestionsSolved(prev => prev + 1);
    }
  };

  const isCorrect = isSubmitted && question && selectedOption === question.correctAnswer;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white font-display">AI Math Gym</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950 border border-amber-800 text-amber-300 font-medium">
                  Dynamic Problem Generator
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Endless AI-generated challenges across all ML mathematics disciplines
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-slate-200">
          {/* Controls: Topic & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Curriculum Topic
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                disabled={isLoading}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                {TOPICS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Difficulty Level
              </label>
              <div className="flex rounded-lg overflow-hidden border border-slate-700">
                {(['Novice', 'Intermediate', 'Master'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`flex-1 py-1.5 text-xs font-medium transition ${
                      difficulty === diff
                        ? 'bg-amber-500 text-slate-950 font-semibold'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generator Action */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              Solved in this session: <strong className="text-white">{questionsSolved}</strong>
            </span>
            <button
              onClick={handleGenerateQuestion}
              disabled={isLoading}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-amber-900/50 rounded-lg text-xs font-medium transition flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Generate New Problem
            </button>
          </div>

          {/* Question Card */}
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm">Synthesizing mathematically verified AI problem via Gemini API...</p>
            </div>
          ) : question ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-amber-400">{selectedTopic}</span>
                  <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] font-medium">{difficulty}</span>
                </div>
                <div className="text-sm text-slate-200 font-medium leading-relaxed">
                  <MathView math={question.question} />
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {question.options.map((opt, idx) => {
                  let optStyle = 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-slate-200';

                  if (isSubmitted) {
                    if (idx === question.correctAnswer) {
                      optStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold';
                    } else if (idx === selectedOption) {
                      optStyle = 'bg-rose-950/60 border-rose-500 text-rose-300';
                    } else {
                      optStyle = 'opacity-50 bg-slate-900 border-slate-800';
                    }
                  } else if (selectedOption === idx) {
                    optStyle = 'bg-amber-950/40 border-amber-500 text-amber-200';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isSubmitted}
                      onClick={() => setSelectedOption(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border transition flex items-start gap-3 text-xs leading-relaxed ${optStyle}`}
                    >
                      <span className="w-5 h-5 rounded-md bg-slate-900/80 border border-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1">
                        <MathView math={opt} />
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Hints */}
              {question.hints && question.hints.length > 0 && !isSubmitted && (
                <div>
                  {revealedHintIndex >= 0 ? (
                    <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl text-xs text-amber-200 flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>Hint:</strong> <MathView math={question.hints[0]} />
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setRevealedHintIndex(0)}
                      className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1 transition"
                    >
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                      Need a hint? (-5 XP penalty)
                    </button>
                  )}
                </div>
              )}

              {/* Feedback when submitted */}
              {isSubmitted && (
                <div
                  className={`p-4 rounded-xl border space-y-2 ${
                    isCorrect
                      ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                      : 'bg-rose-950/30 border-rose-800/60 text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span>Outstanding! Correct Solution (+{difficulty === 'Master' ? 50 : difficulty === 'Intermediate' ? 35 : 20} XP)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-rose-400" />
                        <span>Incorrect Solution — Review Mathematical Reasoning</span>
                      </>
                    )}
                  </div>
                  <div className="text-xs leading-relaxed text-slate-300 pt-1 border-t border-slate-800/60">
                    <MathView math={question.explanation} />
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
          >
            Close Gym
          </button>
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null || isLoading}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition disabled:opacity-50 flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
            >
              <span>Submit Answer</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleGenerateQuestion}
              className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-indigo-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Next Gym Challenge</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiMathGymModal;
