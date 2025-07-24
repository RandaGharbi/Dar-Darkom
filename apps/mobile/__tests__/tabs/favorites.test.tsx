import React from 'react';
import { render } from '@testing-library/react-native';
import FavoritesScreen from '../../app/(tabs)/favorites';

describe('FavoritesScreen', () => {
  it('affiche l\'écran favoris', () => {
    const { getByText } = render(<FavoritesScreen />);
    expect(getByText('Favoris')).toBeTruthy();
  });
}); 