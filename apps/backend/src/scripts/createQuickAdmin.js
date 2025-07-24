const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Connexion à la base de données
mongoose.connect('mongodb://localhost:27017/guerlain', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createQuickAdmin() {
  try {
    console.log('🔧 Création d\'un compte admin...\n');

    const adminEmail = 'admin@guerlain.com';
    const adminPassword = 'admin123';
    const adminName = 'Admin Guerlain';

    // Vérifier si l'admin existe déjà
    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      console.log('✅ Admin déjà existant avec les identifiants :');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Mot de passe: ${adminPassword}`);
      console.log(`   Nom: ${adminName}`);
      return;
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Créer l'admin
    await User.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ Admin créé avec succès !');
    console.log('\n📋 Identifiants de connexion :');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Mot de passe: ${adminPassword}`);
    console.log(`   Nom: ${adminName}`);
    console.log('\n🔗 Vous pouvez maintenant vous connecter sur :');
    console.log('   http://localhost:3000/login');

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error);
  } finally {
    mongoose.connection.close();
  }
}

createQuickAdmin(); 