import React, { useState } from 'react';
import MathView from '../common/MathView';
import { Code2, Copy, Check, Sparkles, Terminal, Cpu, ArrowRight, Layers, X } from 'lucide-react';

interface MathToCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEarnXp?: (amount: number) => void;
}

interface CodeResult {
  concept: string;
  formula: string;
  explanation: string;
  numpyCode: string;
  pytorchCode: string;
  shapes: string;
  practicalNote: string;
}

const PRESET_TOPICS = [
  { id: 'attention', label: 'Scaled Dot-Product Attention', formula: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V' },
  { id: 'cross_entropy', label: 'Cross-Entropy Loss', formula: '\\mathcal{L}_{\\text{CE}} = -\\sum y_i \\log(\\hat{y}_i)' },
  { id: 'cosine_sim', label: 'Cosine Similarity & Embeddings', formula: '\\cos(\\theta) = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\| \\|\\mathbf{v}\\|}' },
  { id: 'gradient_momentum', label: 'Gradient Descent with Momentum', formula: 'v_t = \\beta v_{t-1} + \\eta \\nabla L(\\theta), \\quad \\theta_t = \\theta_{t-1} - v_t' },
  { id: 'softmax', label: 'Softmax Activation with Temperature', formula: '\\sigma(z_i) = \\frac{e^{z_i / T}}{\\sum_j e^{z_j / T}}' },
  { id: 'svd_lora', label: 'SVD Low-Rank Approximation (LoRA)', formula: 'W \\approx W_0 + B A, \\quad A \\in \\mathbb{R}^{r \\times d_{in}}, B \\in \\mathbb{R}^{d_{out} \\times r}' },
];

export const MathToCodeModal: React.FC<MathToCodeModalProps> = ({ isOpen, onClose, onEarnXp }) => {
  const [selectedTopic, setSelectedTopic] = useState(PRESET_TOPICS[0]);
  const [customInput, setCustomInput] = useState('');
  const [activeTab, setActiveTab] = useState<'pytorch' | 'numpy'>('pytorch');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<CodeResult | null>(null);
  const [viewedCount, setViewedCount] = useState(0);

  if (!isOpen) return null;

  const handleFetchCode = async (conceptName: string, formulaStr: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/math/code-convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concept: conceptName, formula: formulaStr }),
      });
      const data = await res.json();
      if (data.result) {
        setResult(data.result);
        if (onEarnXp && viewedCount < 3) {
          onEarnXp(15);
          setViewedCount(prev => prev + 1);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (preset: typeof PRESET_TOPICS[0]) => {
    setSelectedTopic(preset);
    handleFetchCode(preset.label, preset.formula);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    handleFetchCode(customInput.trim(), '');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Initial load
  if (!result && !isLoading) {
    handleFetchCode(selectedTopic.label, selectedTopic.formula);
  }

  const activeCode = result ? (activeTab === 'pytorch' ? result.pytorchCode : result.numpyCode) : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white font-display">Math-to-Code Lab</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 font-medium">
                  PyTorch & NumPy Generator
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Bridge mathematical formulas directly into production neural network implementations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {/* Preset Buttons */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Select AI Mathematical Primitive
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_TOPICS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                    selectedTopic.id === preset.id
                      ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                  }`}
                >
                  <Sparkles className="w-3 h-3 opacity-70" />
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom prompt input */}
          <form onSubmit={handleCustomSubmit} className="flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Or enter any formula/concept (e.g. Batch Normalization, Adam Optimizer, GELU activation)..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={isLoading || !customInput.trim()}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2"
            >
              {isLoading ? 'Converting...' : 'Generate Code'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Results display */}
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm">Synthesizing mathematical tensor equations into vectorized code...</p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              {/* Formula & Explanation Card */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-cyan-400">{result.concept}</h4>
                  <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full font-mono">
                    {result.shapes}
                  </span>
                </div>
                <div className="py-2 overflow-x-auto text-center">
                  <MathView math={result.formula} display={true} className="text-indigo-200" />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{result.explanation}</p>
                <div className="text-xs text-amber-300/90 bg-amber-950/30 border border-amber-800/40 rounded-lg p-2.5 flex items-start gap-2">
                  <Cpu className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>AI Architecture Note:</strong> {result.practicalNote}</span>
                </div>
              </div>

              {/* Code Panel */}
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                {/* Code Header */}
                <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('pytorch')}
                      className={`px-3 py-1 text-xs rounded-lg font-medium transition flex items-center gap-1.5 ${
                        activeTab === 'pytorch'
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      PyTorch (torch.Tensor)
                    </button>
                    <button
                      onClick={() => setActiveTab('numpy')}
                      className={`px-3 py-1 text-xs rounded-lg font-medium transition flex items-center gap-1.5 ${
                        activeTab === 'numpy'
                          ? 'bg-cyan-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      NumPy (Vectorized np.ndarray)
                    </button>
                  </div>

                  <button
                    onClick={() => handleCopy(activeCode)}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md transition"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Code Content */}
                <div className="p-4 overflow-x-auto font-mono text-xs text-slate-200 leading-relaxed whitespace-pre bg-slate-950 selection:bg-cyan-900">
                  {activeCode}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Tip: PyTorch operations utilize GPU acceleration and automatic autograd for backpropagation.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
          >
            Close Lab
          </button>
        </div>
      </div>
    </div>
  );
};

export default MathToCodeModal;
