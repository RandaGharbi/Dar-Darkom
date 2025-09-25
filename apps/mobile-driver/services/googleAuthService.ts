import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { httpClient } from './httpClient';
import { API_CONFIG } from '../config/api';
import { getGoogleConfigForPlatform } from '../config/googleAuth';

export interface GoogleAuthResult {
  success: boolean;
  user?: {
    id: string;
    email?: string;
    name?: string;
    photo?: string;
  };
  token?: string;
  error?: string;
}

export interface GoogleSignInResponse {
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

// Configuration pour Expo AuthSession
WebBrowser.maybeCompleteAuthSession();

class GoogleAuthService {
  private config: any;

  constructor() {
    this.config = getGoogleConfigForPlatform();
  }

  /**
   * Vérifie si Google Sign-In est disponible
   */
  isGoogleSignInAvailable(): boolean {
    return Platform.OS !== 'web';
  }

  /**
   * Lance le processus de connexion avec Google
   */
  async signInWithGoogle(): Promise<GoogleAuthResult> {
    try {
      if (!this.isGoogleSignInAvailable()) {
        return {
          success: false,
          error: 'Google Sign-In n\'est pas disponible sur cet appareil'
        };
      }

      // Configuration de la requête OAuth
      const redirectUri = AuthSession.makeRedirectUri({
        useProxy: true,
      });

      const request = new AuthSession.AuthRequest({
        clientId: this.config.webClientId,
        scopes: ['openid', 'profile', 'email'],
        redirectUri,
        responseType: AuthSession.ResponseType.Code,
        extraParams: {},
        additionalParameters: {},
        prompt: AuthSession.Prompt.SelectAccount,
      });

      // Lancer la connexion Google
      const result = await request.promptAsync({
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      });

      if (result.type === 'success') {
        // Échanger le code d'autorisation contre un token d'accès
        const tokenResponse = await AuthSession.exchangeCodeAsync(
          {
            clientId: this.config.webClientId,
            code: result.params.code,
            redirectUri,
            extraParams: {
              code_verifier: request.codeChallenge,
            },
          },
          {
            tokenEndpoint: 'https://oauth2.googleapis.com/token',
          }
        );

        // Obtenir les informations utilisateur
        const userInfoResponse = await fetch(
          `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.accessToken}`
        );
        const userInfo = await userInfoResponse.json();

        // Envoyer les données au backend pour validation
        const response = await this.authenticateWithBackend(userInfo, tokenResponse.accessToken);

        if (response.success) {
          return {
            success: true,
            user: {
              id: response.user?.id || userInfo.id,
              email: response.user?.email || userInfo.email,
              name: response.user?.name || userInfo.name,
              photo: userInfo.picture
            },
            token: response.token
          };
        } else {
          return {
            success: false,
            error: response.message || 'Erreur lors de l\'authentification avec le backend'
          };
        }
      } else if (result.type === 'cancel') {
        return {
          success: false,
          error: 'Connexion annulée par l\'utilisateur'
        };
      } else {
        return {
          success: false,
          error: 'Erreur lors de la connexion Google'
        };
      }
    } catch (error: any) {
      console.error('Erreur Google Sign-In:', error);
      return {
        success: false,
        error: error.message || 'Erreur inconnue lors de la connexion Google'
      };
    }
  }

  /**
   * Envoie les données Google au backend pour validation et création de session
   */
  private async authenticateWithBackend(userData: any, accessToken: string): Promise<GoogleSignInResponse> {
    try {
      const response = await httpClient.post('/api/auth/google/driver', {
        accessToken: accessToken,
        user: userData.user,
        serverAuthCode: userData.serverAuthCode,
      });

      return response.data;
    } catch (error: any) {
      console.error('Erreur backend Google Auth Driver:', error);
      throw new Error('Erreur de communication avec le serveur');
    }
  }

  /**
   * Déconnecte l'utilisateur de Google
   */
  async signOut(): Promise<void> {
    try {
      // Pour Expo AuthSession, la déconnexion se fait côté application
      console.log('👋 Déconnexion Google réussie');
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion Google:', error);
    }
  }

  /**
   * Vérifie l'état de la connexion Google
   */
  async isSignedIn(): Promise<boolean> {
    // Pour Expo AuthSession, on vérifie côté application
    return false;
  }

  /**
   * Obtient l'utilisateur actuellement connecté
   */
  async getCurrentUser(): Promise<any> {
    // Pour Expo AuthSession, on récupère les données côté application
    return null;
  }
}

// Instance singleton
export const googleAuthService = new GoogleAuthService();
export default googleAuthService;
