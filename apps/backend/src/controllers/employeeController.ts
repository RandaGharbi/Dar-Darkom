import { Request, Response } from 'express';
import Order from '../models/Order';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import QRCode from 'qrcode';
import bcrypt from 'bcryptjs';
import { emailService } from '../services/emailService';
import { smsService } from '../services/smsService'; // 🆕 Import du service SMS

// Middleware pour vérifier le rôle employé
export const verifyEmployeeRole = async (req: Request, res: Response, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Token d\'authentification requis' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token invalide' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as jwt.JwtPayload;
    const userId = typeof decoded === 'object' && decoded.userId ? decoded.userId : null;
    
    if (!userId) {
      return res.status(401).json({ message: 'Token invalide' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (user.role !== 'EMPLOYE') {
      return res.status(403).json({ message: 'Accès refusé. Rôle employé requis.' });
    }

    req.user = {
      id: user._id?.toString() || '',
      role: user.role,
      email: user.email,
      name: user.name
    };

    next();
  } catch (error) {
    console.error('Erreur de vérification du rôle employé:', error);
    res.status(401).json({ message: 'Token invalide' });
  }
};

// Obtenir les commandes en attente ou prêtes
export const getEmployeeOrders = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    
    let filter: any = {};
    if (status) {
      const statusArray = Array.isArray(status) ? status : [status];
      filter.status = { $in: statusArray };
    } else {
      // Par défaut, récupérer les commandes PENDING et READY
      filter.status = { $in: ['PENDING', 'READY'] };
    }

    const orders = await Order.find(filter)
      .populate('userId', 'name email phoneNumber address')
      .populate('livreurId', 'name email phoneNumber')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
      count: orders.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des commandes',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

// Accepter une commande
export const acceptOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Commande non trouvée' 
      });
    }

    if (order.status !== 'PENDING') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cette commande ne peut pas être acceptée' 
      });
    }

    // Générer un QR code unique
    const qrData = {
      orderId: order._id,
      status: 'READY',
      timestamp: new Date().toISOString(),
      total: order.total
    };

    const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));

    // Mettre à jour la commande
    order.status = 'READY';
    order.qrCode = qrCode;
    await order.save();

    res.json({
      success: true,
      message: 'Commande acceptée avec succès',
      data: {
        orderId: order._id,
        status: order.status,
        qrCode: order.qrCode
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'acceptation de la commande:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de l\'acceptation de la commande',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

// Rejeter une commande
export const rejectOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Commande non trouvée' 
      });
    }

    if (order.status !== 'PENDING') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cette commande ne peut pas être rejetée' 
      });
    }

    // Mettre à jour la commande
    order.status = 'CANCELLED';
    await order.save();

    res.json({
      success: true,
      message: 'Commande rejetée avec succès',
      data: {
        orderId: order._id,
        status: order.status,
        reason: reason || 'Aucune raison spécifiée'
      }
    });
  } catch (error) {
    console.error('Erreur lors du rejet de la commande:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors du rejet de la commande',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

// Assigner un livreur à une commande
export const assignLivreur = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { livreurId } = req.body;

    if (!livreurId) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID du livreur requis' 
      });
    }

    // Vérifier que le livreur existe et a le bon rôle
    const livreur = await User.findById(livreurId);
    if (!livreur) {
      return res.status(404).json({ 
        success: false, 
        message: 'Livreur non trouvé' 
      });
    }

    if (livreur.role !== 'LIVREUR') {
      return res.status(400).json({ 
        success: false, 
        message: 'L\'utilisateur sélectionné n\'est pas un livreur' 
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Commande non trouvée' 
      });
    }

    if (order.status !== 'READY') {
      return res.status(400).json({ 
        success: false, 
        message: 'Seules les commandes prêtes peuvent être assignées à un livreur' 
      });
    }

    // Assigner le livreur
    order.livreurId = livreurId;
    order.status = 'out_for_delivery';
    await order.save();

    res.json({
      success: true,
      message: 'Livreur assigné avec succès',
      data: {
        orderId: order._id,
        livreurId: livreurId,
        livreurName: livreur.name,
        status: order.status
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'assignation du livreur:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de l\'assignation du livreur',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

// Obtenir la liste des livreurs disponibles
export const getLivreurs = async (req: Request, res: Response) => {
  try {
    const livreurs = await User.find({ 
      role: 'LIVREUR',
      status: 'Active'
    }).select('name email phoneNumber isOnline');

    res.json({
      success: true,
      data: livreurs,
      count: livreurs.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des livreurs:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des livreurs',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

// Obtenir les détails d'une commande spécifique
export const getOrderDetails = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('userId', 'name email phoneNumber address')
      .populate('livreurId', 'name email phoneNumber');

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Commande non trouvée' 
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de la commande:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des détails de la commande',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

// Inscription d'un nouvel employé
export const registerEmployee = async (req: Request, res: Response) => {
  try {
    console.log('🔍 [EMPLOYEE REGISTER] Données reçues:', req.body);
    const { name, email, phoneNumber, address, password, confirmPassword } = req.body;

    // Validation des données
    if (!name || !email || !phoneNumber || !address || !password || !confirmPassword) {
      console.log('❌ [EMPLOYEE REGISTER] Champs manquants:', {
        name: !!name,
        email: !!email,
        phoneNumber: !!phoneNumber,
        address: !!address,
        password: !!password,
        confirmPassword: !!confirmPassword
      });
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Les mots de passe ne correspondent pas'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe doit contenir au moins 6 caractères'
      });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Un compte avec cet email existe déjà'
      });
    }

    // Hacher le mot de passe
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Créer le nouvel employé
    const newEmployee = new User({
      name,
      email,
      phoneNumber,
      address,
      password: hashedPassword,
      role: 'EMPLOYE',
      status: 'Active',
      isEmailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newEmployee.save();

    // Générer un token de confirmation email
    const emailConfirmationToken = jwt.sign(
      { 
        userId: newEmployee._id,
        email: newEmployee.email,
        type: 'email_confirmation'
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    // Construire l'URL de confirmation
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const confirmationUrl = `${frontendUrl}/employee/confirm-email?token=${emailConfirmationToken}`;

    // Envoyer l'email de confirmation
    try {
      const emailSent = await emailService.sendConfirmationEmail({
        to: newEmployee.email,
        userName: newEmployee.name,
        confirmationUrl: confirmationUrl,
        role: newEmployee.role
      });
      
      if (emailSent) {
        console.log('✅ Email de confirmation envoyé à:', newEmployee.email);
      } else {
        console.log('⚠️ Email de confirmation non envoyé, mais le compte est créé');
      }
    } catch (emailError) {
      console.error('❌ Erreur lors de l\'envoi de l\'email de confirmation:', emailError);
      console.log('🔗 URL de confirmation manuelle:', confirmationUrl);
      // On continue même si l'email échoue - le compte est créé
    }

    // Générer un token JWT pour la connexion (optionnel, car l'email doit être confirmé)
    const token = jwt.sign(
      { 
        userId: newEmployee._id,
        email: newEmployee.email,
        role: newEmployee.role
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Compte employé créé avec succès. Vérifiez votre email pour confirmer votre inscription.',
      data: {
        user: {
          id: newEmployee._id,
          name: newEmployee.name,
          email: newEmployee.email,
          phoneNumber: newEmployee.phoneNumber,
          address: newEmployee.address,
          role: newEmployee.role,
          status: newEmployee.status,
          isEmailVerified: newEmployee.isEmailVerified
        },
        token,
        emailSent: true
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création du compte employé:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du compte employé',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};

// 🆕 Confirmer l'email d'un employé - MODIFIÉ pour inclure le SMS
export const confirmEmployeeEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token de confirmation requis'
      });
    }

    // Vérifier le token
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET || 'secret') as jwt.JwtPayload;
    
    if (decoded.type !== 'email_confirmation') {
      return res.status(400).json({
        success: false,
        message: 'Token de confirmation invalide'
      });
    }

    const userId = decoded.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    if (user.role !== 'EMPLOYE') {
      return res.status(400).json({
        success: false,
        message: 'Ce token ne correspond pas à un compte employé'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà confirmé'
      });
    }

    // Marquer l'email comme vérifié
    user.isEmailVerified = true;
    user.updatedAt = new Date();
    await user.save();

    // 🆕 NOUVEAUTÉ : Envoyer le SMS de bienvenue
    let smsResult = null;
    if (user.phoneNumber && smsService.validatePhoneNumber(user.phoneNumber)) {
      try {
        console.log('📱 [SMS] Tentative d\'envoi du SMS de bienvenue à:', user.phoneNumber);
        
        const formattedPhone = smsService.formatPhoneNumber(user.phoneNumber);
        smsResult = await smsService.sendWelcomeSMS({
          to: formattedPhone,
          userName: user.name,
          companyName: 'Dar-Darkom'
        });

        if (smsResult.success) {
          console.log('✅ [SMS] SMS de bienvenue envoyé avec succès');
        } else {
          console.log('⚠️ [SMS] Échec d\'envoi du SMS:', smsResult.error);
        }
      } catch (smsError) {
        console.error('❌ [SMS] Erreur lors de l\'envoi du SMS de bienvenue:', smsError);
        // On continue même si le SMS échoue - l'essentiel est que l'email soit confirmé
      }
    } else {
      console.log('⚠️ [SMS] Numéro de téléphone invalide ou manquant pour:', user.email);
    }

    // Réponse avec les informations du SMS
    const response: any = {
      success: true,
      message: 'Email confirmé avec succès ! Votre compte employé est maintenant actif.',
      data: {
        userId: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    };

    // Ajouter les infos SMS si disponibles
    if (smsResult) {
      response.data.sms = {
        sent: smsResult.success,
        messageId: smsResult.messageId,
        message: smsResult.success ? 'SMS de bienvenue envoyé' : smsResult.error
      };

      if (smsResult.success) {
        response.message += ' Un SMS de bienvenue vous a été envoyé.';
      }
    }

    res.json(response);
  } catch (error) {
    console.error('Erreur lors de la confirmation de l\'email:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        success: false,
        message: 'Token de confirmation invalide ou expiré'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la confirmation de l\'email',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    });
  }
};