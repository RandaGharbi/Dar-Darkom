import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import bcrypt from 'bcryptjs';

dotenv.config();

async function createAdmin() {
  console.log('Variables d\'environnement:', {
    MONGODB_URI: process.env.MONGODB_URI,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_NAME: process.env.ADMIN_NAME
  });

  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.ADMIN_NAME) {
    console.error('Veuillez définir ADMIN_NAME, ADMIN_EMAIL et ADMIN_PASSWORD dans le .env');
    process.exit(1);
  }

  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI n\'est pas défini dans le .env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (existing) {
    console.log('Admin déjà existant, suppression et recréation...');
    await User.deleteOne({ email: process.env.ADMIN_EMAIL });
  }

  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);
  const newAdmin = await User.create({
    name: process.env.ADMIN_NAME,
    email: process.env.ADMIN_EMAIL,
    password: hashedPassword,
    role: 'admin'
  });

  console.log('Admin créé avec succès:', newAdmin);
  process.exit(0);
}

createAdmin(); 