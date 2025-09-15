import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

/**
 * Hook personnalisé pour gérer la navigation back de manière sécurisée
 * Évite l'erreur "GO_BACK action not handled" en vérifiant s'il y a un écran précédent
 */
export const useSafeNavigation = () => {
  const router = useRouter();
  const navigation = useNavigation();

  const safeBack = () => {
    try {
      // Vérifier s'il y a des écrans dans la pile de navigation
      if (navigation.canGoBack()) {
        router.back();
      } else {
        // Si pas d'historique, naviguer vers l'écran d'accueil
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.warn('Erreur lors de la navigation back:', error);
      // Fallback vers l'écran d'accueil en cas d'erreur
      router.replace('/(tabs)');
    }
  };

  return { safeBack };
};
