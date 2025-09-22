import { Request, Response } from 'express';
import { createPaymentIntent, createApplePaySession, confirmPayment } from '../services/stripeService';
import Order from '../models/Order';
import Cart, { ICart } from '../models/Basket';
import { IProduct } from '../types';
import mongoose from 'mongoose';

/**
 * Créer un PaymentIntent pour Apple Pay
 */
export const createApplePayPayment = async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'eur' } = req.body;
    const userId = (req as any).user?.id;

    if (!userId || !amount) {
      return res.status(400).json({ 
        message: 'userId et amount sont requis' 
      });
    }

    // Récupérer le panier pour les métadonnées
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const cart = await Cart.findOne({ userId: userObjectId }).populate('items.productId') as ICart | null;
    
    const metadata: Record<string, string> = {
      userId: userId,
      source: 'apple_pay',
    };

    if (cart && cart.items.length > 0) {
      metadata.cartId = (cart._id as any).toString();
      metadata.itemCount = cart.items.length.toString();
    }

    const paymentData = {
      amount: parseFloat(amount),
      currency,
      metadata,
    };

    const result = await createPaymentIntent(paymentData);

    res.json({
      success: true,
      clientSecret: result.clientSecret,
      paymentIntentId: result.paymentIntentId,
    });

  } catch (error) {
    console.error('Erreur création paiement Apple Pay:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la création du paiement',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

/**
 * Confirmer un paiement Apple Pay et créer la commande
 */
export const confirmApplePayPayment = async (req: Request, res: Response) => {
  try {
    const { paymentIntentId, shippingAddress } = req.body;
    const userId = (req as any).user?.id;

    if (!paymentIntentId || !userId) {
      return res.status(400).json({ 
        message: 'paymentIntentId et userId sont requis' 
      });
    }

    // Confirmer le paiement
    const paymentResult = await confirmPayment(paymentIntentId);
    
    if (!paymentResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Paiement non confirmé',
      });
    }

    // Récupérer le panier
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const cart = await Cart.findOne({ userId: userObjectId }).populate('items.productId') as ICart | null;

    if (!cart || !cart.items.length) {
      return res.status(400).json({ 
        success: false,
        message: 'Panier vide' 
      });
    }

    // Préparer les items de la commande
    const items = cart.items.map((item) => {
      const product = item.productId as unknown as IProduct;
      return {
        name: product.name,
        qty: item.quantity,
        image: product.image || '',
        price: product.price,
      };
    });

    const subtotal = items.reduce((sum, p) => sum + (p.price || 0) * (p.qty || 1), 0);
    const shipping = 5;
    const tax = 0.05 * subtotal; // 5% TVA
    const total = subtotal + shipping + tax;

    // Créer la commande
    const order = await Order.create({
      userId: userObjectId,
      products: items,
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress: {
        street: shippingAddress?.street || '',
        city: shippingAddress?.city || '',
        postalCode: shippingAddress?.postalCode || '',
        country: shippingAddress?.country || 'France',
      },
      isOrdered: true,
      status: 'confirmed',
      paymentMethod: 'apple_pay',
      paymentIntentId: paymentIntentId,
    });

    // Vider le panier
    cart.items = [];
    cart.set('isOrdered', true);
    await cart.save();

    res.json({
      success: true,
      order,
      message: 'Commande créée avec succès',
    });

  } catch (error) {
    console.error('Erreur confirmation paiement Apple Pay:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la confirmation du paiement',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

/**
 * Obtenir la configuration Apple Pay
 */
export const getApplePayConfig = async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'eur' } = req.query;

    if (!amount) {
      return res.status(400).json({ 
        message: 'amount est requis' 
      });
    }

    const config = createApplePaySession({
      countryCode: 'FR',
      currencyCode: currency as string,
      merchantIdentifier: 'merchant.com.dar-darkom.app', // Votre Merchant ID Apple
      merchantCapabilities: ['3DS', 'debit', 'credit'],
      supportedNetworks: ['visa', 'masterCard', 'amex'],
      total: {
        label: 'Dar Darkom',
        amount: amount as string,
      },
    });

    res.json({
      success: true,
      config,
    });

  } catch (error) {
    console.error('Erreur configuration Apple Pay:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la récupération de la configuration',
    });
  }
};

/**
 * Webhook Stripe pour les événements de paiement
 */
export const handleStripeWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers['stripe-signature'] as string;
    const payload = JSON.stringify(req.body);

    // Valider le webhook
    const event = require('../services/stripeService').validateWebhook(payload, signature);

    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('Paiement réussi:', event.data.object.id);
        // Ici vous pouvez ajouter des actions supplémentaires
        break;
      
      case 'payment_intent.payment_failed':
        console.log('Paiement échoué:', event.data.object.id);
        // Ici vous pouvez gérer l'échec du paiement
        break;
      
      default:
        console.log(`Événement non géré: ${event.type}`);
    }

    res.json({ received: true });

  } catch (error) {
    console.error('Erreur webhook Stripe:', error);
    res.status(400).json({ 
      message: 'Erreur webhook',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};
