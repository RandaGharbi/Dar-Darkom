import React from 'react';
import { render } from '@testing-library/react-native';
import IngredientsScreen  from '../../components/screens/IngredientScreen';

describe('IngredientScreen', () => {
  it('affiche l\'écran des ingrédients', () => {
    const { getByText } = render(<IngredientsScreen />);
    expect(getByText('Ingrédients')).toBeTruthy();
  });
}); 