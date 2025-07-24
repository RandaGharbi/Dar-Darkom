#!/usr/bin/env node

/**
 * Script de test pour MongoDB Atlas
 * Usage: node scripts/test-mongodb-atlas.js
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: './apps/backend/.env' });

// Couleurs pour les logs
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`)
};

async function testMongoDBAtlas() {
  log.info('🧪 Test de connexion MongoDB Atlas...\n');

  // Vérifier les variables d'environnement
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    log.error('❌ Variable MONGODB_URI manquante dans le fichier .env');
    log.info('📝 Ajoutez votre URI MongoDB Atlas dans apps/backend/.env');
    process.exit(1);
  }

  log.info('📋 Configuration détectée:');
  log.info(`   URI: ${mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}\n`);

  try {
    // Connexion à MongoDB Atlas
    log.info('🔗 Tentative de connexion à MongoDB Atlas...');
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    log.success('✅ Connexion à MongoDB Atlas réussie !\n');

    // Test de création d'une collection
    log.info('📊 Test de création de collection...');
    const testCollection = mongoose.connection.collection('test_connection');
    
    // Insérer un document de test
    const testDoc = {
      test: true,
      timestamp: new Date(),
      message: 'Test de connexion MongoDB Atlas'
    };
    
    await testCollection.insertOne(testDoc);
    log.success('✅ Insertion de document réussie !');

    // Récupérer le document
    const retrievedDoc = await testCollection.findOne({ test: true });
    log.success('✅ Lecture de document réussie !');

    // Supprimer le document de test
    await testCollection.deleteOne({ test: true });
    log.success('✅ Suppression de document réussie !\n');

    // Informations sur la base de données
    const dbName = mongoose.connection.name;
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    log.info('📊 Informations de la base de données:');
    log.info(`   Nom: ${dbName}`);
    log.info(`   Collections: ${collections.length}`);
    collections.forEach(col => {
      log.info(`     - ${col.name}`);
    });

    // Test des performances
    log.info('\n⚡ Test de performances...');
    const startTime = Date.now();
    
    for (let i = 0; i < 10; i++) {
      await testCollection.insertOne({ 
        test: true, 
        index: i, 
        timestamp: new Date() 
      });
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    log.success(`✅ 10 insertions en ${duration}ms (${(duration/10).toFixed(1)}ms par insertion)`);

    // Nettoyage
    await testCollection.deleteMany({ test: true });
    log.success('✅ Nettoyage des données de test terminé !\n');

    // Fermer la connexion
    await mongoose.connection.close();
    log.success('🔌 Connexion fermée proprement !\n');

    log.success('🎉 Tous les tests MongoDB Atlas sont passés avec succès !');
    log.info('📝 Votre configuration MongoDB Atlas est prête pour le déploiement.');

  } catch (error) {
    log.error('❌ Erreur lors du test MongoDB Atlas:');
    log.error(`   ${error.message}\n`);
    
    if (error.name === 'MongoNetworkError') {
      log.warning('🔧 Solutions possibles:');
      log.warning('   1. Vérifiez votre URI MongoDB Atlas');
      log.warning('   2. Vérifiez que l\'accès réseau est configuré (0.0.0.0/0)');
      log.warning('   3. Vérifiez vos identifiants utilisateur');
      log.warning('   4. Vérifiez votre connexion internet');
    }
    
    if (error.name === 'MongoServerSelectionError') {
      log.warning('🔧 Solutions possibles:');
      log.warning('   1. Vérifiez que votre cluster MongoDB Atlas est actif');
      log.warning('   2. Vérifiez que l\'utilisateur a les bonnes permissions');
      log.warning('   3. Vérifiez que l\'IP est autorisée dans Network Access');
    }

    process.exit(1);
  }
}

// Exécuter le test
testMongoDBAtlas(); 