import { renderHook } from '@testing-library/react';
import { useAuthGuard } from '../../hooks/useAuthGuard';

// Mock pour next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
  }),
  usePathname: () => '/dashboard',
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

describe('useAuthGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirige vers login si pas de token', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    renderHook(() => useAuthGuard());
    
    expect(localStorageMock.getItem).toHaveBeenCalledWith('token');
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('ne redirige pas si token présent', () => {
    localStorageMock.getItem.mockReturnValue('fake-token');
    
    renderHook(() => useAuthGuard());
    
    expect(localStorageMock.getItem).toHaveBeenCalledWith('token');
    expect(mockPush).not.toHaveBeenCalled();
  });
}); 