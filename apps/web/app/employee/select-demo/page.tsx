"use client";
import React, { useState } from 'react';
import styled from 'styled-components';
import Select from '../../../components/ui/Select';

const PageWrapper = styled.div`
  background: #f8f9fa;
  min-height: 100vh;
  padding: 40px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 32px;
  text-align: center;
`;

const DemoSection = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
`;

const SelectContainer = styled.div`
  max-width: 300px;
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
`;

export default function SelectDemoPage() {
  const [selectedFruit, setSelectedFruit] = useState('apple');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const fruitOptions = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'blueberry', label: 'Blueberry' },
    { value: 'grapes', label: 'Grapes' },
    { value: 'pineapple', label: 'Pineapple' },
  ];

  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'pending', label: 'En attente' },
    { value: 'ready', label: 'Prête' },
    { value: 'cancelled', label: 'Annulée' },
  ];

  return (
    <PageWrapper>
      <Container>
        <Title>Démonstration du composant Select</Title>
        
        <DemoSection>
          <SectionTitle>Exemple avec des fruits (comme dans l'image)</SectionTitle>
          <SelectContainer>
            <Label>Choisir un fruit</Label>
            <Select
              options={fruitOptions}
              value={selectedFruit}
              onChange={setSelectedFruit}
              placeholder="Select a fruit"
            />
          </SelectContainer>
          <p>Fruit sélectionné: {selectedFruit}</p>
        </DemoSection>

        <DemoSection>
          <SectionTitle>Exemple avec des statuts de commande</SectionTitle>
          <SelectContainer>
            <Label>Filtrer par statut</Label>
            <Select
              options={statusOptions}
              value={selectedStatus}
              onChange={setSelectedStatus}
              placeholder="Sélectionner un statut"
            />
          </SelectContainer>
          <p>Statut sélectionné: {selectedStatus}</p>
        </DemoSection>
      </Container>
    </PageWrapper>
  );
}