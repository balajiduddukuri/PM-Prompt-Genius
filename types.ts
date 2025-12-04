
export type Category = 'Waterfall' | 'Agile' | 'SAFe' | 'Roles' | 'Jira' | 'General' | 'Inspiration' | 'Documentation';

export type ThemeMode = 'light' | 'dark' | 'high-contrast' | 'neon';

export interface PromptItem {
  id: string;
  title: string;
  description?: string;
  text: string; // The actual prompt text
  tags?: string[];
  codeSnippet?: {
    language: string;
    code: string;
  };
}

export interface Section {
  id: string;
  title: string;
  category: Category;
  description: string;
  items: PromptItem[];
}

export interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  playClick: () => void;
}