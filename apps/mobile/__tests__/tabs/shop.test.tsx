import React from 'react';
import { render } from '@testing-library/react-native';
import ShopScreen from '../../app/(tabs)/shop';

describe('ShopScreen', () => {
  it('affiche l\'écran boutique', () => {
    const { getByText } = render(<ShopScreen />);
    expect(getByText('Boutique')).toBeTruthy();
  });
}); 