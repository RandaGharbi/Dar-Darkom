import mongoose, { Schema, Document } from 'mongoose';

export interface IScheduledExport extends Document {
  name: string;
  type: 'sales' | 'products' | 'customers' | 'all';
  format: 'csv' | 'excel';
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string; // Format HH:MM
  dayOfWeek?: number; // 0-6 (Dimanche-Samedi)
  dayOfMonth?: number; // 1-31
  emailRecipients: string[];
  includeHeaders: boolean;
  status: 'active' | 'paused' | 'completed';
  createdAt: Date;
  nextRun: Date;
  lastRun?: Date;
  lastError?: string;
  createdBy: mongoose.Types.ObjectId;
}

const ScheduledExportSchema = new Schema<IScheduledExport>({
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
    required: function() {
      return this.frequency === 'weekly';
    }
  },
  dayOfMonth: {
    type: Number,
    min: 1,
    max: 31,
    required: function() {
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
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// Index pour optimiser les requêtes
ScheduledExportSchema.index({ status: 1, nextRun: 1 });
ScheduledExportSchema.index({ createdBy: 1 });

// Fonction utilitaire pour calculer la prochaine exécution
export const calculateNextRun = (schedule: Partial<IScheduledExport>): Date => {
  // Utiliser l'heure de Paris
  const now = new Date();
  const parisTime = new Date(now.toLocaleString("en-US", {timeZone: "Europe/Paris"}));
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

// Middleware pre-save pour calculer automatiquement nextRun
ScheduledExportSchema.pre('save', function(next) {
  // Ne recalculer nextRun que si on ne l'a pas déjà défini manuellement
  if (!this.nextRun && (this.isNew || this.isModified('frequency') || this.isModified('time') || 
      this.isModified('dayOfWeek') || this.isModified('dayOfMonth'))) {
    this.nextRun = calculateNextRun(this);
  }
  next();
});

export default mongoose.model<IScheduledExport>('ScheduledExport', ScheduledExportSchema); 