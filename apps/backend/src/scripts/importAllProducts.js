"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = __importDefault(require("fs"));
const connectToDB_1 = require("../database/connectToDB");
const Product_1 = __importDefault(require("../models/Product"));
// Fonction pour générer un ID unique basé sur le type et l'ID original
function generateUniqueId(originalId, productType) {
    const typePrefixes = {
        ingredient: 1000000,
        bodyCare: 2000000,
        hairCare: 3000000,
        skinCare: 4000000,
        product: 5000000
    };
    return typePrefixes[productType] + originalId;
}
function importAllProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connexion à la base de données
            yield (0, connectToDB_1.connectDB)();
            console.log('✅ Connexion à MongoDB établie');
            // Suppression des données existantes
            yield Product_1.default.deleteMany({});
            console.log('🗑️  Anciennes données supprimées');
            let totalImported = 0;
            // 1. Import des ingrédients
            try {
                const ingredientsData = fs_1.default.readFileSync('./src/data/rawIngredient.json', 'utf8');
                const ingredients = JSON.parse(ingredientsData);
                const ingredientsToInsert = ingredients.flatMap(category => category.ingredients.map(ingredient => ({
                    id: generateUniqueId(ingredient.id, 'ingredient'),
                    name: ingredient.name,
                    description: ingredient.description,
                    image: ingredient.image,
                    category: category.category,
                    product_url: '', // Les ingrédients n'ont pas d'URL produit
                    price: 0, // Prix à définir selon les besoins
                    productType: 'ingredient'
                })));
                if (ingredientsToInsert.length > 0) {
                    yield Product_1.default.insertMany(ingredientsToInsert, { ordered: false });
                    console.log(`✅ ${ingredientsToInsert.length} ingrédients importés`);
                    totalImported += ingredientsToInsert.length;
                }
            }
            catch (error) {
                console.log('⚠️  Erreur lors de l\'import des ingrédients:', error);
            }
            // 2. Import des produits de soin du corps
            try {
                const bodyCareData = fs_1.default.readFileSync('./src/data/rawBodyCare.json', 'utf8');
                const bodyCare = JSON.parse(bodyCareData);
                const bodyCareToInsert = bodyCare.map(product => ({
                    id: generateUniqueId(product.id, 'bodyCare'),
                    name: product.Name,
                    title: product.Name,
                    subtitle: product.Subtitle,
                    image: product.Image,
                    product_url: product.product_url,
                    price: product.price,
                    category: product.category,
                    arrivals: product.Arrivals,
                    productType: 'bodyCare'
                }));
                if (bodyCareToInsert.length > 0) {
                    yield Product_1.default.insertMany(bodyCareToInsert, { ordered: false });
                    console.log(`✅ ${bodyCareToInsert.length} produits de soin du corps importés`);
                    totalImported += bodyCareToInsert.length;
                }
            }
            catch (error) {
                console.log('⚠️  Erreur lors de l\'import des produits de soin du corps:', error);
            }
            // 3. Import des produits capillaires
            try {
                const hairCareData = fs_1.default.readFileSync('./src/data/rawHairCare.json', 'utf8');
                const hairCare = JSON.parse(hairCareData);
                const hairCareToInsert = hairCare.map(product => ({
                    id: generateUniqueId(product.id, 'hairCare'),
                    name: product.Name,
                    title: product.Name,
                    subtitle: product.Subtitle,
                    image: product.Image,
                    product_url: product.product_url,
                    price: product.price,
                    category: product.category,
                    arrivals: product.Arrivals,
                    productType: 'hairCare'
                }));
                if (hairCareToInsert.length > 0) {
                    yield Product_1.default.insertMany(hairCareToInsert, { ordered: false });
                    console.log(`✅ ${hairCareToInsert.length} produits capillaires importés`);
                    totalImported += hairCareToInsert.length;
                }
            }
            catch (error) {
                console.log('⚠️  Erreur lors de l\'import des produits capillaires:', error);
            }
            // 4. Import des produits de soin de la peau
            try {
                const skinCareData = fs_1.default.readFileSync('./src/data/rawSkinCare.json', 'utf8');
                const skinCare = JSON.parse(skinCareData);
                const skinCareToInsert = skinCare.map(product => ({
                    id: generateUniqueId(product.id, 'skinCare'),
                    name: product.Name,
                    title: product.Name,
                    subtitle: product.Subtitle,
                    image: product.Image,
                    product_url: product.product_url,
                    price: product.price,
                    category: product.category,
                    arrivals: product.Arrivals,
                    productType: 'skinCare'
                }));
                if (skinCareToInsert.length > 0) {
                    yield Product_1.default.insertMany(skinCareToInsert, { ordered: false });
                    console.log(`✅ ${skinCareToInsert.length} produits de soin de la peau importés`);
                    totalImported += skinCareToInsert.length;
                }
            }
            catch (error) {
                console.error('❌ Erreur lors de l\'import des produits de soin de la peau:', error);
                if (error instanceof Error) {
                    console.error('Détails de l\'erreur:', error.message);
                    console.error('Stack trace:', error.stack);
                }
            }
            // 5. Import des produits généraux
            try {
                const productsData = fs_1.default.readFileSync('./src/data/rawProducts.json', 'utf8');
                const products = JSON.parse(productsData);
                const productsToInsert = products.map(product => ({
                    id: generateUniqueId(product.id, 'product'),
                    name: product.title,
                    title: product.title,
                    image_url: product.image_url,
                    product_url: product.product_url,
                    price: product.price,
                    customerRating: product.customerRating,
                    numberOfReviews: product.numberOfReviews,
                    productBrand: product.category, // correction ici
                    typeOfCare: product.typeOfCare,
                    category: product.category, // correction ici
                    productType: 'product'
                }));
                if (productsToInsert.length > 0) {
                    yield Product_1.default.insertMany(productsToInsert, { ordered: false });
                    console.log(`✅ ${productsToInsert.length} produits généraux importés`);
                    totalImported += productsToInsert.length;
                }
            }
            catch (error) {
                console.log('⚠️  Erreur lors de l\'import des produits généraux:', error);
            }
            // Statistiques finales
            const stats = yield Product_1.default.aggregate([
                {
                    $group: {
                        _id: '$productType',
                        count: { $sum: 1 },
                        avgPrice: { $avg: '$price' }
                    }
                }
            ]);
            stats.forEach(stat => {
            });
        }
        catch (error) {
            console.error('❌ Erreur lors de l\'importation:', error);
        }
        finally {
            yield mongoose_1.default.disconnect();
        }
    });
}
// Exécution du script
importAllProducts();
