import React, { useState, useMemo } from 'react';
import { PROMPT_SECTIONS } from './constants';
import { Sidebar } from './components/Sidebar';
import { PromptCard } from './components/PromptCard';
import { Playground } from './components/Playground';
import { PromptItem } from './types';
import { Search, Download, Menu, Sun, Moon, Eye, Zap, MessageSquare } from 'lucide-react';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const [activeSectionId, setActiveSectionId] = useState(PROMPT_SECTIONS[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [playgroundItem, setPlaygroundItem] = useState<PromptItem | null>(null);
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);
  const [playgroundMode, setPlaygroundMode] = useState<'generator' | 'chat'>('generator');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile menu state
  
  const { theme, setTheme, playClick } = useTheme();

  // Filter sections and items based on search
  const filteredSections = useMemo(() => {
    if (!searchTerm) return PROMPT_SECTIONS;

    const term = searchTerm.toLowerCase();
    
    return PROMPT_SECTIONS.map(section => {
      const matchesSectionTitle = section.title.toLowerCase().includes(term);
      const matchingItems = section.items.filter(item => 
        item.title.toLowerCase().includes(term) || 
        item.text.toLowerCase().includes(term) ||
        item.tags?.some(tag => tag.toLowerCase().includes(term))
      );

      if (matchesSectionTitle || matchingItems.length > 0) {
        return {
          ...section,
          items: matchesSectionTitle ? section.items : matchingItems
        };
      }
      return null;
    }).filter(Boolean) as typeof PROMPT_SECTIONS;
  }, [searchTerm]);

  const activeSection = filteredSections.find(s => s.id === activeSectionId) || filteredSections[0];
  const totalResults = activeSection ? activeSection.items.length : 0;

  const handleOpenPlayground = (item: PromptItem) => {
    setPlaygroundItem(item);
    setPlaygroundMode('generator');
    setIsPlaygroundOpen(true);
  };

  const handleOpenChat = () => {
    setPlaygroundItem(null);
    setPlaygroundMode('chat');
    setIsPlaygroundOpen(true);
  };

  const toggleTheme = () => {
    playClick();
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('high-contrast');
    else if (theme === 'high-contrast') setTheme('neon');
    else setTheme('light');
  };

  const handleExportBundle = () => {
      playClick();
      const bundle = {
          metadata: {
              title: "PM Prompt Genius Bundle",
              date: new Date().toISOString(),
              version: "1.0",
              author: "BalajiDuddukuri"
          },
          sections: PROMPT_SECTIONS
      };
      
      const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pm-prompt-bundle-${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun size={20} />;
    if (theme === 'dark') return <Moon size={20} />;
    if (theme === 'high-contrast') return <Eye size={20} />;
    return <Zap size={20} />;
  };

  const getThemeLabel = () => {
      if (theme === 'high-contrast') return 'Contrast';
      if (theme === 'neon') return 'Neon';
      return theme;
  }

  // Dynamic Styles
  const bgClass = {
    'light': 'bg-stone-50 text-stone-900',
    'dark': 'bg-stone-900 text-stone-50', // Dark mode handled via 'dark' class mostly, but explicit here too
    'high-contrast': 'bg-black text-white',
    'neon': 'bg-neon-bg text-neon-cyan'
  }[theme];

  const headerClass = {
    'light': 'bg-white/95 backdrop-blur-md border-stone-200',
    'dark': 'bg-stone-900/95 border-stone-800',
    'high-contrast': 'bg-black border-white',
    'neon': 'bg-neon-bg/95 border-neon-pink/50 shadow-[0_4px_10px_rgba(255,0,255,0.15)]'
  }[theme];

  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-300 relative ${bgClass}`}>
      
      {/* Background Texture for "Canvas" feel */}
      {(theme === 'light' || theme === 'dark') && (
        <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none z-0 mix-blend-multiply"></div>
      )}
      
      {/* Grid line texture for Neon */}
      {theme === 'neon' && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{
            backgroundImage: 'linear-gradient(rgba(255, 0, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 0, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
        }}></div>
      )}

      <a href="#main-content" className="skip-link">Skip to main content</a>

      <Sidebar 
        sections={PROMPT_SECTIONS} 
        activeSectionId={activeSectionId} 
        isOpen={isSidebarOpen}
        onSelectSection={(id) => {
            setActiveSectionId(id);
            setSearchTerm('');
            setIsSidebarOpen(false); // Close mobile menu on select
        }}
      />

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
        ></div>
      )}

      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Top Header */}
        <header 
            className={`
                px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm border-b
                ${headerClass}
            `}
            role="banner"
        >
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden p-2 rounded-md hover:bg-stone-200 focus:outline-none focus:ring-2 focus:ring-klimt-gold"
                aria-label={isSidebarOpen ? "Close Menu" : "Open Menu"}
                aria-expanded={isSidebarOpen}
            >
                <Menu size={24} />
            </button>

            <div className="relative w-full md:w-96 group" role="search">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className={theme === 'high-contrast' ? 'text-white' : theme === 'neon' ? 'text-neon-pink' : 'text-stone-400'} aria-hidden="true" />
              </div>
              <input
                type="text"
                id="search-input"
                placeholder={theme === 'neon' ? "INIT_QUERY..." : "Find your muse (WBS, Risk, Code)..."}
                className={`
                    pl-10 pr-4 py-2 w-full border-2 rounded-full text-sm transition-all
                    focus:outline-none 
                    ${theme === 'high-contrast' 
                        ? 'bg-black border-white text-white placeholder-gray-400 focus:ring-4 focus:ring-yellow-400' 
                        : theme === 'neon'
                            ? 'bg-black border-neon-cyan text-neon-cyan placeholder-neon-cyan/50 focus:border-neon-pink focus:shadow-neon'
                            : 'bg-stone-50 border-stone-200 text-stone-900 focus:border-stone-400 focus:ring-4 focus:ring-klimt-gold'}
                `}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                role="searchbox"
                aria-label="Search prompts"
                aria-controls="main-content"
              />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
             <button
                onClick={() => { playClick(); handleOpenChat(); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wide border-2 transition-all hover:underline focus:outline-none focus-visible:ring-4 focus-visible:ring-klimt-gold 
                    ${theme === 'high-contrast' ? 'bg-white text-black border-white' : 
                      theme === 'neon' ? 'bg-black text-neon-green border-neon-green hover:shadow-neon' :
                      'bg-stone-100 text-stone-700 border-stone-200 hover:border-klimt-gold'}`}
             >
                <MessageSquare size={18} />
                <span>AI Chat</span>
             </button>

             <button 
                onClick={toggleTheme}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wide border-2 transition-all hover:underline focus:outline-none focus-visible:ring-4 focus-visible:ring-klimt-gold 
                    ${theme === 'high-contrast' ? 'border-white text-white hover:bg-white hover:text-black' : 
                      theme === 'neon' ? 'border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black' :
                      'border-stone-200 hover:bg-stone-100'}`}
                title="Toggle Theme: Light -> Dark -> High Contrast -> Neon"
             >
                {getThemeIcon()}
                <span className="sr-only">Toggle Theme</span>
                <span>{getThemeLabel()}</span>
             </button>

             <button 
                onClick={handleExportBundle}
                className={`flex items-center gap-2 font-bold text-sm uppercase tracking-wide px-4 py-2 rounded-full border-2 transition-all hover:bg-stone-100 hover:underline focus:outline-none focus-visible:ring-4 focus-visible:ring-klimt-gold 
                ${theme === 'high-contrast' ? 'border-white' : 
                  theme === 'neon' ? 'border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-white' :
                  'border-stone-200'}`}>
              <Download size={18} aria-hidden="true" />
              <span>Export</span>
            </button>
          </div>
        </header>

        {/* Live Region for Search Results (Screen Readers) */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {searchTerm ? `Found ${totalResults} prompts for "${searchTerm}"` : ''}
        </div>

        {/* Main Content Area */}
        <div 
            id="main-content" 
            className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth"
            role="main"
            tabIndex={-1} 
        >
            {activeSection ? (
                <div className="max-w-7xl mx-auto animate-fadeIn pb-20">
                    {/* Hero Section - Art Fusion Style */}
                    <div className={`
                        mb-10 p-8 md:p-12 relative overflow-hidden rounded-sm border-2
                        ${theme === 'high-contrast' ? 'border-yellow-400 bg-black' : 
                          theme === 'neon' ? 'border-neon-pink bg-black shadow-[0_0_30px_rgba(255,0,255,0.2)]' :
                          'border-klimt-gold bg-stone-50 shadow-xl'}
                    `}>
                        {/* Decorative Background for Hero */}
                        {(theme === 'light' || theme === 'dark') && (
                           <>
                             <div className="absolute top-0 right-0 w-64 h-64 bg-klimt-gold opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                             <div className="absolute bottom-0 left-0 w-64 h-64 bg-gogh-blue opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                             <div className="absolute inset-0 bg-canvas-texture opacity-10"></div>
                           </>
                        )}
                        
                        <div className="relative z-10 text-center md:text-left">
                            <div className={`
                                inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 mb-6 font-bold uppercase tracking-widest text-xs
                                ${theme === 'high-contrast' ? 'border-white text-white' : 
                                  theme === 'neon' ? 'border-neon-cyan text-neon-cyan shadow-neon-cyan' :
                                  'border-klimt-gold text-klimt-text bg-white/80'}
                            `}>
                                <span className={`w-2 h-2 rounded-full ${theme === 'neon' ? 'bg-neon-pink' : 'bg-current'}`}></span>
                                {activeSection.category} Collection
                            </div>
                            
                            <h2 className={`text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight 
                                ${theme === 'high-contrast' ? 'text-yellow-400 underline decoration-2' : 
                                  theme === 'neon' ? 'text-neon-pink drop-shadow-[0_0_10px_rgba(255,0,255,0.8)]' :
                                  'text-stone-900'}
                            `}>
                                {activeSection.title}
                            </h2>
                            
                            <p className={`text-lg md:text-xl max-w-3xl leading-relaxed 
                                ${theme === 'high-contrast' ? 'text-white font-bold' : 
                                  theme === 'neon' ? 'text-stone-300 font-mono' :
                                  'text-stone-600 font-serif italic'}
                            `}>
                                {activeSection.description}
                            </p>
                        </div>
                    </div>

                    {/* Grid Layout */}
                    <div 
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10"
                        role="list"
                        aria-label={`${activeSection.title} items`}
                    >
                        {activeSection.items.map((item, index) => (
                            <div role="listitem" key={item.id} className="h-full">
                                <PromptCard 
                                    item={item} 
                                    index={index}
                                    onTryIt={handleOpenPlayground} 
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className={`flex flex-col items-center justify-center h-full ${theme === 'neon' ? 'text-neon-cyan' : 'text-stone-400'}`} role="status">
                    <Search size={64} className="mb-4 opacity-20" aria-hidden="true" />
                    <p className="text-2xl font-serif">No masterpieces found for "{searchTerm}"</p>
                    <button 
                        onClick={() => { playClick(); setSearchTerm(''); }}
                        className={`mt-6 font-bold uppercase tracking-widest border-b-2 border-transparent transition-colors
                            ${theme === 'neon' ? 'text-neon-pink hover:border-neon-pink' : 'text-klimt-text hover:underline hover:border-klimt-gold'}
                        `}
                    >
                        Clear Canvas
                    </button>
                </div>
            )}
        </div>
      </main>

      <Playground 
        item={playgroundItem} 
        isOpen={isPlaygroundOpen} 
        onClose={() => setIsPlaygroundOpen(false)}
        initialMode={playgroundMode}
      />
    </div>
  );
}