import { renderHook } from '@testing-library/react';
import { useNotifications } from '../../hooks/useNotifications';

// Mock pour @tanstack/react-query
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(() => ({
    data: null,
    isLoading: false,
    error: null,
  })),
}));

// Mock pour fetch
global.fetch = jest.fn();

describe('useNotifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('appelle useQuery avec les bonnes options', () => {
    const mockData = [
      {
        id: "1",
        text: "Nouvelle commande reçue #12345",
        time: "Il y a 5 minutes",
        read: false,
        type: 'order'
      }
    ];

    const { useQuery } = require('@tanstack/react-query');
    useQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() => useNotifications());
    
    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ["notifications"],
      queryFn: expect.any(Function),
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchInterval: false,
      refetchOnWindowFocus: false,
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('gère l\'état de chargement', () => {
    const { useQuery } = require('@tanstack/react-query');
    useQuery.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    const { result } = renderHook(() => useNotifications());
    
    expect(result.current.isLoading).toBe(true);
  });

  it('gère les erreurs', () => {
    const mockError = new Error('Erreur réseau');
    const { useQuery } = require('@tanstack/react-query');
    useQuery.mockReturnValue({
      data: null,
      isLoading: false,
      error: mockError,
    });

    const { result } = renderHook(() => useNotifications());
    
    expect(result.current.error).toBe(mockError);
  });
}); 