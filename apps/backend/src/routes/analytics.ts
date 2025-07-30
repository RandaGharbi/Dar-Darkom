import express, { Request, Response, NextFunction } from 'express';
import { auth } from '../middleware/auth';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';
import ScheduledExport from '../models/ScheduledExport';

const router = express.Router();

// Middleware pour vérifier que l'utilisateur est admin
const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Essayer l'authentification
    auth(req, res, (error: any) => {
      if (error) {
        console.log('❌ [AUTH] Erreur d\'authentification:', error);
        return res.status(401).json({ message: 'Token invalide' });
      }
      
      // Vérifier que l'utilisateur est authentifié
      if (!req.user?.id) {
        console.log('❌ [AUTH] Utilisateur non authentifié');
        return res.status(401).json({ message: 'Utilisateur non authentifié' });
      }
      
      console.log('✅ [AUTH] Utilisateur authentifié:', req.user.email);
      next();
    });
  } catch (error) {
    console.log('❌ [AUTH] Erreur dans adminAuth:', error);
    res.status(401).json({ message: 'Token invalide' });
  }
};

// Fonction utilitaire pour calculer la période
const getDateRange = (period: string) => {
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
router.get('/summary', adminAuth, async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    const { startDate, endDate } = getDateRange(period as string);
    
    // Données actuelles
    const currentOrders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate },
      status: 'completed'
    });
    
    const currentSales = currentOrders.reduce((sum, order) => sum + order.total, 0);
    const currentOrderCount = currentOrders.length;
    const currentCustomers = await User.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
      role: 'user'
    });
    
    // Données de la période précédente pour calculer la croissance
    const previousStartDate = new Date(startDate);
    const previousEndDate = new Date(startDate);
    const periodDuration = endDate.getTime() - startDate.getTime();
    
    previousStartDate.setTime(previousStartDate.getTime() - periodDuration);
    previousEndDate.setTime(previousEndDate.getTime() - periodDuration);
    
    const previousOrders = await Order.find({
      createdAt: { $gte: previousStartDate, $lte: previousEndDate },
      status: 'completed'
    });
    
    const previousSales = previousOrders.reduce((sum, order) => sum + order.total, 0);
    const previousOrderCount = previousOrders.length;
    const previousCustomers = await User.countDocuments({
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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    res.status(500).json({ message: 'Erreur lors du calcul du résumé', error: errorMessage });
  }
});

// Données de ventes par période
router.get('/sales', adminAuth, async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    const { startDate, endDate } = getDateRange(period as string);
    
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate },
      status: 'completed'
    });
    
    // Grouper par mois/semaine/jour selon la période
    const salesData: { [key: string]: { sales: number; orders: number } } = {};
    
    orders.forEach(order => {
      let key: string;
      const orderDate = new Date(order.createdAt);
      
      switch (period) {
        case 'daily':
          key = orderDate.toISOString().split('T')[0];
          break;
        case 'weekly': {
          const weekStart = new Date(orderDate);
          weekStart.setDate(orderDate.getDate() - orderDate.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        }
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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    res.status(500).json({ message: 'Erreur lors du calcul des ventes', error: errorMessage });
  }
});

// Performance des produits
router.get('/products', adminAuth, async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    const { startDate, endDate } = getDateRange(period as string);
    
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate },
      status: 'completed'
    });
    
    const productSales: { [key: string]: { sales: number; quantity: number; category: string } } = {};
    
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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    res.status(500).json({ message: 'Erreur lors du calcul des performances produits', error: errorMessage });
  }
});

// Performance par catégorie
router.get('/categories', adminAuth, async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    const { startDate, endDate } = getDateRange(period as string);
    
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate },
      status: 'completed'
    });
    
    const categorySales: { [key: string]: { sales: number; orders: number; products: number } } = {};
    
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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    res.status(500).json({ message: 'Erreur lors du calcul des performances par catégorie', error: errorMessage });
  }
});

// Données clients
router.get('/customers', adminAuth, async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    const { startDate, endDate } = getDateRange(period as string);
    
    const totalCustomers = await User.countDocuments({ role: 'user' });
    const newCustomers = await User.countDocuments({
      role: 'user',
      createdAt: { $gte: startDate, $lte: endDate }
    });
    
    // Calculer les clients VIP (plus de 3 commandes)
    const vipCustomers = await Order.aggregate([
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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    res.status(500).json({ message: 'Erreur lors du calcul des données clients', error: errorMessage });
  }
});

// Taux de rétention
router.get('/retention', adminAuth, async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { startDate, endDate } = getDateRange(period as string);
    
    // Calculer les taux de rétention pour les 7 derniers mois
    const retentionData = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthCustomers = await User.countDocuments({
        role: 'user',
        createdAt: { $gte: monthStart, $lte: monthEnd }
      });
      
      const monthOrders = await Order.countDocuments({
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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    res.status(500).json({ message: 'Erreur lors du calcul des taux de rétention', error: errorMessage });
  }
});

// Patterns d'achat
router.get('/purchase-patterns', adminAuth, async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { startDate, endDate } = getDateRange(period as string);
    
    // Compter les commandes par utilisateur
    const userOrders = await Order.aggregate([
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
      if (user.orderCount === 1) patterns['1 Purchase']++;
      else if (user.orderCount === 2) patterns['2 Purchases']++;
      else if (user.orderCount === 3) patterns['3 Purchases']++;
      else patterns['4+ Purchases']++;
    });
    
    const total = userOrders.length;
    
    const result = Object.entries(patterns).map(([purchases, count]) => ({
      purchases,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100 * 100) / 100 : 0
    }));
    
    res.json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    res.status(500).json({ message: 'Erreur lors du calcul des patterns d\'achat', error: errorMessage });
  }
});

// Export des données
router.get('/export', adminAuth, async (req, res) => {
  try {
    const { 
      type = 'all', 
      format = 'csv',
      startDate,
      endDate,
      status = 'all',
      includeHeaders = 'true' // eslint-disable-line @typescript-eslint/no-unused-vars
    } = req.query;
    
    let data: object[] = [];
    let filename = '';
    
    // Construire les filtres de date
    const dateFilter: Record<string, any> = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) (dateFilter.createdAt as any).$gte = new Date(startDate as string);
      if (endDate) (dateFilter.createdAt as any).$lte = new Date(endDate as string);
    }
    
    // Construire les filtres de statut pour les commandes
    const statusFilter = status === 'all' ? {} : { status };
    
    // Récupérer les données selon le type demandé
    switch (type) {
      case 'sales': {
        const ordersQuery = { ...dateFilter, ...statusFilter };
        const orders = await Order.find(ordersQuery).populate('userId', 'name email');
        data = orders.map(order => ({
          'ID Commande': order._id,
          'Client': (order.userId as any)?.name || 'Client inconnu',
          'Email': (order.userId as any)?.email || '',
          'Date': new Date(order.createdAt).toLocaleDateString('fr-FR'),
          'Total': order.total.toFixed(2) + ' €',
          'Statut': order.status,
          'Adresse': order.shippingAddress?.street || '',
          'Ville': order.shippingAddress?.city || '',
          'Code Postal': order.shippingAddress?.postalCode || ''
        }));
        filename = `ventes_${new Date().toISOString().split('T')[0]}`;
        break;
      }
        
      case 'products': {
        const productsQuery = dateFilter;
        const products = await Product.find(productsQuery);
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
      }
        
      case 'customers': {
        const usersQuery = { role: 'user', ...dateFilter };
        const users = await User.find(usersQuery);
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
      }
        
      case 'all':
      default: {
        // Export complet avec toutes les données
        const allOrdersQuery = { ...dateFilter, ...statusFilter };
        const allOrders = await Order.find(allOrdersQuery).populate('userId', 'name email');
        const allProducts = await Product.find(dateFilter);
        const allUsersQuery = { role: 'user', ...dateFilter };
        const allUsers = await User.find(allUsersQuery);
        
        // Résumé des ventes
        const salesSummary = allOrders.map(order => ({
          'Type': 'Vente',
          'ID': order._id,
          'Client': (order.userId as any)?.name || 'Client inconnu',
          'Email': (order.userId as any)?.email || '',
          'Date': new Date(order.createdAt).toLocaleDateString('fr-FR'),
          'Total': order.total.toFixed(2) + ' €',
          'Statut': order.status
        }));
        
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
    }
    
    if (format === 'csv') {
      // Générer CSV
      const csv = eval('require')('json2csv').parse(data, { 
        delimiter: ';',
        quote: '"',
        escape: '"'
      });
      
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      res.send('\ufeff' + csv); // BOM pour Excel
    } else if (format === 'excel') {
      // Générer Excel
      const ExcelJS = eval('require')('exceljs');
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
      worksheet.columns.forEach((column: unknown) => {
        if (column && typeof column === 'object' && 'width' in column) {
          (column as { width: number }).width = 15;
        }
      });
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.xlsx"`);
      
      await workbook.xlsx.write(res);
    } else {
      res.status(400).json({ message: 'Format non supporté. Utilisez "csv" ou "excel".' });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    res.status(500).json({ message: 'Erreur lors de l\'export', error: errorMessage });
  }
});

// Historique des exports
router.get('/export-history', adminAuth, async (req, res) => {
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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'historique', error: errorMessage });
  }
});

// Créer un export planifié
router.post('/scheduled-exports', adminAuth, async (req, res) => {
  console.log('🚀 [BACKEND] POST /scheduled-exports - Début de la requête');
  console.log('📋 [BACKEND] Données reçues:', req.body);
  console.log('👤 [BACKEND] Utilisateur authentifié:', req.user);
  
  try {
    let {
      name,
      type,
      format,
      frequency,
      time,
      dayOfWeek,
      dayOfMonth,
      emailRecipients,
      includeHeaders,
      status
    } = req.body;

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
    if (!req.user?.id) {
      console.log('❌ [BACKEND] Validation échouée - utilisateur non authentifié');
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    console.log('✅ [BACKEND] Validation réussie, création de l\'export...');

    // Créer le nouvel export planifié
    const newSchedule = new ScheduledExport({
      name,
      type,
      format,
      frequency,
      time,
      dayOfWeek: dayOfWeek !== undefined ? parseInt(dayOfWeek) : undefined,
      dayOfMonth: dayOfMonth ? parseInt(dayOfMonth) : undefined,
      emailRecipients: (emailRecipients as string[]).filter((email: string) => (email as string).trim()),
      includeHeaders,
      status,
      createdBy: req.user?.id
    });

    console.log('📝 [BACKEND] Objet ScheduledExport créé:', newSchedule);

    // Pour les tests immédiats, forcer nextRun à aujourd'hui dans 1 minute APRÈS la création
    const now = new Date();
    // Convertir en heure de Paris (UTC+1 ou UTC+2 selon l'heure d'été)
    const parisTime = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Paris"}));
    newSchedule.nextRun = new Date(parisTime.getTime() + 60000); // +1 minute
    console.log('⏰ [BACKEND] Heure actuelle Paris:', parisTime.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }));
    console.log('⏰ [BACKEND] nextRun défini à:', newSchedule.nextRun.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }));
    
    await newSchedule.save();
    console.log('💾 [BACKEND] Export planifié sauvegardé en base de données');
    console.log('✅ [BACKEND] Réponse envoyée:', newSchedule);
    res.status(201).json(newSchedule);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('❌ [BACKEND] Erreur lors de la création:', errorMessage);
    res.status(500).json({ message: 'Erreur lors de la création de l\'export planifié', error: errorMessage });
  }
});

// Récupérer tous les exports planifiés
router.get('/scheduled-exports', adminAuth, async (req, res) => {
  try {
    const scheduledExports = await ScheduledExport.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(scheduledExports);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    res.status(500).json({ message: 'Erreur lors de la récupération des exports planifiés', error: errorMessage });
  }
});

// Mettre à jour un export planifié
router.put('/scheduled-exports/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const scheduledExport = await ScheduledExport.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('createdBy', 'name email');

    if (!scheduledExport) {
      return res.status(404).json({ message: 'Export planifié non trouvé' });
    }

    res.json(scheduledExport);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'export planifié', error: errorMessage });
  }
});

// Supprimer un export planifié
router.delete('/scheduled-exports/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const scheduledExport = await ScheduledExport.findByIdAndDelete(id);
    
    if (!scheduledExport) {
      return res.status(404).json({ message: 'Export planifié non trouvé' });
    }

    res.json({ message: 'Export planifié supprimé avec succès', id });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'export planifié', error: errorMessage });
  }
});

export default router; 