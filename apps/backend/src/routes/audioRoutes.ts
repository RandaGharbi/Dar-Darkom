import express from 'express';
import {
  getAllAudioTracks,
  getAudioTrackById,
  createAudioTrack,
  updateAudioTrack,
  deleteAudioTrack,
  incrementPlayCount,
  getPopularTracks,
  getYouTubeEmbedUrl,
} from '../controllers/audioController';
import { auth as authenticateToken } from '../middleware/auth';

const router = express.Router();

// Routes publiques
router.get('/', getAllAudioTracks);
router.get('/popular', getPopularTracks);
router.get('/:id', getAudioTrackById);
router.get('/youtube/:youtubeId/embed', getYouTubeEmbedUrl);
router.post('/:id/play', incrementPlayCount);

// Routes protégées (admin)
router.post('/', authenticateToken, createAudioTrack);
router.put('/:id', authenticateToken, updateAudioTrack);
router.delete('/:id', authenticateToken, deleteAudioTrack);

export default router;
