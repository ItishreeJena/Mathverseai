import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math: string;
  display?: boolean;
  className?: string;
}

export const MathView: React.FC<MathViewProps> = ({ math, display = false, className = '' }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: display,
        throwOnError: false,
        strict: false,
      });
    } catch (e) {
      console.warn('KaTeX render error:', e);
      return `<code class="text-rose-400 font-mono text-xs">${math}</code>`;
    }
  }, [math, display]);

  return (
    <span
      className={`inline-block font-serif ${display ? 'block my-3 text-center overflow-x-auto py-1 text-slate-100' : 'text-cyan-300 font-medium'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MathView;
