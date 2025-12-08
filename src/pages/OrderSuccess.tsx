import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function OrderSuccess() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-soft-cream relative overflow-hidden">

            {/* Confetti / Dekorasi Latar Belakang */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-luxury-gold rounded-full opacity-50 animate-bounce"></div>
                <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-soft-gold rounded-full opacity-30 animate-pulse"></div>
                <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-rich-charcoal rounded-full opacity-20"></div>
            </div>

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="bg-white-pearl p-10 md:p-16 rounded-[3rem] shadow-2xl max-w-lg border border-warm-beige relative z-10"
            >
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 text-6xl shadow-inner">
                    🎉
                </div>

                <h1 className="text-4xl font-serif font-bold text-rich-charcoal mb-4">
                    Thank You!
                </h1>
                <p className="text-mocha-grey mb-8 leading-relaxed font-medium">
                    Pesanan Anda telah kami terima. <br />
                    Konfirmasi telah dikirim ke email Anda. <br />
                    Siap-siap tampil lebih elegan bersama <span className="text-luxury-gold font-bold">Aestilo</span>.
                </p>

                <div className="space-y-4">
                    <Link
                        to="/"
                        className="block w-full bg-rich-charcoal text-white-pearl px-8 py-3.5 rounded-xl font-bold uppercase tracking-wide hover:bg-luxury-gold hover:text-rich-charcoal transition-all duration-300 shadow-lg"
                    >
                        Kembali Belanja
                    </Link>

                    <button className="text-sm text-light-taupe hover:text-rich-charcoal underline transition">
                        Cek Status Pesanan
                    </button>
                </div>
            </motion.div>
        </div>
    );
}