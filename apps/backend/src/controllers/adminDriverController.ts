import { Request, Response } from 'express';
import Driver from '../models/Driver';
import User from '../models/User';
import { io } from '../index';

// Récupérer tous les livreurs (pour l'admin)
export const getAllDrivers = async (req: Request, res: Response) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    // Vérifier que l'utilisateur est admin
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    const drivers = await Driver.find(filter)
      .populate('userId', 'name email phoneNumber profileImage')
      .sort({ createdAt: -1 })
      .limit(Number(limit) * 1)
      .skip((Number(page) - 1) * Number(limit));

    const total = await Driver.countDocuments(filter);

    res.json({
      drivers: drivers.map(driver => ({
        id: driver._id,
        user: driver.userId,
        licenseNumber: driver.licenseNumber,
        vehicleType: driver.vehicleType,
        vehicleModel: driver.vehicleModel,
        vehiclePlate: driver.vehiclePlate,
        isOnline: driver.isOnline,
        isAvailable: driver.isAvailable,
        rating: driver.rating,
        totalDeliveries: driver.totalDeliveries,
        status: driver.status,
        rejectionReason: driver.rejectionReason,
        createdAt: driver.createdAt,
        updatedAt: driver.updatedAt
      })),
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des livreurs:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer un livreur spécifique
export const getDriverById = async (req: Request, res: Response) => {
  try {
    const { driverId } = req.params;
    
    // Vérifier que l'utilisateur est admin
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const driver = await Driver.findById(driverId)
      .populate('userId', 'name email phoneNumber profileImage address');

    if (!driver) {
      return res.status(404).json({ message: 'Livreur non trouvé' });
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
        rejectionReason: driver.rejectionReason,
        createdAt: driver.createdAt,
        updatedAt: driver.updatedAt
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du livreur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Approuver un livreur
export const approveDriver = async (req: Request, res: Response) => {
  try {
    const { driverId } = req.params;
    
    // Vérifier que l'utilisateur est admin
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const driver = await Driver.findByIdAndUpdate(
      driverId,
      { 
        $set: { 
          status: 'approved',
          rejectionReason: undefined
        } 
      },
      { new: true }
    ).populate('userId', 'name email');

    if (!driver) {
      return res.status(404).json({ message: 'Livreur non trouvé' });
    }

    // Diffuser la notification via WebSocket
    io.emit('driver-status-update', {
      driverId: driver.userId,
      status: 'approved',
      message: 'Votre demande de livreur a été approuvée !'
    });

    res.json({
      message: 'Livreur approuvé avec succès',
      driver: {
        id: driver._id,
        user: driver.userId,
        status: driver.status
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'approbation du livreur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Rejeter un livreur
export const rejectDriver = async (req: Request, res: Response) => {
  try {
    const { driverId } = req.params;
    const { rejectionReason } = req.body;
    
    // Vérifier que l'utilisateur est admin
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    if (!rejectionReason) {
      return res.status(400).json({ message: 'Raison du rejet requise' });
    }

    const driver = await Driver.findByIdAndUpdate(
      driverId,
      { 
        $set: { 
          status: 'rejected',
          rejectionReason
        } 
      },
      { new: true }
    ).populate('userId', 'name email');

    if (!driver) {
      return res.status(404).json({ message: 'Livreur non trouvé' });
    }

    // Diffuser la notification via WebSocket
    io.emit('driver-status-update', {
      driverId: driver.userId,
      status: 'rejected',
      message: `Votre demande de livreur a été rejetée: ${rejectionReason}`
    });

    res.json({
      message: 'Livreur rejeté avec succès',
      driver: {
        id: driver._id,
        user: driver.userId,
        status: driver.status,
        rejectionReason: driver.rejectionReason
      }
    });
  } catch (error) {
    console.error('Erreur lors du rejet du livreur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Suspendre un livreur
export const suspendDriver = async (req: Request, res: Response) => {
  try {
    const { driverId } = req.params;
    const { suspensionReason } = req.body;
    
    // Vérifier que l'utilisateur est admin
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const driver = await Driver.findByIdAndUpdate(
      driverId,
      { 
        $set: { 
          status: 'suspended',
          isOnline: false,
          isAvailable: false,
          rejectionReason: suspensionReason
        } 
      },
      { new: true }
    ).populate('userId', 'name email');

    if (!driver) {
      return res.status(404).json({ message: 'Livreur non trouvé' });
    }

    // Diffuser la notification via WebSocket
    io.emit('driver-status-update', {
      driverId: driver.userId,
      status: 'suspended',
      message: `Votre compte livreur a été suspendu: ${suspensionReason}`
    });

    res.json({
      message: 'Livreur suspendu avec succès',
      driver: {
        id: driver._id,
        user: driver.userId,
        status: driver.status,
        rejectionReason: driver.rejectionReason
      }
    });
  } catch (error) {
    console.error('Erreur lors de la suspension du livreur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer les statistiques des livreurs
export const getDriversStats = async (req: Request, res: Response) => {
  try {
    // Vérifier que l'utilisateur est admin
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const totalDrivers = await Driver.countDocuments();
    const approvedDrivers = await Driver.countDocuments({ status: 'approved' });
    const pendingDrivers = await Driver.countDocuments({ status: 'pending' });
    const onlineDrivers = await Driver.countDocuments({ isOnline: true, status: 'approved' });
    const availableDrivers = await Driver.countDocuments({ isAvailable: true, status: 'approved' });

    // Top 5 des livreurs par nombre de livraisons
    const topDrivers = await Driver.find({ status: 'approved' })
      .populate('userId', 'name')
      .sort({ totalDeliveries: -1 })
      .limit(5)
      .select('userId totalDeliveries rating');

    res.json({
      stats: {
        totalDrivers,
        approvedDrivers,
        pendingDrivers,
        onlineDrivers,
        availableDrivers
      },
      topDrivers: topDrivers.map(driver => ({
        name: (driver.userId as any).name,
        totalDeliveries: driver.totalDeliveries,
        rating: driver.rating
      }))
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

