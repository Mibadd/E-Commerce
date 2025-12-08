import { motion } from "framer-motion";

const MarqueeItem = ({ text }: { text: string }) => {
    return (
        <div className="flex items-center gap-16 px-4">
            {/* Teks Emas Mewah */}
            <span className="text-2xl md:text-3xl font-serif font-bold uppercase text-soft-gold tracking-[0.2em]">
                {text}
            </span>
            {/* Divider Titik Diamond Kecil */}
            <span className="text-xs text-white-pearl/20 rotate-45">■</span>
        </div>
    );
};

export default function InfiniteMarquee() {
    const words = [
        "Exclusive Collection",
        "Premium Quality",
        "Timeless Design",
        "Free Shipping",
        "Authentic 100%",
        "Luxury Lifestyle",
    ];

    return (
        // UBAH: Background jadi Rich Charcoal agar menyatu dengan Hero
        <div className="relative w-full overflow-hidden bg-rich-charcoal py-10 border-y border-white/5 shadow-inner z-20">

            {/* UBAH: Gradient Fade kiri-kanan disesuaikan dengan warna background gelap */}
            <div className="absolute top-0 left-0 w-32 h-full bg-linear-to-r from-rich-charcoal to-transparent z-10"></div>
            <div className="absolute top-0 right-0 w-32 h-full bg-linear-to-l from-rich-charcoal to-transparent z-10"></div>

            <div className="flex whitespace-nowrap">
                <motion.div
                    className="flex"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 25, // Sedikit lebih lambat agar terbaca elegan
                    }}
                >
                    {/* Render 2x untuk looping seamless */}
                    {[...words, ...words].map((word, index) => (
                        <MarqueeItem key={index} text={word} />
                    ))}
                </motion.div>
            </div>
        </div>
    );
}