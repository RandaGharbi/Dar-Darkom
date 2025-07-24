const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { rawProducts, transformProductForBackend } = require('../src/data/products');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || '');
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

const initProducts = async () => {
  try {
    // Supprimer tous les produits existants
    const Product = require('../src/models/Product').default;
    await Product.deleteMany({});
    console.log('🗑️  Anciens produits supprimés');

    // Transformer et insérer les nouveaux produits
    const transformedProducts = rawProducts.map(transformProductForBackend);
    await Product.insertMany(transformedProducts);
    
    console.log(`✅ ${transformedProducts.length} produits ajoutés avec succès`);
    
    // Afficher quelques statistiques
    const totalProducts = await Product.countDocuments();
    const collections = await Product.distinct('productCollection');
    const typesOfCare = await Product.distinct('typeOfCare');
    
    console.log('\n📊 Statistiques:');
    console.log(`- Total produits: ${totalProducts}`);
    console.log(`- Collections: ${collections.join(', ')}`);
    console.log(`- Types de soins: ${typesOfCare.length} types différents`);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Connexion MongoDB fermée');
  }
};

// Exécuter l'initialisation
connectDB().then(() => {
  initProducts();
}); 