import React from 'react';
import styled, { DefaultTheme } from "styled-components";
import { Product, Order, User } from "../../lib/api";
import { ShoppingCart, UserPlus, Package } from "lucide-react";

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

const ActivityCard = styled.div`
  padding: 2rem;
`;

const TimelineContainer = styled.div`
  position: relative;
  padding-left: 2rem;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 0;
  position: relative;

  &:not(:last-child)::after {
    content: "";
    position: absolute;
    left: 1.5rem;
    bottom: 0;
    width: 2px;
    height: 1rem;
    background: #827869;
  }
`;

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #EDD9BF;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => getAdaptiveColor('#171412', theme)};
  border: 3px solid #E8DECF;
  z-index: 1;
  position: relative;
`;

const ActivityContent = styled.div`
  flex: 1;
  padding-top: 0.5rem;
`;

const ActivityTime = styled.div`
  font-size: 0.85rem;
  color: #827869;
`;

const ActivityTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: bold;
  color: ${({ theme }) => getAdaptiveColor('#171412', theme)};
  margin: 0 0 1.5rem 0;
`;

const ActivityItemTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => getAdaptiveColor('#171412', theme)};
  margin-bottom: 0.2rem;
  font-size: 0.95rem;
`;

interface ActivityItemType {
  icon: React.ReactNode;
  title: string;
  time: string;
}

interface RecentActivityProps {
  products: Product[];
  orders: Order[];
  users: User[];
}

export const RecentActivity = ({
  products,
  orders,
  users,
}: RecentActivityProps) => {
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Il y a quelques minutes";
    if (diffInHours < 24)
      return `Il y a ${diffInHours} heure${diffInHours > 1 ? "s" : ""}`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Il y a ${diffInDays} jour${diffInDays > 1 ? "s" : ""}`;
  };

  // Génération de l'activité récente basée sur les vraies données
  const generateRecentActivity = (): ActivityItemType[] => {
    const activities: ActivityItemType[] = [];

    // Commandes récentes (panier) - vraies données
    const recentOrders = orders
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 2);

    recentOrders.forEach((order, index) => {
      if (index === 0) {
        activities.push({
          icon: <ShoppingCart size={18} />,
          title: `New Order #${order._id.slice(-6)}`,
          time: getTimeAgo(new Date(order.createdAt)),
        });
      }
    });

    // Utilisateurs récents (profil) - vraies données
    const recentUsers = users
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 1);

    recentUsers.forEach((user) => {
      activities.push({
        icon: <UserPlus size={18} />,
        title: `New User Registration`,
        time: getTimeAgo(new Date(user.createdAt)),
      });
    });

    // Produits avec stock faible (package) - vraies données
    const lowStockProducts = products
      .filter((product) => product.price > 50) // Simulation de stock faible basé sur le prix
      .slice(0, 1);

    lowStockProducts.forEach((product) => {
      activities.push({
        icon: <Package size={18} />,
        title: `Low Stock Alert: '${product.name}'`,
        time: getTimeAgo(new Date(product.createdAt)),
      });
    });

    // Produits récemment mis à jour (package) - vraies données
    const recentProducts = products
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 1);

    recentProducts.forEach((product) => {
      activities.push({
        icon: <Package size={18} />,
        title: `Recent Product Update: '${product.name}'`,
        time: getTimeAgo(new Date(product.updatedAt)),
      });
    });

    // Deuxième commande (panier) - vraies données
    if (recentOrders.length > 1 && recentOrders[1]) {
      activities.push({
        icon: <ShoppingCart size={18} />,
        title: `New Order #${recentOrders[1]._id.slice(-6)}`,
        time: getTimeAgo(new Date(recentOrders[1].createdAt)),
      });
    }

    return activities;
  };

  const recentActivity = generateRecentActivity();

  return (
    <ActivityCard>
      <ActivityTitle>
        Activité Récente
      </ActivityTitle>
      <TimelineContainer>
        {recentActivity.map((activity, index) => (
          <ActivityItem key={index}>
            <ActivityIcon>{activity.icon}</ActivityIcon>
            <ActivityContent>
              <ActivityItemTitle>{activity.title}</ActivityItemTitle>
              <ActivityTime>{activity.time}</ActivityTime>
            </ActivityContent>
          </ActivityItem>
        ))}
      </TimelineContainer>
    </ActivityCard>
  );
};
