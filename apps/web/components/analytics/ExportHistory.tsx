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
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
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
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;

  &:hover {
    border-color: #bfa77a;
    box-shadow: 0 4px 12px rgba(191, 167, 122, 0.1);
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
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  background: #f3f4f6;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #e5e7eb;
    color: #374151;
  }

  &.danger:hover {
    background: #fef2f2;
    color: #dc2626;
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
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;

  ${(props) => {
    switch (props.$status) {
      case "completed":
        return `
          background: #f0f9ff;
          color: #0c4a6e;
        `;
      case "pending":
        return `
          background: #fef3c7;
          color: #92400e;
        `;
      case "failed":
        return `
          background: #fef2f2;
          color: #dc2626;
        `;
    }
  }}
`;

const ScheduleButton = styled.button`
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
  width: 100%;

  &:hover {
    background: #333;
    transform: translateY(-1px);
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
