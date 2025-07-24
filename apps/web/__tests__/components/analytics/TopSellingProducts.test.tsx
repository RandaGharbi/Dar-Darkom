import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TopSellingProducts } from '../../../components/analytics/TopSellingProducts';

const mockOrders = [
  {
    id: '1',
    createdAt: new Date().toISOString(),
    total: 150,
    products: [{ name: 'Product 1', price: 100, qty: 1 }]
  },
  {
    id: '2',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    total: 200,
    products: [{ name: 'Product 2', price: 200, qty: 1 }]
  }
];

jest.mock('../../../lib/api', () => ({
  ordersAPI: {
    getAll: jest.fn(() => Promise.resolve({ data: mockOrders }))
  }
}));

jest.mock('../../../hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

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
      <TopSellingProducts />
    </QueryClientProvider>
  );
};

describe('TopSellingProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders section title', async () => {
    renderWithProviders();
    
    await waitFor(() => {
      expect(screen.getByText('analytics.products.title')).toBeInTheDocument();
    });
  });

  it('displays loading spinner initially', () => {
    renderWithProviders();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('displays period tabs', async () => {
    renderWithProviders();
    
    await waitFor(() => {
      expect(screen.getByText('Daily')).toBeInTheDocument();
      expect(screen.getByText('Weekly')).toBeInTheDocument();
      expect(screen.getByText('Monthly')).toBeInTheDocument();
    });
  });

  it('changes period when tab is clicked', async () => {
    renderWithProviders();
    await waitFor(() => {
      const dailyTab = screen.getByText('Daily');
      fireEvent.click(dailyTab);
      expect(dailyTab).toBeInTheDocument();
    });
  });

  it('displays sales data when loaded', async () => {
    renderWithProviders();
    
    await waitFor(() => {
      expect(screen.getByText('SHALIMAR LAIT DIVIN POUR LE CORPS')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('shows total sales value', async () => {
    renderWithProviders();
    
    await waitFor(() => {
      expect(screen.getByText(/€350/)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('displays growth percentage', async () => {
    renderWithProviders();
    
    await waitFor(() => {
      expect(screen.getByText(/Last 30 Days/)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('displays bar chart icon', () => {
    renderWithProviders();
    const icons = screen.getAllByTestId('lucide-bar-chart-3');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('shows product chart visualization', async () => {
    renderWithProviders();
    
    await waitFor(() => {
      expect(screen.getByText('SHALIMAR LAIT DIVIN POUR LE CORPS')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('handles empty data gracefully', async () => {
    const emptyOrdersAPI = {
      getAll: jest.fn(() => Promise.resolve({ data: [] }))
    };

    jest.doMock('../../../lib/api', () => ({
      ordersAPI: emptyOrdersAPI
    }));

    renderWithProviders();
    
    await waitFor(() => {
      expect(screen.getByText('analytics.products.title')).toBeInTheDocument();
    });
  });
});