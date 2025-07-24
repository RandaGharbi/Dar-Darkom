"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { TrendingUp, BarChart3, PieChart, Loader2 } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { ordersAPI, productsAPI } from '../../lib/api';
import { useTranslation } from '../../hooks/useTranslation';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  
  @media (max-width: 768px) {
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

const Section = styled.div`
  background: #f5efe7;
  border-radius: 16px;
  padding: 2.2rem 2rem 1.7rem 2rem;
  box-shadow: 0 2px 8px 0 #e9e9e9;
  margin-bottom: 2.5rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem 1.5rem 1.2rem 1.5rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem 1rem 0.8rem 1rem;
    margin-bottom: 1rem;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    margin-bottom: 1.2rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`;

const SectionIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5efe7;
  color: #bfa77a;
  
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }
  
  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 500;
  color: #827869;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const MetricCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    margin-bottom: 1.2rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`;

const MetricValue = styled.div`
  display: flex;
  flex-direction: column;
`;

const Value = styled.span`
  font-size: 2.2rem;
  font-weight: bold;
  color: #171412;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Change = styled.span<{ $positive: boolean }>`
  font-size: 1rem;
  color: #1ca672;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const PeriodTabs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    margin-bottom: 0.8rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 0.6rem;
  }
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  background: ${props => props.$active ? '#1a1a1a' : '#f3f4f6'};
  color: ${props => props.$active ? 'white' : '#666'};
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  text-align: left;
  width: 100%;

  &:hover {
    background: ${props => props.$active ? '#1a1a1a' : '#e5e7eb'};
  }
  
  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.3rem 0.6rem;
    font-size: 0.75rem;
  }
`;

const ChartContainer = styled.div`
  height: 300px;
  margin-top: 1rem;
  
  @media (max-width: 768px) {
    height: 250px;
    margin-top: 0.8rem;
  }
  
  @media (max-width: 480px) {
    height: 200px;
    margin-top: 0.6rem;
  }
`;

// Composant de chargement
const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #bfa77a;
`;

// Composant d'erreur
const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #dc2626;
  font-size: 0.9rem;
`;

export function SalesReports() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const [salesPeriod, setSalesPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [productPeriod, setProductPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [categoryPeriod, setCategoryPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  // Récupérer toutes les commandes et produits
  const { data: orders, isLoading: ordersLoading, error: ordersError } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersAPI.getAll().then(res => res.data),
  });
  const { data: products, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsAPI.getAll().then(res => res.data),
  });

  // Calculs dynamiques
  // 1. Sales Trends (par mois)
  const salesData = (() => {
    if (!orders) return [];
    const map = new Map();
    orders.forEach(order => {
      if (!order.createdAt) return;
      const date = new Date(order.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!map.has(key)) map.set(key, { sales: 0, orders: 0 });
      map.get(key).sales += order.total;
      map.get(key).orders += 1;
    });
    return Array.from(map.entries()).map(([month, data]) => ({ month, ...data })).sort((a, b) => a.month.localeCompare(b.month));
  })();

  const last30DaysSales = (() => {
    if (!orders) return 0;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return orders
      .filter(order => new Date(order.createdAt) >= thirtyDaysAgo)
      .reduce((sum, order) => sum + order.total, 0);
  })();


  const last30DaysProductSales = (() => {
    if (!orders) return 0;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const productSales = new Map();
    orders
      .filter(order => new Date(order.createdAt) >= thirtyDaysAgo)
      .forEach(order => {
        order.products.forEach(prod => {
          if (!productSales.has(prod.name)) productSales.set(prod.name, 0);
          productSales.set(prod.name, productSales.get(prod.name) + (prod.price * prod.qty));
        });
      });
    return Array.from(productSales.values()).reduce((sum, sales) => sum + sales, 0);
  })();

  // Calcul des ventes par catégorie des 30 derniers jours
  const last30DaysCategorySales = (() => {
    if (!orders || !products) return 0;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const prodMap = new Map(products.map(p => [p.name, p.category || 'Unknown']));
    const categorySales = new Map();
    
    orders
      .filter(order => new Date(order.createdAt) >= thirtyDaysAgo)
      .forEach(order => {
        order.products.forEach(prod => {
          const category = prodMap.get(prod.name) || 'Unknown';
          if (!categorySales.has(category)) categorySales.set(category, 0);
          categorySales.set(category, categorySales.get(category) + (prod.price * prod.qty));
        });
      });
    
    return Array.from(categorySales.values()).reduce((sum, sales) => sum + sales, 0);
  })();

  // Calcul des pourcentages de croissance (simulation basée sur les données)
  const salesGrowthPercentage = (() => {
    if (!orders) return 15;
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const previous30Days = orders
      .filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= sixtyDaysAgo && orderDate < thirtyDaysAgo;
      })
      .reduce((sum, order) => sum + order.total, 0);
    
    const current30Days = last30DaysSales;
    
    if (previous30Days === 0) return 0;
    return Math.round(((current30Days - previous30Days) / previous30Days) * 100);
  })();

  const productGrowthPercentage = (() => {
    if (!orders) return 10;
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const previous30Days = (() => {
      const productSales = new Map();
      orders
        .filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= sixtyDaysAgo && orderDate < thirtyDaysAgo;
        })
        .forEach(order => {
          order.products.forEach(prod => {
            if (!productSales.has(prod.name)) productSales.set(prod.name, 0);
            productSales.set(prod.name, productSales.get(prod.name) + (prod.price * prod.qty));
          });
        });
      return Array.from(productSales.values()).reduce((sum, sales) => sum + sales, 0);
    })();
    
    const current30Days = last30DaysProductSales;
    
    if (previous30Days === 0) return 0;
    return Math.round(((current30Days - previous30Days) / previous30Days) * 100);
  })();

  const categoryGrowthPercentage = (() => {
    if (!orders || !products) return 5;
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const previous30Days = (() => {
      const prodMap = new Map(products.map(p => [p.name, p.category || 'Unknown']));
      const categorySales = new Map();
      
      orders
        .filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= sixtyDaysAgo && orderDate < thirtyDaysAgo;
        })
        .forEach(order => {
          order.products.forEach(prod => {
            const category = prodMap.get(prod.name) || 'Unknown';
            if (!categorySales.has(category)) categorySales.set(category, 0);
            categorySales.set(category, categorySales.get(category) + (prod.price * prod.qty));
          });
        });
      
      return Array.from(categorySales.values()).reduce((sum, sales) => sum + sales, 0);
    })();
    
    const current30Days = last30DaysCategorySales;
    
    if (previous30Days === 0) return 0;
    return Math.round(((current30Days - previous30Days) / previous30Days) * 100);
  })();

  // 2. Top produits (par ventes)
  const productData = (() => {
    if (!orders) return [];
    const map = new Map();
    orders.forEach(order => {
      order.products.forEach(prod => {
        if (!map.has(prod.name)) map.set(prod.name, { sales: 0, qty: 0 });
        map.get(prod.name).sales += prod.price * prod.qty;
        map.get(prod.name).qty += prod.qty;
      });
    });
    return Array.from(map.entries())
      .map(([product, data]) => ({ product, ...data }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10);
  })();

  // 3. Catégories (par ventes)
  const categoryData = (() => {
    if (!orders || !products) return [];
    const prodMap = new Map(products.map(p => [p.name, p.category || 'Unknown']));
    const map = new Map();
    orders.forEach(order => {
      order.products.forEach(prod => {
        const category = prodMap.get(prod.name) || 'Unknown';
        if (!map.has(category)) map.set(category, { sales: 0, qty: 0 });
        map.get(category).sales += prod.price * prod.qty;
        map.get(category).qty += prod.qty;
      });
    });
    return Array.from(map.entries())
      .map(([category, data]) => ({ category, ...data }))
      .sort((a, b) => b.sales - a.sales);
  })();

  return (
    <Container>
      {/* Sales Trends */}
      <Section>
        <SectionHeader>
          <SectionIcon>
            <TrendingUp size={20} />
          </SectionIcon>
          <SectionTitle>{mounted ? t('analytics.sales.title') : ""}</SectionTitle>
        </SectionHeader>
        
        <MetricCard>
          <MetricValue>
            <Value>€{last30DaysSales.toLocaleString()}</Value>
            <Change $positive={salesGrowthPercentage >= 0}>
              <TrendingUp size={14} />
              Last 30 Days {salesGrowthPercentage >= 0 ? '+' : ''}{salesGrowthPercentage}%
            </Change>
          </MetricValue>
        </MetricCard>

        <PeriodTabs>
          <Tab $active={salesPeriod === 'daily'} onClick={() => setSalesPeriod('daily')}>
            Daily
          </Tab>
          <Tab $active={salesPeriod === 'weekly'} onClick={() => setSalesPeriod('weekly')}>
            Weekly
          </Tab>
          <Tab $active={salesPeriod === 'monthly'} onClick={() => setSalesPeriod('monthly')}>
            Monthly
          </Tab>
        </PeriodTabs>

        <ChartContainer>
          {ordersLoading || productsLoading ? (
            <LoadingSpinner>
              <Loader2 size={24} className="animate-spin" />
            </LoadingSpinner>
          ) : ordersError || productsError ? (
            <ErrorMessage>
              Erreur lors du chargement des données de ventes
            </ErrorMessage>
          ) : salesData && salesData.length > 0 ? (
            <div style={{ 
              display: 'flex', 
              alignItems: 'end', 
              gap: '2rem', 
              height: '100%', 
              padding: '1rem',
              background: '#f8f9fa',
              borderRadius: '8px'
            }}>
              {salesData.map((item, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                flex: 1,
                position: 'relative'
              }}>
                <div style={{
                  width: '100%',
                  height: `${salesData.length > 0 ? (item.sales / Math.max(...salesData.map(d => d.sales))) * 200 : 0}px`,
                  background: 'linear-gradient(to top, #bfa77a, #e5d3b3)',
                  borderRadius: '4px 4px 0 0',
                  position: 'relative',
                  minHeight: '20px'
                }}>
                </div>
                <div style={{
                  marginTop: '12px',
                  fontSize: '0.75rem',
                  color: '#666',
                  textAlign: 'center',
                  whiteSpace: 'nowrap'
                }}>
                  {item.month}
                </div>
              </div>
            ))}
            </div>
          ) : (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%', 
              padding: '1rem',
              background: '#f8f9fa',
              borderRadius: '8px',
              color: '#666'
            }}>
              Aucune donnée disponible
            </div>
          )}
        </ChartContainer>
      </Section>

      {/* Product Performance */}
      <Section>
        <SectionHeader>
          <SectionIcon>
            <BarChart3 size={20} />
          </SectionIcon>
          <SectionTitle>{mounted ? t('analytics.products.title') : ""}</SectionTitle>
        </SectionHeader>
        
        <MetricCard>
          <MetricValue>
            <Value>€{last30DaysProductSales.toLocaleString()}</Value>
            <Change $positive={productGrowthPercentage >= 0}>
              <TrendingUp size={14} />
              Last 30 Days {productGrowthPercentage >= 0 ? '+' : ''}{productGrowthPercentage}%
            </Change>
          </MetricValue>
        </MetricCard>

        <PeriodTabs>
          <Tab $active={productPeriod === 'daily'} onClick={() => setProductPeriod('daily')}>
            Daily
          </Tab>
          <Tab $active={productPeriod === 'weekly'} onClick={() => setProductPeriod('weekly')}>
            Weekly
          </Tab>
          <Tab $active={productPeriod === 'monthly'} onClick={() => setProductPeriod('monthly')}>
            Monthly
          </Tab>
        </PeriodTabs>

        <ChartContainer>
          {ordersLoading || productsLoading ? (
            <LoadingSpinner>
              <Loader2 size={24} className="animate-spin" />
            </LoadingSpinner>
          ) : ordersError || productsError ? (
            <ErrorMessage>
              Erreur lors du chargement des données produits
            </ErrorMessage>
          ) : productData && productData.length > 0 ? (
            <div style={{ 
              display: 'flex', 
              alignItems: 'end', 
              gap: '2rem', 
              height: '100%', 
              padding: '1rem',
              background: '#f8f9fa',
              borderRadius: '8px'
            }}>
              {productData.map((item, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                flex: 1,
                position: 'relative'
              }}>
                <div style={{
                  width: '100%',
                  height: `${productData.length > 0 ? (item.sales / Math.max(...productData.map(d => d.sales))) * 200 : 0}px`,
                  background: 'linear-gradient(to top, #bfa77a, #e5d3b3)',
                  borderRadius: '4px 4px 0 0',
                  position: 'relative',
                  minHeight: '20px'
                }}>
                </div>
                <div style={{
                  marginTop: '12px',
                  fontSize: '0.75rem',
                  color: '#666',
                  textAlign: 'center',
                  whiteSpace: 'nowrap'
                }}>
                  {item.product}
                </div>
              </div>
            ))}
            </div>
          ) : (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%', 
              padding: '1rem',
              background: '#f8f9fa',
              borderRadius: '8px',
              color: '#666'
            }}>
              Aucune donnée disponible
            </div>
          )}
        </ChartContainer>
      </Section>

      {/* Category Performance */}
      <Section>
        <SectionHeader>
          <SectionIcon>
            <PieChart size={20} />
          </SectionIcon>
          <SectionTitle>{mounted ? t('analytics.categories.title') : ""}</SectionTitle>
        </SectionHeader>
        
        <MetricCard>
          <MetricValue>
            <Value>€{last30DaysCategorySales.toLocaleString()}</Value>
            <Change $positive={categoryGrowthPercentage >= 0}>
              <TrendingUp size={14} />
              Last 30 Days {categoryGrowthPercentage >= 0 ? '+' : ''}{categoryGrowthPercentage}%
            </Change>
          </MetricValue>
        </MetricCard>

        <PeriodTabs>
          <Tab $active={categoryPeriod === 'daily'} onClick={() => setCategoryPeriod('daily')}>
            Daily
          </Tab>
          <Tab $active={categoryPeriod === 'weekly'} onClick={() => setCategoryPeriod('weekly')}>
            Weekly
          </Tab>
          <Tab $active={categoryPeriod === 'monthly'} onClick={() => setCategoryPeriod('monthly')}>
            Monthly
          </Tab>
        </PeriodTabs>

        <ChartContainer>
          {ordersLoading || productsLoading ? (
            <LoadingSpinner>
              <Loader2 size={24} className="animate-spin" />
            </LoadingSpinner>
          ) : ordersError || productsError ? (
            <ErrorMessage>
              Erreur lors du chargement des données par catégorie
            </ErrorMessage>
          ) : categoryData && categoryData.length > 0 ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '0.5rem', 
              height: '100%', 
              padding: '1rem',
              background: '#f8f9fa',
              borderRadius: '8px'
            }}>
              {categoryData.map((item, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  width: '80px',
                  fontSize: '0.75rem',
                  color: '#666',
                  textAlign: 'right'
                }}>
                  {item.category}
                </div>
                <div style={{
                  flex: 1,
                  height: '30px',
                  background: 'linear-gradient(to right, #bfa77a, #e5d3b3)',
                  borderRadius: '4px',
                  position: 'relative',
                  width: `${categoryData.length > 0 ? (item.sales / Math.max(...categoryData.map(d => d.sales))) * 100 : 0}%`
                }}>
                  <div style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: 'white'
                  }}>
                    €{item.sales.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
            </div>
          ) : (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%', 
              padding: '1rem',
              background: '#f8f9fa',
              borderRadius: '8px',
              color: '#666'
            }}>
              Aucune donnée disponible
            </div>
          )}
        </ChartContainer>
      </Section>
    </Container>
  );
} 