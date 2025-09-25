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
import adminNotificationRoutes from './routes/admin-notifications';
import audioRoutes from './routes/audioRoutes';
import paymentRoutes from './routes/paymentRoutes';
import trackingRoutes from './routes/tracking';
import employeeRoutes from './routes/employee';
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
  // Initialiser le service de planification après la connexion à la DB
  console.log('🕐 Initialisation du service de planification...');
  void schedulerService; // Initialiser le service
}).catch((error) => {
  console.error('❌ Erreur de connexion à MongoDB:', error);
  process.exit(1);
});

// Routes
app.use('/api', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin/notifications', adminNotificationRoutes);
app.use('/api/audio', audioRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/employee', employeeRoutes);

// WebSocket pour les notifications
io.on('connection', (socket: Socket) => {
  console.log('🔌 Client WebSocket connecté:', socket.id);
  console.log('🔌 Headers:', socket.handshake.headers);
  console.log('🔌 Auth:', socket.handshake.auth);
  
  // Rejoindre une room pour les notifications utilisateur
  socket.on('join-notifications', (userId: string) => {
    socket.join(`notifications-${userId}`);
    console.log(`👥 Utilisateur ${userId} rejoint les notifications`);
    
    // Si c'est l'admin, rejoindre aussi la room admin
    if (userId === 'admin') {
      socket.join('admin-notifications');
      console.log('👑 Admin rejoint les notifications admin');
    }
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

  // Rejoindre le tracking d'une commande
  socket.on('join-tracking', (data: { orderId: string; userId: string }) => {
    socket.join(`tracking-${data.orderId}`);
    console.log(`📍 Utilisateur ${data.userId} suit la commande ${data.orderId}`);
  });

  // Quitter le tracking d'une commande
  socket.on('leave-tracking', (data: { orderId: string }) => {
    socket.leave(`tracking-${data.orderId}`);
    console.log(`📍 Client quitte le tracking de la commande ${data.orderId}`);
  });

  // Mise à jour de position du driver
  socket.on('update-driver-location', (data: { orderId: string; location: { latitude: number; longitude: number; address?: string } }) => {
    io.to(`tracking-${data.orderId}`).emit('driver-location-update', {
      orderId: data.orderId,
      location: data.location,
      timestamp: new Date()
    });
    console.log(`📍 Position du driver mise à jour pour la commande ${data.orderId}`);
  });

  // Rejoindre les notifications de commandes
  socket.on('join-order-notifications', (data: { userId: string }) => {
    const roomName = `order-notifications-${data.userId}`;
    socket.join(roomName);
    console.log(`📦 Utilisateur ${data.userId} rejoint les notifications de commandes`);
    console.log('🔍 BACKEND - join-order-notifications - Room:', roomName);
    console.log('🔍 BACKEND - join-order-notifications - Socket ID:', socket.id);
    console.log('🔍 BACKEND - join-order-notifications - Clients dans la room:', io.sockets.adapter.rooms.get(roomName)?.size || 0);
    console.log('🔍 BACKEND - join-order-notifications - Toutes les rooms:', Array.from(io.sockets.adapter.rooms.keys()));
  });

  // Quitter les notifications de commandes
  socket.on('leave-order-notifications', (data: { userId: string }) => {
    socket.leave(`order-notifications-${data.userId}`);
    console.log(`📦 Utilisateur ${data.userId} quitte les notifications de commandes`);
  });
  
  socket.on('disconnect', () => {
    console.log('🔌 Client WebSocket déconnecté:', socket.id);
  });
});

// Fonction pour envoyer une notification depuis n'importe où
export const sendNotification = (userId: string, notification: { title: string }) => {
  io.to(`notifications-${userId}`).emit('new-notification', notification);
};

// Fonction pour envoyer une mise à jour de tracking
export const sendTrackingUpdate = (orderId: string, trackingData: any) => {
  io.to(`tracking-${orderId}`).emit('tracking-update', {
    orderId,
    tracking: trackingData,
    timestamp: new Date()
  });
  console.log(`📍 Mise à jour de tracking envoyée pour la commande ${orderId}`);
};

// Fonction pour envoyer une notification de commande
export const sendOrderNotification = (userId: string, notification: any) => {
  const roomName = `order-notifications-${userId}`;
  const payload = {
    ...notification,
    timestamp: new Date()
  };
  
  console.log('🔍 BACKEND - sendOrderNotification - Room:', roomName);
  console.log('🔍 BACKEND - sendOrderNotification - Payload:', payload);
  console.log('🔍 BACKEND - sendOrderNotification - Clients connectés:', io.sockets.adapter.rooms.get(roomName)?.size || 0);
  
  io.to(roomName).emit('order-status-update', payload);
  console.log(`📦 Notification de commande envoyée à l'utilisateur ${userId}:`, notification.title);
};

// Fonction pour envoyer une notification aux admins
export const sendAdminNotification = (notification: any) => {
  io.to('admin-notifications').emit('new-notification', {
    ...notification,
    timestamp: new Date()
  });
  console.log(`👑 Notification envoyée aux admins:`, notification.title);
};

const PORT = Number(process.env.PORT) || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Using compiled version from dist/`);
});
