export const WEBSOCKET_CONFIG = {
  url: process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000',
  options: {
    transports: ['websocket'],
    timeout: 5000, // Réduit de 20s à 5s
    forceNew: true, // Force une nouvelle connexion
    reconnection: true,
    reconnectionDelay: 1000, // Reconnexion rapide
    reconnectionAttempts: 5,
  }
};
