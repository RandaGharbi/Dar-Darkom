import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeToggle } from '../../components/ThemeToggle';
import { ThemeContext, lightTheme, darkTheme } from '../../context/ThemeContext';

const mockToggleTheme = jest.fn();
const mockSetThemeMode = jest.fn();

const mockThemeContextValue = {
  themeMode: 'light' as const,
  toggleTheme: mockToggleTheme,
  setThemeMode: mockSetThemeMode,
  theme: lightTheme
};

const renderWithProviders = (themeMode: 'light' | 'dark' = 'light') => {
  const contextValue = {
    ...mockThemeContextValue,
    themeMode,
    theme: themeMode === 'light' ? lightTheme : darkTheme
  };

  return render(
    <ThemeContext.Provider value={contextValue}>
      <StyledThemeProvider theme={contextValue.theme}>
        <ThemeToggle />
      </StyledThemeProvider>
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