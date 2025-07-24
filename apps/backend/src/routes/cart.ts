import express from 'express';
import { addToCart, getCart, removeFromCart, updateCartItem, deleteCart } from '../controllers/basketController';

const router = express.Router();

router.post('/add', addToCart);
router.get('/', getCart);
router.post('/remove', removeFromCart);
router.post('/update', updateCartItem);
router.post('/delete', deleteCart);

export default router; 