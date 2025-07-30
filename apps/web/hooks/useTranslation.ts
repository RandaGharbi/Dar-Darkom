"use client";

import { useTranslation as useNextTranslation } from 'next-i18next';
import { useState, useEffect } from 'react';

export const useTranslation = () => {
  const { t, i18n } = useNextTranslation('common');
  const [currentLocale, setCurrentLocale] = useState('fr');
  
  useEffect(() => {
    setCurrentLocale(i18n.language || 'fr');
  }, [i18n.language]);
  
  const changeLanguage = (locale: string) => {
    i18n.changeLanguage(locale);
    setCurrentLocale(locale);
  };
  
  return {
    t,
    i18n,
    currentLocale,
    changeLanguage,
  };
}; 