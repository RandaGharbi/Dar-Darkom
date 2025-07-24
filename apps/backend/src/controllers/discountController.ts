import { Request, Response } from 'express';
import Discount from '../models/Discount';

// Récupérer tous les discounts
export const getAllDiscounts = async (req: Request, res: Response) => {
  try {
    const discounts = await Discount.find().sort({ createdAt: -1 });
    res.json({ success: true, data: discounts });
  } catch (error) {
    console.error('Erreur lors de la récupération des discounts:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Récupérer les discounts par collection
export const getDiscountsByCollection = async (req: Request, res: Response) => {
  try {
    const { collection } = req.params;
    const discounts = await Discount.find({ discountCollection: collection }).sort({ createdAt: -1 });
    res.json({ success: true, data: discounts });
  } catch (error) {
    console.error('Erreur lors de la récupération des discounts par collection:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Récupérer un discount par code
export const getDiscountByCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const discount = await Discount.findOne({ code: code.toUpperCase() });
    
    if (!discount) {
      return res.status(404).json({ success: false, message: 'Code de réduction non trouvé' });
    }
    
    res.json({ success: true, data: discount });
  } catch (error) {
    console.error('Erreur lors de la récupération du discount:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Créer un nouveau discount
export const createDiscount = async (req: Request, res: Response) => {
  try {
    const discountData = req.body;
    
    // Vérifier si le code existe déjà
    const existingDiscount = await Discount.findOne({ code: discountData.code.toUpperCase() });
    if (existingDiscount) {
      return res.status(400).json({ success: false, message: 'Ce code de réduction existe déjà' });
    }
    
    const discount = new Discount({
      ...discountData,
      code: discountData.code.toUpperCase(),
      usedCount: 0
    });
    
    await discount.save();
    res.status(201).json({ success: true, data: discount });
  } catch (error) {
    console.error('Erreur lors de la création du discount:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Mettre à jour un discount
export const updateDiscount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase();
      
      // Vérifier si le nouveau code existe déjà (sauf pour ce discount)
      const existingDiscount = await Discount.findOne({ 
        code: updateData.code, 
        _id: { $ne: id } 
      });
      if (existingDiscount) {
        return res.status(400).json({ success: false, message: 'Ce code de réduction existe déjà' });
      }
    }
    
    const discount = await Discount.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!discount) {
      return res.status(404).json({ success: false, message: 'Discount non trouvé' });
    }
    
    res.json({ success: true, data: discount });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du discount:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Supprimer un discount
export const deleteDiscount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const discount = await Discount.findByIdAndDelete(id);
    
    if (!discount) {
      return res.status(404).json({ success: false, message: 'Discount non trouvé' });
    }
    
    res.json({ success: true, message: 'Discount supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du discount:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

// Incrémenter le compteur d'utilisation
export const incrementUsage = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const discount = await Discount.findOne({ code: code.toUpperCase() });
    
    if (!discount) {
      return res.status(404).json({ success: false, message: 'Code de réduction non trouvé' });
    }
    
    if (discount.usedCount >= discount.maxUses) {
      return res.status(400).json({ success: false, message: 'Limite d\'utilisation atteinte' });
    }
    
    discount.usedCount += 1;
    await discount.save();
    
    res.json({ success: true, data: discount });
  } catch (error) {
    console.error('Erreur lors de l\'incrémentation de l\'utilisation:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
}; 