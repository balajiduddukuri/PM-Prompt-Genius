
import React, { useState, useEffect, useRef } from 'react';
import { PromptItem } from '../types';
import { generateContent } from '../services/geminiService';
import { X, Send, Sparkles, Loader2, Maximize2, Minimize2, Check } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface PlaygroundProps {
  item: PromptItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const MOTIVATIONAL_QUOTES = [
  "Creativity takes courage. - Henri Matisse",
  "The art of simplicity is a puzzle of complexity. - Douglas Horton",
  "Design is not just what it looks like, it is how it works. - Steve Jobs",
  "Quality is not an act, it is a habit. - Aristotle",
  "Simplicity is the ultimate sophistication. - Leonardo da Vinci",
  "Every great design begins with an even better story. - Lorinda Mamo",
  "Innovation distinguishes between a leader and a follower. - Steve Jobs",
  "Code is poetry. - WordPress",
];

export const Playground: React.FC<PlaygroundProps> = ({ item, isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [randomQuote, setRandomQuote] = useState('');
  
  const responseEndRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { playClick, theme } = useTheme();

  useEffect(() => {
    if (isOpen) {
      setRandomQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (item) {
      setInput(item.text);
      setResponse('');
      setAnnouncement(`Loaded prompt: ${item.title}`);
    } else {
      // Clear input if opened without item
      setInput('');
      setResponse('');
    }
  }, [item, isOpen]);

  // Focus trap and focus management
  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
        if (e.key === 'Tab' && modalRef.current) {
            const focusableElements = modalRef.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
      };
      
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Only scroll when response updates, not on every render
  useEffect(() => {
    if (response && responseEndRef.current) {
        responseEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [response]);

  if (!isOpen) return null;

  const handleRun = async () => {
    playClick();
    if (!input.trim()) return;
    
    setIsLoading(true);
    setResponse('');
    setAnnouncement("Generative AI is processing. Please wait.");
    
    const result = await generateContent(input);
    
    setResponse(result);
    setIsLoading(false);
    setAnnouncement("Response generated successfully.");
  };

  const modalBg = theme === 'high-contrast' ? 'bg-black border-2 border-white' : 'bg-stone-50';
  const textPrimary = theme === 'high-contrast' ? 'text-yellow-400' : 'text-stone-900';

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/80 backdrop-blur-sm p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="playground-title"
    >
        {/* Visually hidden live region for screen reader announcements */}
        <div className="sr-only" role="status" aria-live="polite">
            {announcement}
        </div>

      <div 
        ref={modalRef}
        className={`${modalBg} rounded-lg shadow-2xl flex flex-col transition-all duration-300 w-full ${
            isExpanded ? 'max-w-7xl h-[95vh]' : 'max-w-4xl h-[650px]'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${theme === 'high-contrast' ? 'border-white' : 'border-stone-200 bg-white'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${theme === 'high-contrast' ? 'bg-white text-black' : 'bg-klimt-gold text-white'}`}>
                <Sparkles size={20} aria-hidden="true" />
            </div>
            <div>
                <h2 id="playground-title" className={`font-serif font-bold text-lg ${textPrimary}`}>Artist's Playground</h2>
                <p className="text-xs uppercase tracking-wider font-bold opacity-60">Gemini Powered</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
                onClick={() => { playClick(); setIsExpanded(!isExpanded); }}
                className="p-2 hover:bg-stone-200 rounded-full transition-colors focus:ring-2 focus:ring-klimt-gold"
                aria-label={isExpanded ? "Collapse view" : "Expand view"}
            >
                {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            <button 
                ref={closeButtonRef}
                onClick={() => { playClick(); onClose(); }}
                className="p-2 hover:bg-red-100 hover:text-red-700 rounded-full transition-colors focus:ring-2 focus:ring-red-500"
                aria-label="Close Playground"
            >
                <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            {/* Left: Input */}
            <div className={`p-5 flex flex-col border-b md:border-b-0 md:border-r ${theme === 'high-contrast' ? 'border-white' : 'border-stone-200'} md:w-1/2 h-1/2 md:h-full`}>
                <label htmlFor="prompt-input" className={`text-sm font-bold uppercase mb-2 ${textPrimary}`}>Input Canvas</label>
                <textarea
                    id="prompt-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className={`
                        flex-1 w-full p-4 border-2 rounded-lg resize-none font-mono text-sm leading-relaxed
                        focus:outline-none focus:ring-4 focus:ring-klimt-gold
                        ${theme === 'high-contrast' 
                            ? 'bg-black text-white border-white' 
                            : 'bg-white border-stone-300 text-stone-800 focus:border-klimt-gold'}
                    `}
                    placeholder="Enter your prompt here..."
                />
                <div className="mt-4 flex justify-end items-center">
                    <button
                        onClick={handleRun}
                        disabled={isLoading || !input.trim()}
                        aria-busy={isLoading}
                        className={`
                            flex items-center gap-2 px-6 py-3 rounded-lg font-bold uppercase tracking-wider transition-all
                            disabled:opacity-50 disabled:cursor-not-allowed
                            focus:ring-4 focus:ring-offset-2
                            ${theme === 'high-contrast'
                                ? 'bg-white text-black border-2 border-white hover:bg-yellow-400'
                                : 'bg-gogh-blue text-white hover:bg-blue-900 shadow-lg'}
                        `}
                    >
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        {isLoading ? 'Painting...' : 'Generate'}
                    </button>
                </div>
            </div>

            {/* Right: Output */}
            <div className={`p-5 flex flex-col md:w-1/2 h-1/2 md:h-full ${theme === 'high-contrast' ? 'bg-black' : 'bg-stone-100'}`}>
                <label className={`text-sm font-bold uppercase mb-2 flex justify-between items-center ${textPrimary}`}>
                    <span>Masterpiece Output</span>
                    {response && <span className="text-xs text-green-600 font-bold flex items-center gap-1"><Check size={12}/> Ready</span>}
                </label>
                <div 
                    className={`
                        flex-1 border-2 rounded-lg p-4 overflow-y-auto font-mono text-sm whitespace-pre-wrap
                        ${theme === 'high-contrast' 
                            ? 'bg-black text-yellow-400 border-white' 
                            : 'bg-white border-stone-200 text-stone-800 shadow-inner'}
                    `}
                    tabIndex={0}
                    role="region"
                    aria-label="Generated Response"
                >
                    {response ? (
                        response
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center opacity-40 px-6">
                            {isLoading ? (
                                <div className="text-center">
                                    <Loader2 size={40} className="animate-spin mx-auto mb-4 text-klimt-gold" />
                                    <p className="font-serif italic">Consulting the muse...</p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <Sparkles size={40} className="mx-auto mb-4" />
                                    <p className="font-serif italic text-lg leading-relaxed">
                                      "{randomQuote}"
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                    <div ref={responseEndRef} />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
