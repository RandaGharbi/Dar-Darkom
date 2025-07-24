import { Request, Response } from "express";
import Order from "../models/Order";
import Cart, { ICart } from "../models/Basket";
import { IProduct } from "../types";
import mongoose from "mongoose";

export const createOrder = async (req: Request, res: Response) => {
  const userId = req.body.userId;
  console.log("POST /orders/create reçu", req.body);
  if (!userId) {
    console.log("userId manquant dans la requête");
    return res.status(400).json({ message: "userId requis" });
  }
  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    console.log("Recherche du panier pour userId:", userId, "->", userObjectId);
    // Récupère le panier de l'utilisateur
    const cart = (await Cart.findOne({ userId: userObjectId }).populate(
      "items.productId"
    )) as ICart | null;
    console.log("Panier trouvé:", cart);
    if (!cart || !cart.items.length) {
      console.log("Panier vide pour userId:", userId, cart);
      return res.status(400).json({ message: "Panier vide" });
    }
    // Prépare les items de la commande avec tous les détails produit
    const items = cart.items.map((item) => {
      const product = item.productId as unknown as IProduct;
      console.log("Image du produit:", product.image, product.image_url);
      return {
        name: product.name,
        qty: item.quantity,
        image: product.image || product.image_url || '',
        price: product.price,
      };
    });
    const subtotal = items.reduce((sum, p) => sum + (p.price || 0) * (p.qty || 1), 0);
    const shipping = 5;
    const tax = 0.1 * subtotal;
    const total = subtotal + shipping + tax;
    console.log("Items préparés pour la commande:", items);
    console.log('shippingAddress reçu:', req.body.shippingAddress);
    // Crée la commande
    const order = await Order.create({
      userId: userObjectId,
      products: items,
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress: {
        street: req.body.shippingAddress?.street,
        city: req.body.shippingAddress?.city,
        postalCode: req.body.shippingAddress?.postalCode,
        country: req.body.shippingAddress?.country,
      },
      isOrdered: true,
    });
    console.log("Nouvelle commande créée:", order);
    
    // Vide le panier et marque comme commandé
    cart.items = [];
    cart.set("isOrdered", true);
    await cart.save();
    console.log("Panier APRÈS update isOrdered:", cart);
    res.status(201).json(order);
  } catch (err) {
    console.log("Erreur lors de la création de la commande:", err);
    res.status(500).json({ message: "Erreur serveur", error: err });
  }
};

export const getActiveOrders = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  console.log('[BACK] getActiveOrders', { userId });
  if (!userId) return res.status(400).json({ message: 'userId requis' });
  try {
    const orders = await Order.find({ userId, status: 'active' }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};

export const getOrderHistory = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  if (!userId) return res.status(400).json({ message: 'userId requis' });
  try {
    const orders = await Order.find({ userId, status: { $ne: 'active' } }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({}).populate('userId', 'name email phoneNumber dateOfBirth gender preferredLanguage username').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  const orderId = req.params.id;
  if (!orderId) return res.status(400).json({ message: 'ID de commande requis' });
  
  try {
    const order = await Order.findById(orderId).populate('userId', 'name email phoneNumber dateOfBirth gender preferredLanguage username');
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};
