import React, { useState } from 'react';
import VectorPlayground from '../playgrounds/VectorPlayground';
import MatrixLaboratory from '../playgrounds/MatrixLaboratory';
import GradientDescentSimulator from '../playgrounds/GradientDescentSimulator';
import ProbabilitySimulator from '../playgrounds/ProbabilitySimulator';
import NeuralNetworkSandbox from '../playgrounds/NeuralNetworkSandbox';
import { Target, Award, Swords, Zap, Compass, Grid, Dice5, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MissionsViewProps {
  completedMissions: string[];
  onCompleteMission: (missionId: string, earnedXp: number) => void;
}

export const MissionsView: React.FC<MissionsViewProps> = ({
  completedMissions,
  onCompleteMission,
}) => {
  const [activeMission, setActiveMission] = useState<string | null>('vector_voyager');

  const MISSIONS = [
    {
      id: 'vector_voyager',
      title: 'Vector Voyager',
      badge: 'Linear Navigation',
      description: 'Combine two vectors in 2D Euclidean coordinate space to reach the coordinates of a target point.',
      xpReward: 50,
      icon: Compass,
      color: 'text-cyan-400',
    },
    {
      id: 'matrix_architect',
      title: 'Matrix Architect',
      badge: 'Spatial Warping',
      description: 'Configure a 2x2 matrix transformation to invert orientation and reach a determinant of -1.0.',
      xpReward: 50,
      icon: Grid,
      color: 'text-pink-400',
    },
    {
      id: 'gradient_race',
      title: 'Gradient Descent Race',
      badge: 'Optimization Speedrun',
      description: 'Tune the learning rate hyperparameter α to reach a minimum in 15 steps or fewer without divergence.',
      xpReward: 60,
      icon: Zap,
      color: 'text-amber-400',
    },
    {
      id: 'probability_detective',
      title: 'Probability Detective',
      badge: 'Uncertainty Mastery',
      description: 'Investigate the Monty Hall paradox and Central Limit Theorem to solve probabilistic behavior.',
      xpReward: 50,
      icon: Dice5,
      color: 'text-purple-400',
    },
    {
      id: 'neural_boss_fight',
      title: 'Neural Network Boss Fight',
      badge: 'Deep Learning Boss',
      description: 'Execute analytical backpropagation gradient updates to reduce neural network prediction loss below 0.01.',
      xpReward: 80,
      icon: Swords,
      color: 'text-rose-400',
    },
  ];

  const handleFinishMission = (id: string, xp: number) => {
    if (!completedMissions.includes(id)) {
      onCompleteMission(id, xp);
      confetti({ particleCount: 70, spread: 60 });
    }
  };

  const currentMissionObj = MISSIONS.find(m => m.id === activeMission);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold mb-1">
              Gamified Mathematical Missions
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Interactive Mathematics Arena
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1">
              Complete hands-on mathematical challenges to earn XP points, level up, and unlock advanced research badges.
            </p>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center shrink-0">
            <div className="text-[11px] text-slate-400 font-mono">Missions Solved</div>
            <div className="text-xl font-bold font-mono text-cyan-400">
              {completedMissions.length} / {MISSIONS.length}
            </div>
          </div>
        </div>

        {/* Mission selector tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-6 pt-4 border-t border-slate-800">
          {MISSIONS.map(m => {
            const Icon = m.icon;
            const isCompleted = completedMissions.includes(m.id);
            const isCurrent = activeMission === m.id;

            return (
              <button
                key={m.id}
                onClick={() => setActiveMission(m.id)}
                className={`p-3 rounded-lg border text-left transition-all relative ${
                  isCurrent
                    ? 'bg-slate-800 border-cyan-500 shadow-md'
                    : 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Icon className={`w-4 h-4 ${m.color}`} />
                  {isCompleted && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </div>
                <div className="text-xs font-bold text-white truncate">{m.title}</div>
                <div className="text-[10px] text-amber-400 font-mono mt-0.5">+{m.xpReward} XP</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Mission Arena */}
      {currentMissionObj && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-white">{currentMissionObj.title}:</span>{' '}
              <span className="text-slate-300">{currentMissionObj.description}</span>
            </div>
            {completedMissions.includes(currentMissionObj.id) ? (
              <span className="px-2.5 py-1 bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 rounded font-semibold text-[11px] shrink-0">
                Completed ✓
              </span>
            ) : (
              <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded font-semibold text-[11px] shrink-0">
                In Progress (+{currentMissionObj.xpReward} XP)
              </span>
            )}
          </div>

          {activeMission === 'vector_voyager' && (
            <VectorPlayground
              onCompleteChallenge={() => handleFinishMission('vector_voyager', 50)}
            />
          )}

          {activeMission === 'matrix_architect' && (
            <MatrixLaboratory
              onCompleteChallenge={() => handleFinishMission('matrix_architect', 50)}
            />
          )}

          {activeMission === 'gradient_race' && (
            <GradientDescentSimulator
              onCompleteChallenge={() => handleFinishMission('gradient_race', 60)}
            />
          )}

          {activeMission === 'probability_detective' && (
            <ProbabilitySimulator
              onCompleteChallenge={() => handleFinishMission('probability_detective', 50)}
            />
          )}

          {activeMission === 'neural_boss_fight' && (
            <NeuralNetworkSandbox
              onCompleteChallenge={() => handleFinishMission('neural_boss_fight', 80)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MissionsView;
