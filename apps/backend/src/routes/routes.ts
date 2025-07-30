import express from 'express';
import { signup, login, getMe, logout, appleSignIn, googleSignIn, getAllUsers, getUserById, updateUser, updateUserById, deleteUser } from '../controllers/authController';
import multer from 'multer';
import path from 'path';
import { importAllProducts } from '../controllers/importProduct';
import { addToCart, getCart, removeFromCart, updateCartItem, deleteCart } from '../controllers/basketController';
import { createOrder, getActiveOrders, getOrderHistory, getOrdersByUser } from '../controllers/orderController';
import { addCard, getUserCards } from '../controllers/cardController';
import addressRoutes from './address';
import favoritesRoutes from './favorites';
import productRoutes from './product';
import discountRoutes from './discounts';
import notificationRoutes from './notifications';
import activityRoutes from './activities';
import orderRoutes from './orders';
import analyticsRoutes from './analytics';
import messageRoutes from './messages';

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

// Configuration multer pour l'upload d'images
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Route pour uploader une image de profil utilisateur
// @ts-expect-error - Ignorer les conflits de types multer
router.post('/upload-profile-image', upload.single('profileImage'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // Construire l'URL d'accès à l'image
  let baseUrl = process.env.BASE_URL;
  if (!baseUrl) {
    // Utiliser l'IP locale par défaut
    baseUrl = 'http://localhost:5000';
  }
  
  const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
  console.log('Image uploaded with URL:', imageUrl);
  res.json({ url: imageUrl });
});

// Routes panier
router.post('/cart/add', addToCart);
router.get('/cart', getCart);
router.post('/cart/remove', removeFromCart);
router.post('/cart/update', updateCartItem);
router.post('/cart/delete', deleteCart);

router.post('/orders/create', createOrder);

router.post('/api/card/add', addCard);
router.get('/api/card/user/:userId', getUserCards);

// Nouvelle route pour obtenir tous les utilisateurs
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUserById);
router.delete('/users/:id', deleteUser);

router.use('/address', addressRoutes);
router.use('/favorites', favoritesRoutes);
router.use('/products', productRoutes);
router.use('/discounts', discountRoutes);
router.use('/notifications', notificationRoutes);
router.use('/activities', activityRoutes);
router.use('/orders', orderRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/messages', messageRoutes);

export default router;
