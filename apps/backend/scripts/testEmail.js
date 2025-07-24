const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
  console.log('🧪 Test de la configuration email...\n');

  // Vérifier les variables d'environnement
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('❌ Variables d\'environnement manquantes:');
    console.error('   EMAIL_USER:', process.env.EMAIL_USER ? '✅' : '❌');
    console.error('   EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅' : '❌');
    console.error('\n📝 Ajoutez ces variables à votre fichier .env');
    process.exit(1);
  }

  console.log('📧 Configuration détectée:');
  console.log(`   Email: ${process.env.EMAIL_USER}`);
  console.log(`   Mot de passe: ${process.env.EMAIL_PASSWORD ? '✅' : '❌'}\n`);

  // Créer le transporteur
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  try {
    // Tester la connexion
    console.log('🔗 Test de connexion...');
    await transporter.verify();
    console.log('✅ Connexion réussie !\n');

    // Envoyer un email de test
    console.log('📤 Envoi d\'un email de test...');
    const testEmail = process.env.EMAIL_USER; // Envoyer à soi-même
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: testEmail,
      subject: '[Guerlain] Test de configuration email',
      html: `
        <h2>🎉 Test réussi !</h2>
        <p>La configuration email de Guerlain fonctionne correctement.</p>
        <p>Les exports planifiés pourront maintenant envoyer des emails automatiquement.</p>
        <hr>
        <p><small>Envoyé le ${new Date().toLocaleString('fr-FR')}</small></p>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email de test envoyé avec succès !');
    console.log(`   Message ID: ${result.messageId}`);
    console.log(`   Destinataire: ${testEmail}\n`);

    console.log('🎯 Configuration email validée !');
    console.log('   Les exports planifiés peuvent maintenant envoyer des emails.');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('\n🔧 Solutions possibles:');
      console.error('   1. Vérifiez que l\'authentification à 2 facteurs est activée');
      console.error('   2. Utilisez un mot de passe d\'application (pas votre mot de passe principal)');
      console.error('   3. Vérifiez que l\'email est correct');
      console.error('\n📖 Consultez le fichier README_EMAIL_SETUP.md pour plus de détails');
    }
    
    process.exit(1);
  }
}

// Exécuter le test
testEmail(); 