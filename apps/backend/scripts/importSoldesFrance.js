const mongoose = require('mongoose');
require('dotenv').config();

// Modèle Discount (copie du modèle TypeScript)
const discountSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['percentage', 'fixed'], 
    required: true 
  },
  value: { 
    type: Number, 
    required: true 
  },
  minAmount: { 
    type: Number, 
    default: 0 
  },
  maxUses: { 
    type: Number, 
    required: true 
  },
  usedCount: { 
    type: Number, 
    default: 0 
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  active: { 
    type: Boolean, 
    default: true 
  },
  applicableTo: { 
    type: String, 
    enum: ['all', 'specific_products', 'specific_categories'], 
    default: 'all' 
  },
  description: { 
    type: String 
  },
  discountCollection: { 
    type: String,
    default: 'general'
  }
}, {
  timestamps: true
});

const Discount = mongoose.model('Discount', discountSchema);

// Données des jours des soldes en France pour 2025
const soldesFrance2025 = [
  {
    code: 'SOLDESHIVER2025',
    name: 'Soldes d\'Hiver 2025 -30%',
    type: 'percentage',
    value: 30,
    minAmount: 30,
    maxUses: 1000,
    usedCount: 0,
    startDate: new Date('2025-01-08'),
    endDate: new Date('2025-02-04'),
    active: true,
    applicableTo: 'all',
    description: 'Soldes d\'hiver officielles en France - Réduction de 30% sur tous les produits',
    discountCollection: 'soldes_france'
  },
  {
    code: 'SOLDESETE2025',
    name: 'Soldes d\'Été 2025 -25%',
    type: 'percentage',
    value: 25,
    minAmount: 25,
    maxUses: 1200,
    usedCount: 0,
    startDate: new Date('2025-06-25'),
    endDate: new Date('2025-08-05'),
    active: true,
    applicableTo: 'all',
    description: 'Soldes d\'été officielles en France - Réduction de 25% sur tous les produits',
    discountCollection: 'soldes_france'
  },
  {
    code: 'SOLDESFLASH2025',
    name: 'Soldes Flash -20%',
    type: 'percentage',
    value: 20,
    minAmount: 20,
    maxUses: 500,
    usedCount: 0,
    startDate: new Date('2025-03-15'),
    endDate: new Date('2025-03-22'),
    active: true,
    applicableTo: 'all',
    description: 'Soldes flash spéciales - Réduction de 20% pendant une semaine',
    discountCollection: 'soldes_france'
  },
  {
    code: 'SOLDESVIP2025',
    name: 'Soldes VIP -35%',
    type: 'percentage',
    value: 35,
    minAmount: 100,
    maxUses: 200,
    usedCount: 0,
    startDate: new Date('2025-01-06'),
    endDate: new Date('2025-01-07'),
    active: true,
    applicableTo: 'all',
    description: 'Accès anticipé aux soldes pour les clients VIP - Réduction de 35%',
    discountCollection: 'soldes_france'
  },
  {
    code: 'SOLDESLIVRAISON',
    name: 'Livraison Gratuite Soldes',
    type: 'fixed',
    value: 15,
    minAmount: 50,
    maxUses: 800,
    usedCount: 0,
    startDate: new Date('2025-01-08'),
    endDate: new Date('2025-02-04'),
    active: true,
    applicableTo: 'all',
    description: 'Livraison gratuite pendant les soldes d\'hiver',
    discountCollection: 'soldes_france'
  }
];

async function importSoldesFrance() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Guerlain');
    console.log('✅ Connecté à MongoDB');

    // Supprimer les anciens discounts de la collection soldes_france
    await Discount.deleteMany({ discountCollection: 'soldes_france' });
    console.log('🗑️ Anciens discounts soldes_france supprimés');

    // Insérer les nouveaux discounts
    const result = await Discount.insertMany(soldesFrance2025);
    console.log(`✅ ${result.length} discounts soldes_france importés avec succès`);

    // Afficher les discounts créés
    console.log('\n📋 Discounts créés :');
    result.forEach(discount => {
      console.log(`- ${discount.name} (${discount.code})`);
    });

    console.log('\n🎉 Import terminé avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de l\'import:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le script
importSoldesFrance(); 