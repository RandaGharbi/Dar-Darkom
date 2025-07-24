"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const importProduct_1 = require("../controllers/importProduct");
const router = express_1.default.Router();
// Route pour importer les produits
router.post('/import', importProduct_1.importAllProducts);
// Route GET pour récupérer tous les produits
router.get('/', productController_1.getAllProducts);
// Route GET pour récupérer les produits par type
router.get('/type/:productType', productController_1.getProductsByType);
// Route GET pour récupérer un produit par son ID
router.get('/:productId', productController_1.getProductById);
// Route pour rechercher des produits
router.post('/search', productController_1.searchProducts);
// Route pour récupérer les produits par catégorie
router.get('/category/:category', productController_1.getProductsByCategory);
// Route pour récupérer les produits par marque (maintenant avec body)
router.post('/brand', productController_1.getProductsByBrand);
// Route pour récupérer les produits par gamme de prix
router.post('/price-range', productController_1.getProductsByPriceRange);
// Supprimer tous les produits
router.delete('/', productController_1.deleteAllProducts);
// Supprimer un produit par son ID
router.delete('/:productId', productController_1.deleteProductById);
exports.default = router;
