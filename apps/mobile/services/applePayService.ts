import { API_CONFIG } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ApplePayConfig {
  countryCode: string;
  currencyCode: string;
  merchantIdentifier: string;
  merchantCapabilities: string[];
  supportedNetworks: string[];
  total: {
    label: string;
    amount: string;
  };
  lineItems?: Array<{
    label: string;
    amount: string;
  }>;
}

export interface PaymentIntentResponse {
  success: boolean;
  clientSecret?: string;
  paymentIntentId?: string;
  message?: string;
}

export interface ConfirmPaymentResponse {
  success: boolean;
  order?: any;
  message?: string;
}

/**
 * Obtenir la configuration Apple Pay depuis le backend
 */
export const getApplePayConfig = async (amount: number): Promise<ApplePayConfig | null> => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/payments/apple-pay/config?amount=${amount}&currency=eur`);
    const data = await response.json();
    
    if (data.success) {
      return data.config;
    }
    
    throw new Error(data.message || 'Erreur configuration Apple Pay');
  } catch (error) {
    console.error('Erreur récupération config Apple Pay:', error);
    return null;
  }
};

/**
 * Créer un PaymentIntent pour Apple Pay
 */
export const createApplePayPayment = async (amount: number): Promise<PaymentIntentResponse> => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token d\'authentification manquant');
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/api/payments/apple-pay/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount: amount,
        currency: 'eur',
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur création paiement Apple Pay:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
};

/**
 * Confirmer un paiement Apple Pay
 */
export const confirmApplePayPayment = async (
  paymentIntentId: string,
  shippingAddress?: any
): Promise<ConfirmPaymentResponse> => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      throw new Error('Token d\'authentification manquant');
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/api/payments/apple-pay/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        paymentIntentId,
        shippingAddress,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur confirmation paiement Apple Pay:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
};
