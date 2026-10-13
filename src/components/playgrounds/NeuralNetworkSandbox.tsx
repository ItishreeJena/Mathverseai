import React, { useState } from 'react';
import MathView from '../common/MathView';
import { Cpu, Play, RotateCcw, Swords, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface NeuralNetworkSandboxProps {
  onCompleteChallenge?: () => void;
}

export const NeuralNetworkSandbox: React.FC<NeuralNetworkSandboxProps> = ({ onCompleteChallenge }) => {
  // Network parameters
  // Inputs
  const [x1, setX1] = useState(1.0);
  const [x2, setX2] = useState(-0.5);
  const [targetY, setTargetY] = useState(1.0);

  // Hidden weights & biases (2 neurons)
  const [w11, setW11] = useState(0.8);
  const [w12, setW12] = useState(-0.5);
  const [b1, setB1] = useState(0.1);

  const [w21, setW21] = useState(-0.4);
  const [w22, setW22] = useState(0.9);
  const [b2, setB2] = useState(-0.2);

  // Output weights & bias
  const [v1, setV1] = useState(0.7);
  const [v2, setV2] = useState(-0.6);
  const [bOut, setBOut] = useState(0.0);

  const [activation, setActivation] = useState<'sigmoid' | 'relu' | 'tanh'>('sigmoid');
  const [learningRate, setLearningRate] = useState(0.2);

  // Boss Fight Mode
  const [bossMode, setBossMode] = useState(false);
  const [bossDefeated, setBossDefeated] = useState(false);

  // Activation function & its derivative
  const act = (z: number) => {
    switch (activation) {
      case 'sigmoid':
        return 1 / (1 + Math.exp(-z));
      case 'relu':
        return Math.max(0, z);
      case 'tanh':
        return Math.tanh(z);
      default:
        return z;
    }
  };

  const actDeriv = (z: number) => {
    switch (activation) {
      case 'sigmoid': {
        const s = act(z);
        return s * (1 - s);
      }
      case 'relu':
        return z > 0 ? 1 : 0;
      case 'tanh': {
        const t = Math.tanh(z);
        return 1 - t * t;
      }
      default:
        return 1;
    }
  };

  // Forward Pass
  const z1 = w11 * x1 + w12 * x2 + b1;
  const h1 = act(z1);

  const z2 = w21 * x1 + w22 * x2 + b2;
  const h2 = act(z2);

  const zOut = v1 * h1 + v2 * h2 + bOut;
  const yPred = act(zOut);

  // Loss: L = 0.5 * (yPred - targetY)^2
  const error = yPred - targetY;
  const loss = 0.5 * error * error;

  // Single step of backpropagation update
  const trainStep = () => {
    // Output neuron delta
    const dL_dyPred = error;
    const dyPred_dzOut = actDeriv(zOut);
    const deltaOut = dL_dyPred * dyPred_dzOut;

    // Gradients for output layer
    const dL_dv1 = deltaOut * h1;
    const dL_dv2 = deltaOut * h2;
    const dL_dbOut = deltaOut;

    // Hidden layer deltas
    const delta1 = deltaOut * v1 * actDeriv(z1);
    const delta2 = deltaOut * v2 * actDeriv(z2);

    // Gradients for hidden layer
    const dL_dw11 = delta1 * x1;
    const dL_dw12 = delta1 * x2;
    const dL_db1 = delta1;

    const dL_dw21 = delta2 * x1;
    const dL_dw22 = delta2 * x2;
    const dL_db2 = delta2;

    // Gradient descent updates
    setV1(prev => prev - learningRate * dL_dv1);
    setV2(prev => prev - learningRate * dL_dv2);
    setBOut(prev => prev - learningRate * dL_dbOut);

    setW11(prev => prev - learningRate * dL_dw11);
    setW12(prev => prev - learningRate * dL_dw12);
    setB1(prev => prev - learningRate * dL_db1);

    setW21(prev => prev - learningRate * dL_dw21);
    setW22(prev => prev - learningRate * dL_dw22);
    setB2(prev => prev - learningRate * dL_db2);

    // Check boss win condition
    if (bossMode && !bossDefeated && loss < 0.01) {
      setBossDefeated(true);
      confetti({ particleCount: 70, spread: 70 });
      if (onCompleteChallenge) onCompleteChallenge();
    }
  };

  const autoTrain = () => {
    for (let i = 0; i < 25; i++) {
      trainStep();
    }
  };

  const resetWeights = () => {
    setW11(0.8);
    setW12(-0.5);
    setB1(0.1);
    setW21(-0.4);
    setW22(0.9);
    setB2(-0.2);
    setV1(0.7);
    setV2(-0.6);
    setBOut(0.0);
    setBossDefeated(false);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-400" />
            Neural Network Forward & Backprop Sandbox
          </h3>
          <p className="text-xs text-slate-400">
            A real working 2-layer perceptron. Adjust weights and inspect exact analytical loss gradients.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setBossMode(!bossMode);
              setBossDefeated(false);
            }}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
              bossMode
                ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            {bossMode ? 'Exit Boss Fight' : 'Boss Fight: Minimize Error'}
          </button>
        </div>
      </div>

      {bossMode && (
        <div className="mb-4 p-3 rounded-lg border bg-rose-950/20 border-rose-500/30 text-xs text-rose-200 flex items-center justify-between">
          <div>
            <b>Boss Fight Objective:</b> Train the network using Backpropagation until Loss &lt; 0.01!
            {bossDefeated && <span className="ml-2 text-emerald-400 font-bold">Boss Defeated! (+60 XP)</span>}
          </div>
          <span className="font-mono font-semibold">Current Loss: {loss.toFixed(4)}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Network Diagram */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 shadow-inner w-full">
            <svg width="340" height="220" className="overflow-visible select-none mx-auto block">
              {/* Connection Lines from Inputs to Hidden */}
              <line x1={40} y1={60} x2={160} y2={60} stroke="#4f46e5" strokeWidth={Math.max(1, Math.abs(w11) * 3)} opacity="0.7" />
              <line x1={40} y1={60} x2={160} y2={160} stroke="#4f46e5" strokeWidth={Math.max(1, Math.abs(w21) * 3)} opacity="0.7" />
              <line x1={40} y1={160} x2={160} y2={60} stroke="#4f46e5" strokeWidth={Math.max(1, Math.abs(w12) * 3)} opacity="0.7" />
              <line x1={40} y1={160} x2={160} y2={160} stroke="#4f46e5" strokeWidth={Math.max(1, Math.abs(w22) * 3)} opacity="0.7" />

              {/* Connections from Hidden to Output */}
              <line x1={160} y1={60} x2={280} y2={110} stroke="#06b6d4" strokeWidth={Math.max(1, Math.abs(v1) * 3)} opacity="0.8" />
              <line x1={160} y1={160} x2={280} y2={110} stroke="#06b6d4" strokeWidth={Math.max(1, Math.abs(v2) * 3)} opacity="0.8" />

              {/* Input Nodes */}
              <g>
                <circle cx={40} cy={60} r={18} fill="#1e1b4b" stroke="#6366f1" strokeWidth={2} />
                <text x={40} y={64} fill="#c7d2fe" fontSize={11} fontWeight="bold" textAnchor="middle">x₁: {x1}</text>
              </g>
              <g>
                <circle cx={40} cy={160} r={18} fill="#1e1b4b" stroke="#6366f1" strokeWidth={2} />
                <text x={40} y={164} fill="#c7d2fe" fontSize={11} fontWeight="bold" textAnchor="middle">x₂: {x2}</text>
              </g>

              {/* Hidden Layer Nodes */}
              <g>
                <circle cx={160} cy={60} r={20} fill="#0f172a" stroke="#818cf8" strokeWidth={2} />
                <text x={160} y={56} fill="#a5b4fc" fontSize={10} fontWeight="bold" textAnchor="middle">h₁</text>
                <text x={160} y={70} fill="#38bdf8" fontSize={9} fontStyle="italic" textAnchor="middle">{h1.toFixed(2)}</text>
              </g>
              <g>
                <circle cx={160} cy={160} r={20} fill="#0f172a" stroke="#818cf8" strokeWidth={2} />
                <text x={160} y={156} fill="#a5b4fc" fontSize={10} fontWeight="bold" textAnchor="middle">h₂</text>
                <text x={160} y={170} fill="#38bdf8" fontSize={9} fontStyle="italic" textAnchor="middle">{h2.toFixed(2)}</text>
              </g>

              {/* Output Node */}
              <g>
                <circle cx={280} cy={110} r={22} fill="#082f49" stroke="#06b6d4" strokeWidth={2.5} />
                <text x={280} y={106} fill="#e0f2fe" fontSize={11} fontWeight="bold" textAnchor="middle">ŷ</text>
                <text x={280} y={120} fill="#38bdf8" fontSize={10} fontWeight="bold" textAnchor="middle">{yPred.toFixed(3)}</text>
              </g>
            </svg>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={trainStep}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow"
            >
              <Play className="w-3.5 h-3.5" /> 1 Backprop Step
            </button>
            <button
              onClick={autoTrain}
              className="px-3 py-1.5 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg text-xs font-semibold"
            >
              Train 25 Epochs
            </button>
            <button
              onClick={resetWeights}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* Inputs, Targets, and Telemetry */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Target Output y*</label>
                <input
                  type="number"
                  step="0.1"
                  value={targetY}
                  onChange={e => setTargetY(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center font-mono text-cyan-300"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Activation Function</label>
                <select
                  value={activation}
                  onChange={e => setActivation(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                >
                  <option value="sigmoid">Sigmoid</option>
                  <option value="relu">ReLU</option>
                  <option value="tanh">Tanh</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Learning Rate (α)</span>
                <span className="font-mono text-cyan-400 font-bold">{learningRate.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.8"
                step="0.05"
                value={learningRate}
                onChange={e => setLearningRate(parseFloat(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>
          </div>

          {/* Forward Pass & Error Card */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-xs space-y-2">
            <div className="text-slate-400 uppercase tracking-wider font-mono">Prediction & Loss Metrics</div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800">
              <span className="text-slate-300">Model Output ŷ:</span>
              <span className="font-mono font-bold text-cyan-300 text-sm">{yPred.toFixed(4)}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800">
              <span className="text-slate-300">Target y*:</span>
              <span className="font-mono font-bold text-amber-300 text-sm">{targetY.toFixed(4)}</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-300">Mean Squared Error (L):</span>
              <span className={`font-mono font-bold text-sm ${loss < 0.01 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {loss.toFixed(5)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeuralNetworkSandbox;
