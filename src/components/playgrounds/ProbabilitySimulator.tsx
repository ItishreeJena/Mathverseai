import React, { useState } from 'react';
import MathView from '../common/MathView';
import { Dice5, Play, RotateCcw, HelpCircle, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProbabilitySimulatorProps {
  onCompleteChallenge?: () => void;
}

export const ProbabilitySimulator: React.FC<ProbabilitySimulatorProps> = ({ onCompleteChallenge }) => {
  const [experiment, setExperiment] = useState<'clt' | 'coin' | 'monty'>('clt');

  // CLT state
  const [numDice, setNumDice] = useState(6);
  const [sampleCount, setSampleCount] = useState(500);
  const [cltHistogram, setCltHistogram] = useState<number[]>([]);

  // Coin state
  const [coinP, setCoinP] = useState(0.5);
  const [coinFlips, setCoinFlips] = useState(200);
  const [headsCount, setHeadsCount] = useState(0);

  // Monty Hall state
  const [montyTrials, setMontyTrials] = useState(200);
  const [switchWins, setSwitchWins] = useState(0);
  const [stayWins, setStayWins] = useState(0);

  // Challenge: Probability Detective
  const [mysteryP, setMysteryP] = useState(0.7);
  const [detectiveTries, setDetectiveTries] = useState(0);
  const [detectiveHeads, setDetectiveHeads] = useState(0);
  const [userGuess, setUserGuess] = useState(0.5);
  const [detectiveSolved, setDetectiveSolved] = useState(false);

  // Run CLT Experiment
  const runCLT = () => {
    const minSum = numDice;
    const maxSum = numDice * 6;
    const bins = new Array(maxSum - minSum + 1).fill(0);

    for (let s = 0; s < sampleCount; s++) {
      let sum = 0;
      for (let d = 0; d < numDice; d++) {
        sum += Math.floor(Math.random() * 6) + 1;
      }
      bins[sum - minSum]++;
    }
    setCltHistogram(bins);
  };

  // Run Coin Experiment
  const runCoins = () => {
    let heads = 0;
    for (let i = 0; i < coinFlips; i++) {
      if (Math.random() < coinP) heads++;
    }
    setHeadsCount(heads);
  };

  // Run Monty Hall Experiment
  const runMontyHall = () => {
    let sWins = 0;
    let stWins = 0;
    for (let i = 0; i < montyTrials; i++) {
      const carDoor = Math.floor(Math.random() * 3);
      const playerChoice = Math.floor(Math.random() * 3);
      
      // If player stays, they win only if their initial choice was the car
      if (playerChoice === carDoor) {
        stWins++;
      } else {
        // Host opens the remaining goat door; switching will land on car!
        sWins++;
      }
    }
    setSwitchWins(sWins);
    setStayWins(stWins);
  };

  // Run Mystery Detective Trial
  const flipMysteryCoin = (batchSize: number) => {
    let heads = 0;
    for (let i = 0; i < batchSize; i++) {
      if (Math.random() < mysteryP) heads++;
    }
    setDetectiveTries(prev => prev + batchSize);
    setDetectiveHeads(prev => prev + heads);
  };

  const verifyDetectiveGuess = () => {
    if (Math.abs(userGuess - mysteryP) <= 0.06) {
      setDetectiveSolved(true);
      confetti({ particleCount: 60, spread: 60 });
      if (onCompleteChallenge) onCompleteChallenge();
    }
  };

  // Initialize CLT on first render
  React.useEffect(() => {
    runCLT();
  }, [numDice, sampleCount]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Dice5 className="w-5 h-5 text-pink-400" />
            Probability Simulator & Empirical Trials
          </h3>
          <p className="text-xs text-slate-400">
            Simulate thousands of Monte Carlo trials to observe the Central Limit Theorem and Law of Large Numbers.
          </p>
        </div>

        {/* Experiment tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setExperiment('clt')}
            className={`px-2.5 py-1 rounded font-medium ${
              experiment === 'clt' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Central Limit Theorem
          </button>
          <button
            onClick={() => {
              setExperiment('coin');
              runCoins();
            }}
            className={`px-2.5 py-1 rounded font-medium ${
              experiment === 'coin' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Law of Large Numbers
          </button>
          <button
            onClick={() => {
              setExperiment('monty');
              runMontyHall();
            }}
            className={`px-2.5 py-1 rounded font-medium ${
              experiment === 'monty' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Monty Hall Paradox
          </button>
        </div>
      </div>

      {/* CLT VIEW */}
      {experiment === 'clt' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="bg-slate-950 rounded-lg p-3 border border-slate-800 shadow-inner w-full flex flex-col items-center">
              <div className="text-xs text-slate-400 mb-2 font-mono">
                Sum of {numDice} Uniform Dice Across {sampleCount} Iterations
              </div>
              <svg width="320" height="180" className="overflow-visible select-none">
                {cltHistogram.map((count, i) => {
                  const maxCount = Math.max(...cltHistogram, 1);
                  const barH = (count / maxCount) * 140;
                  const barW = Math.max(3, 300 / cltHistogram.length - 2);
                  const x = 10 + i * (300 / cltHistogram.length);
                  const y = 160 - barH;

                  return (
                    <g key={i}>
                      <rect
                        x={x}
                        y={y}
                        width={barW}
                        height={barH}
                        fill="#ec4899"
                        opacity="0.8"
                        rx="1"
                      />
                    </g>
                  );
                })}
                <line x1="10" y1="160" x2="310" y2="160" stroke="#475569" strokeWidth="1" />
              </svg>
            </div>

            <button
              onClick={runCLT}
              className="mt-3 px-3 py-1.5 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Re-sample {sampleCount} Trials
            </button>
          </div>

          <div className="lg:col-span-5 space-y-3">
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Number of Independent Dice per Sum (k)</span>
                  <span className="font-mono text-pink-400 font-bold">{numDice}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={numDice}
                  onChange={e => setNumDice(parseInt(e.target.value))}
                  className="w-full accent-pink-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Sample Size Trials (N)</span>
                  <span className="font-mono text-pink-400 font-bold">{sampleCount}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="100"
                  value={sampleCount}
                  onChange={e => setSampleCount(parseInt(e.target.value))}
                  className="w-full accent-pink-500"
                />
              </div>
            </div>

            <div className="bg-pink-950/20 border border-pink-900/40 rounded-lg p-3 text-xs text-pink-200">
              <span className="font-semibold block mb-1">Central Limit Theorem Takeaway:</span>
              Even though rolling a single die produces a completely flat, non-normal uniform distribution (1/6 for each side), summing k ≥ 4 independent dice causes the sum distribution to converge smoothly into a Gaussian normal bell curve!
            </div>
          </div>
        </div>
      )}

      {/* COIN VIEW */}
      {experiment === 'coin' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 w-full space-y-4">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Theoretical Probability P(Heads): <b>{(coinP * 100).toFixed(0)}%</b></span>
                <span>Empirical Result: <b>{((headsCount / coinFlips) * 100).toFixed(1)}%</b></span>
              </div>

              {/* Progress bar visual */}
              <div className="h-6 w-full bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
                <div
                  style={{ width: `${(headsCount / coinFlips) * 100}%` }}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 h-full flex items-center justify-center text-[10px] font-bold text-white transition-all duration-300"
                >
                  Heads ({headsCount})
                </div>
                <div
                  style={{ width: `${100 - (headsCount / coinFlips) * 100}%` }}
                  className="bg-slate-800 h-full flex items-center justify-center text-[10px] font-bold text-slate-300"
                >
                  Tails ({coinFlips - headsCount})
                </div>
              </div>
            </div>

            <button
              onClick={runCoins}
              className="mt-3 px-3 py-1.5 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Toss {coinFlips} Coins Again
            </button>
          </div>

          <div className="lg:col-span-5 space-y-3">
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Coin Bias P(Heads)</span>
                  <span className="font-mono text-pink-400 font-bold">{coinP.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.05"
                  value={coinP}
                  onChange={e => setCoinP(parseFloat(e.target.value))}
                  className="w-full accent-pink-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Number of Flips</span>
                  <span className="font-mono text-pink-400 font-bold">{coinFlips}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={coinFlips}
                  onChange={e => setCoinFlips(parseInt(e.target.value))}
                  className="w-full accent-pink-500"
                />
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-xs text-slate-300">
              <div className="text-slate-400 font-mono uppercase text-[11px] mb-1">Law of Large Numbers</div>
              As sample size N increases from 50 to 2000, empirical frequency converges closer to true theoretical probability P with variance decaying as σ²/N.
            </div>
          </div>
        </div>
      )}

      {/* MONTY HALL VIEW */}
      {experiment === 'monty' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 w-full space-y-3">
              <div className="text-xs text-slate-400 font-mono text-center">
                Simulated {montyTrials} Game Show Episodes
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-lg">
                  <div className="text-xs text-emerald-400 font-semibold">Switch Strategy</div>
                  <div className="text-2xl font-bold font-mono text-white mt-1">
                    {((switchWins / montyTrials) * 100).toFixed(1)}%
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {switchWins} Wins (Theoretical: 66.7%)
                  </div>
                </div>
                <div className="p-3 bg-rose-950/30 border border-rose-800/40 rounded-lg">
                  <div className="text-xs text-rose-400 font-semibold">Stay Strategy</div>
                  <div className="text-2xl font-bold font-mono text-white mt-1">
                    {((stayWins / montyTrials) * 100).toFixed(1)}%
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {stayWins} Wins (Theoretical: 33.3%)
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={runMontyHall}
              className="mt-3 px-3 py-1.5 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Simulate {montyTrials} Episodes Again
            </button>
          </div>

          <div className="lg:col-span-5 space-y-3 text-xs">
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
              <div className="text-slate-400 font-mono uppercase text-[11px] mb-1">Bayesian Resolution</div>
              <p className="text-slate-300">
                When you pick a door initially, your chance of picking the car is 1/3, meaning there is a 2/3 chance the car is behind one of the OTHER two doors. When the host deliberately reveals a goat behind one of those other doors, that entire 2/3 probability collapses onto the remaining unopened door!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProbabilitySimulator;
