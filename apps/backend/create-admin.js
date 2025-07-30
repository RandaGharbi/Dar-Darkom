const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

// Configuration
const MONGO_URI = 'mongodb://localhost:27017/Guerlain';
const ADMIN_CONFIG = {
  name: 'Admin Guerlain',
  email: 'admin@guerlain.com',
  password: 'admin123',
  role: 'admin'
};

async function createAdmin() {
  try {
    console.log('🔗 Connexion à MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findOne({ email: ADMIN_CONFIG.email });
    if (existingAdmin) {
      console.log('⚠️  Admin déjà existant avec cet email:', ADMIN_CONFIG.email);
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Nom:', existingAdmin.name);
      console.log('🔑 Rôle:', existingAdmin.role);
      process.exit(0);
    }

    // Hasher le mot de passe
    console.log('🔐 Hashage du mot de passe...');
    const hashedPassword = await bcrypt.hash(ADMIN_CONFIG.password, 10);

    // Créer l'admin
    console.log('👤 Création de l\'admin...');
    const admin = await User.create({
      name: ADMIN_CONFIG.name,
      email: ADMIN_CONFIG.email,
      password: hashedPassword,
      role: ADMIN_CONFIG.role,
      status: 'Active'
    });

    console.log('✅ Admin créé avec succès !');
    console.log('📧 Email:', admin.email);
    console.log('👤 Nom:', admin.name);
    console.log('🔑 Rôle:', admin.role);
    console.log('🆔 ID:', admin._id);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error.message);
    process.exit(1);
  }
}

createAdmin(); 