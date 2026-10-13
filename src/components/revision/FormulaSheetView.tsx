import React, { useState } from 'react';
import { FORMULA_CARDS } from '../../data/formulaData';
import MathView from '../common/MathView';
import { Search, Layers, RotateCw, BookOpen, Sparkles, Filter, Code2 } from 'lucide-react';

interface FormulaSheetViewProps {
  onOpenCodeLab?: () => void;
}

export const FormulaSheetView: React.FC<FormulaSheetViewProps> = ({ onOpenCodeLab }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [studyMode, setStudyMode] = useState<'sheet' | 'flashcards'>('sheet');
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const topics = ['All', 'Linear Algebra', 'Calculus', 'Probability & Statistics', 'Optimization', 'Machine Learning'];

  const filteredCards = FORMULA_CARDS.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.aiUse.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = selectedTopic === 'All' || c.topic.includes(selectedTopic);
    return matchesSearch && matchesTopic;
  });

  const currentFlashcard = filteredCards[flashcardIndex] || filteredCards[0];

  const handleNextFlashcard = () => {
    setIsFlipped(false);
    setFlashcardIndex(prev => (prev + 1) % filteredCards.length);
  };

  const handlePrevFlashcard = () => {
    setIsFlipped(false);
    setFlashcardIndex(prev => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold mb-1">
              Mathematics Reference & Memory Bank
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              AI Mathematics Formula Sheet & Flashcards
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1">
              Search key formulas across linear algebra, calculus, and transformers with LaTeX definitions and ML applications.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {onOpenCodeLab && (
              <button
                onClick={onOpenCodeLab}
                className="px-3 py-1.5 rounded-lg bg-slate-950 border border-cyan-800/60 hover:border-cyan-500 text-cyan-300 text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>PyTorch & NumPy Lab</span>
              </button>
            )}
            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setStudyMode('sheet')}
                className={`px-3 py-1.5 rounded font-medium transition-colors ${
                  studyMode === 'sheet' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Formula Sheet
              </button>
              <button
                onClick={() => setStudyMode('flashcards')}
                className={`px-3 py-1.5 rounded font-medium transition-colors ${
                  studyMode === 'flashcards' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Flashcard Mode
              </button>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
            {topics.map(t => (
              <button
                key={t}
                onClick={() => {
                  setSelectedTopic(t);
                  setFlashcardIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-colors ${
                  selectedTopic === t
                    ? 'bg-slate-800 text-cyan-300 font-semibold border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="relative shrink-0 w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Filter formulas..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setFlashcardIndex(0);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* FLASHCARD STUDY MODE */}
      {studyMode === 'flashcards' && currentFlashcard && (
        <div className="max-w-xl mx-auto space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Card {flashcardIndex + 1} of {filteredCards.length}</span>
            <span>Topic: {currentFlashcard.topic}</span>
          </div>

          {/* Flashcard container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-8 min-h-[300px] flex flex-col justify-between cursor-pointer shadow-2xl transition-all select-none text-center"
          >
            <div>
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block mb-2">
                {currentFlashcard.name}
              </span>
              <div className="my-6">
                <MathView math={currentFlashcard.formula} display={true} className="text-xl text-white font-bold" />
              </div>
            </div>

            {isFlipped ? (
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-left space-y-2 animate-fadeIn">
                <div className="text-slate-300">
                  <span className="font-semibold text-white">Mathematical Meaning:</span> {currentFlashcard.meaning}
                </div>
                <div className="text-slate-300">
                  <span className="font-semibold text-cyan-400">AI / ML Use:</span> {currentFlashcard.aiUse}
                </div>
                <div className="text-slate-400 font-mono pt-1">
                  Example: {currentFlashcard.example}
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic flex items-center justify-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5" /> Click anywhere to flip and reveal explanation
              </div>
            )}
          </div>

          {/* Flashcard navigation controls */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={handlePrevFlashcard}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700"
            >
              Previous Card
            </button>
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              {isFlipped ? 'Hide Answer' : 'Reveal Answer'}
            </button>
            <button
              onClick={handleNextFlashcard}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg shadow"
            >
              Next Card
            </button>
          </div>
        </div>
      )}

      {/* FORMULA SHEET VIEW */}
      {studyMode === 'sheet' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCards.map(c => (
            <div
              key={c.id}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-xl p-5 shadow-sm space-y-3 transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <h3 className="font-bold text-white text-sm">{c.name}</h3>
                <span className="text-[11px] font-mono text-cyan-400">{c.topic}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-center">
                <MathView math={c.formula} display={true} className="text-base text-cyan-300" />
              </div>

              <div className="text-xs text-slate-300 space-y-1.5">
                <p>{c.meaning}</p>
                <div className="text-[11px] text-slate-400">
                  <span className="font-semibold text-indigo-300">AI Context: </span>
                  {c.aiUse}
                </div>
                <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
                  Concrete Example: {c.example}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormulaSheetView;
