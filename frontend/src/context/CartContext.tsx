"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { cartApi } from "@/lib/api";

export interface CartItem {
  product_type: "DOMAIN" | "HOSTING";
  product_reference: string;
  name: string;
  quantity: number;
  unit_price: number;
  meta_info?: Record<string, any>;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  tax: number;
  taxRate: number;
  total: number;
  loading: boolean;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productReference: string) => void;
  clearCart: () => void;
  refreshTotals: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [taxRate, setTaxRate] = useState(18);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nexora_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
    setInitialized(true);
  }, []);

  const calculateServerTotals = useCallback(async (currentItems: CartItem[]) => {
    if (!currentItems.length) {
      setSubtotal(0);
      setTax(0);
      setTotal(0);
      return;
    }
    try {
      setLoading(true);
      const res = await cartApi.calculate(
        currentItems.map((i) => ({
          product_type: i.product_type,
          product_reference: i.product_reference,
          name: i.name,
          quantity: i.quantity,
          meta_info: i.meta_info,
        }))
      );
      setSubtotal(res.subtotal);
      setTax(res.tax);
      setTaxRate(res.tax_rate);
      setTotal(res.total);
    } catch {
      // Local fallback calculation if backend temporarily unreachable
      const sub = currentItems.reduce((acc, curr) => acc + curr.unit_price * curr.quantity, 0);
      const t = Math.round(sub * 0.18 * 100) / 100;
      setSubtotal(sub);
      setTax(t);
      setTotal(Math.round((sub + t) * 100) / 100);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save to local storage and refresh totals
  useEffect(() => {
    if (!initialized) return;
    localStorage.setItem("nexora_cart", JSON.stringify(items));
    calculateServerTotals(items);
  }, [items, initialized, calculateServerTotals]);

  const addItem = (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.product_reference.toLowerCase() === newItem.product_reference.toLowerCase()
      );
      if (existing) {
        // If domain, keep quantity at 1; if hosting, add
        if (newItem.product_type === "DOMAIN") return prev;
        return prev.map((i) =>
          i.product_reference.toLowerCase() === newItem.product_reference.toLowerCase()
            ? { ...i, quantity: i.quantity + (newItem.quantity || 1) }
            : i
        );
      }
      return [
        ...prev,
        {
          ...newItem,
          quantity: newItem.quantity || 1,
        },
      ];
    });
  };

  const removeItem = (productReference: string) => {
    setItems((prev) => prev.filter((i) => i.product_reference !== productReference));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("nexora_cart");
  };

  const refreshTotals = async () => {
    await calculateServerTotals(items);
  };

  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        tax,
        taxRate,
        total,
        loading,
        addItem,
        removeItem,
        clearCart,
        refreshTotals,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
