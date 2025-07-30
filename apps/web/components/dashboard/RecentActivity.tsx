import React, { useState, useEffect, useMemo } from 'react';
import styled, { DefaultTheme, keyframes, css } from "styled-components";
import { Product, Order, User } from "../../lib/api";
import { ShoppingCart, UserPlus, Package, AlertTriangle, Star, DollarSign, Users, RefreshCw, Activity } from "lucide-react";

// Animation pour les nouvelles activités
const slideInFromTop = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
`;

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
  position: relative;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const ActivityTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: bold;
  color: ${({ theme }) => getAdaptiveColor('#171412', theme)};
  margin: 0;
`;

const RefreshButton = styled.button<{ $isRefreshing: boolean }>`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  svg {
    ${({ $isRefreshing }) => $isRefreshing && css`animation: ${pulse} 1s infinite;`}
  }
`;

const TimelineContainer = styled.div`
  position: relative;
  padding-left: 2rem;
`;

const ActivityItem = styled.div<{ $isNew?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 0;
  position: relative;
  animation: ${({ $isNew }) => $isNew ? css`${slideInFromTop} 0.5s ease-out` : 'none'};
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(5px);
  }

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

const ActivityIcon = styled.div<{ $type: string; $isNew?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ $type }) => {
    switch ($type) {
      case 'order': return '#EDD9BF';
      case 'user': return '#E8DECF';
      case 'product': return '#F5F5F5';
      case 'alert': return '#FEF3C7';
      case 'trending': return '#DBEAFE';
      case 'revenue': return '#D1FAE5';
      case 'new': return '#FEF3C7';
      default: return '#EDD9BF';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $type, theme }) => {
    switch ($type) {
      case 'order': return getAdaptiveColor('#171412', theme);
      case 'user': return getAdaptiveColor('#171412', theme);
      case 'product': return getAdaptiveColor('#171412', theme);
      case 'alert': return '#D97706';
      case 'trending': return '#2563EB';
      case 'revenue': return '#059669';
      case 'new': return '#D97706';
      default: return getAdaptiveColor('#171412', theme);
    }
  }};
  border: 3px solid ${({ $type }) => {
    switch ($type) {
      case 'order': return '#E8DECF';
      case 'user': return '#F5F5F5';
      case 'product': return '#EDD9BF';
      case 'alert': return '#FDE68A';
      case 'trending': return '#BFDBFE';
      case 'revenue': return '#A7F3D0';
      case 'new': return '#FDE68A';
      default: return '#E8DECF';
    }
  }};
  z-index: 1;
  position: relative;
  transition: all 0.3s ease;

  ${({ $isNew }) => $isNew && css`
    animation: ${pulse} 2s infinite;
    box-shadow: 0 0 10px rgba(217, 119, 6, 0.3);
  `}
`;

const ActivityContent = styled.div`
  flex: 1;
  padding-top: 0.5rem;
`;

const ActivityTime = styled.div`
  font-size: 0.85rem;
  color: #827869;
`;

const ActivityItemTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => getAdaptiveColor('#171412', theme)};
  margin-bottom: 0.2rem;
  font-size: 0.95rem;
`;

const ActivityDescription = styled.div`
  font-size: 0.85rem;
  color: #827869;
  margin-top: 0.2rem;
`;

const LiveIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #059669;
  margin-bottom: 1rem;
`;

const LiveDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #059669;
  animation: ${css`${pulse} 2s infinite`};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

interface ActivityItemType {
  id: string;
  icon: React.ReactNode;
  title: string;
  description?: string;
  time: string;
  type: 'order' | 'user' | 'product' | 'alert' | 'trending' | 'revenue' | 'new';
  timestamp: Date;
  isNew?: boolean;
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [, setLastUpdate] = useState(new Date());
  const [newActivities, setNewActivities] = useState<Set<string>>(new Set());

  // Mise à jour automatique toutes les 30 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return "À l'instant";
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""}`;
    if (diffInHours < 24) return `Il y a ${diffInHours} heure${diffInHours > 1 ? "s" : ""}`;
    return `Il y a ${diffInDays} jour${diffInDays > 1 ? "s" : ""}`;
  };

  // Génération de l'activité récente basée sur les vraies données
  const generateRecentActivity = useMemo((): ActivityItemType[] => {
    const activities: ActivityItemType[] = [];

    // Si les données sont vides, utiliser des données de test
    if (!products.length && !orders.length && !users.length) {
      return [
        {
          id: 'test-1',
          icon: <ShoppingCart size={18} />,
          title: "Nouvelle commande #12345",
          description: "Commande de 3 articles - Total: 89.99€",
          time: "Il y a 5 minutes",
          type: 'order',
          timestamp: new Date(Date.now() - 5 * 60 * 1000)
        },
        {
          id: 'test-2',
          icon: <UserPlus size={18} />,
          title: "Nouvel utilisateur inscrit",
          description: "Marie Dupont (marie.dupont@email.com)",
          time: "Il y a 1 heure",
          type: 'user',
          timestamp: new Date(Date.now() - 60 * 60 * 1000)
        },
        {
          id: 'test-3',
          icon: <Star size={18} />,
          title: "Produit populaire",
          description: "Crème Hydratante - 45.99€",
          time: "Il y a 2 heures",
          type: 'trending',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: 'test-4',
          icon: <AlertTriangle size={18} />,
          title: "Alerte stock faible",
          description: "Parfum Jicky - Réapprovisionnement nécessaire",
          time: "Il y a 3 heures",
          type: 'alert',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
        },
        {
          id: 'test-5',
          icon: <DollarSign size={18} />,
          title: "Revenus moyens",
          description: "67.50€ par commande",
          time: "Il y a 4 heures",
          type: 'revenue',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
        },
        {
          id: 'test-6',
          icon: <Package size={18} />,
          title: "Produit mis à jour",
          description: "Sérum Anti-âge - Informations actualisées",
          time: "Il y a 5 heures",
          type: 'product',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)
        }
      ];
    }

    // Commandes récentes
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);

    recentOrders.forEach((order) => {
      // Calculer le nombre total d'articles dans la commande
      const totalItems = order.products?.reduce((sum, product) => sum + (product.qty || 0), 0) || 0;
      
      activities.push({
        id: `order-${order._id}`,
        icon: <ShoppingCart size={18} />,
        title: `Nouvelle commande #${order._id.slice(-8)}`,
        description: `${totalItems} article${totalItems > 1 ? 's' : ''} - Total: ${order.total.toFixed(2)}€`,
        time: getTimeAgo(new Date(order.createdAt)),
        type: 'order',
        timestamp: new Date(order.createdAt)
      });
    });

    // Utilisateurs récents (exclure l'admin)
    const recentUsers = users
      .filter(user => user.role !== 'admin')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 2);

    recentUsers.forEach((user) => {
      activities.push({
        id: `user-${user._id}`,
        icon: <UserPlus size={18} />,
        title: `Nouvel utilisateur inscrit`,
        description: `${user.name} (${user.email})`,
        time: getTimeAgo(new Date(user.createdAt)),
        type: 'user',
        timestamp: new Date(user.createdAt)
      });
    });

    // Produits populaires (basé sur le prix comme indicateur de popularité)
    const popularProducts = products
      .sort((a, b) => b.price - a.price)
      .slice(0, 1);

    popularProducts.forEach((product) => {
      activities.push({
        id: `product-${product._id}`,
        icon: <Star size={18} />,
        title: `Produit populaire`,
        description: `${product.name} - ${product.price}€`,
        time: getTimeAgo(new Date(product.createdAt)),
        type: 'trending',
        timestamp: new Date(product.createdAt)
      });
    });

    // Alertes de stock faible
    const lowStockProducts = products
      .filter((product) => product.price > 80)
      .slice(0, 1);

    lowStockProducts.forEach((product) => {
      activities.push({
        id: `alert-${product._id}`,
        icon: <AlertTriangle size={18} />,
        title: `Alerte stock faible`,
        description: `${product.name} - Réapprovisionnement nécessaire`,
        time: getTimeAgo(new Date(product.createdAt)),
        type: 'alert',
        timestamp: new Date(product.createdAt)
      });
    });

    // Revenus (simulation basée sur les commandes)
    if (orders.length > 0 && orders[0]) {
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      const avgRevenue = totalRevenue / orders.length;
      
      activities.push({
        id: 'revenue-stats',
        icon: <DollarSign size={18} />,
        title: `Revenus moyens`,
        description: `${avgRevenue.toFixed(2)}€ par commande`,
        time: getTimeAgo(new Date(orders[0].createdAt)),
        type: 'revenue',
        timestamp: new Date(orders[0].createdAt)
      });
    }

    // Produits récemment mis à jour
    const recentProducts = products
      .filter(product => product.updatedAt)
      .sort((a, b) => {
        const dateA = new Date(a.updatedAt).getTime();
        const dateB = new Date(b.updatedAt).getTime();
        return dateB - dateA;
      })
      .slice(0, 1);

    recentProducts.forEach((product) => {
      activities.push({
        id: `update-${product._id}`,
        icon: <Package size={18} />,
        title: `Produit mis à jour`,
        description: `${product.name} - Informations actualisées`,
        time: getTimeAgo(new Date(product.updatedAt)),
        type: 'product',
        timestamp: new Date(product.updatedAt)
      });
    });

    // Statistiques utilisateurs (exclure l'admin)
    const regularUsers = users.filter(user => user.role !== 'admin');
    if (regularUsers.length > 0) {
      const activeUsers = regularUsers.filter(user => user.status === 'Active').length;
      const firstUser = regularUsers[0];
      if (firstUser) {
        activities.push({
          id: 'user-stats',
          icon: <Users size={18} />,
          title: `Utilisateurs actifs`,
          description: `${activeUsers}/${regularUsers.length} utilisateurs actifs`,
          time: getTimeAgo(new Date(firstUser.createdAt)),
          type: 'user',
          timestamp: new Date(firstUser.createdAt)
        });
      }
    }

    // Trier par date et prendre les 6 plus récentes
    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 6)
      .map(activity => ({
        ...activity,
        time: getTimeAgo(activity.timestamp),
        isNew: newActivities.has(activity.id)
      }));
  }, [products, orders, users, newActivities]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simuler un délai de rafraîchissement
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdate(new Date());
    setIsRefreshing(false);
  };

  // Détecter les nouvelles activités
  useEffect(() => {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    
    const newActivityIds = generateRecentActivity
      .filter(activity => activity.timestamp > fiveMinutesAgo)
      .map(activity => activity.id);
    
    if (newActivityIds.length > 0) {
      setNewActivities(new Set(newActivityIds));
      
      // Retirer l'indicateur "nouveau" après 10 secondes
      setTimeout(() => {
        setNewActivities(new Set());
      }, 10000);
    }
  }, [generateRecentActivity]); // generateRecentActivity est stable depuis useMemo

  const recentActivity = generateRecentActivity;

  return (
    <ActivityCard>
      <HeaderContainer>
        <ActivityTitle>
          Activité Récente
        </ActivityTitle>
        <RefreshButton 
          onClick={handleRefresh} 
          $isRefreshing={isRefreshing}
          title="Actualiser les activités"
        >
          <RefreshCw size={16} />
        </RefreshButton>
      </HeaderContainer>

      {recentActivity.length > 0 && (
        <LiveIndicator>
          <LiveDot />
          <span>En direct</span>
        </LiveIndicator>
      )}

      <TimelineContainer>
        {recentActivity.length === 0 ? (
          <EmptyState>
            <Activity size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
            <p>Aucune activité récente</p>
            <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Les nouvelles activités apparaîtront ici
            </p>
          </EmptyState>
        ) : (
          recentActivity.map((activity) => (
            <ActivityItem key={activity.id} $isNew={activity.isNew}>
              <ActivityIcon $type={activity.type} $isNew={activity.isNew}>
                {activity.icon}
              </ActivityIcon>
              <ActivityContent>
                <ActivityItemTitle>{activity.title}</ActivityItemTitle>
                {activity.description && (
                  <ActivityDescription>{activity.description}</ActivityDescription>
                )}
                <ActivityTime>{activity.time}</ActivityTime>
              </ActivityContent>
            </ActivityItem>
          ))
        )}
      </TimelineContainer>
    </ActivityCard>
  );
};
