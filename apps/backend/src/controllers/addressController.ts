import Address from '../models/Address';
import { Request, Response } from 'express';

// Ajouter une adresse
export const addAddress = async (req: Request, res: Response) => {
  try {
   

    // Log juste avant la sauvegarde
    const address = new Address(req.body);

    await address.save();

    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'adresse', error });
  }
};

// Récupérer toutes les adresses d'un utilisateur
export const getAddressesByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const addresses = await Address.find({ userId });
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des adresses', error });
  }
};

// Modifier une adresse
export const updateAddress = async (req: Request, res: Response) => {
  try {
    const { addressId } = req.params;
    const address = await Address.findByIdAndUpdate(addressId, req.body, { new: true });
    if (!address) return res.status(404).json({ message: 'Adresse non trouvée' });
    res.status(200).json(address);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la modification de l\'adresse', error });
  }
};

// Supprimer une adresse
export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const { addressId } = req.params;
    const address = await Address.findByIdAndDelete(addressId);
    if (!address) return res.status(404).json({ message: 'Adresse non trouvée' });
    res.status(200).json({ message: 'Adresse supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'adresse', error });
  }
};

// Définir une adresse principale (optionnel)
export const setDefaultAddress = async (req: Request, res: Response) => {
  try {
    const { addressId, userId } = req.body;
    // Mettre toutes les adresses de l'utilisateur à isDefault: false
    await Address.updateMany({ userId }, { isDefault: false });
    // Mettre l'adresse choisie à isDefault: true
    const address = await Address.findByIdAndUpdate(addressId, { isDefault: true }, { new: true });
    if (!address) return res.status(404).json({ message: 'Adresse non trouvée' });
    res.status(200).json(address);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'adresse principale', error });
  }
}; 