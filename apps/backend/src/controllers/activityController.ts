import { Request, Response } from 'express';
import Activity from '../models/Activity';
import Order from '../models/Order';
import Favorite from '../models/Favorite';
import Card from '../models/Card';

// Récupérer toutes les activités d'un utilisateur
export const getUserActivities = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    console.log('[BACK] getUserActivities', { userId });
    
    if (!userId) {
      return res.status(400).json({ message: 'userId requis' });
    }

    // Récupérer les activités stockées
    const activities = await Activity.find({ userId }).sort({ createdAt: -1 });

    // Si pas d'activités stockées, générer à partir des données existantes
    if (activities.length === 0) {
      console.log('[BACK] Génération d\'activités à partir des données existantes');
      
      const generatedActivities = await generateActivitiesFromData(userId);
      
      // Stocker les activités générées
      if (generatedActivities.length > 0) {
        await Activity.insertMany(generatedActivities);
      }
      
      return res.json({
        activities: generatedActivities,
        count: generatedActivities.length
      });
    }

    res.json({
      activities,
      count: activities.length
    });
  } catch (error) {
    console.error('[BACK] Erreur getUserActivities:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Interface pour les activités générées
interface GeneratedActivity {
  userId: string;
  type: 'order' | 'favorite' | 'payment' | 'profile' | 'login' | 'logout';
  title: string;
  description: string;
  details?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

// Générer des activités à partir des données existantes
async function generateActivitiesFromData(userId: string): Promise<GeneratedActivity[]> {
  const activities: GeneratedActivity[] = [];

  try {
    // Activités basées sur les commandes
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    orders.forEach(order => {
      activities.push({
        userId,
        type: 'order' as const,
        title: order.status === 'completed' ? 'Commande terminée' : 
               order.status === 'cancelled' ? 'Commande annulée' : 'Commande passée',
        description: `Commande #${order._id} pour ${order.total.toFixed(2)} €`,
        details: `Produits: ${order.products.map(p => `${p.name} (${p.qty})`).join(', ')}`,
        metadata: {
          orderId: order._id,
          total: order.total,
          status: order.status,
          products: order.products
        },
        createdAt: order.createdAt
      });
    });

    // Activités basées sur les favoris
    const favorites = await Favorite.find({ userId }).sort({ createdAt: -1 });
    favorites.forEach(favorite => {
      activities.push({
        userId,
        type: 'favorite' as const,
        title: 'Produit ajouté aux favoris',
        description: `${favorite.title} ajouté aux favoris`,
        details: `Prix: ${favorite.price} €`,
        metadata: {
          productId: favorite.productId,
          title: favorite.title,
          price: favorite.price,
          category: favorite.category
        },
        createdAt: favorite.createdAt
      });
    });

    // Activités basées sur les cartes de paiement
    const cards = await Card.find({ userId }).sort({ createdAt: -1 });
    cards.forEach(card => {
      const last4 = card.cardNumber.slice(-4);
      activities.push({
        userId,
        type: 'payment' as const,
        title: 'Méthode de paiement ajoutée',
        description: `Carte ${getCardType(card.cardNumber)} ****${last4} ajoutée`,
        details: `Expire: ${card.expiryDate}`,
        metadata: {
          cardId: card._id,
          cardType: getCardType(card.cardNumber),
          last4,
          expiryDate: card.expiryDate
        },
        createdAt: card.createdAt || new Date()
      });
    });

    // Trier toutes les activités par date de création
    activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  } catch (error) {
    console.error('[BACK] Erreur lors de la génération des activités:', error);
  }

  return activities;
}

// Fonction utilitaire pour détecter le type de carte
function getCardType(cardNumber: string): string {
  if (cardNumber.startsWith('4')) {
    return 'Visa';
  } else if (cardNumber.startsWith('5')) {
    return 'Mastercard';
  } else if (cardNumber.startsWith('3')) {
    return 'American Express';
  }
  return 'Carte';
}

// Créer une nouvelle activité
export const createActivity = async (req: Request, res: Response) => {
  try {
    const { userId, type, title, description, details, metadata } = req.body;

    if (!userId || !type || !title || !description) {
      return res.status(400).json({ message: 'Champs requis manquants' });
    }

    const activity = new Activity({
      userId,
      type,
      title,
      description,
      details,
      metadata
    });

    await activity.save();

    res.status(201).json(activity);
  } catch (error) {
    console.error('[BACK] Erreur createActivity:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}; 