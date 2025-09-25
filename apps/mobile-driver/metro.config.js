const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Configuration des alias de chemins
config.resolver.alias = {
  '@': path.resolve(__dirname, '.'),
};

module.exports = config;
