
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

  return (
    <nav 
        className={`
          fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out shadow-2xl
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0
          flex flex-col border-r 
          ${theme === 'high-contrast' ? 'bg-black border-white text-yellow-400' : 'bg-stone-900 border-stone-800 text-stone-300'}
        `}
        aria-label="Main Navigation"
    >
      <div className="p-6 border-b border-stone-800">
        <h1 className="text-xl font-serif font-bold flex items-center gap-2">
          <Palette aria-hidden="true" className="text-klimt-gold" size={24} />
          <span className={theme === 'high-contrast' ? 'text-yellow-400' : 'text-stone-100'}>
            PM Genius
          </span>
        </h1>
        <p className={`text-xs mt-2 ${theme === 'high-contrast' ? 'text-white' : 'text-stone-500'}`}>
           Author: BalajiDuddukuri
        </p>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-8">
        {categories.map((cat) => (
          <div key={cat} role="group" aria-labelledby={`cat-${cat}`}>
            <div 
              id={`cat-${cat}`}
              className={`px-3 mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest
                ${theme === 'high-contrast' ? 'text-white border-b border-white pb-1' : 'text-klimt-accent'}
              `}
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
                      ${activeSectionId === section.id 
                        ? theme === 'high-contrast' 
                            ? 'bg-yellow-900 border-yellow-400 text-yellow-400 font-bold underline decoration-2'
                            : 'bg-stone-800 border-klimt-gold text-klimt-gold font-semibold shadow-inner' 
                        : theme === 'high-contrast'
                            ? 'border-transparent text-white hover:underline hover:bg-stone-900'
                            : 'border-transparent text-stone-400 hover:text-stone-100 hover:bg-stone-800 hover:border-stone-700'
                      }
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