import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, totalItems } = useCart();

  // Hitung total harga belanjaan
  const grandTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  // FIX 1: Logika Keranjang Kosong
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Keranjang Kosong
        </h2>
        <p className="text-gray-500 mb-6">
          Wah, sepertinya Anda belum belanja apa-apa.
        </p>
        {/* Diarahkan ke Home (/), bukan Checkout */}
        <Link
          to="/"
          className="block text-center bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg"
        >
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Keranjang Belanja ({totalItems} Item)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: Daftar Barang */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-lg shadow-sm border flex gap-4 items-center"
            >
              {/* Gambar Produk */}
              <div className="w-24 h-24 shrink-0 bg-gray-100 rounded-md overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/200?text=No+Image";
                  }}
                />
              </div>

              {/* Info Produk */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h3>
                <p className="text-gray-500 text-sm mb-2">{item.category}</p>
                <div className="font-bold text-blue-600">
                  Rp {item.price.toLocaleString("id-ID")} x {item.quantity}
                </div>
              </div>

              {/* Total per Item & Tombol Hapus */}
              <div className="text-right">
                <p className="font-bold text-gray-800 mb-2">
                  Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                </p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium underline"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Kolom Kanan: Ringkasan Pesanan */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-24">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Ringkasan Pesanan
            </h3>

            <div className="flex justify-between mb-2 text-gray-600">
              <span>Total Harga ({totalItems} barang)</span>
              <span>Rp {grandTotal.toLocaleString("id-ID")}</span>
            </div>

            <div className="border-t my-4"></div>

            <div className="flex justify-between mb-6 text-lg font-bold text-gray-900">
              <span>Total Tagihan</span>
              <span>Rp {grandTotal.toLocaleString("id-ID")}</span>
            </div>

            {/* FIX 2: Ganti Button dengan Link ke Checkout */}
            <Link
              to="/checkout"
              className="block text-center w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg"
            >
              Lanjut ke Pembayaran
            </Link>

            <p className="text-xs text-gray-400 text-center mt-4">
              *Harga belum termasuk ongkir
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
