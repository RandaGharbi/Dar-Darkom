"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const router = express_1.default.Router();
router.post('/create', orderController_1.createOrder);
router.get('/', orderController_1.getAllOrders);
router.get('/active/:userId', orderController_1.getActiveOrders);
router.get('/history/:userId', orderController_1.getOrderHistory);
router.get('/:id', orderController_1.getOrderById);
exports.default = router;
