import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from './firebase';

// Data Dummy (Contoh Produk)
const PRODUCTS_DATA = [
    {
        name: "Sepatu Lari Keren",
        price: 500000,
        description: "Sepatu lari ringan dan nyaman untuk olahraga sehari-hari.",
        imageUrl: "https://placehold.co/400x300/2563eb/white?text=Sepatu+Lari",
        stock: 10,
        category: "Sepatu"
    },
    {
        name: "Kemeja Flanel Kotak",
        price: 250000,
        description: "Kemeja flanel bahan adem, cocok untuk casual maupun semi-formal.",
        imageUrl: "https://placehold.co/400x300/dc2626/white?text=Kemeja+Flanel",
        stock: 25,
        category: "Baju"
    },
    {
        name: "Tas Ransel Laptop",
        price: 350000,
        description: "Tas ransel waterproof dengan slot laptop 15 inch.",
        imageUrl: "https://placehold.co/400x300/4b5563/white?text=Tas+Ransel",
        stock: 5,
        category: "Aksesoris"
    },
    {
        name: "Headphone Bluetooth",
        price: 750000,
        description: "Suara bass mantap, baterai tahan 20 jam.",
        imageUrl: "https://placehold.co/400x300/7c3aed/white?text=Headphone",
        stock: 8,
        category: "Elektronik"
    },
    {
        name: "Jam Tangan Sport",
        price: 150000,
        description: "Tahan air hingga 50m, fitur stopwatch dan alarm.",
        imageUrl: "https://placehold.co/400x300/059669/white?text=Jam+Tangan",
        stock: 15,
        category: "Aksesoris"
    }
];

export const seedDatabase = async () => {
    try {
        const productsCollection = collection(db, "products");

        // 1. Cek dulu apakah database sudah ada isinya agar tidak duplikat
        const snapshot = await getDocs(productsCollection);
        if (!snapshot.empty) {
            console.log("Database sudah berisi data. Seeding dibatalkan.");
            alert("Database sudah ada isinya!");
            return;
        }

        console.log("Mulai mengisi database...");

        // 2. Gunakan Batch untuk performa (mengirim banyak data sekaligus)
        const batch = writeBatch(db);

        PRODUCTS_DATA.forEach((product) => {
            const docRef = doc(productsCollection); // Buat ID otomatis
            batch.set(docRef, product);
        });

        await batch.commit();
        console.log("✅ Berhasil mengisi database dengan data produk!");
        alert("Database berhasil diisi! Silakan refresh halaman.");

    } catch (error) {
        console.error("Gagal mengisi database:", error);
        alert("Gagal mengisi database. Cek console.");
    }
};