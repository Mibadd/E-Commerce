import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import type { Product } from '../types/product';
import { seedDatabase } from '../services/seeder';
import { useCart } from '../context/CartContext';

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    const { addToCart } = useCart();

    const fetchProducts = async () => {
        setLoading(true);
        setErrorMsg('');
        try {
            const querySnapshot = await getDocs(collection(db, "products"));
            const productsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Product[];
            setProducts(productsData);
        } catch (error: unknown) {
            console.error("❌ Error fetch:", error);
            if (error instanceof Error) setErrorMsg(error.message);
            else setErrorMsg("Gagal mengambil data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSeed = async () => {
        await seedDatabase();
        window.location.reload();
    };

    // Loading State yang lebih cantik
    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            <p className="mt-4 text-gray-500 font-medium animate-pulse">Menyiapkan toko...</p>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* --- HERO SECTION (Banner Atas) --- */}
            <div className="relative bg-linear-to-br from-blue-600 to-indigo-800 text-white overflow-hidden mb-12 shadow-xl">
                {/* Background Pattern Abstrak */}
                <div className="absolute inset-0 bg-[url('https://placehold.co/1920x600/1e40af/ffffff?text=.')] opacity-5"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 flex flex-col md:flex-row items-center justify-between">
                    <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
                        <span className="inline-block py-1 px-3 rounded-full bg-blue-500/30 border border-blue-400 text-sm font-semibold mb-4 backdrop-blur-sm">
                            🎉 Promo Spesial Minggu Ini
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                            Belanja Hemat, <br /> <span className="text-yellow-400">Gaya Maksimal!</span>
                        </h1>
                        <p className="text-lg text-blue-100 mb-8 max-w-lg mx-auto md:mx-0">
                            Temukan koleksi terbaik dengan harga yang pas di kantong. Kualitas terjamin, pengiriman cepat ke seluruh Indonesia.
                        </p>
                        <button
                            onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
                            className="bg-white text-blue-700 px-8 py-3.5 rounded-full font-bold text-lg shadow-lg hover:bg-gray-100 hover:scale-105 transition transform duration-200"
                        >
                            Mulai Belanja ⬇
                        </button>
                    </div>
                    {/* Gambar Ilustrasi Hero */}
                    <div className="md:w-1/2 flex justify-center">
                        <img
                            src="https://placehold.co/600x400/transparent/white?text=Shopping+Day"
                            alt="Shopping Illustration"
                            className="drop-shadow-2xl transform rotate-2 hover:rotate-0 transition duration-500 max-w-full h-auto"
                        />
                    </div>
                </div>
            </div>

            {/* --- KATALOG SECTION --- */}
            <div id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                {/* Error Message */}
                {errorMsg && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded shadow flex justify-between items-center">
                        <div>
                            <p className="font-bold">Gagal Memuat Data</p>
                            <p className="text-sm">{errorMsg}</p>
                        </div>
                        <button onClick={fetchProducts} className="text-sm underline hover:text-red-900">Coba Lagi</button>
                    </div>
                )}

                {/* Header Katalog */}
                <div className="flex flex-col sm:flex-row justify-between items-end mb-8 border-b border-gray-200 pb-4 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Katalog Produk</h2>
                        <p className="text-gray-500 mt-1">Pilihan terbaik untuk Anda hari ini</p>
                    </div>
                    <button
                        onClick={fetchProducts}
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100"
                    >
                        🔄 Refresh Data
                    </button>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">Produk Belum Tersedia</h3>
                        <p className="text-gray-500 mb-6">Database sepertinya masih kosong.</p>
                        <button
                            onClick={handleSeed}
                            className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 font-bold shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
                        >
                            🌱 Generate Data Dummy
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
                            >
                                {/* Image Container dengan Efek Zoom */}
                                <div className="relative h-56 overflow-hidden bg-gray-100">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://placehold.co/400?text=No+Image';
                                        }}
                                    />
                                    {/* Badge Kategori */}
                                    <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        {product.category || 'UMUM'}
                                    </span>
                                </div>

                                <div className="p-5 flex flex-col grow">
                                    <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition truncate" title={product.name}>
                                        {product.name}
                                    </h3>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 grow">
                                        {product.description}
                                    </p>

                                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-50">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-400">Harga</span>
                                            <span className="text-xl font-bold text-blue-700">
                                                Rp {product.price?.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => addToCart(product)}
                                            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 active:scale-95 transition shadow-md group-hover:shadow-blue-200 flex items-center justify-center"
                                            title="Tambah ke Keranjang"
                                        >
                                            {/* Ikon Plus Cart */}
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}