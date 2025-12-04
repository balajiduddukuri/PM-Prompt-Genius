
import React from 'react';
import { Section, Category } from '../types';
import { 
  Briefcase, 
  Layers, 
  Users, 
  Terminal, 
  Layout, 
  Box,
  Palette,
  Lightbulb,
  FileText
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface SidebarProps {
  sections: Section[];
  activeSectionId: string;
  onSelectSection: (id: string) => void;
  isOpen: boolean;
}

// Moved outside component to prevent re-creation on every render
const CATEGORY_CONFIG: Record<Category, { icon: React.ReactNode, label: string }> = {
  'Waterfall': { icon: <Briefcase aria-hidden="true" size={18} />, label: 'Waterfall' },
  'Agile': { icon: <Layout aria-hidden="true" size={18} />, label: 'Agile & Scrum' },
  'SAFe': { icon: <Layers aria-hidden="true" size={18} />, label: 'SAFe' },
  'Roles': { icon: <Users aria-hidden="true" size={18} />, label: 'Team Roles' },
  'Jira': { icon: <Terminal aria-hidden="true" size={18} />, label: 'Jira Toolkit' },
  'General': { icon: <Box aria-hidden="true" size={18} />, label: 'General' },
  'Documentation': { icon: <FileText aria-hidden="true" size={18} />, label: 'Docs & Reports' },
  'Inspiration': { icon: <Lightbulb aria-hidden="true" size={18} />, label: 'Wisdom & Drive' },
};

export const Sidebar: React.FC<SidebarProps> = ({ sections, activeSectionId, onSelectSection, isOpen }) => {
  const { playClick, theme } = useTheme();

  // Group sections by category
  const groupedSections = React.useMemo(() => {
    return sections.reduce((acc, section) => {
      if (!acc[section.category]) {
        acc[section.category] = [];
      }
      acc[section.category].push(section);
      return acc;
    }, {} as Record<Category, Section[]>);
  }, [sections]);

  const categories = Object.keys(groupedSections) as Category[];

  // Dynamic Styles
  const containerClasses = {
    'light': 'bg-stone-900 border-stone-800 text-stone-300',
    'dark': 'bg-stone-900 border-stone-800 text-stone-300',
    'high-contrast': 'bg-black border-white text-yellow-400',
    'neon': 'bg-neon-bg border-neon-pink/50 text-neon-cyan shadow-[0_0_15px_rgba(255,0,255,0.2)]'
  }[theme];

  const brandTextClasses = {
    'light': 'text-stone-100',
    'dark': 'text-stone-100',
    'high-contrast': 'text-yellow-400',
    'neon': 'text-neon-pink drop-shadow-[0_0_5px_rgba(255,0,255,0.8)]'
  }[theme];

  const categoryHeaderClasses = {
    'light': 'text-klimt-accent',
    'dark': 'text-klimt-accent',
    'high-contrast': 'text-white border-b border-white pb-1',
    'neon': 'text-neon-green border-b border-neon-green/30 pb-1'
  }[theme];

  const getButtonClasses = (isActive: boolean) => {
    if (theme === 'high-contrast') {
      return isActive 
        ? 'bg-yellow-900 border-yellow-400 text-yellow-400 font-bold underline decoration-2' 
        : 'border-transparent text-white hover:underline hover:bg-stone-900';
    }
    if (theme === 'neon') {
      return isActive
        ? 'bg-neon-surface border-neon-cyan text-neon-cyan shadow-neon-cyan font-bold'
        : 'border-transparent text-stone-400 hover:text-neon-pink hover:bg-neon-surface/50 hover:border-neon-pink';
    }
    // Standard (Light/Dark)
    return isActive
      ? 'bg-stone-800 border-klimt-gold text-klimt-gold font-semibold shadow-inner'
      : 'border-transparent text-stone-400 hover:text-stone-100 hover:bg-stone-800 hover:border-stone-700';
  };

  return (
    <nav 
        className={`
          fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out shadow-2xl
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0
          flex flex-col border-r 
          ${containerClasses}
        `}
        aria-label="Main Navigation"
    >
      <div className={`p-6 border-b ${theme === 'neon' ? 'border-neon-pink/30' : 'border-stone-800'}`}>
        <h1 className="text-xl font-serif font-bold flex items-center gap-2">
          <Palette aria-hidden="true" className={theme === 'neon' ? 'text-neon-pink' : 'text-klimt-gold'} size={24} />
          <span className={brandTextClasses}>
            PM Genius
          </span>
        </h1>
        <p className={`text-xs mt-2 ${theme === 'high-contrast' ? 'text-white' : theme === 'neon' ? 'text-stone-400' : 'text-stone-500'}`}>
           Author: BalajiDuddukuri
        </p>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-8">
        {categories.map((cat) => (
          <div key={cat} role="group" aria-labelledby={`cat-${cat}`}>
            <div 
              id={`cat-${cat}`}
              className={`px-3 mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${categoryHeaderClasses}`}
            >
              {CATEGORY_CONFIG[cat].icon}
              {CATEGORY_CONFIG[cat].label}
            </div>
            <ul className="space-y-1">
              {groupedSections[cat].map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => {
                        playClick();
                        onSelectSection(section.id);
                    }}
                    aria-current={activeSectionId === section.id ? 'page' : undefined}
                    className={`
                      w-full text-left px-3 py-3 rounded-none border-l-4 transition-all duration-200 flex items-center justify-between
                      focus:outline-none focus-visible:ring-inset
                      ${getButtonClasses(activeSectionId === section.id)}
                    `}
                  >
                    <span className="truncate">{section.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
};