import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/auth';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ShieldCheck, ArrowUpRight, Sparkle, Ticket, Music2 } from 'lucide-react';
import { Blobs } from '../animations';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (!showOTP) {
                const data = await login(email, password);
                if (data.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            } else {
                const data = await verifyOTP(email, otp);
                if (data.role === 'admin') navigate('/admin');
                else navigate('/dashboard');
            }
        } catch (err) {
            if (err.needsVerification) {
                setShowOTP(true);
                setError('Account requires OTP verification. A code has been sent to your email.');
            } else {
                setError(err.message || err || 'Login failed.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-10 pt-28 sm:pt-24">
            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-[2.5rem] border border-black/5 bg-white shadow-[0_40px_100px_-30px_rgba(13,13,17,0.4)] lg:grid-cols-2 dark:border-dark-line dark:bg-dark-surface"
            >
                {/* Left branding panel */}
                <div className="relative hidden overflow-hidden border-r border-black/5 bg-brand-light p-10 lg:flex lg:flex-col lg:justify-between dark:border-dark-line dark:bg-dark-page">
                    <Blobs />

                    <div className="relative z-10">
                        <Link to="/" className="flex items-center gap-2.5">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-purple shadow-[0_8px_22px_-8px_rgba(186,40,226,0.5)]">
                                <Sparkle className="h-5 w-5 text-white" fill="white" />
                            </div>
                            <span className="font-display text-2xl uppercase tracking-wide text-brand-dark dark:text-dark-ink">eventrix</span>
                        </Link>
                    </div>

                    <div className="relative z-10 space-y-5">
                        <div className="hero-sticker sticker -left-4 top-10 bg-brand-lime px-4 py-2 text-[10px] text-brand-dark animate-float">
                            VIP access pass
                        </div>
                        <div className="hero-sticker sticker -right-4 bottom-24 bg-brand-orange px-4 py-2 text-[10px] text-white animate-float-slow">
                            <Music2 className="mr-1 inline h-3 w-3" /> Live tonight
                        </div>

                        <span className="inline-flex items-center gap-2 rounded-full border border-brand-purple/20 bg-white px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-purple dark:bg-dark-surface">
                            <Ticket className="h-3.5 w-3.5" /> Welcome back
                        </span>
                        <h2 className="font-display text-4xl uppercase leading-[0.95] text-brand-dark sm:text-5xl dark:text-dark-ink">
                            Missed you at <br /> <span className="text-gradient-brand">the front row</span>
                        </h2>
                        <p className="max-w-sm text-sm leading-relaxed text-gray-500 dark:text-dark-muted">
                            Sign in to manage your digital QR passes, explore live festivals, or publish your own event.
                        </p>
                    </div>

                    <div className="relative z-10 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-dark-muted">
                        <ShieldCheck className="h-4 w-4 text-brand-purple" /> 2FA OTP encrypted sign-in
                    </div>
                </div>

                {/* Right form */}
                <div className="flex flex-col justify-center p-8 sm:p-12">
                    <div className="space-y-1.5">
                        <h2 className="font-display text-3xl uppercase tracking-tight">Sign in</h2>
                        <p className="text-sm font-semibold text-gray-500 dark:text-dark-muted">Access your Eventrix account</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs font-bold text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                        {!showOTP ? (
                            <>
                                <div className="space-y-1.5">
                                    <label className="block text-[11px] font-black uppercase tracking-wider text-gray-700 dark:text-dark-muted">Email address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            required
                                            placeholder="you@domain.com"
                                            className="w-full rounded-2xl border border-black/10 bg-brand-light py-3.5 pl-11 pr-4 text-sm font-semibold outline-none transition-colors focus:border-brand-purple dark:border-dark-line dark:bg-dark-surface-2 dark:text-dark-ink dark:placeholder-dark-muted"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-[11px] font-black uppercase tracking-wider text-gray-700 dark:text-dark-muted">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="password"
                                            required
                                            placeholder="••••••••"
                                            className="w-full rounded-2xl border border-black/10 bg-brand-light py-3.5 pl-11 pr-4 text-sm font-semibold outline-none transition-colors focus:border-brand-purple dark:border-dark-line dark:bg-dark-surface-2 dark:text-dark-ink dark:placeholder-dark-muted"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-3">
                                <div className="rounded-2xl border border-brand-purple/20 bg-brand-purple/5 p-3.5 text-xs font-bold text-brand-purple dark:border-brand-purple/30 dark:bg-brand-purple/10">
                                    Enter the 6-digit OTP code sent to <strong>{email}</strong>:
                                </div>
                                <input
                                    type="text"
                                    required
                                    maxLength="6"
                                    placeholder="000000"
                                    className="w-full rounded-2xl border-2 border-brand-purple/40 bg-brand-light py-3.5 text-center font-mono text-2xl font-black tracking-[0.5em] outline-none transition-colors focus:border-brand-purple dark:bg-dark-surface-2 dark:text-dark-ink"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-gradient flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-xs font-extrabold uppercase tracking-wider text-white disabled:opacity-60"
                        >
                            {loading ? 'Authenticating...' : (showOTP ? 'Verify OTP & sign in' : 'Sign in')}
                            {!loading && <ArrowUpRight className="h-4 w-4" />}
                        </button>
                    </form>

                    <p className="mt-6 border-t border-black/5 pt-5 text-center text-sm font-semibold text-gray-600 dark:border-dark-line dark:text-dark-muted">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-black uppercase text-brand-purple transition-colors hover:text-brand-pink">
                            Register free
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
