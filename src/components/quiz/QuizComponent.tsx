import React, { useState } from 'react';
import { QuizQuestion } from '../../types';
import MathView from '../common/MathView';
import { CheckCircle2, XCircle, Lightbulb, ChevronRight, Award, RotateCcw, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizComponentProps {
  questions: QuizQuestion[];
  xpReward: number;
  onComplete: (score: number, earnedXp: number) => void;
  topicTitle?: string;
}

export const QuizComponent: React.FC<QuizComponentProps> = ({ questions, xpReward, onComplete, topicTitle = 'Mathematics for AI' }) => {
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>(questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [revealedHints, setRevealedHints] = useState<number>(0);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isGeneratingAiQ, setIsGeneratingAiQ] = useState(false);

  const currentQ = activeQuestions[currentIndex];

  const handleGenerateAiQuestion = async () => {
    setIsGeneratingAiQ(true);
    try {
      const res = await fetch('/api/tutor/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicTitle, difficulty: 'Intermediate' }),
      });
      const data = await res.json();
      if (data.question) {
        const newQ: QuizQuestion = {
          id: `ai_${Date.now()}`,
          question: data.question.question,
          options: data.question.options,
          correctAnswer: data.question.correctAnswer,
          type: 'multiple-choice',
          hints: data.question.hints || ['Think about the fundamental definition and geometric intuition.'],
          explanation: data.question.explanation,
        };
        setActiveQuestions(prev => [...prev, newQ]);
        setCurrentIndex(activeQuestions.length); // jump to newly created
        setSelectedOption(null);
        setIsAnswerSubmitted(false);
        setRevealedHints(0);
      }
    } catch (e) {
      console.error('Error generating AI question:', e);
    } finally {
      setIsGeneratingAiQ(false);
    }
  };
  if (!currentQ) return null;

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === currentQ.correctAnswer) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setRevealedHints(0);
    } else {
      setIsFinished(true);
      const finalScore = Math.round(((correctCount + (selectedOption === currentQ.correctAnswer ? 1 : 0)) / activeQuestions.length) * 100);
      const earnedXp = Math.round((finalScore / 100) * xpReward);
      if (finalScore >= 70) {
        confetti({ particleCount: 70, spread: 60 });
      }
      onComplete(finalScore, earnedXp);
    }
  };

  const handleRevealHint = () => {
    if (revealedHints < currentQ.hints.length) {
      setRevealedHints(prev => prev + 1);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setRevealedHints(0);
    setIsAnswerSubmitted(false);
    setCorrectCount(0);
    setIsFinished(false);
  };

  if (isFinished) {
    const finalScore = Math.round((correctCount / activeQuestions.length) * 100);
    const earnedXp = Math.round((finalScore / 100) * xpReward);

    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center space-y-4 shadow-xl">
        <div className="w-14 h-14 mx-auto rounded-full bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
          <Award className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white">Mastery Assessment Complete!</h3>
        <p className="text-sm text-slate-300">
          You scored <span className="font-bold text-cyan-400 font-mono text-base">{finalScore}%</span> ({correctCount}/{activeQuestions.length} correct)
        </p>

        <div className="inline-block px-4 py-2 bg-slate-950 rounded-lg border border-slate-800 font-mono text-sm text-amber-400 font-semibold">
          +{earnedXp} XP Awarded
        </div>

        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={handleRestart}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  const isCorrect = selectedOption === currentQ.correctAnswer;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            Mastery Check · Question {currentIndex + 1} of {activeQuestions.length}
          </span>
          <button
            onClick={handleGenerateAiQuestion}
            disabled={isGeneratingAiQ}
            className="px-2.5 py-1 rounded bg-indigo-950/70 border border-indigo-700/60 text-indigo-300 hover:text-white flex items-center gap-1 text-[11px] font-medium transition-colors"
            title="Generate a brand new practice question with Gemini AI"
          >
            {isGeneratingAiQ ? (
              <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
            ) : (
              <Sparkles className="w-3 h-3 text-cyan-400" />
            )}
            <span>{isGeneratingAiQ ? 'Generating...' : 'AI Practice Question'}</span>
          </button>
        </div>
        <span className="font-mono text-slate-400">
          Potential: +{xpReward} XP
        </span>
      </div>

      <div className="text-sm font-medium text-slate-100 mb-5 leading-relaxed">
        {currentQ.question}
      </div>

      {/* Options */}
      <div className="space-y-2.5 mb-5">
        {currentQ.options.map((option, idx) => {
          let btnStyle = 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900';
          if (selectedOption === idx) {
            btnStyle = 'bg-cyan-950/40 border-cyan-500/70 text-cyan-200';
          }
          if (isAnswerSubmitted) {
            if (idx === currentQ.correctAnswer) {
              btnStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-200';
            } else if (selectedOption === idx) {
              btnStyle = 'bg-rose-950/50 border-rose-500 text-rose-200';
            } else {
              btnStyle = 'bg-slate-950/40 border-slate-800/50 text-slate-500';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => !isAnswerSubmitted && setSelectedOption(idx)}
              disabled={isAnswerSubmitted}
              className={`w-full text-left p-3.5 rounded-lg border text-xs sm:text-sm font-normal flex items-start gap-3 transition-colors ${btnStyle}`}
            >
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-900/80 border border-slate-800 text-slate-400 shrink-0">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="flex-1">{option}</span>
              {isAnswerSubmitted && idx === currentQ.correctAnswer && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              )}
              {isAnswerSubmitted && selectedOption === idx && idx !== currentQ.correctAnswer && (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Progressive Hints */}
      {!isAnswerSubmitted && currentQ.hints.length > 0 && (
        <div className="mb-5 space-y-2">
          {Array.from({ length: revealedHints }).map((_, i) => (
            <div key={i} className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-lg text-xs text-amber-200 flex items-start gap-2">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>Hint {i + 1}: {currentQ.hints[i]}</span>
            </div>
          ))}

          {revealedHints < currentQ.hints.length && (
            <button
              onClick={handleRevealHint}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5" /> Need a progressive hint? ({revealedHints}/{currentQ.hints.length})
            </button>
          )}
        </div>
      )}

      {/* Submitted Explanation & Misconception Breakdown */}
      {isAnswerSubmitted && (
        <div className={`p-4 rounded-lg border text-xs mb-5 space-y-2 ${
          isCorrect ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200' : 'bg-rose-950/20 border-rose-800/40 text-rose-200'
        }`}>
          <div className="font-semibold flex items-center gap-1.5 text-sm">
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Correct Reasoning!
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-rose-400" />
                Not quite. Here is the misconception breakdown:
              </>
            )}
          </div>
          <p className="text-slate-300">{currentQ.explanation}</p>
          {!isCorrect && currentQ.misconceptionExplanation && (
            <div className="pt-2 border-t border-rose-900/40 text-rose-300">
              <span className="font-semibold">Why this wrong answer is common: </span>
              {currentQ.misconceptionExplanation}
            </div>
          )}
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2">
        <div />
        {!isAnswerSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow transition-colors"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow transition-colors"
          >
            {currentIndex < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizComponent;
