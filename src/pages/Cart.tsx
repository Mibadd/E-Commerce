import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Cart() {
    const { cart, removeFromCart, totalItems } = useCart();

    const grandTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    // --- TAMPILAN KERANJANG KOSONG (LUXURY) ---
    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-soft-cream px-4">
                <div className="bg-white-pearl p-12 rounded-3xl shadow-xl border border-warm-beige text-center max-w-lg w-full relative overflow-hidden">
                    {/* Dekorasi Background Halus */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/10 rounded-full blur-2xl pointer-events-none"></div>

                    <div className="text-6xl mb-6 animate-bounce">🛍️</div>
                    <h2 className="text-3xl font-serif font-bold text-rich-charcoal mb-3">
                        Keranjang Anda Kosong
                    </h2>
                    <p className="text-mocha-grey mb-8 leading-relaxed">
                        Sepertinya Anda belum menemukan koleksi yang pas. <br />
                        Mari temukan gaya elegan Anda hari ini.
                    </p>
                    <Link
                        to="/"
                        className="inline-block bg-rich-charcoal text-white-pearl px-8 py-3.5 rounded-full font-bold uppercase tracking-wide shadow-lg hover:bg-luxury-gold hover:text-rich-charcoal transition-all duration-300 transform hover:-translate-y-1"
                    >
                        Mulai Belanja
                    </Link>
                </div>
            </div>
        );
    }

    // --- TAMPILAN ISI KERANJANG ---
    return (
        <div className="bg-soft-cream min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Halaman */}
                <div className="mb-10 text-center md:text-left border-b border-light-taupe/30 pb-6">
                    <h1 className="text-4xl font-serif font-bold text-rich-charcoal mb-2">
                        Shopping Bag
                    </h1>
                    <p className="text-mocha-grey">
                        Anda memiliki <span className="font-bold text-rich-charcoal">{totalItems} item</span> koleksi eksklusif.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* --- KOLOM KIRI: DAFTAR ITEM --- */}
                    <div className="lg:col-span-2 space-y-6">
                        {cart.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-white-pearl p-5 rounded-2xl shadow-sm border border-warm-beige hover:border-soft-gold hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row gap-6 items-center"
                            >
                                {/* Gambar Produk (Square & Elegant) */}
                                <div className="w-full sm:w-32 h-32 bg-warm-beige/30 rounded-xl overflow-hidden shrink-0 relative">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://placehold.co/200?text=No+Image';
                                        }}
                                    />
                                </div>

                                {/* Detail Info */}
                                <div className="flex-1 text-center sm:text-left w-full">
                                    <h3 className="text-xl font-serif font-bold text-rich-charcoal mb-1">
                                        {item.name}
                                    </h3>
                                    <p className="text-xs text-light-taupe uppercase tracking-widest font-bold mb-3">
                                        {item.category || "Premium Collection"}
                                    </p>

                                    <div className="flex flex-col sm:flex-row justify-between items-center mt-2">
                                        <div className="font-medium text-rich-charcoal bg-warm-beige/20 px-3 py-1 rounded-lg border border-warm-beige">
                                            {item.quantity} x Rp {item.price.toLocaleString('id-ID')}
                                        </div>

                                        <div className="mt-4 sm:mt-0 font-bold text-xl text-muted-bronze">
                                            Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                        </div>
                                    </div>
                                </div>

                                {/* Tombol Hapus (Minimalis) */}
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-mocha-grey hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors self-end sm:self-center"
                                    title="Hapus item"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </motion.div>
                        ))}
                    </div>

                    {/* --- KOLOM KANAN: RINGKASAN (STICKY) --- */}
                    <div className="lg:col-span-1">
                        <div className="bg-white-pearl p-8 rounded-3xl shadow-xl border border-warm-beige sticky top-28">
                            <h3 className="text-2xl font-serif font-bold text-rich-charcoal mb-6 border-b border-light-taupe/30 pb-4">
                                Order Summary
                            </h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-mocha-grey">
                                    <span>Subtotal ({totalItems} item)</span>
                                    <span className="font-medium text-rich-charcoal">Rp {grandTotal.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between text-mocha-grey">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium text-sm bg-green-50 px-2 py-0.5 rounded">Gratis</span>
                                </div>
                                <div className="flex justify-between text-mocha-grey">
                                    <span>Tax (Included)</span>
                                    <span>-</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end mb-8 pt-4 border-t border-light-taupe/50">
                                <span className="text-sm font-bold text-rich-charcoal uppercase tracking-wider">Total</span>
                                <span className="text-3xl font-serif font-bold text-rich-charcoal">
                                    Rp {grandTotal.toLocaleString('id-ID')}
                                </span>
                            </div>

                            <Link
                                to="/checkout"
                                className="block w-full text-center bg-luxury-gold text-rich-charcoal font-bold py-4 rounded-xl shadow-[0_5px_20px_rgba(191,161,102,0.4)] hover:bg-soft-gold hover:shadow-[0_8px_25px_rgba(191,161,102,0.5)] hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest text-sm"
                            >
                                Secure Checkout 🔒
                            </Link>

                            <div className="mt-6 flex justify-center gap-4 text-light-taupe opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                                {/* Ikon Kartu Kredit (Visual Only) */}
                                <div className="h-6 w-10 bg-gray-200 rounded"></div>
                                <div className="h-6 w-10 bg-gray-200 rounded"></div>
                                <div className="h-6 w-10 bg-gray-200 rounded"></div>
                            </div>

                            <p className="text-center text-[10px] text-light-taupe mt-4 uppercase tracking-wider">
                                Guaranteed Safe Checkout
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}