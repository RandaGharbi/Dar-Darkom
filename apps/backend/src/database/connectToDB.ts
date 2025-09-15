import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/DarDarkom';

  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected to DarDarkom');
    console.log('🔍 Base de données active:', mongoose.connection.db?.databaseName || "Non connecté");
    console.log('🔍 URI de connexion:', MONGO_URI);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};
