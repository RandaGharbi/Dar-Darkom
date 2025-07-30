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
    ],
  },
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias['@/web'] = path.resolve(__dirname);
    return config;
  },
};

export default nextConfig;
