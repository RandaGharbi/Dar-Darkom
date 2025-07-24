import express from 'express';
import { 
  addToFavorites, 
  removeFromFavorites, 
  getFavorites, 
  isFavorite, 
  toggleFavorite, 
  clearFavorites 
} from '../controllers/favoriteController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(auth);

// Ajouter un produit aux favoris
router.post('/add', addToFavorites);

// Supprimer un produit des favoris
router.delete('/remove/:productId', removeFromFavorites);

// Obtenir tous les favoris de l'utilisateur
router.get('/', getFavorites);

// Vérifier si un produit est en favori
router.get('/check/:productId', isFavorite);

// Toggle favori (ajouter/supprimer)
router.post('/toggle', toggleFavorite);

// Supprimer tous les favoris
router.delete('/clear', clearFavorites);

export default router; 