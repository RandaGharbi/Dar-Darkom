import { Request, Response } from 'express';
import Driver from '../models/Driver';
import User from '../models/User';
import Tracking from '../models/Tracking';
import Order from '../models/Order';
import { io } from '../index';

// Inscription d'un nouveau livreur
export const registerDriver = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      licenseNumber,
      vehicleType,
      vehicleModel,
      vehiclePlate,
      deliveryZone,
      workingHours,
      bankAccount,
      documents
    } = req.body;

    // Vérifier que l'utilisateur existe et a le rôle driver
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (user.role !== 'driver') {
      return res.status(400).json({ message: 'Le rôle utilisateur doit être "driver"' });
    }

    // Vérifier si le livreur existe déjà
    const existingDriver = await Driver.findOne({ userId });
    if (existingDriver) {
      return res.status(400).json({ message: 'Ce livreur est déjà enregistré' });
    }

    // Vérifier si le numéro de licence existe déjà
    const existingLicense = await Driver.findOne({ licenseNumber });
    if (existingLicense) {
      return res.status(400).json({ message: 'Ce numéro de licence est déjà utilisé' });
    }

    const driver = new Driver({
      userId,
      licenseNumber,
      vehicleType,
      vehicleModel,
      vehiclePlate,
      deliveryZone: deliveryZone || [],
      workingHours: workingHours || {
        start: "08:00",
        end: "20:00",
        days: [1, 2, 3, 4, 5] // Lundi à Vendredi
      },
      bankAccount,
      documents,
      status: 'pending'
    });

    await driver.save();

    res.status(201).json({
      message: 'Inscription du livreur réussie',
      driver: {
        id: driver._id,
        userId: driver.userId,
        licenseNumber: driver.licenseNumber,
        vehicleType: driver.vehicleType,
        status: driver.status
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription du livreur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer le profil du livreur
export const getDriverProfile = async (req: Request, res: Response) => {
  try {
    const driverId = req.user?.id;
    
    if (!driverId) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    const driver = await Driver.findOne({ userId: driverId })
      .populate('userId', 'name email phoneNumber profileImage');

    if (!driver) {
      return res.status(404).json({ message: 'Profil livreur non trouvé' });
    }

    res.json({
      driver: {
        id: driver._id,
        user: driver.userId,
        licenseNumber: driver.licenseNumber,
        vehicleType: driver.vehicleType,
        vehicleModel: driver.vehicleModel,
        vehiclePlate: driver.vehiclePlate,
        isOnline: driver.isOnline,
        currentLocation: driver.currentLocation,
        deliveryZone: driver.deliveryZone,
        rating: driver.rating,
        totalDeliveries: driver.totalDeliveries,
        isAvailable: driver.isAvailable,
        maxDeliveryRadius: driver.maxDeliveryRadius,
        workingHours: driver.workingHours,
        bankAccount: driver.bankAccount,
        documents: driver.documents,
        status: driver.status,
        rejectionReason: driver.rejectionReason
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour le profil du livreur
export const updateDriverProfile = async (req: Request, res: Response) => {
  try {
    const driverId = req.user?.id;
    const updateData = req.body;

    if (!driverId) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    // Ne pas permettre la modification du statut via cette route
    delete updateData.status;
    delete updateData.rejectionReason;

    const driver = await Driver.findOneAndUpdate(
      { userId: driverId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!driver) {
      return res.status(404).json({ message: 'Profil livreur non trouvé' });
    }

    res.json({
      message: 'Profil mis à jour avec succès',
      driver: {
        id: driver._id,
        licenseNumber: driver.licenseNumber,
        vehicleType: driver.vehicleType,
        vehicleModel: driver.vehicleModel,
        vehiclePlate: driver.vehiclePlate,
        deliveryZone: driver.deliveryZone,
        workingHours: driver.workingHours,
        bankAccount: driver.bankAccount,
        documents: driver.documents
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour la position du livreur
export const updateDriverLocation = async (req: Request, res: Response) => {
  try {
    const driverId = req.user?.id;
    const { latitude, longitude, address } = req.body;

    if (!driverId) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    const driver = await Driver.findOneAndUpdate(
      { userId: driverId },
      {
        $set: {
          'currentLocation.latitude': latitude,
          'currentLocation.longitude': longitude,
          'currentLocation.address': address,
          'currentLocation.lastUpdated': new Date()
        }
      },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ message: 'Livreur non trouvé' });
    }

    // Diffuser la position via WebSocket
    io.emit('driver-location-update', {
      driverId: driver.userId,
      location: {
        latitude,
        longitude,
        address
      }
    });

    res.json({
      message: 'Position mise à jour avec succès',
      location: {
        latitude,
        longitude,
        address,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la position:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Changer le statut en ligne/hors ligne
export const toggleDriverStatus = async (req: Request, res: Response) => {
  try {
    const driverId = req.user?.id;
    const { isOnline, isAvailable } = req.body;

    if (!driverId) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    // Récupérer d'abord le driver pour obtenir les valeurs actuelles
    const currentDriver = await Driver.findOne({ userId: driverId });
    if (!currentDriver) {
      return res.status(404).json({ message: 'Livreur non trouvé' });
    }

    const driver = await Driver.findOneAndUpdate(
      { userId: driverId },
      {
        $set: {
          isOnline: isOnline !== undefined ? isOnline : currentDriver.isOnline,
          isAvailable: isAvailable !== undefined ? isAvailable : currentDriver.isAvailable
        }
      },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ message: 'Livreur non trouvé' });
    }

    // Diffuser le changement de statut via WebSocket
    io.emit('driver-status-update', {
      driverId: driver.userId,
      isOnline: driver.isOnline,
      isAvailable: driver.isAvailable
    });

    res.json({
      message: 'Statut mis à jour avec succès',
      isOnline: driver.isOnline,
      isAvailable: driver.isAvailable
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer les commandes assignées au livreur
export const getDriverOrders = async (req: Request, res: Response) => {
  try {
    const driverId = req.user?.id;
    const { status } = req.query;

    if (!driverId) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    // Récupérer le driver pour obtenir son ID
    const driver = await Driver.findOne({ userId: driverId });
    if (!driver) {
      return res.status(404).json({ message: 'Livreur non trouvé' });
    }

    // Construire le filtre
    const filter: any = { driverId: (driver._id as any).toString() };
    if (status) {
      filter.status = status;
    }

    const trackings = await Tracking.find(filter)
      .populate('orderId')
      .sort({ createdAt: -1 });

    const orders = trackings.map(tracking => ({
      trackingId: tracking._id,
      orderId: tracking.orderId,
      status: tracking.status,
      driverName: tracking.driverName,
      driverPhone: tracking.driverPhone,
      currentLocation: tracking.currentLocation,
      estimatedDeliveryTime: tracking.estimatedDeliveryTime,
      actualDeliveryTime: tracking.actualDeliveryTime,
      deliveryNotes: tracking.deliveryNotes,
      lastUpdated: tracking.lastUpdated,
      createdAt: tracking.createdAt
    }));

    res.json({ orders });
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Accepter une commande
export const acceptOrder = async (req: Request, res: Response) => {
  try {
    const driverId = req.user?.id;
    const { orderId } = req.body;

    if (!driverId) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    const driver = await Driver.findOne({ userId: driverId });
    if (!driver) {
      return res.status(404).json({ message: 'Livreur non trouvé' });
    }

    // Vérifier que le livreur est disponible
    if (!driver.isOnline || !driver.isAvailable) {
      return res.status(400).json({ message: 'Le livreur n\'est pas disponible' });
    }

    // Mettre à jour le tracking
    const tracking = await Tracking.findOneAndUpdate(
      { orderId, status: 'ready' },
      {
        $set: {
          driverId: (driver._id as any).toString(),
          driverName: (driver.userId as any).name,
          driverPhone: (driver.userId as any).phoneNumber,
          status: 'picked_up',
          lastUpdated: new Date()
        }
      },
      { new: true }
    );

    if (!tracking) {
      return res.status(404).json({ message: 'Commande non trouvée ou déjà assignée' });
    }

    // Diffuser la mise à jour via WebSocket
    io.emit('order-status-update', {
      orderId,
      status: 'picked_up',
      driverId: (driver._id as any).toString(),
      driverName: (driver.userId as any).name
    });

    res.json({
      message: 'Commande acceptée avec succès',
      order: {
        orderId,
        status: 'picked_up',
        driverId: (driver._id as any).toString(),
        driverName: (driver.userId as any).name
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'acceptation de la commande:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour le statut d'une livraison
export const updateDeliveryStatus = async (req: Request, res: Response) => {
  try {
    const driverId = req.user?.id;
    const { orderId, status, deliveryNotes } = req.body;

    if (!driverId) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    const driver = await Driver.findOne({ userId: driverId });
    if (!driver) {
      return res.status(404).json({ message: 'Livreur non trouvé' });
    }

    const updateData: any = {
      status,
      lastUpdated: new Date()
    };

    if (deliveryNotes) {
      updateData.deliveryNotes = deliveryNotes;
    }

    if (status === 'delivered') {
      updateData.actualDeliveryTime = new Date();
    }

    const tracking = await Tracking.findOneAndUpdate(
      { orderId, driverId: (driver._id as any).toString() },
      { $set: updateData },
      { new: true }
    );

    if (!tracking) {
      return res.status(404).json({ message: 'Commande non trouvée ou non assignée à ce livreur' });
    }

    // Mettre à jour le compteur de livraisons du livreur
    if (status === 'delivered') {
      await Driver.findByIdAndUpdate((driver._id as any), {
        $inc: { totalDeliveries: 1 }
      });
    }

    // Diffuser la mise à jour via WebSocket
    io.emit('order-status-update', {
      orderId,
      status,
      driverId: (driver._id as any).toString(),
      driverName: (driver.userId as any).name,
      actualDeliveryTime: updateData.actualDeliveryTime
    });

    res.json({
      message: 'Statut de livraison mis à jour avec succès',
      order: {
        orderId,
        status,
        actualDeliveryTime: updateData.actualDeliveryTime
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer les statistiques du livreur
export const getDriverStats = async (req: Request, res: Response) => {
  try {
    const driverId = req.user?.id;

    if (!driverId) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    const driver = await Driver.findOne({ userId: driverId });
    if (!driver) {
      return res.status(404).json({ message: 'Livreur non trouvé' });
    }

    // Statistiques des livraisons
    const totalDeliveries = await Tracking.countDocuments({
      driverId: (driver._id as any).toString(),
      status: 'delivered'
    });

    const pendingDeliveries = await Tracking.countDocuments({
      driverId: (driver._id as any).toString(),
      status: { $in: ['picked_up', 'in_transit'] }
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayDeliveries = await Tracking.countDocuments({
      driverId: (driver._id as any).toString(),
      status: 'delivered',
      actualDeliveryTime: { $gte: today }
    });

    res.json({
      stats: {
        totalDeliveries,
        pendingDeliveries,
        todayDeliveries,
        rating: driver.rating,
        isOnline: driver.isOnline,
        isAvailable: driver.isAvailable
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

