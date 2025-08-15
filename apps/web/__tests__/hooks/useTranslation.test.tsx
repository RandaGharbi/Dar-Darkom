import { renderHook } from '@testing-library/react';
import { useTranslation } from '../../hooks/useTranslation';

// Mock pour i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'fr',
      changeLanguage: jest.fn(),
    },
  }),
}));

describe('useTranslation', () => {
  it('retourne les fonctions de traduction', () => {
    const { result } = renderHook(() => useTranslation());
    
    expect(result.current.t).toBeDefined();
    expect(typeof result.current.t).toBe('function');
    expect(result.current.i18n).toBeDefined();
    expect(result.current.i18n.language).toBe('fr');
  });

  it('traduit les clés correctement', () => {
    const { result } = renderHook(() => useTranslation());
    
    const translated = result.current.t('common.welcome');
    expect(translated).toBe('common.welcome');
  });
}); 