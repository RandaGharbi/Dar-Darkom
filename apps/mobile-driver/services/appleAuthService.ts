import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';
import { httpClient } from './httpClient';
import { API_CONFIG } from '../config/api';

export interface AppleAuthResult {
  success: boolean;
  user?: {
    id: string;
    email?: string;
    fullName?: {
      givenName?: string;
      familyName?: string;
    };
  };
  token?: string;
  error?: string;
}

export interface AppleSignInResponse {
  success: boolean;
  user?: {
    id: string;
    email?: string;
    name?: string;
    phone?: string;
  };
  token?: string;
  message?: string;
}

class AppleAuthService {
  private isAvailable: boolean = false;

  constructor() {
    this.checkAvailability();
  }

  private async checkAvailability() {
    if (Platform.OS === 'ios') {
      this.isAvailable = await AppleAuthentication.isAvailableAsync();
    }
  }

  /**
   * Vérifie si Apple Sign-In est disponible sur l'appareil
   */
  isAppleSignInAvailable(): boolean {
    return this.isAvailable && Platform.OS === 'ios';
  }

  /**
   * Lance le processus de connexion avec Apple
   */
  async signInWithApple(): Promise<AppleAuthResult> {
    try {
      if (!this.isAppleSignInAvailable()) {
        return {
          success: false,
          error: 'Apple Sign-In n\'est pas disponible sur cet appareil'
        };
      }

      // Demander les informations d'authentification Apple
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        return {
          success: false,
          error: 'Aucun token d\'identité reçu d\'Apple'
        };
      }

      // Envoyer les données au backend pour validation
      const response = await this.authenticateWithBackend(credential);

      if (response.success) {
        return {
          success: true,
          user: {
            id: response.user?.id || credential.user,
            email: response.user?.email || credential.email || undefined,
            fullName: {
              givenName: response.user?.name?.split(' ')[0] || undefined,
              familyName: response.user?.name?.split(' ').slice(1).join(' ') || undefined,
            }
          },
          token: response.token
        };
      } else {
        return {
          success: false,
          error: response.message || 'Erreur lors de l\'authentification avec le backend'
        };
      }
    } catch (error: any) {
      console.error('Erreur Apple Sign-In:', error);
      
      // Gérer les erreurs spécifiques d'Apple
      if (error.code === 'ERR_CANCELED') {
        return {
          success: false,
          error: 'Connexion annulée par l\'utilisateur'
        };
      }

      return {
        success: false,
        error: error.message || 'Erreur inconnue lors de la connexion Apple'
      };
    }
  }

  /**
   * Envoie les données Apple au backend pour validation et création de session
   */
  private async authenticateWithBackend(credential: AppleAuthentication.AppleAuthenticationCredential): Promise<AppleSignInResponse> {
    try {
      const response = await httpClient.post('/api/auth/apple/driver', {
        identityToken: credential.identityToken,
        authorizationCode: credential.authorizationCode,
        user: credential.user,
        email: credential.email,
        fullName: credential.fullName,
        realUserStatus: credential.realUserStatus,
      });

      return response.data;
    } catch (error: any) {
      console.error('Erreur backend Apple Auth Driver:', error);
      throw new Error('Erreur de communication avec le serveur');
    }
  }

  /**
   * Déconnecte l'utilisateur (Apple ne fournit pas de déconnexion native)
   */
  async signOut(): Promise<void> {
    // Apple ne fournit pas de méthode de déconnexion native
    // La déconnexion se fait côté application en supprimant le token local
    console.log('Déconnexion Apple - suppression du token local');
  }

  /**
   * Vérifie l'état de l'authentification Apple
   */
  async getCredentialState(userID: string): Promise<AppleAuthentication.AppleAuthenticationCredentialState> {
    try {
      if (!this.isAppleSignInAvailable()) {
        return AppleAuthentication.AppleAuthenticationCredentialState.UNKNOWN;
      }

      return await AppleAuthentication.getCredentialStateAsync(userID);
    } catch (error) {
      console.error('Erreur vérification état Apple:', error);
      return AppleAuthentication.AppleAuthenticationCredentialState.UNKNOWN;
    }
  }
}

// Instance singleton
export const appleAuthService = new AppleAuthService();
export default appleAuthService;
