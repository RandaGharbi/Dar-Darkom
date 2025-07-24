import React from 'react';
import { render } from '@testing-library/react-native';
import ProductCard from '../../components/ProductCard';
import { Product } from '../../constants/types';

describe('ProductCard', () => {
  const product: Product = {
    id: 1,
    title: 'Crème Hydratante',
    price: 19.99,
    customerRating: 4.5,
    numberOfReviews: 10,
    category: 'skinCare',
    productType: 'skinCare',
    image_url: 'https://via.placeholder.com/150',
  };

  it('affiche le titre, le prix et la note', () => {
    const { getByText } = render(<ProductCard product={product} />);
    expect(getByText('Crème Hydratante')).toBeTruthy();
    expect(getByText('19.99 €')).toBeTruthy();
    expect(getByText(/4.5/)).toBeTruthy();
    expect(getByText(/10 avis/)).toBeTruthy();
  });

  it('affiche "Pas encore d\'avis" si pas de note', () => {
    const productNoRating = { ...product, customerRating: undefined, numberOfReviews: undefined };
    const { getByText } = render(<ProductCard product={productNoRating} />);
    expect(getByText("Pas encore d'avis")).toBeTruthy();
  });
}); 