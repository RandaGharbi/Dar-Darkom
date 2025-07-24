import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from '../../app/(tabs)/index';

describe('HomeScreen', () => {
  it('affiche l\'écran d\'accueil', () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText('Accueil')).toBeTruthy();
  });
}); 