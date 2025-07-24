"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const discountController_1 = require("../controllers/discountController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Routes publiques
router.get('/', discountController_1.getAllDiscounts);
router.get('/collection/:collection', discountController_1.getDiscountsByCollection);
router.get('/code/:code', discountController_1.getDiscountByCode);
// Routes protégées (admin uniquement)
router.post('/', auth_1.auth, discountController_1.createDiscount);
router.put('/:id', auth_1.auth, discountController_1.updateDiscount);
router.delete('/:id', auth_1.auth, discountController_1.deleteDiscount);
// Route pour incrémenter l'utilisation (peut être utilisée par les clients)
router.post('/use/:code', discountController_1.incrementUsage);
exports.default = router;
