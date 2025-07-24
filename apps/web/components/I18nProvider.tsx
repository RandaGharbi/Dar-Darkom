"use client";
import React, { Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

// Composant de chargement simple
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontSize: '16px'
  }}>
    Chargement...
  </div>
);

export const I18nProvider = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingFallback />}>
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  </Suspense>
); 