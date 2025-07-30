import nodemailer from 'nodemailer';
import fs from 'fs';

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
    return this.transporter;
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
        from: process.env.EMAIL_USER || 'noreply@guerlain.com',
        to: to,
        subject: `[Guerlain] Export planifié: ${scheduleName}`,
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
        from: process.env.EMAIL_USER || 'noreply@guerlain.com',
        to: to,
        subject: `[Guerlain] Erreur - Export planifié: ${scheduleName}`,
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
              <span style="color: #2d8f85;"><b>Chez Guerlain, nous mettons la puissance de vos données à votre service pour booster votre activité !</b></span>
            </p>
            <ul class="info-list">
              <li>📦 <b>Type d’export :</b> ${typeNames[exportData.type]}</li>
              <li>🗂️ <b>Format :</b> ${formatNames[exportData.format]}</li>
              <li>📝 <b>Nombre d’enregistrements :</b> ${exportData.records}</li>
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
              <b>💡 Astuce Guerlain :</b><br>
              Analysez régulièrement vos exports pour identifier de nouvelles opportunités de croissance et optimiser vos ventes.<br>
              Notre équipe est là pour vous accompagner dans la valorisation de vos données !
            </div>
            <p>
              Merci de faire confiance à Guerlain pour la gestion de vos données.<br>
              <b>L’équipe Guerlain</b>
            </p>
          </div>
          <div class="footer">
            <p>
              Cet email a été généré automatiquement par le système Guerlain.<br>
              Pour toute question ou pour découvrir nos solutions d’analyse avancée, contactez-nous à <a href="mailto:support@guerlain.com">support@guerlain.com</a>.
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
            <h2 style="color: #dc2626; margin: 0;">⚠️ Erreur Export Guerlain</h2>
          </div>
          
          <div class="content">
            <p>Bonjour,</p>
            
            <p>Une erreur s'est produite lors de l'exécution de votre export planifié <strong>"${scheduleName}"</strong>.</p>
            
            <div class="error">
              <strong>Détails de l'erreur :</strong><br>
              ${error}
            </div>
            
            <p>L'équipe technique a été notifiée et travaille à résoudre ce problème.</p>
            
            <p>Cordialement,<br>L'équipe Guerlain</p>
          </div>
          
          <div class="footer">
            <p>Cet email a été généré automatiquement par le système Guerlain.</p>
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
        from: process.env.EMAIL_USER || 'noreply@guerlain.com',
        to: notification.to,
        subject: '[Guerlain] Nouvelle réponse à votre message',
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

  private generateMessageEmailContent(notification: MessageNotification): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Réponse à votre message - Guerlain</title>
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
          <h1>Guerlain Paris</h1>
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
            <p>Merci de votre confiance en Guerlain Paris</p>
            <p>68 Avenue des Champs-Élysées, 75008 Paris</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

// Instance singleton du service email
export const emailService = new EmailService(); 