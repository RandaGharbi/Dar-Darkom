const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

async function updateProfileImages() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');
    
    const db = client.db('Guerlain');
    const usersCollection = db.collection('users');
    
    // Lire les fichiers existants dans le dossier uploads
    const uploadsDir = path.join(__dirname, '../uploads');
    const files = fs.readdirSync(uploadsDir);
    const imageFiles = files.filter(file => file.endsWith('.jpg') || file.endsWith('.png'));
    
    console.log('Images disponibles:', imageFiles);
    
    // Récupérer tous les utilisateurs
    const users = await usersCollection.find({}).toArray();
    console.log('Utilisateurs trouvés:', users.length);
    
    // Utiliser BASE_URL pour générer l'URL complète
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    
    // Mettre à jour les utilisateurs
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const imageFile = imageFiles[i % imageFiles.length];
      const newProfileImage = `${baseUrl}/uploads/${imageFile}`;
      
      console.log(`Mise à jour de ${user.name}: ${newProfileImage}`);
      
      await usersCollection.updateOne(
        { _id: user._id },
        { $set: { profileImage: newProfileImage } }
      );
    }
    
    console.log('✅ Mise à jour terminée !');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await client.close();
  }
}

updateProfileImages(); 