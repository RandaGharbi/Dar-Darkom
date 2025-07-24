'use client';

import React from 'react';
import styled from 'styled-components';
import { LucideIcon } from 'lucide-react';

const Card = styled.div`
  background-color: #E8DECF;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const IconWrapper = styled.div<{ color: string }>`
  width: 3rem;
  height: 3rem;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => {
    switch (props.color) {
      case 'blue': return '#9AC2C9';
      case 'green': return '#B8CDA0';
      case 'purple': return '#B8A3C2';
      case 'orange': return '#E8C8A1';
      default: return '#D4C2B8';
    }
  }};
  color: ${props => {
    switch (props.color) {
      case 'blue': return '#0F4C5C';
      case 'green': return '#4C6B16';
      case 'purple': return '#5E3C6D';
      case 'orange': return '#9F611C';
      default: return '#5A4D3D';
    }
  }};
`;

const Title = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin: 0;
`;

const Value = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
`;

const Change = styled.div<{ $isPositive: boolean }>`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.$isPositive ? 'var(--success)' : 'var(--error)'};
`;

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange';
  change: string;
}

export function StatsCard({ title, value, icon: Icon, color, change }: StatsCardProps) {
  const isPositive = change.startsWith('+');

  return (
    <Card>
      <CardHeader>
        <Title>{title}</Title>
        <IconWrapper color={color}>
          <Icon size={24} />
        </IconWrapper>
      </CardHeader>
      <Value>{value}</Value>
      <Change $isPositive={isPositive}>
        {change} ce mois
      </Change>
    </Card>
  );
}
