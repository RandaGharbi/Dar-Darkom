import React from 'react';
import { render } from '@testing-library/react-native';
import { Banner } from '../../components/Banner';

describe('Banner', () => {
  it('affiche le titre du banner', () => {
    const { getByText } = render(<Banner />);
    expect(getByText('Découvre nos nouveautés')).toBeTruthy();
  });
}); 