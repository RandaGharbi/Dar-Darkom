import express from 'express';
import { createOrder, getActiveOrders, getOrderHistory, getAllOrders, getOrderById, updateOrderStatus } from '../controllers/orderController';

const router = express.Router();

router.post('/create', createOrder);
router.get('/', getAllOrders);
router.get('/active/:userId', getActiveOrders);
router.get('/history/:userId', getOrderHistory);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);

export default router; 