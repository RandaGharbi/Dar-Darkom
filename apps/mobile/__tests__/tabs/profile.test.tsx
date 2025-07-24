import React from 'react';
import { render } from '@testing-library/react-native';
import ProfileScreen from '../../app/(tabs)/profile';

describe('ProfileScreen', () => {
  it('affiche l\'écran profil', () => {
    const { getByText } = render(<ProfileScreen />);
    expect(getByText('Profil')).toBeTruthy();
  });
}); 