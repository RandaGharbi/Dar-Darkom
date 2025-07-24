import React from 'react';
import { render } from '@testing-library/react-native';
import Header from '../../components/Header';

describe('Header', () => {
  it('affiche le header', () => {
    const { getByTestId } = render(<Header />);
    expect(getByTestId('header')).toBeTruthy();
  });
}); 