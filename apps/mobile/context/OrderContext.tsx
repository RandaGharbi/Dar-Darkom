import React, { createContext, useContext, useState } from "react";

export interface OrderProduct {
  name: string;
  qty: number;
  image?: string;
  desc?: string;
  price?: number;
}

export interface OrderData {
  id: string;
  products: OrderProduct[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  address: {
    name: string;
    street: string;
    phone?: string;
    city?: string;
  };
  payment: string;
  status: string;
  statusDate: string;
  tracking: string;
}

interface OrderContextType {
  lastOrder: OrderData | null;
  setLastOrder: (order: OrderData) => void;
}

const OrderContext = createContext<OrderContextType>({
  lastOrder: null,
  setLastOrder: () => {},
});

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lastOrder, setLastOrder] = useState<OrderData | null>(null);
  return (
    <OrderContext.Provider value={{ lastOrder, setLastOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext); 