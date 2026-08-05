import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaTicketAlt, FaUser, FaSignOutAlt, FaBars, FaTimes, FaPlusCircle, FaCompass, FaRegHeart, FaThLarge } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Desktop & Top Sticky Header */}
            <header className="sticky top-0 z-40 glass-nav transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">

                        {/* Brand Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform">
                                <FaTicketAlt className="text-xl -rotate-12 group-hover:rotate-0 transition-transform" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1">
                                    EVENT<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">RIX</span>
                                </span>
                                <span className="text-[9px] font-extrabold uppercase tracking-widest text-purple-400 -mt-1">
                                    Live Experiences
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation Links */}
                        <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1.5 rounded-full border border-white/10">
                            <Link
                                to="/"
                                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${isActive('/') ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                            >
                                Home
                            </Link>
                            <Link
                                to="/events"
                                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${isActive('/events') ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                            >
                                Discover Events
                            </Link>
                            {user && (
                                <Link
                                    to={user.role === 'admin' ? '/admin' : '/dashboard'}
                                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${isActive('/dashboard') || isActive('/admin') ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                                >
                                    Dashboard
                                </Link>
                            )}
                        </nav>

                        {/* Right Actions & User Profile */}
                        <div className="hidden md:flex items-center gap-4">
                            {user ? (
                                <div className="flex items-center gap-3">
                                    {user.role === 'admin' && (
                                        <Link
                                            to="/admin"
                                            className="bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600/30 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                                        >
                                            <FaPlusCircle /> Host Event
                                        </Link>
                                    )}
                                    <Link
                                        to={user.role === 'admin' ? '/admin' : '/dashboard'}
                                        className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 p-1.5 pr-4 rounded-full border border-white/10 transition-all"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-xs uppercase shadow-md">
                                            {user.username ? user.username.charAt(0) : 'U'}
                                        </div>
                                        <span className="text-xs font-bold text-gray-200">{user.username}</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-9 h-9 rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center text-gray-400 transition-all border border-white/10"
                                        title="Sign Out"
                                    >
                                        <FaSignOutAlt className="text-sm" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link
                                        to="/login"
                                        className="text-gray-300 hover:text-white px-4 py-2 text-xs font-bold transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-lg shadow-purple-500/25 flex items-center gap-1.5"
                                    >
                                        <HiSparkles className="text-xs" /> Sign Up Free
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Toggle Button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white"
                            >
                                {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Drawer Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-[#07090e] border-b border-white/10 px-4 pt-4 pb-6 space-y-3 animate-fadeIn">
                        <Link
                            to="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-3 rounded-xl text-sm font-bold text-gray-200 hover:bg-white/5"
                        >
                            Home
                        </Link>
                        <Link
                            to="/events"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-3 rounded-xl text-sm font-bold text-gray-200 hover:bg-white/5"
                        >
                            Discover Events
                        </Link>
                        {user ? (
                            <>
                                <Link
                                    to={user.role === 'admin' ? '/admin' : '/dashboard'}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-3 rounded-xl text-sm font-bold text-gray-200 hover:bg-white/5"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        handleLogout();
                                    }}
                                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10"
                                >
                                    Sign Out ({user.username})
                                </button>
                            </>
                        ) : (
                            <div className="pt-2 grid grid-cols-2 gap-3">
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-center py-3 rounded-xl bg-white/5 text-white font-bold text-xs"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-center py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </header>

            {/* Mobile Bottom Navigation Bar (Design.md Requirement #8) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#07090e]/95 backdrop-blur-xl border-t border-white/10 px-6 py-2.5 flex items-center justify-around">
                <Link to="/" className={`flex flex-col items-center gap-1 text-[10px] font-bold ${isActive('/') ? 'text-purple-400' : 'text-gray-400'}`}>
                    <FaCompass className="text-lg" />
                    <span>Home</span>
                </Link>
                <Link to="/events" className={`flex flex-col items-center gap-1 text-[10px] font-bold ${isActive('/events') ? 'text-purple-400' : 'text-gray-400'}`}>
                    <FaThLarge className="text-lg" />
                    <span>Events</span>
                </Link>
                <Link to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/login'} className={`flex flex-col items-center gap-1 text-[10px] font-bold ${isActive('/dashboard') || isActive('/admin') ? 'text-purple-400' : 'text-gray-400'}`}>
                    <FaUser className="text-lg" />
                    <span>Account</span>
                </Link>
            </div>
        </>
    );
};

export default Navbar;