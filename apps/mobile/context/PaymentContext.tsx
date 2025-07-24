import React, { createContext, useContext, useState, ReactNode } from "react";

interface PaymentContextType {
  cardNumber: string;
  setCardNumber: (num: string) => void;
}

const PaymentContext = createContext<PaymentContextType>({
  cardNumber: "",
  setCardNumber: () => {},
});

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cardNumber, setCardNumber] = useState("");

  return (
    <PaymentContext.Provider value={{ cardNumber, setCardNumber }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
};

interface SelectedCardContextType {
  selectedCardId: string | null;
  setSelectedCardId: (id: string | null) => void;
}

const SelectedCardContext = createContext<SelectedCardContextType | undefined>(undefined);

export const SelectedCardProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  return (
    <SelectedCardContext.Provider value={{ selectedCardId, setSelectedCardId }}>
      {children}
    </SelectedCardContext.Provider>
  );
};

export const useSelectedCard = () => {
  const context = useContext(SelectedCardContext);
  if (!context) throw new Error('useSelectedCard must be used within a SelectedCardProvider');
  return context;
}; 