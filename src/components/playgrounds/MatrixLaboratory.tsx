import React, { useState } from 'react';
import MathView from '../common/MathView';
import { Grid, Sparkles, RefreshCw, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MatrixLaboratoryProps {
  onCompleteChallenge?: () => void;
}

export const MatrixLaboratory: React.FC<MatrixLaboratoryProps> = ({ onCompleteChallenge }) => {
  // 2x2 matrix: [[a, b], [c, d]]
  const [a, setA] = useState(1);
  const [b, setB] = useState(0.5);
  const [c, setC] = useState(0);
  const [d, setD] = useState(1);

  const [challengeMode, setChallengeMode] = useState(false);
  const [targetDet, setTargetDet] = useState(-1);
  const [challengeSuccess, setChallengeSuccess] = useState(false);

  // SVG layout
  const size = 320;
  const origin = size / 2;
  const scale = 36; // pixels per math unit

  const toSvgX = (x: number) => origin + x * scale;
  const toSvgY = (y: number) => origin - y * scale;

  // Transform point (x, y) through matrix [[a, b], [c, d]]
  const transform = (x: number, y: number) => {
    return {
      x: a * x + b * y,
      y: c * x + d * y,
    };
  };

  // Determinant & Trace
  const det = a * d - b * c;
  const trace = a + d;

  // Eigenvalues: roots of λ^2 - trace*λ + det = 0
  const discriminant = trace * trace - 4 * det;
  let eigenText = '';
  if (discriminant >= 0) {
    const λ1 = ((trace + Math.sqrt(discriminant)) / 2).toFixed(2);
    const λ2 = ((trace - Math.sqrt(discriminant)) / 2).toFixed(2);
    eigenText = `λ₁ = ${λ1}, λ₂ = ${λ2}`;
  } else {
    eigenText = 'Complex eigenvalues (rotational component)';
  }

  // Standard unit square vertices: (0,0), (1,0), (1,1), (0,1)
  const p0 = transform(0, 0);
  const p1 = transform(1, 0);
  const p2 = transform(1, 1);
  const p3 = transform(0, 1);

  // Transformed basis vectors: i-hat = [a, c], j-hat = [b, d]
  const iHat = { x: a, y: c };
  const jHat = { x: b, y: d };

  // Presets
  const setPreset = (presetA: number, presetB: number, presetC: number, presetD: number) => {
    setA(presetA);
    setB(presetB);
    setC(presetC);
    setD(presetD);
  };

  const checkChallenge = () => {
    if (Math.abs(det - targetDet) < 0.1) {
      setChallengeSuccess(true);
      confetti({ particleCount: 50, spread: 60 });
      if (onCompleteChallenge) onCompleteChallenge();
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Grid className="w-5 h-5 text-indigo-400" />
            2x2 Matrix Laboratory & Space Warping
          </h3>
          <p className="text-xs text-slate-400">
            Enter matrix values to watch the standard basis vectors <span className="text-cyan-400 font-semibold">î</span> and <span className="text-pink-400 font-semibold">ĵ</span> deform 2D space.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setChallengeMode(!challengeMode);
              setChallengeSuccess(false);
              setTargetDet(-1);
            }}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
              challengeMode
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {challengeMode ? 'Exit Architect Mission' : 'Mission: Matrix Architect'}
          </button>
        </div>
      </div>

      {challengeMode && (
        <div className="mb-4 p-3 rounded-lg border bg-amber-950/20 border-amber-500/30 text-xs text-amber-200 flex items-center justify-between">
          <div>
            <b>Mission Goal:</b> Configure matrix values so the determinant is reflection value <b>det(A) = -1.0</b> (inverts spatial orientation).
            {challengeSuccess && <span className="ml-2 text-emerald-400 font-bold">Solved! (+50 XP)</span>}
          </div>
          <button
            onClick={checkChallenge}
            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-semibold"
          >
            Verify Solution
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* SVG Visualization */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="bg-slate-950 rounded-lg p-2 border border-slate-800 shadow-inner">
            <svg width={size} height={size} className="overflow-visible select-none">
              <defs>
                <marker id="arrow-ihat" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#06b6d4" />
                </marker>
                <marker id="arrow-jhat" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#ec4899" />
                </marker>
              </defs>

              {/* Grid lines */}
              {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map(i => (
                <React.Fragment key={i}>
                  <line
                    x1={toSvgX(i)}
                    y1={0}
                    x2={toSvgX(i)}
                    y2={size}
                    stroke={i === 0 ? '#475569' : '#1e293b'}
                    strokeWidth={i === 0 ? 1.5 : 0.75}
                  />
                  <line
                    x1={0}
                    y1={toSvgY(i)}
                    x2={size}
                    y2={toSvgY(i)}
                    stroke={i === 0 ? '#475569' : '#1e293b'}
                    strokeWidth={i === 0 ? 1.5 : 0.75}
                  />
                </React.Fragment>
              ))}

              {/* Transformed unit square (quadrilateral) */}
              <polygon
                points={`${toSvgX(p0.x)},${toSvgY(p0.y)} ${toSvgX(p1.x)},${toSvgY(p1.y)} ${toSvgX(p2.x)},${toSvgY(p2.y)} ${toSvgX(p3.x)},${toSvgY(p3.y)}`}
                fill={det === 0 ? '#ef4444' : det < 0 ? '#8b5cf6' : '#3b82f6'}
                fillOpacity="0.25"
                stroke={det === 0 ? '#ef4444' : det < 0 ? '#a855f7' : '#60a5fa'}
                strokeWidth="1.5"
                strokeDasharray={det < 0 ? '4 3' : 'none'}
              />

              {/* Transformed i-hat basis vector (column 1) */}
              <line
                x1={origin}
                y1={origin}
                x2={toSvgX(iHat.x)}
                y2={toSvgY(iHat.y)}
                stroke="#06b6d4"
                strokeWidth="2.5"
                markerEnd="url(#arrow-ihat)"
              />

              {/* Transformed j-hat basis vector (column 2) */}
              <line
                x1={origin}
                y1={origin}
                x2={toSvgX(jHat.x)}
                y2={toSvgY(jHat.y)}
                stroke="#ec4899"
                strokeWidth="2.5"
                markerEnd="url(#arrow-jhat)"
              />

              {/* Basis vector labels */}
              <text x={toSvgX(iHat.x) + 5} y={toSvgY(iHat.y) - 5} fill="#06b6d4" fontSize="11" fontWeight="bold">
                î [{a}, {c}]
              </text>
              <text x={toSvgX(jHat.x) + 5} y={toSvgY(jHat.y) - 5} fill="#f472b6" fontSize="11" fontWeight="bold">
                ĵ [{b}, {d}]
              </text>
            </svg>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3 justify-center text-xs">
            <button
              onClick={() => setPreset(1, 0, 0, 1)}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
            >
              Identity
            </button>
            <button
              onClick={() => setPreset(0, -1, 1, 0)}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
            >
              Rotate 90°
            </button>
            <button
              onClick={() => setPreset(1, 1, 0, 1)}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
            >
              Shear X
            </button>
            <button
              onClick={() => setPreset(1.5, 0, 0, 1.5)}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
            >
              Scale 1.5x
            </button>
            <button
              onClick={() => setPreset(-1, 0, 0, 1)}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
            >
              Reflect Y
            </button>
            <button
              onClick={() => setPreset(1, 2, 2, 4)}
              className="px-2 py-1 bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 rounded border border-rose-800/40"
            >
              Collapse (det=0)
            </button>
          </div>
        </div>

        {/* Matrix Controls & Computations */}
        <div className="lg:col-span-6 space-y-3">
          {/* 2x2 Matrix Input Grid */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-mono flex items-center justify-between">
              <span>Matrix Entries A = [[a, b], [c, d]]</span>
              <button
                onClick={() => setPreset(1, 0, 0, 1)}
                className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto py-1">
              <div>
                <label className="text-[11px] text-cyan-400 block mb-1 font-mono">a (î_x)</label>
                <input
                  type="number"
                  step="0.5"
                  value={a}
                  onChange={e => setA(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-center text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-pink-400 block mb-1 font-mono">b (ĵ_x)</label>
                <input
                  type="number"
                  step="0.5"
                  value={b}
                  onChange={e => setB(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-center text-sm font-mono text-pink-300 focus:outline-none focus:border-pink-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-cyan-400 block mb-1 font-mono">c (î_y)</label>
                <input
                  type="number"
                  step="0.5"
                  value={c}
                  onChange={e => setC(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-center text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-[11px] text-pink-400 block mb-1 font-mono">d (ĵ_y)</label>
                <input
                  type="number"
                  step="0.5"
                  value={d}
                  onChange={e => setD(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-center text-sm font-mono text-pink-300 focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>
          </div>

          {/* Determinant & Geometric Meaning */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-mono">Determinant & Area Scaling</div>
            <div className="text-sm font-mono text-emerald-400">
              <MathView math={`\\det(A) = (${a})(${d}) - (${b})(${c}) = ${det.toFixed(2)}`} />
            </div>

            <div className="mt-2 text-xs text-slate-300 p-2 rounded bg-slate-900/60 border border-slate-800">
              {det === 0 ? (
                <span className="text-rose-400 font-semibold">
                  Singular Matrix (det = 0): 2D space has collapsed into a 1D line. Information is permanently lost; non-invertible!
                </span>
              ) : det < 0 ? (
                <span className="text-violet-400 font-semibold">
                  Orientation Inverted (det &lt; 0): The plane was flipped over like a pancake (reflection). Area is scaled by {Math.abs(det).toFixed(2)}x.
                </span>
              ) : (
                <span className="text-emerald-400 font-semibold">
                  Preserves Orientation (det &gt; 0): Area of any 2D shape scales by exactly {det.toFixed(2)}x.
                </span>
              )}
            </div>
          </div>

          {/* Eigendecomposition Info */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-xs">
            <div className="text-slate-400 uppercase tracking-wider mb-1 font-mono flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Spectral Properties
            </div>
            <div className="flex justify-between text-slate-200 mt-1">
              <span>Trace (Tr = a + d): <b className="font-mono text-cyan-300">{trace.toFixed(2)}</b></span>
              <span>Eigenvalues: <b className="font-mono text-amber-300">{eigenText}</b></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatrixLaboratory;
