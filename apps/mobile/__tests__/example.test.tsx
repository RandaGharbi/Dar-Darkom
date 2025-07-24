import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

describe('Exemple de test mobile', () => {
  it('affiche le texte', () => {
    const { getByText } = render(<Text>Bonjour mobile</Text>);
    expect(getByText('Bonjour mobile')).toBeTruthy();
  });
}); 