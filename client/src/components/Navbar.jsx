import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/auth';
import { useTheme } from '../context/ThemeContext';
import { Sparkle, Menu, X, LogOut, Compass, LayoutGrid, UserRound, Sun, Moon } from 'lucide-react';
import Magnetic from '../animations/Magnetic';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggle } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 32);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const t = setTimeout(() => setMobileOpen(false), 0);
        return () => clearTimeout(t);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;
    const dashPath = user?.role === 'admin' ? '/admin' : '/dashboard';

    const links = [
        { label: 'Home', to: '/' },
        { label: 'Events', to: '/events' },
        ...(user ? [{ label: 'Dashboard', to: dashPath }] : []),
    ];

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50">
                <div className={`mx-auto max-w-7xl px-4 sm:px-6 transition-all duration-500 ${scrolled ? 'pt-3' : 'pt-4 sm:pt-5'}`}>
                    <nav
                        className={`flex items-center justify-between gap-3 rounded-full px-4 sm:px-5 transition-all duration-500 ${
                            scrolled
                                ? 'glass-strong h-14 shadow-[0_14px_44px_-14px_rgba(13,13,17,0.4)]'
                                : 'h-16 sm:h-[72px] bg-transparent border border-transparent'
                        }`}
                    >
                        {/* Brand */}
                        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
                            <motion.div
                                whileHover={{ rotate: 90, scale: 1.08 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                                className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-purple shadow-[0_8px_22px_-8px_rgba(186,40,226,0.5)]"
                            >
                                <Sparkle className="h-5 w-5 text-white" fill="white" />
                            </motion.div>
                            <div className="leading-none">
                                <span className="font-display text-2xl tracking-wide text-brand-dark uppercase dark:text-dark-ink">
                                    eventrix
                                </span>
                                <span className="eyebrow mt-0.5 block text-[9px] text-brand-gray-400 dark:text-dark-muted">
                                    Live experiences
                                </span>
                            </div>
                        </Link>

                        {/* Center links */}
                        <nav className="hidden md:flex items-center gap-1">
                            {links.map((l) => {
                                const active = isActive(l.to);
                                return (
                                    <Link
                                        key={l.to}
                                        to={l.to}
                                        className="relative rounded-full px-5 py-2 text-xs font-extrabold uppercase tracking-wider"
                                    >                        {active && (                                    <motion.span
                                        layoutId="nav-active-pill"
                                        className="absolute inset-0 rounded-full bg-sunset shadow-[0_8px_18px_-6px_rgba(255,45,122,0.5)]"
                                        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                                    />
                        )}
                                        <span className={`relative z-10 transition-colors ${active ? 'text-white' : 'text-gray-700 hover:text-black dark:text-dark-muted dark:hover:text-dark-ink'}`}>
                                            {l.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Right actions */}
                        <div className="flex items-center gap-2.5 shrink-0">
                            {/* Theme toggle */}
                            <button
                                onClick={toggle}
                                aria-label="Toggle dark mode"
                                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-brand-gray-700 transition-all hover:border-brand-purple hover:text-brand-purple dark:border-dark-line dark:bg-dark-surface dark:text-dark-muted dark:hover:text-brand-purple"
                            >
                                <motion.div
                                    key={theme}
                                    initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                                >
                                    {theme === 'dark' ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
                                </motion.div>
                            </button>

                            {user ? (
                                <>
                                    <Link
                                        to={dashPath}
                                        className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-brand-purple text-white font-black text-sm uppercase shadow-[0_8px_18px_-6px_rgba(186,40,226,0.5)]"
                                        title={user.username}
                                    >
                                        {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                                    </Link>
                                    <Magnetic strength={0.3}>
                                        <button
                                            onClick={handleLogout}
                                            className="hidden md:flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-gray-800 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-dark-line dark:bg-dark-surface dark:text-dark-muted dark:hover:border-red-500/50 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                                        >
                                            <LogOut className="h-3.5 w-3.5" /> Logout
                                        </button>
                                    </Magnetic>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="hidden sm:inline-flex items-center rounded-full border-[1.5px] border-black/15 px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-black transition-all hover:border-brand-purple hover:text-brand-purple dark:border-white/20 dark:text-dark-ink dark:hover:border-brand-purple dark:hover:text-brand-purple"
                                    >
                                        Log in
                                    </Link>
                                    <Magnetic strength={0.3}>
                                        <Link
                                            to="/register"
                                            className="btn-gradient inline-flex items-center gap-1.5 rounded-full px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white"
                                        >
                                            Sign up
                                        </Link>
                                    </Magnetic>
                                </>
                            )}

                            {/* Mobile toggle */}
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="md:hidden flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-black dark:border-dark-line dark:bg-dark-surface dark:text-dark-ink"
                                aria-label="Toggle menu"
                            >
                                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </nav>
                </div>

                {/* Mobile drawer */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="glass-strong md:hidden mx-4 mt-2 rounded-3xl p-4 shadow-2xl"
                        >
                            <div className="space-y-1">
                                {[{ label: 'Home', to: '/' }, { label: 'Events', to: '/events' }, ...(user ? [{ label: 'Dashboard', to: dashPath }] : [])].map((l) => (
                                    <Link
                                        key={l.to}
                                        to={l.to}
                                        onClick={() => setMobileOpen(false)}
                                        className={`block rounded-2xl px-4 py-3 text-sm font-extrabold uppercase tracking-wider ${isActive(l.to) ? 'bg-brand-purple text-white' : 'text-gray-800 hover:bg-gray-100 dark:text-dark-ink dark:hover:bg-dark-surface-2'}`}
                                    >
                                        {l.label}
                                    </Link>
                                ))}
                            </div>
                            <div className="mt-3 border-t border-black/5 pt-3 space-y-1">
                                {user ? (
                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-sm font-extrabold uppercase tracking-wider text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut className="h-4 w-4" /> Logout ({user.username})
                                    </button>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link to="/login" className="rounded-full border border-black/15 py-3 text-center text-xs font-extrabold uppercase text-black dark:border-white/20 dark:text-dark-ink">
                                            Log in
                                        </Link>
                                        <Link to="/register" className="btn-gradient rounded-full py-3 text-center text-xs font-extrabold uppercase text-white">
                                            Sign up
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Mobile bottom navigation */}
            <div className="glass-strong md:hidden fixed bottom-0 left-0 right-0 z-40 border-t px-8 py-2.5 flex items-center justify-between">
                <Link to="/" className={`flex flex-col items-center gap-0.5 text-[10px] font-extrabold uppercase ${isActive('/') ? 'text-brand-purple' : 'text-gray-500 dark:text-dark-muted'}`}>
                    <Compass className="h-5 w-5" />
                    Home
                </Link>
                <Link to="/events" className={`flex flex-col items-center gap-0.5 text-[10px] font-extrabold uppercase ${isActive('/events') ? 'text-brand-purple' : 'text-gray-500 dark:text-dark-muted'}`}>
                    <LayoutGrid className="h-5 w-5" />
                    Events
                </Link>
                <Link to={user ? dashPath : '/login'} className={`flex flex-col items-center gap-0.5 text-[10px] font-extrabold uppercase ${isActive(dashPath) ? 'text-brand-purple' : 'text-gray-500 dark:text-dark-muted'}`}>
                    <UserRound className="h-5 w-5" />
                    Account
                </Link>
            </div>
        </>
    );
};

export default Navbar;
