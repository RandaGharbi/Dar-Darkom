#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🗺️ Configuration de React Native Maps...');

try {
  // Installer les dépendances
  console.log('📦 Installation des dépendances...');
  execSync('npm install react-native-maps', { stdio: 'inherit' });

  // Configuration pour iOS
  console.log('🍎 Configuration iOS...');
  const iosPodfilePath = path.join(__dirname, '../ios/Podfile');
  if (fs.existsSync(iosPodfilePath)) {
    let podfileContent = fs.readFileSync(iosPodfilePath, 'utf8');
    
    // Ajouter la configuration Google Maps si pas déjà présente
    if (!podfileContent.includes('GoogleMaps')) {
      podfileContent = podfileContent.replace(
        'use_expo_modules!',
        `use_expo_modules!
        
# Google Maps
pod 'GoogleMaps'
pod 'Google-Maps-iOS-Utils'`
      );
      
      fs.writeFileSync(iosPodfilePath, podfileContent);
      console.log('✅ Configuration iOS mise à jour');
    }
  }

  // Configuration pour Android
  console.log('🤖 Configuration Android...');
  const androidManifestPath = path.join(__dirname, '../android/app/src/main/AndroidManifest.xml');
  if (fs.existsSync(androidManifestPath)) {
    let manifestContent = fs.readFileSync(androidManifestPath, 'utf8');
    
    // Ajouter les permissions et la clé API Google Maps
    if (!manifestContent.includes('android.permission.ACCESS_FINE_LOCATION')) {
      manifestContent = manifestContent.replace(
        '<uses-permission android:name="android.permission.INTERNET" />',
        `<uses-permission android:name="android.permission.INTERNET" />
        <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
        <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />`
      );
    }
    
    if (!manifestContent.includes('com.google.android.geo.API_KEY')) {
      manifestContent = manifestContent.replace(
        '</application>',
        `    <meta-data
            android:name="com.google.android.geo.API_KEY"
            android:value="YOUR_GOOGLE_MAPS_API_KEY" />
        </application>`
      );
    }
    
    fs.writeFileSync(androidManifestPath, manifestContent);
    console.log('✅ Configuration Android mise à jour');
  }

  console.log('🎉 Configuration terminée !');
  console.log('📝 N\'oubliez pas de :');
  console.log('   1. Ajouter votre clé API Google Maps dans android/app/src/main/AndroidManifest.xml');
  console.log('   2. Ajouter votre clé API Google Maps dans ios/YourApp/AppDelegate.mm');
  console.log('   3. Exécuter "cd ios && pod install" pour iOS');
  console.log('   4. Rebuilder l\'application');

} catch (error) {
  console.error('❌ Erreur lors de la configuration:', error.message);
  process.exit(1);
}

