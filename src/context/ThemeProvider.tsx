'use client';

import { useState, ReactNode } from 'react';
import { ThemeContext, Theme } from './ThemeContext';

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const savedTheme = localStorage.getItem('app_theme');
      return savedTheme === 'dark' || savedTheme === 'light'
        ? savedTheme
        : 'light';
    } catch {
      return 'light';
    }
  });

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('app_theme', nextTheme);
      } catch (error) {
        console.warn('Failed to save topic to localStorage:', error);
      }
      return nextTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
