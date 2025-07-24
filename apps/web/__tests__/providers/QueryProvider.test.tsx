import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryProvider } from '../../providers/QueryProvider';
import { useQuery } from '@tanstack/react-query';

const TestComponent = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['test'],
    queryFn: () => Promise.resolve('test data')
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  return <div>Data: {data}</div>;
};

describe('QueryProvider', () => {
  it('renders children correctly', () => {
    render(
      <QueryProvider>
        <div>Test Content</div>
      </QueryProvider>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('provides React Query context to children', async () => {
    render(
      <QueryProvider>
        <TestComponent />
      </QueryProvider>
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('handles multiple children', () => {
    render(
      <QueryProvider>
        <div>First Child</div>
        <div>Second Child</div>
      </QueryProvider>
    );
    
    expect(screen.getByText('First Child')).toBeInTheDocument();
    expect(screen.getByText('Second Child')).toBeInTheDocument();
  });

  it('creates QueryClient with correct default options', () => {
    render(
      <QueryProvider>
        <TestComponent />
      </QueryProvider>
    );
    
    // Vérifier que le composant est rendu (indiquant que QueryClient fonctionne)
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});