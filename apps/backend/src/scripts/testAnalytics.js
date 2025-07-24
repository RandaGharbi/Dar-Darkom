const mongoose = require('mongoose');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// Connexion à la base de données
mongoose.connect('mongodb://localhost:27017/guerlain', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function testAnalytics() {
  try {
    console.log('🔍 Test des données d\'analytics...\n');

    // Compter les commandes
    const totalOrders = await Order.countDocuments();
    console.log(`📦 Total des commandes: ${totalOrders}`);

    // Compter les commandes complétées
    const completedOrders = await Order.countDocuments({ status: 'completed' });
    console.log(`✅ Commandes complétées: ${completedOrders}`);

    // Compter les utilisateurs
    const totalUsers = await User.countDocuments({ role: 'user' });
    console.log(`👥 Total des utilisateurs: ${totalUsers}`);

    // Compter les produits
    const totalProducts = await Product.countDocuments();
    console.log(`🛍️ Total des produits: ${totalProducts}`);

    // Calculer les ventes totales
    const orders = await Order.find({ status: 'completed' });
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    console.log(`💰 Ventes totales: ${totalSales.toFixed(2)} €`);

    // Analyser les produits par catégorie
    const products = await Product.find();
    const categories = {};
    products.forEach(product => {
      const category = product.category || 'Unknown';
      categories[category] = (categories[category] || 0) + 1;
    });
    console.log('\n📊 Produits par catégorie:');
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`  ${category}: ${count}`);
    });

    // Analyser les commandes récentes
    const recentOrders = await Order.find({
      status: 'completed',
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // 30 derniers jours
    });
    console.log(`\n📈 Commandes des 30 derniers jours: ${recentOrders.length}`);

    const recentSales = recentOrders.reduce((sum, order) => sum + order.total, 0);
    console.log(`💰 Ventes des 30 derniers jours: ${recentSales.toFixed(2)} €`);

    console.log('\n✅ Test terminé avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    mongoose.connection.close();
  }
}

testAnalytics(); 