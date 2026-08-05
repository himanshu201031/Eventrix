import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaLock, FaEnvelope, FaUser } from 'react-icons/fa';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';

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
            <div className="w-full max-w-5xl rounded-[2.5rem] bg-white border border-black/10 overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">

                {/* Left Panel: Graphic Branding */}
                <div className="lg:col-span-6 bg-[#0B0B0B] text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10 space-y-4">
                        <Link to="/" className="inline-flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-[#D2FF00] text-black font-black text-xl flex items-center justify-center">
                                ⌘
                            </div>
                            <span className="font-display font-black text-2xl tracking-tighter uppercase">
                                EVENTRIX®
                            </span>
                        </Link>
                    </div>

                    <div className="relative z-10 space-y-4 my-12">
                        <span className="px-3 py-1 rounded-full bg-[#8522FF] text-white font-extrabold text-[10px] uppercase">
                            FREE REGISTRATION
                        </span>
                        <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tighter leading-tight">
                            BE PART OF THE <br />
                            <span className="text-[#D2FF00]">COMMUNITY</span>
                        </h2>
                        <p className="text-gray-300 text-xs font-medium max-w-sm">
                            Create a free profile to reserve digital QR passes, vote on leaderboard showcases, and participate in award events.
                        </p>
                    </div>

                    <div className="relative z-10 text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#D2FF00]"></span>
                        <span>INSTANT ACCESS PASS GENERATION</span>
                    </div>
                </div>

                {/* Right Panel: Clean Form */}
                <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center space-y-6">
                    <div className="space-y-1">
                        <h2 className="font-display font-black text-3xl text-black uppercase tracking-tight">Create Account</h2>
                        <p className="text-xs font-bold text-gray-500">Register your Eventrix account</p>
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
                                    <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Alex Rivera"
                                        className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-black/10 text-black text-sm font-bold focus:outline-none focus:border-[#8522FF]"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

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
                                    An OTP code was sent to {email}. Input code below:
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
                            className="w-full bg-[#8522FF] hover:bg-purple-700 text-white font-extrabold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                        >
                            <span>{loading ? 'Creating Profile...' : (showOTP ? 'Verify & Complete' : 'Sign Up Free')}</span>
                            <FaArrowUpRightFromSquare className="text-[10px]" />
                        </button>
                    </form>

                    {!showOTP && (
                        <div className="text-center pt-2 border-t border-black/10">
                            <p className="text-xs text-gray-600 font-semibold">
                                Already registered?{' '}
                                <Link to="/login" className="text-[#8522FF] font-black uppercase hover:underline">
                                    Sign In
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