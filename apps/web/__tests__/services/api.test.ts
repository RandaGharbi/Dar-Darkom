import { authAPI, productsAPI, ordersAPI, discountsAPI } from '../../lib/api';

// Mock pour axios
jest.mock('axios', () => {
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  };

  return {
    create: jest.fn(() => mockAxiosInstance),
  };
});

// Mock pour localStorage
const localStorageMock = {
  getItem: jest.fn(() => 'fake-token'),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('API Services', () => {
  let mockAxiosInstance: any;

  beforeEach(() => {
    jest.clearAllMocks();
    const axios = require('axios');
    mockAxiosInstance = axios.create();
  });

  describe('authAPI', () => {
    it('se connecte avec succès', async () => {
      const mockResponse = { data: { token: 'fake-token', user: { id: 1, email: 'test@example.com' } } };
      mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

      const result = await authAPI.login('test@example.com', 'password123');

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/login', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result).toEqual(mockResponse);
    });

    it('gère les erreurs de connexion', async () => {
      const errorResponse = {
        response: { status: 401, statusText: 'Unauthorized' },
      };
      mockAxiosInstance.post.mockRejectedValueOnce(errorResponse);

      await expect(authAPI.login('test@example.com', 'wrong-password')).rejects.toEqual(errorResponse);
    });
  });

  describe('productsAPI', () => {
    it('récupère la liste des produits', async () => {
      const mockProducts = [
        { id: 1, name: 'Produit 1', price: 10.99 },
        { id: 2, name: 'Produit 2', price: 20.99 },
      ];
      const mockResponse = { data: mockProducts };
      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

      const result = await productsAPI.getAll();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/products');
      expect(result).toEqual(mockResponse);
    });

    it('crée un nouveau produit', async () => {
      const newProduct = { name: 'Nouveau Produit', price: 15.99, description: 'Description' };
      const mockResponse = { data: { id: 3, ...newProduct } };
      mockAxiosInstance.post.mockResolvedValueOnce(mockResponse);

      const result = await productsAPI.create(newProduct);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/products', newProduct);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('ordersAPI', () => {
    it('récupère la liste des commandes', async () => {
      const mockOrders = [
        { id: 1, customerName: 'Client 1', total: 50.99 },
        { id: 2, customerName: 'Client 2', total: 75.50 },
      ];
      const mockResponse = { data: mockOrders };
      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

      const result = await ordersAPI.getAll();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/orders');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('discountsAPI', () => {
    it('récupère la liste des réductions', async () => {
      const mockDiscounts = [
        { id: 1, code: 'SALE20', percentage: 20 },
        { id: 2, code: 'SALE30', percentage: 30 },
      ];
      const mockResponse = { data: mockDiscounts };
      mockAxiosInstance.get.mockResolvedValueOnce(mockResponse);

      const result = await discountsAPI.getAll();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/discounts');
      expect(result).toEqual(mockResponse);
    });
  });
}); 