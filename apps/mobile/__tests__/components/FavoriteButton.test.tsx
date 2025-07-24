import React from 'react';
import { render } from '@testing-library/react-native';
import FavoriteButton from '../../components/FavoriteButton';
import { Product } from '../../constants/types';

describe('FavoriteButton', () => {
  it('n\'affiche rien si pas de produit', () => {
    const { toJSON } = render(<FavoriteButton />);
    expect(toJSON()).toBeNull();
  });

  it('affiche le bouton si produit', () => {
    const product: Product = {
      id: 1,
      title: 'Produit test',
      price: 10,
      category: 'skinCare',
      productType: 'skinCare',
      image_url: 'https://via.placeholder.com/150',
    };
    const { getByTestId } = render(<FavoriteButton product={product} />);
    expect(getByTestId('favorite-icon')).toBeTruthy();
  });
}); 