"use client";

import { useState } from "react";
import styled from "styled-components";
import { X, Calendar, Mail, FileText, FileSpreadsheet, Repeat, Save } from "lucide-react";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid #e5e7eb;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s;
  
  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const ModalContent = styled.div`
  padding: 2rem;
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #bfa77a;
    box-shadow: 0 0 0 3px rgba(191, 167, 122, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  padding-right: 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  transition: all 0.2s;
  width: 100%;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  position: relative;
  z-index: 10;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
  color: #1a1a1a;
  font-weight: 500;
  
  &:focus {
    outline: none;
    border-color: #bfa77a;
    box-shadow: 0 0 0 3px rgba(191, 167, 122, 0.1);
  }
  
  option {
    padding: 0.5rem;
    background: white;
    color: #1a1a1a;
    font-weight: normal;
  }
  
  /* Forcer l'affichage sur tous les navigateurs */
  &::-ms-expand {
    display: none;
  }
  
  /* S'assurer que le texte sélectionné est visible */
  &::-webkit-select-placeholder {
    color: #9ca3af;
  }
  
  /* Styles pour Firefox */
  &:-moz-focusring {
    color: transparent;
    text-shadow: 0 0 0 #1a1a1a;
  }
`;

const OptionGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const OptionChip = styled.label<{ $selected: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.$selected ? '#d97706' : '#e5e7eb'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.$selected ? '#fef3c7' : 'white'};
  color: ${props => props.$selected ? '#d97706' : '#666'};
  font-size: 0.9rem;
  font-weight: 500;

  &:hover {
    border-color: #d97706;
    background: #fef3c7;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const EmailList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const EmailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f9fafb;
  border-radius: 6px;
`;

const EmailInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #bfa77a;
  }
`;

const RemoveButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  font-size: 0.75rem;
  
  &:hover {
    background: #dc2626;
  }
`;

const AddButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  
  &:hover {
    background: #059669;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 2rem 2rem 2rem;
  border-top: 1px solid #e5e7eb;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
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
  
  &.primary {
    background: #1a1a1a;
    color: white;
    
    &:hover {
      background: #333;
    }
  }
  
  &.secondary {
    background: #f3f4f6;
    color: #374151;
    
    &:hover {
      background: #e5e7eb;
    }
  }
`;

export interface Schedule {
  name: string;
  type: 'sales' | 'products' | 'customers' | 'all';
  format: 'csv' | 'excel';
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  dayOfWeek: string; // Lundi
  dayOfMonth: string;
  emailRecipients: string[];
  includeHeaders: boolean;
  status: 'active' | 'paused';
}

interface ScheduleExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schedule: Schedule) => void;
}

export function ScheduleExportModal({ isOpen, onClose, onSave }: ScheduleExportModalProps) {
  const [schedule, setSchedule] = useState<Schedule>({
    name: '',
    type: 'sales',
    format: 'csv',
    frequency: 'weekly',
    time: '09:00',
    dayOfWeek: '1', // Lundi
    dayOfMonth: '1',
    emailRecipients: [''],
    includeHeaders: true,
    status: 'active'
  });

  const handleAddEmail = () => {
    setSchedule(prev => ({
      ...prev,
      emailRecipients: [...prev.emailRecipients, '']
    }));
  };

  const handleRemoveEmail = (index: number) => {
    setSchedule(prev => ({
      ...prev,
      emailRecipients: prev.emailRecipients.filter((_, i) => i !== index)
    }));
  };

  const handleEmailChange = (index: number, value: string) => {
    setSchedule(prev => ({
      ...prev,
      emailRecipients: prev.emailRecipients.map((email, i) => i === index ? value : email)
    }));
  };

  const handleSave = () => {
    // Validation basique
    if (!schedule.name.trim()) {
      alert('Veuillez saisir un nom pour l\'export planifié');
      return;
    }
    
    if (schedule.emailRecipients.length === 0 || !schedule.emailRecipients[0]?.trim()) {
      alert('Veuillez saisir au moins une adresse email');
      return;
    }

    onSave(schedule);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <Calendar size={24} />
            Planifier un export
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalContent>
          <FormSection>
            <SectionTitle>
              <FileText size={20} />
              Informations générales
            </SectionTitle>
            <FormGrid>
              <FormGroup>
                <Label>Nom de l&apos;export planifié</Label>
                <Input
                  type="text"
                  placeholder="Ex: Rapport hebdomadaire des ventes"
                  value={schedule.name}
                  onChange={(e) => setSchedule(prev => ({ ...prev, name: e.target.value }))}
                />
              </FormGroup>
              <FormGroup>
                <Label>Statut</Label>
                <Select
                  value={schedule.status}
                  onChange={(e) => {
                    setSchedule(prev => ({ ...prev, status: e.target.value as 'active' | 'paused' }));
                  }}
                >
                  <option value="" disabled>Sélectionner un statut</option>
                  <option value="active">Actif</option>
                  <option value="paused">Pausé</option>
                </Select>
                {schedule.status && (
                  <div style={{ 
                    fontSize: '0.8rem', 
                    color: '#6b7280', 
                    marginTop: '0.25rem',
                    fontStyle: 'italic'
                  }}>
                    Statut sélectionné : {schedule.status === 'active' ? 'Actif' : 'Pausé'}
                  </div>
                )}
              </FormGroup>
            </FormGrid>
          </FormSection>

          <FormSection>
            <SectionTitle>
              <FileText size={20} />
              Configuration de l&apos;export
            </SectionTitle>
            <FormGrid>
              <FormGroup>
                <Label>Type de données</Label>
                <OptionGroup>
                  <OptionChip $selected={schedule.type === 'sales'}>
                    <HiddenInput
                      type="radio"
                      name="type"
                      value="sales"
                      checked={schedule.type === 'sales'}
                      onChange={(e) => setSchedule(prev => ({ ...prev, type: e.target.value as 'sales' | 'products' | 'customers' | 'all' }))}
                    />
                    <FileText size={16} />
                    Ventes
                  </OptionChip>
                  <OptionChip $selected={schedule.type === 'products'}>
                    <HiddenInput
                      type="radio"
                      name="type"
                      value="products"
                      checked={schedule.type === 'products'}
                      onChange={(e) => setSchedule(prev => ({ ...prev, type: e.target.value as 'sales' | 'products' | 'customers' | 'all' }))}
                    />
                    <FileText size={16} />
                    Produits
                  </OptionChip>
                  <OptionChip $selected={schedule.type === 'customers'}>
                    <HiddenInput
                      type="radio"
                      name="type"
                      value="customers"
                      checked={schedule.type === 'customers'}
                      onChange={(e) => setSchedule(prev => ({ ...prev, type: e.target.value as 'sales' | 'products' | 'customers' | 'all' }))}
                    />
                    <FileText size={16} />
                    Clients
                  </OptionChip>
                  <OptionChip $selected={schedule.type === 'all'}>
                    <HiddenInput
                      type="radio"
                      name="type"
                      value="all"
                      checked={schedule.type === 'all'}
                      onChange={(e) => setSchedule(prev => ({ ...prev, type: e.target.value as 'sales' | 'products' | 'customers' | 'all' }))}
                    />
                    <FileText size={16} />
                    Tout
                  </OptionChip>
                </OptionGroup>
              </FormGroup>
              <FormGroup>
                <Label>Format d&apos;export</Label>
                <OptionGroup>
                  <OptionChip $selected={schedule.format === 'csv'}>
                    <HiddenInput
                      type="radio"
                      name="format"
                      value="csv"
                      checked={schedule.format === 'csv'}
                      onChange={(e) => setSchedule(prev => ({ ...prev, format: e.target.value as 'csv' | 'excel' }))}
                    />
                    <FileText size={16} />
                    CSV
                  </OptionChip>
                  <OptionChip $selected={schedule.format === 'excel'}>
                    <HiddenInput
                      type="radio"
                      name="format"
                      value="excel"
                      checked={schedule.format === 'excel'}
                      onChange={(e) => setSchedule(prev => ({ ...prev, format: e.target.value as 'csv' | 'excel' }))}
                    />
                    <FileSpreadsheet size={16} />
                    Excel
                  </OptionChip>
                </OptionGroup>
              </FormGroup>
            </FormGrid>
          </FormSection>

          <FormSection>
            <SectionTitle>
              <Repeat size={20} />
              Planification
            </SectionTitle>
            <FormGrid>
              <FormGroup>
                <Label>Fréquence</Label>
                <Select
                  value={schedule.frequency}
                  onChange={(e) => {
                    setSchedule(prev => ({ ...prev, frequency: e.target.value as 'daily' | 'weekly' | 'monthly' }));
                  }}
                >
                  <option value="" disabled>Sélectionner une fréquence</option>
                  <option value="daily">Quotidien</option>
                  <option value="weekly">Hebdomadaire</option>
                  <option value="monthly">Mensuel</option>
                </Select>
                {schedule.frequency && (
                  <div style={{ 
                    fontSize: '0.8rem', 
                    color: '#6b7280', 
                    marginTop: '0.25rem',
                    fontStyle: 'italic'
                  }}>
                    Fréquence sélectionnée : {
                      schedule.frequency === 'daily' ? 'Quotidien' :
                      schedule.frequency === 'weekly' ? 'Hebdomadaire' :
                      schedule.frequency === 'monthly' ? 'Mensuel' : ''
                    }
                  </div>
                )}
              </FormGroup>
              <FormGroup>
                <Label>Heure d&apos;exécution</Label>
                <Input
                  type="time"
                  value={schedule.time}
                  onChange={(e) => setSchedule(prev => ({ ...prev, time: e.target.value }))}
                />
              </FormGroup>
            </FormGrid>

            {schedule.frequency === 'weekly' && (
              <FormGroup>
                <Label>Jour de la semaine</Label>
                <Select
                  value={schedule.dayOfWeek}
                  onChange={(e) => setSchedule(prev => ({ ...prev, dayOfWeek: e.target.value }))}
                >
                  <option value="1">Lundi</option>
                  <option value="2">Mardi</option>
                  <option value="3">Mercredi</option>
                  <option value="4">Jeudi</option>
                  <option value="5">Vendredi</option>
                  <option value="6">Samedi</option>
                  <option value="0">Dimanche</option>
                </Select>
              </FormGroup>
            )}

            {schedule.frequency === 'monthly' && (
              <FormGroup>
                <Label>Jour du mois</Label>
                <Select
                  value={schedule.dayOfMonth}
                  onChange={(e) => setSchedule(prev => ({ ...prev, dayOfMonth: e.target.value }))}
                >
                  {Array.from({ length: 28 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </Select>
              </FormGroup>
            )}
          </FormSection>

          <FormSection>
            <SectionTitle>
              <Mail size={20} />
              Notifications par email
            </SectionTitle>
            <EmailList>
              {schedule.emailRecipients.map((email, index) => (
                <EmailItem key={index}>
                  <EmailInput
                    type="email"
                    placeholder="email@exemple.com"
                    value={email}
                    onChange={(e) => handleEmailChange(index, e.target.value)}
                  />
                  {schedule.emailRecipients.length > 1 && (
                    <RemoveButton onClick={() => handleRemoveEmail(index)}>
                      Supprimer
                    </RemoveButton>
                  )}
                </EmailItem>
              ))}
            </EmailList>
            <AddButton onClick={handleAddEmail}>
              <Mail size={16} />
              Ajouter un destinataire
            </AddButton>
          </FormSection>
        </ModalContent>

        <ModalFooter>
          <Button className="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button className="primary" onClick={handleSave}>
            <Save size={16} />
            Planifier l&apos;export
          </Button>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
} 