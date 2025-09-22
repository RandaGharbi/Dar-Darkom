"use client";

import React from 'react';
import { useState } from "react";
import styled from "styled-components";
import {
  Clock,
  Download,
  Trash2,
  Repeat,
  FileText,
  FileSpreadsheet,
} from "lucide-react";

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
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
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

const ExportItem = styled.div`
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

const ExportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ExportInfo = styled.div`
  flex: 1;
`;

const ExportTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.25rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ExportDate = styled.p`
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
`;

const ExportActions = styled.div`
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
`;

const ExportDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
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

const StatusBadge = styled.span<{
  $status: "completed" | "pending" | "failed";
}>`
  padding: 0.5rem 1rem;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  border: 1px solid;

  ${(props) => {
    switch (props.$status) {
      case "completed":
        return `
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1));
          color: #059669;
          border-color: rgba(34, 197, 94, 0.2);
        `;
      case "pending":
        return `
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1));
          color: #d97706;
          border-color: rgba(245, 158, 11, 0.2);
        `;
      case "failed":
        return `
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
          color: #dc2626;
          border-color: rgba(239, 68, 68, 0.2);
        `;
    }
  }}
`;

const ScheduleButton = styled.button`
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
  width: 100%;
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

// Données mockées pour l'historique
const mockExportHistory = [
  {
    id: "1",
    type: "sales",
    format: "csv",
    date: "2024-01-15T10:30:00Z",
    status: "completed" as const,
    filename: "ventes_2024-01-15.csv",
    size: "2.3 MB",
    records: 150,
  },
  {
    id: "2",
    type: "products",
    format: "excel",
    date: "2024-01-14T14:20:00Z",
    status: "completed" as const,
    filename: "produits_2024-01-14.xlsx",
    size: "1.8 MB",
    records: 89,
  },
  {
    id: "3",
    type: "all",
    format: "csv",
    date: "2024-01-13T09:15:00Z",
    status: "failed" as const,
    filename: "export_complet_2024-01-13.csv",
    size: "0 MB",
    records: 0,
  },
];

interface ExportItem {
  id: string;
  type: string;
  format: string;
  date: string;
  status: "completed" | "pending" | "failed";
  filename: string;
  size: string;
  records: number;
}

export function ExportHistory() {
  const [exportHistory, setExportHistory] = useState(mockExportHistory);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sales":
        return <FileText size={16} />;
      case "products":
        return <FileText size={16} />;
      case "customers":
        return <FileText size={16} />;
      case "all":
        return <FileText size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "csv":
        return <FileText size={14} />;
      case "excel":
        return <FileSpreadsheet size={14} />;
      default:
        return <FileText size={14} />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case "sales":
        return "Ventes";
      case "products":
        return "Produits";
      case "customers":
        return "Clients";
      case "all":
        return "Export complet";
      default:
        return type;
    }
  };

  const handleDownload = (exportItem: { filename: string }) => {
    // Simuler le téléchargement
    alert(`Téléchargement de ${exportItem.filename}`);
  };

  const handleDelete = (id: string) => {
    setExportHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSchedule = () => {
    alert("Fonctionnalité de planification à implémenter");
  };

  return (
    <Container>
      <Header>
        <Icon>
          <Clock size={20} />
        </Icon>
        <Title>Historique des exports</Title>
      </Header>

      {exportHistory.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <Clock size={32} />
          </EmptyIcon>
          <EmptyTitle>Aucun export récent</EmptyTitle>
          <EmptyText>
            Vos exports apparaîtront ici une fois que vous aurez exporté des
            données.
          </EmptyText>
        </EmptyState>
      ) : (
        <>
          {exportHistory.map((exportItem: ExportItem) => (
            <ExportItem key={exportItem.id}>
              <ExportHeader>
                <ExportInfo>
                  <ExportTitle>
                    {getTypeIcon(exportItem.type)}
                    {getTypeName(exportItem.type)}
                    {getFormatIcon(exportItem.format)}
                  </ExportTitle>
                  <ExportDate>
                    {new Date(exportItem.date).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </ExportDate>
                </ExportInfo>
                <ExportActions>
                  <ActionButton onClick={() => handleDownload(exportItem)}>
                    <Download size={16} />
                  </ActionButton>
                  <ActionButton
                    className="danger"
                    onClick={() => handleDelete(exportItem.id)}
                  >
                    <Trash2 size={16} />
                  </ActionButton>
                </ExportActions>
              </ExportHeader>

              <ExportDetails>
                <DetailItem>
                  <DetailLabel>Statut</DetailLabel>
                  <StatusBadge $status={exportItem.status}>
                    {exportItem.status === "completed"
                      ? "Terminé"
                      : exportItem.status === "pending"
                        ? "En cours"
                        : "Échoué"}
                  </StatusBadge>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Fichier</DetailLabel>
                  <DetailValue>{exportItem.filename}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Taille</DetailLabel>
                  <DetailValue>{exportItem.size}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Enregistrements</DetailLabel>
                  <DetailValue>{exportItem.records}</DetailValue>
                </DetailItem>
              </ExportDetails>
            </ExportItem>
          ))}

          <ScheduleButton onClick={handleSchedule}>
            <Repeat size={16} />
            Planifier un export récurrent
          </ScheduleButton>
        </>
      )}
    </Container>
  );
}
