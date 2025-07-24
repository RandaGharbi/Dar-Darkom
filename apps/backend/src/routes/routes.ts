import express from 'express';
import { signup, login, getMe, logout, appleSignIn, googleSignIn, uploadProfileImage, getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/authController';
import { importAllProducts } from '../controllers/importProduct';
import { addToCart, getCart, removeFromCart, updateCartItem, deleteCart } from '../controllers/basketController';
import { createOrder, getActiveOrders, getOrderHistory } from '../controllers/orderController';
import { addCard, getUserCards } from '../controllers/cardController';
import addressRoutes from './address';
import favoritesRoutes from './favorites';
import productRoutes from './product';
import discountRoutes from './discounts';
import notificationRoutes from './notifications';
// import analyticsRoutes from './analytics';

const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.get('/me', getMe);

router.put('/update', updateUser);

router.post('/logout', logout);

router.post('/apple', appleSignIn);

router.post('/google', googleSignIn);

// Route pour importer les produits
router.post('/import', importAllProducts);

// Route pour uploader une image de profil utilisateur
router.post('/upload-profile-image', uploadProfileImage);

// Routes panier
router.post('/cart/add', addToCart);
router.get('/cart', getCart);
router.post('/cart/remove', removeFromCart);
router.post('/cart/update', updateCartItem);
router.post('/cart/delete', deleteCart);

router.post('/orders/create', createOrder);

router.get('/orders/active/:userId', getActiveOrders);
router.get('/orders/history/:userId', getOrderHistory);

router.post('/api/card/add', addCard);
router.get('/api/card/user/:userId', getUserCards);

// Nouvelle route pour obtenir tous les utilisateurs
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);

router.use('/address', addressRoutes);
router.use('/favorites', favoritesRoutes);
router.use('/products', productRoutes);
router.use('/discounts', discountRoutes);
router.use('/notifications', notificationRoutes);
// router.use('/analytics', analyticsRoutes);

export default router;
