#!/usr/bin/env node

/**
 * Script de test pour Apple Sign-In
 * Vérifie la configuration et les dépendances
 */

const fs = require('fs');
const path = require('path');

console.log('🍎 Test de configuration Apple Sign-In pour Dar Darkom Driver\n');

// 1. Vérifier les dépendances
console.log('1. Vérification des dépendances...');
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const requiredDeps = [
  'expo-apple-authentication',
  '@react-native-async-storage/async-storage'
];

const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);

if (missingDeps.length === 0) {
  console.log('✅ Toutes les dépendances requises sont installées');
} else {
  console.log('❌ Dépendances manquantes:', missingDeps.join(', '));
}

// 2. Vérifier la configuration app.json
console.log('\n2. Vérification de la configuration app.json...');
const appJsonPath = path.join(__dirname, '../app.json');
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

const hasAppleAuthPlugin = appJson.expo.plugins?.includes('expo-apple-authentication');
const hasAppleEntitlements = appJson.expo.ios?.entitlements?.['com.apple.developer.applesignin'];

if (hasAppleAuthPlugin && hasAppleEntitlements) {
  console.log('✅ Configuration app.json correcte');
} else {
  console.log('❌ Configuration app.json manquante:');
  if (!hasAppleAuthPlugin) console.log('  - Plugin expo-apple-authentication manquant');
  if (!hasAppleEntitlements) console.log('  - Entitlements Apple Sign-In manquants');
}

// 3. Vérifier les fichiers de service
console.log('\n3. Vérification des fichiers de service...');
const serviceFiles = [
  '../services/appleAuthService.ts',
  '../hooks/useDriverAuth.ts'
];

let allServicesExist = true;
serviceFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} existe`);
  } else {
    console.log(`❌ ${file} manquant`);
    allServicesExist = false;
  }
});

// 4. Vérifier la configuration backend
console.log('\n4. Vérification de la configuration backend...');
const backendPackageJsonPath = path.join(__dirname, '../../backend/package.json');
if (fs.existsSync(backendPackageJsonPath)) {
  const backendPackageJson = JSON.parse(fs.readFileSync(backendPackageJsonPath, 'utf8'));
  const hasAppleSigninAuth = backendPackageJson.dependencies['apple-signin-auth'];
  
  if (hasAppleSigninAuth) {
    console.log('✅ apple-signin-auth installé dans le backend');
  } else {
    console.log('❌ apple-signin-auth manquant dans le backend');
  }
} else {
  console.log('⚠️  Fichier package.json du backend non trouvé');
}

// 5. Résumé
console.log('\n📊 Résumé:');
console.log('==================');

if (missingDeps.length === 0 && hasAppleAuthPlugin && hasAppleEntitlements && allServicesExist) {
  console.log('🎉 Configuration Apple Sign-In complète et prête !');
  console.log('\nProchaines étapes:');
  console.log('1. Configurer Apple Developer Console');
  console.log('2. Ajouter les variables d\'environnement backend');
  console.log('3. Tester sur simulateur iOS');
  console.log('4. Tester sur appareil physique');
} else {
  console.log('⚠️  Configuration incomplète, veuillez corriger les erreurs ci-dessus');
}

console.log('\n📚 Documentation:');
console.log('- Guide de configuration: APPLE_SIGNIN_SETUP.md');
console.log('- Documentation Apple: https://developer.apple.com/sign-in-with-apple/');
console.log('- Documentation Expo: https://docs.expo.dev/versions/latest/sdk/apple-authentication/');

