import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Define theme types
type ThemeType = 'default' | 'pink';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider component
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize theme state from localStorage or default
  const [theme, setTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as ThemeType) || 'default';
  });

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Update the document with the current theme
    document.documentElement.classList.remove('theme-default', 'theme-pink');
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  const value = { theme, setTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// Hook to use the theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}