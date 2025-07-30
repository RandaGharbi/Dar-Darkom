const mongoose = require('mongoose');
const Activity = require('../src/models/Activity');
const User = require('../src/models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/guerlain';

async function createTestActivities() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Trouver ou créer un utilisateur de test
    let user = await User.findOne();
    if (!user) {
      console.log('👤 Création d\'un utilisateur de test...');
      user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phoneNumber: '+33123456789',
        address: '123 Rue de la Paix, Paris',
        dateOfBirth: '1990-01-01',
        gender: 'Non spécifié',
        preferredLanguage: 'fr',
        username: 'testuser'
      });
      await user.save();
      console.log('✅ Utilisateur de test créé:', user._id);
    } else {
      console.log('✅ Utilisateur existant trouvé:', user._id);
    }

    // Supprimer les anciennes activités de test
    await Activity.deleteMany({ userId: user._id });
    console.log('🗑️ Anciennes activités de test supprimées');

    // Créer des activités de test
    const testActivities = [
      {
        userId: user._id,
        type: 'order',
        title: 'Commande terminée',
        description: 'Commande #507f1f77bcf86cd799439011 pour 89.99 €',
        details: 'Produits: Lotion Hydratante (1), Sérum Anti-âge (1)',
        metadata: {
          orderId: '507f1f77bcf86cd799439011',
          total: 89.99,
          status: 'completed',
          products: [
            { name: 'Lotion Hydratante', qty: 1, price: 45.99 },
            { name: 'Sérum Anti-âge', qty: 1, price: 44.00 }
          ]
        },
        createdAt: new Date('2025-01-20T14:30:00Z')
      },
      {
        userId: user._id,
        type: 'favorite',
        title: 'Produit ajouté aux favoris',
        description: 'Parfum Signature ajouté aux favoris',
        details: 'Prix: 120.00 €',
        metadata: {
          productId: 'prod_001',
          title: 'Parfum Signature',
          price: 120.00,
          category: 'Parfums'
        },
        createdAt: new Date('2025-01-19T10:15:00Z')
      },
      {
        userId: user._id,
        type: 'payment',
        title: 'Méthode de paiement ajoutée',
        description: 'Carte Visa ****4242 ajoutée',
        details: 'Expire: 12/26',
        metadata: {
          cardId: 'card_001',
          cardType: 'Visa',
          last4: '4242',
          expiryDate: '12/26'
        },
        createdAt: new Date('2025-01-18T16:45:00Z')
      },
      {
        userId: user._id,
        type: 'profile',
        title: 'Profil mis à jour',
        description: 'Informations personnelles modifiées',
        details: 'Adresse et numéro de téléphone mis à jour',
        metadata: {
          updatedFields: ['address', 'phoneNumber'],
          previousAddress: '456 Avenue des Champs, Lyon',
          newAddress: '123 Rue de la Paix, Paris'
        },
        createdAt: new Date('2025-01-17T09:20:00Z')
      },
      {
        userId: user._id,
        type: 'login',
        title: 'Connexion',
        description: 'Connexion depuis Paris, France',
        details: 'IP: 192.168.1.100, Navigateur: Chrome',
        metadata: {
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          location: 'Paris, France'
        },
        createdAt: new Date('2025-01-16T08:30:00Z')
      },
      {
        userId: user._id,
        type: 'order',
        title: 'Commande annulée',
        description: 'Commande #507f1f77bcf86cd799439012 annulée',
        details: 'Produits: Crème de jour (2)',
        metadata: {
          orderId: '507f1f77bcf86cd799439012',
          total: 67.98,
          status: 'cancelled',
          products: [
            { name: 'Crème de jour', qty: 2, price: 33.99 }
          ]
        },
        createdAt: new Date('2025-01-15T11:20:00Z')
      },
      {
        userId: user._id,
        type: 'favorite',
        title: 'Produit ajouté aux favoris',
        description: 'Sérum Vitaminé ajouté aux favoris',
        details: 'Prix: 78.50 €',
        metadata: {
          productId: 'prod_002',
          title: 'Sérum Vitaminé',
          price: 78.50,
          category: 'Soins du visage'
        },
        createdAt: new Date('2025-01-14T15:45:00Z')
      },
      {
        userId: user._id,
        type: 'payment',
        title: 'Méthode de paiement ajoutée',
        description: 'Carte Mastercard ****5555 ajoutée',
        details: 'Expire: 08/25',
        metadata: {
          cardId: 'card_002',
          cardType: 'Mastercard',
          last4: '5555',
          expiryDate: '08/25'
        },
        createdAt: new Date('2025-01-13T12:10:00Z')
      },
      {
        userId: user._id,
        type: 'logout',
        title: 'Déconnexion',
        description: 'Déconnexion depuis Paris, France',
        details: 'Session terminée après 2h 15min',
        metadata: {
          sessionDuration: '2h 15min',
          ipAddress: '192.168.1.100',
          location: 'Paris, France'
        },
        createdAt: new Date('2025-01-12T18:45:00Z')
      },
      {
        userId: user._id,
        type: 'order',
        title: 'Commande passée',
        description: 'Commande #507f1f77bcf86cd799439013 pour 156.75 €',
        details: 'Produits: Masque Hydratant (1), Tonique (1), Crème de nuit (1)',
        metadata: {
          orderId: '507f1f77bcf86cd799439013',
          total: 156.75,
          status: 'active',
          products: [
            { name: 'Masque Hydratant', qty: 1, price: 45.00 },
            { name: 'Tonique', qty: 1, price: 28.75 },
            { name: 'Crème de nuit', qty: 1, price: 83.00 }
          ]
        },
        createdAt: new Date('2025-01-11T14:20:00Z')
      }
    ];

    const createdActivities = await Activity.insertMany(testActivities);
    console.log('✅ Activités de test créées:', createdActivities.length);

    console.log('\n📊 Résumé des activités créées:');
    const activityTypes = {};
    createdActivities.forEach(activity => {
      activityTypes[activity.type] = (activityTypes[activity.type] || 0) + 1;
    });
    
    Object.entries(activityTypes).forEach(([type, count]) => {
      console.log(`  - ${type}: ${count} activités`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de la création des activités de test:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

createTestActivities(); 