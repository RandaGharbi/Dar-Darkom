"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

// Définition des thèmes
export const lightTheme = {
  colors: {
    primary: '#b47b48',
    secondary: '#827869',
    background: '#ffffff',
    surface: '#f5efe7',
    text: {
      primary: '#171412',
      secondary: '#827869',
      muted: '#666666',
    },
    border: '#e0e0e0',
    success: '#388e3c',
    error: '#d84315',
    warning: '#f5a623',
    info: '#2196f3',
    card: {
      background: '#ffffff',
      shadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    },
    button: {
      primary: '#b47b48',
      secondary: '#f5efe7',
      text: '#ffffff',
    },
    sidebar: {
      background: '#ffffff',
      border: '#e0e0e0',
    },
    table: {
      header: '#faf9f6',
      row: '#ffffff',
      hover: '#f8f8f8',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '50%',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 2px 8px rgba(0, 0, 0, 0.04)',
    lg: '0 4px 16px rgba(0, 0, 0, 0.1)',
  },
};

export const darkTheme = {
  colors: {
    primary: '#d4a574',
    secondary: '#a89b8a',
    background: '#1a1a1a',
    surface: '#2d2d2d',
    text: {
      primary: '#ffffff',
      secondary: '#e0e0e0',
      muted: '#b0b0b0',
    },
    border: '#404040',
    success: '#4caf50',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3',
    card: {
      background: '#2d2d2d',
      shadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
    },
    button: {
      primary: '#d4a574',
      secondary: '#404040',
      text: '#ffffff',
    },
    sidebar: {
      background: '#2d2d2d',
      border: '#404040',
    },
    table: {
      header: '#333333',
      row: '#2d2d2d',
      hover: '#404040',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '50%',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
    md: '0 2px 8px rgba(0, 0, 0, 0.3)',
    lg: '0 4px 16px rgba(0, 0, 0, 0.4)',
  },
};

type Theme = typeof lightTheme;
type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');

  useEffect(() => {
    // Récupérer le thème sauvegardé dans localStorage
    const savedTheme = localStorage.getItem('theme-mode');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setThemeMode(savedTheme);
    } else {
      // Détecter la préférence système
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeMode(prefersDark ? 'dark' : 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
    localStorage.setItem('theme-mode', newMode);
  };

  const theme = themeMode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, themeMode, toggleTheme, setThemeMode }}>
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
}; 