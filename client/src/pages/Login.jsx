import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaLock, FaEnvelope, FaShieldAlt } from 'react-icons/fa';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';

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
        <div className="min-h-[80vh] flex items-center justify-center py-8 px-4">
            <div className="w-full max-w-5xl rounded-[2.5rem] bg-white border border-black/10 overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">

                {/* Left Panel: Electric Purple Graphic Branding */}
                <div className="lg:col-span-6 bg-[#8522FF] text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10 space-y-4">
                        <Link to="/" className="inline-flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-white text-[#8522FF] font-black text-xl flex items-center justify-center">
                                ⌘
                            </div>
                            <span className="font-display font-black text-2xl tracking-tighter uppercase">
                                EVENTRIX®
                            </span>
                        </Link>
                    </div>

                    <div className="relative z-10 space-y-4 my-12">
                        <span className="px-3 py-1 rounded-full bg-[#D2FF00] text-black font-extrabold text-[10px] uppercase">
                            VIP ACCESS PASS
                        </span>
                        <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tighter leading-tight">
                            WELCOME TO THE <br />
                            GLOBAL SHOWCASE
                        </h2>
                        <p className="text-purple-100 text-xs font-medium max-w-sm">
                            Sign in to manage your digital QR passes, explore award showcases, or publish live festival events.
                        </p>
                    </div>

                    <div className="relative z-10 text-[11px] font-bold text-purple-200 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#D2FF00]"></span>
                        <span>2FA OTP ENCRYPTED SIGN-IN</span>
                    </div>
                </div>

                {/* Right Panel: Clean Form */}
                <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center space-y-6">
                    <div className="space-y-1">
                        <h2 className="font-display font-black text-3xl text-black uppercase tracking-tight">Sign In</h2>
                        <p className="text-xs font-bold text-gray-500">Access your Eventrix account</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-3.5 rounded-2xl text-xs font-bold">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!showOTP ? (
                            <>
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="you@domain.com"
                                        className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-black/10 text-black text-sm font-bold focus:outline-none focus:border-[#8522FF]"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700">Password</label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-black/10 text-black text-sm font-bold focus:outline-none focus:border-[#8522FF]"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="space-y-3">
                                <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl text-xs text-purple-800 font-bold">
                                    Enter the 6-digit OTP code sent to {email}:
                                </div>
                                <input
                                    type="text"
                                    required
                                    maxLength="6"
                                    placeholder="000000"
                                    className="w-full py-3 px-4 text-center font-mono font-black text-2xl tracking-[0.5em] rounded-2xl bg-gray-50 border border-[#8522FF] text-black focus:outline-none"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#0A0A0C] hover:bg-[#8522FF] text-white font-extrabold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                        >
                            <span>{loading ? 'Authenticating...' : (showOTP ? 'Verify OTP & Sign In' : 'Sign In')}</span>
                            <FaArrowUpRightFromSquare className="text-[10px]" />
                        </button>
                    </form>

                    <div className="text-center pt-2 border-t border-black/10">
                        <p className="text-xs text-gray-600 font-semibold">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-[#8522FF] font-black uppercase hover:underline">
                                Register Free
                            </Link>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;