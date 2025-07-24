import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import bcrypt from 'bcryptjs';

dotenv.config();

async function createAdmin() {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.ADMIN_NAME) {
    console.error('Veuillez définir ADMIN_NAME, ADMIN_EMAIL et ADMIN_PASSWORD dans le .env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI!);

  const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (existing) {
    console.log('Admin déjà existant');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);
  await User.create({
    name: process.env.ADMIN_NAME,
    email: process.env.ADMIN_EMAIL,
    password: hashedPassword,
    role: 'admin'
  });

  console.log('Admin créé avec succès');
  process.exit(0);
}

createAdmin(); 