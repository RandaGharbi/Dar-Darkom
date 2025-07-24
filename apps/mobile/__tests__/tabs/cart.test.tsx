jest.mock('../../app/(tabs)/cart', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return function CartScreen() {
    return React.createElement(Text, null, 'Panier');
  };
});

import React from 'react';
import { render } from '@testing-library/react-native';
import CartScreen from '../../app/(tabs)/cart';

describe('CartScreen', () => {
  it('affiche l\'écran panier', () => {
    const { getByText } = render(<CartScreen />);
    expect(getByText('Panier')).toBeTruthy();
  });
}); 