import { Request, Response } from 'express';
import Favorite from '../models/Favorite';

// Ajouter un produit aux favoris
export const addToFavorites = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const { productId, title, subtitle, price, image_url, category } = req.body;

    // Vérification des champs essentiels
    if (!productId || !title || !image_url || typeof price !== 'number') {
      return res.status(400).json({ message: 'Champs produit manquants pour le favori' });
    }

    // Vérifier si le produit est déjà en favori
    const existingFavorite = await Favorite.findOne({ userId, productId });
    if (existingFavorite) {
      return res.status(400).json({ message: 'Ce produit est déjà dans vos favoris' });
    }

    // Créer un nouveau favori
    const favorite = new Favorite({
      userId,
      productId,
      title,
      subtitle,
      price,
      image_url,
      category
    });

    await favorite.save();

    res.status(201).json({
      message: 'Produit ajouté aux favoris',
      favorite
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout aux favoris:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer un produit des favoris
export const removeFromFavorites = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const { productId } = req.params;

    const favorite = await Favorite.findOneAndDelete({ userId, productId });
    
    if (!favorite) {
      return res.status(404).json({ message: 'Favori non trouvé' });
    }

    res.json({ message: 'Produit retiré des favoris' });
  } catch (error) {
    console.error('Erreur lors de la suppression du favori:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Obtenir tous les favoris d'un utilisateur
export const getFavorites = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const favorites = await Favorite.find({ userId }).sort({ createdAt: -1 });

    res.json({
      favorites,
      count: favorites.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des favoris:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Vérifier si un produit est en favori
export const isFavorite = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const { productId } = req.params;

    const favorite = await Favorite.findOne({ userId, productId });

    res.json({
      isFavorite: !!favorite
    });
  } catch (error) {
    console.error('Erreur lors de la vérification du favori:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Toggle favori (ajouter si pas présent, supprimer si présent)
export const toggleFavorite = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const { productId, title, subtitle, price, image_url, category } = req.body;

    // Vérifier si le produit est déjà en favori
    const existingFavorite = await Favorite.findOne({ userId, productId });

    if (existingFavorite) {
      // Supprimer le favori
      await Favorite.findOneAndDelete({ userId, productId });
      res.json({ 
        message: 'Produit retiré des favoris',
        isFavorite: false
      });
    } else {
      // Ajouter le favori
      const favorite = new Favorite({
        userId,
        productId,
        title,
        subtitle,
        price,
        image_url,
        category
      });

      await favorite.save();
      res.json({ 
        message: 'Produit ajouté aux favoris',
        isFavorite: true,
        favorite
      });
    }
  } catch (error) {
    console.error('Erreur lors du toggle du favori:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer tous les favoris d'un utilisateur
export const clearFavorites = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    await Favorite.deleteMany({ userId });

    res.json({ message: 'Tous les favoris ont été supprimés' });
  } catch (error) {
    console.error('Erreur lors de la suppression des favoris:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}; 