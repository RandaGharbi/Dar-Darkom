import { Product, RawProduct, RawShop } from "./types";

export function transformRawProduct(raw: RawProduct): Product {
  return {
    id: raw.id,
    title: raw.title,
    product_url: raw.product_url,
    image_url: raw.image_url,
    price: Number(raw.price),
    customerRating: raw.customerRating !== null ? Number(raw.customerRating) : undefined,
    numberOfReviews: raw.numberOfReviews !== undefined ? Number(raw.numberOfReviews) : 0,
    brand: undefined,
    ingredients: '',
    benefits: '',
    howToUse: '',
    category: raw.collection || '',
    productType: 'product',
  };
}

export const convertRawShopToProduct = (raw: RawShop): Product => ({
  id: raw.id,
  title: raw.Name,
  subtitle: raw.Subtitle,
  product_url: raw.product_url,
  image_url: raw.Image,
  price: raw.price,
  customerRating: undefined,
  numberOfReviews: 0,
  brand: undefined,
  ingredients: '',
  benefits: '',
  howToUse: '',
  category: raw.category,
  productType: 'product',
});