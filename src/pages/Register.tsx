import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) setError(err.message);
      else setError("Gagal mendaftar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-900 to-blue-600 px-4">
      {/* Dekorasi Background */}
      <div className="absolute inset-0 bg-[url('https://placehold.co/1920x1080/1e40af/ffffff?text=.')] opacity-5 pointer-events-none"></div>

      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10 transform transition-all hover:scale-[1.01]">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
            Buat Akun Baru 🚀
          </h2>
          <p className="text-gray-500">Gabung dan nikmati promo spesial!</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded mb-6 text-sm animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2 ml-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition duration-200"
              placeholder="nama@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2 ml-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition duration-200"
              placeholder="Minimal 6 karakter"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-lg hover:bg-blue-700 hover:shadow-lg active:scale-95 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-bold hover:underline hover:text-blue-800 transition"
          >
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
