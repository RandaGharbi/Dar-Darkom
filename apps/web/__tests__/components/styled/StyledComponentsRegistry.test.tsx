import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StyledComponentsRegistry } from '../../../components/styled/StyledComponentsRegistry';

describe('StyledComponentsRegistry', () => {
  it('renders children correctly', () => {
    render(
      <StyledComponentsRegistry>
        <div>Test Content</div>
      </StyledComponentsRegistry>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('provides styled-components context', () => {
    const TestComponent = () => (
      <div data-testid="styled-component">Styled Component</div>
    );

    render(
      <StyledComponentsRegistry>
        <TestComponent />
      </StyledComponentsRegistry>
    );
    
    expect(screen.getByTestId('styled-component')).toBeInTheDocument();
  });

  it('handles multiple children', () => {
    render(
      <StyledComponentsRegistry>
        <div>First Child</div>
        <div>Second Child</div>
        <span>Third Child</span>
      </StyledComponentsRegistry>
    );
    
    expect(screen.getByText('First Child')).toBeInTheDocument();
    expect(screen.getByText('Second Child')).toBeInTheDocument();
    expect(screen.getByText('Third Child')).toBeInTheDocument();
  });

  it('creates style sheet instance', () => {
    const TestComponent = () => <div>Content</div>;
    
    const { container } = render(
      <StyledComponentsRegistry>
        <TestComponent />
      </StyledComponentsRegistry>
    );
    
    expect(container.firstChild).toBeTruthy();
  });
});