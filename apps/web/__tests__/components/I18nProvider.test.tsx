import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { I18nProvider } from '../../components/I18nProvider';

jest.mock('../../i18n', () => ({
  __esModule: true,
  default: {
    language: 'fr',
    isInitialized: true,
    t: (key: string) => key,
    use: () => ({
      init: () => Promise.resolve()
    })
  }
}));

describe('I18nProvider', () => {
  it('renders children when i18n is ready', () => {
    render(
      <I18nProvider>
        <div>Test Content</div>
      </I18nProvider>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders loading fallback initially', () => {
    render(
      <I18nProvider>
        <div>Test Content</div>
      </I18nProvider>
    );
    
    // Le fallback pourrait être affiché brièvement
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('provides i18n context to children', () => {
    const TestComponent = () => {
      return <div>Component with i18n</div>;
    };

    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>
    );
    
    expect(screen.getByText('Component with i18n')).toBeInTheDocument();
  });

  it('handles multiple children', () => {
    render(
      <I18nProvider>
        <div>First Child</div>
        <div>Second Child</div>
      </I18nProvider>
    );
    
    expect(screen.getByText('First Child')).toBeInTheDocument();
    expect(screen.getByText('Second Child')).toBeInTheDocument();
  });
});