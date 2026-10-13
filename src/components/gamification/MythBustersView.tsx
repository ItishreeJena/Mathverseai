import React, { useState } from 'react';
import { MYTH_BUSTERS } from '../../data/mythBustersData';
import { ShieldAlert, AlertTriangle, CheckCircle, Search, HelpCircle } from 'lucide-react';

export const MythBustersView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = MYTH_BUSTERS.filter(m =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.trap.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.reality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-rose-400 uppercase tracking-wider font-semibold mb-1">
              The AI Mathematics Mistake Collection
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Myth Busters: Why Common Wrong Answers Fail
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1">
              Explore the most dangerous mathematical traps and misconceptions that break machine learning pipelines and cause training crashes.
            </p>
          </div>

          <div className="relative shrink-0 w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search math traps..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map(item => (
          <div
            key={item.id}
            className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-xl p-5 shadow-sm space-y-3 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono text-rose-400 uppercase tracking-wide font-semibold block mb-0.5">
                  Trap: {item.trap}
                </span>
                <h3 className="text-base font-bold text-white">
                  {item.title}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* The Myth */}
              <div className="p-3 bg-rose-950/20 border border-rose-900/30 rounded-lg">
                <span className="text-rose-400 font-semibold flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Common Misconception (The Myth)
                </span>
                <p className="text-slate-300 leading-relaxed">{item.myth}</p>
              </div>

              {/* The Mathematical Reality */}
              <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 rounded-lg">
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5 mb-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Mathematical Reality
                </span>
                <p className="text-slate-300 leading-relaxed">{item.reality}</p>
              </div>
            </div>

            {/* AI Consequence */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-xs">
              <span className="text-slate-400 font-mono block mb-0.5">
                Machine Learning Impact & Consequence:
              </span>
              <p className="text-indigo-300 leading-relaxed">{item.aiImpact}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MythBustersView;
