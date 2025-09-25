import express, { Request, Response } from 'express';
import {
  registerDriver,
  getDriverProfile,
  updateDriverProfile,
  updateDriverLocation,
  toggleDriverStatus,
  getDriverOrders,
  acceptOrder,
  updateDeliveryStatus,
  getDriverStats
} from '../controllers/driverController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Routes publiques
router.post('/register', registerDriver);

// Routes protégées (nécessitent une authentification)
router.use(auth); // Middleware d'authentification pour toutes les routes suivantes

// Profil du livreur
router.get('/profile', getDriverProfile);
router.put('/profile', updateDriverProfile);

// Gestion de la position et du statut
router.put('/location', updateDriverLocation);
router.put('/status', toggleDriverStatus);

// Gestion des commandes
router.get('/orders', getDriverOrders);
router.post('/orders/accept', acceptOrder);
router.put('/orders/status', updateDeliveryStatus);

// Statistiques
router.get('/stats', getDriverStats);

export default router;

