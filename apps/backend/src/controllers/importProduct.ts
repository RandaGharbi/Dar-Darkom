import fs from "fs";
import Product from "../models/Product";
import { Request, Response } from "express";
import {
  RawPastry,
  RawMeat,
  RawFish,
  RawHotDishes,
  RawSalad,
  RawVegetarian,
  TransformedPastry,
  TransformedMeat,
  TransformedFish,
  TransformedHotDishes,
  TransformedSalad,
  TransformedVegetarian,
  ImportResult,
  ImportResponse,
} from "../types";
import mongoose from "mongoose";

// Fonction pour générer un ID unique basé sur le type et l'ID original
function generateUniqueId(originalId: number, productType: string): number {
  const typePrefixes = {
    pastry: 6000000,
    meat: 7000000,
    fish: 8000000,
    hotDishes: 9000000,
    salad: 10000000,
    vegetarian: 11000000,
  };
  return typePrefixes[productType as keyof typeof typePrefixes] + originalId;
}

// Contrôleur Express pour importer tous les produits avec le nouveau schéma unifié
export const importAllProducts = async (req: Request, res: Response) => {
  try {
    console.log("🚀 Début de l'importation des catégories alimentaires...");
    console.log("🔍 Base de données active:", mongoose.connection.db?.databaseName || "Non connecté");
    console.log("🔍 Collection cible: products");
    
    // Suppression des données existantes
    await Product.deleteMany({});
    console.log("✅ Données existantes supprimées");

    let totalImported = 0;
    const importResults: ImportResult[] = [];

    // 1. Import des pâtisseries tunisiennes
    try {
      console.log("🥮 Import des pâtisseries tunisiennes...");
      const pastryData = fs.readFileSync(
        "./src/data/rawPastry.json",
        "utf8"
      );
      const pastries: RawPastry[] = JSON.parse(pastryData);

      const pastriesToInsert: TransformedPastry[] = pastries.map(
        (product) => ({
          id: generateUniqueId(product.id, "pastry"),
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
          productType: "pastry" as const,
          dailySpecial: product.dailySpecial,
        })
      );

      if (pastriesToInsert.length > 0) {
        await Product.insertMany(pastriesToInsert, { ordered: false });
        totalImported += pastriesToInsert.length;
        importResults.push({
          type: "pastry",
          count: pastriesToInsert.length,
        });
        console.log(`✅ ${pastriesToInsert.length} pâtisseries importées`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Erreur inconnue";
      importResults.push({
        type: "pastry",
        error: errorMsg,
      });
      console.error(`❌ Erreur import pâtisseries: ${errorMsg}`);
    }

    // 2. Import des plats de viande
    try {
      console.log("🥩 Import des plats de viande...");
      const meatData = fs.readFileSync(
        "./src/data/rawMeat.json",
        "utf8"
      );
      const meats: RawMeat[] = JSON.parse(meatData);

      const meatsToInsert: TransformedMeat[] = meats.map(
        (product) => ({
          id: generateUniqueId(product.id, "meat"),
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
          productType: "meat" as const,
          dailySpecial: product.dailySpecial,
        })
      );

      if (meatsToInsert.length > 0) {
        await Product.insertMany(meatsToInsert, { ordered: false });
        totalImported += meatsToInsert.length;
        importResults.push({
          type: "meat",
          count: meatsToInsert.length,
        });
        console.log(`✅ ${meatsToInsert.length} plats de viande importés`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Erreur inconnue";
      importResults.push({
        type: "meat",
        error: errorMsg,
      });
      console.error(`❌ Erreur import plats de viande: ${errorMsg}`);
    }

    // 3. Import des plats de poisson
    try {
      console.log("🐟 Import des plats de poisson...");
      const fishData = fs.readFileSync(
        "./src/data/rawFish.json",
        "utf8"
      );
      const fishes: RawFish[] = JSON.parse(fishData);

      const fishesToInsert: TransformedFish[] = fishes.map(
        (product) => ({
          id: generateUniqueId(product.id, "fish"),
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
          productType: "fish" as const,
          dailySpecial: product.dailySpecial,
        })
      );

      if (fishesToInsert.length > 0) {
        await Product.insertMany(fishesToInsert, { ordered: false });
        totalImported += fishesToInsert.length;
        importResults.push({
          type: "fish",
          count: fishesToInsert.length,
        });
        console.log(`✅ ${fishesToInsert.length} plats de poisson importés`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Erreur inconnue";
      importResults.push({
        type: "fish",
        error: errorMsg,
      });
      console.error(`❌ Erreur import plats de poisson: ${errorMsg}`);
    }

    // 4. Import des plats chauds
    try {
      console.log("🔥 Import des plats chauds...");
      const hotDishesData = fs.readFileSync(
        "./src/data/rawHotDishes.json",
        "utf8"
      );
      const hotDishes: RawHotDishes[] = JSON.parse(hotDishesData);

      const hotDishesToInsert: TransformedHotDishes[] = hotDishes.map(
        (product) => ({
          id: generateUniqueId(product.id, "hotDishes"),
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
          productType: "hotDishes" as const,
          dailySpecial: product.dailySpecial,
        })
      );

      if (hotDishesToInsert.length > 0) {
        await Product.insertMany(hotDishesToInsert, { ordered: false });
        totalImported += hotDishesToInsert.length;
        importResults.push({
          type: "hotDishes",
          count: hotDishesToInsert.length,
        });
        console.log(`✅ ${hotDishesToInsert.length} plats chauds importés`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Erreur inconnue";
      importResults.push({
        type: "hotDishes",
        error: errorMsg,
      });
      console.error(`❌ Erreur import plats chauds: ${errorMsg}`);
    }

    // 5. Import des salades
    try {
      console.log("🥗 Import des salades...");
      const saladData = fs.readFileSync(
        "./src/data/rawSalad.json",
        "utf8"
      );
      const salads: RawSalad[] = JSON.parse(saladData);

      const saladsToInsert: TransformedSalad[] = salads.map(
        (product) => ({
          id: generateUniqueId(product.id, "salad"),
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
          productType: "salad" as const,
          dailySpecial: product.dailySpecial,
        })
      );

      if (saladsToInsert.length > 0) {
        await Product.insertMany(saladsToInsert, { ordered: false });
        totalImported += saladsToInsert.length;
        importResults.push({
          type: "salad",
          count: saladsToInsert.length,
        });
        console.log(`✅ ${saladsToInsert.length} salades importées`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Erreur inconnue";
      importResults.push({
        type: "salad",
        error: errorMsg,
      });
      console.error(`❌ Erreur import salades: ${errorMsg}`);
    }

    // 6. Import des plats végétariens
    try {
      console.log("🥬 Import des plats végétariens...");
      const vegetarianData = fs.readFileSync(
        "./src/data/rawVegetarian.json",
        "utf8"
      );
      const vegetarians: RawVegetarian[] = JSON.parse(vegetarianData);

      const vegetariansToInsert: TransformedVegetarian[] = vegetarians.map(
        (product) => ({
          id: generateUniqueId(product.id, "vegetarian"),
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
          productType: "vegetarian" as const,
          dailySpecial: product.dailySpecial,
        })
      );

      if (vegetariansToInsert.length > 0) {
        await Product.insertMany(vegetariansToInsert, { ordered: false });
        totalImported += vegetariansToInsert.length;
        importResults.push({
          type: "vegetarian",
          count: vegetariansToInsert.length,
        });
        console.log(`✅ ${vegetariansToInsert.length} plats végétariens importés`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Erreur inconnue";
      importResults.push({
        type: "vegetarian",
        error: errorMsg,
      });
      console.error(`❌ Erreur import plats végétariens: ${errorMsg}`);
    }

    // Statistiques finales
    console.log("\n📊 Statistiques par type:");
    const stats = await Product.aggregate([
      {
        $group: {
          _id: "$productType",
          count: { $sum: 1 },
          avgPrice: { $avg: "$price" },
        },
      },
    ]);

    stats.forEach((stat: any) => {
      console.log(
        `  ${stat._id}: ${stat.count} produits, prix moyen: ${stat.avgPrice?.toFixed(2) || '0.00'}€`
      );
    });

    console.log(`\n🎉 Importation terminée avec succès !`);
    console.log(`📈 Total des produits importés: ${totalImported}`);

    const response: ImportResponse = {
      message: "Importation terminée avec succès",
      totalImported,
      importResults,
      statistics: stats,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("❌ Erreur lors de l'importation:", error);
    return res.status(500).json({
      error: "Erreur lors de l'importation des produits",
      details: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
};

// Endpoint de test pour vérifier les données
export const testProducts = async (req: Request, res: Response) => {
  try {
    console.log("🧪 Test de vérification des produits...");
    
    const count = await Product.countDocuments();
    console.log(`📊 Nombre total de produits: ${count}`);
    
    const products = await Product.find().limit(5);
    console.log("🔍 Premiers produits:", products.map(p => ({ id: p.id, name: p.name, type: p.productType })));
    
    const stats = await Product.aggregate([
      {
        $group: {
          _id: "$productType",
          count: { $sum: 1 },
        },
      },
    ]);
    
    return res.status(200).json({
      message: "Test de vérification",
      totalCount: count,
      sampleProducts: products,
      statistics: stats,
    });
  } catch (error) {
    console.error("❌ Erreur lors du test:", error);
    return res.status(500).json({
      error: "Erreur lors du test",
      details: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
};
