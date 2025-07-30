const mongoose = require('mongoose');
const Card = require('../src/models/Card');
const User = require('../src/models/User');

// Configuration de la connexion MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/guerlain';

async function createTestCards() {
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

    // Supprimer les anciennes cartes de test
    await Card.deleteMany({ userId: user._id });
    console.log('🗑️ Anciennes cartes de test supprimées');

    // Créer des cartes de test
    const testCards = [
      {
        userId: user._id,
        cardNumber: '4242424242424242',
        expiryDate: '12/2026',
        cvv: '123',
        nameOnCard: 'Rinda Gharbi',
        billingAddress: '4 rue de la republique',
        city: 'Paris',
        state: 'Île-de-France',
        zipCode: '75001',
        country: 'France'
      },
      {
        userId: user._id,
        cardNumber: '5555555555554444',
        expiryDate: '08/2025',
        cvv: '456',
        nameOnCard: 'Rinda Gharbi',
        billingAddress: '4 rue de la republique',
        city: 'Paris',
        state: 'Île-de-France',
        zipCode: '75001',
        country: 'France'
      },
      {
        userId: user._id,
        cardNumber: '378282246310005',
        expiryDate: '03/2027',
        cvv: '789',
        nameOnCard: 'Rinda Gharbi',
        billingAddress: '4 rue de la republique',
        city: 'Paris',
        state: 'Île-de-France',
        zipCode: '75001',
        country: 'France'
      }
    ];

    // Insérer les cartes de test
    const createdCards = await Card.insertMany(testCards);
    console.log('✅ Cartes de test créées:', createdCards.length);

    // Afficher les cartes créées
    console.log('\n💳 Cartes créées:');
    createdCards.forEach((card, index) => {
      console.log(`${index + 1}. ${card.nameOnCard}`);
      console.log(`   Numéro: •••• •••• •••• ${card.cardNumber.slice(-4)}`);
      console.log(`   Expire: ${card.expiryDate}`);
      console.log(`   Type: ${card.cardNumber.startsWith('4') ? 'Visa' : card.cardNumber.startsWith('5') ? 'Mastercard' : 'American Express'}`);
      console.log('');
    });

    console.log('🎉 Script terminé avec succès !');
    console.log(`📊 ${createdCards.length} cartes créées pour l'utilisateur ${user.name}`);

  } catch (error) {
    console.error('❌ Erreur lors de la création des cartes de test:', error);
  } finally {
    // Fermer la connexion
    await mongoose.disconnect();
    console.log('🔌 Connexion MongoDB fermée');
  }
}

// Exécuter le script
createTestCards(); 