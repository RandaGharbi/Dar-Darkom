import nodemailer from 'nodemailer';
import fs from 'fs';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Configuration du transporteur email
const createTransporter = () => {
  console.log('🔧 [EMAIL] Création du transporteur email...');
  console.log('📧 [EMAIL] Utilisation de l\'email:', process.env.EMAIL_USER);
  console.log('🔑 [EMAIL] Mot de passe défini:', process.env.EMAIL_PASSWORD ? 'Oui' : 'Non');
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Interface pour les données d'export
interface ExportData {
  type: 'sales' | 'products' | 'customers' | 'all';
  format: 'csv' | 'excel';
  filename: string;
  filePath: string;
  records: number;
  date: Date;
}

// Interface pour les destinataires
interface EmailRecipient {
  email: string;
  name?: string;
}

// Interface pour les notifications de messages
interface MessageNotification {
  to: string;
  userName: string;
  message: string;
  replyUrl: string;
}

// Interface pour la confirmation d'inscription
interface EmailConfirmation {
  to: string;
  userName: string;
  confirmationUrl: string;
  role: string;
}

// Service d'envoi d'email pour les exports
export class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    // Ne pas créer le transporteur dans le constructeur
  }

  // Créer le transporteur de manière paresseuse
  private getTransporter(): nodemailer.Transporter {
    if (!this.transporter) {
      this.transporter = createTransporter();
    }
    return this.transporter!;
  }

  // Envoyer un export par email
  async sendExportEmail(
    recipients: EmailRecipient[],
    exportData: ExportData,
    scheduleName: string
  ): Promise<boolean> {
    console.log('📧 [EMAIL] Début d\'envoi d\'email pour l\'export:', scheduleName);
    console.log('👥 [EMAIL] Destinataires:', recipients);
    console.log('📁 [EMAIL] Fichier à joindre:', exportData.filePath);
    
    try {
      // Vérifier que le fichier existe
      if (!fs.existsSync(exportData.filePath)) {
        console.error(`❌ [EMAIL] Fichier d'export introuvable: ${exportData.filePath}`);
        return false;
      }
      console.log('✅ [EMAIL] Fichier trouvé, préparation de l\'email...');

      // Préparer les destinataires
      const to = recipients.map(recipient => 
        recipient.name ? `${recipient.name} <${recipient.email}>` : recipient.email
      ).join(', ');
      console.log('📮 [EMAIL] Destinataires formatés:', to);

      // Générer le contenu de l'email
      const emailContent = this.generateEmailContent(exportData, scheduleName);
      console.log('📝 [EMAIL] Contenu de l\'email généré');

      // Envoyer l'email avec pièce jointe
      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@nourane.com',
        to: to,
        subject: `[Nourane] Export planifié: ${scheduleName}`,
        html: emailContent,
        attachments: [
          {
            filename: exportData.filename,
            path: exportData.filePath,
            contentType: exportData.format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          }
        ]
      };

      console.log('📤 [EMAIL] Envoi de l\'email...');
      const result = await this.getTransporter().sendMail(mailOptions);
      console.log('✅ [EMAIL] Email envoyé avec succès! Message ID:', result.messageId);
      
      return true;
    } catch (error) {
      console.error('❌ [EMAIL] Erreur lors de l\'envoi de l\'email:', error);
      return false;
    }
  }

  // Envoyer une notification d'erreur
  async sendErrorNotification(
    recipients: EmailRecipient[],
    scheduleName: string,
    error: string
  ): Promise<boolean> {
    try {
      const to = recipients.map(recipient => 
        recipient.name ? `${recipient.name} <${recipient.email}>` : recipient.email
      ).join(', ');

      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@nourane.com',
        to: to,
        subject: `[Nourane] Erreur - Export planifié: ${scheduleName}`,
        html: this.generateErrorEmailContent(scheduleName, error)
      };

      await this.getTransporter().sendMail(mailOptions);
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification d\'erreur:', error);
      return false;
    }
  }

  // Générer le contenu HTML de l'email d'export
  private generateEmailContent(exportData: ExportData, scheduleName: string): string {
    const typeNames = {
      sales: 'Ventes',
      products: 'Produits',
      customers: 'Clients',
      all: 'Export complet'
    };

    const formatNames = {
      csv: 'CSV',
      excel: 'Excel'
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f9f9f9; }
          .container { max-width: 600px; margin: 0 auto; padding: 32px; }
          .header { background: #e6f7f4; padding: 24px; border-radius: 8px; margin-bottom: 20px; display: flex; align-items: center; }
          .header h2 { color: #2d8f85; margin: 0; font-size: 1.6em; }
          .header img { margin-right: 12px; }
          .content { background: #fff; padding: 24px; border-radius: 8px; }
          .footer { text-align: center; margin-top: 24px; color: #888; font-size: 12px; }
          .info-list { list-style: none; padding: 0; margin: 0 0 16px 0; }
          .info-list li { margin: 8px 0; }
          .tip { background: #e6f7f4; border-radius: 6px; padding: 16px; margin: 24px 0 16px 0; color: #2d8f85; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://img.icons8.com/color/48/000000/export-csv.png" alt="Export" width="40" height="40">
            <h2>🎉 Export généré avec succès !</h2>
          </div>
          <div class="content">
            <p>Bonjour,</p>
            <p>
              Excellente nouvelle ! Votre export planifié <b>"${scheduleName}"</b> a été généré avec succès.<br>
              <span style="color: #2d8f85;"><b>Chez Nourane, nous mettons la puissance de vos données à votre service pour booster votre activité !</b></span>
            </p>
            <ul class="info-list">
              <li>📦 <b>Type d'export :</b> ${typeNames[exportData.type]}</li>
              <li>🗂️ <b>Format :</b> ${formatNames[exportData.format]}</li>
              <li>📝 <b>Nombre d'enregistrements :</b> ${exportData.records}</li>
              <li>⏰ <b>Date de génération :</b> ${exportData.date.toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</li>
            </ul>
            <p><b>Le fichier est joint à cet email.</b></p>
            <div style="margin: 24px 0; text-align: center;">
              <img src="https://img.icons8.com/color/48/000000/ok--v1.png" alt="Succès">
            </div>
            <div class="tip">
              <b>💡 Astuce Nourane :</b><br>
              Analysez régulièrement vos exports pour identifier de nouvelles opportunités de croissance et optimiser vos ventes.<br>
              Notre équipe est là pour vous accompagner dans la valorisation de vos données !
            </div>
            <p>
              Merci de faire confiance à Nourane pour la gestion de vos données.<br>
              <b>L'équipe Nourane</b>
            </p>
          </div>
          <div class="footer">
            <p>
              Cet email a été généré automatiquement par le système Nourane.<br>
              Pour toute question ou pour découvrir nos solutions d'analyse avancée, contactez-nous à <a href="mailto:support@nourane.com">support@nourane.com</a>.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Générer le contenu HTML de l'email d'erreur
  private generateErrorEmailContent(scheduleName: string, error: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #fef2f2; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .content { background: #fff; padding: 20px; border-radius: 8px; }
          .error { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 4px; margin: 15px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="color: #dc2626; margin: 0;">⚠️ Erreur Export Nourane</h2>
          </div>
          
          <div class="content">
            <p>Bonjour,</p>
            
            <p>Une erreur s'est produite lors de l'exécution de votre export planifié <strong>"${scheduleName}"</strong>.</p>
            
            <div class="error">
              <strong>Détails de l'erreur :</strong><br>
              ${error}
            </div>
            
            <p>L'équipe technique a été notifiée et travaille à résoudre ce problème.</p>
            
            <p>Cordialement,<br>L'équipe Nourane</p>
          </div>
          
          <div class="footer">
            <p>Cet email a été généré automatiquement par le système Nourane.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Vérifier la configuration email
  async verifyConnection(): Promise<boolean> {
    try {
      await this.getTransporter().verify();
      return true;
    } catch (error) {
      console.error('Erreur de configuration email:', error);
      return false;
    }
  }

  // Envoyer une notification de message
  async sendMessageNotification(notification: MessageNotification): Promise<boolean> {
    console.log('📧 [EMAIL] Envoi de notification de message à:', notification.to);
    
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@nourane.com',
        to: notification.to,
        subject: '[Nourane] Nouvelle réponse à votre message',
        html: this.generateMessageEmailContent(notification)
      };

      const result = await this.getTransporter().sendMail(mailOptions);
      console.log('✅ [EMAIL] Notification de message envoyée! Message ID:', result.messageId);
      
      return true;
    } catch (error) {
      console.error('❌ [EMAIL] Erreur lors de l\'envoi de la notification de message:', error);
      return false;
    }
  }

  // Envoyer un email de confirmation d'inscription
  async sendConfirmationEmail(confirmation: EmailConfirmation): Promise<boolean> {
    console.log('📧 [EMAIL] Envoi d\'email de confirmation à:', confirmation.to);
    
    // Vérifier si les identifiants email sont configurés
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log('⚠️ [EMAIL] Configuration email manquante. Mode simulation activé.');
      console.log('📧 [EMAIL SIMULATION] Email de confirmation pour:', confirmation.to);
      console.log('🔗 [EMAIL SIMULATION] URL de confirmation:', confirmation.confirmationUrl);
      console.log('👤 [EMAIL SIMULATION] Nom:', confirmation.userName);
      console.log('🎭 [EMAIL SIMULATION] Rôle:', confirmation.role);
      return true; // Retourner true pour simuler un envoi réussi
    }
    
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@dar-darkom.com',
        to: confirmation.to,
        subject: '[Dar-Darkom] Confirmez votre inscription employé',
        html: this.generateConfirmationEmailContent(confirmation)
      };

      const result = await this.getTransporter().sendMail(mailOptions);
      console.log('✅ [EMAIL] Email de confirmation envoyé! Message ID:', result.messageId);
      
      return true;
    } catch (error) {
      console.error('❌ [EMAIL] Erreur lors de l\'envoi de l\'email de confirmation:', error);
      console.log('⚠️ [EMAIL] Mode simulation activé en cas d\'erreur.');
      console.log('📧 [EMAIL SIMULATION] Email de confirmation pour:', confirmation.to);
      console.log('🔗 [EMAIL SIMULATION] URL de confirmation:', confirmation.confirmationUrl);
      return true; // Retourner true pour simuler un envoi réussi même en cas d'erreur
    }
  }

  private generateMessageEmailContent(notification: MessageNotification): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Réponse à votre message - Nourane</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #bfa77a 0%, #8b7355 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .message-box {
            background: white;
            border-left: 4px solid #bfa77a;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
          }
          .btn {
            display: inline-block;
            background: #bfa77a;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Nourane Paris</h1>
          <p>Notre équipe vous répond</p>
        </div>
        
        <div class="content">
          <h2>Bonjour ${notification.userName},</h2>
          
          <p>Notre équipe support a répondu à votre message :</p>
          
          <div class="message-box">
            <p><strong>Réponse de l'équipe :</strong></p>
            <p>${notification.message}</p>
          </div>
          
          <p>Pour continuer la conversation, cliquez sur le bouton ci-dessous :</p>
          
          <a href="${notification.replyUrl}" class="btn">Répondre au message</a>
          
          <div class="footer">
            <p>Merci de votre confiance en Nourane Paris</p>
            <p>68 Avenue des Champs-Élysées, 75008 Paris</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateConfirmationEmailContent(confirmation: EmailConfirmation): string {
    const roleDisplay = confirmation.role === 'EMPLOYE' ? 'Employé' : 'Utilisateur';
    
    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmation d'inscription - Dar-Darkom</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #374151;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
            min-height: 100vh;
          }
          
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
            overflow: hidden;
            position: relative;
          }
          
          .header {
            background: #f8f9fa;
            color: #333;
            padding: 40px 24px;
            text-align: center;
            position: relative;
            border-bottom: 1px solid #e9ecef;
          }
          
          .logo {
            width: 80px;
            height: 80px;
            margin: 0 auto 12px auto;
            position: relative;
            z-index: 1;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }
          
          .brand-name {
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            color: #333;
          }
          
          .content {
            padding: 40px 30px;
            position: relative;
          }
          
          .tunisia-bg {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: url('https://olovetunisia.com/cdn/shop/articles/medina_tunis.jpg?v=1665889366');
            background-size: cover;
            background-position: center;
            opacity: 0.05;
            z-index: 0;
          }
          
          .welcome {
            font-size: 24px;
            font-weight: 600;
            color: #111827;
            margin: 0 0 20px 0;
            text-align: center;
            position: relative;
            z-index: 1;
          }
          
          .message {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 30px;
            line-height: 1.6;
            text-align: center;
            position: relative;
            z-index: 1;
          }
          
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px auto;
            display: block;
            width: fit-content;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
            transition: all 0.3s ease;
            position: relative;
            z-index: 1;
          }
          
          .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
          }
          
          .info-section {
            margin: 30px 0;
            position: relative;
            z-index: 1;
          }
          
          .info-item {
            display: flex;
            align-items: center;
            margin: 12px 0;
            font-size: 14px;
            color: #6b7280;
            background: rgba(255, 255, 255, 0.9);
            padding: 16px;
            border-radius: 12px;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          }
          
          .info-icon {
            margin-right: 12px;
            width: 20px;
            font-size: 16px;
          }
          
          .warning {
            background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
            border: 1px solid #feb2b2;
            border-radius: 12px;
            padding: 20px;
            margin: 30px 0;
            text-align: center;
            position: relative;
            z-index: 1;
            box-shadow: 0 4px 15px rgba(245, 101, 101, 0.1);
          }
          
          .warning-title {
            font-weight: 600;
            color: #c53030;
            margin-bottom: 8px;
            font-size: 16px;
          }
          
          .warning-text {
            font-size: 14px;
            color: #9b2c2c;
            line-height: 1.5;
          }
          
          .tunisia-gallery {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin: 30px 0;
            position: relative;
            z-index: 1;
          }
          
          .tunisia-image {
            width: 100%;
            height: 80px;
            border-radius: 12px;
            object-fit: cover;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
          }
          
          .tunisia-image:hover {
            transform: scale(1.05);
          }
          
          .footer {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 30px;
            text-align: center;
            border-top: 1px solid #dee2e6;
            position: relative;
            overflow: hidden;
          }
          
          .footer::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: url('https://static1.evcdn.net/cdn-cgi/image/width=3840,height=3072,quality=70,fit=crop/offer/raw/2022/10/25/f9ea02f4-5342-4fd1-98be-aafdd0b56e5c.jpg');
            background-size: cover;
            background-position: center;
            opacity: 0.1;
            z-index: 0;
          }
          
          .footer-content {
            position: relative;
            z-index: 1;
          }
          
          .footer-text {
            font-size: 12px;
            color: #6b7280;
            margin: 4px 0;
          }
          
          .tunisia-pride {
            font-size: 14px;
            color: #667eea;
            font-weight: 600;
            margin: 8px 0;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <img src="https://lh3.googleusercontent.com/a-/ALV-UjUse46JyqjzRUK0ka2UUw9Kmw7COLpJaxSX6Dlm17b-b2hxIW4=s80-p-k-rw-no" alt="Dar-Darkom Logo" class="logo">
            <h1 class="brand-name">Dar-Darkom</h1>
          </div>
          
          <div class="content">
            <div class="tunisia-bg"></div>
            
            <h2 class="welcome">Bienvenue, ${confirmation.userName} !</h2>
            
            <p class="message">
              Nous sommes ravis de vous accueillir dans l'équipe de <strong>Dar-Darkom</strong>, 
              votre partenaire de confiance pour la restauration en Tunisie 🇹🇳. 
              Pour finaliser votre inscription, veuillez confirmer votre compte en cliquant sur le
              bouton ci-dessous.
            </p>
            
            <a href="${confirmation.confirmationUrl}" class="cta-button">
              ✨ Confirmer mon compte
            </a>
            
            <div class="info-section">
              <h3 style="font-size: 16px; color: #111827; margin-bottom: 12px;">Détails de votre compte :</h3>
              
              <div class="info-item">
                <span class="info-icon">👤</span>
                <span><strong>Rôle :</strong> ${roleDisplay}</span>
              </div>
              
              <div class="info-item">
                <span class="info-icon">🔒</span>
                <span><strong>Sécurité :</strong> Votre compte est protégé par un mot de passe sécurisé.</span>
              </div>
              
              <div class="info-item">
                <span class="info-icon">⚡</span>
                <span><strong>Accès :</strong> Après confirmation, vous pourrez gérer les commandes et contribuer au succès de Dar-Darkom en Tunisie.</span>
              </div>
            </div>
            
            <div class="tunisia-gallery">
              <img src="https://mediaim.expedia.com/destination/1/dec5cc4c6acba1c0f10cedae6131de93.jpg" alt="Tunisie - Sidi Bou Saïd" class="tunisia-image">
              <img src="https://i0.wp.com/lapresse.tn/wp-content/uploads/2024/12/aindrahem.jpg?fit=850%2C491&ssl=1" alt="Tunisie - Médina de Tunis" class="tunisia-image">
              <img src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/561858705.jpg?k=21a5fae01543c5d32fd0a3289218fa3983ef77745af5362fa9f6fd40cc580fb5&o=&hp=1" alt="Tunisie - Djerba" class="tunisia-image">
            </div>
            
            <div class="warning">
              <div class="warning-title">⏰ Important</div>
              <div class="warning-text">
                Le lien de confirmation expirera dans 24 heures.
                <br>Si vous n'avez pas demandé cette inscription, vous pouvez ignorer cet e-mail en toute
                sécurité. Personne n'aura accès à votre compte.
              </div>
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-content">
              <div class="footer-text">© 2024 Dar-Darkom - Tous droits réservés</div>
              <div class="tunisia-pride">🇹🇳 Fierté tunisienne • Excellence culinaire depuis la Tunisie 🇹🇳</div>
              <div class="footer-text">Email envoyé automatiquement</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

// Instance singleton du service email
export const emailService = new EmailService();