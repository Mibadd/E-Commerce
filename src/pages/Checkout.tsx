import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

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
            // 1. Simpan pesanan ke Firestore
            await addDoc(collection(db, 'orders'), {
                userId: user.uid,
                userEmail: user.email,
                items: cart,
                total: total,
                address: address,
                status: 'pending', // Status awal pesanan
                createdAt: serverTimestamp()
            });

            // 2. Kosongkan keranjang
            clearCart();

            // 3. Redirect ke halaman sukses
            navigate('/order-success');

        } catch (error) {
            console.error("Gagal buat pesanan:", error);
            alert("Gagal membuat pesanan.");
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return <div className="p-10 text-center">Keranjang kosong. Tidak bisa checkout.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Ringkasan Pesanan */}
                <div className="bg-gray-50 p-6 rounded-lg h-fit">
                    <h2 className="text-xl font-semibold mb-4">Ringkasan Barang</h2>
                    <div className="space-y-3 mb-4">
                        {cart.map(item => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span>{item.name} (x{item.quantity})</span>
                                <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t pt-4 font-bold text-lg flex justify-between">
                        <span>Total Bayar</span>
                        <span>Rp {total.toLocaleString('id-ID')}</span>
                    </div>
                </div>

                {/* Formulir Pengiriman */}
                <div>
                    <form onSubmit={handleOrder} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                            <textarea
                                required
                                rows={4}
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Jl. Mawar No. 123, Jakarta Selatan..."
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
                        >
                            {loading ? 'Memproses...' : 'Buat Pesanan'}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}