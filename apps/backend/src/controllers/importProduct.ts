import fs from "fs";
import Product from "../models/Product";
import { Request, Response } from "express";
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
  TransformedProduct,
  ImportResult,
  ImportResponse,
} from "../types";

// Fonction pour générer un ID unique basé sur le type et l'ID original
function generateUniqueId(originalId: number, productType: string): number {
  const typePrefixes = {
    ingredient: 1000000,
    bodyCare: 2000000,
    hairCare: 3000000,
    skinCare: 4000000,
    product: 5000000,
  };
  return typePrefixes[productType as keyof typeof typePrefixes] + originalId;
}

// Contrôleur Express pour importer tous les produits avec le nouveau schéma unifié
export const importAllProducts = async (req: Request, res: Response) => {
  try {
    // Suppression des données existantes
    await Product.deleteMany({});

    let totalImported = 0;
    const importResults: ImportResult[] = [];

    // 1. Import des ingrédients
    try {
      const ingredientsData = fs.readFileSync(
        "./src/data/rawIngredient.json",
        "utf8"
      );
      const ingredients: RawIngredientCategory[] = JSON.parse(ingredientsData);

      const ingredientsToInsert: TransformedIngredient[] = ingredients.flatMap(
        (category) =>
          category.ingredients.map((ingredient) => ({
            id: generateUniqueId(ingredient.id, "ingredient"),
            name: ingredient.name,
            description: ingredient.description,
            image: ingredient.image,
            category: category.category,
            product_url: "", // Les ingrédients n'ont pas d'URL produit
            price: 0, // Prix à définir selon les besoins
            productType: "ingredient" as const,
          }))
      );

      if (ingredientsToInsert.length > 0) {
        await Product.insertMany(ingredientsToInsert, { ordered: false });
        totalImported += ingredientsToInsert.length;
        importResults.push({
          type: "ingredients",
          count: ingredientsToInsert.length,
        });
      }
    } catch (error) {
      importResults.push({
        type: "ingredients",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }

    // 2. Import des produits de soin du corps
    try {
      const bodyCareData = fs.readFileSync(
        "./src/data/rawBodyCare.json",
        "utf8"
      );
      const bodyCare: RawBodyCare[] = JSON.parse(bodyCareData);

      const bodyCareToInsert: TransformedBodyCare[] = bodyCare.map(
        (product) => ({
          id: generateUniqueId(product.id, "bodyCare"),
          name: product.Name,
          title: product.Name,
          subtitle: product.Subtitle,
          image: product.Image,
          product_url: product.product_url,
          price: product.price,
          category: product.category,
          arrivals: product.Arrivals,
          productType: "bodyCare" as const,
        })
      );

      if (bodyCareToInsert.length > 0) {
        await Product.insertMany(bodyCareToInsert, { ordered: false });
        totalImported += bodyCareToInsert.length;
        importResults.push({
          type: "bodyCare",
          count: bodyCareToInsert.length,
        });
      }
    } catch (error) {
      importResults.push({
        type: "bodyCare",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }

    // 3. Import des produits capillaires
    try {
      const hairCareData = fs.readFileSync(
        "./src/data/rawHairCare.json",
        "utf8"
      );
      const hairCare: RawHairCare[] = JSON.parse(hairCareData);

      const hairCareToInsert: TransformedHairCare[] = hairCare.map(
        (product) => ({
          id: generateUniqueId(product.id, "hairCare"),
          name: product.Name,
          title: product.Name,
          subtitle: product.Subtitle,
          image: product.Image,
          product_url: product.product_url,
          price: product.price,
          category: product.category,
          arrivals: product.Arrivals,
          productType: "hairCare" as const,
        })
      );

      if (hairCareToInsert.length > 0) {
        await Product.insertMany(hairCareToInsert, { ordered: false });
        totalImported += hairCareToInsert.length;
        importResults.push({
          type: "hairCare",
          count: hairCareToInsert.length,
        });
      }
    } catch (error) {
      importResults.push({
        type: "hairCare",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }

    // 4. Import des produits de soin de la peau
    try {
      const skinCareData = fs.readFileSync(
        "./src/data/rawSkinCare.json",
        "utf8"
      );
      const skinCare: RawSkinCare[] = JSON.parse(skinCareData);

      const skinCareToInsert: TransformedSkinCare[] = skinCare.map(
        (product) => ({
          id: generateUniqueId(product.id, "skinCare"),
          name: product.Name,
          title: product.Name,
          subtitle: product.Subtitle,
          image: product.Image,
          product_url: product.product_url,
          price: product.price,
          category: product.category,
          arrivals: product.Arrivals,
          productType: "skinCare" as const,
        })
      );

      if (skinCareToInsert.length > 0) {
        await Product.insertMany(skinCareToInsert, { ordered: false });
        totalImported += skinCareToInsert.length;
        importResults.push({
          type: "skinCare",
          count: skinCareToInsert.length,
        });
      }
    } catch (error) {
      importResults.push({
        type: "skinCare",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }

    // 5. Import des produits généraux
    try {
      const productsData = fs.readFileSync(
        "./src/data/rawProducts.json",
        "utf8"
      );
      const products: RawProduct[] = JSON.parse(productsData);

      const productsToInsert: TransformedProduct[] = products.map(
        (product) => ({
          id: generateUniqueId(product.id, "product"),
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
          productType: "product" as const,
        })
      );

      if (productsToInsert.length > 0) {
        await Product.insertMany(productsToInsert, { ordered: false });
        totalImported += productsToInsert.length;
        importResults.push({
          type: "products",
          count: productsToInsert.length,
        });
      }
    } catch (error) {
      importResults.push({
        type: "products",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      });
    }

    // Statistiques finales
    const stats = await Product.aggregate([
      {
        $group: {
          _id: "$productType",
          count: { $sum: 1 },
          avgPrice: { $avg: "$price" },
        },
      },
    ]);

    console.log("\n📊 Statistiques par type:");
    stats.forEach((stat) => {
      console.log(
        `  ${stat._id}: ${
          stat.count
        } produits, prix moyen: ${stat.avgPrice.toFixed(2)}€`
      );
    });

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
