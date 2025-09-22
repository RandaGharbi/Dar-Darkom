import React from 'react';
import styled, { DefaultTheme } from 'styled-components';
import Image from 'next/image';
import { Product, Order, User } from '../../lib/api';

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
    '#1ca672': '#1ca672', // Vert reste inchangé
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

const ChartCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
    border-radius: 20px 20px 0 0;
  }
  
  &:hover {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
    border-color: rgba(59, 130, 246, 0.3);
  }
`;

const TopRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const BottomRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
`;

const FullWidthCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  grid-column: 1 / -1;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
    border-radius: 20px 20px 0 0;
  }
  
  &:hover {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
    border-color: rgba(59, 130, 246, 0.3);
  }
`;

const ChartTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 30px;
    height: 2px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    border-radius: 1px;
  }
`;

const ChartValue = styled.div`
  font-size: 2.2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #334155);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
`;

const ChartPeriod = styled.div`
  color: #64748b;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 8px;
`;

const ChartChange = styled.div`
  color: #059669;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &::before {
    content: '↗';
    font-size: 12px;
    font-weight: bold;
  }
`;

const LineChart = styled.div`
  height: 140px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(226, 232, 240, 0.5);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(59, 130, 246, 0.05) 50%, transparent 70%);
    animation: shimmer 3s infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const LinePath = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 1rem;
`;

const BarChart = styled.div`
  height: 140px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  display: flex;
  align-items: end;
  padding: 1rem;
  gap: 0.75rem;
  border: 1px solid rgba(226, 232, 240, 0.5);
`;

const Bar = styled.div<{ height: number }>`
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 6px 6px 0 0;
  width: 35px;
  height: ${props => props.height}%;
  min-height: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    transform: scaleY(1.05);
  }
`;

const CategoryLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
`;

const StatusDistribution = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const StatusItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatusBar = styled.div<{ width: number }>`
  height: 8px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 4px;
  width: ${props => props.width}%;
  margin: 0 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(90deg, #2563eb, #7c3aed);
    transform: scaleY(1.2);
  }
`;

const MonthLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
`;

const ChartsTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #475569, #64748b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 2.5rem 0 2rem 0;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 0;
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
    border-radius: 2px;
  }
`;


interface ChartsProps {
  products: Product[];
  orders: Order[];
  users: User[];
}

export const Charts = ({ products, orders, users }: ChartsProps) => {
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  // Calcul des données pour les graphiques
  const getCategoryData = () => {
    const categories = ['Skincare', 'Makeup', 'Haircare', 'Fragrance'];
    const data = categories.map(category => {
      const categoryProducts = products.filter(p => 
        p.category?.toLowerCase().includes(category.toLowerCase())
      );
      const categoryRevenue = orders.reduce((sum, order) => {
        const categoryItems = order.products?.filter(item => 
          categoryProducts.some(p => p.name === item.name)
        ) || [];
        return sum + categoryItems.reduce((itemSum, item) => itemSum + (item.price * item.qty), 0);
      }, 0);
      return { category, revenue: categoryRevenue };
    });
    return data;
  };

  const getStatusDistribution = () => {
    const statuses = ['pending', 'completed', 'cancelled'];
    const distribution = statuses.map(status => {
      const count = orders.filter(order => order.status === status).length;
      const percentage = orders.length > 0 ? (count / orders.length) * 100 : 0;
      return { status, count, percentage };
    });
    return distribution;
  };

  const categoryData = getCategoryData();
  const statusDistribution = getStatusDistribution();

  // Données pour les graphiques linéaires (simulation)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <>
      <ChartsTitle>
        Charts & Analytics
      </ChartsTitle>
      
      
      <TopRow>
        <ChartCard>
          <ChartTitle>Revenue Trends</ChartTitle>
          <ChartValue>{totalRevenue.toFixed(0)} €</ChartValue>
          <ChartPeriod>Last 12 Months</ChartPeriod>
          <ChartChange>+12%</ChartChange>
          <LineChart>
            <LinePath viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M0,80 L8,70 L16,60 L24,65 L32,50 L40,45 L48,55 L56,40 L64,35 L72,30 L80,25 L88,20 L96,15 L100,10"
                stroke="url(#gradient1)"
                strokeWidth="3"
                fill="none"
              />
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </LinePath>
          </LineChart>
          <MonthLabels>
            {months.map(month => (
              <span key={month}>{month}</span>
            ))}
          </MonthLabels>
        </ChartCard>

        <ChartCard>
          <ChartTitle>Sales by Product Category</ChartTitle>
          <ChartValue>{(totalRevenue * 0.5).toFixed(0)} €</ChartValue>
          <ChartPeriod>This Month</ChartPeriod>
          <ChartChange>+8%</ChartChange>
          <BarChart>
            {categoryData.map((item, index) => (
              <Bar 
                key={index} 
                height={item.revenue > 0 ? Math.max(20, (item.revenue / Math.max(...categoryData.map(d => d.revenue))) * 100) : 20} 
              />
            ))}
          </BarChart>
          <CategoryLabels>
            {categoryData.map(item => (
              <span key={item.category}>{item.category}</span>
            ))}
          </CategoryLabels>
        </ChartCard>

        <ChartCard>
          <ChartTitle>Order Status Distribution</ChartTitle>
          <ChartValue>{orders.length}</ChartValue>
          <ChartPeriod>This Month</ChartPeriod>
          <ChartChange>+5%</ChartChange>
          <StatusDistribution>
            {statusDistribution.map(item => (
              <StatusItem key={item.status}>
                <span style={{ textTransform: 'capitalize' }}>{item.status}</span>
                <StatusBar width={item.percentage} />
                <span>{item.count}</span>
              </StatusItem>
            ))}
          </StatusDistribution>
        </ChartCard>
      </TopRow>

      <BottomRow>
        <FullWidthCard>
          <ChartTitle>User Growth Over Time</ChartTitle>
          <ChartValue>{users.length}</ChartValue>
          <ChartPeriod>Last 12 Months</ChartPeriod>
          <ChartChange>+2%</ChartChange>
          <LineChart>
            <LinePath viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M0,90 L8,85 L16,80 L24,75 L32,70 L40,65 L48,60 L56,55 L64,50 L72,45 L80,40 L88,35 L96,30 L100,25"
                stroke="url(#gradient2)"
                strokeWidth="3"
                fill="none"
              />
              <defs>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </LinePath>
          </LineChart>
          <MonthLabels>
            {months.map(month => (
              <span key={month}>{month}</span>
            ))}
          </MonthLabels>
        </FullWidthCard>
      </BottomRow>
    </>
  );
}; 