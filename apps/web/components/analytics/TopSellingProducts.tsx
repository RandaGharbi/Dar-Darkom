"use client";

import React from 'react';
import { useState, useEffect } from "react";
import styled from "styled-components";
import { BarChart3, Loader2 } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { ordersAPI } from '../../lib/api';
import { useTranslation } from '../../hooks/useTranslation';

const Section = styled.div`
  background: #f5efe7;
  border-radius: 16px;
  padding: 2.2rem 2rem 1.7rem 2rem;
  box-shadow: 0 2px 8px 0 #e9e9e9;
  
  @media (max-width: 768px) {
    padding: 1.5rem 1.5rem 1.2rem 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem 1rem 0.8rem 1rem;
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

// Nouveau StyledChange
const StyledChange = styled.span<{ $positive: boolean }>`
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

type ChangeProps = React.HTMLAttributes<HTMLSpanElement> & { positive: boolean };
const Change = ({ positive, ...rest }: ChangeProps) => (
  <StyledChange $positive={positive} {...rest} />
);

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

// Nouveau StyledTab
const StyledTab = styled.button<{ $active: boolean }>`
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

type TabProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { active: boolean };
const Tab = ({ active, ...rest }: TabProps) => (
  <StyledTab $active={active} {...rest} />
);

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

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #bfa77a;
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #dc2626;
  font-size: 0.9rem;
`;

export function TopSellingProducts() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [productPeriod, setProductPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Récupérer toutes les commandes et produits
  const { data: orders, isLoading: ordersLoading, error: ordersError } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersAPI.getAll().then(res => res.data),
  });
  // TODO: Add products to the query
  // const { data: products, isLoading: productsLoading, error: productsError } = useQuery({
  //   queryKey: ['products'],
  //   queryFn: () => productsAPI.getAll().then(res => res.data),
  // });

  // Calculs dynamiques pour les produits
  const last30DaysProductSales = (() => {
    if (!orders) return 0;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return orders
      .filter(order => new Date(order.createdAt) >= thirtyDaysAgo)
      .reduce((sum, order) => sum + order.total, 0);
  })();

  const productGrowthPercentage = (() => {
    if (!orders) return 0;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    
    const currentPeriod = orders
      .filter(order => new Date(order.createdAt) >= thirtyDaysAgo)
      .reduce((sum, order) => sum + order.total, 0);
    
    const previousPeriod = orders
      .filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= sixtyDaysAgo && orderDate < thirtyDaysAgo;
      })
      .reduce((sum, order) => sum + order.total, 0);
    
    if (previousPeriod === 0) return 0;
    return Math.round(((currentPeriod - previousPeriod) / previousPeriod) * 100);
  })();

  // Données simulées pour le graphique
  const productData = [
    { product: 'SHALIMAR LAIT DIVIN POUR LE CORPS', sales: 66000 },
  ];

  return (
    <Section>
      <SectionHeader>
        <SectionIcon>
          <BarChart3 size={20} data-testid="lucide-bar-chart-3" />
        </SectionIcon>
        <SectionTitle>{mounted ? t('analytics.products.title') : ""}</SectionTitle>
      </SectionHeader>
      
      <MetricCard>
        <MetricValue>
          <Value>€{last30DaysProductSales.toLocaleString()}</Value>
          <Change positive={productGrowthPercentage >= 0}>
            <BarChart3 size={14} data-testid="lucide-bar-chart-3" />
            Last 30 Days {productGrowthPercentage >= 0 ? '+' : ''}{productGrowthPercentage}%
          </Change>
        </MetricValue>
      </MetricCard>

      <PeriodTabs>
        <Tab active={productPeriod === 'daily'} onClick={() => setProductPeriod('daily')}>
          Daily
        </Tab>
        <Tab active={productPeriod === 'weekly'} onClick={() => setProductPeriod('weekly')}>
          Weekly
        </Tab>
        <Tab active={productPeriod === 'monthly'} onClick={() => setProductPeriod('monthly')}>
          Monthly
        </Tab>
      </PeriodTabs>

      <ChartContainer>
        {ordersLoading ? (
          <LoadingSpinner>
            <Loader2 size={24} className="animate-spin" data-testid="loading-spinner" />
          </LoadingSpinner>
        ) : ordersError ? (
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
  );
} 