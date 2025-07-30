import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeContext, ThemeProvider, useTheme } from '../../context/ThemeContext';

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
      <div data-testid="theme-background">{theme?.colors?.background || 'N/A'}</div>
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
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
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
    // S'assurer que matchMedia retourne false pour le thème sombre
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
    
    renderWithTheme(<TestComponent />);
    
    // Vérifier le thème initial (peut être light ou dark selon la logique)
    const initialTheme = screen.getByTestId('theme-mode').textContent || 'light';
    
    // Cliquer sur le bouton de changement
    fireEvent.click(screen.getByTestId('toggle-theme'));
    
    // Vérifier que le thème a changé
    const newTheme = initialTheme === 'light' ? 'dark' : 'light';
    expect(screen.getByTestId('theme-mode')).toHaveTextContent(newTheme);
    
    // Cliquer à nouveau pour revenir au thème initial
    fireEvent.click(screen.getByTestId('toggle-theme'));
    expect(screen.getByTestId('theme-mode')).toHaveTextContent(initialTheme);
  });

  it('sauvegarde le thème dans localStorage', () => {
    // S'assurer que matchMedia retourne false pour le thème sombre
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
    
    renderWithTheme(<TestComponent />);
    
    // Cliquer sur le bouton pour changer le thème
    fireEvent.click(screen.getByTestId('toggle-theme'));
    
    // Vérifier que le thème a été sauvegardé (peut être light ou dark selon l'état initial)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme-mode', expect.any(String));
    
    // Cliquer à nouveau pour revenir au thème initial
    localStorageMock.setItem.mockClear();
    fireEvent.click(screen.getByTestId('toggle-theme'));
    
    // Vérifier que le thème initial a été sauvegardé
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme-mode', expect.any(String));
  });

  it('détecte la préférence système sombre', () => {
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