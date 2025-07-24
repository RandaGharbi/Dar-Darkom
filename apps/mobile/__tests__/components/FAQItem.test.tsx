import React from 'react';
import { render } from '@testing-library/react-native';
import FAQItem from '../../components/FAQItem';

describe('FAQItem', () => {
  it('affiche le titre et le sous-titre', () => {
    const item = {
      title: 'Livraison',
      subtitle: 'Délais de livraison',
      icon: { uri: 'https://via.placeholder.com/24' },
    };
    const { getByText } = render(<FAQItem item={item} />);
    expect(getByText('Livraison')).toBeTruthy();
    expect(getByText('Délais de livraison')).toBeTruthy();
  });
}); 