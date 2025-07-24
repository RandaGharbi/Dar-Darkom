"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const importProduct_1 = require("../controllers/importProduct");
const basketController_1 = require("../controllers/basketController");
const orderController_1 = require("../controllers/orderController");
const cardController_1 = require("../controllers/cardController");
const address_1 = __importDefault(require("./address"));
const favorites_1 = __importDefault(require("./favorites"));
const product_1 = __importDefault(require("./product"));
const discounts_1 = __importDefault(require("./discounts"));
const notifications_1 = __importDefault(require("./notifications"));
// import analyticsRoutes from './analytics';
const router = express_1.default.Router();
router.post('/signup', authController_1.signup);
router.post('/login', authController_1.login);
router.get('/me', authController_1.getMe);
router.put('/update', authController_1.updateUser);
router.post('/logout', authController_1.logout);
router.post('/apple', authController_1.appleSignIn);
router.post('/google', authController_1.googleSignIn);
// Route pour importer les produits
router.post('/import', importProduct_1.importAllProducts);
// Route pour uploader une image de profil utilisateur
router.post('/upload-profile-image', authController_1.uploadProfileImage);
// Routes panier
router.post('/cart/add', basketController_1.addToCart);
router.get('/cart', basketController_1.getCart);
router.post('/cart/remove', basketController_1.removeFromCart);
router.post('/cart/update', basketController_1.updateCartItem);
router.post('/cart/delete', basketController_1.deleteCart);
router.post('/orders/create', orderController_1.createOrder);
router.get('/orders/active/:userId', orderController_1.getActiveOrders);
router.get('/orders/history/:userId', orderController_1.getOrderHistory);
router.post('/api/card/add', cardController_1.addCard);
router.get('/api/card/user/:userId', cardController_1.getUserCards);
// Nouvelle route pour obtenir tous les utilisateurs
router.get('/users', authController_1.getAllUsers);
router.get('/users/:id', authController_1.getUserById);
router.delete('/users/:id', authController_1.deleteUser);
router.use('/address', address_1.default);
router.use('/favorites', favorites_1.default);
router.use('/products', product_1.default);
router.use('/discounts', discounts_1.default);
router.use('/notifications', notifications_1.default);
// router.use('/analytics', analyticsRoutes);
exports.default = router;
