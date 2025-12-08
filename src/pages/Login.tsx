import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (err: unknown) {
            console.error(err);
            setError('Email atau password salah.');
        } finally {
            setLoading(false);
        }
    };

    return (
        // Background Gelap Pekat (Kontras dengan kartu)
        <div className="min-h-screen flex items-center justify-center bg-rich-charcoal px-4 relative overflow-hidden">

            {/* Dekorasi Emas Halus di Background (Tidak mengganggu teks) */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-luxury-gold/5 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-soft-gold/5 rounded-full blur-[150px] pointer-events-none"></div>

            {/* KARTU LOGIN: Solid Soft Cream (Jelas & Bersih) */}
            <div className="bg-soft-cream p-8 md:p-12 rounded-2xl shadow-2xl w-full max-w-md relative z-10 border border-warm-beige">

                <div className="text-center mb-10">
                    <h2 className="text-3xl font-serif font-bold text-rich-charcoal mb-2 tracking-wide">
                        Welcome Back
                    </h2>
                    <p className="text-mocha-grey text-sm font-medium">
                        Masuk ke akun Aestilo Anda
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-6 text-sm text-center font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-rich-charcoal text-xs font-bold mb-2 ml-1 uppercase tracking-wider">
                            Email Address
                        </label>
                        {/* Input Jelas: Background Putih, Teks Hitam */}
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-lg bg-white border border-light-taupe text-rich-charcoal focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold outline-none transition shadow-sm placeholder-gray-400"
                            placeholder="nama@email.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-rich-charcoal text-xs font-bold mb-2 ml-1 uppercase tracking-wider">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-lg bg-white border border-light-taupe text-rich-charcoal focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold outline-none transition shadow-sm placeholder-gray-400"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-rich-charcoal text-white font-bold py-4 rounded-lg hover:bg-luxury-gold hover:text-rich-charcoal hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2 tracking-wide uppercase text-sm"
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-light-taupe/30 pt-6">
                    <p className="text-sm text-mocha-grey">
                        Belum punya akun?{' '}
                        <Link to="/register" className="text-rich-charcoal font-bold hover:text-luxury-gold underline transition">
                            Daftar Member
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}