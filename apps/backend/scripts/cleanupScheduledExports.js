// Script pour nettoyer les exports planifiés en double
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function cleanupScheduledExports() {
  const client = new MongoClient(process.env.MONGO_URI || 'mongodb://localhost:27017/Guerlain');
  
  try {
    await client.connect();
    console.log('🔗 Connexion à MongoDB réussie');
    
    const db = client.db();
    const collection = db.collection('scheduledexports');
    
    // Compter tous les exports
    const totalExports = await collection.countDocuments();
    console.log(`📊 Total des exports planifiés: ${totalExports}`);
    
    // Supprimer tous les exports (pour un nettoyage complet)
    const deleteResult = await collection.deleteMany({});
    console.log(`🗑️  Exports supprimés: ${deleteResult.deletedCount}`);
    
    console.log('✅ Nettoyage terminé');
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  } finally {
    await client.close();
  }
}

cleanupScheduledExports();