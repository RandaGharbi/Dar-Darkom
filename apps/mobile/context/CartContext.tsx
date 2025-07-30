import React, { createContext, useContext } from 'react';
import { useCartStore } from './CartStore';

interface CartContextType {
  cart: any;
  loading: boolean;
  addToCart: (userId: string, productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (userId: string, productId: string) => Promise<void>;
  updateCartItem: (userId: string, productId: string, quantity: number) => Promise<void>;
  clearCart: (userId: string) => Promise<void>;
  checkout: (userId: string) => Promise<any>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cartStore = useCartStore();

  const value: CartContextType = {
    cart: cartStore.cart,
    loading: cartStore.loading,
    addToCart: cartStore.addToCart,
    removeFromCart: cartStore.removeFromCart,
    updateCartItem: cartStore.updateCartItem,
    clearCart: cartStore.clearCart,
    checkout: cartStore.checkout,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 