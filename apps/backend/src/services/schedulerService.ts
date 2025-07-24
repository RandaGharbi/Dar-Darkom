import * as cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import ScheduledExport, { IScheduledExport, calculateNextRun } from '../models/ScheduledExport';
import { emailService } from './emailService';
import Order from '../models/Order';
import Product from '../models/Product';
import User, { IUser } from '../models/User';
import json2csv from 'json2csv';
import ExcelJS from 'exceljs';

interface ExportResult {
  success: boolean;
  filePath?: string;
  filename?: string;
  records?: number;
  error?: string;
}

export class SchedulerService {
  private cronJob: cron.ScheduledTask | null = null;

  constructor() {
    this.initializeScheduler();
  }

  // Initialiser le planificateur
  private initializeScheduler() {
    // Vérifier toutes les minutes les exports à exécuter
    this.cronJob = cron.schedule('* * * * *', async () => {
      await this.checkAndExecuteScheduledExports();
    });

    this.cronJob.start();
  }

  // Vérifier et exécuter les exports planifiés
  private async checkAndExecuteScheduledExports() {
    try {
      // Utiliser l'heure actuelle avec une tolérance de 2 minutes dans le futur
      const now = new Date();
      const toleranceTime = new Date(now.getTime() + 2 * 60 * 1000); // +2 minutes
      
      console.log('🕐 [SCHEDULER] Heure actuelle:', now.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }));
      console.log('🕐 [SCHEDULER] Tolérance jusqu\'à:', toleranceTime.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }));
      
      // Récupérer tous les exports actifs qui doivent s'exécuter maintenant (avec tolérance)
      const scheduledExports = await ScheduledExport.find({
        status: 'active',
        nextRun: { $lte: toleranceTime }
      }).populate('createdBy', 'name email');


      if (scheduledExports.length > 0) {
        console.log('📝 Exports trouvés:', scheduledExports.map((exp: IScheduledExport) => ({
          name: exp.name,
          nextRun: exp.nextRun.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
          emailRecipients: exp.emailRecipients
        })));
      } else {
        // Afficher tous les exports actifs pour debug
        const allActiveExports = await ScheduledExport.find({ status: 'active' });
        console.log('📋 [SCHEDULER] Aucun export à exécuter. Exports actifs:', allActiveExports.map((exp: IScheduledExport) => ({
          name: exp.name,
          nextRun: exp.nextRun.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
          status: exp.status
        })));
      }

      for (const scheduledExport of scheduledExports) {
        await this.executeScheduledExport(scheduledExport);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la vérification des exports planifiés:', error);
    }
  }

  // Exécuter un export planifié
  private async executeScheduledExport(scheduledExport: IScheduledExport) {
    console.log('🚀 [SCHEDULER] Début d\'exécution de l\'export:', scheduledExport.name);
    console.log('📋 [SCHEDULER] Détails de l\'export:', {
      id: scheduledExport._id,
      type: scheduledExport.type,
      format: scheduledExport.format,
      emailRecipients: scheduledExport.emailRecipients
    });
    
    try {
      // Générer le fichier d'export
      console.log('📊 [SCHEDULER] Génération du fichier d\'export...');
      const exportResult = await this.generateExport(scheduledExport);
      console.log('✅ [SCHEDULER] Fichier généré avec succès');

      if (exportResult.success) {
        // Envoyer l'email
        console.log('📧 [SCHEDULER] Envoi de l\'email...');
        const emailSent = await this.sendExportEmail(scheduledExport, exportResult);
        console.log('✅ [SCHEDULER] Email envoyé avec succès');

        if (emailSent) {
          // Mettre à jour le statut
          await this.updateExportStatus(scheduledExport._id!.toString(), 'success');
          console.log('💾 [SCHEDULER] Statut mis à jour');
          console.log('🎉 [SCHEDULER] Export terminé avec succès!');
        } else {
          await this.updateExportStatus(scheduledExport._id!.toString(), 'error', 'Erreur lors de l\'envoi de l\'email');
          console.log('❌ [SCHEDULER] Erreur lors de l\'envoi de l\'email');
        }
      } else {
        await this.updateExportStatus(scheduledExport._id!.toString(), 'error', exportResult.error!);
        console.log('❌ [SCHEDULER] Erreur lors de la génération du fichier:', exportResult.error);
      }

    } catch (error) {
      console.error('❌ [SCHEDULER] Erreur lors de l\'exécution:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      await this.updateExportStatus(scheduledExport._id!.toString(), 'error', errorMessage);
    }
  }

  // Générer l'export selon le type
  private async generateExport(scheduledExport: IScheduledExport): Promise<ExportResult> {
    try {
      let data: object[] = [];
      let filename = '';
      let records = 0;

      // Récupérer les données selon le type
      switch (scheduledExport.type) {
        case 'sales': {
          const orders = await Order.find().populate('userId', 'name email');
          data = orders.map(order => ({
            'ID Commande': order._id,
            'Client': (order.userId as unknown as IUser)?.name || 'Client inconnu',
            'Email': (order.userId as unknown as IUser)?.email || '',
            'Date': new Date(order.createdAt).toLocaleDateString('fr-FR'),
            'Total': order.total.toFixed(2) + ' €',
            'Statut': order.status
          }));
          filename = `ventes_${new Date().toISOString().split('T')[0]}`;
          records = data.length;
          break;
        }

        case 'products': {
          const products = await Product.find();
          data = products.map(product => ({
            'ID Produit': product._id,
            'Nom': product.name,
            'Prix': product.price.toFixed(2) + ' €',
            'Catégorie': product.category || 'Non catégorisé',
            'Description': product.description || ''
          }));
          filename = `produits_${new Date().toISOString().split('T')[0]}`;
          records = data.length;
          break;
        }

        case 'customers': {
          const users = await User.find({ role: 'user' });
          data = users.map(user => ({
            'ID Client': user._id,
            'Nom': user.name,
            'Email': user.email,
            'Date d\'inscription': new Date(user.createdAt || new Date()).toLocaleDateString('fr-FR'),
            'Rôle': user.role
          }));
          filename = `clients_${new Date().toISOString().split('T')[0]}`;
          records = data.length;
          break;
        }

        case 'all': {
          // Export complet
          const allOrders = await Order.find().populate('userId', 'name email');
          const allProducts = await Product.find();
          const allUsers = await User.find({ role: 'user' });

          const salesData = allOrders.map(order => ({
            'Type': 'Vente',
            'ID': order._id,
            'Client': (order.userId as unknown as IUser)?.name || 'Client inconnu',
            'Email': (order.userId as unknown as IUser)?.email || '',
            'Date': new Date(order.createdAt).toLocaleDateString('fr-FR'),
            'Total': order.total.toFixed(2) + ' €',
            'Statut': order.status
          }));

          const productsData = allProducts.map(product => ({
            'Type': 'Produit',
            'ID': product._id,
            'Nom': product.name,
            'Prix': product.price.toFixed(2) + ' €',
            'Catégorie': product.category || 'Non catégorisé'
          }));

          const customersData = allUsers.map(user => ({
            'Type': 'Client',
            'ID': user._id,
            'Nom': user.name,
            'Email': user.email,
            'Date d\'inscription': new Date(user.createdAt || new Date()).toLocaleDateString('fr-FR')
          }));

          data = [...salesData, ...productsData, ...customersData];
          filename = `export_complet_${new Date().toISOString().split('T')[0]}`;
          records = data.length;
          break;
        }
      }

      // Créer le dossier exports s'il n'existe pas
      const exportsDir = path.join(__dirname, '../../exports');
      if (!fs.existsSync(exportsDir)) {
        fs.mkdirSync(exportsDir, { recursive: true });
      }

      // Générer le fichier selon le format
      const filePath = path.join(exportsDir, `${filename}.${scheduledExport.format}`);
      
      if (scheduledExport.format === 'csv') {
        const csv = json2csv.parse(data, { 
          delimiter: ';',
          quote: '"'
        });
        fs.writeFileSync(filePath, '\ufeff' + csv, 'utf8'); // BOM pour Excel
      } else {
        // Excel
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Export');
        
        // Ajouter les en-têtes si demandé
        if (scheduledExport.includeHeaders && data.length > 0) {
          const headers = Object.keys(data[0]);
          worksheet.addRow(headers);
        }
        
        // Ajouter les données
        data.forEach(row => {
          worksheet.addRow(Object.values(row));
        });
        
        await workbook.xlsx.writeFile(filePath);
      }

      return {
        success: true,
        filePath,
        filename: `${filename}.${scheduledExport.format}`,
        records
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  // Envoyer l'email avec l'export
  private async sendExportEmail(scheduledExport: IScheduledExport, exportResult: ExportResult) {
    try {
      const recipients = scheduledExport.emailRecipients.map(email => ({ email }));
      
      const emailData = {
        type: scheduledExport.type,
        format: scheduledExport.format,
        filename: exportResult.filename || '',
        filePath: exportResult.filePath || '',
        records: exportResult.records || 0,
        date: new Date()
      };

      const emailSent = await emailService.sendExportEmail(
        recipients,
        emailData,
        scheduledExport.name
      );

      return emailSent;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      return false;
    }
  }

  // Mettre à jour le statut de l'export
  private async updateExportStatus(exportId: string, status: 'success' | 'error', error?: string) {
    try {
      const updateData: Record<string, unknown> = {
        lastRun: new Date()
      };

      if (status === 'success') {
        const exportDoc = await ScheduledExport.findById(exportId);
        if (exportDoc) {
          updateData.nextRun = calculateNextRun(exportDoc);
        }
        updateData.lastError = undefined;
      } else if (status === 'error') {
        updateData.lastError = error;
        // Pour les erreurs, reprogrammer dans 1 heure
        const nextRun = new Date();
        nextRun.setHours(nextRun.getHours() + 1);
        updateData.nextRun = nextRun;
      }

      await ScheduledExport.findByIdAndUpdate(exportId, updateData);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  }

  // Arrêter le planificateur
  public stop() {
    if (this.cronJob) {
      this.cronJob.stop();
    }
  }

  // Redémarrer le planificateur
  public restart() {
    this.stop();
    this.initializeScheduler();
  }
}

// Instance singleton du service de planification
export const schedulerService = new SchedulerService(); 