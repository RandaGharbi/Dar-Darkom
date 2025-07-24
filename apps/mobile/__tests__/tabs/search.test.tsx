import React from 'react';
import { render } from '@testing-library/react-native';
import SearchScreen from '../../app/(tabs)/search';

describe('SearchScreen', () => {
  it('affiche l\'écran recherche', () => {
    const { getByText } = render(<SearchScreen />);
    expect(getByText('Rechercher des produits')).toBeTruthy();
  });
}); 