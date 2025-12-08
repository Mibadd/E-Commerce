import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (err: unknown) {
            console.error(err);
            if (err instanceof Error) setError(err.message);
            else setError('Gagal mendaftar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-rich-charcoal px-4 relative overflow-hidden">

            {/* Dekorasi Background */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-soft-gold/5 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-luxury-gold/5 rounded-full blur-[150px] pointer-events-none"></div>

            {/* KARTU REGISTER: Solid Soft Cream */}
            <div className="bg-soft-cream p-8 md:p-12 rounded-2xl shadow-2xl w-full max-w-md relative z-10 border border-warm-beige">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-serif font-bold text-rich-charcoal mb-2 tracking-wide">
                        Join Aestilo
                    </h2>
                    <p className="text-mocha-grey text-sm font-medium">
                        Mulai perjalanan gaya elegan Anda
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-6 text-sm text-center font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label className="block text-rich-charcoal text-xs font-bold mb-2 ml-1 uppercase tracking-wider">
                            Email Address
                        </label>
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
                            placeholder="Min. 6 karakter"
                            required
                            minLength={6}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-rich-charcoal text-white font-bold py-4 rounded-lg hover:bg-luxury-gold hover:text-rich-charcoal hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2 tracking-wide uppercase text-sm"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-light-taupe/30 pt-6">
                    <p className="text-sm text-mocha-grey">
                        Sudah punya akun?{' '}
                        <Link to="/login" className="text-rich-charcoal font-bold hover:text-luxury-gold underline transition">
                            Masuk di sini
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}