import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'localhost',
      '10.0.2.2',
      '192.168.43.184', // Ajout de l'IP du backend pour autoriser les images
      '192.168.1.73', // Ajout de l'IP du backend pour autoriser les images
      '192.168.1.74', // ✅ Ajout de l'IP du backend pour autoriser les images
      'images.unsplash.com', // ✅ Ajout d'Unsplash pour les images de la Tunisie
      'olovetunisia.com', // ✅ Images de la Tunisie
      'static1.evcdn.net', // ✅ Images de Carthage
      'lapresse.tn', // ✅ Images de Tunis
      'www.tourmag.com', // ✅ Images de Djerba
      'dynamic-media-cdn.tripadvisor.com', // ✅ Images de Douz
      'appleid.cdn-apple.com', // ✅ Images de profil Apple
      'images.musement.com', // ✅ Images de Musement
      'www.saraesploratrice.it', // ✅ Images de Sidi Bou Saïd
      'villa-romana-monastir.com', // ✅ Images de Carthage
      'www.decouvertemonde.com', // ✅ Images de Tunis
      "i.pinimg.com", // ✅ Images de Pinterest 
      "www.leaders.com.tn", // ✅ Images de Leaders 
      "lapresse.tn", // ✅ Images de La Presse 
      // ajoute d'autres domaines/IP si besoin
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '10.0.2.2',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.73',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.74', // ✅ Ajout de l'IP du backend
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias['@/web'] = path.resolve(__dirname);
    config.resolve.alias['@/'] = path.resolve(__dirname);
    return config;
  },
};

export default nextConfig;
