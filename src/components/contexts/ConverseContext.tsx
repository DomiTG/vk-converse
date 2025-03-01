import React, { createContext, useContext, useState } from "react";
import ITemplate from "../editor/interfaces/ITemplate";
import IProduct from "../editor/interfaces/IProduct";
import IShippingMethod from "../editor/interfaces/IShippingMethod";
import IPaymentMethod from "../editor/interfaces/IPaymentMethod";
import IConverseSeo from "../editor/interfaces/IConverseSeo";

export interface ConverseContextType {
  converse: ITemplate | null;
  setConverse: (converse: ITemplate | null) => void;
  product: IProduct | null;
  setProduct: (product: IProduct | null) => void;
  converseId: string | null;
  setConverseId: (converseId: string) => void;
  shippingMethods: IShippingMethod[];
  setShippingMethods: (shippingMethods: IShippingMethod[]) => void;
  paymentMethods: IPaymentMethod[];
  setPaymentMethods: (paymentMethods: IPaymentMethod[]) => void;
  currency: "CZK" | "EUR" | "USD" | "NONE";
  setCurrency: (currency: "CZK" | "EUR" | "USD" | "NONE") => void;
  seo: IConverseSeo | null;
  setSeo: (seo: IConverseSeo | null) => void;
  captchaSiteKey: string | null;
  setCaptchaSiteKey: (captchaSiteKey: string | null) => void;
}

const ConverseContext = createContext<ConverseContextType | undefined>(
  undefined,
);

export const ConverseProvider = ({
  value,
  children,
}: {
  value: ConverseContextType;
  children: React.ReactNode;
}) => {
  return (
    <ConverseContext.Provider value={value}>
      {children}
    </ConverseContext.Provider>
  );
};

export const useConverse = (): ConverseContextType => {
  const context = useContext(ConverseContext);
  if (!context) {
    throw new Error("useConverse must be used within a ConverseProvider");
  }
  return context;
};
