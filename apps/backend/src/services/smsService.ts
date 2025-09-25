import axios from 'axios';

export interface SMSConfig {
  to: string;
  userName: string;
  companyName?: string;
  supportPhone?: string;
}

export interface OrderSMSConfig {
  to: string;
  userName: string;
  orderId: string;
  orderTotal: number;
  orderStatus: string;
  companyName?: string;
  supportPhone?: string;
  livreurName?: string;
  estimatedDelivery?: string;
}

export interface SMSResponse {
  success: boolean;
  messageId?: string;
  message?: string;
  error?: string;
  provider?: string;
  timestamp?: Date;
  retryCount?: number;
}

class SMSService {
  private readonly companyName = 'Dar-Darkom';
  private readonly supportPhone = process.env.SUPPORT_PHONE || '+33123456789';
  private readonly senderName = process.env.SMS_SENDER_NAME || 'DarDarkom'; // Nom d'expéditeur configurable
  private readonly maxRetries = 3;
  private readonly retryDelay = 2000; // 2 secondes

  /**
   * Envoie un SMS de bienvenue à un employé
   */
  async sendWelcomeSMS(config: SMSConfig): Promise<SMSResponse> {
    const message = this.buildWelcomeMessage(config);
    
    // Mode simulation pour le développement
    if (process.env.SMS_SIMULATE === 'true') {
      return this.simulateSMS(config.to, message);
    }

    // Mode gratuit avec TextBelt
    if (process.env.SMS_FREE_MODE === 'true') {
      return this.sendWithTextBelt(config.to, message);
    }

    // Mode MessageBird (nécessite un compte)
    if (process.env.SMS_PROVIDER === 'messagebird') {
      return this.sendWithMessageBird(config.to, message);
    }

    // Mode Vonage/Nexmo (nécessite un compte)
    if (process.env.SMS_PROVIDER === 'vonage') {
      return this.sendWithVonage(config.to, message);
    }

    // Par défaut, simulation
    return this.simulateSMS(config.to, message);
  }

  /**
   * Construit le message de bienvenue
   */
  private buildWelcomeMessage(config: SMSConfig): string {
    const companyName = config.companyName || this.companyName;
    const supportPhone = config.supportPhone || this.supportPhone;
    
    return `Bienvenue à notre équipe DarDarkom ${config.userName} ! Votre compte employé est activé. Connectez-vous sur l'app pour gérer les commandes. Support : ${supportPhone}`;
  }

  /**
   * Construit le message de notification de commande
   */
  private buildOrderMessage(config: OrderSMSConfig): string {
    const companyName = config.companyName || this.companyName;
    const supportPhone = config.supportPhone || this.supportPhone;
    
    switch (config.orderStatus) {
      case 'PENDING':
        return `Bonjour ${config.userName}, votre commande #${config.orderId} (${config.orderTotal}€) a été reçue et est en cours de traitement. ${companyName} - Support: ${supportPhone}`;
      
      case 'READY':
        return `Bonjour ${config.userName}, votre commande #${config.orderId} (${config.orderTotal}€) est prête ! Vous pouvez venir la récupérer. ${companyName} - Support: ${supportPhone}`;
      
      case 'out_for_delivery': {
        const livreurInfo = config.livreurName ? `Livreur: ${config.livreurName}` : 'En cours de livraison';
        const deliveryInfo = config.estimatedDelivery ? `Livraison prévue: ${config.estimatedDelivery}` : '';
        return `Bonjour ${config.userName}, votre commande #${config.orderId} (${config.orderTotal}€) est en cours de livraison. ${livreurInfo}. ${deliveryInfo} ${companyName} - Support: ${supportPhone}`;
      }
      
      case 'DELIVERED':
        return `Bonjour ${config.userName}, votre commande #${config.orderId} (${config.orderTotal}€) a été livrée avec succès ! Merci pour votre confiance. ${companyName} - Support: ${supportPhone}`;
      
      case 'CANCELLED':
        return `Bonjour ${config.userName}, votre commande #${config.orderId} (${config.orderTotal}€) a été annulée. Contactez le support pour plus d'informations. ${companyName} - Support: ${supportPhone}`;
      
      default:
        return `Bonjour ${config.userName}, mise à jour de votre commande #${config.orderId} (${config.orderTotal}€) - Statut: ${config.orderStatus}. ${companyName} - Support: ${supportPhone}`;
    }
  }

  /**
   * Mode simulation - affiche le SMS dans la console
   */
  private async simulateSMS(phoneNumber: string, message: string): Promise<SMSResponse> {
    const timestamp = new Date();
    console.log('\n📱 [SMS SIMULATION] ==================');
    console.log(`📞 À: ${phoneNumber}`);
    console.log(`💬 Message: ${message}`);
    console.log(`⏰ Envoyé le: ${timestamp.toLocaleString('fr-FR')}`);
    console.log('=====================================\n');
    
    return {
      success: true,
      messageId: `sim_${Date.now()}`,
      message: 'SMS simulé avec succès',
      provider: 'simulation',
      timestamp: timestamp
    };
  }

  /**
   * TextBelt - Service gratuit (1 SMS gratuit par jour par IP)
   */
  private async sendWithTextBelt(phoneNumber: string, message: string, retryCount = 0): Promise<SMSResponse> {
    const timestamp = new Date();
    const apiKey = process.env.TEXTBELT_API_KEY || 'textbelt'; // Utiliser la clé personnalisée si disponible
    
    try {
      console.log(`📱 [SMS] Envoi via TextBelt vers: ${phoneNumber} (tentative ${retryCount + 1})`);
      
      const response = await axios.post('https://textbelt.com/text', {
        phone: phoneNumber,
        message: message,
        key: apiKey,
        from: this.senderName // 🆕 Nom personnalisé de l'expéditeur (max 11 caractères)
      }, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        console.log('✅ [SMS] TextBelt - SMS envoyé avec succès');
        console.log(`📊 [SMS] Quota restant: ${response.data.quotaRemaining || 'N/A'}`);
        return {
          success: true,
          messageId: response.data.textId,
          message: 'SMS envoyé via TextBelt',
          provider: 'textbelt',
          timestamp: timestamp,
          retryCount: retryCount
        };
      } else {
        const errorMsg = response.data.error || 'Erreur TextBelt inconnue';
        console.error('❌ [SMS] TextBelt - Erreur:', errorMsg);
        
        // Retry si c'est une erreur temporaire et qu'on n'a pas atteint le max
        if (this.shouldRetry(errorMsg) && retryCount < this.maxRetries) {
          console.log(`🔄 [SMS] Retry dans ${this.retryDelay}ms...`);
          await this.delay(this.retryDelay);
          return this.sendWithTextBelt(phoneNumber, message, retryCount + 1);
        }
        
        return {
          success: false,
          error: errorMsg,
          provider: 'textbelt',
          timestamp: timestamp,
          retryCount: retryCount
        };
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erreur de connexion TextBelt';
      console.error('❌ [SMS] Erreur TextBelt:', errorMsg);
      
      // Retry si c'est une erreur de réseau et qu'on n'a pas atteint le max
      if (this.isNetworkError(error) && retryCount < this.maxRetries) {
        console.log(`🔄 [SMS] Retry dans ${this.retryDelay}ms...`);
        await this.delay(this.retryDelay);
        return this.sendWithTextBelt(phoneNumber, message, retryCount + 1);
      }
      
      return {
        success: false,
        error: errorMsg,
        provider: 'textbelt',
        timestamp: timestamp,
        retryCount: retryCount
      };
    }
  }

  /**
   * MessageBird - Service avec essai gratuit
   */
  private async sendWithMessageBird(phoneNumber: string, message: string): Promise<SMSResponse> {
    try {
      const apiKey = process.env.MESSAGEBIRD_API_KEY;
      if (!apiKey) {
        throw new Error('MESSAGEBIRD_API_KEY non configurée');
      }

      console.log('📱 [SMS] Envoi via MessageBird vers:', phoneNumber);
      
      const response = await axios.post('https://rest.messagebird.com/messages', {
        recipients: phoneNumber,
        originator: this.senderName,
        body: message
      }, {
        headers: {
          'Authorization': `AccessKey ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      console.log('✅ [SMS] MessageBird - SMS envoyé avec succès');
      return {
        success: true,
        messageId: response.data.id,
        message: 'SMS envoyé via MessageBird'
      };
    } catch (error) {
      console.error('❌ [SMS] Erreur MessageBird:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur MessageBird'
      };
    }
  }

  /**
   * Vonage (ex-Nexmo) - Service avec crédits gratuits
   */
  private async sendWithVonage(phoneNumber: string, message: string): Promise<SMSResponse> {
    try {
      const apiKey = process.env.VONAGE_API_KEY;
      const apiSecret = process.env.VONAGE_API_SECRET;
      
      if (!apiKey || !apiSecret) {
        throw new Error('Clés Vonage non configurées');
      }

      console.log('📱 [SMS] Envoi via Vonage vers:', phoneNumber);
      
      const response = await axios.post('https://rest.nexmo.com/sms/json', {
        from: this.senderName,
        to: phoneNumber,
        text: message,
        api_key: apiKey,
        api_secret: apiSecret
      }, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.messages[0].status === '0') {
        console.log('✅ [SMS] Vonage - SMS envoyé avec succès');
        return {
          success: true,
          messageId: response.data.messages[0]['message-id'],
          message: 'SMS envoyé via Vonage'
        };
      } else {
        console.error('❌ [SMS] Vonage - Erreur:', response.data.messages[0]['error-text']);
        return {
          success: false,
          error: response.data.messages[0]['error-text'] || 'Erreur Vonage'
        };
      }
    } catch (error) {
      console.error('❌ [SMS] Erreur Vonage:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur Vonage'
      };
    }
  }

  /**
   * Envoie un SMS de notification de commande
   */
  async sendOrderNotificationSMS(config: OrderSMSConfig): Promise<SMSResponse> {
    const message = this.buildOrderMessage(config);
    
    // Mode simulation pour le développement
    if (process.env.SMS_SIMULATE === 'true') {
      return this.simulateSMS(config.to, message);
    }

    // Mode gratuit avec TextBelt
    if (process.env.SMS_FREE_MODE === 'true') {
      return this.sendWithTextBelt(config.to, message);
    }

    // Mode MessageBird (nécessite un compte)
    if (process.env.SMS_PROVIDER === 'messagebird') {
      return this.sendWithMessageBird(config.to, message);
    }

    // Mode Vonage/Nexmo (nécessite un compte)
    if (process.env.SMS_PROVIDER === 'vonage') {
      return this.sendWithVonage(config.to, message);
    }

    // Par défaut, simulation
    return this.simulateSMS(config.to, message);
  }

  /**
   * Envoie un SMS de notification générique
   */
  async sendNotificationSMS(phoneNumber: string, message: string): Promise<SMSResponse> {
    if (process.env.SMS_SIMULATE === 'true') {
      return this.simulateSMS(phoneNumber, message);
    }

    if (process.env.SMS_FREE_MODE === 'true') {
      return this.sendWithTextBelt(phoneNumber, message);
    }

    return this.simulateSMS(phoneNumber, message);
  }

  /**
   * Valide un numéro de téléphone
   */
  validatePhoneNumber(phoneNumber: string): boolean {
    // Regex simple pour valider les numéros internationaux
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber.replace(/\s/g, ''));
  }

  /**
   * Formate un numéro de téléphone pour l'envoi SMS
   */
  formatPhoneNumber(phoneNumber: string): string {
    // Nettoie et formate le numéro
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // Ajoute + si pas présent et que le numéro commence par un code pays
    if (!phoneNumber.startsWith('+') && cleaned.length > 10) {
      return `+${cleaned}`;
    }
    
    return phoneNumber;
  }

  /**
   * Détermine si une erreur justifie un retry
   */
  private shouldRetry(errorMessage: string): boolean {
    const retryableErrors = [
      'timeout',
      'network',
      'connection',
      'temporary',
      'rate limit',
      'server error',
      '5xx'
    ];
    
    return retryableErrors.some(error => 
      errorMessage.toLowerCase().includes(error)
    );
  }

  /**
   * Vérifie si l'erreur est une erreur de réseau
   */
  private isNetworkError(error: unknown): boolean {
    if (error && typeof error === 'object' && 'code' in error) {
      const errorCode = (error as { code: string }).code;
      if (errorCode === 'ECONNABORTED' || errorCode === 'ENOTFOUND' || errorCode === 'ECONNREFUSED') {
        return true;
      }
    }
    
    if (error && typeof error === 'object' && 'response' in error) {
      const response = (error as { response: { status: number } }).response;
      if (response && response.status >= 500) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Délai pour les retry
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => {
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      global.setTimeout(resolve, ms);
    });
  }

  /**
   * Logs détaillés pour le debugging
   */
  private logSMSAttempt(phoneNumber: string, message: string, provider: string, attempt: number): void {
    console.log(`📱 [SMS LOG] ==================`);
    console.log(`📞 À: ${phoneNumber}`);
    console.log(`🔧 Provider: ${provider}`);
    console.log(`🔄 Tentative: ${attempt}`);
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    console.log(`💬 Message: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`);
    console.log(`=====================================`);
  }

  /**
   * Logs de succès
   */
  private logSMSSuccess(phoneNumber: string, messageId: string, provider: string): void {
    console.log(`✅ [SMS SUCCESS] ==================`);
    console.log(`📞 À: ${phoneNumber}`);
    console.log(`🔧 Provider: ${provider}`);
    console.log(`🆔 Message ID: ${messageId}`);
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    console.log(`=====================================`);
  }

  /**
   * Logs d'erreur
   */
  private logSMSError(phoneNumber: string, error: string, provider: string, retryCount: number): void {
    console.log(`❌ [SMS ERROR] ==================`);
    console.log(`📞 À: ${phoneNumber}`);
    console.log(`🔧 Provider: ${provider}`);
    console.log(`🔄 Retry Count: ${retryCount}`);
    console.log(`🚫 Error: ${error}`);
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    console.log(`=====================================`);
  }
}

// Instance singleton
export const smsService = new SMSService();

// Export par défaut
export default smsService;