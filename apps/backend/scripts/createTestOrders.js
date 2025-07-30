const mongoose = require('mongoose');
const Order = require('../src/models/Order');
const User = require('../src/models/User');

// Configuration de la connexion MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/guerlain';

async function createTestOrders() {
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

    // Supprimer les anciennes commandes de test
    await Order.deleteMany({ userId: user._id });
    console.log('🗑️ Anciennes commandes de test supprimées');

    // Créer des commandes de test
    const testOrders = [
      {
        userId: user._id,
        products: [
          {
            name: 'Lotion Hydratante Intense',
            qty: 1,
            image: 'https://example.com/lotion.jpg',
            price: 45.99
          },
          {
            name: 'Sérum Anti-âge Premium',
            qty: 1,
            image: 'https://example.com/serum.jpg',
            price: 44.00
          }
        ],
        subtotal: 89.99,
        shipping: 5.00,
        tax: 8.99,
        total: 103.98,
        status: 'completed',
        shippingAddress: {
          fullName: 'Rinda Gharbi',
          street: '4 rue de la republique',
          city: 'Paris',
          postalCode: '75001',
          country: 'France'
        },
        isOrdered: true,
        createdAt: new Date('2025-01-15T10:30:00Z')
      },
      {
        userId: user._id,
        products: [
          {
            name: 'Crème de Jour Hydratante',
            qty: 2,
            image: 'https://example.com/creme.jpg',
            price: 62.75
          }
        ],
        subtotal: 125.50,
        shipping: 5.00,
        tax: 12.55,
        total: 143.05,
        status: 'active',
        shippingAddress: {
          fullName: 'Rinda Gharbi',
          street: '4 rue de la republique',
          city: 'Paris',
          postalCode: '75001',
          country: 'France'
        },
        isOrdered: true,
        createdAt: new Date('2025-01-20T14:15:00Z')
      },
      {
        userId: user._id,
        products: [
          {
            name: 'Parfum Signature Guerlain',
            qty: 1,
            image: 'https://example.com/parfum.jpg',
            price: 125.00
          }
        ],
        subtotal: 125.00,
        shipping: 5.00,
        tax: 12.50,
        total: 142.50,
        status: 'cancelled',
        shippingAddress: {
          fullName: 'Rinda Gharbi',
          street: '4 rue de la republique',
          city: 'Paris',
          postalCode: '75001',
          country: 'France'
        },
        isOrdered: true,
        createdAt: new Date('2025-01-10T09:45:00Z')
      }
    ];

    // Insérer les commandes de test
    const createdOrders = await Order.insertMany(testOrders);
    console.log('✅ Commandes de test créées:', createdOrders.length);

    // Afficher les commandes créées
    console.log('\n📋 Commandes créées:');
    createdOrders.forEach((order, index) => {
      console.log(`${index + 1}. Commande #${order._id}`);
      console.log(`   Statut: ${order.status}`);
      console.log(`   Total: ${order.total}€`);
      console.log(`   Date: ${order.createdAt}`);
      console.log(`   Produits: ${order.products.length}`);
      console.log('');
    });

    console.log('🎉 Script terminé avec succès !');
    console.log(`📊 ${createdOrders.length} commandes créées pour l'utilisateur ${user.name}`);

  } catch (error) {
    console.error('❌ Erreur lors de la création des commandes de test:', error);
  } finally {
    // Fermer la connexion
    await mongoose.disconnect();
    console.log('🔌 Connexion MongoDB fermée');
  }
}

// Exécuter le script
createTestOrders(); 