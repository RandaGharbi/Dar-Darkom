"use client";

import React from 'react';
import { useState, useEffect } from "react";
import styled from "styled-components";
import { PieChart, Loader2 } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { ordersAPI, productsAPI } from '../../lib/api';
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

const Change = styled.span<{ $positive: boolean }>`
  font-size: 1rem;
  color: #827869;
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

const ChangeValue = styled.span`
  color: #1ca672;
  font-weight: 600;
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

export function SalesByCategory() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [categoryPeriod, setCategoryPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Récupérer toutes les commandes et produits
  const { data: orders, isLoading: ordersLoading, error: ordersError } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersAPI.getAll().then(res => res.data),
  });
  const { data: products, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsAPI.getAll().then(res => res.data),
  });

  // Calcul des vraies ventes par catégorie
  const categoryData = (() => {
    if (!orders || !products) return [];
    
    // Créer un map des noms de produits vers leurs catégories
    const productCategoryMap = new Map();
    products.forEach(product => {
      productCategoryMap.set(product.name, product.category || 'Unknown');
    });
    
    // Calculer les ventes par catégorie
    const categorySales = new Map();
    
    orders.forEach(order => {
      order.products.forEach(product => {
        const category = productCategoryMap.get(product.name) || 'Unknown';
        const sales = product.price * product.qty;
        
        if (!categorySales.has(category)) {
          categorySales.set(category, 0);
        }
        categorySales.set(category, categorySales.get(category) + sales);
      });
    });
    
    // Convertir en array et trier par ventes décroissantes
    return Array.from(categorySales.entries())
      .map(([category, sales]) => ({ category, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5); // Top 5 catégories
  })();

  // Calcul du total des ventes par catégorie des 30 derniers jours
  const last30DaysCategorySales = (() => {
    if (!orders || !products) return 0;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const productCategoryMap = new Map();
    products.forEach(product => {
      productCategoryMap.set(product.name, product.category || 'Unknown');
    });
    
    const categorySales = new Map();
    
    orders
      .filter(order => new Date(order.createdAt) >= thirtyDaysAgo)
      .forEach(order => {
        order.products.forEach(product => {
          const category = productCategoryMap.get(product.name) || 'Unknown';
          const sales = product.price * product.qty;
          
          if (!categorySales.has(category)) {
            categorySales.set(category, 0);
          }
          categorySales.set(category, categorySales.get(category) + sales);
        });
      });
    
    return Array.from(categorySales.values()).reduce((sum, sales) => sum + sales, 0);
  })();

  // Calcul du pourcentage de croissance
  const categoryGrowthPercentage = (() => {
    if (!orders || !products) return 0;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    
    const productCategoryMap = new Map();
    products.forEach(product => {
      productCategoryMap.set(product.name, product.category || 'Unknown');
    });
    
    // Période actuelle (30 derniers jours)
    const currentPeriod = (() => {
      const categorySales = new Map();
      orders
        .filter(order => new Date(order.createdAt) >= thirtyDaysAgo)
        .forEach(order => {
          order.products.forEach(product => {
            const category = productCategoryMap.get(product.name) || 'Unknown';
            const sales = product.price * product.qty;
            if (!categorySales.has(category)) categorySales.set(category, 0);
            categorySales.set(category, categorySales.get(category) + sales);
          });
        });
      return Array.from(categorySales.values()).reduce((sum, sales) => sum + sales, 0);
    })();
    
    // Période précédente (30 jours avant)
    const previousPeriod = (() => {
      const categorySales = new Map();
      orders
        .filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= sixtyDaysAgo && orderDate < thirtyDaysAgo;
        })
        .forEach(order => {
          order.products.forEach(product => {
            const category = productCategoryMap.get(product.name) || 'Unknown';
            const sales = product.price * product.qty;
            if (!categorySales.has(category)) categorySales.set(category, 0);
            categorySales.set(category, categorySales.get(category) + sales);
          });
        });
      return Array.from(categorySales.values()).reduce((sum, sales) => sum + sales, 0);
    })();
    
    if (previousPeriod === 0) return 0;
    return Math.round(((currentPeriod - previousPeriod) / previousPeriod) * 100);
  })();

  return (
    <Section>
      <SectionHeader>
        <SectionIcon>
          <PieChart data-testid="lucide-pie-chart" size={20} />
        </SectionIcon>
        <SectionTitle>{mounted ? t('analytics.categories.title') : ""}</SectionTitle>
      </SectionHeader>
      
      <MetricCard>
        <MetricValue>
          <Value>€{last30DaysCategorySales.toLocaleString()}</Value>
          <Change $positive={categoryGrowthPercentage >= 0}>
            <PieChart data-testid="lucide-pie-chart" size={14} />
            Last 30 Days <ChangeValue>{categoryGrowthPercentage >= 0 ? '+' : ''}{categoryGrowthPercentage}%</ChangeValue>
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
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem',
                background: item.category === 'Body' ? 'linear-gradient(to top, rgb(191, 167, 122), rgb(229, 211, 179))' : 'white',
                borderRadius: '4px',
                border: '1px solid #e5e7eb'
              }}>
                <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                  {item.category}
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937' }}>
                  €{item.sales.toLocaleString()}
                </span>
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