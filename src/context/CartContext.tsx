import { createContext, useContext, useState, useEffect } from "react";
// PENTING: Gunakan 'import type' agar tidak error saat build
import type { ReactNode } from "react";
import type { Product } from "../types/product";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "./AuthContext";

// Tipe data item keranjang
interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // STATE PENGAMAN: Mencegah penyimpanan data sebelum data lama selesai dimuat
  const [isInitialized, setIsInitialized] = useState(false);

  // Ambil user & status loading dari AuthContext
  const { user, loading } = useAuth();

  // --- LOGIC 1: LOAD DATA (Jalan saat awal buka / ganti user) ---
  useEffect(() => {
    // GUARD 1: Jangan lakukan apa-apa jika Firebase masih loading status user
    if (loading) return;

    const loadCart = async () => {
      // Kunci gembok: Tandai bahwa proses load sedang berjalan
      setIsInitialized(false);

      if (user) {
        // A. JIKA USER LOGIN: Ambil data dari Firestore
        try {
          const docRef = doc(db, "carts", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setCart(docSnap.data().items || []);
          } else {
            // Jika user baru belum punya data, set kosong
            setCart([]);
          }
        } catch (error) {
          console.error("❌ Gagal mengambil keranjang dari server:", error);
        }
      } else {
        // B. JIKA TAMU: Ambil data dari LocalStorage
        const localData = localStorage.getItem("aestilo_cart");
        if (localData) {
          try {
            setCart(JSON.parse(localData));
          } catch (e) {
            console.error("⚠️ Data lokal rusak, mereset keranjang.", e);
            localStorage.removeItem("aestilo_cart");
            setCart([]);
          }
        } else {
          setCart([]);
        }
      }

      // Buka gembok: Tandai bahwa data sudah siap & aman untuk disimpan kembali nanti
      setIsInitialized(true);
    };

    loadCart();
  }, [user, loading]); // Dependency: Jalan ulang jika user berubah atau loading selesai

  // --- LOGIC 2: SAVE DATA (Jalan setiap kali keranjang berubah) ---
  useEffect(() => {
    // GUARD 2: Jangan simpan jika Auth masih loading atau Data awal belum selesai dimuat
    // Ini mencegah keranjang kosong menimpa data yang ada di database saat refresh
    if (loading || !isInitialized) return;

    const saveCart = async () => {
      if (user) {
        // A. SIMPAN KE FIREBASE
        try {
          // Simpan array items ke dokumen dengan ID = UID user
          await setDoc(doc(db, "carts", user.uid), {
            items: cart,
            updatedAt: new Date()
          });
        } catch (error) {
          console.error("❌ Gagal menyimpan keranjang ke cloud:", error);
        }
      } else {
        // B. SIMPAN KE LOCALSTORAGE
        localStorage.setItem("aestilo_cart", JSON.stringify(cart));
      }
    };

    // Debounce: Tunggu 500ms setelah user berhenti klik agar tidak spam database
    const timeoutId = setTimeout(() => {
      saveCart();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [cart, user, isInitialized, loading]);

  // --- FUNGSI-FUNGSI ACTIONS ---

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        // Jika produk sudah ada, tambah quantity
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Jika produk belum ada, tambahkan baru
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    // Catatan: Efek samping useEffect di atas akan otomatis menghapus data di DB/Storage
    // karena mendeteksi perubahan state cart menjadi []
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}