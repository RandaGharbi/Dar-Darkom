import { io } from '../index';

// Fonction pour envoyer une notification depuis n'importe où
export const sendNotification = (userId: string, notification: { title: string }) => {
  io.to(`notifications-${userId}`).emit('new-notification', notification);
};
