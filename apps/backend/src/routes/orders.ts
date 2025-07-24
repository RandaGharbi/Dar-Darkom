import express from 'express';
import { createOrder, getActiveOrders, getOrderHistory, getAllOrders, getOrderById } from '../controllers/orderController';

const router = express.Router();

router.post('/create', createOrder);
router.get('/', getAllOrders);
router.get('/active/:userId', getActiveOrders);
router.get('/history/:userId', getOrderHistory);
router.get('/:id', getOrderById);

export default router; 