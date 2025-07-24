import React from 'react';
import { render } from '@testing-library/react-native';
import ContactFormScreen from '../../components/screens/ContactFormScreen';

describe('ContactFormScreen', () => {
  it('affiche l\'écran de formulaire de contact', () => {
    const { getByText } = render(<ContactFormScreen />);
    expect(getByText('Contact')).toBeTruthy();
  });
}); 