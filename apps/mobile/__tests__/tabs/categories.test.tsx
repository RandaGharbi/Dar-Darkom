import React from 'react';
import { render } from '@testing-library/react-native';
import CategoriesScreen from '../../app/(tabs)/categories';

describe('CategoriesScreen', () => {
  it('affiche l\'écran catégories', () => {
    const { getByText } = render(<CategoriesScreen />);
    expect(getByText('Catégories')).toBeTruthy();
  });

  it('affiche la liste des catégories', () => {
    const { getByText } = render(<CategoriesScreen />);
    expect(getByText('Plats Chauds')).toBeTruthy();
    expect(getByText('Viandes')).toBeTruthy();
    expect(getByText('Pâtisserie')).toBeTruthy();
  });
}); 