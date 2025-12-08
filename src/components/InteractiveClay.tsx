import { motion } from 'framer-motion';

const clayStyles = {
    container: "relative w-full h-[600px] bg-[#f0f4f8] overflow-hidden flex items-center justify-center rounded-3xl shadow-inner",
    clayObject: "cursor-grab active:cursor-grabbing shadow-[10px_10px_20px_#d1d9e6,-10px_-10px_20px_#ffffff] border border-white/40",
};

const floatingItems = [
    { id: 1, text: "Sepatu", color: "bg-blue-400", size: "w-32 h-20", x: -100, y: -100, rotate: 10 },
    { id: 2, text: "Diskon 50%", color: "bg-red-400", size: "w-40 h-40 rounded-full", x: 150, y: -50, rotate: -15 },
    { id: 3, text: "Elektronik", color: "bg-yellow-400", size: "w-36 h-24", x: -50, y: 120, rotate: 5 },
    { id: 4, text: "Fashion", color: "bg-purple-400", size: "w-28 h-28 rounded-full", x: 180, y: 100, rotate: -20 },
];

export default function InteractiveClay() {
    return (
        <div className="py-10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-700">Area Interaktif (Coba Seret!)</h2>
                    <p className="text-gray-500">Mainkan elemen di bawah ini. Mereka menggunakan gaya Claymorphism.</p>
                </div>

                <div className={clayStyles.container}>

                    <h1 className="text-6xl md:text-8xl font-black text-gray-300/50 absolute pointer-events-none select-none tracking-widest">
                        AESTILO
                    </h1>

                    {floatingItems.map((item) => (
                        <motion.div
                            key={item.id}
                            drag // Mengaktifkan fitur seret
                            dragConstraints={{ left: -300, right: 300, top: -200, bottom: 200 }}
                            dragElastic={0.2}
                            whileHover={{ scale: 1.1, rotate: 0 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ x: item.x, y: item.y, rotate: item.rotate, opacity: 0 }}
                            whileInView={{ opacity: 1, transition: { duration: 0.5 } }}
                            className={`${clayStyles.clayObject} ${item.color} ${item.size} absolute flex items-center justify-center rounded-4xl text-white font-bold text-lg backdrop-blur-sm z-10`}
                        >
                            {item.text}
                        </motion.div>
                    ))}

                    <motion.div
                        drag
                        className="w-64 h-64 bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-[20px_20px_40px_#d1d9e6,-20px_-20px_40px_#ffffff] z-20 flex flex-col items-center justify-center p-6 text-center cursor-grab active:cursor-grabbing"
                        animate={{
                            y: [0, -20, 0],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <span className="text-6xl mb-2">🛍️</span>
                        <h3 className="text-2xl font-bold text-gray-700">Belanja Seru</h3>
                        <p className="text-sm text-gray-500 mt-2">Seret aku kemana saja sesukamu!</p>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}