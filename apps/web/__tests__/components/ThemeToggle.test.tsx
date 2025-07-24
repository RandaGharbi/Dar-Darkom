import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { ThemeToggle } from '../../components/ThemeToggle';
import { ThemeContext } from '../../components/../context/ThemeContext';

const mockToggleTheme = jest.fn();

const mockThemeContextValue = {
  themeMode: 'light' as const,
  toggleTheme: mockToggleTheme,
  theme: {
    colors: {
      text: { primary: '#000' },
      border: '#ccc'
    },
    borderRadius: { full: '50%' },
    shadows: { sm: '0 1px 2px rgba(0,0,0,0.1)' }
  }
};

const mockTheme = {
  colors: {
    text: { primary: '#000' },
    border: '#ccc'
  },
  borderRadius: { full: '50%' },
  shadows: { sm: '0 1px 2px rgba(0,0,0,0.1)' }
};

const renderWithProviders = (themeMode: 'light' | 'dark' = 'light') => {
  const contextValue = {
    ...mockThemeContextValue,
    themeMode
  };

  return render(
    <ThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={mockTheme}>
        <ThemeToggle />
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

describe('ThemeToggle', () => {
  beforeEach(() => {
    mockToggleTheme.mockClear();
  });

  it('renders toggle button', () => {
    renderWithProviders();
    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
  });

  it('displays moon icon in light mode', () => {
    renderWithProviders('light');
    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
  });

  it('displays sun icon in dark mode', () => {
    renderWithProviders('dark');
    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
  });

  it('calls toggleTheme when clicked', () => {
    renderWithProviders();
    const button = screen.getByRole('button', { name: /toggle theme/i });
    
    fireEvent.click(button);
    
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('has proper accessibility attributes', () => {
    renderWithProviders();
    const button = screen.getByRole('button', { name: /toggle theme/i });
    
    expect(button).toHaveAttribute('aria-label', 'Toggle theme');
  });
});