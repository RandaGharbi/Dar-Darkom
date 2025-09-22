"use client";

import React from 'react';
import { useState } from "react";
import styled from "styled-components";
import { Download, Calendar, FileText, FileSpreadsheet, Loader2, Filter, AlertCircle } from "lucide-react";
import { analyticsApi } from "../../services/analyticsApi";
import { ScheduleExportModal } from "./ScheduleExportModal";
import type { Schedule } from "./ScheduleExportModal";

const Container = styled.div`
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

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 4.5rem;
  
  @media (max-width: 768px) {
    margin-bottom: 1.2rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`;

const Icon = styled.div`
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

const Title = styled.h2`
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

const Section = styled.div`
  margin-bottom: 5.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 1.25rem 0;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin: 0 0 1rem 0;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin: 0 0 0.8rem 0;
  }
`;

const FormatOptions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

const FormatOption = styled.label<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border: 1px solid ${props => props.$selected ? 'rgba(59, 130, 246, 0.3)' : 'rgba(226, 232, 240, 0.8)'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${props => props.$selected 
    ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' 
    : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
  };
  color: ${props => props.$selected ? 'white' : '#1e293b'};
  font-weight: 600;
  box-shadow: ${props => props.$selected 
    ? '0 4px 20px rgba(59, 130, 246, 0.3)' 
    : '0 2px 8px rgba(0, 0, 0, 0.06)'
  };

  &:hover {
    background: ${props => props.$selected 
      ? 'linear-gradient(135deg, #2563eb, #7c3aed)' 
      : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))'
    };
    transform: translateY(-1px);
    box-shadow: ${props => props.$selected 
      ? '0 6px 24px rgba(59, 130, 246, 0.4)' 
      : '0 4px 16px rgba(0, 0, 0, 0.1)'
    };
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const DateRangeContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const DateInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  font-size: 0.9rem;
  color: #1a1a1a;
  
  &:focus {
    outline: none;
    border-color: #bfa77a;
    box-shadow: 0 0 0 2px rgba(191, 167, 122, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem;
    font-size: 0.85rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
    font-size: 0.8rem;
  }
`;

const DateLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  display: block;
`;

const DateGroup = styled.div`
  flex: 1;
`;

const FilterSection = styled.div`
  margin-bottom: 2rem;
`;

const FilterTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.75rem 0;
`;

const FilterOptions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const FilterChip = styled.label<{ $selected: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid ${props => props.$selected ? '#d97706' : '#e5e7eb'};
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.$selected ? '#fef3c7' : 'white'};
  color: ${props => props.$selected ? '#d97706' : '#666'};
  font-size: 0.8rem;
  font-weight: 500;

  &:hover {
    border-color: #d97706;
    background: #fef3c7;
  }
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 0.9rem;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    padding: 0.8rem;
    font-size: 0.85rem;
    margin-top: 0.8rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem;
    font-size: 0.8rem;
    margin-top: 0.6rem;
  }
`;

const ProgressContainer = styled.div`
  margin-top: 1rem;
`;

const ProgressText = styled.p`
  font-size: 0.85rem;
  color: #666;
  margin: 0 0 0.5rem 0;
  text-align: center;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  background: #d97706;
  width: ${props => props.$progress}%;
  transition: width 0.3s ease;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.875rem 1.75rem;
  background: linear-gradient(135deg, #1e293b, #334155);
  color: white;
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 4px 16px rgba(30, 41, 59, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, #334155, #475569);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(30, 41, 59, 0.4);
  }
  
  &:disabled {
    background: linear-gradient(135deg, #cbd5e1, #e2e8f0);
    color: #94a3b8;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.625rem 1.25rem;
    font-size: 0.85rem;
  }
`;

const SuccessMessage = styled.div`
  padding: 1rem;
  background: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 8px;
  color: #0c4a6e;
  font-size: 0.9rem;
  margin-top: 1rem;
  
  @media (max-width: 768px) {
    padding: 0.8rem;
    font-size: 0.85rem;
    margin-top: 0.8rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem;
    font-size: 0.8rem;
    margin-top: 0.6rem;
  }
`;

export function ExportFunctionality() {
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel'>('csv');
  const [exportType, setExportType] = useState<'sales' | 'products' | 'customers' | 'all'>('all');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  
  // Nouvelles options de filtrage
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [includeHeaders] = useState(true);
  const [exportStatus, setExportStatus] = useState<'all' | 'completed' | 'pending'>('all');

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setExportSuccess(false);
      setExportError(null);
      setProgress(0);
      
      // Simuler le progrès
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
      
      // Construire les paramètres de l'export
      const params = new URLSearchParams({
        type: exportType,
        format: exportFormat,
        includeHeaders: includeHeaders.toString(),
        status: exportStatus
      });
      
      if (dateRange.startDate) {
        params.append('startDate', dateRange.startDate);
      }
      if (dateRange.endDate) {
        params.append('endDate', dateRange.endDate);
      }
      
      const blob = await analyticsApi.exportData(params.toString());
      
      clearInterval(progressInterval);
      setProgress(100);
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Générer un nom de fichier avec la date
      const timestamp = new Date().toISOString().split('T')[0];
      const typeNames = {
        sales: 'ventes',
        products: 'produits', 
        customers: 'clients',
        all: 'export_complet'
      };
      link.download = `${typeNames[exportType]}_${timestamp}.${exportFormat}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setExportSuccess(true);
      
      // Réinitialiser le progrès après 2 secondes
      setTimeout(() => {
        setProgress(0);
      }, 2000);
      
    } catch {
      setExportError('Erreur lors de l\'export des données. Veuillez réessayer.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleScheduleReport = () => {
    setShowScheduleModal(true);
  };

  const handleSaveSchedule = async (schedule: Schedule) => {
    console.log('🚀 [FRONTEND] Début de handleSaveSchedule');
    console.log('📋 [FRONTEND] Données de l\'export à planifier:', schedule);
    
    try {
      console.log('📡 [FRONTEND] Appel API createScheduledExport...');
      const response = await analyticsApi.createScheduledExport(schedule);
      console.log('✅ [FRONTEND] Réponse API reçue:', response);
      alert(`Export planifié "${schedule.name}" créé avec succès !`);
    } catch {
      alert('Erreur lors de la création de l\'export planifié. Veuillez réessayer.');
    }
  };


  return (
    <Container>
      <Header>
        <Icon>
          <Download size={20} />
        </Icon>
        <Title>Export Functionality</Title>
      </Header>

      <Section>
        <SectionTitle>Type de données</SectionTitle>
        <FormatOptions>
          <FormatOption $selected={exportType === 'all'}>
            <HiddenInput
              type="radio"
              name="type"
              value="all"
              checked={exportType === 'all'}
              onChange={(e) => setExportType(e.target.value as 'sales' | 'products' | 'customers' | 'all')}
            />
            <FileText size={16} />
            Toutes les données
          </FormatOption>
          <FormatOption $selected={exportType === 'sales'}>
            <HiddenInput
              type="radio"
              name="type"
              value="sales"
              checked={exportType === 'sales'}
              onChange={(e) => setExportType(e.target.value as 'sales' | 'products' | 'customers' | 'all')}
            />
            <FileText size={16} />
            Ventes
          </FormatOption>
          <FormatOption $selected={exportType === 'products'}>
            <HiddenInput
              type="radio"
              name="type"
              value="products"
              checked={exportType === 'products'}
              onChange={(e) => setExportType(e.target.value as 'sales' | 'products' | 'customers' | 'all')}
            />
            <FileText size={16} />
            Produits
          </FormatOption>
          <FormatOption $selected={exportType === 'customers'}>
            <HiddenInput
              type="radio"
              name="type"
              value="customers"
              checked={exportType === 'customers'}
              onChange={(e) => setExportType(e.target.value as 'sales' | 'products' | 'customers' | 'all')}
            />
            <FileText size={16} />
            Clients
          </FormatOption>
        </FormatOptions>
      </Section>

      <Section>
        <SectionTitle>Format d&apos;exportation</SectionTitle>
        <FormatOptions>
          <FormatOption $selected={exportFormat === 'csv'}>
            <HiddenInput
              type="radio"
              name="format"
              value="csv"
              checked={exportFormat === 'csv'}
              onChange={(e) => setExportFormat(e.target.value as 'csv' | 'excel')}
            />
            <FileText size={16} />
            CSV
          </FormatOption>
          <FormatOption $selected={exportFormat === 'excel'}>
            <HiddenInput
              type="radio"
              name="format"
              value="excel"
              checked={exportFormat === 'excel'}
              onChange={(e) => setExportFormat(e.target.value as 'csv' | 'excel')}
            />
            <FileSpreadsheet size={16} />
            Excel
          </FormatOption>
        </FormatOptions>
      </Section>

      {exportType === 'sales' && (
        <FilterSection>
          <FilterTitle>
            <Filter size={14} style={{ marginRight: '0.5rem' }} />
            Filtres pour les ventes
          </FilterTitle>
          
          <DateRangeContainer>
            <DateGroup>
              <DateLabel>Date de début</DateLabel>
              <DateInput
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </DateGroup>
            <DateGroup>
              <DateLabel>Date de fin</DateLabel>
              <DateInput
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </DateGroup>
          </DateRangeContainer>

          <FilterOptions>
            <FilterChip $selected={exportStatus === 'all'}>
              <HiddenInput
                type="radio"
                name="status"
                value="all"
                checked={exportStatus === 'all'}
                onChange={(e) => setExportStatus(e.target.value as 'all' | 'completed' | 'pending')}
              />
              Tous les statuts
            </FilterChip>
            <FilterChip $selected={exportStatus === 'completed'}>
              <HiddenInput
                type="radio"
                name="status"
                value="completed"
                checked={exportStatus === 'completed'}
                onChange={(e) => setExportStatus(e.target.value as 'all' | 'completed' | 'pending')}
              />
              Commandes complétées
            </FilterChip>
            <FilterChip $selected={exportStatus === 'pending'}>
              <HiddenInput
                type="radio"
                name="status"
                value="pending"
                checked={exportStatus === 'pending'}
                onChange={(e) => setExportStatus(e.target.value as 'all' | 'completed' | 'pending')}
              />
              Commandes en attente
            </FilterChip>
          </FilterOptions>
        </FilterSection>
      )}
      <ButtonContainer>
        <Button 
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Export en cours...
            </>
          ) : (
            <>
              <Download size={16} />
              Exporter
            </>
          )}
        </Button>
        <Button 
          onClick={handleScheduleReport}
          disabled={isExporting}
        >
          <Calendar size={16} />
          Planifier
        </Button>
      </ButtonContainer>

      {isExporting && (
        <ProgressContainer>
          <ProgressText>Préparation de l&apos;export...</ProgressText>
          <ProgressBar>
            <ProgressFill $progress={progress} />
          </ProgressBar>
        </ProgressContainer>
      )}

      {exportSuccess && (
        <SuccessMessage>
          Export terminé avec succès ! Le fichier a été téléchargé.
        </SuccessMessage>
      )}

      {exportError && (
        <ErrorMessage>
          <AlertCircle size={16} />
          {exportError}
        </ErrorMessage>
      )}

      <ScheduleExportModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSave={handleSaveSchedule}
      />
    </Container>
  );
} 