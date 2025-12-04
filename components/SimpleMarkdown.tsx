import React from 'react';
import { useTheme } from '../hooks/useTheme';
import { Copy, Check } from 'lucide-react';

interface MarkdownProps {
  content: string;
}

export const SimpleMarkdown: React.FC<MarkdownProps> = ({ content }) => {
  const { theme, playClick } = useTheme();
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const handleCopy = (code: string, index: number) => {
      playClick();
      navigator.clipboard.writeText(code);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Regex to split by code blocks: ```lang ... ```
  // Capturing groups: 1=lang, 2=code
  const parts = content.split(/```(\w+)?\n([\s\S]*?)```/g);

  // Styles based on theme
  const codeBlockStyle = theme === 'high-contrast'
    ? 'bg-black border border-white text-yellow-400'
    : theme === 'neon'
      ? 'bg-gray-900 border border-neon-cyan/30 text-neon-green shadow-sm'
      : 'bg-stone-900 text-stone-100 border border-stone-800';

  const inlineCodeStyle = theme === 'high-contrast'
    ? 'bg-white text-black font-bold px-1'
    : theme === 'neon'
        ? 'bg-neon-purple/20 text-neon-pink px-1 rounded'
        : 'bg-stone-200 text-stone-800 px-1 rounded';

  const headerStyle = theme === 'neon' ? 'text-neon-pink' : theme === 'high-contrast' ? 'text-yellow-400 underline' : 'text-stone-900';

  const parseInline = (text: string) => {
      // Split by bold (**...**) and inline code (`...`)
      const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
      return parts.map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={index} className={theme === 'neon' ? 'text-neon-cyan' : ''}>{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith('`') && part.endsWith('`')) {
              return <code key={index} className={`font-mono text-sm ${inlineCodeStyle}`}>{part.slice(1, -1)}</code>;
          }
          return part;
      });
  }

  const renderText = (text: string) => {
    return text.split('\n').map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />;

        if (line.startsWith('### ')) {
            return <h4 key={i} className={`text-lg font-bold mt-4 mb-2 ${headerStyle}`}>{parseInline(line.replace('### ', ''))}</h4>;
        }
        if (line.startsWith('## ')) {
            return <h3 key={i} className={`text-xl font-bold mt-6 mb-3 border-b border-opacity-20 border-gray-500 pb-1 ${headerStyle}`}>{parseInline(line.replace('## ', ''))}</h3>;
        }
        if (line.startsWith('# ')) {
             return <h2 key={i} className={`text-2xl font-bold mt-6 mb-4 ${headerStyle}`}>{parseInline(line.replace('# ', ''))}</h2>;
        }
        if (line.trim().startsWith('- ')) {
            return <div key={i} className="ml-4 flex gap-2 mb-1"><span className="opacity-50">•</span><span>{parseInline(line.replace(/^\-\s+/, ''))}</span></div>;
        }
        if (line.trim().match(/^\d+\. /)) {
            return <div key={i} className="ml-4 flex gap-2 mb-1"><span className="font-bold opacity-70">{line.match(/^\d+\. /)?.[0]}</span><span>{parseInline(line.replace(/^\d+\. /, ''))}</span></div>;
        }

        return <p key={i} className="mb-2 leading-relaxed whitespace-pre-wrap">{parseInline(line)}</p>;
    });
  };

  const elements = [];
  let i = 0;
  while (i < parts.length) {
      // Even index is text
      if (parts[i]) {
          elements.push(<div key={`text-${i}`}>{renderText(parts[i])}</div>);
      }
      
      // If there are more parts, next is Lang (i+1) and Code (i+2)
      if (i + 1 < parts.length) {
          const lang = parts[i+1] || 'text';
          const code = parts[i+2] || '';
          
          elements.push(
              <div key={`code-${i}`} className={`my-4 rounded-md overflow-hidden ${codeBlockStyle}`}>
                  <div className="flex justify-between items-center px-4 py-2 bg-white/5 border-b border-white/10">
                      <span className="text-xs uppercase font-bold opacity-70">{lang}</span>
                      <button 
                        onClick={() => handleCopy(code, i)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="Copy code"
                        aria-label="Copy code block"
                      >
                          {copiedIndex === i ? <Check size={14} className="text-green-500"/> : <Copy size={14} />}
                      </button>
                  </div>
                  <pre className="p-4 overflow-x-auto text-sm font-mono">
                      <code>{code}</code>
                  </pre>
              </div>
          );
          i += 3; 
      } else {
          i++;
      }
  }

  return <div className="markdown-body w-full">{elements}</div>;
};