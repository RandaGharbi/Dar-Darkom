// Fonctions utilitaires de formatage
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
};

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

export const formatPercentage = (value: number): string => {
  return `${value}%`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

describe('Utils - Format', () => {
  describe('formatPrice', () => {
    it('formate un prix en euros', () => {
      // Utiliser toMatch pour gérer les espaces insécables
      expect(formatPrice(10.99)).toMatch(/10,99\s*€/);
      expect(formatPrice(0)).toMatch(/0,00\s*€/);
      expect(formatPrice(1234.56)).toMatch(/1\s*234,56\s*€/);
    });

    it('gère les nombres entiers', () => {
      expect(formatPrice(10)).toMatch(/10,00\s*€/);
    });
  });

  describe('formatDate', () => {
    it('formate une date en français', () => {
      const date = new Date('2024-01-15');
      expect(formatDate(date)).toMatch(/15 janvier 2024/);
    });

    it('gère les chaînes de date', () => {
      expect(formatDate('2024-01-15')).toMatch(/15 janvier 2024/);
    });
  });

  describe('formatPercentage', () => {
    it('ajoute le symbole pourcentage', () => {
      expect(formatPercentage(25)).toBe('25%');
      expect(formatPercentage(0)).toBe('0%');
      expect(formatPercentage(100)).toBe('100%');
    });
  });

  describe('truncateText', () => {
    it('tronque le texte si trop long', () => {
      const longText = 'Ceci est un texte très long qui doit être tronqué';
      expect(truncateText(longText, 20)).toBe('Ceci est un texte...');
    });

    it('ne tronque pas si le texte est assez court', () => {
      const shortText = 'Texte court';
      expect(truncateText(shortText, 20)).toBe('Texte court');
    });

    it('gère les textes exactement à la limite', () => {
      const exactText = 'Texte exactement à la limite';
      expect(truncateText(exactText, 30)).toBe('Texte exactement à la limite');
    });
  });
}); 