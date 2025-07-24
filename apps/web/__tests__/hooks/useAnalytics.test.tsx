import { renderHook } from '@testing-library/react';
import { useAnalyticsSummary } from '../../hooks/useAnalytics';

// Mock pour @tanstack/react-query
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
  })),
}));

// Mock pour analyticsApi
jest.mock('../../services/analyticsApi', () => ({
  analyticsApi: {
    getSummary: jest.fn(),
    getSalesData: jest.fn(),
    getProductPerformance: jest.fn(),
    getCategoryPerformance: jest.fn(),
    getCustomerData: jest.fn(),
    getRetentionData: jest.fn(),
    getPurchasePatterns: jest.fn(),
  },
}));

describe('useAnalyticsSummary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('appelle useQuery avec les bonnes options', () => {
    const mockData = {
      sales: {
        total: 263.6,
        trend: '+0%',
        period: '30 days'
      },
      products: {
        total: 156,
        active: 142
      }
    };

    const { useQuery } = require('@tanstack/react-query');
    useQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useAnalyticsSummary('monthly'));
    
    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['analytics', 'summary', 'monthly'],
      queryFn: expect.any(Function),
      staleTime: 5 * 60 * 1000,
      refetchInterval: 5 * 60 * 1000,
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('utilise la période par défaut', () => {
    const { useQuery } = require('@tanstack/react-query');
    useQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    renderHook(() => useAnalyticsSummary());
    
    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['analytics', 'summary', 'monthly'],
      queryFn: expect.any(Function),
      staleTime: 5 * 60 * 1000,
      refetchInterval: 5 * 60 * 1000,
    });
  });

  it('gère l\'état de chargement', () => {
    const { useQuery } = require('@tanstack/react-query');
    useQuery.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    const { result } = renderHook(() => useAnalyticsSummary());
    
    expect(result.current.isLoading).toBe(true);
  });

  it('gère les erreurs', () => {
    const mockError = new Error('Erreur analytics');
    const { useQuery } = require('@tanstack/react-query');
    useQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: mockError,
    });

    const { result } = renderHook(() => useAnalyticsSummary());
    
    expect(result.current.error).toBe(mockError);
  });
}); 