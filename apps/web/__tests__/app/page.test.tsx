import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components';
import DashboardPage from '../../app/page';

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace
  })
}));

jest.mock('../../hooks/useAuthGuard', () => ({
  useAuthGuard: jest.fn()
}));

jest.mock('../../hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'dashboard.title': 'dashboard.title',
        'dashboard.subtitle': 'dashboard.subtitle',
        'dashboard.recentActivity': 'Activité récente',
        'dashboard.quickActions': 'Actions rapides',
        'dashboard.charts': 'Graphiques',
        // Ajoute d'autres clés si besoin
      };
      return translations[key] || key;
    }
  })
}));

jest.mock('../../utils/auth', () => ({
  isAuthenticated: jest.fn(() => true)
}));

jest.mock('../../lib/api', () => ({
  productsAPI: {
    getAll: jest.fn(() => Promise.resolve({ data: [] }))
  },
  ordersAPI: {
    getAll: jest.fn(() => Promise.resolve({ data: [] }))
  },
  usersAPI: {
    getAll: jest.fn(() => Promise.resolve({ data: [] }))
  },
  authAPI: {
    getMe: jest.fn(() => Promise.resolve({
      data: { name: 'Test User', profileImage: null }
    }))
  }
}));

const mockTheme = {
  colors: {
    primary: '#F5A623',
    secondary: '#F5F1EA',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    surface: '#f9fafb',
    background: '#fff',
    border: '#e5e7eb',
    text: { primary: '#000', secondary: '#666', muted: '#999' },
    sidebar: { background: '#fff', border: '#e5e7eb' },
    table: { header: '#f5f5f5', row: '#fff', hover: '#f0f0f0' },
    card: { background: '#fff', border: '#e5e7eb', shadow: '0 1px 2px 0 rgba(0,0,0,0.05)' },
    button: { primary: '#F5A623', secondary: '#F5F1EA', text: '#fff' }
  },
  borderRadius: { sm: '4px', md: '8px', lg: '12px', xl: '16px', full: '9999px' },
  shadows: {
    sm: '0 1px 2px 0 rgba(0,0,0,0.05)',
    md: '0 4px 6px -1px rgba(0,0,0,0.1)',
    lg: '0 10px 15px -3px rgba(0,0,0,0.1)',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '40px'
  }
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
        <DashboardPage />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe('DashboardPage', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockReplace.mockClear();
  });

  it('renders dashboard title', () => {
    renderWithProviders();
    expect(screen.getByText('dashboard.title')).toBeInTheDocument();
  });

  it('renders dashboard subtitle', () => {
    renderWithProviders();
    expect(screen.getByText('dashboard.subtitle')).toBeInTheDocument();
  });

  it('renders stats cards component', () => {
    renderWithProviders();
    // StatsCards component should render stats
    expect(screen.getByText('Revenus Totaux')).toBeInTheDocument();
  });

  it('renders recent activity component', () => {
    renderWithProviders();
    // RecentActivity component should render
    expect(screen.getByText('Activité Récente')).toBeInTheDocument();
  });

  it('renders quick actions component', () => {
    renderWithProviders();
    // QuickActions component should render
    expect(screen.getByText('Actions Rapides')).toBeInTheDocument();
  });

  it('renders charts component', () => {
    renderWithProviders();
    // Charts component should render
    expect(screen.getByText('Charts & Analytics')).toBeInTheDocument();
  });

  it('uses auth guard hook', () => {
    const { isAuthenticated } = require('../../utils/auth');
    renderWithProviders();
    expect(isAuthenticated).toHaveBeenCalled();
  });

  it('fetches required data', () => {
    const { productsAPI, ordersAPI, usersAPI } = require('../../lib/api');
    renderWithProviders();
    
    expect(productsAPI.getAll).toHaveBeenCalled();
    expect(ordersAPI.getAll).toHaveBeenCalled();
    expect(usersAPI.getAll).toHaveBeenCalled();
  });
});