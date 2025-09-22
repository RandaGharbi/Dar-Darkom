import express from 'express';
import {
    getAllProducts,
    getAllCategories,
    getProductsByCategory,
    getProductById,
    searchProducts,
    getProductsByBrand,
    getProductsByPriceRange,
    getProductsByType,
    deleteProductById,
    deleteAllProducts,
    createProduct,
    updateProduct,
    getDailySpecialProducts
} from '../controllers/productController';
import { importAllProducts, testProducts } from '../controllers/importProduct';

const router = express.Router();

// Route pour importer les produits
router.post('/import', importAllProducts);

// Route de test pour vérifier les produits
router.get('/test', testProducts);

// Route POST pour créer un produit (alternative explicite)
router.post('/addProduct', createProduct);

// Route PUT pour modifier un produit
router.put('/:productId', updateProduct);

// Route GET pour récupérer les plats du jour
router.get('/daily-special', getDailySpecialProducts);

// Route GET pour récupérer tous les produits
router.get('/', getAllProducts);

// Route GET pour récupérer toutes les catégories
router.get('/categories', getAllCategories);

// Route GET pour récupérer les produits par type
router.get('/type/:productType', getProductsByType);

// Route GET pour récupérer un produit par son ID
router.get('/:productId', getProductById);

// Route pour rechercher des produits
router.post('/search', searchProducts);

// Route pour récupérer les produits par catégorie
router.get('/category/:category', getProductsByCategory);

// Route pour récupérer les produits par marque (maintenant avec body)
router.post('/brand', getProductsByBrand);

// Route pour récupérer les produits par gamme de prix
router.post('/price-range', getProductsByPriceRange);

// Supprimer tous les produits
router.delete('/', deleteAllProducts);
// Supprimer un produit par son ID
router.delete('/:productId', deleteProductById);

export default router;