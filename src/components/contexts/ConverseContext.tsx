import React, { createContext, useContext, useState } from "react";
import ITemplate from "../editor/interfaces/ITemplate";
import IProduct from "../editor/interfaces/IProduct";

export interface ConverseContextType {
  converse: ITemplate | null;
  setConverse: (converse: ITemplate | null) => void;
  product: IProduct | null;
  setProduct: (product: IProduct | null) => void;
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