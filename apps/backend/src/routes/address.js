"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const addressController_1 = require("../controllers/addressController");
const router = express_1.default.Router();
// Ajouter une adresse
router.post('/add', addressController_1.addAddress);
// Récupérer les adresses d'un utilisateur
router.get('/user/:userId', addressController_1.getAddressesByUser);
// Modifier une adresse
router.put('/:addressId', addressController_1.updateAddress);
// Supprimer une adresse
router.delete('/:addressId', addressController_1.deleteAddress);
// Définir une adresse principale
router.patch('/:addressId/default', addressController_1.setDefaultAddress);
exports.default = router;
