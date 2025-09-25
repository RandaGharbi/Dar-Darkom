import express from 'express';
import {
  verifyEmployeeRole,
  getEmployeeOrders,
  acceptOrder,
  rejectOrder,
  assignLivreur,
  getLivreurs,
  getOrderDetails,
  registerEmployee,
  confirmEmployeeEmail
} from '../controllers/employeeController';

const router = express.Router();

// Route d'inscription (pas d'authentification requise)
router.post('/register', registerEmployee);

// Route de confirmation d'email (pas d'authentification requise)
router.get('/confirm-email', confirmEmployeeEmail);

// Toutes les autres routes nécessitent le rôle employé
router.use(verifyEmployeeRole);

// Routes pour les employés
router.get('/orders', getEmployeeOrders);
router.get('/orders/:orderId', getOrderDetails);
router.put('/orders/:orderId/accept', acceptOrder);
router.put('/orders/:orderId/reject', rejectOrder);
router.put('/orders/:orderId/assign-livreur', assignLivreur);
router.get('/livreurs', getLivreurs);

export default router;
