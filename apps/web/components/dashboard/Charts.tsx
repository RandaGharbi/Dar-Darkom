import React from 'react';
import styled, { DefaultTheme } from 'styled-components';
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
  border: 1px solid #E8DECF;
  border-radius: 16px;
  padding: 2rem;
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
  border: 1px solid #E8DECF;
  border-radius: 16px;
  padding: 2rem;
  grid-column: 1 / -1;
`;

const ChartTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => getAdaptiveColor('#171412', theme)};
  margin-bottom: 1rem;
`;

const ChartValue = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: ${({ theme }) => getAdaptiveColor('#171412', theme)};
  margin-bottom: 0.5rem;
`;

const ChartPeriod = styled.div`
  color: #827869;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const ChartChange = styled.div`
  color: #1ca672;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
`;

const LineChart = styled.div`
  height: 120px;
  background: linear-gradient(135deg, #EDD9BF 0%, #E8DECF 100%);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(130, 119, 105, 0.1) 50%, transparent 70%);
    animation: shimmer 2s infinite;
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
  height: 120px;
  background: linear-gradient(135deg, #EDD9BF 0%, #E8DECF 100%);
  border-radius: 8px;
  display: flex;
  align-items: end;
  padding: 1rem;
  gap: 0.5rem;
`;

const Bar = styled.div<{ height: number }>`
  background: #827869;
  border-radius: 4px 4px 0 0;
  width: 30px;
  height: ${props => props.height}%;
  min-height: 20px;
`;

const CategoryLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-size: 0.8rem;
  color: #827869;
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
  background: #827869;
  border-radius: 4px;
  width: ${props => props.width}%;
  margin: 0 1rem;
`;

const MonthLabels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-size: 0.7rem;
  color: #827869;
`;

const ChartsTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: bold;
  color: ${({ theme }) => getAdaptiveColor('#171412', theme)};
  margin: 2.5rem 0 1.2rem 0;
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
                stroke="#827869"
                strokeWidth="2"
                fill="none"
              />
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
                stroke="#827869"
                strokeWidth="2"
                fill="none"
              />
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