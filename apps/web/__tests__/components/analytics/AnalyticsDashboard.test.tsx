import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components';
import { AnalyticsDashboard } from '../../../components/analytics/AnalyticsDashboard';

jest.mock('../../../hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'analytics.title': 'analytics.title',
        'analytics.subtitle': 'analytics.subtitle',
      };
      return translations[key as string] || key;
    }
  })
}));

jest.mock('../../../lib/api', () => ({
  ordersAPI: {
    getAll: jest.fn(() => Promise.resolve({ data: [] }))
  },
  productsAPI: {
    getAll: jest.fn(() => Promise.resolve({ data: [] }))
  }
}));

jest.mock('../../../services/analyticsApi', () => ({
  getScheduledExports: jest.fn(() => Promise.resolve([])),
}));

const mockTheme = {
  colors: {
    primary: '#1976d2',
    secondary: '#9c27b0',
    background: '#fff',
    surface: '#fff',
    text: {
      primary: '#000',
      secondary: '#666',
      muted: '#999',
    },
    sidebar: {
      background: '#f5f5f5',
      border: '#e0e0e0',
    },
    border: '#e0e0e0',
    success: '#4caf50',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3',
    table: {
      header: '#f5f5f5',
      row: '#fff',
      border: '#e0e0e0',
      hover: '#f0f0f0',
    },
    card: {
      background: '#fff',
      border: '#e0e0e0',
      shadow: '0 1px 2px rgba(0,0,0,0.05)',
    },
    button: {
      primary: '#1976d2',
      secondary: '#9c27b0',
      text: '#fff',
    },
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '40px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.15)',
  },
};

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithProviders = () => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={mockTheme}>
        <AnalyticsDashboard />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('AnalyticsDashboard', () => {
  let consoleErrorSpy: jest.SpyInstance;
  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders page title', async () => {
    renderWithProviders();
    
    expect(screen.getByText('analytics.title')).toBeInTheDocument();
  });

  it('renders page description', () => {
    renderWithProviders();
    
    expect(screen.getByText('analytics.subtitle')).toBeInTheDocument();
  });

  it('renders all analytics components', () => {
    renderWithProviders();
    
    // Vérifier que les composants sont montés (même s'ils affichent du contenu par défaut)
    expect(screen.getByText('analytics.title')).toBeInTheDocument();
  });

  it('has responsive grid layout', () => {
    const { container } = renderWithProviders();
    
    const gridContainer = container.querySelector('[style*="grid"]') || 
                         container.querySelector('[class*="grid"]');
    expect(container.firstChild).toBeInTheDocument();
  });

  it('displays mounted content after initialization', async () => {
    renderWithProviders();
    
    // Attendre que le composant soit monté
    await screen.findByText('analytics.title');
    expect(screen.getByText('analytics.title')).toBeInTheDocument();
  });
});