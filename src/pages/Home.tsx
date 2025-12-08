import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import type { Product } from "../types/product";
import { seedDatabase } from "../services/seeder";
import { useCart } from "../context/CartContext";
import InteractiveClay from "../components/InteractiveClay";
import InfiniteMarquee from "../components/InfiniteMarquee";
import { motion, useMotionValue, useTransform } from "framer-motion";

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    const { addToCart } = useCart();

    // --- LOGIC 3D MOUSE EFFECT ---
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [0, 500], [10, -10]);
    const rotateY = useTransform(x, [0, 500], [-10, 10]);

    function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(event.clientX - rect.left);
        y.set(event.clientY - rect.top);
    }

    const fetchProducts = async () => {
        setLoading(true);
        setErrorMsg("");
        try {
            const querySnapshot = await getDocs(collection(db, "products"));
            const productsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
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

    if (loading)
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-soft-cream">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-luxury-gold"></div>
                <p className="mt-4 text-rich-charcoal font-medium animate-pulse">
                    Menyiapkan butik...
                </p>
            </div>
        );

    return (
        <div className="bg-soft-cream min-h-screen overflow-x-hidden">

            {/* --- HERO SECTION --- */}
            <div
                className="relative bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-[#3E3A36] via-[#252220] to-[#12100e] text-soft-cream overflow-hidden mb-0 shadow-2xl perspective-1000"
                onMouseMove={handleMouse}
                onMouseLeave={() => { x.set(250); y.set(250); }}
            >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-soft-gold/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 flex flex-col-reverse md:flex-row items-center justify-between min-h-[650px]">
                    <div className="md:w-1/2 mt-12 md:mt-0 text-center md:text-left z-20">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <span className="inline-block py-1.5 px-5 rounded-full bg-luxury-gold text-rich-charcoal text-xs font-bold tracking-widest uppercase mb-6 shadow-md">
                                New Arrivals 2024
                            </span>
                            <h1 className="text-5xl md:text-7xl font-serif font-extrabold mb-6 leading-tight text-white-pearl drop-shadow-xl">
                                Luxury Essentials <br />
                                <span className="text-soft-gold italic font-light">
                                    For Modern Life.
                                </span>
                            </h1>
                            <p className="text-lg text-light-taupe mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed font-normal">
                                Tas kulit premium dan aksesoris pintar yang dirancang untuk meningkatkan gaya hidup profesional Anda.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}
                                    className="bg-linear-to-r from-luxury-gold to-soft-gold text-rich-charcoal px-10 py-4 rounded-full font-bold text-sm uppercase tracking-wide shadow-[0_0_25px_rgba(191,161,102,0.5)] hover:shadow-[0_0_35px_rgba(191,161,102,0.7)] transition-all border border-transparent"
                                >
                                    Shop Collection
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => document.getElementById("interactive-zone")?.scrollIntoView({ behavior: "smooth" })}
                                    className="border-2 border-light-taupe/50 text-white-pearl px-10 py-4 rounded-full font-bold text-sm uppercase tracking-wide transition backdrop-blur-sm"
                                >
                                    Experience 3D ✨
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>

                    <div className="md:w-1/2 flex justify-center relative h-full w-full items-center">
                        <motion.div
                            style={{ rotateX, rotateY, z: 100 }}
                            className="relative z-10 w-[320px] md:w-[420px] cursor-pointer"
                        >
                            <div className="relative group">
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-soft-gold/20 rounded-full blur-3xl group-hover:bg-soft-gold/30 transition-all duration-500"></div>
                                <motion.img
                                    src="https://placehold.co/600x600/transparent/white?text=Signature+Tote"
                                    alt="Aestilo Signature Bag"
                                    className="w-full h-auto drop-shadow-2xl transform transition-transform duration-500"
                                    animate={{ y: [0, -20, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                />
                            </div>
                            <motion.div
                                className="absolute -bottom-12 -right-4 bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-2xl shadow-2xl flex flex-col gap-3 w-64"
                                animate={{ y: [0, 15, 0] }}
                                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-soft-gold text-xs font-bold uppercase tracking-wider">Best Seller</p>
                                        <h3 className="text-white font-serif text-lg leading-tight">Signature Tote Leather</h3>
                                    </div>
                                    <span className="text-white font-bold">4.9 ★</span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-white-pearl font-bold text-lg">Rp 1.2jt</span>
                                    <div className="w-8 h-8 rounded-full bg-luxury-gold flex items-center justify-center text-rich-charcoal shadow-lg">
                                        +
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div
                                className="absolute top-0 -left-8 bg-rich-charcoal/80 backdrop-blur-md border border-light-taupe/30 px-4 py-2 rounded-lg shadow-xl"
                                animate={{ x: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <p className="text-soft-cream text-xs font-medium">✨ Premium Leather</p>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <InfiniteMarquee />

            <div id="interactive-zone" className="mt-12">
                <InteractiveClay />
            </div>

            {/* --- KATALOG SECTION (HUMAN FRIENDLY & INTERACTIVE CARD) --- */}
            <div id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 mt-16">

                {/* Header & Error (Sama) */}
                {errorMsg && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded shadow flex justify-between items-center">
                        <div>
                            <p className="font-bold">Gagal Memuat Data</p>
                            <p className="text-sm">{errorMsg}</p>
                        </div>
                        <button onClick={fetchProducts} className="text-sm underline hover:text-red-900">Coba Lagi</button>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-end mb-8 border-b border-light-taupe/50 pb-4 gap-4">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-rich-charcoal">
                            Katalog Produk
                        </h2>
                        <p className="text-mocha-grey mt-1">
                            Koleksi terkurasi untuk gaya hidup Anda
                        </p>
                    </div>
                    <button
                        onClick={fetchProducts}
                        className="text-rich-charcoal hover:text-soft-gold font-medium flex items-center gap-1 transition bg-warm-beige/30 px-4 py-2 rounded-lg hover:bg-warm-beige"
                    >
                        🔄 Refresh Data
                    </button>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-white-pearl rounded-2xl shadow-sm border border-dashed border-light-taupe">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-bold text-rich-charcoal mb-2">
                            Produk Belum Tersedia
                        </h3>
                        <button
                            onClick={handleSeed}
                            className="bg-rich-charcoal text-white-pearl px-6 py-2.5 rounded-lg hover:bg-muted-bronze font-bold shadow-md hover:shadow-lg transition transform hover:-translate-y-1 mt-4"
                        >
                            🌱 Generate Data Dummy
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                viewport={{ once: true }}
                                className="group relative bg-white-pearl rounded-2xl border border-light-taupe/30 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                            >
                                {/* --- IMAGE AREA --- */}
                                <div className="relative h-72 overflow-hidden bg-warm-beige/20">

                                    {/* Badge Category (Kiri Atas) */}
                                    <span className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur text-rich-charcoal text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                        {product.category || "General"}
                                    </span>

                                    {/* Wishlist Button (Kanan Atas - Visual Only) */}
                                    <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-red-500 transition shadow-sm backdrop-blur-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>

                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700 ease-out"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                "https://placehold.co/400?text=No+Image";
                                        }}
                                    />

                                    {/* Quick Action Overlay (Muncul saat Hover) */}
                                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-linear-to-t from-black/60 to-transparent flex justify-center">
                                        <span className="text-white text-xs font-medium tracking-wide opacity-0 group-hover:opacity-100 transition delay-100">
                                            Click to view details
                                        </span>
                                    </div>
                                </div>

                                {/* --- CONTENT AREA --- */}
                                <div className="p-5 flex flex-col grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3
                                            className="text-lg font-serif font-bold text-rich-charcoal leading-snug group-hover:text-luxury-gold transition line-clamp-1"
                                            title={product.name}
                                        >
                                            {product.name}
                                        </h3>
                                    </div>

                                    <p className="text-mocha-grey text-xs mb-4 line-clamp-2 leading-relaxed">
                                        {product.description}
                                    </p>

                                    <div className="mt-auto pt-4 border-t border-light-taupe/30 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-light-taupe uppercase tracking-widest font-bold">Price</span>
                                            <span className="text-lg font-bold text-rich-charcoal">
                                                Rp {product.price?.toLocaleString("id-ID")}
                                            </span>
                                        </div>

                                        {/* Tombol Add to Cart yang lebih interaktif */}
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => addToCart(product)}
                                            className="flex items-center gap-2 bg-rich-charcoal text-soft-cream px-4 py-2.5 rounded-full hover:bg-luxury-gold hover:text-rich-charcoal shadow-lg transition-all duration-300 group/btn"
                                        >
                                            <span className="text-xs font-bold uppercase tracking-wide">Add</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}