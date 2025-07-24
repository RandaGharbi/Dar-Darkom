"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const basketController_1 = require("../controllers/basketController");
const router = express_1.default.Router();
router.post('/add', basketController_1.addToCart);
router.get('/', basketController_1.getCart);
router.post('/remove', basketController_1.removeFromCart);
router.post('/update', basketController_1.updateCartItem);
router.post('/delete', basketController_1.deleteCart);
exports.default = router;
