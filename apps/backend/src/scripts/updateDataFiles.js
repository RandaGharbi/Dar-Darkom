const fs = require('fs');
const path = require('path');

// Fonction pour générer une quantité aléatoire entre 10 et 100
const generateRandomQuantity = () => Math.floor(Math.random() * 91) + 10;

// Fonction pour mettre à jour un fichier JSON
const updateJsonFile = (filePath) => {
  try {
    console.log(`📝 Mise à jour de ${filePath}...`);
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Mettre à jour chaque produit
    data.forEach(product => {
      // Ajouter le champ quantity s'il n'existe pas
      if (!product.hasOwnProperty('quantity')) {
        product.quantity = generateRandomQuantity();
      }
      
      // Ajouter le champ status s'il n'existe pas
      if (!product.hasOwnProperty('status')) {
        product.status = 'Active';
      }
      
      // S'assurer que productType existe
      if (!product.hasOwnProperty('productType')) {
        product.productType = 'product';
      }
    });
    
    // Écrire le fichier mis à jour
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ ${filePath} mis à jour avec succès !`);
    
  } catch (error) {
    console.error(`❌ Erreur lors de la mise à jour de ${filePath}:`, error.message);
  }
};

// Liste des fichiers à mettre à jour
const dataFiles = [
  'rawProducts.json',
  'rawSkinCare.json',
  'rawBodyCare.json',
  'rawHairCare.json',
  'rawIngredient.json'
];

// Chemin vers le dossier data
const dataDir = path.join(__dirname, '../data');

console.log('🚀 Début de la mise à jour des fichiers de données...\n');

// Mettre à jour chaque fichier
dataFiles.forEach(fileName => {
  const filePath = path.join(dataDir, fileName);
  if (fs.existsSync(filePath)) {
    updateJsonFile(filePath);
  } else {
    console.log(`⚠️  Fichier ${fileName} non trouvé`);
  }
});

console.log('\n🎉 Mise à jour terminée !'); 