import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaTicketAlt, FaUser, FaSignOutAlt, FaBars, FaTimes, FaPlusCircle, FaCompass, FaArrowUpRightFromSquare, FaPlay } from 'react-icons/fa6';
import { FaThLarge } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Live countdown timer state matching reference image top right widget
    const [timeLeft, setTimeLeft] = useState({ days: '02', hours: '22', mins: '48', secs: '55' });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const secs = String(59 - now.getSeconds()).padStart(2, '0');
            const mins = String(59 - now.getMinutes()).padStart(2, '0');
            const hours = String((23 - now.getHours()) % 24).padStart(2, '0');
            setTimeLeft({ days: '02', hours, mins, secs });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Top Bar Header */}
            <header className="sticky top-0 z-40 bg-[#F3F3F6]/90 backdrop-blur-md border-b border-black/5 transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20 gap-4">

                        {/* Brand Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white font-black text-xl group-hover:scale-105 transition-transform">
                                ⌘
                            </div>
                            <div className="flex flex-col">
                                <span className="font-display font-black text-xl tracking-tighter text-[#0A0A0C] uppercase leading-none">
                                    EVENTRIX<span className="text-violet-accent">®</span>
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                    SHOWCASE 2026
                                </span>
                            </div>
                        </Link>

                        {/* Center Navigation Links */}
                        <nav className="hidden md:flex items-center gap-1 bg-white p-1.5 rounded-full border border-black/10 shadow-sm">
                            <Link
                                to="/"
                                className={`px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all ${isActive('/') ? 'bg-[#8522FF] text-white shadow-md' : 'text-gray-700 hover:text-black hover:bg-gray-100'}`}
                            >
                                Home
                            </Link>
                            <Link
                                to="/events"
                                className={`px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all ${isActive('/events') ? 'bg-[#8522FF] text-white shadow-md' : 'text-gray-700 hover:text-black hover:bg-gray-100'}`}
                            >
                                Categories & Events
                            </Link>
                            {user && (
                                <Link
                                    to={user.role === 'admin' ? '/admin' : '/dashboard'}
                                    className={`px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all ${isActive('/dashboard') || isActive('/admin') ? 'bg-[#8522FF] text-white shadow-md' : 'text-gray-700 hover:text-black hover:bg-gray-100'}`}
                                >
                                    Dashboard
                                </Link>
                            )}
                        </nav>

                        {/* Right Hand Electric Purple Widget Box (Matched from reference image top right) */}
                        <div className="hidden lg:flex items-center gap-3">
                            <div className="bg-[#8522FF] text-white p-2.5 px-4 rounded-2xl flex items-center gap-4 shadow-md">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-widest text-purple-200">
                                        <span>140+ EVENTS</span>
                                        <span>75+ HOSTS</span>
                                        <span className="bg-black/30 px-2 py-0.5 rounded-full text-white flex items-center gap-1">
                                            VIEW NOW <FaPlay className="text-[8px]" />
                                        </span>
                                    </div>
                                    <div className="font-display font-black text-sm tracking-wider flex items-center gap-1.5">
                                        <span>{timeLeft.days}</span>:<span>{timeLeft.hours}</span>:<span>{timeLeft.mins}</span>:<span>{timeLeft.secs}</span>
                                    </div>
                                </div>
                            </div>

                            {/* User Profile or Login */}
                            {user ? (
                                <div className="flex items-center gap-2">
                                    <Link
                                        to={user.role === 'admin' ? '/admin' : '/dashboard'}
                                        className="w-10 h-10 rounded-full bg-black text-white font-black flex items-center justify-center text-xs uppercase shadow-sm"
                                        title={user.username}
                                    >
                                        {user.username ? user.username.charAt(0) : 'U'}
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-10 h-10 rounded-full bg-white hover:bg-red-50 hover:text-red-600 border border-black/10 flex items-center justify-center text-gray-700 transition-all"
                                        title="Sign Out"
                                    >
                                        <FaSignOutAlt className="text-xs" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link
                                        to="/login"
                                        className="text-xs font-extrabold text-[#0A0A0C] uppercase hover:text-[#8522FF] px-3 py-2 transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-[#D2FF00] hover:bg-[#bce400] text-black font-extrabold px-5 py-2.5 rounded-full text-xs uppercase tracking-wider transition-all shadow-sm border border-black/10 flex items-center gap-1"
                                    >
                                        <span>Register</span> <FaArrowUpRightFromSquare className="text-[10px]" />
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Toggle Button */}
                        <div className="lg:hidden flex items-center">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="w-10 h-10 rounded-xl bg-white border border-black/10 flex items-center justify-center text-black"
                            >
                                {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Drawer */}
                {mobileMenuOpen && (
                    <div className="lg:hidden bg-white border-b border-black/10 px-4 pt-4 pb-6 space-y-3 animate-fadeIn">
                        <Link
                            to="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-3 rounded-xl text-sm font-extrabold uppercase tracking-wider text-gray-900 hover:bg-gray-100"
                        >
                            Home
                        </Link>
                        <Link
                            to="/events"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-3 rounded-xl text-sm font-extrabold uppercase tracking-wider text-gray-900 hover:bg-gray-100"
                        >
                            Categories & Events
                        </Link>
                        {user ? (
                            <>
                                <Link
                                    to={user.role === 'admin' ? '/admin' : '/dashboard'}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-3 rounded-xl text-sm font-extrabold uppercase tracking-wider text-gray-900 hover:bg-gray-100"
                                >
                                    Dashboard ({user.username})
                                </Link>
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        handleLogout();
                                    }}
                                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-extrabold uppercase tracking-wider text-red-600 hover:bg-red-50"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <div className="pt-2 grid grid-cols-2 gap-3">
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-center py-3 rounded-xl bg-gray-100 text-black font-extrabold text-xs uppercase"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-center py-3 rounded-xl bg-[#8522FF] text-white font-extrabold text-xs uppercase"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </header>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-black/10 px-6 py-2.5 flex items-center justify-around">
                <Link to="/" className={`flex flex-col items-center gap-1 text-[10px] font-bold ${isActive('/') ? 'text-[#8522FF]' : 'text-gray-500'}`}>
                    <FaCompass className="text-lg" />
                    <span>Home</span>
                </Link>
                <Link to="/events" className={`flex flex-col items-center gap-1 text-[10px] font-bold ${isActive('/events') ? 'text-[#8522FF]' : 'text-gray-500'}`}>
                    <FaThLarge className="text-lg" />
                    <span>Events</span>
                </Link>
                <Link to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/login'} className={`flex flex-col items-center gap-1 text-[10px] font-bold ${isActive('/dashboard') || isActive('/admin') ? 'text-[#8522FF]' : 'text-gray-500'}`}>
                    <FaUser className="text-lg" />
                    <span>Account</span>
                </Link>
            </div>
        </>
    );
};

export default Navbar;