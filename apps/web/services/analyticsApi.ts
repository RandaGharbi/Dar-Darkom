import { api } from '../lib/api';

export interface SalesData {
  month: string;
  sales: number;
  orders: number;
}

export interface ProductPerformance {
  product: string;
  sales: number;
  quantity: number;
  category: string;
}

export interface CategoryPerformance {
  category: string;
  sales: number;
  orders: number;
  products: number;
}

export interface CustomerData {
  type: string;
  value: number;
  count: number;
}

export interface RetentionData {
  month: string;
  rate: number;
  customers: number;
}

export interface PurchasePatternData {
  purchases: string;
  count: number;
  percentage: number;
}

export interface AnalyticsSummary {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  salesGrowth: number;
  orderGrowth: number;
  customerGrowth: number;
}

export const analyticsApi = {
  // Récupérer le résumé des analytics
  getSummary: async (period: 'daily' | 'weekly' | 'monthly' = 'monthly'): Promise<AnalyticsSummary> => {
    const response = await api.get(`/analytics/summary?period=${period}`);
    return response.data;
  },

  // Récupérer les données de ventes par période
  getSalesData: async (period: 'daily' | 'weekly' | 'monthly' = 'monthly'): Promise<SalesData[]> => {
    const response = await api.get(`/analytics/sales?period=${period}`);
    return response.data;
  },

  // Récupérer les performances des produits
  getProductPerformance: async (period: 'daily' | 'weekly' | 'monthly' = 'monthly'): Promise<ProductPerformance[]> => {
    const response = await api.get(`/analytics/products?period=${period}`);
    return response.data;
  },

  // Récupérer les performances par catégorie
  getCategoryPerformance: async (period: 'daily' | 'weekly' | 'monthly' = 'monthly'): Promise<CategoryPerformance[]> => {
    const response = await api.get(`/analytics/categories?period=${period}`);
    return response.data;
  },

  // Récupérer les données clients
  getCustomerData: async (period: 'daily' | 'weekly' | 'monthly' = 'monthly'): Promise<CustomerData[]> => {
    const response = await api.get(`/analytics/customers?period=${period}`);
    return response.data;
  },

  // Récupérer les taux de rétention
  getRetentionData: async (period: 'daily' | 'weekly' | 'monthly' = 'monthly'): Promise<RetentionData[]> => {
    const response = await api.get(`/analytics/retention?period=${period}`);
    return response.data;
  },

  // Récupérer les patterns d'achat
  getPurchasePatterns: async (period: 'daily' | 'weekly' | 'monthly' = 'monthly'): Promise<PurchasePatternData[]> => {
    const response = await api.get(`/analytics/purchase-patterns?period=${period}`);
    return response.data;
  },

  // Exporter les données d'analytics
  exportData: async (params: string) => {
    const response = await api.get(`/analytics/export?${params}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Récupérer l'historique des exports
  getExportHistory: async () => {
    const response = await api.get('/analytics/export-history');
    return response.data;
  },

  // Créer un export planifié
  createScheduledExport: async (scheduleData: any) => {
    console.log('📡 [API] Appel createScheduledExport avec données:', scheduleData);
    const response = await api.post('/analytics/scheduled-exports', scheduleData);
    console.log('✅ [API] Réponse reçue:', response.data);
    return response.data;
  },

  // Récupérer tous les exports planifiés
  getScheduledExports: async () => {
    const response = await api.get('/analytics/scheduled-exports');
    return response.data;
  },

  // Mettre à jour un export planifié
  updateScheduledExport: async (id: string, updateData: any) => {
    const response = await api.put(`/analytics/scheduled-exports/${id}`, updateData);
    return response.data;
  },

  // Supprimer un export planifié
  deleteScheduledExport: async (id: string) => {
    const response = await api.delete(`/analytics/scheduled-exports/${id}`);
    return response.data;
  }
}; 