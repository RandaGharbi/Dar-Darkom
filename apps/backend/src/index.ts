// server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

// Routes
import authRoutes from './routes/routes';
import favoritesRoutes from './routes/favorites';
import productsRoutes from './routes/product';
import cardRoutes from './routes/card';
import addressRoutes from './routes/address';
import cartRoutes from './routes/cart';
import ordersRoutes from './routes/orders';
import notificationRoutes from './routes/notifications';
import { connectDB } from './database/connectToDB';
import { schedulerService } from './services/schedulerService';

dotenv.config();

const app = express();
const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

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

// Connecter à la base de données
connectDB().then(() => {
  console.log('✅ Connexion à MongoDB établie');
  
  // Initialiser le service de planification après la connexion à la DB
  console.log('🕐 Initialisation du service de planification...');
  void schedulerService; // Initialiser le service
}).catch((error) => {
  console.error('❌ Erreur de connexion à MongoDB:', error);
  process.exit(1);
});

// Routes
app.use('/api', authRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/notifications', notificationRoutes);

// WebSocket pour les notifications
io.on('connection', (socket: Socket) => {
  console.log('🔌 Client WebSocket connecté:', socket.id);
  console.log('🔌 Headers:', socket.handshake.headers);
  console.log('🔌 Auth:', socket.handshake.auth);
  
  // Rejoindre une room pour les notifications utilisateur
  socket.on('join-notifications', (userId: string) => {
    socket.join(`notifications-${userId}`);
    console.log(`👥 Utilisateur ${userId} rejoint les notifications`);
  });

  // Rejoindre une conversation
  socket.on('join-conversation', (data: { userId: string }) => {
    socket.join(`conversation-${data.userId}`);
    console.log(`👥 Client rejoint la conversation: ${data.userId}`);
  });

  // Quitter une conversation
  socket.on('leave-conversation', (data: { userId: string }) => {
    socket.leave(`conversation-${data.userId}`);
    console.log(`👋 Client quitte la conversation: ${data.userId}`);
  });

  // Envoyer un message
  socket.on('send-message', (data: { userId: string; content: string }) => {
    console.log('📤 Message reçu via WebSocket:', data);
    // Le message sera traité par le contrôleur et diffusé
  });

  // Envoyer une notification
  socket.on('send-notification', (data: { userId: string; notification: { title: string } }) => {
    const { userId, notification } = data;
    io.to(`notifications-${userId}`).emit('new-notification', notification);
    console.log(`📧 Notification envoyée à ${userId}:`, notification.title);
  });
  
  socket.on('disconnect', () => {
    console.log('🔌 Client WebSocket déconnecté:', socket.id);
  });
});

// Fonction pour envoyer une notification depuis n'importe où
export const sendNotification = (userId: string, notification: { title: string }) => {
  io.to(`notifications-${userId}`).emit('new-notification', notification);
};

const PORT = Number(process.env.PORT) || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
