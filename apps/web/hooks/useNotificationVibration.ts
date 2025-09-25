import { useCallback } from 'react';

export const useNotificationVibration = () => {
  const vibrate = useCallback((pattern?: number | number[]) => {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern || 200);
      } catch (error) {
      }
    }
  }, []);

  const vibrateNotification = useCallback(() => {
    vibrate([100, 50, 100]); // Pattern court pour les notifications
  }, [vibrate]);

  const vibrateSuccess = useCallback(() => {
    vibrate([50, 100, 50]); // Pattern différent pour les succès
  }, [vibrate]);

  const vibrateError = useCallback(() => {
    vibrate([200, 100, 200, 100, 200]); // Pattern plus long pour les erreurs
  }, [vibrate]);

  return {
    vibrate,
    vibrateNotification,
    vibrateSuccess,
    vibrateError,
  };
}; 