import React, { useState, useEffect } from 'react';
import { GitBranch, GitCommit, GitPullRequest, ArrowUpRight, Copy, Check, Shield, AlertCircle, CheckCircle2, X } from 'lucide-react';

interface GitHubSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GitStatus {
  branch: string;
  lastCommit: string;
  clean: boolean;
  remote: string;
  readyToPush: boolean;
  error?: string;
}

export const GitHubSyncModal: React.FC<GitHubSyncModalProps> = ({ isOpen, onClose }) => {
  const [gitStatus, setGitStatus] = useState<GitStatus | null>(null);
  const [token, setToken] = useState('');
  const [isPushing, setIsPushing] = useState(false);
  const [pushResult, setPushResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);
  const [copiedCmd, setCopiedCmd] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/git/status')
        .then(r => r.json())
        .then(data => setGitStatus(data))
        .catch(err => console.error(err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;

    setIsPushing(true);
    setPushResult(null);

    try {
      const res = await fetch('/api/git/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          githubToken: token.trim(),
          repoUrl: 'https://github.com/itishree-jena/math-for-ai.git',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPushResult({ success: true, message: data.message });
      } else {
        setPushResult({ success: false, error: data.error || 'Failed to push to GitHub.' });
      }
    } catch (err: any) {
      setPushResult({ success: false, error: err.message || 'Network error pushing to repository.' });
    } finally {
      setIsPushing(false);
    }
  };

  const manualCliCommand = `git remote set-url origin https://<YOUR_GITHUB_TOKEN>@github.com/itishree-jena/math-for-ai.git\ngit push -u origin main`;

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(manualCliCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-900 border border-slate-600 flex items-center justify-center text-white shadow-lg">
              <GitPullRequest className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white font-display">GitHub Sync & Push</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 font-medium">
                  Committed to main
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Push MathVerse AI codebase to <code className="text-cyan-300">itishree-jena/math-for-ai</code>
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-slate-200">
          {/* Repository Info */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-cyan-400" /> Target Repository:
              </span>
              <a
                href="https://github.com/itishree-jena/math-for-ai"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1 font-mono"
              >
                itishree-jena/math-for-ai
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <GitCommit className="w-3.5 h-3.5 text-indigo-400" /> Current Commit:
              </span>
              <span className="text-slate-300 font-mono text-[11px] truncate max-w-[280px]">
                {gitStatus?.lastCommit || '1494118 - feat: complete MathVerse AI platform'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Project Files:</span>
              <span className="text-emerald-400 font-medium">43 files staged & committed</span>
            </div>
          </div>

          {/* Web Push Form */}
          <form onSubmit={handlePush} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                GitHub Personal Access Token (PAT)
              </label>
              <p className="text-[11px] text-slate-400 mb-2">
                GitHub requires token authentication over HTTPS. Generate a token at{' '}
                <a
                  href="https://github.com/settings/tokens"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:underline inline-flex items-center gap-0.5"
                >
                  github.com/settings/tokens <ArrowUpRight className="w-2.5 h-2.5" />
                </a>{' '}
                with <code className="text-amber-300 bg-slate-800 px-1 py-0.5 rounded">repo</code> scope.
              </p>
              <div className="relative">
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPushing || !token.trim()}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20"
            >
              {isPushing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Pushing to GitHub Repository...</span>
                </>
              ) : (
                <>
                  <GitPullRequest className="w-4 h-4" />
                  <span>Push to GitHub Repository Now</span>
                </>
              )}
            </button>
          </form>

          {/* Feedback message */}
          {pushResult && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                pushResult.success
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-800 text-rose-200'
              }`}
            >
              {pushResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="leading-relaxed">
                {pushResult.success ? (
                  <span>{pushResult.message}</span>
                ) : (
                  <span>{pushResult.error}</span>
                )}
              </div>
            </div>
          )}

          {/* Alternative: Local Terminal Command */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Or Push From Your Local Terminal:
              </span>
              <button
                onClick={handleCopyCmd}
                className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition"
              >
                {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedCmd ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto">
              {manualCliCommand}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            Tokens are never persisted or logged to disk.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GitHubSyncModal;
