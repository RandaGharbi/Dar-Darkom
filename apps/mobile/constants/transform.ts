import { Product, RawProduct, RawShop } from "./types";

export function transformRawProduct(raw: RawProduct): Product {
  return {
    id: raw.id,
    title: raw.title,                 // camelCase exact
    product_url: raw.product_url,
    image_url: raw.image_url,
    price: Number(raw.price),         // ou raw.price direct si déjà number
    customerRating: raw.customerRating !== null ? Number(raw.customerRating) : null,
    numberOfReviews: raw.numberOfReviews !== undefined ? Number(raw.numberOfReviews) : 0,
    // collection et typeOfCare ne sont pas dans Product, donc ne pas les inclure ici
  };
}

export const convertRawShopToProduct = (raw: RawShop): Product => ({
  id: raw.id,
  title: raw.Name,
  subtitle: raw.Subtitle,
  product_url: raw.product_url,
  image_url: raw.Image,
  price: raw.price,
  customerRating: null,        // valeur par défaut
  numberOfReviews: 0,          // valeur par défaut
});