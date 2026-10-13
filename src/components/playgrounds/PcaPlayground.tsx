import React, { useState, useMemo } from 'react';
import MathView from '../common/MathView';
import { Layers, Sliders, CheckCircle2 } from 'lucide-react';

export const PcaPlayground: React.FC = () => {
  const [dataAngle, setDataAngle] = useState(35); // in degrees: underlying dataset orientation
  const [projAngle, setProjAngle] = useState(35); // user projection axis angle in degrees
  const [spreadRatio, setSpreadRatio] = useState(3.5); // ratio of major to minor axis spread

  // Generate deterministic 2D data points along an ellipse
  const points = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    const rad = (dataAngle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    // 25 synthetic points
    const baseCoords = [
      [-2.5, 0.2], [-2.0, -0.3], [-1.8, 0.4], [-1.5, -0.1], [-1.2, 0.3],
      [-1.0, -0.4], [-0.8, 0.2], [-0.5, -0.2], [-0.3, 0.1], [0.0, 0.0],
      [0.2, -0.3], [0.4, 0.3], [0.7, -0.1], [1.0, 0.4], [1.2, -0.2],
      [1.5, 0.3], [1.8, -0.3], [2.0, 0.2], [2.3, -0.1], [2.6, 0.1],
      [-0.4, 0.5], [0.5, -0.5], [-1.1, -0.6], [1.3, 0.6], [-0.1, -0.4]
    ];

    for (const [u, v] of baseCoords) {
      const uScaled = u;
      const vScaled = v / (spreadRatio / 2);
      // Rotate by dataAngle
      const x = uScaled * cos - vScaled * sin;
      const y = uScaled * sin + vScaled * cos;
      pts.push({ x, y });
    }
    return pts;
  }, [dataAngle, spreadRatio]);

  // Project points onto user axis with unit vector u = [cos(projAngle), sin(projAngle)]
  const pRad = (projAngle * Math.PI) / 180;
  const ux = Math.cos(pRad);
  const uy = Math.sin(pRad);

  // Projected values: dot product of each point with u
  const projectedScalars = points.map(p => p.x * ux + p.y * uy);
  const totalVariance = points.reduce((acc, p) => acc + (p.x * p.x + p.y * p.y), 0) / points.length;
  const projectedVariance = projectedScalars.reduce((acc, s) => acc + s * s, 0) / points.length;
  const variancePreserved = Math.min(100, Math.round((projectedVariance / (totalVariance || 1)) * 100));
  const informationLost = 100 - variancePreserved;

  // SVG coordinate transform
  const svgSize = 320;
  const origin = svgSize / 2;
  const scale = 40;

  const toSvgX = (x: number) => origin + x * scale;
  const toSvgY = (y: number) => origin - y * scale;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            PCA Dimensionality Reduction Playground
          </h3>
          <p className="text-xs text-slate-400">
            Rotate the 1D projection axis to discover the 1st Principal Component that maximizes preserved variance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* SVG Visualization */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="bg-slate-950 rounded-lg p-2 border border-slate-800 shadow-inner w-full flex flex-col items-center">
            <svg width={svgSize} height={svgSize} className="overflow-visible select-none">
              {/* Axes */}
              <line x1={0} y1={origin} x2={svgSize} y2={origin} stroke="#334155" strokeWidth="1" />
              <line x1={origin} y1={0} x2={origin} y2={svgSize} stroke="#334155" strokeWidth="1" />

              {/* User Projection Line */}
              <line
                x1={toSvgX(-3.8 * ux)}
                y1={toSvgY(-3.8 * uy)}
                x2={toSvgX(3.8 * ux)}
                y2={toSvgY(3.8 * uy)}
                stroke="#a855f7"
                strokeWidth="2"
              />

              {/* Orthogonal projection drops & projected points */}
              {points.map((p, idx) => {
                const s = projectedScalars[idx];
                const projX = s * ux;
                const projY = s * uy;

                return (
                  <g key={idx}>
                    <line
                      x1={toSvgX(p.x)}
                      y1={toSvgY(p.y)}
                      x2={toSvgX(projX)}
                      y2={toSvgY(projY)}
                      stroke="#64748b"
                      strokeWidth="0.8"
                      strokeDasharray="2 2"
                      opacity="0.6"
                    />
                    {/* Projected 1D dot */}
                    <circle
                      cx={toSvgX(projX)}
                      cy={toSvgY(projY)}
                      r="2.5"
                      fill="#c084fc"
                    />
                    {/* Original 2D point */}
                    <circle
                      cx={toSvgX(p.x)}
                      cy={toSvgY(p.y)}
                      r="3.5"
                      fill="#38bdf8"
                      opacity="0.8"
                    />
                  </g>
                );
              })}
            </svg>

            <div className="flex items-center gap-6 text-[11px] text-slate-400 mt-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-sky-400 rounded-full inline-block" /> Original 2D Data
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-purple-500 inline-block" /> Projection Line (1D Axis)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-purple-300 rounded-full inline-block" /> Projected Points
              </span>
            </div>
          </div>
        </div>

        {/* Controls & Metrics */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 space-y-3">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span className="flex items-center gap-1"><Sliders className="w-3.5 h-3.5 text-purple-400" /> Projection Axis Angle</span>
                <span className="font-mono text-purple-400 font-bold">{projAngle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                value={projAngle}
                onChange={e => setProjAngle(parseInt(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>True Data Major Axis Angle</span>
                <span className="font-mono text-cyan-400 font-bold">{dataAngle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="180"
                value={dataAngle}
                onChange={e => setDataAngle(parseInt(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>
          </div>

          {/* Variance Explained Card */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-xs space-y-2">
            <div className="text-slate-400 uppercase tracking-wider font-mono">Preserved Variance (Eigenvalue)</div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800">
              <span className="text-slate-300">Variance Retained:</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">{variancePreserved}%</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-300">Information Lost:</span>
              <span className="font-mono font-bold text-rose-400 text-sm">{informationLost}%</span>
            </div>

            {/* Visual bar */}
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex border border-slate-800 mt-2">
              <div style={{ width: `${variancePreserved}%` }} className="bg-purple-500 h-full transition-all" />
              <div style={{ width: `${informationLost}%` }} className="bg-rose-500/80 h-full transition-all" />
            </div>
          </div>

          <div className="bg-purple-950/20 border border-purple-900/40 rounded-lg p-3 text-xs text-purple-200">
            <div className="font-semibold text-purple-300 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Principal Component Discovery:
            </div>
            When your projection axis matches the data angle ({dataAngle}°), variance retention peaks at its absolute maximum! In PCA, this axis corresponds to the eigenvector of the covariance matrix with the largest eigenvalue λ₁.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PcaPlayground;
