import express from 'express';
import { 
  getOrderTracking, 
  updateTrackingStatus, 
  createOrderTracking, 
  getDriverTrackings 
} from '../controllers/trackingController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Récupérer le tracking d'une commande
router.get('/order/:orderId', auth, getOrderTracking);

// Mettre à jour le statut de tracking
router.put('/order/:orderId', auth, updateTrackingStatus);

// Créer un tracking pour une commande
router.post('/create', auth, createOrderTracking);

// Récupérer tous les trackings d'un driver
router.get('/driver/:driverId', auth, getDriverTrackings);

export default router;
