import Stripe from 'stripe';

// Configuration Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key_for_development';
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-08-27.basil',
});

export interface PaymentIntentData {
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
  customerId?: string;
}

export interface ApplePaySessionData {
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

/**
 * Créer un PaymentIntent pour Apple Pay
 */
export const createPaymentIntent = async (data: PaymentIntentData) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(data.amount * 100), // Stripe utilise les centimes
      currency: data.currency || 'eur',
      metadata: data.metadata || {},
      customer: data.customerId,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error('Erreur création PaymentIntent:', error);
    throw new Error('Impossible de créer le PaymentIntent');
  }
};

/**
 * Confirmer un paiement Apple Pay
 */
export const confirmPayment = async (paymentIntentId: string) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      return {
        success: true,
        paymentIntent,
      };
    }
    
    return {
      success: false,
      error: 'Paiement non confirmé',
    };
  } catch (error) {
    console.error('Erreur confirmation paiement:', error);
    throw new Error('Impossible de confirmer le paiement');
  }
};

/**
 * Créer une session Apple Pay
 */
export const createApplePaySession = (data: ApplePaySessionData) => {
  return {
    countryCode: data.countryCode,
    currencyCode: data.currencyCode,
    merchantIdentifier: data.merchantIdentifier,
    merchantCapabilities: data.merchantCapabilities,
    supportedNetworks: data.supportedNetworks,
    total: data.total,
    lineItems: data.lineItems || [],
  };
};

/**
 * Valider un webhook Stripe
 */
export const validateWebhook = (payload: string, signature: string) => {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
    return event;
  } catch (error) {
    console.error('Erreur validation webhook:', error);
    throw new Error('Webhook invalide');
  }
};

export default stripe;
