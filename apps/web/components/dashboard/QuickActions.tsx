"use client";
import styled, { DefaultTheme } from 'styled-components';
import { useRouter } from 'next/navigation';
import React from 'react';

// Fonction pour convertir RGB en hex
const rgbToHex = (r: number, g: number, b: number) => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

// Fonction pour convertir les couleurs hexadécimales en couleurs adaptatives
const getAdaptiveColor = (color: string, theme: DefaultTheme) => {
  // Convertir RGB en hex si nécessaire
  let hexColor = color;
  if (color.startsWith('rgb(')) {
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1] ?? "0");
      const g = parseInt(rgbMatch[2] ?? "0");
      const b = parseInt(rgbMatch[3] ?? "0");
      hexColor = rgbToHex(r, g, b);
    }
  }
  
  // Couleurs sombres qui deviennent claires en mode sombre
  const darkToLightColors = {
    '#171412': '#827869', // Marron foncé → Marron gris en mode sombre
    '#000000': theme.colors.text.primary, // Noir → Blanc en mode sombre
    '#333333': theme.colors.text.primary, // Gris foncé → Blanc en mode sombre
    '#666666': theme.colors.text.primary, // Gris moyen → Blanc en mode sombre
    '#444444': theme.colors.text.primary, // Gris foncé → Blanc en mode sombre
    '#222222': theme.colors.text.primary, // Gris très foncé → Blanc en mode sombre
    '#1a1a1a': theme.colors.text.primary, // Gris très foncé → Blanc en mode sombre
    '#2d2d2d': theme.colors.text.primary, // Gris foncé → Blanc en mode sombre
    '#555555': theme.colors.text.primary, // Gris moyen → Blanc en mode sombre
    '#777777': theme.colors.text.primary, // Gris moyen → Blanc en mode sombre
    '#888888': theme.colors.text.primary, // Gris moyen → Blanc en mode sombre
    '#999999': theme.colors.text.primary, // Gris clair → Blanc en mode sombre
  };
  
  // Couleurs qui restent inchangées
  const unchangedColors = {
    '#b47b48': '#b47b48', // Marron clair reste inchangé
    '#22c55e': '#22c55e', // Vert reste vert
    '#ffffff': '#ffffff', // Blanc reste blanc
    '#f5f5f5': '#f5f5f5', // Gris très clair reste inchangé
    '#EDD9BF': '#EDD9BF', // Beige reste inchangé
    '#E8DECF': '#E8DECF', // Beige clair reste inchangé
    '#827869': '#827869', // Marron gris reste inchangé
    '#f5efe7': '#f5efe7', // Beige très clair reste inchangé
    '#e3e0de': '#e3e0de', // Gris très clair reste inchangé
  };
  
  // Vérifier d'abord les couleurs inchangées
  if (unchangedColors[hexColor as keyof typeof unchangedColors]) {
    return unchangedColors[hexColor as keyof typeof unchangedColors];
  }
  
  // Vérifier les couleurs sombres à convertir
  if (darkToLightColors[hexColor as keyof typeof darkToLightColors]) {
    return darkToLightColors[hexColor as keyof typeof darkToLightColors];
  }
  
  // Pour toute autre couleur, utiliser la couleur du thème
  return theme.colors.text.primary;
};

const ActionsRow = styled.div`
  display: flex;
  gap: 1.2rem;
  margin-bottom: 2.5rem;
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.7rem;
  }
`;

const MainButton = styled.button`
  background: #f5efe7;
  color: ${({ theme }) => getAdaptiveColor('#171412', theme)};
  border: none;
  border-radius: 8px;
  padding: 0.9rem 2rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 1px 2px #e3e0de;
  &:hover {
    background: #827869;
    color: #fff;
  }
`;

const SecondaryButton = styled.button`
  background: #f5efe7;
  color: #827869;
  border: none;
  border-radius: 8px;
  padding: 0.9rem 2rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 1px 2px #e3e0de;
  &:hover {
    background: #827869;
    color: #fff;
  }
`;

const ActionsTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: bold;
  color: ${({ theme }) => getAdaptiveColor('#171412', theme)};
  margin: 0 0 1.2rem 0;
`;

export const QuickActions = () => {
  const router = useRouter();

  return (
    <div>
      <ActionsTitle>
        Actions Rapides
      </ActionsTitle>
      <ActionsRow>
        <MainButton onClick={() => router.push('/products/addProducts')}>
          Ajouter un Produit
        </MainButton>
        <SecondaryButton onClick={() => router.push('/orders')}>
          Voir les Commandes
        </SecondaryButton>
        <SecondaryButton onClick={() => router.push('/products')}>
          Gérer l&apos;Inventaire
        </SecondaryButton>
      </ActionsRow>
    </div>
  );
}; 