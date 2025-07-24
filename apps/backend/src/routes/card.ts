import express from 'express';
import { addCard, getUserCards } from '../controllers/cardController';

const router = express.Router();

router.post('/add', addCard);
router.get('/user/:userId', getUserCards);

export default router; 