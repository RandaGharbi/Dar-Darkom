import React from 'react';
import { render } from '@testing-library/react-native';
import ContactInfo from '../../components/ContactInfo';

describe('ContactInfo', () => {
  it('affiche le titre et l\'email de contact', () => {
    const { getByText } = render(<ContactInfo />);
    expect(getByText("We're here to help")).toBeTruthy();
    expect(getByText('support@guerlain.com')).toBeTruthy();
  });
}); 