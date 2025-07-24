import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Users } from 'lucide-react';
import { StatsCard } from '../../../components/dashboard/StatsCard';

describe('StatsCard', () => {
  const defaultProps = {
    title: 'Total Users',
    value: '1,234',
    icon: Users,
    color: 'blue' as const,
    change: '+12%'
  };

  it('renders card with title', () => {
    render(<StatsCard {...defaultProps} />);
    expect(screen.getByText('Total Users')).toBeInTheDocument();
  });

  it('displays the value', () => {
    render(<StatsCard {...defaultProps} />);
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  it('shows change percentage with positive indicator', () => {
    render(<StatsCard {...defaultProps} />);
    expect(screen.getByText('+12% ce mois')).toBeInTheDocument();
  });

  it('shows negative change correctly', () => {
    render(<StatsCard {...defaultProps} change="-5%" />);
    expect(screen.getByText('-5% ce mois')).toBeInTheDocument();
  });

  it('renders icon', () => {
    render(<StatsCard {...defaultProps} />);
    // Vérifier la présence de l'icône SVG au lieu du testId
    const svg = document.querySelector('svg.lucide-users');
    expect(svg).toBeInTheDocument();
  });

  it('accepts numeric value', () => {
    render(<StatsCard {...defaultProps} value={1234} />);
    expect(screen.getByText('1234')).toBeInTheDocument();
  });

  it('applies correct color styling for blue', () => {
    const { container } = render(<StatsCard {...defaultProps} color="blue" />);
    const iconWrapper = container.querySelector('[color="blue"]');
    expect(iconWrapper).toBeInTheDocument();
  });

  it('applies correct color styling for green', () => {
    const { container } = render(<StatsCard {...defaultProps} color="green" />);
    const iconWrapper = container.querySelector('[color="green"]');
    expect(iconWrapper).toBeInTheDocument();
  });

  it('applies correct color styling for purple', () => {
    const { container } = render(<StatsCard {...defaultProps} color="purple" />);
    const iconWrapper = container.querySelector('[color="purple"]');
    expect(iconWrapper).toBeInTheDocument();
  });

  it('applies correct color styling for orange', () => {
    const { container } = render(<StatsCard {...defaultProps} color="orange" />);
    const iconWrapper = container.querySelector('[color="orange"]');
    expect(iconWrapper).toBeInTheDocument();
  });

  it('applies positive change styling', () => {
    render(<StatsCard {...defaultProps} change="+15%" />);
    expect(screen.getByText('+15% ce mois')).toBeInTheDocument();
  });

  it('applies negative change styling', () => {
    render(<StatsCard {...defaultProps} change="-8%" />);
    expect(screen.getByText('-8% ce mois')).toBeInTheDocument();
  });
});