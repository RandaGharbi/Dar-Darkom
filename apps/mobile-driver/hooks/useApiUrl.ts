import { useState, useEffect } from 'react';
import { getBaseUrl } from '../config/env';

export const useApiUrl = () => {
  const [apiUrl, setApiUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadApiUrl();
  }, []);

  const loadApiUrl = async () => {
    try {
      setIsLoading(true);
      const url = await getBaseUrl();
      setApiUrl(url);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'URL API:', error);
      // Fallback vers l'URL par défaut
      setApiUrl('http://localhost:5000');
    } finally {
      setIsLoading(false);
    }
  };

  const updateApiUrl = (newUrl: string) => {
    setApiUrl(newUrl);
  };

  return {
    apiUrl,
    isLoading,
    updateApiUrl,
    reloadApiUrl: loadApiUrl,
  };
}; 