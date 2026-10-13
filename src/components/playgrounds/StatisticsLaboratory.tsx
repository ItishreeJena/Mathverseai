import React, { useState } from 'react';
import MathView from '../common/MathView';
import { BarChart3, Plus, Trash2, AlertTriangle } from 'lucide-react';

export const StatisticsLaboratory: React.FC = () => {
  const [dataPoints, setDataPoints] = useState<number[]>([12, 14, 15, 16, 17, 18, 19, 21, 23, 25]);
  const [newVal, setNewVal] = useState('');
  const [outlierVal, setOutlierVal] = useState(85);
  const [hasOutlier, setHasOutlier] = useState(false);

  // Active data taking outlier toggle into account
  const activeData = hasOutlier ? [...dataPoints, outlierVal] : [...dataPoints];
  const sorted = [...activeData].sort((a, b) => a - b);
  const n = sorted.length;

  // Statistics computations
  const mean = sorted.reduce((acc, v) => acc + v, 0) / (n || 1);
  
  const median = n % 2 === 1 
    ? sorted[Math.floor(n / 2)] 
    : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;

  const variance = n > 1 
    ? sorted.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (n - 1) 
    : 0;
  const stdDev = Math.sqrt(variance);

  // Quartiles for Box Plot
  const q1 = sorted[Math.floor(n * 0.25)];
  const q3 = sorted[Math.floor(n * 0.75)];
  const iqr = q3 - q1;
  const lowerFence = q1 - 1.5 * iqr;
  const upperFence = q3 + 1.5 * iqr;

  // Box plot SVG mapping (range 0 to 100)
  const svgW = 340;
  const svgH = 140;
  const toSvgX = (val: number) => 20 + (Math.max(0, Math.min(100, val)) / 100) * (svgW - 40);

  const addPoint = () => {
    const num = parseFloat(newVal);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      setDataPoints([...dataPoints, num]);
      setNewVal('');
    }
  };

  const removePoint = (index: number) => {
    if (dataPoints.length > 3) {
      setDataPoints(dataPoints.filter((_, i) => i !== index));
    }
  };

  const setPreset = (type: 'normal' | 'skewed' | 'uniform') => {
    setHasOutlier(false);
    if (type === 'normal') {
      setDataPoints([14, 16, 18, 19, 20, 20, 21, 22, 24, 26]);
    } else if (type === 'skewed') {
      setDataPoints([5, 6, 7, 8, 9, 10, 14, 20, 32, 48]);
    } else if (type === 'uniform') {
      setDataPoints([5, 10, 15, 20, 25, 30, 35, 40, 45, 50]);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-400" />
            Statistics & Outlier Sensitivity Laboratory
          </h3>
          <p className="text-xs text-slate-400">
            Inject an extreme outlier anomaly to observe how the Mean distorts while the Median stays robust.
          </p>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setPreset('normal')}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
          >
            Bell-Shaped
          </button>
          <button
            onClick={() => setPreset('skewed')}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
          >
            Right-Skewed
          </button>
          <button
            onClick={() => setPreset('uniform')}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
          >
            Uniform Spread
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Box Plot & Strip Plot Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 shadow-inner w-full flex flex-col items-center">
            <div className="text-xs text-slate-400 mb-2 font-mono flex items-center justify-between w-full">
              <span>Interactive Box & Whisker Plot</span>
              <span className="text-[11px] text-teal-400 font-sans">IQR: {iqr.toFixed(1)}</span>
            </div>

            <svg width={svgW} height={svgH} className="overflow-visible select-none">
              {/* Scale Axis Line */}
              <line x1={20} y1={110} x2={svgW - 20} y2={110} stroke="#334155" strokeWidth="1" />
              {[0, 20, 40, 60, 80, 100].map(val => (
                <g key={val}>
                  <line x1={toSvgX(val)} y1={107} x2={toSvgX(val)} y2={113} stroke="#64748b" strokeWidth="1" />
                  <text x={toSvgX(val)} y={125} fill="#64748b" fontSize="9" textAnchor="middle" className="font-mono">
                    {val}
                  </text>
                </g>
              ))}

              {/* Whiskers (Lower fence to Q1, Q3 to Upper fence) */}
              <line
                x1={toSvgX(Math.max(sorted[0], lowerFence))}
                y1={50}
                x2={toSvgX(q1)}
                y2={50}
                stroke="#94a3b8"
                strokeWidth="1.5"
              />
              <line
                x1={toSvgX(q3)}
                y1={50}
                x2={toSvgX(Math.min(sorted[sorted.length - 1], upperFence))}
                y2={50}
                stroke="#94a3b8"
                strokeWidth="1.5"
              />

              {/* Whisker End Caps */}
              <line
                x1={toSvgX(Math.max(sorted[0], lowerFence))}
                y1={42}
                x2={toSvgX(Math.max(sorted[0], lowerFence))}
                y2={58}
                stroke="#94a3b8"
                strokeWidth="1.5"
              />
              <line
                x1={toSvgX(Math.min(sorted[sorted.length - 1], upperFence))}
                y1={42}
                x2={toSvgX(Math.min(sorted[sorted.length - 1], upperFence))}
                y2={58}
                stroke="#94a3b8"
                strokeWidth="1.5"
              />

              {/* IQR Box (Q1 to Q3) */}
              <rect
                x={toSvgX(q1)}
                y={32}
                width={Math.max(2, toSvgX(q3) - toSvgX(q1))}
                height={36}
                fill="#0d9488"
                fillOpacity="0.25"
                stroke="#14b8a6"
                strokeWidth="1.5"
                rx="2"
              />

              {/* Median Line inside box */}
              <line
                x1={toSvgX(median)}
                y1={32}
                x2={toSvgX(median)}
                y2={68}
                stroke="#2dd4bf"
                strokeWidth="2.5"
              />

              {/* Mean marker (Diamond) */}
              <polygon
                points={`${toSvgX(mean)},24 ${toSvgX(mean) + 4},28 ${toSvgX(mean)},32 ${toSvgX(mean) - 4},28`}
                fill="#f59e0b"
              />

              {/* Data points strip dots */}
              {sorted.map((val, idx) => {
                const isOutlier = val < lowerFence || val > upperFence;
                return (
                  <circle
                    key={idx}
                    cx={toSvgX(val)}
                    cy={85}
                    r={isOutlier ? 4.5 : 3}
                    fill={isOutlier ? '#ef4444' : '#38bdf8'}
                    stroke={isOutlier ? '#ffffff' : 'none'}
                    strokeWidth={isOutlier ? 1 : 0}
                    opacity="0.8"
                  />
                );
              })}
            </svg>

            <div className="flex items-center gap-5 text-[11px] text-slate-400 mt-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-teal-400 inline-block rounded-sm" /> Median ({median.toFixed(1)})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-amber-400 inline-block transform rotate-45" /> Mean ({mean.toFixed(1)})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-rose-500 rounded-full inline-block" /> Flagged Outliers
              </span>
            </div>
          </div>

          {/* Outlier Injection Control */}
          <div className="w-full mt-3 p-3 bg-slate-950/70 border border-slate-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={hasOutlier}
                  onChange={e => setHasOutlier(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-0"
                />
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Inject Sensor Outlier Anomaly
              </label>
              {hasOutlier && (
                <span className="font-mono text-xs font-bold text-rose-400">Value: {outlierVal}</span>
              )}
            </div>

            {hasOutlier && (
              <input
                type="range"
                min="50"
                max="100"
                value={outlierVal}
                onChange={e => setOutlierVal(parseFloat(e.target.value))}
                className="w-full accent-rose-500"
              />
            )}
          </div>
        </div>

        {/* Live Metrics Table */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-mono">Summary Statistics</div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-amber-400 block text-[11px]">Mean (x̄):</span>
                <span className="text-white text-base font-bold">{mean.toFixed(2)}</span>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-teal-400 block text-[11px]">Median (50%):</span>
                <span className="text-white text-base font-bold">{median.toFixed(2)}</span>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Std Dev (s):</span>
                <span className="text-slate-200 text-sm font-bold">{stdDev.toFixed(2)}</span>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Variance (s²):</span>
                <span className="text-slate-200 text-sm font-bold">{variance.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Outlier Impact Comparison */}
          {hasOutlier && (
            <div className="bg-amber-950/30 border border-amber-800/40 rounded-lg p-3 text-xs text-amber-200">
              <div className="font-semibold mb-1 flex items-center gap-1 text-amber-300">
                <AlertTriangle className="w-3.5 h-3.5" />
                Demonstration of Outlier Distortion:
              </div>
              <p>
                The injected outlier ({outlierVal}) pulled the Mean up significantly, while the Median barely budged! This is why Machine Learning models using L2/MSE loss are pulled astray by dirty data, whereas models using L1/MAE loss resist outliers.
              </p>
            </div>
          )}

          {/* Quick Data Points Editor */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
            <div className="text-xs text-slate-400 mb-2 font-mono">Active Sample Points ({activeData.length})</div>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
              {dataPoints.map((pt, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-xs font-mono text-slate-300 flex items-center gap-1"
                >
                  {pt}
                  <button
                    onClick={() => removePoint(i)}
                    className="text-slate-500 hover:text-rose-400 ml-0.5"
                    title="Remove point"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 mt-2">
              <input
                type="number"
                placeholder="Add value (0-100)"
                value={newVal}
                onChange={e => setNewVal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addPoint()}
                className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 w-36 font-mono focus:outline-none focus:border-teal-500"
              />
              <button
                onClick={addPoint}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded border border-slate-700 font-medium flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsLaboratory;
