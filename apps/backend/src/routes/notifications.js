"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notificationController_1 = require("../controllers/notificationController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Routes protégées par authentification
router.use(auth_1.auth);
// Récupérer toutes les notifications
router.get('/', notificationController_1.getNotifications);
// Marquer une notification comme lue
router.put('/:id/read', notificationController_1.markAsRead);
// Marquer toutes les notifications comme lues
router.put('/read-all', notificationController_1.markAsRead);
// Supprimer une notification
router.delete('/:id', notificationController_1.deleteNotification);
exports.default = router;
