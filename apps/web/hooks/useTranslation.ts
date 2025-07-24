"use client";

import { useTranslation as useNextTranslation } from 'next-i18next';

export const useTranslation = () => {
  const { t, i18n } = useNextTranslation('common');
  
  const changeLanguage = (locale: string) => {
    i18n.changeLanguage(locale);
  };
  
  return {
    t,
    i18n,
    currentLocale: i18n.language,
    changeLanguage,
  };
}; 