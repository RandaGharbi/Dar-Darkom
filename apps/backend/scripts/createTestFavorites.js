const mongoose = require('mongoose');
const Favorite = require('../src/models/Favorite');
const User = require('../src/models/User');

// Configuration de la connexion MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/guerlain';

async function createTestFavorites() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Récupérer le premier utilisateur (ou créer un utilisateur de test)
    let user = await User.findOne();
    
    if (!user) {
      console.log('❌ Aucun utilisateur trouvé. Création d\'un utilisateur de test...');
      user = await User.create({
        name: 'Rinda Gharbi',
        email: 'rinda@guerlain.com',
        password: 'test123',
        phoneNumber: '145269636',
        address: '4 rue de la republique',
        gender: 'Femme'
      });
      console.log('✅ Utilisateur de test créé:', user._id);
    } else {
      console.log('✅ Utilisateur trouvé:', user._id);
    }

    // Supprimer les anciens favoris de test
    await Favorite.deleteMany({ userId: user._id });
    console.log('🗑️ Anciens favoris de test supprimés');

    // Créer des favoris de test
    const testFavorites = [
      {
        userId: user._id,
        productId: '1',
        title: 'Lotion Hydratante Intense',
        subtitle: 'Hydratation profonde 24h',
        price: 45.99,
        image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
        category: 'Body Care'
      },
      {
        userId: user._id,
        productId: '2',
        title: 'Sérum Anti-âge Premium',
        subtitle: 'Régénération cellulaire',
        price: 89.99,
        image_url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop',
        category: 'Skin Care'
      },
      {
        userId: user._id,
        productId: '3',
        title: 'Parfum Signature Guerlain',
        subtitle: 'Essence de luxe française',
        price: 125.00,
        image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
        category: 'Fragrance'
      },
      {
        userId: user._id,
        productId: '4',
        title: 'Crème de Jour Hydratante',
        subtitle: 'Protection quotidienne',
        price: 62.75,
        image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
        category: 'Skin Care'
      },
      {
        userId: user._id,
        productId: '5',
        title: 'Masque Nuit Régénérant',
        subtitle: 'Récupération nocturne',
        price: 78.50,
        image_url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop',
        category: 'Skin Care'
      }
    ];

    // Insérer les favoris de test
    const createdFavorites = await Favorite.insertMany(testFavorites);
    console.log('✅ Favoris de test créés:', createdFavorites.length);

    // Afficher les favoris créés
    console.log('\n❤️ Favoris créés:');
    createdFavorites.forEach((favorite, index) => {
      console.log(`${index + 1}. ${favorite.title}`);
      console.log(`   Catégorie: ${favorite.category}`);
      console.log(`   Prix: ${favorite.price}€`);
      console.log(`   ID Produit: ${favorite.productId}`);
      console.log('');
    });

    console.log('🎉 Script terminé avec succès !');
    console.log(`📊 ${createdFavorites.length} favoris créés pour l'utilisateur ${user.name}`);

  } catch (error) {
    console.error('❌ Erreur lors de la création des favoris de test:', error);
  } finally {
    // Fermer la connexion
    await mongoose.disconnect();
    console.log('🔌 Connexion MongoDB fermée');
  }
}

// Exécuter le script
createTestFavorites(); 