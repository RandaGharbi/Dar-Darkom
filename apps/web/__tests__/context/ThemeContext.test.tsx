import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../../context/ThemeContext';

// Mock pour styled-components
jest.mock('styled-components', () => ({
  ...jest.requireActual('styled-components'),
  ThemeProvider: ({ children, theme }: any) => <div data-testid="theme-provider" data-theme={JSON.stringify(theme)}>{children}</div>,
}));

// Mock pour localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock pour matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Composant de test pour utiliser le contexte
const TestComponent = () => {
  const { theme, themeMode, toggleTheme } = useTheme();
  return (
    <div>
      <div data-testid="theme-mode">{themeMode}</div>
      <div data-testid="theme-background">{theme.colors.background}</div>
      <button data-testid="toggle-theme" onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
};

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('fournit le thème clair par défaut', () => {
    renderWithTheme(<TestComponent />);
    
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
    expect(screen.getByTestId('theme-background')).toHaveTextContent('#ffffff');
  });

  it('récupère le thème depuis localStorage', () => {
    localStorageMock.getItem.mockReturnValue('dark');
    
    renderWithTheme(<TestComponent />);
    
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
    expect(screen.getByTestId('theme-background')).toHaveTextContent('#1a1a1a');
  });

  it('change de thème quand on clique sur le bouton', () => {
    renderWithTheme(<TestComponent />);
    
    // Vérifier le thème initial
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
    
    // Cliquer sur le bouton de changement
    fireEvent.click(screen.getByTestId('toggle-theme'));
    
    // Vérifier que le thème a changé
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme-mode', 'dark');
  });

  it('sauvegarde le thème dans localStorage', () => {
    renderWithTheme(<TestComponent />);
    
    fireEvent.click(screen.getByTestId('toggle-theme'));
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme-mode', 'dark');
  });

  it('détecte la préférence système sombre', () => {
    // Mock pour préférence système sombre
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    
    renderWithTheme(<TestComponent />);
    
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
  });
}); 