"use client";

import React from 'react';
import { useState } from "react";
import styled from "styled-components";
import { Download, Calendar, FileText, FileSpreadsheet, Loader2, Filter, AlertCircle } from "lucide-react";
import { analyticsApi } from "../../services/analyticsApi";
import { ScheduleExportModal } from "./ScheduleExportModal";
import type { Schedule } from "./ScheduleExportModal";

const Container = styled.div`
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

const Title = styled.h2`
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

const Section = styled.div`
  margin-bottom: 5.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 1rem 0;
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
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.$selected ? '#d97706' : '#e5e7eb'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.$selected ? '#fef3c7' : 'white'};
  color: ${props => props.$selected ? '#d97706' : '#666'};

  &:hover {
    border-color: #d97706;
    background: #fef3c7;
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
  padding: 0.75rem 1.5rem;
  background: #1a1a1a;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: #333;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.85rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
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
      
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
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
    } catch (error) {
      console.error('❌ [FRONTEND] Erreur lors de la création de l\'export planifié:', error);
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