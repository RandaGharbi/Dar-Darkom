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
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateNextRun = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ScheduledExportSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['sales', 'products', 'customers', 'all'],
        required: true
    },
    format: {
        type: String,
        enum: ['csv', 'excel'],
        required: true
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        required: true
    },
    time: {
        type: String,
        required: true,
        match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/ // Format HH:MM
    },
    dayOfWeek: {
        type: Number,
        min: 0,
        max: 6,
        required: function () {
            return this.frequency === 'weekly';
        }
    },
    dayOfMonth: {
        type: Number,
        min: 1,
        max: 31,
        required: function () {
            return this.frequency === 'monthly';
        }
    },
    emailRecipients: [{
            type: String,
            required: true,
            trim: true,
            lowercase: true
        }],
    includeHeaders: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        enum: ['active', 'paused', 'completed'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    nextRun: {
        type: Date,
        required: true
    },
    lastRun: {
        type: Date
    },
    lastError: {
        type: String
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});
// Index pour optimiser les requêtes
ScheduledExportSchema.index({ status: 1, nextRun: 1 });
ScheduledExportSchema.index({ createdBy: 1 });
// Fonction utilitaire pour calculer la prochaine exécution
const calculateNextRun = (schedule) => {
    // Utiliser l'heure de Paris
    const now = new Date();
    const parisTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Paris" }));
    const [hours, minutes] = (schedule.time || '09:00').split(':').map(Number);
    let nextRun = new Date(parisTime);
    nextRun.setHours(hours, minutes, 0, 0);
    // Si l'heure est déjà passée aujourd'hui, passer au prochain jour
    if (nextRun <= parisTime) {
        nextRun.setDate(nextRun.getDate() + 1);
    }
    switch (schedule.frequency) {
        case 'daily':
            // Déjà calculé ci-dessus
            break;
        case 'weekly':
            if (schedule.dayOfWeek !== undefined) {
                const currentDay = nextRun.getDay();
                const daysToAdd = (schedule.dayOfWeek - currentDay + 7) % 7;
                nextRun.setDate(nextRun.getDate() + daysToAdd);
            }
            break;
        case 'monthly':
            if (schedule.dayOfMonth !== undefined) {
                nextRun.setDate(schedule.dayOfMonth);
                // Si la date est déjà passée ce mois, passer au mois suivant
                if (nextRun <= parisTime) {
                    nextRun.setMonth(nextRun.getMonth() + 1);
                    nextRun.setDate(schedule.dayOfMonth);
                }
            }
            break;
    }
    return nextRun;
};
exports.calculateNextRun = calculateNextRun;
// Middleware pre-save pour calculer automatiquement nextRun
ScheduledExportSchema.pre('save', function (next) {
    // Ne recalculer nextRun que si on ne l'a pas déjà défini manuellement
    if (!this.nextRun && (this.isNew || this.isModified('frequency') || this.isModified('time') ||
        this.isModified('dayOfWeek') || this.isModified('dayOfMonth'))) {
        this.nextRun = (0, exports.calculateNextRun)(this);
    }
    next();
});
exports.default = mongoose_1.default.model('ScheduledExport', ScheduledExportSchema);
