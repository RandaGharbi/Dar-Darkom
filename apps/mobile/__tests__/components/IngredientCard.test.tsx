import React from 'react';
import { render } from '@testing-library/react-native';
import { IngredientCard } from '../../components/IngredientCard';

describe('IngredientCard', () => {
  it('affiche le nom de l\'ingrédient', () => {
    const ingredient = {
      name: 'Aloe Vera',
      description: 'Hydratant naturel',
      image: 'https://via.placeholder.com/150',
    };
    const { getByText } = render(<IngredientCard {...ingredient} />);
    expect(getByText('Aloe Vera')).toBeTruthy();
    expect(getByText('Hydratant naturel')).toBeTruthy();
  });
}); 