// server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { createServer } from 'http';
import authRoutes from './routes/routes';
import favoritesRoutes from './routes/favorites';
import productsRoutes from './routes/product';
import cardRoutes from './routes/card';
import addressRoutes from './routes/address';
import cartRoutes from './routes/cart';
import ordersRoutes from './routes/orders';
import analyticsRoutes from './routes/analytics';
import { connectDB } from './database/connectToDB';
import { schedulerService } from './services/schedulerService';

dotenv.config();

const app = express();
const server = createServer(app);

const PORT = Number(process.env.PORT) || 5000;

// Créer le dossier uploads s'il n'existe pas
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api', authRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/analytics', analyticsRoutes);


// Connecter à la base de données
connectDB().then(() => {
  console.log('✅ Connexion à MongoDB établie');
  
  // Initialiser le service de planification après la connexion à la DB
  console.log('🕐 Initialisation du service de planification...');
  void schedulerService; // Initialiser le service

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('❌ Erreur de connexion à MongoDB:', error);
  process.exit(1);
});
