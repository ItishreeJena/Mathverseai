import React, { useState, useEffect, useRef } from 'react';
import MathView from '../common/MathView';
import { Play, Pause, RotateCcw, Zap, Target } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GradientDescentSimulatorProps {
  onCompleteChallenge?: () => void;
}

export const GradientDescentSimulator: React.FC<GradientDescentSimulatorProps> = ({ onCompleteChallenge }) => {
  const [lossType, setLossType] = useState<'convex' | 'nonconvex' | 'plateau'>('convex');
  const [learningRate, setLearningRate] = useState(0.15);
  const [useMomentum, setUseMomentum] = useState(false);
  const [momentumBeta, setMomentumBeta] = useState(0.8);
  const [startX, setStartX] = useState(3.5);

  const [currentX, setCurrentX] = useState(3.5);
  const [velocity, setVelocity] = useState(0);
  const [history, setHistory] = useState<{ step: number; x: number; loss: number }[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isDiverged, setIsDiverged] = useState(false);
  const [isConverged, setIsConverged] = useState(false);

  // Challenge mode
  const [challengeMode, setChallengeMode] = useState(false);
  const [challengeWon, setChallengeWon] = useState(false);

  const timerRef = useRef<any>(null);

  // Loss curves & gradients
  const computeLoss = (x: number) => {
    switch (lossType) {
      case 'convex':
        return 0.5 * x * x;
      case 'nonconvex':
        // Two valleys: global around x = -2.2, local around x = 2.0
        return (Math.pow(x * x - 4, 2) / 8) + 0.3 * x + 2.0;
      case 'plateau':
        return Math.log(1 + Math.exp(x * x)) * 0.4;
      default:
        return 0.5 * x * x;
    }
  };

  const computeGradient = (x: number) => {
    switch (lossType) {
      case 'convex':
        return x;
      case 'nonconvex':
        // d/dx [ (x^2 - 4)^2 / 8 + 0.3x ] = (4x(x^2 - 4))/8 + 0.3 = 0.5x(x^2 - 4) + 0.3
        return 0.5 * x * (x * x - 4) + 0.3;
      case 'plateau': {
        const exp = Math.exp(x * x);
        return (0.4 * 2 * x * exp) / (1 + exp);
      }
      default:
        return x;
    }
  };

  // Reset simulation
  const reset = (initialX = startX) => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrentX(initialX);
    setVelocity(0);
    setIsDiverged(false);
    setIsConverged(false);
    setHistory([{ step: 0, x: initialX, loss: computeLoss(initialX) }]);
  };

  // Execute one descent step
  const stepDescent = () => {
    if (isDiverged || isConverged) return;

    const grad = computeGradient(currentX);
    let newV = 0;
    let nextX = currentX;

    if (useMomentum) {
      newV = momentumBeta * velocity + (1 - momentumBeta) * grad;
      nextX = currentX - learningRate * newV;
      setVelocity(newV);
    } else {
      nextX = currentX - learningRate * grad;
    }

    // Divergence check
    if (Math.abs(nextX) > 8 || isNaN(nextX)) {
      setIsDiverged(true);
      setIsRunning(false);
      return;
    }

    const nextLoss = computeLoss(nextX);
    const newStepNum = history.length;
    const newHist = [...history, { step: newStepNum, x: nextX, loss: nextLoss }];
    setHistory(newHist);
    setCurrentX(nextX);

    // Convergence check
    if (Math.abs(grad) < 0.02 || Math.abs(nextX - currentX) < 0.001) {
      setIsConverged(true);
      setIsRunning(false);
      if (challengeMode && newStepNum <= 15 && !challengeWon) {
        setChallengeWon(true);
        confetti({ particleCount: 60, spread: 50 });
        if (onCompleteChallenge) onCompleteChallenge();
      }
    }
  };

  // Run loop
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        stepDescent();
      }, 300);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, currentX, velocity, isDiverged, isConverged, learningRate, useMomentum, momentumBeta]);

  // Initial reset on startX or lossType change
  useEffect(() => {
    reset(startX);
  }, [startX, lossType]);

  // SVG dimensions
  const svgW = 360;
  const svgH = 240;
  const minX = -4.2;
  const maxX = 4.2;
  const minY = 0;
  const maxY = 7;

  const toSvgX = (x: number) => ((x - minX) / (maxX - minX)) * svgW;
  const toSvgY = (y: number) => svgH - ((y - minY) / (maxY - minY)) * svgH;

  // Generate SVG path for loss curve
  const points: string[] = [];
  for (let i = 0; i <= 100; i++) {
    const x = minX + (i / 100) * (maxX - minX);
    const y = computeLoss(x);
    points.push(`${toSvgX(x)},${toSvgY(Math.min(maxY, y))}`);
  }
  const lossPathD = `M ${points.join(' L ')}`;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Gradient Descent & Optimizer Dynamics
          </h3>
          <p className="text-xs text-slate-400">
            Tune learning rate α and momentum to watch weights roll down non-convex loss valleys.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setChallengeMode(!challengeMode);
              setChallengeWon(false);
              reset(3.5);
            }}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
              challengeMode
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            {challengeMode ? 'Exit Race' : 'Mission: Gradient Descent Race'}
          </button>
        </div>
      </div>

      {challengeMode && (
        <div className="mb-4 p-3 rounded-lg border bg-amber-950/20 border-amber-500/30 text-xs text-amber-200 flex items-center justify-between">
          <div>
            <b>Race Objective:</b> Converge to the minimum in <b>15 steps or fewer</b> without exploding (hint: tune α between 0.15 and 0.25).
            {challengeWon && <span className="ml-2 text-emerald-400 font-bold">Race Completed! (+50 XP)</span>}
          </div>
          <span className="font-mono font-semibold">Steps taken: {history.length - 1} / 15</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* SVG Plot */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="bg-slate-950 rounded-lg p-2 border border-slate-800 shadow-inner">
            <svg width={svgW} height={svgH} className="overflow-visible select-none">
              {/* Axis */}
              <line x1={0} y1={toSvgY(0)} x2={svgW} y2={toSvgY(0)} stroke="#334155" strokeWidth="1" />
              <line x1={toSvgX(0)} y1={0} x2={toSvgX(0)} y2={svgH} stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />

              {/* Loss curve */}
              <path d={lossPathD} fill="none" stroke="#6366f1" strokeWidth="2.5" />

              {/* Trajectory history segments */}
              {history.map((pt, idx) => {
                if (idx === 0) return null;
                const prev = history[idx - 1];
                return (
                  <line
                    key={idx}
                    x1={toSvgX(prev.x)}
                    y1={toSvgY(prev.loss)}
                    x2={toSvgX(pt.x)}
                    y2={toSvgY(pt.loss)}
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                    opacity="0.8"
                  />
                );
              })}

              {/* History dots */}
              {history.map((pt, idx) => (
                <circle
                  key={idx}
                  cx={toSvgX(pt.x)}
                  cy={toSvgY(pt.loss)}
                  r={idx === history.length - 1 ? 6 : 2.5}
                  fill={idx === history.length - 1 ? '#ef4444' : '#f59e0b'}
                  stroke="#ffffff"
                  strokeWidth={idx === history.length - 1 ? 2 : 0.5}
                />
              ))}
            </svg>
          </div>

          {/* Player controls */}
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={() => setIsRunning(!isRunning)}
              disabled={isDiverged || isConverged}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow transition-colors ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50'
              }`}
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isRunning ? 'Pause' : 'Start Descent'}
            </button>
            <button
              onClick={stepDescent}
              disabled={isRunning || isDiverged || isConverged}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium disabled:opacity-50"
            >
              Step +1
            </button>
            <button
              onClick={() => reset()}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          {isDiverged && (
            <div className="mt-2 text-xs text-rose-400 font-semibold">
              ⚠️ Divergence Alert: Learning rate was too large! Weights exploded to infinity.
            </div>
          )}
          {isConverged && (
            <div className="mt-2 text-xs text-emerald-400 font-semibold">
              ✓ Converged! Gradient magnitude dropped below 0.02.
            </div>
          )}
        </div>

        {/* Hyperparameter Deck */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 space-y-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Loss Surface Type</label>
              <div className="grid grid-cols-3 gap-1 text-xs">
                {(['convex', 'nonconvex', 'plateau'] as const).map(l => (
                  <button
                    key={l}
                    onClick={() => setLossType(l)}
                    className={`py-1 rounded font-medium capitalize text-[11px] border ${
                      lossType === l
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Learning Rate (α)</span>
                <span className="font-mono text-cyan-400 font-bold">{learningRate.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.02"
                max="1.5"
                step="0.02"
                value={learningRate}
                onChange={e => setLearningRate(parseFloat(e.target.value))}
                className="w-full accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.02 (Slow)</span>
                <span>0.20 (Optimal)</span>
                <span>1.50 (Overshoot)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Initial Position (w₀)</span>
                <span className="font-mono text-amber-400 font-bold">{startX.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-3.8"
                max="3.8"
                step="0.2"
                value={startX}
                onChange={e => setStartX(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useMomentum}
                  onChange={e => setUseMomentum(e.target.checked)}
                  className="rounded border-slate-700 text-indigo-500 focus:ring-0"
                />
                Enable Momentum (β = {momentumBeta.toFixed(2)})
              </label>
            </div>
          </div>

          {/* Current State Summary */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-xs">
            <div className="text-slate-400 uppercase tracking-wider mb-2 font-mono">Optimizer Telemetry</div>
            <div className="grid grid-cols-2 gap-2 font-mono">
              <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                <span className="text-slate-400 text-[11px] block">Current Weight w:</span>
                <span className="text-emerald-400 font-bold text-sm">{currentX.toFixed(3)}</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800/80">
                <span className="text-slate-400 text-[11px] block">Current Loss L(w):</span>
                <span className="text-indigo-400 font-bold text-sm">{computeLoss(currentX).toFixed(3)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradientDescentSimulator;
