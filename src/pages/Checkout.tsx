import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Checkout() {
    const { cart, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return alert("Silakan login dulu");
        if (!address) return alert("Alamat harus diisi");

        setLoading(true);

        try {
            await addDoc(collection(db, 'orders'), {
                userId: user.uid,
                userEmail: user.email,
                items: cart,
                total: total,
                address: address,
                status: 'pending',
                createdAt: serverTimestamp()
            });

            clearCart();
            navigate('/order-success');

        } catch (error) {
            console.error("Gagal buat pesanan:", error);
            alert("Gagal membuat pesanan.");
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return <div className="p-20 text-center bg-soft-cream min-h-screen text-mocha-grey">Keranjang kosong. Tidak bisa checkout.</div>;
    }

    return (
        <div className="bg-soft-cream min-h-screen py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Sederhana */}
                <div className="mb-8 flex items-center gap-2 text-mocha-grey text-sm font-medium">
                    <span>Cart</span>
                    <span>/</span>
                    <span className="text-rich-charcoal font-bold">Checkout</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* --- KOLOM KIRI: FORM PENGIRIMAN (Span 7) --- */}
                    <div className="lg:col-span-7 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white-pearl p-8 rounded-3xl shadow-sm border border-warm-beige"
                        >
                            <div className="flex items-center gap-3 mb-6 border-b border-light-taupe/30 pb-4">
                                <span className="bg-rich-charcoal text-white-pearl w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">1</span>
                                <h2 className="text-xl font-serif font-bold text-rich-charcoal">Alamat Pengiriman</h2>
                            </div>

                            <form id="checkout-form" onSubmit={handleOrder} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-light-taupe uppercase tracking-wider mb-2">
                                        Email Penerima
                                    </label>
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        disabled
                                        className="w-full px-4 py-3 rounded-xl bg-warm-beige/20 border border-warm-beige text-mocha-grey cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-light-taupe uppercase tracking-wider mb-2">
                                        Alamat Lengkap
                                    </label>
                                    <textarea
                                        required
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-light-taupe text-rich-charcoal focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold outline-none transition shadow-sm placeholder-gray-300 resize-none"
                                        placeholder="Jalan, Nomor Rumah, Kecamatan, Kota, Kode Pos..."
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>
                            </form>
                        </motion.div>

                        {/* Dummy Payment Section (Visual Only) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white-pearl p-8 rounded-3xl shadow-sm border border-warm-beige opacity-80"
                        >
                            <div className="flex items-center gap-3 mb-6 border-b border-light-taupe/30 pb-4">
                                <span className="bg-light-taupe text-white-pearl w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">2</span>
                                <h2 className="text-xl font-serif font-bold text-rich-charcoal">Metode Pembayaran</h2>
                            </div>
                            <div className="p-4 border border-luxury-gold/30 bg-luxury-gold/5 rounded-xl flex items-center gap-4">
                                <div className="w-4 h-4 rounded-full bg-luxury-gold border-2 border-white shadow"></div>
                                <span className="font-bold text-rich-charcoal text-sm">Manual Transfer / COD (Demo)</span>
                            </div>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="sticky top-28 bg-rich-charcoal text-soft-cream p-8 rounded-3xl shadow-2xl overflow-hidden">
                            {/* Dekorasi Background */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-luxury-gold/10 rounded-full blur-3xl pointer-events-none"></div>

                            <h3 className="text-2xl font-serif font-bold mb-6 border-b border-white/10 pb-4 text-soft-gold">
                                Order Summary
                            </h3>

                            {/* List Item Mini */}
                            <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-white/10 overflow-hidden">
                                                <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="text-white-pearl font-medium">{item.name}</p>
                                                <p className="text-xs text-white/50">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <span className="text-soft-gold font-medium">
                                            Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Perhitungan */}
                            <div className="space-y-3 border-t border-white/10 pt-6 mb-8 text-sm">
                                <div className="flex justify-between text-white/70">
                                    <span>Subtotal</span>
                                    <span>Rp {total.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between text-white/70">
                                    <span>Shipping</span>
                                    <span className="text-luxury-gold">Free</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-white mt-4">
                                    <span>Total</span>
                                    <span>Rp {total.toLocaleString('id-ID')}</span>
                                </div>
                            </div>

                            {/* Tombol Aksi */}
                            <button
                                form="checkout-form"
                                type="submit"
                                disabled={loading}
                                className="w-full bg-luxury-gold text-rich-charcoal py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-soft-gold hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Processing...' : 'Place Order 🔒'}
                            </button>

                            <p className="text-center text-[10px] text-white/30 mt-4 uppercase tracking-widest">
                                Secure SSL Encryption
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}