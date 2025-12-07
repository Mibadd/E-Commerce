import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";

export default function Navbar() {
  const { user } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  return (
    // UBAH: Tambahkan sticky, z-index tinggi, dan backdrop-blur agar transparan
    <nav className="sticky top-0 z-50 bg-blue-600/95 backdrop-blur-sm text-white shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo dengan efek hover halus */}
          <Link
            to="/"
            className="text-2xl font-bold tracking-wide hover:text-blue-100 transition duration-200 flex items-center gap-2"
          >
            🛍️ <span className="hidden sm:inline">TokoKita</span>
          </Link>

          {/* Menu Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="hover:text-blue-200 font-medium transition duration-200"
            >
              Home
            </Link>

            {/* Link Keranjang dengan Animasi Badge */}
            <Link
              to="/cart"
              className="relative group hover:text-blue-200 transition duration-200 flex items-center"
            >
              <span className="text-xl">🛒</span>
              <span className="hidden sm:inline ml-1">Keranjang</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-blue-600 shadow-sm animate-bounce">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Divider Tipis */}
            <div className="h-6 w-px bg-blue-400/50 hidden sm:block"></div>

            {/* LOGIKA AUTH */}
            {user ? (
              <div className="flex items-center gap-4">
                {/* Email User */}
                <span className="text-sm font-medium bg-blue-700/50 px-3 py-1 rounded-full border border-blue-500 hidden md:inline-block">
                  👤 {user.email?.split("@")[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-white/10 hover:bg-red-500 hover:text-white text-white border border-white/20 px-4 py-1.5 rounded-full text-sm font-medium transition duration-300 backdrop-blur-md"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="hover:text-blue-100 font-medium transition px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full text-sm font-bold shadow-md transition transform hover:scale-105"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
