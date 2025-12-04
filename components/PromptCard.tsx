import React, { useState } from 'react';
import { PromptItem } from '../types';
import { Copy, Check, Play, Tag } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface PromptCardProps {
  item: PromptItem;
  onTryIt: (item: PromptItem) => void;
  index: number;
}

export const PromptCard: React.FC<PromptCardProps> = ({ item, onTryIt, index }) => {
  const [copied, setCopied] = useState(false);
  const { playClick, theme } = useTheme();

  const handleCopy = () => {
    playClick();
    navigator.clipboard.writeText(item.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isKlimt = index % 2 === 0;
  
  // "Frame" Logic
  let frameStyle = "bg-white border-[12px] border-stone-200 shadow-2xl"; // Default Light/Dark
  if (theme === 'high-contrast') {
    frameStyle = "bg-black border-4 border-yellow-400 text-white";
  } else if (theme === 'neon') {
    frameStyle = "bg-neon-bg border-2 border-neon-purple shadow-neon text-stone-200 hover:border-neon-pink hover:shadow-[0_0_25px_rgba(255,0,255,0.4)]";
  }

  // Header Pattern
  let headerPattern = "";
  if (theme === 'high-contrast') {
    headerPattern = "bg-black border-b-2 border-yellow-400";
  } else if (theme === 'neon') {
    headerPattern = "bg-neon-surface border-b border-neon-purple/50 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-neon-purple/20 to-transparent";
  } else {
    // Light/Dark Art Mode
    headerPattern = isKlimt 
        ? "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-klimt-gold via-yellow-600 to-yellow-800"
        : "bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-gogh-blue via-blue-800 to-stone-900";
  }

  // Title Style
  const titleStyle = theme === 'high-contrast' 
    ? 'text-yellow-400 decoration-yellow-400 underline decoration-2 underline-offset-4' 
    : theme === 'neon'
        ? 'text-neon-pink font-mono tracking-tighter drop-shadow-md'
        : 'text-white drop-shadow-md';

  return (
    <article 
        className={`
            relative group flex flex-col h-full transition-transform duration-300 hover:-translate-y-1
            ${frameStyle}
        `}
        aria-labelledby={`prompt-title-${item.id}`}
    >
      {/* Canvas Texture Overlay for Art Feel (Light/Dark only) */}
      {(theme === 'light' || theme === 'dark') && (
        <div className="absolute inset-0 bg-canvas-texture opacity-30 pointer-events-none z-10"></div>
      )}

      {/* Art Header / Title Plate */}
      <div className={`p-5 ${headerPattern} relative z-20 shadow-md`}>
         <h3 
            id={`prompt-title-${item.id}`}
            className={`font-serif text-xl font-bold leading-tight tracking-wide ${titleStyle}`}
         >
            {item.title}
         </h3>
      </div>

      <div className={`p-6 flex-1 z-20 flex flex-col ${theme === 'neon' ? 'bg-black/50' : 'bg-stone-50/50 backdrop-blur-sm'}`}>
        {item.tags && (
          <div className="flex flex-wrap gap-2 mb-4" aria-label="Topic Tags">
            {item.tags.map(tag => (
              <span 
                key={tag} 
                className={`
                    inline-flex items-center px-2 py-1 text-xs font-bold uppercase tracking-wider border
                    ${theme === 'high-contrast' 
                        ? 'bg-black text-white border-white' 
                        : theme === 'neon'
                            ? 'bg-neon-surface text-neon-green border-neon-green/50 font-mono'
                            : 'bg-white text-stone-600 border-stone-300 shadow-sm'}
                `}
              >
                <Tag size={10} className="mr-1" aria-hidden="true" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className={`
            p-5 rounded-none border-l-4 font-mono text-sm leading-relaxed whitespace-pre-wrap flex-1 mb-4
            ${theme === 'high-contrast' 
                ? 'bg-black text-white border-yellow-400' 
                : theme === 'neon'
                    ? 'bg-black text-stone-300 border-neon-cyan/50 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]'
                    : 'bg-white text-stone-800 border-klimt-gold shadow-inner'}
        `}>
          {item.text}
        </div>

        {item.codeSnippet && (
          <div className="mt-2 mb-4">
            <div className="text-xs font-bold uppercase mb-1 flex justify-between items-center text-stone-600 border-b border-stone-300 pb-1">
                <span className={theme === 'neon' ? 'text-neon-cyan' : ''}>{item.codeSnippet.language}</span>
            </div>
            <pre 
                className={`p-3 text-xs overflow-x-auto font-mono border ${
                    theme === 'high-contrast' ? 'bg-black text-yellow-400 border-white' : 
                    theme === 'neon' ? 'bg-gray-900 text-neon-green border-neon-green/30' : 
                    'bg-stone-900 text-stone-100 border-stone-800'
                }`}
                tabIndex={0}
                aria-label={`Code snippet in ${item.codeSnippet.language}`}
            >
              <code>{item.codeSnippet.code}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className={`
        px-6 py-4 border-t flex justify-end gap-4 z-20
        ${theme === 'high-contrast' ? 'border-white bg-black' : 
          theme === 'neon' ? 'bg-neon-bg border-neon-purple/50' : 
          'bg-stone-100 border-stone-200'}
      `}>
        <button
          onClick={handleCopy}
          aria-label={copied ? "Prompt copied to clipboard" : "Copy prompt to clipboard"}
          aria-pressed={copied}
          className={`
            flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wide border-2 transition-all group-hover/btn:underline
            focus:ring-4 focus:ring-offset-2
            ${copied 
              ? 'bg-green-700 text-white border-green-700' 
              : theme === 'high-contrast' 
                ? 'bg-black text-white border-white hover:bg-white hover:text-black hover:underline decoration-2'
                : theme === 'neon'
                    ? 'bg-transparent text-neon-cyan border-neon-cyan hover:bg-neon-cyan hover:text-black hover:shadow-neon-cyan'
                    : 'bg-white text-stone-700 border-stone-400 hover:border-klimt-gold hover:text-klimt-text hover:underline decoration-klimt-gold decoration-2'
            }
          `}
        >
          {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
        
        <button
          onClick={() => { playClick(); onTryIt(item); }}
          className={`
            flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wide border-2 transition-all shadow-md
            focus:ring-4 focus:ring-offset-2
            ${theme === 'high-contrast'
                ? 'bg-yellow-400 text-black border-yellow-400 hover:bg-white hover:underline decoration-2'
                : theme === 'neon'
                    ? 'bg-transparent text-neon-pink border-neon-pink hover:bg-neon-pink hover:text-white hover:shadow-neon'
                    : 'bg-gogh-blue text-white border-gogh-blue hover:bg-blue-900 hover:border-blue-900 hover:underline decoration-white decoration-2'
            }
          `}
        >
          <Play size={16} fill="currentColor" aria-hidden="true" />
          <span>Playground</span>
        </button>
      </div>
    </article>
  );
};