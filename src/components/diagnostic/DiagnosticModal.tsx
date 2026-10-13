import React, { useState } from 'react';
import { ModuleStage } from '../../types';
import MathView from '../common/MathView';
import { CheckCircle2, Award, X, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteDiagnostic: (recommendedStage: ModuleStage) => void;
}

export const DiagnosticModal: React.FC<DiagnosticModalProps> = ({
  isOpen,
  onClose,
  onCompleteDiagnostic,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [recommendedStage, setRecommendedStage] = useState<ModuleStage>(1);

  if (!isOpen) return null;

  const QUESTIONS = [
    {
      stageTest: 1,
      question: 'Which of the following is equivalent to log(a * b)?',
      options: ['log(a) * log(b)', 'log(a) + log(b)', 'log(a) / log(b)', 'log(a + b)'],
      correct: 1,
    },
    {
      stageTest: 2,
      question: 'What is the dot product of vectors u = [2, 3] and v = [4, -1]?',
      options: ['5', '8', '11', '0'],
      correct: 0, // 2*4 + 3*(-1) = 8 - 3 = 5
    },
    {
      stageTest: 3,
      question: 'What is the derivative d/dx [3x² + 5x] evaluated at x = 2?',
      options: ['11', '17', '12', '24'],
      correct: 1, // 6x + 5 at 2 is 12 + 5 = 17
    },
    {
      stageTest: 4,
      question: 'If two fair coins are tossed, what is the probability of getting at least one Head?',
      options: ['0.25 (25%)', '0.50 (50%)', '0.75 (75%)', '1.00 (100%)'],
      correct: 2, // 1 - 0.25 = 0.75
    },
  ];

  const handleSelectOption = (idx: number) => {
    const nextAnswers = [...answers, idx];
    setAnswers(nextAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Evaluate recommended starting stage
      let correctCount = 0;
      QUESTIONS.forEach((q, i) => {
        if (nextAnswers[i] === q.correct) correctCount++;
      });

      let stage: ModuleStage = 1;
      if (correctCount === 0 || correctCount === 1) {
        stage = 1; // Foundations
      } else if (correctCount === 2) {
        stage = 2; // Linear Algebra
      } else if (correctCount === 3) {
        stage = 3; // Multivariable Calculus
      } else {
        stage = 4; // Probability & ML Math
      }

      setRecommendedStage(stage);
      setIsFinished(true);
      confetti({ particleCount: 60, spread: 55 });
    }
  };

  const handleAcceptRecommendation = () => {
    onCompleteDiagnostic(recommendedStage);
    onClose();
  };

  const currentQ = QUESTIONS[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {!isFinished ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Diagnostic Assessment · Question {currentStep + 1} of {QUESTIONS.length}</span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white">
              {currentQ.question}
            </h3>

            <div className="space-y-2.5 pt-2">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className="w-full text-left p-3.5 rounded-lg border border-slate-800 bg-slate-950 hover:border-cyan-500 hover:bg-slate-850 text-xs sm:text-sm text-slate-200 transition-colors flex items-center justify-between"
                >
                  <span>{opt}</span>
                  <span className="font-mono text-xs text-slate-500">Option {String.fromCharCode(65 + idx)}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4 py-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Award className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-white">
              Diagnostic Complete!
            </h3>

            <p className="text-sm text-slate-300">
              Based on your responses, we recommend starting your learning journey at:
            </p>

            <div className="p-4 bg-slate-950 rounded-xl border border-indigo-900/50">
              <div className="text-xs text-cyan-400 font-mono uppercase tracking-wider font-semibold">
                Recommended Starting Path
              </div>
              <div className="text-lg font-bold text-white mt-1">
                Stage {recommendedStage}: {
                  recommendedStage === 1 ? 'Mathematical Foundations' :
                  recommendedStage === 2 ? 'Linear Algebra & Vectors' :
                  recommendedStage === 3 ? 'Multivariable Calculus & Gradients' :
                  'Probability & Machine Learning Math'
                }
              </div>
            </div>

            <button
              onClick={handleAcceptRecommendation}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-lg flex items-center justify-center gap-2"
            >
              <span>Begin at Stage {recommendedStage}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosticModal;
