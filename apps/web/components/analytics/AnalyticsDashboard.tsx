"use client";

import React from 'react';
import { useState, useEffect } from "react";
import styled from "styled-components";
import { SalesTrends } from "./SalesTrends";
import { TopSellingProducts } from "./TopSellingProducts";
import { SalesByCategory } from "./SalesByCategory";
import { ExportFunctionality } from "./ExportFunctionality";
import { ExportHistory } from "./ExportHistory";
import { ScheduledExports } from "./ScheduledExports";
import { useTranslation } from "../../hooks/useTranslation";

const DashboardContainer = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: calc(100vh - 64px);
  padding: 0;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3.5rem 2.5rem 2.5rem 2.5rem;
  position: relative;
  z-index: 1;
  
  @media (max-width: 1120px) {
    padding: 3rem 2rem 2rem 2rem;
  }
  
  @media (max-width: 1120px) {
    padding: 2rem 1rem 1rem 1rem;
  }
  
  @media (max-width: 600px) {
    padding: 1rem 0.5rem;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 2.5rem;
  
  @media (max-width: 1120px) {
    margin-bottom: 2rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1.5rem;
  }
`;

const PageTitle = styled.h1`
  font-size: 2.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b, #475569, #64748b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 12px 0;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4);
    border-radius: 2px;
  }
  
  @media (max-width: 900px) {
    font-size: 2.4rem;
  }
  
  @media (max-width: 1120px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.6rem;
  }
`;

const PageDescription = styled.p`
  color: #64748b;
  font-size: 1.2rem;
  margin: 0;
  font-weight: 500;
  line-height: 1.6;
  
  @media (max-width: 1120px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 1200px) {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  
  @media (max-width: 768px) {
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 1rem;
  }
`;


export function AnalyticsDashboard() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <DashboardContainer>
      <Content>
        <PageHeader>
          <PageTitle>ANALYSES</PageTitle>
          <PageDescription>
            Analysez vos performances commerciales avec style tunisien
          </PageDescription>
        </PageHeader>

        
        <GridContainer>
          <SalesTrends />
          <ExportFunctionality />
          <TopSellingProducts />
          <SalesByCategory />
          <ExportHistory />
          <ScheduledExports />
        </GridContainer>
      </Content>
    </DashboardContainer>
  );
} 