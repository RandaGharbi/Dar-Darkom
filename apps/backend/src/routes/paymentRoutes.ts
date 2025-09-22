import express from 'express';
import { 
  createApplePayPayment, 
  confirmApplePayPayment, 
  getApplePayConfig,
  handleStripeWebhook 
} from '../controllers/paymentController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Routes publiques
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);
router.get('/apple-pay/config', getApplePayConfig);

// Routes protégées
router.post('/apple-pay/create', auth, createApplePayPayment);
router.post('/apple-pay/confirm', auth, confirmApplePayPayment);

export default router;
