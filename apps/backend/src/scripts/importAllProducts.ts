import fs from 'fs';
import Product from '../models/Product';
import { IProduct } from '../models/Product';

// Fonction pour générer un ID unique basé sur le type et l'ID original
function generateUniqueId(originalId: number, productType: string): number {
  const typePrefixes = {
    product: 1000000,
    meat: 2000000,
    hotDishes: 3000000
  };
  return typePrefixes[productType as keyof typeof typePrefixes] + originalId;
}

async function importAllProducts() {
  try {
    // Suppression des données existantes
    await Product.deleteMany({});
    console.log('🗑️  Anciennes données supprimées');






    // 1. Import des produits généraux
    try {
      const productsData = fs.readFileSync('./src/data/rawProducts.json', 'utf8');
      const products: any[] = JSON.parse(productsData);

      const productsToInsert: Partial<IProduct>[] = products.map(product => ({
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
        productType: 'vegetarian' as const
      }));

      if (productsToInsert.length > 0) {
        await Product.insertMany(productsToInsert, { ordered: false });
        console.log(`✅ ${productsToInsert.length} produits généraux importés`);
      }
    } catch (error) {
      console.log('⚠️  Erreur lors de l\'import des produits généraux:', error);
    }

    // 2. Import des produits de viande
    try {
      const meatData = fs.readFileSync('./src/data/rawMeat.json', 'utf8');
      const meat: any[] = JSON.parse(meatData);

      const meatToInsert = meat.map(product => ({
        id: generateUniqueId(product.id, 'meat'),
        name: product.Name,
        title: product.Name,
        subtitle: product.Subtitle,
        image: product.Image,
        product_url: product.product_url,
        price: product.price,
        category: product.category,
        arrivals: product.Arrivals,
        quantity: product.quantity,
        status: product.status,
        productType: 'meat' as const,
        dailySpecial: product.dailySpecial
      }));

      if (meatToInsert.length > 0) {
        await Product.insertMany(meatToInsert, { ordered: false });
        console.log(`✅ ${meatToInsert.length} produits de viande importés`);
      }
    } catch (error) {
      console.log('⚠️  Erreur lors de l\'import des produits de viande:', error);
    }

    // 7. Import des plats chauds
    try {
      const hotDishesData = fs.readFileSync('./src/data/rawHotDishes.json', 'utf8');
      const hotDishes = JSON.parse(hotDishesData);

      const hotDishesToInsert = hotDishes.map(product => ({
        id: generateUniqueId(product.id, 'hotDishes'),
        name: product.Name,
        title: product.Name,
        subtitle: product.Subtitle,
        image: product.Image,
        product_url: product.product_url,
        price: product.price,
        category: product.category,
        arrivals: product.Arrivals,
        quantity: product.quantity,
        status: product.status,
        productType: 'hotDishes' as const,
        dailySpecial: product.dailySpecial
      }));

      if (hotDishesToInsert.length > 0) {
        await Product.insertMany(hotDishesToInsert, { ordered: false });
        console.log(`✅ ${hotDishesToInsert.length} plats chauds importés`);
      }
    } catch (error) {
      console.log('⚠️  Erreur lors de l\'import des plats chauds:', error);
    }

    // 8. Import des salades
    try {
      const saladData = fs.readFileSync('./src/data/rawSalad.json', 'utf8');
      const salads = JSON.parse(saladData);

      const saladsToInsert = salads.map(product => ({
        id: generateUniqueId(product.id, 'product'),
        name: product.Name,
        title: product.Name,
        subtitle: product.Subtitle,
        image: product.Image,
        product_url: product.product_url,
        price: product.price,
        category: product.category,
        arrivals: product.Arrivals,
        quantity: product.quantity,
        status: product.status,
        productType: 'product' as const,
        dailySpecial: product.dailySpecial
      }));

      if (saladsToInsert.length > 0) {
        await Product.insertMany(saladsToInsert, { ordered: false });
        console.log(`✅ ${saladsToInsert.length} salades importées`);
      }
    } catch (error) {
      console.log('⚠️  Erreur lors de l\'import des salades:', error);
    }

    // 9. Import des pâtisseries
    try {
      const pastryData = fs.readFileSync('./src/data/rawPastry.json', 'utf8');
      const pastries = JSON.parse(pastryData);

      const pastriesToInsert = pastries.map(product => ({
        id: generateUniqueId(product.id, 'product'),
        name: product.Name,
        title: product.Name,
        subtitle: product.Subtitle,
        image: product.Image,
        product_url: product.product_url,
        price: product.price,
        category: product.category,
        arrivals: product.Arrivals,
        quantity: product.quantity,
        status: product.status,
        productType: 'product' as const,
        dailySpecial: product.dailySpecial
      }));

      if (pastriesToInsert.length > 0) {
        await Product.insertMany(pastriesToInsert, { ordered: false });
        console.log(`✅ ${pastriesToInsert.length} pâtisseries importées`);
      }
    } catch (error) {
      console.log('⚠️  Erreur lors de l\'import des pâtisseries:', error);
    }

    // 10. Import des poissons
    try {
      const fishData = fs.readFileSync('./src/data/rawFish.json', 'utf8');
      const fish = JSON.parse(fishData);

      const fishToInsert = fish.map(product => ({
        id: generateUniqueId(product.id, 'product'),
        name: product.Name,
        title: product.Name,
        subtitle: product.Subtitle,
        image: product.Image,
        product_url: product.product_url,
        price: product.price,
        category: product.category,
        arrivals: product.Arrivals,
        quantity: product.quantity,
        status: product.status,
        productType: 'product' as const,
        dailySpecial: product.dailySpecial,
        nessma_recipe: product.nessma_recipe
      }));

      if (fishToInsert.length > 0) {
        await Product.insertMany(fishToInsert, { ordered: false });
        console.log(`✅ ${fishToInsert.length} poissons importés`);
      }
    } catch (error) {
      console.log('⚠️  Erreur lors de l\'import des poissons:', error);
    }

    // 11. Import des plats végétariens
    try {
      const vegetarianData = fs.readFileSync('./src/data/rawVegetarian.json', 'utf8');
      const vegetarian = JSON.parse(vegetarianData);

      const vegetarianToInsert = vegetarian.map(product => ({
        id: generateUniqueId(product.id, 'product'),
        name: product.Name,
        title: product.Name,
        subtitle: product.Subtitle,
        image: product.Image,
        product_url: product.product_url,
        price: product.price,
        category: product.category,
        arrivals: product.Arrivals,
        quantity: product.quantity,
        status: product.status,
        productType: 'product' as const,
        dailySpecial: product.dailySpecial
      }));

      if (vegetarianToInsert.length > 0) {
        await Product.insertMany(vegetarianToInsert, { ordered: false });
        console.log(`✅ ${vegetarianToInsert.length} plats végétariens importés`);
      }
    } catch (error) {
      console.log('⚠️  Erreur lors de l\'import des plats végétariens:', error);
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
  }
}

// Exécution du script
importAllProducts(); 