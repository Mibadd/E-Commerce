import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import logoAestilo from '../assets/logo.jpg';

export default function Navbar() {
    const { user } = useAuth();
    const { totalItems } = useCart();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Gagal logout:", error);
        }
    };

    return (
        // UPDATE: Menggunakan warna dari tema baru (white-pearl, rich-charcoal, light-taupe)
        <nav className="sticky top-0 z-50 bg-white-pearl/90 backdrop-blur-md text-rich-charcoal shadow-sm border-b border-light-taupe/30 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">

                    {/* Logo & Brand */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <img
                            src={logoAestilo}
                            alt="Aestilo Logo"
                            // UPDATE: Border menggunakan soft-gold
                            className="h-10 w-10 rounded-full object-cover border border-soft-gold group-hover:border-luxury-gold transition duration-300"
                        />
                        {/* UPDATE: Text menggunakan font serif dan rich-charcoal */}
                        <span className="text-2xl font-bold tracking-widest font-serif text-rich-charcoal group-hover:text-muted-bronze transition duration-200">
                            AESTILO
                        </span>
                    </Link>

                    {/* Menu Links */}
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="font-medium hover:text-muted-bronze transition duration-200 tracking-wide text-sm uppercase">
                            Home
                        </Link>

                        <Link to="/cart" className="relative group hover:text-muted-bronze transition duration-200 flex items-center">
                            <span className="text-2xl">🛒</span>
                            {totalItems > 0 && (
                                // UPDATE: Badge menggunakan luxury-gold
                                <span className="absolute -top-2 -right-2 bg-luxury-gold text-rich-charcoal text-[10px] font-bold px-2 py-0.5 rounded-full border border-white shadow-sm">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        <div className="h-6 w-px bg-light-taupe hidden sm:block"></div>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-mocha-grey hidden md:inline-block">
                                    Halo, {user.email?.split('@')[0]}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="border border-rich-charcoal text-rich-charcoal px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-rich-charcoal hover:text-soft-cream transition duration-300"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-4">
                                <Link to="/login" className="text-sm font-bold uppercase tracking-wider hover:text-muted-bronze transition px-2 py-2">
                                    Login
                                </Link>
                                <Link to="/register" className="bg-rich-charcoal text-soft-cream px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg hover:bg-muted-bronze hover:shadow-xl transition transform hover:-translate-y-0.5">
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