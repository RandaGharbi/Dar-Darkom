import mongoose from 'mongoose';
import fs from 'fs';
import { connectDB } from '../database/connectToDB';
import Product from '../models/Product';
import {
  RawIngredientCategory,
  RawBodyCare,
  RawHairCare,
  RawSkinCare,
  RawProduct,
  TransformedIngredient,
  TransformedBodyCare,
  TransformedHairCare,
  TransformedSkinCare,
  TransformedProduct
} from '../types';

// Fonction pour générer un ID unique basé sur le type et l'ID original
function generateUniqueId(originalId: number, productType: string): number {
  const typePrefixes = {
    ingredient: 1000000,
    bodyCare: 2000000,
    hairCare: 3000000,
    skinCare: 4000000,
    product: 5000000
  };
  return typePrefixes[productType as keyof typeof typePrefixes] + originalId;
}

async function importAllProducts() {
  try {
    // Connexion à la base de données
    await connectDB();
    console.log('✅ Connexion à MongoDB établie');

    // Suppression des données existantes
    await Product.deleteMany({});
    console.log('🗑️  Anciennes données supprimées');


    // 1. Import des ingrédients
    try {
      const ingredientsData = fs.readFileSync('./src/data/rawIngredient.json', 'utf8');
      const ingredients: RawIngredientCategory[] = JSON.parse(ingredientsData);

      const ingredientsToInsert: TransformedIngredient[] = ingredients.flatMap(category => 
        category.ingredients.map(ingredient => ({
          id: generateUniqueId(ingredient.id, 'ingredient'),
          name: ingredient.name,
          description: ingredient.description,
          image: ingredient.image,
          category: category.category,
          product_url: '', // Les ingrédients n'ont pas d'URL produit
          price: 0, // Prix à définir selon les besoins
          productType: 'ingredient' as const
        }))
      );

      if (ingredientsToInsert.length > 0) {
        await Product.insertMany(ingredientsToInsert, { ordered: false });
        console.log(`✅ ${ingredientsToInsert.length} ingrédients importés`);
      }
    } catch (error) {
      console.log('⚠️  Erreur lors de l\'import des ingrédients:', error);
    }

    // 2. Import des produits de soin du corps
    try {
      const bodyCareData = fs.readFileSync('./src/data/rawBodyCare.json', 'utf8');
      const bodyCare: RawBodyCare[] = JSON.parse(bodyCareData);

      const bodyCareToInsert: TransformedBodyCare[] = bodyCare.map(product => ({
        id: generateUniqueId(product.id, 'bodyCare'),
        name: product.Name,
        title: product.Name,
        subtitle: product.Subtitle,
        image: product.Image,
        product_url: product.product_url,
        price: product.price,
        category: product.category,
        arrivals: product.Arrivals,
        productType: 'bodyCare' as const
      }));

      if (bodyCareToInsert.length > 0) {
        await Product.insertMany(bodyCareToInsert, { ordered: false });
        console.log(`✅ ${bodyCareToInsert.length} produits de soin du corps importés`);
      }
    } catch (error) {
      console.log('⚠️  Erreur lors de l\'import des produits de soin du corps:', error);
    }

    // 3. Import des produits capillaires
    try {
      const hairCareData = fs.readFileSync('./src/data/rawHairCare.json', 'utf8');
      const hairCare: RawHairCare[] = JSON.parse(hairCareData);

      const hairCareToInsert: TransformedHairCare[] = hairCare.map(product => ({
        id: generateUniqueId(product.id, 'hairCare'),
        name: product.Name,
        title: product.Name,
        subtitle: product.Subtitle,
        image: product.Image,
        product_url: product.product_url,
        price: product.price,
        category: product.category,
        arrivals: product.Arrivals,
        productType: 'hairCare' as const
      }));

      if (hairCareToInsert.length > 0) {
        await Product.insertMany(hairCareToInsert, { ordered: false });
        console.log(`✅ ${hairCareToInsert.length} produits capillaires importés`);
      }
    } catch (error) {
      console.log('⚠️  Erreur lors de l\'import des produits capillaires:', error);
    }

    // 4. Import des produits de soin de la peau
    try {
      const skinCareData = fs.readFileSync('./src/data/rawSkinCare.json', 'utf8');
      const skinCare: RawSkinCare[] = JSON.parse(skinCareData);

      const skinCareToInsert: TransformedSkinCare[] = skinCare.map(product => ({
        id: generateUniqueId(product.id, 'skinCare'),
        name: product.Name,
        title: product.Name,
        subtitle: product.Subtitle,
        image: product.Image,
        product_url: product.product_url,
        price: product.price,
        category: product.category,
        arrivals: product.Arrivals,
        productType: 'skinCare' as const
      }));

      
      if (skinCareToInsert.length > 0) {
        await Product.insertMany(skinCareToInsert, { ordered: false });
        console.log(`✅ ${skinCareToInsert.length} produits de soin de la peau importés`);
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'import des produits de soin de la peau:', error);
      if (error instanceof Error) {
        console.error('Détails de l\'erreur:', error.message);
        console.error('Stack trace:', error.stack);
      }
    }

    // 5. Import des produits généraux
    try {
      const productsData = fs.readFileSync('./src/data/rawProducts.json', 'utf8');
      const products: RawProduct[] = JSON.parse(productsData);

      const productsToInsert: TransformedProduct[] = products.map(product => ({
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
        category: product.category,    // correction ici
        productType: 'product' as const
      }));

      if (productsToInsert.length > 0) {
        await Product.insertMany(productsToInsert, { ordered: false });
        console.log(`✅ ${productsToInsert.length} produits généraux importés`);
      }
    } catch (error) {
      console.log('⚠️  Erreur lors de l\'import des produits généraux:', error);
    }


    // Statistiques finales
    const stats = await Product.aggregate([
      {
        $group: {
          _id: '$productType',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      }
    ]);

    stats.forEach(_stat => {
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'importation:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Exécution du script
importAllProducts(); 