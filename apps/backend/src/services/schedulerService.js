"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schedulerService = exports.SchedulerService = void 0;
const cron = __importStar(require("node-cron"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ScheduledExport_1 = __importStar(require("../models/ScheduledExport"));
const emailService_1 = require("./emailService");
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
const User_1 = __importDefault(require("../models/User"));
const json2csv_1 = __importDefault(require("json2csv"));
const exceljs_1 = __importDefault(require("exceljs"));
class SchedulerService {
    constructor() {
        this.cronJob = null;
        this.initializeScheduler();
    }
    // Initialiser le planificateur
    initializeScheduler() {
        // Vérifier toutes les minutes les exports à exécuter
        this.cronJob = cron.schedule('* * * * *', () => __awaiter(this, void 0, void 0, function* () {
            yield this.checkAndExecuteScheduledExports();
        }));
        this.cronJob.start();
    }
    // Vérifier et exécuter les exports planifiés
    checkAndExecuteScheduledExports() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Utiliser l'heure actuelle avec une tolérance de 2 minutes dans le futur
                const now = new Date();
                const toleranceTime = new Date(now.getTime() + 2 * 60 * 1000); // +2 minutes
                console.log('🕐 [SCHEDULER] Heure actuelle:', now.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }));
                console.log('🕐 [SCHEDULER] Tolérance jusqu\'à:', toleranceTime.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }));
                // Récupérer tous les exports actifs qui doivent s'exécuter maintenant (avec tolérance)
                const scheduledExports = yield ScheduledExport_1.default.find({
                    status: 'active',
                    nextRun: { $lte: toleranceTime }
                }).populate('createdBy', 'name email');
                if (scheduledExports.length > 0) {
                    console.log('📝 Exports trouvés:', scheduledExports.map((exp) => ({
                        name: exp.name,
                        nextRun: exp.nextRun.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
                        emailRecipients: exp.emailRecipients
                    })));
                }
                else {
                    // Afficher tous les exports actifs pour debug
                    const allActiveExports = yield ScheduledExport_1.default.find({ status: 'active' });
                    console.log('📋 [SCHEDULER] Aucun export à exécuter. Exports actifs:', allActiveExports.map((exp) => ({
                        name: exp.name,
                        nextRun: exp.nextRun.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
                        status: exp.status
                    })));
                }
                for (const scheduledExport of scheduledExports) {
                    yield this.executeScheduledExport(scheduledExport);
                }
            }
            catch (error) {
                console.error('❌ Erreur lors de la vérification des exports planifiés:', error);
            }
        });
    }
    // Exécuter un export planifié
    executeScheduledExport(scheduledExport) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const exportResult = yield this.generateExport(scheduledExport);
                console.log('✅ [SCHEDULER] Fichier généré avec succès');
                if (exportResult.success) {
                    // Envoyer l'email
                    console.log('📧 [SCHEDULER] Envoi de l\'email...');
                    const emailSent = yield this.sendExportEmail(scheduledExport, exportResult);
                    console.log('✅ [SCHEDULER] Email envoyé avec succès');
                    if (emailSent) {
                        // Mettre à jour le statut
                        yield this.updateExportStatus(scheduledExport._id.toString(), 'success');
                        console.log('💾 [SCHEDULER] Statut mis à jour');
                        console.log('🎉 [SCHEDULER] Export terminé avec succès!');
                    }
                    else {
                        yield this.updateExportStatus(scheduledExport._id.toString(), 'error', 'Erreur lors de l\'envoi de l\'email');
                        console.log('❌ [SCHEDULER] Erreur lors de l\'envoi de l\'email');
                    }
                }
                else {
                    yield this.updateExportStatus(scheduledExport._id.toString(), 'error', exportResult.error);
                    console.log('❌ [SCHEDULER] Erreur lors de la génération du fichier:', exportResult.error);
                }
            }
            catch (error) {
                console.error('❌ [SCHEDULER] Erreur lors de l\'exécution:', error);
                const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
                yield this.updateExportStatus(scheduledExport._id.toString(), 'error', errorMessage);
            }
        });
    }
    // Générer l'export selon le type
    generateExport(scheduledExport) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = [];
                let filename = '';
                let records = 0;
                // Récupérer les données selon le type
                switch (scheduledExport.type) {
                    case 'sales':
                        const orders = yield Order_1.default.find().populate('userId', 'name email');
                        data = orders.map(order => {
                            var _a, _b;
                            return ({
                                'ID Commande': order._id,
                                'Client': ((_a = order.userId) === null || _a === void 0 ? void 0 : _a.name) || 'Client inconnu',
                                'Email': ((_b = order.userId) === null || _b === void 0 ? void 0 : _b.email) || '',
                                'Date': new Date(order.createdAt).toLocaleDateString('fr-FR'),
                                'Total': order.total.toFixed(2) + ' €',
                                'Statut': order.status
                            });
                        });
                        filename = `ventes_${new Date().toISOString().split('T')[0]}`;
                        records = data.length;
                        break;
                    case 'products':
                        const products = yield Product_1.default.find();
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
                    case 'customers':
                        const users = yield User_1.default.find({ role: 'user' });
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
                    case 'all':
                        // Export complet
                        const allOrders = yield Order_1.default.find().populate('userId', 'name email');
                        const allProducts = yield Product_1.default.find();
                        const allUsers = yield User_1.default.find({ role: 'user' });
                        const salesData = allOrders.map(order => {
                            var _a, _b;
                            return ({
                                'Type': 'Vente',
                                'ID': order._id,
                                'Client': ((_a = order.userId) === null || _a === void 0 ? void 0 : _a.name) || 'Client inconnu',
                                'Email': ((_b = order.userId) === null || _b === void 0 ? void 0 : _b.email) || '',
                                'Date': new Date(order.createdAt).toLocaleDateString('fr-FR'),
                                'Total': order.total.toFixed(2) + ' €',
                                'Statut': order.status
                            });
                        });
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
                // Créer le dossier exports s'il n'existe pas
                const exportsDir = path_1.default.join(__dirname, '../../exports');
                if (!fs_1.default.existsSync(exportsDir)) {
                    fs_1.default.mkdirSync(exportsDir, { recursive: true });
                }
                // Générer le fichier selon le format
                const filePath = path_1.default.join(exportsDir, `${filename}.${scheduledExport.format}`);
                if (scheduledExport.format === 'csv') {
                    const csv = json2csv_1.default.parse(data, {
                        delimiter: ';',
                        quote: '"'
                    });
                    fs_1.default.writeFileSync(filePath, '\ufeff' + csv, 'utf8'); // BOM pour Excel
                }
                else {
                    // Excel
                    const workbook = new exceljs_1.default.Workbook();
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
                    yield workbook.xlsx.writeFile(filePath);
                }
                return {
                    success: true,
                    filePath,
                    filename: `${filename}.${scheduledExport.format}`,
                    records
                };
            }
            catch (error) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Erreur inconnue'
                };
            }
        });
    }
    // Envoyer l'email avec l'export
    sendExportEmail(scheduledExport, exportResult) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recipients = scheduledExport.emailRecipients.map(email => ({ email }));
                const emailData = {
                    type: scheduledExport.type,
                    format: scheduledExport.format,
                    filename: exportResult.filename,
                    filePath: exportResult.filePath,
                    records: exportResult.records,
                    date: new Date()
                };
                const emailSent = yield emailService_1.emailService.sendExportEmail(recipients, emailData, scheduledExport.name);
                return emailSent;
            }
            catch (error) {
                console.error('Erreur lors de l\'envoi de l\'email:', error);
                return false;
            }
        });
    }
    // Mettre à jour le statut de l'export
    updateExportStatus(exportId, status, error) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateData = {
                    lastRun: new Date()
                };
                if (status === 'success') {
                    const exportDoc = yield ScheduledExport_1.default.findById(exportId);
                    if (exportDoc) {
                        updateData.nextRun = (0, ScheduledExport_1.calculateNextRun)(exportDoc);
                    }
                    updateData.lastError = undefined;
                }
                else if (status === 'error') {
                    updateData.lastError = error;
                    // Pour les erreurs, reprogrammer dans 1 heure
                    const nextRun = new Date();
                    nextRun.setHours(nextRun.getHours() + 1);
                    updateData.nextRun = nextRun;
                }
                yield ScheduledExport_1.default.findByIdAndUpdate(exportId, updateData);
            }
            catch (error) {
                console.error('Erreur lors de la mise à jour du statut:', error);
            }
        });
    }
    // Arrêter le planificateur
    stop() {
        if (this.cronJob) {
            this.cronJob.stop();
        }
    }
    // Redémarrer le planificateur
    restart() {
        this.stop();
        this.initializeScheduler();
    }
}
exports.SchedulerService = SchedulerService;
// Instance singleton du service de planification
exports.schedulerService = new SchedulerService();
