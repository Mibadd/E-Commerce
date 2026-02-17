import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import type { Product } from "../types/product";
import { seedDatabase } from "../services/seeder";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; // Auth untuk Admin
import InfiniteMarquee from "../components/InfiniteMarquee";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { user } = useAuth();

    // --- PARALLAX & MOUSE EFFECT ---
    const { scrollY } = useScroll();
    const yHero = useTransform(scrollY, [0, 500], [0, 200]); // Efek Parallax text

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useSpring(x, { stiffness: 50, damping: 20 });
    const mouseY = useSpring(y, { stiffness: 50, damping: 20 });

    function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
        const { clientX, clientY, currentTarget } = event;
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        x.set((clientX - centerX) / 25);
        y.set((clientY - centerY) / 25);
    }

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, "products"));
            const productsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Product[];
            setProducts(productsData);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSeed = async () => {
        if (!user) return;
        await seedDatabase();
        window.location.reload();
    };

    if (loading)
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-soft-cream">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-luxury-gold"></div>
            </div>
        );

    return (
        <div className="bg-soft-cream min-h-screen overflow-x-hidden selection:bg-luxury-gold selection:text-white">

            {/* --- 1. HERO SECTION (IMPROVED) --- */}
            <section
                className="relative min-h-screen flex items-center justify-center bg-rich-charcoal overflow-hidden pt-20"
                onMouseMove={handleMouseMove}
            >
                {/* Background Gradients */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(62,58,54,1)_0%,rgba(18,16,14,1)_100%)]"></div>
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-luxury-gold/5 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 w-full">

                    {/* Text Content */}
                    <motion.div style={{ y: yHero }} className="text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="inline-block py-2 px-6 rounded-full border border-white/10 bg-white/5 text-soft-gold text-xs font-bold tracking-[0.2em] uppercase mb-6 backdrop-blur-md">
                                The 2026 Collection
                            </span>
                            <h1 className="text-6xl md:text-8xl font-serif font-medium text-white-pearl leading-[1.1] mb-8">
                                Redefine <br />
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-luxury-gold to-white italic">Elegance.</span>
                            </h1>
                            <p className="text-lg text-light-taupe/80 mb-10 max-w-lg mx-auto lg:mx-0 font-light leading-relaxed">
                                Temukan harmoni antara keindahan klasik dan fungsionalitas modern. Dikurasi khusus untuk pribadi yang istimewa.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}
                                    className="bg-white-pearl text-rich-charcoal px-10 py-4 rounded-full font-bold text-sm uppercase tracking-widest shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] transition-all"
                                >
                                    Shop Now
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* 3D Image */}
                    <motion.div
                        style={{ x: mouseX, y: mouseY, rotateX: mouseY, rotateY: mouseX }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative z-10 w-[500px] mx-auto">
                            {/* Main Hero Image */}
                            <img
                                src="https://placehold.co/600x800/png?text=Luxury+Bag"
                                alt="Hero Product"
                                className="w-full h-auto drop-shadow-2xl object-contain transform hover:scale-105 transition duration-700"
                            />

                            {/* Floating Badge 1 */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-20 -left-10 bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20 shadow-2xl"
                            >
                                <p className="text-white text-xs font-bold">⭐ Premium Quality</p>
                            </motion.div>

                            {/* Floating Badge 2 */}
                            <motion.div
                                animate={{ y: [0, 20, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-20 -right-5 bg-luxury-gold text-rich-charcoal p-5 rounded-full shadow-2xl flex flex-col items-center justify-center w-24 h-24"
                            >
                                <span className="text-xs font-bold uppercase">New</span>
                                <span className="text-xl font-bold">2026</span>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 flex flex-col items-center gap-2"
                >
                    <span className="text-[10px] uppercase tracking-widest">Scroll</span>
                    <div className="w-px h-12 bg-linear-to-b from-white/0 via-white/50 to-white/0"></div>
                </motion.div>
            </section>

            {/* --- 2. MARQUEE & CLAY (Visual Break) --- */}
            <div className="py-10 bg-soft-cream">
                <InfiniteMarquee />
            </div>

            {/* --- 3. SERVICE GUARANTEE (Trust Signals) --- */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: "💎", title: "100% Authentic", desc: "Jaminan keaslian produk atau uang kembali 2x lipat." },
                        { icon: "🚀", title: "Express Shipping", desc: "Pengiriman cepat dan aman ke seluruh Indonesia." },
                        { icon: "🛡️", title: "Secure Payment", desc: "Transaksi aman dengan enkripsi tingkat lanjut." }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -10 }}
                            className="bg-white-pearl p-8 rounded-3xl border border-warm-beige/50 text-center hover:shadow-xl transition-all duration-300"
                        >
                            <div className="text-4xl mb-4">{item.icon}</div>
                            <h3 className="text-xl font-serif font-bold text-rich-charcoal mb-2">{item.title}</h3>
                            <p className="text-sm text-mocha-grey leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* --- 4. CATALOG SECTION (Clean & Minimal) --- */}
            <section id="catalog" className="max-w-7xl mx-auto px-6 pb-32">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <h2 className="text-5xl font-serif font-bold text-rich-charcoal mb-4">
                            Curated Collection
                        </h2>
                        <div className="h-1 w-24 bg-luxury-gold"></div>
                    </div>

                    {/* Filter / Sort could go here */}
                    <div className="flex gap-2">
                        <button onClick={fetchProducts} className="px-6 py-3 rounded-full border border-rich-charcoal/10 hover:bg-rich-charcoal hover:text-white transition text-sm font-bold uppercase tracking-wider">
                            Refresh Collection
                        </button>
                    </div>
                </div>

                {products.length === 0 ? (
                    // --- EMPTY STATE ---
                    <div className="text-center py-24 bg-white-pearl rounded-[3rem] border border-dashed border-light-taupe relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                        <div className="relative z-10">
                            <div className="text-7xl mb-6 grayscale opacity-50">📦</div>
                            <h3 className="text-2xl font-bold text-rich-charcoal mb-2">Katalog Sedang Disiapkan</h3>
                            <p className="text-mocha-grey mb-8">Nantikan koleksi terbaru kami segera.</p>

                            {/* ADMIN ONLY BUTTON */}
                            {user && (
                                <button
                                    onClick={handleSeed}
                                    className="bg-rich-charcoal text-white px-8 py-3 rounded-xl hover:bg-luxury-gold font-bold shadow-lg transition-all"
                                >
                                    🌱 Generate Dummy Data
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    // --- PRODUCT GRID ---
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group cursor-pointer"
                            >
                                {/* Image Container */}
                                <div className="relative aspect-4/5 bg-warm-beige/20 rounded-2xl overflow-hidden mb-6">
                                    <span className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-rich-charcoal rounded-md">
                                        {product.category || "Exclusive"}
                                    </span>

                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition duration-1000 ease-out"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "https://placehold.co/400x500?text=Aestilo";
                                        }}
                                    />

                                    {/* Overlay Action */}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                            className="bg-white text-rich-charcoal px-8 py-3 rounded-full font-bold uppercase text-xs tracking-widest transform translate-y-4 group-hover:translate-y-0 transition duration-300 hover:bg-luxury-gold hover:text-white shadow-xl"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>

                                {/* Info */}
                                <div>
                                    <h3 className="text-lg font-serif font-bold text-rich-charcoal group-hover:text-luxury-gold transition-colors">
                                        {product.name}
                                    </h3>
                                    <div className="flex justify-between items-center mt-2 border-t border-rich-charcoal/5 pt-3">
                                        <p className="text-sm text-mocha-grey line-clamp-1">{product.description}</p>
                                        <span className="text-lg font-bold text-rich-charcoal">
                                            Rp {product.price?.toLocaleString("id-ID")}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* --- 5. INTERACTIVE FOOTER TEASER --- */}
            <div className="bg-rich-charcoal py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-serif text-white-pearl mb-6">
                        Experience the Art of Style
                    </h2>
                    <p className="text-light-taupe mb-10 max-w-xl mx-auto">
                        Bergabunglah dengan newsletter kami untuk mendapatkan akses eksklusif ke koleksi terbatas dan penawaran khusus.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-luxury-gold flex-1"
                        />
                        <button className="px-8 py-4 rounded-full bg-luxury-gold text-rich-charcoal font-bold uppercase tracking-widest hover:bg-white transition">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}