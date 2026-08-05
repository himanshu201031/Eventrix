import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaTicketAlt, FaLock, FaEnvelope, FaUser, FaShieldAlt, FaArrowRight } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (!showOTP) {
                await register(name, email, password);
                setShowOTP(true);
                setError('');
            } else {
                await verifyOTP(email, otp);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(typeof err === 'string' ? err : err.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-8 px-4">
            <div className="w-full max-w-5xl rounded-[2.5rem] bg-[#0c0f19] border border-white/10 overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">

                {/* Left Panel: Festival Branding Graphic */}
                <div className="lg:col-span-6 relative bg-gradient-to-br from-pink-900 via-purple-950 to-[#07090e] p-8 sm:p-12 flex flex-col justify-between overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-80 h-80 bg-pink-500/20 blur-[100px] rounded-full pointer-events-none"></div>
                    <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none"></div>

                    {/* Logo */}
                    <div className="relative z-10">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
                                <FaTicketAlt className="-rotate-12" />
                            </div>
                            <span className="text-2xl font-black tracking-tight text-white">
                                EVENT<span className="text-pink-400">RIX</span>
                            </span>
                        </Link>
                    </div>

                    {/* Graphic Quote / Visual */}
                    <div className="relative z-10 space-y-4 my-12">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-pink-300 border border-white/15 text-[11px] font-bold uppercase tracking-widest">
                            <HiSparkles className="text-amber-300" /> Instant VIP Registration
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                            Join the World’s Most <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                                Dynamic Event Community
                            </span>
                        </h2>
                        <p className="text-gray-300 text-xs sm:text-sm font-normal max-w-sm leading-relaxed">
                            Create a free account in under 30 seconds. Unlock secret ticket drops, early bird VIP passes, and instant 2FA security.
                        </p>
                    </div>

                    {/* Footer Badge */}
                    <div className="relative z-10 text-[11px] text-gray-500 font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span>Zero Spam • Instant Digital Pass Delivery</span>
                    </div>
                </div>

                {/* Right Panel: Clean Dark Form */}
                <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-white tracking-tight">Create Account</h2>
                        <p className="text-xs text-gray-400 font-medium">Join Eventrix today for free</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3.5 rounded-2xl text-xs font-semibold">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!showOTP ? (
                            <>
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">Full Name</label>
                                    <div className="relative">
                                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                                        <input
                                            type="text"
                                            required
                                            placeholder="Alex Rivera"
                                            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">Email Address</label>
                                    <div className="relative">
                                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                                        <input
                                            type="email"
                                            required
                                            placeholder="you@domain.com"
                                            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">Password</label>
                                    <div className="relative">
                                        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
                                        <input
                                            type="password"
                                            required
                                            placeholder="••••••••"
                                            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-3">
                                <div className="p-3 bg-pink-500/10 border border-pink-500/30 rounded-2xl text-xs text-pink-300">
                                    An OTP code was sent to <strong className="text-white">{email}</strong>. Please enter the 6-digit code below to activate your account:
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 text-center">Verification OTP Code</label>
                                    <input
                                        type="text"
                                        required
                                        maxLength="6"
                                        placeholder="000000"
                                        className="w-full py-3 px-4 text-center font-mono font-black text-2xl tracking-[0.5em] rounded-2xl bg-white/5 border border-pink-500/40 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 mt-2"
                        >
                            <span>{loading ? 'Creating Profile...' : (showOTP ? 'Verify & Activate' : 'Sign Up Free')}</span>
                            <FaArrowRight className="text-xs" />
                        </button>
                    </form>

                    {!showOTP && (
                        <div className="text-center pt-2 border-t border-white/10">
                            <p className="text-xs text-gray-400">
                                Already registered?{' '}
                                <Link to="/login" className="text-pink-400 font-bold hover:underline">
                                    Sign In Here
                                </Link>
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Register;