import express from 'express';
import { createOrder, getActiveOrders, getOrderHistory, getAllOrders, getOrderById, updateOrderStatus, getAllOrdersByUser } from '../controllers/orderController';

const router = express.Router();

router.post('/create', createOrder);
router.get('/', getAllOrders);
router.get('/active/:userId', getActiveOrders);
router.get('/all/:userId', getAllOrdersByUser); // ✅ Nouvelle route pour toutes les commandes
router.get('/user/:userId', getAllOrdersByUser); // ✅ Route manquante pour l'interface web
router.get('/history/:userId', getOrderHistory);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);

export default router; 