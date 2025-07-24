import { Request, Response } from 'express';
import Cart from '../models/Basket';
import Product from '../models/Product';

// Ajouter un produit au panier
export const addToCart = async (req: Request, res: Response) => {
  const userId = req.body.userId;
  const { productId, quantity = 1 } = req.body;
 
  if (!userId || !productId) {
    console.log('addToCart erreur: userId ou productId manquant');
    return res.status(400).json({ message: 'userId et productId sont requis' });
  }
  
  try {
    // D'abord, trouver le produit par son id numérique pour obtenir son _id MongoDB
    const product = await Product.findOne({ id: productId });
    if (!product) {
      console.log('Produit non trouvé avec id:', productId);
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    const mongoProductId = product._id;
    console.log('Produit trouvé:', product.name, 'MongoDB ID:', mongoProductId);
    
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [{ productId: mongoProductId, quantity }] });
      console.log('Nouveau panier créé:', cart);
    } else {
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === mongoProductId.toString());
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
        console.log('Quantité mise à jour pour le produit existant');
      } else {
        cart.items.push({ productId: mongoProductId, quantity });
      }
      await cart.save();
    }
    // Renvoie le panier peuplé
    const populatedCart = await Cart.findById(cart._id).populate('items.productId');
    res.json(populatedCart);
  } catch (err) {
    console.log('Erreur serveur dans addToCart:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};

// Récupérer le panier de l'utilisateur
export const getCart = async (req: Request, res: Response) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ message: 'userId requis' });
  }
  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    res.json(cart || { userId, items: [] });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};

// Supprimer un produit du panier
export const removeFromCart = async (req: Request, res: Response) => {
  const userId = req.body.userId;
  const { productId } = req.body;
  if (!userId || !productId) {
    return res.status(400).json({ message: 'userId et productId sont requis' });
  }
  try {
    // D'abord, trouver le produit par son id numérique pour obtenir son _id MongoDB
    const product = await Product.findOne({ id: productId });
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    const mongoProductId = product._id;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Panier non trouvé' });
    cart.items = cart.items.filter(item => String(item.productId) !== String(mongoProductId));
    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.productId');
    res.json(populatedCart);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};

// Mettre à jour la quantité d'un produit
export const updateCartItem = async (req: Request, res: Response) => {
  const userId = req.body.userId;
  const { productId, quantity } = req.body;
  if (!userId || !productId || typeof quantity !== 'number') {
    return res.status(400).json({ message: 'userId, productId et quantity sont requis' });
  }
  try {
    // D'abord, trouver le produit par son id numérique pour obtenir son _id MongoDB
    const product = await Product.findOne({ id: productId });
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    const mongoProductId = product._id;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Panier non trouvé' });
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === mongoProductId.toString());
    if (itemIndex === -1) return res.status(404).json({ message: 'Produit non trouvé dans le panier' });

    if (quantity <= 0) {
      // On retire l'item si quantité <= 0
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }
    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.productId');
    res.json(populatedCart);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};

// Supprimer complètement le panier d'un utilisateur
export const deleteCart = async (req: Request, res: Response) => {
  const userId = req.body.userId;
  if (!userId) {
    return res.status(400).json({ message: 'userId requis' });
  }
  try {
    await Cart.deleteOne({ userId });
    res.json({ message: 'Panier supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
}; 