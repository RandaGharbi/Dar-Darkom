import express from 'express';
import { getUserActivities, createActivity } from '../controllers/activityController';

const router = express.Router();

// Récupérer toutes les activités d'un utilisateur
router.get('/user/:userId', getUserActivities);

// Créer une nouvelle activité
router.post('/', createActivity);

export default router; 