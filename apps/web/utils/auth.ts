// Fonctions utilitaires pour gérer l'authentification

export const getToken = (): string | null => {
  if (typeof document === 'undefined') return null;
  
  // Essayer d'abord le localStorage
  const localToken = localStorage.getItem('token');
  if (localToken) {
    return localToken;
  }
  
  // Sinon essayer les cookies
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
  
  if (tokenCookie) {
    const parts = tokenCookie.split('=');
    return parts[1] || null;
  }
  
  return null;
};

export const setToken = (token: string): void => {
  if (typeof document === 'undefined') return;
  
  // Stocker dans localStorage (plus fiable)
  localStorage.setItem('token', token);
  
  // Stocker aussi dans un cookie
  document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Strict`;
};

export const removeToken = (): void => {
  if (typeof document === 'undefined') return;
  
  // Supprimer du localStorage
  localStorage.removeItem('token');
  
  // Supprimer le cookie
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  return token !== null && token !== '' && token !== 'undefined';
}; 