import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Exemple de test web', () => {
  it('affiche le texte', () => {
    const { getByText } = render(<div>Bonjour test</div>);
    expect(getByText('Bonjour test')).toBeInTheDocument();
  });
}); 