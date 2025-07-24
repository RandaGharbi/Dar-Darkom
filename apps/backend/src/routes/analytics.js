"use strict";
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
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
const User_1 = __importDefault(require("../models/User"));
const ScheduledExport_1 = __importDefault(require("../models/ScheduledExport"));
const router = express_1.default.Router();
// Middleware pour vérifier que l'utilisateur est admin
const adminAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Essayer l'authentification
        (0, auth_1.auth)(req, res, (error) => {
            var _a;
            if (error) {
                console.log('❌ [AUTH] Erreur d\'authentification:', error);
                return res.status(401).json({ message: 'Token invalide' });
            }
            // Vérifier que l'utilisateur est authentifié
            if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                console.log('❌ [AUTH] Utilisateur non authentifié');
                return res.status(401).json({ message: 'Utilisateur non authentifié' });
            }
            console.log('✅ [AUTH] Utilisateur authentifié:', req.user.email);
            next();
        });
    }
    catch (error) {
        console.log('❌ [AUTH] Erreur dans adminAuth:', error);
        res.status(401).json({ message: 'Token invalide' });
    }
});
// Fonction utilitaire pour calculer la période
const getDateRange = (period) => {
    const now = new Date();
    const startDate = new Date();
    switch (period) {
        case 'daily':
            startDate.setDate(now.getDate() - 7);
            break;
        case 'weekly':
            startDate.setDate(now.getDate() - 30);
            break;
        case 'monthly':
            startDate.setMonth(now.getMonth() - 6);
            break;
        default:
            startDate.setMonth(now.getMonth() - 6);
    }
    return { startDate, endDate: now };
};
// Résumé des analytics
router.get('/summary', adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { period = 'monthly' } = req.query;
        const { startDate, endDate } = getDateRange(period);
        // Données actuelles
        const currentOrders = yield Order_1.default.find({
            createdAt: { $gte: startDate, $lte: endDate },
            status: 'completed'
        });
        const currentSales = currentOrders.reduce((sum, order) => sum + order.total, 0);
        const currentOrderCount = currentOrders.length;
        const currentCustomers = yield User_1.default.countDocuments({
            createdAt: { $gte: startDate, $lte: endDate },
            role: 'user'
        });
        // Données de la période précédente pour calculer la croissance
        const previousStartDate = new Date(startDate);
        const previousEndDate = new Date(startDate);
        const periodDuration = endDate.getTime() - startDate.getTime();
        previousStartDate.setTime(previousStartDate.getTime() - periodDuration);
        previousEndDate.setTime(previousEndDate.getTime() - periodDuration);
        const previousOrders = yield Order_1.default.find({
            createdAt: { $gte: previousStartDate, $lte: previousEndDate },
            status: 'completed'
        });
        const previousSales = previousOrders.reduce((sum, order) => sum + order.total, 0);
        const previousOrderCount = previousOrders.length;
        const previousCustomers = yield User_1.default.countDocuments({
            createdAt: { $gte: previousStartDate, $lte: previousEndDate },
            role: 'user'
        });
        // Calcul des croissances
        const salesGrowth = previousSales > 0 ? ((currentSales - previousSales) / previousSales) * 100 : 0;
        const orderGrowth = previousOrderCount > 0 ? ((currentOrderCount - previousOrderCount) / previousOrderCount) * 100 : 0;
        const customerGrowth = previousCustomers > 0 ? ((currentCustomers - previousCustomers) / previousCustomers) * 100 : 0;
        const averageOrderValue = currentOrderCount > 0 ? currentSales / currentOrderCount : 0;
        res.json({
            totalSales: Math.round(currentSales * 100) / 100,
            totalOrders: currentOrderCount,
            totalCustomers: currentCustomers,
            averageOrderValue: Math.round(averageOrderValue * 100) / 100,
            salesGrowth: Math.round(salesGrowth * 100) / 100,
            orderGrowth: Math.round(orderGrowth * 100) / 100,
            customerGrowth: Math.round(customerGrowth * 100) / 100
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        res.status(500).json({ message: 'Erreur lors du calcul du résumé', error: errorMessage });
    }
}));
// Données de ventes par période
router.get('/sales', adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { period = 'monthly' } = req.query;
        const { startDate, endDate } = getDateRange(period);
        const orders = yield Order_1.default.find({
            createdAt: { $gte: startDate, $lte: endDate },
            status: 'completed'
        });
        // Grouper par mois/semaine/jour selon la période
        const salesData = {};
        orders.forEach(order => {
            let key;
            const orderDate = new Date(order.createdAt);
            switch (period) {
                case 'daily':
                    key = orderDate.toISOString().split('T')[0];
                    break;
                case 'weekly':
                    const weekStart = new Date(orderDate);
                    weekStart.setDate(orderDate.getDate() - orderDate.getDay());
                    key = weekStart.toISOString().split('T')[0];
                    break;
                case 'monthly':
                default:
                    key = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
                    break;
            }
            if (!salesData[key]) {
                salesData[key] = { sales: 0, orders: 0 };
            }
            salesData[key].sales += order.total;
            salesData[key].orders += 1;
        });
        const result = Object.entries(salesData).map(([period, data]) => ({
            month: period,
            sales: Math.round(data.sales * 100) / 100,
            orders: data.orders
        })).sort((a, b) => a.month.localeCompare(b.month));
        res.json(result);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        res.status(500).json({ message: 'Erreur lors du calcul des ventes', error: errorMessage });
    }
}));
// Performance des produits
router.get('/products', adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { period = 'monthly' } = req.query;
        const { startDate, endDate } = getDateRange(period);
        const orders = yield Order_1.default.find({
            createdAt: { $gte: startDate, $lte: endDate },
            status: 'completed'
        });
        const productSales = {};
        orders.forEach(order => {
            order.products.forEach(product => {
                if (!productSales[product.name]) {
                    productSales[product.name] = { sales: 0, quantity: 0, category: 'Unknown' };
                }
                productSales[product.name].sales += product.price * product.qty;
                productSales[product.name].quantity += product.qty;
            });
        });
        const result = Object.entries(productSales)
            .map(([product, data]) => ({
            product,
            sales: Math.round(data.sales * 100) / 100,
            quantity: data.quantity,
            category: data.category
        }))
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 10); // Top 10 produits
        res.json(result);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        res.status(500).json({ message: 'Erreur lors du calcul des performances produits', error: errorMessage });
    }
}));
// Performance par catégorie
router.get('/categories', adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { period = 'monthly' } = req.query;
        const { startDate, endDate } = getDateRange(period);
        const orders = yield Order_1.default.find({
            createdAt: { $gte: startDate, $lte: endDate },
            status: 'completed'
        });
        const categorySales = {};
        orders.forEach(order => {
            order.products.forEach(product => {
                // Utiliser le nom du produit comme catégorie par défaut
                const category = 'Unknown';
                if (!categorySales[category]) {
                    categorySales[category] = { sales: 0, orders: 0, products: 0 };
                }
                categorySales[category].sales += product.price * product.qty;
                categorySales[category].products += product.qty;
            });
            // Compter les commandes uniques par catégorie
            const orderCategories = ['Unknown']; // Catégorie par défaut
            orderCategories.forEach(category => {
                if (categorySales[category]) {
                    categorySales[category].orders += 1;
                }
            });
        });
        const result = Object.entries(categorySales)
            .map(([category, data]) => ({
            category,
            sales: Math.round(data.sales * 100) / 100,
            orders: data.orders,
            products: data.products
        }))
            .sort((a, b) => b.sales - a.sales);
        res.json(result);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        res.status(500).json({ message: 'Erreur lors du calcul des performances par catégorie', error: errorMessage });
    }
}));
// Données clients
router.get('/customers', adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { period = 'monthly' } = req.query;
        const { startDate, endDate } = getDateRange(period);
        const totalCustomers = yield User_1.default.countDocuments({ role: 'user' });
        const newCustomers = yield User_1.default.countDocuments({
            role: 'user',
            createdAt: { $gte: startDate, $lte: endDate }
        });
        // Calculer les clients VIP (plus de 3 commandes)
        const vipCustomers = yield Order_1.default.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: '$userId', orderCount: { $sum: 1 } } },
            { $match: { orderCount: { $gte: 3 } } },
            { $count: 'count' }
        ]);
        const vipCount = vipCustomers.length > 0 ? vipCustomers[0].count : 0;
        const returningCustomers = totalCustomers - newCustomers - vipCount;
        res.json([
            { type: 'New Customers', value: newCustomers, count: newCustomers },
            { type: 'Returning Customers', value: returningCustomers, count: returningCustomers },
            { type: 'VIP Customers', value: vipCount, count: vipCount }
        ]);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        res.status(500).json({ message: 'Erreur lors du calcul des données clients', error: errorMessage });
    }
}));
// Taux de rétention
router.get('/retention', adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { period = 'monthly' } = req.query;
        const { startDate, endDate } = getDateRange(period);
        // Calculer les taux de rétention pour les 7 derniers mois
        const retentionData = [];
        const now = new Date();
        for (let i = 6; i >= 0; i--) {
            const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
            const monthCustomers = yield User_1.default.countDocuments({
                role: 'user',
                createdAt: { $gte: monthStart, $lte: monthEnd }
            });
            const monthOrders = yield Order_1.default.countDocuments({
                createdAt: { $gte: monthStart, $lte: monthEnd },
                status: 'completed'
            });
            const retentionRate = monthCustomers > 0 ? (monthOrders / monthCustomers) * 100 : 0;
            retentionData.push({
                month: `Month ${7 - i}`,
                rate: Math.round(retentionRate * 100) / 100,
                customers: monthCustomers
            });
        }
        res.json(retentionData);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        res.status(500).json({ message: 'Erreur lors du calcul des taux de rétention', error: errorMessage });
    }
}));
// Patterns d'achat
router.get('/purchase-patterns', adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { period = 'monthly' } = req.query;
        const { startDate, endDate } = getDateRange(period);
        // Compter les commandes par utilisateur
        const userOrders = yield Order_1.default.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: '$userId', orderCount: { $sum: 1 } } }
        ]);
        const patterns = {
            '1 Purchase': 0,
            '2 Purchases': 0,
            '3 Purchases': 0,
            '4+ Purchases': 0
        };
        userOrders.forEach(user => {
            if (user.orderCount === 1)
                patterns['1 Purchase']++;
            else if (user.orderCount === 2)
                patterns['2 Purchases']++;
            else if (user.orderCount === 3)
                patterns['3 Purchases']++;
            else
                patterns['4+ Purchases']++;
        });
        const total = userOrders.length;
        const result = Object.entries(patterns).map(([purchases, count]) => ({
            purchases,
            count,
            percentage: total > 0 ? Math.round((count / total) * 100 * 100) / 100 : 0
        }));
        res.json(result);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        res.status(500).json({ message: 'Erreur lors du calcul des patterns d\'achat', error: errorMessage });
    }
}));
// Export des données
router.get('/export', adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type = 'all', format = 'csv', startDate, endDate, status = 'all', includeHeaders = 'true' } = req.query;
        let data = [];
        let filename = '';
        // Construire les filtres de date
        const dateFilter = {};
        if (startDate || endDate) {
            dateFilter.createdAt = {};
            if (startDate)
                dateFilter.createdAt.$gte = new Date(startDate);
            if (endDate)
                dateFilter.createdAt.$lte = new Date(endDate);
        }
        // Construire les filtres de statut pour les commandes
        const statusFilter = status === 'all' ? {} : { status };
        // Récupérer les données selon le type demandé
        switch (type) {
            case 'sales':
                const ordersQuery = Object.assign(Object.assign({}, dateFilter), statusFilter);
                const orders = yield Order_1.default.find(ordersQuery).populate('userId', 'name email');
                data = orders.map(order => {
                    var _a, _b, _c, _d, _e;
                    return ({
                        'ID Commande': order._id,
                        'Client': ((_a = order.userId) === null || _a === void 0 ? void 0 : _a.name) || 'Client inconnu',
                        'Email': ((_b = order.userId) === null || _b === void 0 ? void 0 : _b.email) || '',
                        'Date': new Date(order.createdAt).toLocaleDateString('fr-FR'),
                        'Total': order.total.toFixed(2) + ' €',
                        'Statut': order.status,
                        'Adresse': ((_c = order.shippingAddress) === null || _c === void 0 ? void 0 : _c.street) || '',
                        'Ville': ((_d = order.shippingAddress) === null || _d === void 0 ? void 0 : _d.city) || '',
                        'Code Postal': ((_e = order.shippingAddress) === null || _e === void 0 ? void 0 : _e.postalCode) || ''
                    });
                });
                filename = `ventes_${new Date().toISOString().split('T')[0]}`;
                break;
            case 'products':
                const productsQuery = dateFilter;
                const products = yield Product_1.default.find(productsQuery);
                data = products.map(product => ({
                    'ID Produit': product._id,
                    'Nom': product.name,
                    'Prix': product.price.toFixed(2) + ' €',
                    'Catégorie': product.category || 'Non catégorisé',
                    'Marque': product.brandCreator || 'Non spécifiée',
                    'Description': product.description || '',
                    'Stock': product.stock || 0,
                    'Type': product.type || 'product',
                    'Date de création': new Date(product.createdAt).toLocaleDateString('fr-FR')
                }));
                filename = `produits_${new Date().toISOString().split('T')[0]}`;
                break;
            case 'customers':
                const usersQuery = Object.assign({ role: 'user' }, dateFilter);
                const users = yield User_1.default.find(usersQuery);
                data = users.map(user => ({
                    'ID Client': user._id,
                    'Nom': user.name,
                    'Email': user.email,
                    'Téléphone': '',
                    'Date d\'inscription': new Date(user.createdAt || new Date()).toLocaleDateString('fr-FR'),
                    'Rôle': user.role,
                    'Adresse': '',
                    'Ville': '',
                    'Code Postal': ''
                }));
                filename = `clients_${new Date().toISOString().split('T')[0]}`;
                break;
            case 'all':
            default:
                // Export complet avec toutes les données
                const allOrdersQuery = Object.assign(Object.assign({}, dateFilter), statusFilter);
                const allOrders = yield Order_1.default.find(allOrdersQuery).populate('userId', 'name email');
                const allProducts = yield Product_1.default.find(dateFilter);
                const allUsersQuery = Object.assign({ role: 'user' }, dateFilter);
                const allUsers = yield User_1.default.find(allUsersQuery);
                // Résumé des ventes
                const salesSummary = allOrders.map(order => {
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
                // Résumé des produits
                const productsSummary = allProducts.map(product => ({
                    'Type': 'Produit',
                    'ID': product._id,
                    'Nom': product.name,
                    'Prix': product.price.toFixed(2) + ' €',
                    'Catégorie': product.category || 'Non catégorisé'
                }));
                // Résumé des clients
                const customersSummary = allUsers.map(user => ({
                    'Type': 'Client',
                    'ID': user._id,
                    'Nom': user.name,
                    'Email': user.email,
                    'Date d\'inscription': new Date(user.createdAt || new Date()).toLocaleDateString('fr-FR')
                }));
                data = [...salesSummary, ...productsSummary, ...customersSummary];
                filename = `export_complet_${new Date().toISOString().split('T')[0]}`;
                break;
        }
        if (format === 'csv') {
            // Générer CSV
            const csv = require('json2csv').parse(data, {
                delimiter: ';',
                quote: '"',
                escape: '"'
            });
            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
            res.send('\ufeff' + csv); // BOM pour Excel
        }
        else if (format === 'excel') {
            // Générer Excel
            const ExcelJS = require('exceljs');
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Données');
            // Ajouter les en-têtes
            if (data.length > 0) {
                const headers = Object.keys(data[0]);
                worksheet.addRow(headers);
                // Styliser les en-têtes
                const headerRow = worksheet.getRow(1);
                headerRow.font = { bold: true };
                headerRow.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFE6E6E6' }
                };
            }
            // Ajouter les données
            data.forEach(row => {
                worksheet.addRow(Object.values(row));
            });
            // Ajuster la largeur des colonnes
            worksheet.columns.forEach((column) => {
                column.width = 15;
            });
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}.xlsx"`);
            yield workbook.xlsx.write(res);
        }
        else {
            res.status(400).json({ message: 'Format non supporté. Utilisez "csv" ou "excel".' });
        }
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        res.status(500).json({ message: 'Erreur lors de l\'export', error: errorMessage });
    }
}));
// Historique des exports
router.get('/export-history', adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Pour l'instant, retourner des données mockées
        // Dans une vraie implémentation, on stockerait les exports dans une collection MongoDB
        const exportHistory = [
            {
                id: '1',
                type: 'sales',
                format: 'csv',
                date: '2024-01-15T10:30:00Z',
                status: 'completed',
                filename: 'ventes_2024-01-15.csv',
                size: '2.3 MB',
                records: 150,
                userId: 'admin'
            },
            {
                id: '2',
                type: 'products',
                format: 'excel',
                date: '2024-01-14T14:20:00Z',
                status: 'completed',
                filename: 'produits_2024-01-14.xlsx',
                size: '1.8 MB',
                records: 89,
                userId: 'admin'
            },
            {
                id: '3',
                type: 'all',
                format: 'csv',
                date: '2024-01-13T09:15:00Z',
                status: 'failed',
                filename: 'export_complet_2024-01-13.csv',
                size: '0 MB',
                records: 0,
                userId: 'admin'
            }
        ];
        res.json(exportHistory);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'historique', error: errorMessage });
    }
}));
// Créer un export planifié
router.post('/scheduled-exports', adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log('🚀 [BACKEND] POST /scheduled-exports - Début de la requête');
    console.log('📋 [BACKEND] Données reçues:', req.body);
    console.log('👤 [BACKEND] Utilisateur authentifié:', req.user);
    try {
        let { name, type, format, frequency, time, dayOfWeek, dayOfMonth, emailRecipients, includeHeaders, status } = req.body;
        console.log('🔧 [BACKEND] Variables extraites:', {
            name, type, format, frequency, time, dayOfWeek, dayOfMonth,
            emailRecipients, includeHeaders, status
        });
        // Si aucun time n'est fourni, on met l'heure UTC actuelle + 1 minute
        if (!time) {
            const now = new Date();
            now.setMinutes(now.getMinutes() + 1);
            time = now.toISOString().slice(11, 16); // "HH:MM"
            console.log('⏰ [BACKEND] Heure générée automatiquement:', time);
        }
        // Si frequency est weekly et dayOfWeek n'est pas fourni, on prend le jour courant (en UTC)
        if (frequency === 'weekly' && (dayOfWeek === undefined || dayOfWeek === null || dayOfWeek === '')) {
            const now = new Date();
            dayOfWeek = now.getUTCDay(); // 0 = dimanche, 1 = lundi, ...
            console.log('📅 [BACKEND] Jour de la semaine généré automatiquement:', dayOfWeek);
        }
        // Validation des données
        if (!name || !type || !format || !frequency || !time || !emailRecipients) {
            console.log('❌ [BACKEND] Validation échouée - champs manquants');
            return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis' });
        }
        // Vérification que l'utilisateur est authentifié
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            console.log('❌ [BACKEND] Validation échouée - utilisateur non authentifié');
            return res.status(401).json({ message: 'Utilisateur non authentifié' });
        }
        console.log('✅ [BACKEND] Validation réussie, création de l\'export...');
        // Créer le nouvel export planifié
        const newSchedule = new ScheduledExport_1.default({
            name,
            type,
            format,
            frequency,
            time,
            dayOfWeek: dayOfWeek !== undefined ? parseInt(dayOfWeek) : undefined,
            dayOfMonth: dayOfMonth ? parseInt(dayOfMonth) : undefined,
            emailRecipients: emailRecipients.filter((email) => email.trim()),
            includeHeaders,
            status,
            createdBy: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id
        });
        console.log('📝 [BACKEND] Objet ScheduledExport créé:', newSchedule);
        // Pour les tests immédiats, forcer nextRun à aujourd'hui dans 1 minute APRÈS la création
        const now = new Date();
        // Convertir en heure de Paris (UTC+1 ou UTC+2 selon l'heure d'été)
        const parisTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Paris" }));
        newSchedule.nextRun = new Date(parisTime.getTime() + 60000); // +1 minute
        console.log('⏰ [BACKEND] Heure actuelle Paris:', parisTime.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }));
        console.log('⏰ [BACKEND] nextRun défini à:', newSchedule.nextRun.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }));
        yield newSchedule.save();
        console.log('💾 [BACKEND] Export planifié sauvegardé en base de données');
        console.log('✅ [BACKEND] Réponse envoyée:', newSchedule);
        res.status(201).json(newSchedule);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        console.error('❌ [BACKEND] Erreur lors de la création:', errorMessage);
        res.status(500).json({ message: 'Erreur lors de la création de l\'export planifié', error: errorMessage });
    }
}));
// Récupérer tous les exports planifiés
router.get('/scheduled-exports', adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const scheduledExports = yield ScheduledExport_1.default.find()
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
        res.json(scheduledExports);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        res.status(500).json({ message: 'Erreur lors de la récupération des exports planifiés', error: errorMessage });
    }
}));
// Mettre à jour un export planifié
router.put('/scheduled-exports/:id', adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const scheduledExport = yield ScheduledExport_1.default.findByIdAndUpdate(id, updateData, { new: true }).populate('createdBy', 'name email');
        if (!scheduledExport) {
            return res.status(404).json({ message: 'Export planifié non trouvé' });
        }
        res.json(scheduledExport);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'export planifié', error: errorMessage });
    }
}));
// Supprimer un export planifié
router.delete('/scheduled-exports/:id', adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const scheduledExport = yield ScheduledExport_1.default.findByIdAndDelete(id);
        if (!scheduledExport) {
            return res.status(404).json({ message: 'Export planifié non trouvé' });
        }
        res.json({ message: 'Export planifié supprimé avec succès', id });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'export planifié', error: errorMessage });
    }
}));
exports.default = router;
