"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const favoriteController_1 = require("../controllers/favoriteController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Toutes les routes nécessitent une authentification
router.use(auth_1.auth);
// Ajouter un produit aux favoris
router.post('/add', favoriteController_1.addToFavorites);
// Supprimer un produit des favoris
router.delete('/remove/:productId', favoriteController_1.removeFromFavorites);
// Obtenir tous les favoris de l'utilisateur
router.get('/', favoriteController_1.getFavorites);
// Vérifier si un produit est en favori
router.get('/check/:productId', favoriteController_1.isFavorite);
// Toggle favori (ajouter/supprimer)
router.post('/toggle', favoriteController_1.toggleFavorite);
// Supprimer tous les favoris
router.delete('/clear', favoriteController_1.clearFavorites);
exports.default = router;
