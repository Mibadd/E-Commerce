import { Link } from "react-router-dom";

export default function OrderSuccess() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-green-600 mb-2">
          Pesanan Berhasil!
        </h1>
        <p className="text-gray-600 mb-6">
          Terima kasih telah berbelanja. Pesanan Anda sedang kami proses.
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Kembali ke Home
        </Link>
      </div>
    </div>
  );
}
