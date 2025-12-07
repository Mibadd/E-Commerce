import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Product } from "../types/product";
import { useAuth } from "./AuthContext";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void; // BARU: Fungsi untuk kosongkan keranjang
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { user } = useAuth();

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      let newCart;
      if (existingItem) {
        newCart = prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        newCart = [...prevCart, { ...product, quantity: 1 }];
      }
      if (user) saveCartToFirestore(user.uid, newCart);
      return newCart;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => item.id !== productId);
      if (user) saveCartToFirestore(user.uid, newCart);
      return newCart;
    });
  };

  // BARU: Implementasi clearCart
  const clearCart = () => {
    setCart([]);
    if (user) saveCartToFirestore(user.uid, []);
  };

  const saveCartToFirestore = async (uid: string, cartData: CartItem[]) => {
    try {
      const cartRef = doc(db, "carts", uid);
      await setDoc(cartRef, { items: cartData }, { merge: true });
    } catch (error) {
      console.error("Gagal menyimpan keranjang:", error);
    }
  };

  useEffect(() => {
    if (user) {
      const loadCart = async () => {
        const cartRef = doc(db, "carts", user.uid);
        const snapshot = await getDoc(cartRef);
        if (snapshot.exists()) {
          setCart(snapshot.data().items as CartItem[]);
        }
      };
      loadCart();
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      // Instead of calling setCart synchronously, rely on clearCart or handle cart reset in your auth logic.
      // Optionally, you can use a microtask to avoid cascading renders:
      Promise.resolve().then(() => setCart([]));
    }
  }, [user]);

  // Jangan lupa masukkan clearCart ke value provider
  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
}
