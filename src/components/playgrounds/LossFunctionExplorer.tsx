import React, { useState } from 'react';
import MathView from '../common/MathView';
import { Target, Sliders, ShieldCheck } from 'lucide-react';

export const LossFunctionExplorer: React.FC = () => {
  const [errorVal, setErrorVal] = useState(2.0); // e = y_hat - y
  const [huberDelta, setHuberDelta] = useState(1.0);

  // Computations for current error
  const l2 = Math.pow(errorVal, 2);
  const l1 = Math.abs(errorVal);
  const huber = Math.abs(errorVal) <= huberDelta
    ? 0.5 * Math.pow(errorVal, 2)
    : huberDelta * (Math.abs(errorVal) - 0.5 * huberDelta);

  // Gradients
  const gradL2 = 2 * errorVal;
  const gradL1 = errorVal === 0 ? 0 : Math.sign(errorVal);
  const gradHuber = Math.abs(errorVal) <= huberDelta
    ? errorVal
    : huberDelta * Math.sign(errorVal);

  // SVG dimensions
  const svgW = 340;
  const svgH = 200;
  const minE = -4;
  const maxE = 4;
  const maxL = 16;

  const toSvgX = (e: number) => ((e - minE) / (maxE - minE)) * svgW;
  const toSvgY = (l: number) => svgH - 20 - (l / maxL) * (svgH - 40);

  // Curves
  const l2Points: string[] = [];
  const l1Points: string[] = [];
  const huberPoints: string[] = [];

  for (let i = 0; i <= 80; i++) {
    const e = minE + (i / 80) * (maxE - minE);
    const yL2 = Math.pow(e, 2);
    const yL1 = Math.abs(e);
    const yHuber = Math.abs(e) <= huberDelta
      ? 0.5 * Math.pow(e, 2)
      : huberDelta * (Math.abs(e) - 0.5 * huberDelta);

    l2Points.push(`${toSvgX(e)},${toSvgY(Math.min(maxL, yL2))}`);
    l1Points.push(`${toSvgX(e)},${toSvgY(Math.min(maxL, yL1))}`);
    huberPoints.push(`${toSvgX(e)},${toSvgY(Math.min(maxL, yHuber))}`);
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-400" />
            Loss Function Comparison & Gradient Dynamics
          </h3>
          <p className="text-xs text-slate-400">
            Compare how L2 (Squared), L1 (Absolute), and Huber Loss penalize prediction errors and outliers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* SVG Plot */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="bg-slate-950 rounded-lg p-2 border border-slate-800 shadow-inner w-full flex flex-col items-center">
            <svg width={svgW} height={svgH} className="overflow-visible select-none">
              {/* Axes */}
              <line x1={0} y1={toSvgY(0)} x2={svgW} y2={toSvgY(0)} stroke="#334155" strokeWidth="1" />
              <line x1={toSvgX(0)} y1={0} x2={toSvgX(0)} y2={svgH} stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />

              {/* L2 Curve */}
              <path d={`M ${l2Points.join(' L ')}`} fill="none" stroke="#6366f1" strokeWidth="2.5" />
              {/* L1 Curve */}
              <path d={`M ${l1Points.join(' L ')}`} fill="none" stroke="#10b981" strokeWidth="2.5" />
              {/* Huber Curve */}
              <path d={`M ${huberPoints.join(' L ')}`} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4 2" />

              {/* Current Error Indicator Markers */}
              <circle cx={toSvgX(errorVal)} cy={toSvgY(l2)} r="4.5" fill="#6366f1" stroke="#ffffff" strokeWidth="1" />
              <circle cx={toSvgX(errorVal)} cy={toSvgY(l1)} r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
              <circle cx={toSvgX(errorVal)} cy={toSvgY(huber)} r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
            </svg>

            <div className="flex items-center gap-5 text-[11px] text-slate-400 mt-2">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-indigo-500 inline-block" /> L2 Loss (e²)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-emerald-500 inline-block" /> L1 Loss (|e|)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-amber-500 border-dashed inline-block" /> Huber Loss
              </span>
            </div>
          </div>
        </div>

        {/* Sliders and Metrics */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 space-y-3">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span className="flex items-center gap-1"><Sliders className="w-3.5 h-3.5 text-indigo-400" /> Error (ŷ - y)</span>
                <span className="font-mono text-cyan-400 font-bold">{errorVal.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-4"
                max="4"
                step="0.1"
                value={errorVal}
                onChange={e => setErrorVal(parseFloat(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Huber Threshold (δ)</span>
                <span className="font-mono text-amber-400 font-bold">{huberDelta.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={huberDelta}
                onChange={e => setHuberDelta(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>

          {/* Metric Comparison Table */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-xs space-y-2">
            <div className="text-slate-400 uppercase tracking-wider font-mono">Loss & Gradient Comparison</div>
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-2 bg-indigo-950/30 border border-indigo-900/40 rounded">
                <span className="text-[10px] text-indigo-300 block">L2 (MSE)</span>
                <span className="text-white font-bold">{l2.toFixed(2)}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">∇: {gradL2.toFixed(1)}</span>
              </div>
              <div className="p-2 bg-emerald-950/30 border border-emerald-900/40 rounded">
                <span className="text-[10px] text-emerald-300 block">L1 (MAE)</span>
                <span className="text-white font-bold">{l1.toFixed(2)}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">∇: {gradL1.toFixed(1)}</span>
              </div>
              <div className="p-2 bg-amber-950/30 border border-amber-900/40 rounded">
                <span className="text-[10px] text-amber-300 block">Huber</span>
                <span className="text-white font-bold">{huber.toFixed(2)}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">∇: {gradHuber.toFixed(1)}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-xs text-slate-300">
            <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Why Huber is the Best of Both Worlds:
            </div>
            When error is small (|e| ≤ δ), Huber acts like smooth L2 (clean differentiable parabolic bottom). When error is huge (|e| &gt; δ), it transitions to linear L1, preventing outliers from blowing up gradients!
          </div>
        </div>
      </div>
    </div>
  );
};

export default LossFunctionExplorer;
