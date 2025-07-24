import express from 'express';
import { 
  getAllDiscounts, 
  getDiscountsByCollection, 
  getDiscountByCode, 
  createDiscount, 
  updateDiscount, 
  deleteDiscount, 
  incrementUsage 
} from '../controllers/discountController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Routes publiques
router.get('/', getAllDiscounts);
router.get('/collection/:collection', getDiscountsByCollection);
router.get('/code/:code', getDiscountByCode);

// Routes protégées (admin uniquement)
router.post('/', auth, createDiscount);
router.put('/:id', auth, updateDiscount);
router.delete('/:id', auth, deleteDiscount);

// Route pour incrémenter l'utilisation (peut être utilisée par les clients)
router.post('/use/:code', incrementUsage);

export default router; 