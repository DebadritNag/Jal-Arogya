import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ThemeContext, type ThemeMode } from './themeTypes';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>('light');

  useEffect(() => {
    // Load saved theme preference from localStorage
    const savedTheme = localStorage.getItem('jalarogya-theme') as ThemeMode;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setModeState(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setModeState(prefersDark ? 'dark' : 'light');
    }
  }, []);

  const setTheme = (theme: ThemeMode) => {
    setModeState(theme);
    localStorage.setItem('jalarogya-theme', theme);
  };

  const toggleTheme = () => {
    const newTheme = mode === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};