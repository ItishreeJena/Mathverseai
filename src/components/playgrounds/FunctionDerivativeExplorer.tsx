import React, { useState } from 'react';
import MathView from '../common/MathView';
import { TrendingUp, Sliders, Activity } from 'lucide-react';

export const FunctionDerivativeExplorer: React.FC = () => {
  const [funcType, setFuncType] = useState<'sigmoid' | 'relu' | 'tanh' | 'quadratic'>('sigmoid');
  const [x0, setX0] = useState(0.8);
  const [h, setH] = useState(0.5); // Finite difference step

  // SVG coordinate dimensions
  const width = 360;
  const height = 280;
  const minX = -4;
  const maxX = 4;
  const minY = -1.5;
  const maxY = 2.5;

  const toSvgX = (x: number) => ((x - minX) / (maxX - minX)) * width;
  const toSvgY = (y: number) => height - ((y - minY) / (maxY - minY)) * height;

  // Evaluation functions & exact derivatives
  const evaluate = (x: number) => {
    switch (funcType) {
      case 'sigmoid':
        return 1 / (1 + Math.exp(-x));
      case 'relu':
        return Math.max(0, x);
      case 'tanh':
        return Math.tanh(x);
      case 'quadratic':
        return 0.25 * x * x;
      default:
        return 0;
    }
  };

  const exactDerivative = (x: number) => {
    switch (funcType) {
      case 'sigmoid': {
        const s = evaluate(x);
        return s * (1 - s);
      }
      case 'relu':
        return x > 0 ? 1 : 0;
      case 'tanh': {
        const t = Math.tanh(x);
        return 1 - t * t;
      }
      case 'quadratic':
        return 0.5 * x;
      default:
        return 0;
    }
  };

  // Numerical secant slope: [f(x0 + h) - f(x0)] / h
  const fx0 = evaluate(x0);
  const fxh = evaluate(x0 + h);
  const secantSlope = (fxh - fx0) / h;
  const tangentSlope = exactDerivative(x0);

  // Generate SVG curve points
  const pointsCount = 100;
  const curvePoints: string[] = [];
  for (let i = 0; i <= pointsCount; i++) {
    const x = minX + (i / pointsCount) * (maxX - minX);
    const y = evaluate(x);
    curvePoints.push(`${toSvgX(x)},${toSvgY(y)}`);
  }
  const pathD = `M ${curvePoints.join(' L ')}`;

  // Tangent line segment from (x0 - 1.5) to (x0 + 1.5)
  const tanX1 = x0 - 1.5;
  const tanY1 = fx0 - tangentSlope * 1.5;
  const tanX2 = x0 + 1.5;
  const tanY2 = fx0 + tangentSlope * 1.5;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Function & Tangent Slope Explorer
          </h3>
          <p className="text-xs text-slate-400">
            Compare the true analytical tangent derivative with the secant approximation as step <span className="text-amber-400 font-mono">h → 0</span>.
          </p>
        </div>

        {/* Function selection tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          {(['sigmoid', 'relu', 'tanh', 'quadratic'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFuncType(f)}
              className={`px-2.5 py-1 rounded font-medium transition-colors uppercase text-[11px] ${
                funcType === f
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* SVG Curve Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="bg-slate-950 rounded-lg p-2 border border-slate-800 shadow-inner">
            <svg width={width} height={height} className="overflow-visible select-none">
              {/* Axes */}
              <line
                x1={toSvgX(minX)}
                y1={toSvgY(0)}
                x2={toSvgX(maxX)}
                y2={toSvgY(0)}
                stroke="#475569"
                strokeWidth="1.2"
              />
              <line
                x1={toSvgX(0)}
                y1={toSvgY(minY)}
                x2={toSvgX(0)}
                y2={toSvgY(maxY)}
                stroke="#475569"
                strokeWidth="1.2"
              />

              {/* Grid ticks */}
              {[-3, -2, -1, 1, 2, 3].map(tx => (
                <text key={tx} x={toSvgX(tx)} y={toSvgY(0) + 12} fill="#64748b" fontSize="9" textAnchor="middle">
                  {tx}
                </text>
              ))}

              {/* Function curve */}
              <path d={pathD} fill="none" stroke="#38bdf8" strokeWidth="2.5" />

              {/* Secant line between (x0, f(x0)) and (x0+h, f(x0+h)) */}
              <line
                x1={toSvgX(x0)}
                y1={toSvgY(fx0)}
                x2={toSvgX(x0 + h)}
                y2={toSvgY(fxh)}
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />

              {/* Tangent line */}
              <line
                x1={toSvgX(tanX1)}
                y1={toSvgY(tanY1)}
                x2={toSvgX(tanX2)}
                y2={toSvgY(tanY2)}
                stroke="#10b981"
                strokeWidth="2"
              />

              {/* Evaluation point (x0, f(x0)) */}
              <circle cx={toSvgX(x0)} cy={toSvgY(fx0)} r="5" fill="#10b981" stroke="#064e3b" strokeWidth="2" />

              {/* Secant second point (x0+h, f(x0+h)) */}
              <circle cx={toSvgX(x0 + h)} cy={toSvgY(fxh)} r="4" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="flex items-center gap-6 mt-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-sky-400 rounded-full inline-block" /> Function Curve f(x)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-500 rounded-full inline-block" /> Tangent Line f'(x₀)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-amber-400 border-dashed inline-block" /> Secant Line Δf/Δx
            </span>
          </div>
        </div>

        {/* Sliders & Derivative Metrics */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 space-y-3">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span className="flex items-center gap-1"><Sliders className="w-3.5 h-3.5 text-emerald-400" /> Evaluation Point x₀</span>
                <span className="font-mono text-emerald-400 font-semibold">{x0.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-3"
                max="3"
                step="0.1"
                value={x0}
                onChange={e => setX0(parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Secant Interval Step h</span>
                <span className="font-mono text-amber-400 font-semibold">{h.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="1.5"
                step="0.05"
                value={h}
                onChange={e => setH(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
              <p className="text-[11px] text-slate-400 mt-0.5">
                Notice: as h approaches 0, the secant slope converges directly onto the exact tangent slope!
              </p>
            </div>
          </div>

          {/* Mathematical Comparison */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-xs space-y-2">
            <div className="text-slate-400 uppercase tracking-wider font-mono">Slopes at x₀ = {x0.toFixed(2)}</div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800">
              <span className="text-slate-300">Exact Derivative f'(x₀):</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">{tangentSlope.toFixed(4)}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800">
              <span className="text-slate-300">Secant Slope [f(x₀+h) - f(x₀)] / h:</span>
              <span className="font-mono font-bold text-amber-400 text-sm">{secantSlope.toFixed(4)}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">Approximation Error:</span>
              <span className="font-mono text-slate-300">{Math.abs(tangentSlope - secantSlope).toFixed(4)}</span>
            </div>
          </div>

          {/* AI Activation Function Insight */}
          <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-lg p-3 text-xs text-emerald-200">
            <div className="font-semibold mb-1 flex items-center gap-1.5 text-emerald-300">
              <Activity className="w-3.5 h-3.5" />
              Activation Function Derivative Insight:
            </div>
            {funcType === 'sigmoid' && (
              <p>
                Sigmoid max slope is only 0.25 at x=0. When |x| &gt; 2.5, f'(x) drops below 0.05. In deep networks, this causes the <b>Vanishing Gradient problem</b>!
              </p>
            )}
            {funcType === 'relu' && (
              <p>
                ReLU derivative is exactly 1.0 for all positive inputs x &gt; 0, which completely eliminates gradient vanishing in deep networks!
              </p>
            )}
            {funcType === 'tanh' && (
              <p>
                Tanh derivative is zero-centered and ranges up to 1.0 at x=0, providing stronger gradient flow than Sigmoid.
              </p>
            )}
            {funcType === 'quadratic' && (
              <p>
                Quadratic bowl L(w) = 0.25 w² has linear gradient 0.5w, showing how distance from the minimum directly determines step magnitude.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunctionDerivativeExplorer;
