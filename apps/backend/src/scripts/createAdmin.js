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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
dotenv_1.default.config();
function createAdmin() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.ADMIN_NAME) {
            console.error('Veuillez définir ADMIN_NAME, ADMIN_EMAIL et ADMIN_PASSWORD dans le .env');
            process.exit(1);
        }
        yield mongoose_1.default.connect(process.env.MONGO_URI);
        const existing = yield User_1.default.findOne({ email: process.env.ADMIN_EMAIL });
        if (existing) {
            console.log('Admin déjà existant');
            process.exit(0);
        }
        const hashedPassword = yield bcryptjs_1.default.hash(process.env.ADMIN_PASSWORD, 10);
        yield User_1.default.create({
            name: process.env.ADMIN_NAME,
            email: process.env.ADMIN_EMAIL,
            password: hashedPassword,
            role: 'admin'
        });
        console.log('Admin créé avec succès');
        process.exit(0);
    });
}
createAdmin();
