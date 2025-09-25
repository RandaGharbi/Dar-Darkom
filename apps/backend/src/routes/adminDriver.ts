import express, { Request, Response } from 'express';
import {
  getAllDrivers,
  getDriverById,
  approveDriver,
  rejectDriver,
  suspendDriver,
  getDriversStats
} from '../controllers/adminDriverController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Toutes les routes nécessitent une authentification admin
router.use(auth);

// Vérifier que l'utilisateur est admin
router.use((req: any, res: any, next: any) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé - Admin requis' });
  }
  next();
});

// Routes pour la gestion des livreurs
router.get('/', getAllDrivers);
router.get('/stats', getDriversStats);
router.get('/:driverId', getDriverById);
router.put('/:driverId/approve', approveDriver);
router.put('/:driverId/reject', rejectDriver);
router.put('/:driverId/suspend', suspendDriver);

export default router;

