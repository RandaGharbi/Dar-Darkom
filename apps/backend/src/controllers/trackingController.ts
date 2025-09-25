import { Request, Response } from 'express';
import Tracking, { ITracking } from '../models/Tracking';
import Order from '../models/Order';
import mongoose from 'mongoose';
import { smsService } from '../services/smsService'; // 🆕 Import du service SMS

// Récupérer le tracking d'une commande
export const getOrderTracking = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'ID de commande invalide' });
    }

    let tracking = await Tracking.findOne({ orderId })
      .populate('orderId', 'userId products total status')
      .lean();

    // Si le tracking n'existe pas, le créer automatiquement
    if (!tracking) {
      console.log('📍 Tracking non trouvé, création automatique pour la commande:', orderId);
      
      // Vérifier que la commande existe
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Commande non trouvée' });
      }

      // Créer un tracking initial avec une position de test
      const newTracking = new Tracking({
        orderId: new mongoose.Types.ObjectId(orderId),
        status: 'preparing',
        lastUpdated: new Date(),
        // Position de test (Paris)
        currentLocation: {
          latitude: 48.8566,
          longitude: 2.3522,
          address: '123 Rue de la Paix, 75001 Paris, France'
        },
        // Informations du livreur de test
        driverId: 'driver_test_123',
        driverName: 'Ahmed Ben Ali',
        driverPhone: '+33 6 12 34 56 78',
        // Temps de livraison estimé
        estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
      });

      await newTracking.save();
      
      tracking = await Tracking.findOne({ orderId })
        .populate('orderId', 'userId products total status')
        .lean();
    }

    // Vérifier que le tracking existe après création
    if (!tracking) {
      return res.status(500).json({ message: 'Erreur lors de la création du tracking' });
    }

    res.json({
      success: true,
      tracking: {
        orderId: tracking.orderId,
        status: tracking.status,
        driverId: tracking.driverId,
        driverName: tracking.driverName,
        driverPhone: tracking.driverPhone,
        currentLocation: tracking.currentLocation,
        estimatedDeliveryTime: tracking.estimatedDeliveryTime,
        actualDeliveryTime: tracking.actualDeliveryTime,
        deliveryNotes: tracking.deliveryNotes,
        lastUpdated: tracking.lastUpdated
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du tracking:', error);
    res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    });
  }
};

// Mettre à jour le statut de tracking
export const updateTrackingStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { 
      status, 
      driverId, 
      driverName, 
      driverPhone, 
      currentLocation, 
      estimatedDeliveryTime,
      deliveryNotes 
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'ID de commande invalide' });
    }

    // Vérifier que la commande existe
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    const updateData: any = {
      lastUpdated: new Date()
    };

    if (status) updateData.status = status;
    if (driverId) updateData.driverId = driverId;
    if (driverName) updateData.driverName = driverName;
    if (driverPhone) updateData.driverPhone = driverPhone;
    if (currentLocation) updateData.currentLocation = currentLocation;
    if (estimatedDeliveryTime) updateData.estimatedDeliveryTime = new Date(estimatedDeliveryTime);
    if (deliveryNotes) updateData.deliveryNotes = deliveryNotes;

    // Si le statut est "delivered", enregistrer l'heure de livraison
    if (status === 'delivered') {
      updateData.actualDeliveryTime = new Date();
    }

    const tracking = await Tracking.findOneAndUpdate(
      { orderId },
      updateData,
      { new: true, upsert: true }
    );

    // Mettre à jour le statut de la commande si nécessaire
    if (status === 'delivered' && order.status !== 'completed') {
      await Order.findByIdAndUpdate(orderId, { status: 'completed' });
    }

    // 🆕 Envoyer SMS de notification de livraison au client
    try {
      const orderWithUser = await Order.findById(orderId).populate('userId', 'name phoneNumber');
      if (orderWithUser && orderWithUser.userId) {
        const user = orderWithUser.userId as any;
        if (user.phoneNumber && smsService.validatePhoneNumber(user.phoneNumber)) {
          console.log('📱 [SMS] Envoi de notification de livraison à:', user.phoneNumber);
          
          const formattedPhone = smsService.formatPhoneNumber(user.phoneNumber);
          const smsResult = await smsService.sendOrderNotificationSMS({
            to: formattedPhone,
            userName: user.name,
            orderId: orderId.slice(-8),
            orderTotal: orderWithUser.total,
            orderStatus: status === 'delivered' ? 'DELIVERED' : 'out_for_delivery',
            companyName: 'Dar-Darkom',
            livreurName: tracking.driverName,
            estimatedDelivery: tracking.estimatedDeliveryTime ? 
              new Date(tracking.estimatedDeliveryTime).toLocaleString('fr-FR') : undefined
          });

          if (smsResult.success) {
            console.log('✅ [SMS] SMS de livraison envoyé avec succès');
          } else {
            console.log('⚠️ [SMS] Échec d\'envoi du SMS:', smsResult.error);
          }
        } else {
          console.log('⚠️ [SMS] Numéro de téléphone invalide ou manquant pour:', user?.email);
        }
      }
    } catch (smsError) {
      console.error('❌ [SMS] Erreur lors de l\'envoi du SMS de livraison:', smsError);
      // On continue même si le SMS échoue
    }

    res.json({
      success: true,
      message: 'Statut de tracking mis à jour',
      tracking: {
        orderId: tracking.orderId,
        status: tracking.status,
        driverId: tracking.driverId,
        driverName: tracking.driverName,
        driverPhone: tracking.driverPhone,
        currentLocation: tracking.currentLocation,
        estimatedDeliveryTime: tracking.estimatedDeliveryTime,
        actualDeliveryTime: tracking.actualDeliveryTime,
        deliveryNotes: tracking.deliveryNotes,
        lastUpdated: tracking.lastUpdated
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du tracking:', error);
    res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    });
  }
};

// Créer un tracking initial pour une commande
export const createOrderTracking = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'ID de commande invalide' });
    }

    // Vérifier que la commande existe
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Vérifier qu'il n'y a pas déjà un tracking pour cette commande
    const existingTracking = await Tracking.findOne({ orderId });
    if (existingTracking) {
      return res.status(400).json({ message: 'Tracking déjà existant pour cette commande' });
    }

    const tracking = new Tracking({
      orderId,
      status: 'preparing',
      lastUpdated: new Date()
    });

    await tracking.save();

    res.status(201).json({
      success: true,
      message: 'Tracking créé avec succès',
      tracking: {
        orderId: tracking.orderId,
        status: tracking.status,
        lastUpdated: tracking.lastUpdated
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création du tracking:', error);
    res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    });
  }
};

// Récupérer tous les trackings d'un driver
export const getDriverTrackings = async (req: Request, res: Response) => {
  try {
    const { driverId } = req.params;
    const { status } = req.query;

    const filter: any = { driverId };
    if (status) {
      filter.status = status;
    }

    const trackings = await Tracking.find(filter)
      .populate('orderId', 'userId products total status shippingAddress')
      .sort({ lastUpdated: -1 })
      .lean();

    res.json({
      success: true,
      trackings: trackings.map(tracking => ({
        orderId: tracking.orderId,
        status: tracking.status,
        driverId: tracking.driverId,
        driverName: tracking.driverName,
        driverPhone: tracking.driverPhone,
        currentLocation: tracking.currentLocation,
        estimatedDeliveryTime: tracking.estimatedDeliveryTime,
        actualDeliveryTime: tracking.actualDeliveryTime,
        deliveryNotes: tracking.deliveryNotes,
        lastUpdated: tracking.lastUpdated
      }))
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des trackings du driver:', error);
    res.status(500).json({ 
      message: 'Erreur serveur', 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    });
  }
};
