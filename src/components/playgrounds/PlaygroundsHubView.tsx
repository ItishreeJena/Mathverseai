import React, { useState } from 'react';
import VectorPlayground from './VectorPlayground';
import MatrixLaboratory from './MatrixLaboratory';
import FunctionDerivativeExplorer from './FunctionDerivativeExplorer';
import GradientDescentSimulator from './GradientDescentSimulator';
import ProbabilitySimulator from './ProbabilitySimulator';
import StatisticsLaboratory from './StatisticsLaboratory';
import NeuralNetworkSandbox from './NeuralNetworkSandbox';
import LossFunctionExplorer from './LossFunctionExplorer';
import PcaPlayground from './PcaPlayground';

import {
  Compass,
  Grid,
  TrendingUp,
  Zap,
  Dice5,
  BarChart3,
  Cpu,
  Target,
  Layers
} from 'lucide-react';

interface PlaygroundsHubViewProps {
  initialPlayground?: string;
}

export const PlaygroundsHubView: React.FC<PlaygroundsHubViewProps> = ({ initialPlayground = 'vectors' }) => {
  const [activePlayground, setActivePlayground] = useState<string>(initialPlayground);

  const PLAYGROUNDS = [
    { id: 'vectors', title: 'Vector Space', icon: Compass, component: <VectorPlayground /> },
    { id: 'matrices', title: 'Matrix Laboratory', icon: Grid, component: <MatrixLaboratory /> },
    { id: 'derivatives', title: 'Derivatives & Tangents', icon: TrendingUp, component: <FunctionDerivativeExplorer /> },
    { id: 'gradient_descent', title: 'Gradient Descent', icon: Zap, component: <GradientDescentSimulator /> },
    { id: 'probability', title: 'Probability & Distributions', icon: Dice5, component: <ProbabilitySimulator /> },
    { id: 'statistics', title: 'Statistics & Outliers', icon: BarChart3, component: <StatisticsLaboratory /> },
    { id: 'neural_network', title: 'Neural Net Sandbox', icon: Cpu, component: <NeuralNetworkSandbox /> },
    { id: 'loss_functions', title: 'Loss Function Dynamics', icon: Target, component: <LossFunctionExplorer /> },
    { id: 'pca', title: 'PCA Dimensionality', icon: Layers, component: <PcaPlayground /> },
  ];

  const current = PLAYGROUNDS.find(p => p.id === activePlayground) || PLAYGROUNDS[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold mb-1">
          Interactive Science Laboratory
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Visual Mathematics Playgrounds
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1">
          Explore all 9 working mathematical simulators. Manipulate parameters in real time with mathematically exact feedback.
        </p>

        {/* Playground Tab Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs mt-6 pt-4 border-t border-slate-800 pb-1">
          {PLAYGROUNDS.map(p => {
            const Icon = p.icon;
            const isActive = activePlayground === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePlayground(p.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{p.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active Playground */}
      <div className="transition-all">
        {current.component}
      </div>
    </div>
  );
};

export default PlaygroundsHubView;
