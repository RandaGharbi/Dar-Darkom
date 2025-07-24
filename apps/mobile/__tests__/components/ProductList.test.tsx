import React from 'react';
import { render } from '@testing-library/react-native';
import ProductList from '../../components/ProductList';
import { Product } from '../../constants/types';

describe('ProductList', () => {
  const products: Product[] = [
    {
      id: 1,
      title: 'Produit 1',
      price: 10,
      category: 'skinCare',
      productType: 'skinCare',
      image_url: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      title: 'Produit 2',
      price: 20,
      category: 'hairCare',
      productType: 'hairCare',
      image_url: 'https://via.placeholder.com/150',
    },
  ];

  it('affiche tous les titres des produits', () => {
    const { getByText } = render(<ProductList title="Ma liste" products={products} />);
    expect(getByText('Produit 1')).toBeTruthy();
    expect(getByText('Produit 2')).toBeTruthy();
    expect(getByText('Ma liste')).toBeTruthy();
  });
}); 