import React, { useState, useMemo } from 'react';
import { PROMPT_SECTIONS } from './constants';
import { Sidebar } from './components/Sidebar';
import { PromptCard } from './components/PromptCard';
import { Playground } from './components/Playground';
import { PromptItem } from './types';
import { Search, Download, Menu, Sun, Moon, Eye } from 'lucide-react';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const [activeSectionId, setActiveSectionId] = useState(PROMPT_SECTIONS[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [playgroundItem, setPlaygroundItem] = useState<PromptItem | null>(null);
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);
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
    setIsPlaygroundOpen(true);
  };

  const toggleTheme = () => {
    playClick();
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('high-contrast');
    else setTheme('light');
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun size={20} />;
    if (theme === 'dark') return <Moon size={20} />;
    return <Eye size={20} />;
  };

  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-300 relative ${theme === 'high-contrast' ? 'bg-black text-white' : 'bg-stone-50 text-stone-900'}`}>
      
      {/* Background Texture for "Canvas" feel */}
      {theme !== 'high-contrast' && (
        <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none z-0 mix-blend-multiply"></div>
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
                ${theme === 'high-contrast' ? 'bg-black border-white' : 'bg-white/95 backdrop-blur-md border-stone-200'}
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
                <Search size={18} className={theme === 'high-contrast' ? 'text-white' : 'text-stone-400'} aria-hidden="true" />
              </div>
              <input
                type="text"
                id="search-input"
                placeholder="Find your muse (WBS, Risk, Code)..."
                className={`
                    pl-10 pr-4 py-2 w-full border-2 rounded-full text-sm transition-all
                    focus:outline-none focus:ring-4 focus:ring-klimt-gold
                    ${theme === 'high-contrast' 
                        ? 'bg-black border-white text-white placeholder-gray-400' 
                        : 'bg-stone-50 border-stone-200 text-stone-900 focus:border-stone-400'}
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
                onClick={toggleTheme}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wide border-2 transition-all hover:underline focus:outline-none focus-visible:ring-4 focus-visible:ring-klimt-gold ${theme === 'high-contrast' ? 'border-white text-white hover:bg-white hover:text-black' : 'border-stone-200 hover:bg-stone-100'}`}
                title="Toggle Theme: Light -> Dark -> High Contrast"
             >
                {getThemeIcon()}
                <span className="sr-only">Toggle Theme</span>
                <span>{theme === 'high-contrast' ? 'Contrast' : theme}</span>
             </button>

             <button className={`flex items-center gap-2 font-bold text-sm uppercase tracking-wide px-4 py-2 rounded-full border-2 transition-all hover:bg-stone-100 hover:underline focus:outline-none focus-visible:ring-4 focus-visible:ring-klimt-gold ${theme === 'high-contrast' ? 'border-white' : 'border-stone-200'}`}>
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
                        ${theme === 'high-contrast' ? 'border-yellow-400 bg-black' : 'border-klimt-gold bg-stone-50 shadow-xl'}
                    `}>
                        {/* Decorative Background for Hero */}
                        {theme !== 'high-contrast' && (
                           <>
                             <div className="absolute top-0 right-0 w-64 h-64 bg-klimt-gold opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                             <div className="absolute bottom-0 left-0 w-64 h-64 bg-gogh-blue opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                             <div className="absolute inset-0 bg-canvas-texture opacity-10"></div>
                           </>
                        )}
                        
                        <div className="relative z-10 text-center md:text-left">
                            <div className={`
                                inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 mb-6 font-bold uppercase tracking-widest text-xs
                                ${theme === 'high-contrast' ? 'border-white text-white' : 'border-klimt-gold text-klimt-text bg-white/80'}
                            `}>
                                <span className="w-2 h-2 rounded-full bg-current"></span>
                                {activeSection.category} Collection
                            </div>
                            
                            <h2 className={`text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight ${theme === 'high-contrast' ? 'text-yellow-400 underline decoration-2' : 'text-stone-900'}`}>
                                {activeSection.title}
                            </h2>
                            
                            <p className={`text-lg md:text-xl max-w-3xl leading-relaxed ${theme === 'high-contrast' ? 'text-white font-bold' : 'text-stone-600 font-serif italic'}`}>
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
                <div className="flex flex-col items-center justify-center h-full text-stone-400" role="status">
                    <Search size={64} className="mb-4 opacity-20" aria-hidden="true" />
                    <p className="text-2xl font-serif">No masterpieces found for "{searchTerm}"</p>
                    <button 
                        onClick={() => { playClick(); setSearchTerm(''); }}
                        className="mt-6 text-klimt-text hover:underline font-bold uppercase tracking-widest border-b-2 border-transparent hover:border-klimt-gold transition-colors"
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
      />
    </div>
  );
}