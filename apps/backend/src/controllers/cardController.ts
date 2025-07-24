import { Request, Response } from 'express';
import Card from '../models/Card';

export const addCard = async (req: Request, res: Response) => {
  
  const {
    userId,
    cardNumber,
    expiryDate,
    cvv,
    nameOnCard,
    billingAddress,
    city,
    state,
    zipCode,
    country
  } = req.body;


  if (!userId || !cardNumber || !expiryDate || !cvv || !nameOnCard || !billingAddress || !city || !state || !zipCode || !country) {
    console.log('❌ Données manquantes');
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  try {
    console.log('✅ Tentative de création de la carte...');
    const card = await Card.create({
      userId,
      cardNumber,
      expiryDate,
      cvv,
      nameOnCard,
      billingAddress,
      city,
      state,
      zipCode,
      country
    });
    console.log('✅ Carte créée avec succès:', card._id);
    res.status(201).json(card);
  } catch (err) {
    console.log('❌ Erreur lors de la création:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
};

export const getUserCards = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'ID utilisateur requis' });
  }

  try {
    const cards = await Card.find({ userId }).select('-cvv'); // Ne pas renvoyer le CVV pour la sécurité
    res.status(200).json(cards);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
}; 