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
  background: ${({ theme }) => theme.colors.background};
  min-height: calc(100vh - 64px);
  padding: 0;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3.5rem 2.5rem 2.5rem 2.5rem;
  
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
  font-size: 2.7rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 0.5rem 0;
  
  @media (max-width: 900px) {
    font-size: 2.2rem;
  }
  
  @media (max-width: 1120px) {
    font-size: 1.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const PageDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1.1rem;
  margin: 0;
  
  @media (max-width: 1120px) {
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
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
          <PageTitle>{mounted ? t('analytics.title') : ""}</PageTitle>
          <PageDescription>
            {mounted ? t('analytics.subtitle') : ""}
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