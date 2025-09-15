import { Request, Response } from 'express';
import AudioTrack, { IAudioTrack } from '../models/AudioTrack';
import { getYouTubeThumbnail, getYouTubeEmbedUrl as getYouTubeEmbedUrlUtil } from '../utils/youtubeUtils';

// Obtenir toutes les pistes audio
export const getAllAudioTracks = async (req: Request, res: Response) => {
  try {
    const { category, search, limit = 50, page = 1 } = req.query;
    
    let query: any = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search as string };
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const tracks = await AudioTrack.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-__v');
    
    const total = await AudioTrack.countDocuments(query);
    
    res.json({
      success: true,
      data: tracks,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des pistes audio:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des pistes audio'
    });
  }
};

// Obtenir une piste audio par ID
export const getAudioTrackById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const track = await AudioTrack.findOne({ id, isActive: true });
    
    if (!track) {
      return res.status(404).json({
        success: false,
        message: 'Piste audio introuvable'
      });
    }
    
    res.json({
      success: true,
      data: track
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la piste audio:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la piste audio'
    });
  }
};

// Créer une nouvelle piste audio
export const createAudioTrack = async (req: Request, res: Response) => {
  try {
    const { title, youtubeId, duration, category, description } = req.body;
    
    // Validation des données
    if (!title || !youtubeId || !duration || !category || !description) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis'
      });
    }
    
    // Vérifier si la piste existe déjà
    const existingTrack = await AudioTrack.findOne({ youtubeId });
    if (existingTrack) {
      return res.status(409).json({
        success: false,
        message: 'Cette piste YouTube existe déjà'
      });
    }
    
    // Générer un ID unique
    const id = `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Créer la piste
    const track = new AudioTrack({
      id,
      title,
      youtubeId,
      duration,
      category,
      description,
      thumbnailUrl: getYouTubeThumbnail(youtubeId, 'medium'),
    });
    
    await track.save();
    
    res.status(201).json({
      success: true,
      data: track,
      message: 'Piste audio créée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la création de la piste audio:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la piste audio'
    });
  }
};

// Mettre à jour une piste audio
export const updateAudioTrack = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Supprimer les champs non modifiables
    delete updates.id;
    delete updates.youtubeId;
    delete updates.playCount;
    delete updates.createdAt;
    
    // Si le titre ou la description change, mettre à jour la thumbnail
    if (updates.title || updates.description) {
      const track = await AudioTrack.findOne({ id });
      if (track) {
        updates.thumbnailUrl = getYouTubeThumbnail(track.youtubeId, 'medium');
      }
    }
    
    const track = await AudioTrack.findOneAndUpdate(
      { id },
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!track) {
      return res.status(404).json({
        success: false,
        message: 'Piste audio introuvable'
      });
    }
    
    res.json({
      success: true,
      data: track,
      message: 'Piste audio mise à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la piste audio:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la piste audio'
    });
  }
};

// Supprimer une piste audio (soft delete)
export const deleteAudioTrack = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const track = await AudioTrack.findOneAndUpdate(
      { id },
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );
    
    if (!track) {
      return res.status(404).json({
        success: false,
        message: 'Piste audio introuvable'
      });
    }
    
    res.json({
      success: true,
      message: 'Piste audio supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la piste audio:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la piste audio'
    });
  }
};

// Incrémenter le compteur de lecture
export const incrementPlayCount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const track = await AudioTrack.findOneAndUpdate(
      { id },
      { $inc: { playCount: 1 } },
      { new: true }
    );
    
    if (!track) {
      return res.status(404).json({
        success: false,
        message: 'Piste audio introuvable'
      });
    }
    
    res.json({
      success: true,
      data: { playCount: track.playCount }
    });
  } catch (error) {
    console.error('Erreur lors de l\'incrémentation du compteur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'incrémentation du compteur'
    });
  }
};

// Obtenir les pistes les plus populaires
export const getPopularTracks = async (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;
    
    const tracks = await AudioTrack.find({ isActive: true })
      .sort({ playCount: -1 })
      .limit(Number(limit))
      .select('-__v');
    
    res.json({
      success: true,
      data: tracks
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des pistes populaires:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des pistes populaires'
    });
  }
};

// Obtenir l'URL d'embed YouTube
export const getYouTubeEmbedUrl = async (req: Request, res: Response) => {
  try {
    const { youtubeId } = req.params;
    const { autoplay = false } = req.query;
    
    const embedUrl = getYouTubeEmbedUrlUtil(youtubeId, autoplay === 'true');
    
    res.json({
      success: true,
      data: { embedUrl }
    });
  } catch (error) {
    console.error('Erreur lors de la génération de l\'URL d\'embed:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération de l\'URL d\'embed'
    });
  }
};
