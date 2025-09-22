"use client";

import React from 'react';
import { useState, useEffect } from "react";
import styled from "styled-components";
import { Calendar, Clock, Settings, Plus, Trash2, Edit, Play, Pause } from "lucide-react";
import { analyticsApi } from "../../services/analyticsApi";
import Modal from "../ui/Modal";
import { useModal } from "../../hooks/useModal";

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
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
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

const AddButton = styled.button`
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
  
  @media (max-width: 768px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.625rem 1.25rem;
    font-size: 0.85rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #827869;
`;

const EmptyIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
`;

const EmptyTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #6b7280;
`;

const EmptyText = styled.p`
  font-size: 0.9rem;
  margin: 0;
  color: #9ca3af;
`;

const ScheduleItem = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  
  &:hover {
    border-color: rgba(59, 130, 246, 0.3);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    padding: 1.2rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const ScheduleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ScheduleInfo = styled.div`
  flex: 1;
`;

const ScheduleTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.25rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ScheduleDescription = styled.p`
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
`;

const ScheduleActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.75rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 12px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  
  &:hover {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
    color: #3b82f6;
    border-color: rgba(59, 130, 246, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
  
  &.danger:hover {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
    color: #dc2626;
    border-color: rgba(239, 68, 68, 0.3);
  }
  
  &.success:hover {
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1));
    color: #16a34a;
    border-color: rgba(34, 197, 94, 0.3);
  }
`;

const ScheduleDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DetailLabel = styled.span`
  font-size: 0.75rem;
  color: #9ca3af;
  text-transform: uppercase;
  font-weight: 500;
`;

const DetailValue = styled.span`
  font-size: 0.9rem;
  color: #1a1a1a;
  font-weight: 500;
`;

const StatusBadge = styled.span<{ $status: 'active' | 'paused' | 'completed' }>`
  padding: 0.5rem 1rem;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  border: 1px solid;
  
  ${props => {
    switch (props.$status) {
      case 'active':
        return `
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1));
          color: #059669;
          border-color: rgba(34, 197, 94, 0.2);
        `;
      case 'paused':
        return `
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1));
          color: #d97706;
          border-color: rgba(245, 158, 11, 0.2);
        `;
      case 'completed':
        return `
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1));
          color: #2563eb;
          border-color: rgba(59, 130, 246, 0.2);
        `;
    }
  }}
`;
interface ScheduledExport {
  id: string;
  name: string;
  type: string;
  format: string;
  frequency: string;
  status: 'active' | 'paused' | 'completed';
  nextRun: string;
  lastRun?: string;
  emailRecipients: string[];
  lastError?: string;
}
export function ScheduledExports() {
  const { modalState, showSuccess, showError, showInfo, hideModal } = useModal();
  const [scheduledExports, setScheduledExports] = useState<ScheduledExport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadScheduledExports();
  }, []);

  const loadScheduledExports = async () => {
    try {
      setLoading(true);
      const data = await analyticsApi.getScheduledExports();
      setScheduledExports(data);
          } catch {
        setError('Erreur lors du chargement des exports planifiés');
      } finally {
      setLoading(false);
    }
  };

  const getFrequencyName = (frequency: string) => {
    switch (frequency) {
      case 'daily':
        return 'Quotidien';
      case 'weekly':
        return 'Hebdomadaire';
      case 'monthly':
        return 'Mensuel';
      default:
        return frequency;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'sales':
        return 'Ventes';
      case 'products':
        return 'Produits';
      case 'customers':
        return 'Clients';
      case 'all':
        return 'Export complet';
      default:
        return type;
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const exportItem = scheduledExports.find(item => item.id === id);
      if (!exportItem) return;

      const newStatus = exportItem.status === 'active' ? 'paused' : 'active';
      await analyticsApi.updateScheduledExport(id, { status: newStatus });
      
      setScheduledExports(prev => 
        prev.map(item => 
          item.id === id 
            ? { ...item, status: newStatus }
            : item
        )
      );
    } catch {
      showError('Erreur lors de la mise à jour du statut');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet export planifié ?')) {
      return;
    }

    try {
      await analyticsApi.deleteScheduledExport(id);
      setScheduledExports(prev => prev.filter(item => item.id !== id));
      showSuccess('Export planifié supprimé avec succès !');
    } catch {
      showError('Erreur lors de la suppression de l\'export planifié');
    }
  };

  const handleEdit = () => {
    showInfo('Fonctionnalité d\'édition à implémenter');
  };

  const handleAddNew = () => {
    showInfo('Utilisez le bouton "Planifier" dans la section Export Functionality');
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <HeaderLeft>
            <Icon>
              <Calendar size={20} />
            </Icon>
            <Title>Exports planifiés</Title>
          </HeaderLeft>
        </Header>
        <EmptyState>
          <EmptyIcon>
            <Clock size={32} />
          </EmptyIcon>
          <EmptyTitle>Chargement...</EmptyTitle>
          <EmptyText>Récupération des exports planifiés</EmptyText>
        </EmptyState>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header>
          <HeaderLeft>
            <Icon>
              <Calendar size={20} />
            </Icon>
            <Title>Exports planifiés</Title>
          </HeaderLeft>
        </Header>
        <EmptyState>
          <EmptyIcon>
            <Clock size={32} />
          </EmptyIcon>
          <EmptyTitle>Erreur</EmptyTitle>
          <EmptyText>{error}</EmptyText>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Icon>
            <Calendar size={20} />
          </Icon>
          <Title>Exports planifiés</Title>
        </HeaderLeft>
        <AddButton onClick={handleAddNew}>
          <Plus size={16} />
          Nouveau
        </AddButton>
      </Header>

      {scheduledExports.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <Calendar size={32} />
          </EmptyIcon>
          <EmptyTitle>Aucun export planifié</EmptyTitle>
          <EmptyText>
            Créez votre premier export planifié pour automatiser vos rapports.
          </EmptyText>
        </EmptyState>
      ) : (
        scheduledExports.map((exportItem, index) => (
          <ScheduleItem key={exportItem.id || `export-${index}`}>
            <ScheduleHeader>
              <ScheduleInfo>
                <ScheduleTitle>
                  <Settings size={16} />
                  {exportItem.name}
                </ScheduleTitle>
                <ScheduleDescription>
                  {getTypeName(exportItem.type)} • {exportItem.format.toUpperCase()} • {getFrequencyName(exportItem.frequency)}
                </ScheduleDescription>
              </ScheduleInfo>
              <ScheduleActions>
                <ActionButton 
                  className={exportItem.status === 'active' ? 'success' : ''}
                  onClick={() => handleToggleStatus(exportItem.id)}
                >
                  {exportItem.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                </ActionButton>
                <ActionButton onClick={() => handleEdit()}>
                  <Edit size={16} />
                </ActionButton>
                <ActionButton 
                  className="danger" 
                  onClick={() => handleDelete(exportItem.id)}
                >
                  <Trash2 size={16} />
                </ActionButton>
              </ScheduleActions>
            </ScheduleHeader>

            <ScheduleDetails>
              <DetailItem>
                <DetailLabel>Statut</DetailLabel>
                <StatusBadge $status={exportItem.status}>
                  {exportItem.status === 'active' ? 'Actif' : 
                   exportItem.status === 'paused' ? 'Pausé' : 'Terminé'}
                </StatusBadge>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Prochaine exécution</DetailLabel>
                <DetailValue>
                  {new Date(exportItem.nextRun).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Dernière exécution</DetailLabel>
                <DetailValue>
                  {exportItem.lastRun ? new Date(exportItem.lastRun).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Jamais exécuté'}
                </DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Destinataires</DetailLabel>
                <DetailValue>{exportItem.emailRecipients.length} email(s)</DetailValue>
              </DetailItem>
              {exportItem.lastError && (
                <DetailItem>
                  <DetailLabel>Dernière erreur</DetailLabel>
                  <DetailValue style={{ color: '#dc2626', fontSize: '0.8rem' }}>
                    {exportItem.lastError}
                  </DetailValue>
                </DetailItem>
              )}
            </ScheduleDetails>
          </ScheduleItem>
        ))
      )}

      {/* Modal pour les notifications */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={hideModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        onConfirm={modalState.onConfirm}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        showCancel={modalState.showCancel}
      />
    </Container>
  );
} 