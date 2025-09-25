import { Request, Response } from "express";
import Order from "../models/Order";
import Cart, { ICart } from "../models/Basket";
import { IProduct } from "../types";
import mongoose from "mongoose";
import { sendNotification, sendOrderNotification, sendAdminNotification } from "../index";
import { addDynamicNotification } from "./notificationController";
import User from "../models/User";
import { smsService } from "../services/smsService"; // 🆕 Import du service SMS

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
      console.log("Image du produit:", product.image);
      return {
        name: product.name,
        qty: item.quantity,
        image: product.image || '',
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
    
    // Trouver l'administrateur pour envoyer la notification
    try {
      const admin = await User.findOne({ role: 'admin' });
      if (admin) {
        // Récupérer les informations de l'utilisateur qui a passé la commande
        const user = await User.findById(userId);
        const userName = user ? user.name : 'Utilisateur';
        
        // Envoyer une notification à l'administrateur
        const notification = {
          _id: `order-${order._id}`,
          userId: (admin._id as string).toString(),
          title: "Nouvelle commande reçue",
          message: `Commande #${(order._id as string).toString().slice(-8)} de ${userName} - Total: ${total.toFixed(2)}€`,
          createdAt: new Date().toISOString(),
          isRead: false,
          type: 'order' as const,
          metadata: {
            orderId: (order._id as string).toString(),
            amount: total,
            customerName: userName
          }
        };
        
        // Envoyer notification WebSocket à l'admin
        sendAdminNotification({
          title: notification.title,
          message: notification.message,
          type: 'new_order',
          metadata: {
            orderId: notification.metadata.orderId,
            amount: notification.metadata.amount,
            customerName: notification.metadata.customerName
          }
        });
        
        // Envoyer aussi la notification persistante
        addDynamicNotification(notification);
        console.log("✅ Notification envoyée à l'administrateur");
      } else {
        console.log("⚠️ Aucun administrateur trouvé pour les notifications");
      }
    } catch (notificationError) {
      console.error("❌ Erreur lors de l'envoi de la notification:", notificationError);
    }

    // 🆕 Envoyer SMS de confirmation de commande au client
    try {
      const user = await User.findById(userId);
      if (user && user.phoneNumber && smsService.validatePhoneNumber(user.phoneNumber)) {
        console.log('📱 [SMS] Envoi de confirmation de commande à:', user.phoneNumber);
        
        const formattedPhone = smsService.formatPhoneNumber(user.phoneNumber);
        const smsResult = await smsService.sendOrderNotificationSMS({
          to: formattedPhone,
          userName: user.name,
          orderId: (order._id as string).toString().slice(-8),
          orderTotal: total,
          orderStatus: 'PENDING',
          companyName: 'Dar-Darkom'
        });

        if (smsResult.success) {
          console.log('✅ [SMS] SMS de confirmation envoyé avec succès');
        } else {
          console.log('⚠️ [SMS] Échec d\'envoi du SMS:', smsResult.error);
        }
      } else {
        console.log('⚠️ [SMS] Numéro de téléphone invalide ou manquant pour:', user?.email);
      }
    } catch (smsError) {
      console.error('❌ [SMS] Erreur lors de l\'envoi du SMS de confirmation:', smsError);
      // On continue même si le SMS échoue - l'essentiel est que la commande soit créée
    }
    
    // Vide le panier et marque comme commandé
    cart.items = [];
    cart.set("isOrdered", true);
    await cart.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err });
  }
};

export const getActiveOrders = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  if (!userId) return res.status(400).json({ message: 'userId requis' });
  try {
    // ✅ Récupérer SEULEMENT les commandes actives de l'utilisateur
    const orders = await Order.find({ userId, status: 'active' }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('[BACK] Erreur getActiveOrders:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};

export const getAllOrdersByUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  console.log('[BACK] getAllOrdersByUser - Récupération de TOUTES les commandes pour:', { userId });
  if (!userId) return res.status(400).json({ message: 'userId requis' });
  try {
    // ✅ Récupérer TOUTES les commandes de l'utilisateur (actives, annulées, terminées)
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    console.log('[BACK] Toutes les commandes trouvées:', orders.length, 'avec statuts:', orders.map(o => o.status));
    res.json(orders);
  } catch (err) {
    console.error('[BACK] Erreur getAllOrdersByUser:', err);
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

export const getOrdersByUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  console.log('[BACK] getOrdersByUser', { userId });
  if (!userId) return res.status(400).json({ message: 'userId requis' });
  try {
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.log('[BACK] Erreur getOrdersByUser:', err);
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

export const updateOrderStatus = async (req: Request, res: Response) => {
  const orderId = req.params.id;
  const { status } = req.body;
  
  if (!orderId) return res.status(400).json({ message: 'ID de commande requis' });
  if (!status) return res.status(400).json({ message: 'Statut requis' });
  
  // Valider que le statut est valide
  const validStatuses = ['active', 'completed', 'cancelled', 'confirmed', 'rejected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Statut invalide. Valeurs autorisées: active, completed, cancelled, confirmed, rejected' });
  }
  
  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate('userId', 'name email phoneNumber dateOfBirth gender preferredLanguage username');
    
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};

// Accepter une commande (admin)
export const acceptOrder = async (req: Request, res: Response) => {
  const orderId = req.params.id;
  
  if (!orderId) return res.status(400).json({ message: 'ID de commande requis' });
  
  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: 'preparing' },
      { new: true }
    ).populate('userId', 'name email phoneNumber');
    
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    
    // Envoyer notification au client via WebSocket
    const userId = (order.userId as any)._id.toString();
    console.log('🔍 BACKEND - AcceptOrder - userId:', userId, 'orderId:', orderId);
    
    const notification = {
      title: 'Commande acceptée',
      message: `Votre commande #${orderId.slice(-8)} a été acceptée et est en préparation`,
      type: 'order_accepted',
      orderId: orderId,
      status: 'preparing'
    };
    
    console.log('🔍 BACKEND - AcceptOrder - Notification à envoyer:', notification);
    // Envoyer à la room de l'orderId (pas userId)
    sendOrderNotification(orderId, notification);
    
    // Envoyer aussi une notification push au mobile
    try {
      const pushNotification = {
        to: userId, // Utiliser l'userId pour la notification push
        title: 'Commande acceptée',
        body: `Votre commande #${orderId.slice(-8)} a été acceptée et est en préparation`,
        data: {
          orderId: orderId,
          status: 'preparing',
          type: 'order_accepted'
        }
      };
      
      // Ici vous pouvez ajouter l'envoi de notification push
      console.log('🔍 BACKEND - AcceptOrder - Notification push à envoyer:', pushNotification);
    } catch (pushError) {
      console.error('❌ Erreur lors de l\'envoi de la notification push:', pushError);
    }

    // 🆕 Envoyer SMS de confirmation d'acceptation au client
    try {
      const user = order.userId as any;
      if (user && user.phoneNumber && smsService.validatePhoneNumber(user.phoneNumber)) {
        console.log('📱 [SMS] Envoi de confirmation d\'acceptation à:', user.phoneNumber);
        
        const formattedPhone = smsService.formatPhoneNumber(user.phoneNumber);
        const smsResult = await smsService.sendOrderNotificationSMS({
          to: formattedPhone,
          userName: user.name,
          orderId: orderId.slice(-8),
          orderTotal: order.total,
          orderStatus: 'READY',
          companyName: 'Dar-Darkom'
        });

        if (smsResult.success) {
          console.log('✅ [SMS] SMS d\'acceptation envoyé avec succès');
        } else {
          console.log('⚠️ [SMS] Échec d\'envoi du SMS:', smsResult.error);
        }
      } else {
        console.log('⚠️ [SMS] Numéro de téléphone invalide ou manquant pour:', user?.email);
      }
    } catch (smsError) {
      console.error('❌ [SMS] Erreur lors de l\'envoi du SMS d\'acceptation:', smsError);
      // On continue même si le SMS échoue
    }
    
    console.log(`✅ Commande ${orderId} acceptée par l'admin`);
    res.json({ 
      message: 'Commande acceptée avec succès',
      order: order 
    });
  } catch (err) {
    console.error('❌ Erreur lors de l\'acceptation de la commande:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};

// Rejeter une commande (admin)
export const rejectOrder = async (req: Request, res: Response) => {
  const orderId = req.params.id;
  const { reason } = req.body;
  
  if (!orderId) return res.status(400).json({ message: 'ID de commande requis' });
  
  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: 'rejected' },
      { new: true }
    ).populate('userId', 'name email phoneNumber');
    
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    
    // Envoyer notification au client via WebSocket
    const userId = (order.userId as any)._id.toString();
    console.log('🔍 BACKEND - RejectOrder - userId:', userId, 'orderId:', orderId);
    sendOrderNotification(orderId, {
      title: 'Commande rejetée',
      message: `Votre commande #${orderId.slice(-8)} a été rejetée${reason ? `: ${reason}` : ''}`,
      type: 'order_rejected',
      orderId: orderId,
      status: 'rejected',
      reason: reason
    });
    
    console.log(`❌ Commande ${orderId} rejetée par l'admin`);
    res.json({ 
      message: 'Commande rejetée avec succès',
      order: order 
    });
  } catch (err) {
    console.error('❌ Erreur lors du rejet de la commande:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};

// Obtenir les commandes en attente (admin)
export const getPendingOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ status: 'active' })
      .populate('userId', 'name email phoneNumber')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (err) {
    console.error('❌ Erreur lors de la récupération des commandes en attente:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};
