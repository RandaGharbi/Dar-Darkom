import React from 'react';
import { render } from '@testing-library/react-native';
import { OrderCard } from '../../components/OrderCard';
import { Image } from 'react-native';

describe('OrderCard', () => {
  it('affiche les infos de commande', () => {
    const order = {
      image: { uri: 'https://via.placeholder.com/60' },
      orderNumber: '12345',
      date: '2024-06-01',
      total: '42.5 €',
      onPress: jest.fn(),
    };
    const { getByText } = render(<OrderCard {...order} />);
    expect(getByText('Order number: 12345')).toBeTruthy();
    expect(getByText('Order date: 2024-06-01')).toBeTruthy();
    expect(getByText('Total: 42.5 €')).toBeTruthy();
  });
}); 