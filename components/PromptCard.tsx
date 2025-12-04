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
  
  // "Frame" Logic: High Contrast vs Art Mode
  const frameStyle = theme === 'high-contrast' 
    ? "bg-black border-4 border-yellow-400 text-white"
    : "bg-white border-[12px] border-stone-200 shadow-2xl";

  const headerPattern = theme === 'high-contrast'
    ? "bg-black border-b-2 border-yellow-400"
    : isKlimt 
        ? "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-klimt-gold via-yellow-600 to-yellow-800"
        : "bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-gogh-blue via-blue-800 to-stone-900";

  return (
    <article 
        className={`
            relative group flex flex-col h-full transition-transform duration-300 hover:-translate-y-1
            ${frameStyle}
        `}
        aria-labelledby={`prompt-title-${item.id}`}
    >
      {/* Canvas Texture Overlay for Art Feel */}
      {theme !== 'high-contrast' && (
        <div className="absolute inset-0 bg-canvas-texture opacity-30 pointer-events-none z-10"></div>
      )}

      {/* Art Header / Title Plate */}
      <div className={`p-5 ${headerPattern} relative z-20 shadow-md`}>
         <h3 
            id={`prompt-title-${item.id}`}
            className={`font-serif text-xl font-bold leading-tight tracking-wide ${theme === 'high-contrast' ? 'text-yellow-400 decoration-yellow-400 underline decoration-2 underline-offset-4' : 'text-white drop-shadow-md'}`}
         >
            {item.title}
         </h3>
      </div>

      <div className="p-6 flex-1 z-20 flex flex-col bg-stone-50/50 backdrop-blur-sm">
        {item.tags && (
          <div className="flex flex-wrap gap-2 mb-4" aria-label="Topic Tags">
            {item.tags.map(tag => (
              <span 
                key={tag} 
                className={`
                    inline-flex items-center px-2 py-1 text-xs font-bold uppercase tracking-wider border
                    ${theme === 'high-contrast' 
                        ? 'bg-black text-white border-white' 
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
                : 'bg-white text-stone-800 border-klimt-gold shadow-inner'}
        `}>
          {item.text}
        </div>

        {item.codeSnippet && (
          <div className="mt-2 mb-4">
            <div className="text-xs font-bold uppercase mb-1 flex justify-between items-center text-stone-600 border-b border-stone-300 pb-1">
                <span>{item.codeSnippet.language}</span>
            </div>
            <pre 
                className={`p-3 text-xs overflow-x-auto font-mono border ${theme === 'high-contrast' ? 'bg-black text-yellow-400 border-white' : 'bg-stone-900 text-stone-100 border-stone-800'}`}
                tabIndex={0}
                aria-label={`Code snippet in ${item.codeSnippet.language}`}
            >
              <code>{item.codeSnippet.code}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Action Footer (Gallery Placard Style) */}
      <div className={`
        px-6 py-4 border-t flex justify-end gap-4 z-20
        ${theme === 'high-contrast' ? 'border-white bg-black' : 'bg-stone-100 border-stone-200'}
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