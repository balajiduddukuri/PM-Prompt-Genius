import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { ThemeProvider } from './hooks/useTheme';
import { PROMPT_SECTIONS } from './constants';

// Declare Jest globals to fix TS errors
declare const jest: any;
declare const describe: any;
declare const test: any;
declare const expect: any;

// Mock the ThemeProvider to avoid AudioContext issues in test environment
jest.mock('./hooks/useTheme', () => ({
  ...jest.requireActual('./hooks/useTheme'),
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
    playClick: jest.fn(),
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

describe('App Component', () => {
  test('renders the application title', () => {
    render(<App />);
    const titleElement = screen.getByText(/PM Genius/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders navigation sidebar', () => {
    render(<App />);
    const navElement = screen.getByRole('navigation', { name: /main navigation/i });
    expect(navElement).toBeInTheDocument();
  });

  test('renders search input', () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText(/find your muse/i);
    expect(searchInput).toBeInTheDocument();
  });

  test('renders default prompt section', () => {
    render(<App />);
    // Check for the default section title (first one in constants)
    const firstSectionTitle = PROMPT_SECTIONS[0].title;
    const sectionHeader = screen.getByRole('heading', { name: firstSectionTitle });
    expect(sectionHeader).toBeInTheDocument();
  });

  test('search functionality filters prompts', () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText(/find your muse/i);
    
    // Type a specific unique term
    const uniqueTerm = "WBS"; 
    fireEvent.change(searchInput, { target: { value: uniqueTerm } });

    // Verify filter text is updated (Input value)
    expect(searchInput).toHaveValue(uniqueTerm);
    
    // Check if the "Full WBS Generation" card is visible
    const wbsCard = screen.getByText(/Full WBS Generation/i);
    expect(wbsCard).toBeInTheDocument();
  });

  test('theme toggle button exists', () => {
    render(<App />);
    const themeBtn = screen.getByTitle(/Toggle Theme/i);
    expect(themeBtn).toBeInTheDocument();
  });

  test('accessibility landmarks are present', () => {
    render(<App />);
    expect(screen.getByRole('banner')).toBeInTheDocument(); // Header
    expect(screen.getByRole('main')).toBeInTheDocument();   // Main content
    expect(screen.getByRole('navigation')).toBeInTheDocument(); // Sidebar
  });
});