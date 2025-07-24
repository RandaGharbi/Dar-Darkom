import { Request, Response } from "express";
import Product from "../models/Product";

interface SearchBody {
  query?: string;
}

interface PriceRangeBody {
  minPrice: string;
  maxPrice: string;
}

interface BrandBody {
  brandCreator?: string;
}

// Récupérer tous les produits
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    res.status(500).json({
      message: "Erreur lors de la récupération des produits",
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

// Récupérer les produits par type
export const getProductsByType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productType } = req.params;
    const validTypes = ['ingredient', 'bodyCare', 'hairCare', 'skinCare', 'product'];
    
    if (!validTypes.includes(productType)) {
      res.status(400).json({ 
        message: "Type de produit invalide. Types valides: ingredient, bodyCare, hairCare, skinCare, product" 
      });
      return;
    }

    const products = await Product.find({ productType });
    res.status(200).json(products);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits par type:', error);
    res.status(500).json({
      message: "Erreur lors de la récupération des produits par type",
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

// Récupérer un produit par son ID
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findOne({ id: req.params.productId });
    if (!product) {
      res.status(404).json({ message: "Produit non trouvé" });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    res.status(500).json({
      message: "Erreur lors de la récupération du produit",
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

// Rechercher des produits
export const searchProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.body as SearchBody;
    if (!query) {
      res.status(400).json({ message: "Le paramètre 'query' est requis" });
      return;
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    });

    res.status(200).json(products);
  } catch (error) {
    console.error('Erreur lors de la recherche des produits:', error);
    res.status(500).json({
      message: "Erreur lors de la recherche des produits",
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

// Récupérer les produits par catégorie
export const getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category: { $regex: category, $options: 'i' } });
    res.status(200).json(products);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits par catégorie:', error);
    res.status(500).json({
      message: "Erreur lors de la récupération des produits par catégorie",
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

// Récupérer les produits par marque
export const getProductsByBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    const { brandCreator } = req.body as BrandBody;
    if (!brandCreator) {
      res.status(400).json({ message: "Le paramètre 'brandCreator' est requis" });
      return;
    }

    const products = await Product.find({ 
      productBrand: { $regex: brandCreator, $options: 'i' } 
    });
    res.status(200).json(products);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits par marque:', error);
    res.status(500).json({
      message: "Erreur lors de la récupération des produits par marque",
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

// Récupérer les produits par gamme de prix
export const getProductsByPriceRange = async (req: Request, res: Response): Promise<void> => {
  try {
    const { minPrice, maxPrice } = req.body as PriceRangeBody;
    if (!minPrice || !maxPrice) {
      res.status(400).json({ message: "Les paramètres 'minPrice' et 'maxPrice' sont requis" });
      return;
    }

    const products = await Product.find({
      price: {
        $gte: parseFloat(minPrice),
        $lte: parseFloat(maxPrice)
      }
    });
    res.status(200).json(products);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits par gamme de prix:', error);
    res.status(500).json({
      message: "Erreur lors de la récupération des produits par gamme de prix",
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

// Supprimer un produit par son ID
export const deleteProductById = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const deleted = await Product.findOneAndDelete({ id: productId });
    if (!deleted) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }
    res.status(200).json({ message: "Produit supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du produit", error });
  }
};

// Supprimer tous les produits
export const deleteAllProducts = async (req: Request, res: Response) => {
  try {
    await Product.deleteMany({});
    res.status(200).json({ message: "Tous les produits ont été supprimés" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression des produits", error });
  }
};
