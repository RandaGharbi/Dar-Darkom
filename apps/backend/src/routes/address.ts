import express from 'express';
import {
  addAddress,
  getAddressesByUser,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '../controllers/addressController';

const router = express.Router();

// Ajouter une adresse
router.post('/add', addAddress);

// Récupérer les adresses d'un utilisateur
router.get('/user/:userId', getAddressesByUser);

// Modifier une adresse
router.put('/:addressId', updateAddress);

// Supprimer une adresse
router.delete('/:addressId', deleteAddress);

// Définir une adresse principale
router.patch('/:addressId/default', setDefaultAddress);

export default router; 