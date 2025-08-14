// Mock de l'API
jest.mock('../../lib/api');

import { authAPI, productsAPI, ordersAPI, discountsAPI } from '../../lib/api';

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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authAPI', () => {
    it('se connecte avec succès', async () => {
      const mockResponse = { data: { token: 'fake-token', user: { id: 1, email: 'test@example.com' } } };
      (authAPI.login as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await authAPI.login('test@example.com', 'password123');

      expect(authAPI.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(result).toEqual(mockResponse);
    });

    it('gère les erreurs de connexion', async () => {
      const errorResponse = {
        response: { status: 401, statusText: 'Unauthorized' },
      };
      (authAPI.login as jest.Mock).mockRejectedValueOnce(errorResponse);

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
      (productsAPI.getAll as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await productsAPI.getAll();

      expect(productsAPI.getAll).toHaveBeenCalledWith();
      expect(result).toEqual(mockResponse);
    });

    it('crée un nouveau produit', async () => {
      const newProduct = { name: 'Nouveau Produit', price: 15.99, description: 'Description' };
      const mockResponse = { data: { id: 3, ...newProduct } };
      (productsAPI.create as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await productsAPI.create(newProduct);

      expect(productsAPI.create).toHaveBeenCalledWith(newProduct);
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
      (ordersAPI.getAll as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await ordersAPI.getAll();

      expect(ordersAPI.getAll).toHaveBeenCalledWith();
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
      (discountsAPI.getAll as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await discountsAPI.getAll();

      expect(discountsAPI.getAll).toHaveBeenCalledWith();
      expect(result).toEqual(mockResponse);
    });
  });
}); 