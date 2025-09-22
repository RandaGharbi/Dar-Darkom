"use client";

import React from 'react';
import { useState, useEffect } from "react";
import styled from "styled-components";
import { TrendingUp, Loader2 } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { ordersAPI } from '../../lib/api';
import { useTranslation } from '../../hooks/useTranslation';

const Section = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  padding: 2.2rem 2rem 1.7rem 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(226, 232, 240, 0.8);
  position: relative;
  z-index: 1;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  }
  
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
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
  color: #3b82f6;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
  }
  
  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
  }
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
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
  font-size: 2.4rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #475569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.7rem;
  }
`;

const Change = styled.span<{ $positive: boolean }>`
  font-size: 1rem;
  color: #059669;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1));
  border-radius: 12px;
  border: 1px solid rgba(34, 197, 94, 0.2);
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.2rem 0.6rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.15rem 0.5rem;
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
  padding: 0.75rem 1.25rem;
  border: 1px solid ${props => props.$active ? 'rgba(59, 130, 246, 0.3)' : 'rgba(226, 232, 240, 0.8)'};
  border-radius: 12px;
  background: ${props => props.$active 
    ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' 
    : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
  };
  color: ${props => props.$active ? 'white' : '#1e293b'};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.9rem;
  font-weight: 600;
  text-align: left;
  width: 100%;
  box-shadow: ${props => props.$active 
    ? '0 4px 20px rgba(59, 130, 246, 0.3)' 
    : '0 2px 8px rgba(0, 0, 0, 0.06)'
  };

  &:hover {
    background: ${props => props.$active 
      ? 'linear-gradient(135deg, #2563eb, #7c3aed)' 
      : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))'
    };
    transform: translateY(-1px);
    box-shadow: ${props => props.$active 
      ? '0 6px 24px rgba(59, 130, 246, 0.4)' 
      : '0 4px 16px rgba(0, 0, 0, 0.1)'
    };
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem 0.8rem;
    font-size: 0.8rem;
  }
`;

const ChartContainer = styled.div`
  height: 300px;
  margin-top: 1rem;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border: 1px solid rgba(226, 232, 240, 0.5);
  
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

export function SalesTrends() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [salesPeriod, setSalesPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

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

  // Calculs dynamiques pour les ventes
  const last30DaysSales = (() => {
    if (!orders) return 0;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return orders
      .filter(order => new Date(order.createdAt) >= thirtyDaysAgo)
      .reduce((sum, order) => sum + order.total, 0);
  })();

  const salesGrowthPercentage = (() => {
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
  const salesData = [
    { month: '2025-07', sales: 77600 },
  ];

  return (
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
        {ordersLoading ? (
          <LoadingSpinner>
            <Loader2 size={24} className="animate-spin" />
          </LoadingSpinner>
        ) : ordersError ? (
          <ErrorMessage>
            Erreur lors du chargement des données de ventes
          </ErrorMessage>
        ) : salesData && salesData.length > 0 ? (
          <div style={{ 
            display: 'flex', 
            alignItems: 'end', 
            gap: '2rem', 
            height: '100%', 
            padding: '1.5rem',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(226, 232, 240, 0.5)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Grille de fond */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
              opacity: 0.3
            }} />
            
            {salesData.map((item, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              flex: 1,
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{
                width: '100%',
                height: `${salesData.length > 0 ? (item.sales / Math.max(...salesData.map(d => d.sales))) * 200 : 0}px`,
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)',
                borderRadius: '8px 8px 0 0',
                position: 'relative',
                minHeight: '20px',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
              }}>
                {/* Effet de brillance */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '50%',
                  background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3), transparent)',
                  borderRadius: '8px 8px 0 0'
                }} />
                
                {/* Valeur sur la barre */}
                <div style={{
                  position: 'absolute',
                  top: '-30px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(30, 41, 59, 0.9)',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                }}>
                  €{item.sales.toLocaleString()}
                </div>
              </div>
              <div style={{
                marginTop: '16px',
                fontSize: '0.8rem',
                color: '#475569',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                fontWeight: '600'
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
  );
} 