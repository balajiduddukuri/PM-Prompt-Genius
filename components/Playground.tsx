import React, { useState, useEffect, useRef } from 'react';
import { PromptItem } from '../types';
import { generateContent, streamChat, ChatMessage } from '../services/geminiService';
import { X, Send, Sparkles, Loader2, Maximize2, Minimize2, Check, Brain, MessageSquare, Terminal } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface PlaygroundProps {
  item: PromptItem | null;
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'generator' | 'chat';
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

export const Playground: React.FC<PlaygroundProps> = ({ item, isOpen, onClose, initialMode = 'generator' }) => {
  // Modes
  const [mode, setMode] = useState<'generator' | 'chat'>(initialMode);
  const [isThinking, setIsThinking] = useState(false);

  // Generator State
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  
  // Chat State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  // Common State
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [randomQuote, setRandomQuote] = useState('');
  
  const responseEndRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { playClick, theme } = useTheme();

  useEffect(() => {
    if (isOpen) {
      setRandomQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  useEffect(() => {
    if (item) {
      setInput(item.text);
      setResponse('');
      setAnnouncement(`Loaded prompt: ${item.title}`);
      setMode('generator'); // Force generator mode if opening a specific prompt
    } else if (initialMode === 'generator') {
      setInput('');
      setResponse('');
    }
  }, [item, isOpen, initialMode]);

  // Focus trap
  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Scroll Handling
  useEffect(() => {
    if (response && responseEndRef.current) responseEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [response]);

  useEffect(() => {
    if (chatHistory.length > 0 && chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isStreaming]);

  if (!isOpen) return null;

  // --- Handlers ---

  const handleRunGenerator = async () => {
    playClick();
    if (!input.trim()) return;
    
    setIsLoading(true);
    setResponse('');
    setAnnouncement("Generative AI is processing. Please wait.");
    
    const result = await generateContent(input, { useThinking: isThinking });
    
    setResponse(result);
    setIsLoading(false);
    setAnnouncement("Response generated successfully.");
  };

  const handleSendChat = async () => {
    playClick();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: chatInput };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setIsStreaming(true);
    setAnnouncement("Sending message...");

    // Placeholder for AI message
    setChatHistory(prev => [...prev, { role: 'model', text: '' }]);

    let fullText = '';
    
    // Stream response
    for await (const chunk of streamChat(chatHistory, userMsg.text, { useThinking: isThinking })) {
        fullText += chunk;
        setChatHistory(prev => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1] = { role: 'model', text: fullText };
            return newHistory;
        });
    }

    setIsStreaming(false);
    setAnnouncement("Chat response complete.");
  };

  // --- Styles ---

  const modalBg = theme === 'high-contrast' ? 'bg-black border-2 border-white' : 'bg-stone-50';
  const textPrimary = theme === 'high-contrast' ? 'text-yellow-400' : 'text-stone-900';
  const thinkingColor = isThinking 
    ? (theme === 'high-contrast' ? 'text-cyan-400' : 'text-purple-600') 
    : (theme === 'high-contrast' ? 'text-gray-500' : 'text-stone-400');

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/80 backdrop-blur-sm p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="playground-title"
    >
        <div className="sr-only" role="status" aria-live="polite">{announcement}</div>

      <div 
        ref={modalRef}
        className={`${modalBg} rounded-lg shadow-2xl flex flex-col transition-all duration-300 w-full ${
            isExpanded ? 'max-w-7xl h-[95vh]' : 'max-w-4xl h-[700px]'
        }`}
      >
        {/* Header */}
        <div className={`flex flex-col md:flex-row md:items-center justify-between p-4 border-b gap-4 ${theme === 'high-contrast' ? 'border-white' : 'border-stone-200 bg-white'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${theme === 'high-contrast' ? 'bg-white text-black' : 'bg-klimt-gold text-white'}`}>
                <Sparkles size={20} aria-hidden="true" />
            </div>
            <div>
                <h2 id="playground-title" className={`font-serif font-bold text-lg ${textPrimary}`}>Artist's Playground</h2>
                <p className="text-xs uppercase tracking-wider font-bold opacity-60">Gemini Powered</p>
            </div>
          </div>

          {/* Controls Center */}
          <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-lg border border-stone-200 mx-auto md:mx-0">
             <button
                onClick={() => setMode('generator')}
                className={`px-3 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 transition-colors ${mode === 'generator' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-900'}`}
             >
                <Terminal size={14} /> Generator
             </button>
             <button
                onClick={() => setMode('chat')}
                className={`px-3 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 transition-colors ${mode === 'chat' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-500 hover:text-stone-900'}`}
             >
                <MessageSquare size={14} /> Chat
             </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Thinking Toggle */}
            <button
                onClick={() => { playClick(); setIsThinking(!isThinking); }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${isThinking 
                    ? (theme === 'high-contrast' ? 'border-cyan-400 bg-black text-cyan-400' : 'border-purple-200 bg-purple-50 text-purple-700')
                    : 'border-transparent text-stone-400 hover:bg-stone-100'}`}
                title="Enable Thinking Mode (Gemini 3.0 Pro)"
                aria-pressed={isThinking}
            >
                <Brain size={18} className={isThinking ? "animate-pulse" : ""} />
                <span className="text-xs font-bold uppercase hidden sm:inline">Thinking {isThinking ? 'On' : 'Off'}</span>
            </button>

            <div className="w-px h-6 bg-stone-300 mx-1 hidden md:block"></div>

            <button 
                onClick={() => { playClick(); setIsExpanded(!isExpanded); }}
                className="p-2 hover:bg-stone-200 rounded-full transition-colors"
                aria-label={isExpanded ? "Collapse" : "Expand"}
            >
                {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            <button 
                ref={closeButtonRef}
                onClick={() => { playClick(); onClose(); }}
                className="p-2 hover:bg-red-100 hover:text-red-700 rounded-full transition-colors"
                aria-label="Close"
            >
                <X size={24} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {mode === 'generator' ? (
             <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                {/* Generator Input */}
                <div className={`p-5 flex flex-col border-b md:border-b-0 md:border-r ${theme === 'high-contrast' ? 'border-white' : 'border-stone-200'} md:w-1/2 h-1/2 md:h-full`}>
                    <label htmlFor="prompt-input" className={`text-sm font-bold uppercase mb-2 ${textPrimary}`}>Input Canvas</label>
                    <textarea
                        id="prompt-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className={`flex-1 w-full p-4 border-2 rounded-lg resize-none font-mono text-sm leading-relaxed focus:outline-none focus:ring-4 focus:ring-klimt-gold ${theme === 'high-contrast' ? 'bg-black text-white border-white' : 'bg-white border-stone-300 text-stone-800'}`}
                        placeholder="Enter your prompt here..."
                    />
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleRunGenerator}
                            disabled={isLoading || !input.trim()}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold uppercase tracking-wider transition-all disabled:opacity-50 ${theme === 'high-contrast' ? 'bg-white text-black hover:bg-yellow-400' : 'bg-gogh-blue text-white hover:bg-blue-900 shadow-lg'}`}
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                            {isLoading ? 'Painting...' : 'Generate'}
                        </button>
                    </div>
                </div>

                {/* Generator Output */}
                <div className={`p-5 flex flex-col md:w-1/2 h-1/2 md:h-full ${theme === 'high-contrast' ? 'bg-black' : 'bg-stone-100'}`}>
                    <label className={`text-sm font-bold uppercase mb-2 flex justify-between items-center ${textPrimary}`}>
                        <span>Result</span>
                        {response && <span className="text-xs text-green-600 font-bold flex items-center gap-1"><Check size={12}/> Ready</span>}
                    </label>
                    <div className={`flex-1 border-2 rounded-lg p-4 overflow-y-auto font-mono text-sm whitespace-pre-wrap ${theme === 'high-contrast' ? 'bg-black text-yellow-400 border-white' : 'bg-white border-stone-200 text-stone-800 shadow-inner'}`} tabIndex={0}>
                        {response || <EmptyState isLoading={isLoading} quote={randomQuote} />}
                        <div ref={responseEndRef} />
                    </div>
                </div>
             </div>
        ) : (
            // Chat Mode Interface
            <div className="flex-1 flex flex-col overflow-hidden bg-stone-50">
                 <div className={`flex-1 overflow-y-auto p-4 space-y-6 ${theme === 'high-contrast' ? 'bg-black' : 'bg-stone-100'}`}>
                    {chatHistory.length === 0 && <EmptyState isLoading={false} quote={randomQuote} isChat />}
                    
                    {chatHistory.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`
                                max-w-[85%] rounded-2xl px-5 py-3 shadow-sm font-mono text-sm whitespace-pre-wrap
                                ${msg.role === 'user' 
                                    ? (theme === 'high-contrast' ? 'bg-white text-black border border-white' : 'bg-gogh-blue text-white') 
                                    : (theme === 'high-contrast' ? 'bg-black text-yellow-400 border border-yellow-400' : 'bg-white text-stone-800 border border-stone-200')}
                            `}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isStreaming && (
                        <div className="flex justify-start">
                             <div className={`p-3 rounded-2xl flex items-center gap-2 ${theme === 'high-contrast' ? 'text-cyan-400' : 'text-stone-400'}`}>
                                <Loader2 size={16} className="animate-spin" />
                                <span className="text-xs font-bold uppercase">Thinking...</span>
                             </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                 </div>

                 <div className={`p-4 border-t ${theme === 'high-contrast' ? 'bg-black border-white' : 'bg-white border-stone-200'}`}>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !isStreaming && handleSendChat()}
                            placeholder={isThinking ? "Ask a complex question..." : "Type your message..."}
                            className={`flex-1 px-4 py-3 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-klimt-gold ${theme === 'high-contrast' ? 'bg-black text-white border-white' : 'bg-stone-50 border-stone-300'}`}
                        />
                        <button
                            onClick={handleSendChat}
                            disabled={!chatInput.trim() || isStreaming}
                            className={`p-3 rounded-full transition-all disabled:opacity-50 ${theme === 'high-contrast' ? 'bg-white text-black' : 'bg-klimt-gold text-white hover:bg-yellow-600'}`}
                        >
                            <Send size={20} />
                        </button>
                    </div>
                 </div>
            </div>
        )}

      </div>
    </div>
  );
};

const EmptyState = ({ isLoading, quote, isChat }: { isLoading: boolean, quote: string, isChat?: boolean }) => (
    <div className="h-full flex flex-col items-center justify-center opacity-40 px-6">
        {isLoading ? (
            <div className="text-center">
                <Loader2 size={40} className="animate-spin mx-auto mb-4 text-klimt-gold" />
                <p className="font-serif italic">Consulting the muse...</p>
            </div>
        ) : (
            <div className="text-center">
                {isChat ? <MessageSquare size={40} className="mx-auto mb-4" /> : <Sparkles size={40} className="mx-auto mb-4" />}
                <p className="font-serif italic text-lg leading-relaxed">
                    "{quote}"
                </p>
                {isChat && <p className="text-xs font-bold uppercase mt-4">Start a conversation</p>}
            </div>
        )}
    </div>
);