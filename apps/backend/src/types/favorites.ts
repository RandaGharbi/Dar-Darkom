export interface FavoriteProduct {
  productId: string;
  title: string;
  subtitle?: string;
  price: number;
  image_url: string;
  category: string;
}

export interface FavoriteResponse {
  message: string;
  favorite?: object;
  isFavorite?: boolean;
}

export interface FavoritesListResponse {
  favorites: FavoriteProduct[];
  count: number;
}

export interface IsFavoriteResponse {
  isFavorite: boolean;
} 