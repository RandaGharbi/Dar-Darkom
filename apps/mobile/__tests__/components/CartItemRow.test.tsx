import React from 'react';
import { render } from '@testing-library/react-native';
import CartItemRow from '../../components/CartItemRow';

describe('CartItemRow', () => {
  it('affiche le nom du produit et la quantité', () => {
    const item = {
      id: 1,
      name: 'Produit Panier',
      volume: '200ml',
      image: 'https://via.placeholder.com/150',
      price: 15,
      quantity: 2,
    };
    const { getByText } = render(
      <CartItemRow item={item} onChangeQuantity={() => {}} />
    );
    expect(getByText('Produit Panier')).toBeTruthy();
    expect(getByText('200ml')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();
  });
}); 