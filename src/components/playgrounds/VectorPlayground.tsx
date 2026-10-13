import React, { useState, useRef, useEffect, useCallback } from 'react';
import MathView from '../common/MathView';
import { Target, RefreshCw, CheckCircle2, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';

interface VectorPlaygroundProps {
  onCompleteChallenge?: () => void;
}

export const VectorPlayground: React.FC<VectorPlaygroundProps> = ({ onCompleteChallenge }) => {
  const [u, setU] = useState<{ x: number; y: number }>({ x: 3, y: 2 });
  const [v, setV] = useState<{ x: number; y: number }>({ x: 1, y: 4 });
  const [activeDrag, setActiveDrag] = useState<'u' | 'v' | null>(null);
  const [showSum, setShowSum] = useState(true);
  const [showProjection, setShowProjection] = useState(true);
  
  // Game Mode: Vector Voyager challenge
  const [challengeActive, setChallengeActive] = useState(false);
  const [targetPoint, setTargetPoint] = useState<{ x: number; y: number }>({ x: 4, y: 6 });
  const [challengeSolved, setChallengeSolved] = useState(false);

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Coordinate system mapping: -7 to +7 mapped to 360x360 SVG
  const width = 360;
  const height = 360;
  const scale = width / 14; // pixels per unit (7 units on each side of origin)
  const originX = width / 2;
  const originY = height / 2;

  const toSvgX = (mathX: number) => originX + mathX * scale;
  const toSvgY = (mathY: number) => originY - mathY * scale;

  const toMathCoords = useCallback((screenX: number, screenY: number) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const px = screenX - rect.left;
    const py = screenY - rect.top;
    const mathX = Math.round(((px - originX) / scale) * 10) / 10;
    const mathY = Math.round(((originY - py) / scale) * 10) / 10;
    // Bound to [-6, 6]
    return {
      x: Math.max(-6, Math.min(6, mathX)),
      y: Math.max(-6, Math.min(6, mathY)),
    };
  }, [originX, originY, scale]);

  const handlePointerDown = (vec: 'u' | 'v') => (e: React.PointerEvent) => {
    e.preventDefault();
    setActiveDrag(vec);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!activeDrag) return;
    const coords = toMathCoords(e.clientX, e.clientY);
    if (activeDrag === 'u') {
      setU(coords);
    } else if (activeDrag === 'v') {
      setV(coords);
    }
  };

  const handlePointerUp = () => {
    setActiveDrag(null);
  };

  // Math computations
  const magU = Math.sqrt(u.x * u.x + u.y * u.y);
  const magV = Math.sqrt(v.x * v.x + v.y * v.y);
  const dotProduct = u.x * v.x + u.y * v.y;
  
  const cosTheta = magU > 0.001 && magV > 0.001 
    ? Math.max(-1, Math.min(1, dotProduct / (magU * magV))) 
    : 0;
  const angleDeg = Math.round((Math.acos(cosTheta) * (180 / Math.PI)) * 10) / 10;
  
  const sumVec = { x: u.x + v.x, y: u.y + v.y };

  // Projection of u onto v
  const projScalar = magV > 0.001 ? dotProduct / (magV * magV) : 0;
  const projVec = { x: projScalar * v.x, y: projScalar * v.y };

  // Check challenge
  useEffect(() => {
    if (challengeActive && !challengeSolved) {
      const dist = Math.sqrt(
        Math.pow(sumVec.x - targetPoint.x, 2) + Math.pow(sumVec.y - targetPoint.y, 2)
      );
      if (dist < 0.35) {
        setChallengeSolved(true);
        confetti({ particleCount: 60, spread: 55, origin: { y: 0.7 } });
        if (onCompleteChallenge) onCompleteChallenge();
      }
    }
  }, [sumVec, targetPoint, challengeActive, challengeSolved, onCompleteChallenge]);

  const startNewChallenge = () => {
    const rx = Math.floor(Math.random() * 8) - 4;
    const ry = Math.floor(Math.random() * 8) - 4;
    setTargetPoint({ x: rx === 0 ? 3 : rx, y: ry === 0 ? 4 : ry });
    setChallengeSolved(false);
    setChallengeActive(true);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            2D Vector Playground & Cosine Space
          </h3>
          <p className="text-xs text-slate-400">
            Drag the endpoints of vector <span className="text-cyan-400 font-semibold">u</span> and <span className="text-violet-400 font-semibold">v</span> to observe dot product, angles, and embeddings.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (!challengeActive) startNewChallenge();
              else setChallengeActive(false);
            }}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
              challengeActive
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            {challengeActive ? 'Exit Challenge' : 'Mission: Vector Voyager'}
          </button>
        </div>
      </div>

      {challengeActive && (
        <div className={`mb-4 p-3 rounded-lg border text-xs flex items-center justify-between transition-colors ${
          challengeSolved 
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' 
            : 'bg-cyan-950/40 border-cyan-800/40 text-cyan-200'
        }`}>
          <div>
            <span className="font-semibold">Goal:</span> Adjust vectors <b>u</b> and <b>v</b> so their sum reaches target <span className="font-mono font-bold">({targetPoint.x}, {targetPoint.y})</span>.
            {challengeSolved && <span className="ml-2 font-bold text-emerald-400">Target Reached! (+40 XP)</span>}
          </div>
          {challengeSolved && (
            <button
              onClick={startNewChallenge}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded text-xs flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Next Target
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* SVG Interactive Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative bg-slate-950 rounded-lg p-2 border border-slate-800 shadow-inner select-none touch-none">
            <svg
              ref={svgRef}
              width={width}
              height={height}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="cursor-crosshair overflow-visible"
            >
              <defs>
                <marker id="arrow-u" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#06b6d4" />
                </marker>
                <marker id="arrow-v" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#a855f7" />
                </marker>
                <marker id="arrow-sum" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
                </marker>
              </defs>

              {/* Grid lines */}
              {[-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map(i => (
                <React.Fragment key={i}>
                  <line
                    x1={toSvgX(i)}
                    y1={0}
                    x2={toSvgX(i)}
                    y2={height}
                    stroke={i === 0 ? '#475569' : '#1e293b'}
                    strokeWidth={i === 0 ? 1.5 : 0.75}
                  />
                  <line
                    x1={0}
                    y1={toSvgY(i)}
                    x2={width}
                    y2={toSvgY(i)}
                    stroke={i === 0 ? '#475569' : '#1e293b'}
                    strokeWidth={i === 0 ? 1.5 : 0.75}
                  />
                </React.Fragment>
              ))}

              {/* Target for challenge */}
              {challengeActive && (
                <g>
                  <circle
                    cx={toSvgX(targetPoint.x)}
                    cy={toSvgY(targetPoint.y)}
                    r="12"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                    className="animate-pulse"
                  />
                  <circle
                    cx={toSvgX(targetPoint.x)}
                    cy={toSvgY(targetPoint.y)}
                    r="4"
                    fill="#f59e0b"
                  />
                  <text
                    x={toSvgX(targetPoint.x) + 8}
                    y={toSvgY(targetPoint.y) - 8}
                    fill="#fbbf24"
                    fontSize="10"
                    fontWeight="600"
                  >
                    Target ({targetPoint.x}, {targetPoint.y})
                  </text>
                </g>
              )}

              {/* Parallelogram dotted lines for sum */}
              {showSum && (
                <>
                  <line
                    x1={toSvgX(u.x)}
                    y1={toSvgY(u.y)}
                    x2={toSvgX(sumVec.x)}
                    y2={toSvgY(sumVec.y)}
                    stroke="#a855f7"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                    opacity="0.6"
                  />
                  <line
                    x1={toSvgX(v.x)}
                    y1={toSvgY(v.y)}
                    x2={toSvgX(sumVec.x)}
                    y2={toSvgY(sumVec.y)}
                    stroke="#06b6d4"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                    opacity="0.6"
                  />
                  {/* Sum vector arrow */}
                  <line
                    x1={originX}
                    y1={originY}
                    x2={toSvgX(sumVec.x)}
                    y2={toSvgY(sumVec.y)}
                    stroke="#10b981"
                    strokeWidth="2.5"
                    markerEnd="url(#arrow-sum)"
                  />
                </>
              )}

              {/* Projection of u onto v */}
              {showProjection && (
                <>
                  <line
                    x1={toSvgX(u.x)}
                    y1={toSvgY(u.y)}
                    x2={toSvgX(projVec.x)}
                    y2={toSvgY(projVec.y)}
                    stroke="#e2e8f0"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    opacity="0.5"
                  />
                  <circle
                    cx={toSvgX(projVec.x)}
                    cy={toSvgY(projVec.y)}
                    r="3.5"
                    fill="#38bdf8"
                  />
                </>
              )}

              {/* Vector u arrow */}
              <line
                x1={originX}
                y1={originY}
                x2={toSvgX(u.x)}
                y2={toSvgY(u.y)}
                stroke="#06b6d4"
                strokeWidth="2.5"
                markerEnd="url(#arrow-u)"
              />

              {/* Vector v arrow */}
              <line
                x1={originX}
                y1={originY}
                x2={toSvgX(v.x)}
                y2={toSvgY(v.y)}
                stroke="#a855f7"
                strokeWidth="2.5"
                markerEnd="url(#arrow-v)"
              />

              {/* Draggable handle u */}
              <circle
                cx={toSvgX(u.x)}
                cy={toSvgY(u.y)}
                r="7"
                fill="#06b6d4"
                stroke="#082f49"
                strokeWidth="2"
                onPointerDown={handlePointerDown('u')}
                className="cursor-grab active:cursor-grabbing hover:scale-125 transition-transform"
              />

              {/* Draggable handle v */}
              <circle
                cx={toSvgX(v.x)}
                cy={toSvgY(v.y)}
                r="7"
                fill="#a855f7"
                stroke="#3b0764"
                strokeWidth="2"
                onPointerDown={handlePointerDown('v')}
                className="cursor-grab active:cursor-grabbing hover:scale-125 transition-transform"
              />

              {/* Labels */}
              <text x={toSvgX(u.x) + 6} y={toSvgY(u.y) - 6} fill="#06b6d4" fontSize="11" fontWeight="bold">
                u ({u.x}, {u.y})
              </text>
              <text x={toSvgX(v.x) + 6} y={toSvgY(v.y) - 6} fill="#c084fc" fontSize="11" fontWeight="bold">
                v ({v.x}, {v.y})
              </text>
              {showSum && (
                <text x={toSvgX(sumVec.x) + 6} y={toSvgY(sumVec.y) - 6} fill="#34d399" fontSize="11" fontWeight="bold">
                  u + v ({sumVec.x.toFixed(1)}, {sumVec.y.toFixed(1)})
                </text>
              )}
            </svg>
          </div>

          <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showSum}
                onChange={e => setShowSum(e.target.checked)}
                className="rounded border-slate-700 text-emerald-500 focus:ring-0"
              />
              Show Vector Sum (u + v)
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showProjection}
                onChange={e => setShowProjection(e.target.checked)}
                className="rounded border-slate-700 text-cyan-500 focus:ring-0"
              />
              Show Projection (proj_v u)
            </label>
          </div>
        </div>

        {/* Live Mathematical Metric Readouts */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-mono">Vector Coordinates & Norms</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                <span className="text-cyan-400 font-semibold">Vector u:</span>
                <div className="font-mono text-slate-200 mt-0.5">[{u.x.toFixed(1)}, {u.y.toFixed(1)}]</div>
                <div className="text-slate-400 text-[11px] mt-0.5">|u| = {magU.toFixed(2)}</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                <span className="text-violet-400 font-semibold">Vector v:</span>
                <div className="font-mono text-slate-200 mt-0.5">[{v.x.toFixed(1)}, {v.y.toFixed(1)}]</div>
                <div className="text-slate-400 text-[11px] mt-0.5">|v| = {magV.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Dot Product Calculation Card */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-1 font-mono">Dot Product Live Computation</div>
            <div className="text-sm font-mono text-cyan-300">
              <MathView math={`\\mathbf{u} \\cdot \\mathbf{v} = (${u.x.toFixed(1)})(${v.x.toFixed(1)}) + (${u.y.toFixed(1)})(${v.y.toFixed(1)}) = ${dotProduct.toFixed(2)}`} />
            </div>
            <div className="mt-2 text-xs text-slate-300 flex items-center justify-between">
              <span>Angle θ: <b className="text-amber-400 font-mono">{angleDeg}°</b></span>
              <span>Cosine Similarity: <b className="text-emerald-400 font-mono">{cosTheta.toFixed(3)}</b></span>
            </div>
          </div>

          {/* AI Semantic Meaning Card */}
          <div className="bg-gradient-to-br from-indigo-950/30 to-slate-950 border border-indigo-900/40 rounded-lg p-3 text-xs text-slate-300">
            <div className="font-semibold text-indigo-300 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              Machine Learning Interpretation:
            </div>
            {dotProduct > 0.05 ? (
              <p className="text-slate-300">
                Positive dot product ({dotProduct.toFixed(2)}): Vectors point in roughly the same direction. In embedding space (e.g. OpenAI ada-002), these two tokens share semantic concepts.
              </p>
            ) : dotProduct < -0.05 ? (
              <p className="text-slate-300">
                Negative dot product ({dotProduct.toFixed(2)}): Vectors point in opposing directions. The tokens exhibit inverse correlation.
              </p>
            ) : (
              <p className="text-slate-300">
                Zero dot product ({dotProduct.toFixed(2)}): Vectors are orthogonal (90°). The features are linearly independent with zero shared variance.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VectorPlayground;
