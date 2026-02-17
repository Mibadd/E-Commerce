import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore'; // 1. Tambahkan Timestamp disini
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
}

interface Order {
    id: string;
    total: number;
    status: string;
    createdAt: Timestamp; // 2. Ganti 'any' menjadi 'Timestamp'
    items: OrderItem[];
}

export default function Orders() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchOrders = async () => {
            try {
                const q = query(
                    collection(db, 'orders'),
                    where('userId', '==', user.uid),
                    orderBy('createdAt', 'desc') // 3. Urutkan berdasarkan createdAt
                );

                const querySnapshot = await getDocs(q);
                const ordersData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Order[];

                setOrders(ordersData);
            } catch (error) {
                console.error("Gagal mengambil history pesanan:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    if (loading) return (
        <div className="min-h-screen flex justify-center items-center bg-soft-cream">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-luxury-gold"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-soft-cream py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-serif font-bold text-rich-charcoal mb-8 border-b border-light-taupe/30 pb-4">
                    Riwayat Pesanan Saya
                </h1>

                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white-pearl rounded-3xl border border-dashed border-light-taupe">
                        <p className="text-mocha-grey mb-4">Belum ada riwayat pesanan.</p>
                        <Link to="/" className="text-luxury-gold font-bold hover:underline">Mulai Belanja</Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white-pearl p-6 rounded-2xl shadow-sm border border-light-taupe/20 hover:shadow-lg transition-all"
                            >
                                <div className="flex justify-between items-start mb-4 border-b border-light-taupe/10 pb-3">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-light-taupe font-bold">Order ID</p>
                                        <p className="text-xs text-rich-charcoal font-mono">#{order.id}</p>
                                        <p className="text-[10px] text-mocha-grey mt-1">
                                            {/* Logic date tetap sama karena Timestamp punya properti seconds */}
                                            {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString("id-ID", {
                                                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                            }) : 'Baru saja'}
                                        </p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider 
                                        ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                        {order.status}
                                    </div>
                                </div>

                                <div className="space-y-3 mb-4">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex gap-4 items-center">
                                            <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                                <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-rich-charcoal line-clamp-1">{item.name}</p>
                                                <p className="text-xs text-mocha-grey">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center pt-3 border-t border-light-taupe/10">
                                    <span className="text-xs font-bold text-light-taupe uppercase">Total Bayar</span>
                                    <span className="text-lg font-serif font-bold text-luxury-gold">
                                        Rp {order.total.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}