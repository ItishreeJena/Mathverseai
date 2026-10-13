import React, { useState, useRef, useEffect } from 'react';
import MathView from '../common/MathView';
import { Bot, Send, X, Sparkles, RefreshCw, MessageSquare } from 'lucide-react';

interface AiTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLessonTitle?: string;
  currentTopic?: string;
  currentFormula?: string;
  initialPrompt?: string;
}

interface Message {
  role: 'user' | 'tutor';
  text: string;
  source?: 'gemini' | 'offline' | 'fallback';
}

export const AiTutorModal: React.FC<AiTutorModalProps> = ({
  isOpen,
  onClose,
  currentLessonTitle = 'Mathematics for AI',
  currentTopic = 'Linear Algebra & Calculus',
  currentFormula = '',
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'tutor',
      text: `Hello! I am your MathVerse AI Tutor. I can explain the algebraic intuition behind equations, break down multi-step derivations, or provide practice questions tailored to **${currentLessonTitle}**. What would you like to explore?`,
      source: 'offline',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text || loading) return;

    const userMsg: Message = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputVal('');
    setLoading(true);

    try {
      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          lessonTitle: currentLessonTitle,
          topic: currentTopic,
          currentFormula,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();
      setMessages(prev => [
        ...prev,
        {
          role: 'tutor',
          text: data.reply || 'No response generated.',
          source: data.source || 'gemini',
        },
      ]);
    } catch (err: any) {
      console.warn('Tutor endpoint fallback:', err);
      // Academic deterministic fallback
      setMessages(prev => [
        ...prev,
        {
          role: 'tutor',
          text: `**Pedagogical Guidance on ${currentLessonTitle}**:\n\nIn machine learning, this concept governs stability and gradient flow.\n- **Intuitive rule**: Treat equations dimensionally first (verify matrix shapes and units).\n- **Algebraic check**: Confirm that derivatives do not vanish as parameters scale.\n\nWhat specific variable or calculation step in this lesson should we walk through step-by-step?`,
          source: 'offline',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    `Why is this concept crucial in deep learning?`,
    `Explain the intuition using a simple real-world analogy.`,
    `Give me a step-by-step example problem.`,
    `What is the most common mistake students make with this formula?`,
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full h-[620px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-cyan-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                MathVerse AI Tutor
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  Academic Companion
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 truncate max-w-sm">
                Context: {currentLessonTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl p-3.5 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                {m.text}
              </div>

              {m.role === 'tutor' && m.source && (
                <span className="text-[10px] text-slate-500 mt-1 font-mono pl-1">
                  {m.source === 'gemini' ? 'Generated by Gemini 3.8' : 'Academic pedagogical tutor'}
                </span>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2 font-mono">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>Analyzing mathematical derivation...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-4 py-2 bg-slate-950/70 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-slate-500 shrink-0 font-mono">Quick:</span>
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              disabled={loading}
              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 shrink-0 truncate max-w-[200px]"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask about this formula, derivation steps, or ML applications..."
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            disabled={loading}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
          />
          <button
            type="submit"
            disabled={loading || !inputVal.trim()}
            className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg transition-colors shadow"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiTutorModal;
