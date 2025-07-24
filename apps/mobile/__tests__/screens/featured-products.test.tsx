import React from 'react';
import { render } from '@testing-library/react-native';
import FeaturedProducts from '../../components/screens/featured-products';

describe('FeaturedProducts', () => {
  it('affiche les produits en vedette', () => {
    const { getByText } = render(<FeaturedProducts />);
    expect(getByText('Produits en vedette')).toBeTruthy();
  });
}); 