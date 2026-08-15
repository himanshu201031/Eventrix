import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/auth';
import { useTheme } from '../context/ThemeContext';
import { TransitionLink, push } from './Transitions';
import {
    Sparkle, X, LogOut, Compass, LayoutGrid, UserRound,
    Sun, Moon, ArrowUpRight,
} from 'lucide-react';
import Magnetic from '../animations/Magnetic';

/* Eventrix mega-menu navbar — adapted from the Osmo expanding-pill pattern.
   Solid dark surfaces (no glass), lucide icon family, framer-motion.
   Desktop: hamburger morphs to an X and the pill expands into a three-column
   mega panel with a clip-path reveal. Mobile: same trigger opens the drawer;
   the bottom nav stays for thumb reach. */

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggle } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 32);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* Close the menu on any navigation (deferred so it's not a synchronous
       setState inside an effect — keeps the react-compiler lint rule happy). */
    useEffect(() => {
        const t = setTimeout(() => setOpen(false), 0);
        return () => clearTimeout(t);
    }, [location.pathname]);

    /* Esc closes the menu from anywhere; clicking outside the header closes
       the expanded mega panel / drawer too. */
    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => {
            if (e.key === 'Escape') setOpen(false);
        };
        const onPointer = (e) => {
            if (!e.target.closest('header')) setOpen(false);
        };
        window.addEventListener('keydown', onKey);
        window.addEventListener('pointerdown', onPointer);
        return () => {
            window.removeEventListener('keydown', onKey);
            window.removeEventListener('pointerdown', onPointer);
        };
    }, [open]);

    const handleLogout = () => {
        logout();
        push(navigate, '/login');
    };

    const isActive = (path) => location.pathname === path;
    const dashPath = user?.role === 'admin' ? '/admin' : '/dashboard';

    const links = [
        { label: 'Home', to: '/' },
        { label: 'Events', to: '/events' },
        ...(user ? [{ label: 'Dashboard', to: dashPath }] : []),
    ];

    const products = [
        { label: 'Instant QR Passes', to: '/events', badge: { text: 'NEW', color: 'bg-brand-lime text-brand-dark' } },
        { label: 'The Lineup', to: '/events' },
        { label: 'Seat Picker', to: '/events' },
        { label: 'Event Alerts', to: '/register' },
    ];

    const explore = [
        { label: 'Explore Events', to: '/events' },
        { label: 'Updates', to: '/events' },
        { label: 'Pricing', to: '/register' },
    ];

    const marqueeItems = [
        'BOOK', 'DISCOVER', 'EXPERIENCE',
        ...(user ? ['YOUR PASS IS GATE-READY', 'WELCOME, ' + (user.username || '').toUpperCase()] : []),
    ];

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50">
                <div className={`flex flex-col items-center transition-all duration-500 ${scrolled ? 'pt-3' : 'pt-4 sm:pt-5'}`}>
                    {/* Pill */}
                    <motion.nav
                        animate={{ width: open ? 'min(1400px, calc(100vw - 1.5rem))' : 'min(625px, calc(100vw - 1.5rem))' }}
                        transition={{
                            duration: open ? 0.3 : 0.45,
                            ease: open ? 'circOut' : [0.22, 1, 0.36, 1],
                            delay: open ? 0 : 0.5,
                        }}
                        className="z-50 w-[min(625px,calc(100vw-1.5rem))] bg-brand-dark h-14 px-4 sm:px-5 flex items-center justify-between rounded-full border border-white/10 shadow-[0_18px_50px_-18px_rgba(13,13,17,0.55)]"
                    >
                        {/* Left — hamburger morph + Menu */}
                        <button
                            type="button"
                            onClick={() => setOpen(!open)}
                            aria-label={open ? 'Close menu' : 'Open menu'}
                            aria-expanded={open}
                            aria-controls="evx-mega-panel"
                            className="flex items-center gap-2.5 text-white cursor-pointer select-none bg-transparent border-0 p-0"
                        >
                            <div className="flex flex-col gap-1.5 w-6">
                                <motion.span
                                    animate={{ rotate: open ? 45 : 0, translateY: open ? 2 : 0 }}
                                    transition={{ duration: 0.35, delay: open ? 0 : 0.3 }}
                                    className="h-px w-full bg-white origin-center"
                                />
                                <motion.span
                                    animate={{ rotate: open ? -45 : 0, translateY: open ? -5 : 0 }}
                                    transition={{ duration: 0.35, delay: open ? 0 : 0.3 }}
                                    className="h-px w-full bg-white origin-center"
                                />
                            </div>
                            <h3 className="text-[18px] font-bold">{open ? 'Close' : 'Menu'}</h3>
                        </button>

                        {/* Center — brand */}
                        <TransitionLink to="/" className="flex items-center gap-2 group">
                            <motion.div
                                whileHover={{ rotate: 90, scale: 1.08 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                                className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-brand-purple shadow-[0_8px_22px_-8px_rgba(186,40,226,0.6)]"
                            >
                                <Sparkle className="h-4 w-4 text-white" fill="white" />
                            </motion.div>
                            <span className="font-display text-2xl tracking-wide text-white uppercase">
                                eventrix
                            </span>
                        </TransitionLink>

                        {/* Right — theme + auth */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggle}
                                aria-label="Toggle dark mode"
                                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-colors hover:border-brand-lime/60 hover:text-brand-lime"
                            >
                                <motion.div
                                    key={theme}
                                    initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                                >
                                    {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                                </motion.div>
                            </button>

                            {user ? (
                                <>
                                    <TransitionLink
                                        to={dashPath}
                                        className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-brand-purple text-white font-black text-sm uppercase"
                                        title={user.username}
                                    >
                                        {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                                    </TransitionLink>
                                    <Magnetic strength={0.3}>
                                        <button
                                            onClick={handleLogout}
                                            className="hidden md:flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-white/80 transition-all hover:border-red-500/60 hover:bg-red-500/15 hover:text-red-300"
                                        >
                                            <LogOut className="h-3.5 w-3.5" /> Logout
                                        </button>
                                    </Magnetic>
                                </>
                            ) : (
                                <>
                                    <TransitionLink
                                        to="/login"
                                        className="hidden sm:inline-flex items-center rounded-full border-[1.5px] border-white/20 px-5 py-2 text-xs font-extrabold uppercase tracking-wider text-white transition-all hover:border-brand-lime hover:text-brand-lime"
                                    >
                                        Log in
                                    </TransitionLink>
                                    <Magnetic strength={0.3}>
                                        <TransitionLink
                                            to="/register"
                                            className="inline-flex items-center rounded-full bg-brand-lime px-5 py-2 text-xs font-extrabold uppercase tracking-wider text-brand-dark shadow-[0_10px_26px_-10px_rgba(166,255,0,0.6)]"
                                        >
                                            Join
                                        </TransitionLink>
                                    </Magnetic>
                                </>
                            )}
                        </div>
                    </motion.nav>

                    {/* Mega panel */}
                    <motion.div
                        animate={{
                            clipPath: open
                                ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                                : 'polygon(0 0, 100% 0, 100% 0, 0 0)',
                        }}
                        transition={{
                            delay: open ? 0.3 : 0,
                            duration: open ? 0.8 : 0.5,
                            ease: open ? 'circIn' : [0.4, 0, 0.2, 1],
                        }}
                        id="evx-mega-panel"
                        aria-hidden={!open}
                        className="z-50 hidden md:block w-[min(1400px,calc(100vw-1.5rem))] absolute top-full mt-2 bg-brand-dark rounded-3xl border border-white/10 overflow-hidden"
                    >
                        <div className="flex p-6 gap-4 min-h-[300px]">
                            {/* Column 1 — What's on */}
                            <div className="flex-1 rounded-2xl bg-[#1a1a22] flex flex-col p-6 text-white/80">
                                <h3 className="text-xs font-extralight tracking-wider text-white/60 uppercase">What's on</h3>
                                <div className="mt-4">
                                    {products.map((p) => (
                                        <TransitionLink
                                            key={p.label}
                                            to={p.to}
                                            onClick={() => setOpen(false)}
                                            className="group flex items-center gap-2 py-3 border-b border-white/10 text-[22px] text-white/85 transition-colors hover:text-brand-lime"
                                        >
                                            {p.label}
                                            {p.badge && (
                                                <span className={`px-1.5 py-0.5 text-[10px] font-bold tracking-wider rounded ${p.badge.color}`}>
                                                    {p.badge.text}
                                                </span>
                                            )}
                                        </TransitionLink>
                                    ))}
                                </div>
                                <div className="flex items-center mt-auto pt-6 gap-2 text-sm text-white/50">
                                    <h3>Community</h3>
                                    <span className="bg-brand-gray-700 text-[10px] font-extralight px-1.5 py-0.5 rounded">SOON</span>
                                </div>
                            </div>

                            {/* Column 2 — Explore */}
                            <div className="flex-1 flex flex-col p-6 text-white/80">
                                <h3 className="text-xs font-extralight tracking-wider text-white/60 uppercase">Explore</h3>
                                <div className="mt-4">
                                    {explore.map((l) => (
                                        <TransitionLink
                                            key={l.label}
                                            to={l.to}
                                            onClick={() => setOpen(false)}
                                            className="block py-3 border-b border-white/10 text-[22px] text-white/85 transition-colors hover:text-brand-pink"
                                        >
                                            {l.label}
                                        </TransitionLink>
                                    ))}
                                </div>
                                {/* No brand icons in this lucide build — text monograms keep the single-icon-family rule */}
                                <div className="flex items-center gap-2.5 mt-auto pt-8 text-white/80">
                                    <a
                                        href="https://linkedin.com"
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label="Eventrix on LinkedIn"
                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gray-700 text-[11px] font-black text-white/80 transition-colors hover:bg-brand-purple hover:text-white"
                                    >
                                        IN
                                    </a>
                                    <a
                                        href="https://instagram.com"
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label="Eventrix on Instagram"
                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gray-700 text-[11px] font-black text-white/80 transition-colors hover:bg-brand-pink hover:text-white"
                                    >
                                        IG
                                    </a>
                                    <a
                                        href="https://twitter.com"
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label="Eventrix on X"
                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gray-700 text-[11px] font-black text-white/80 transition-colors hover:bg-brand-lime hover:text-brand-dark"
                                    >
                                        X
                                    </a>
                                </div>
                            </div>

                            {/* Column 3 — Featured */}
                            <div className="flex-1 rounded-2xl bg-[#1a1a22] flex flex-col justify-between relative text-center items-center p-8 text-white/80 overflow-hidden">
                                <div className="flex items-center gap-2 uppercase tracking-wider text-[10px] font-light">
                                    <span className="bg-brand-dark text-white px-1.5 py-0.5 rounded">Featured</span>
                                    <span className="bg-brand-purple text-white px-1.5 py-0.5 rounded-full">Milestone</span>
                                </div>

                                <div className="flex flex-col items-center gap-4 relative z-10">
                                    <h2 className="font-display text-4xl text-white uppercase leading-[0.95] max-w-xs">
                                        {user ? `Welcome,\n${user.username}!` : '500K+\ntickets booked'}
                                    </h2>
                                    <TransitionLink
                                        to={user ? dashPath : '/register'}
                                        onClick={() => setOpen(false)}
                                        className="group inline-flex items-center gap-2 rounded-full bg-brand-lime px-5 py-2.5 text-sm font-extrabold uppercase tracking-wider text-brand-dark transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.03] active:scale-[0.98]"
                                    >
                                        {user ? 'Your passes' : 'Get your pass'}
                                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                    </TransitionLink>
                                </div>

                                                {/* Avatar cluster (decorative) */}
                                <div aria-hidden="true" className="pointer-events-none select-none">
                                    <Avatar src="https://i.pravatar.cc/150?u=evx-a1" size="w-14 h-14" className="absolute -bottom-2 left-4 opacity-90" />
                                    <Avatar src="https://i.pravatar.cc/150?u=evx-a2" size="w-16 h-16" className="absolute bottom-10 left-16 z-10 opacity-90" />
                                    <Avatar src="https://i.pravatar.cc/150?u=evx-a3" size="w-20 h-20" className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20" />
                                    <Avatar src="https://i.pravatar.cc/150?u=evx-a4" size="w-16 h-16" className="absolute bottom-10 right-16 z-10 opacity-90" />
                                    <Avatar src="https://i.pravatar.cc/150?u=evx-a5" size="w-14 h-14" className="absolute -bottom-2 right-4 opacity-90" />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Marquee strip (decorative) */}
                    <motion.div
                        aria-hidden="true"
                        className={`${open ? 'hidden' : 'block'} hidden md:block mt-2 rounded-full bg-brand-lime text-brand-dark overflow-hidden`}
                    >
                        <div className="marquee-content flex gap-4 whitespace-nowrap py-1">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="flex items-center gap-4 text-[10px] font-extrabold tracking-[0.18em]">
                                    {marqueeItems.map((m) => (
                                        <span key={m} className="flex items-center gap-4">
                                            <span>{m}</span>
                                            <span className="text-sm leading-none">✶</span>
                                        </span>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Mobile drawer */}
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ opacity: 0, y: -12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="md:hidden bg-brand-dark mx-3 mt-2 rounded-3xl border border-white/10 p-4 shadow-2xl"
                        >
                            <div className="space-y-1">
                                {links.map((l) => (
                                    <TransitionLink
                                        key={l.to}
                                        to={l.to}
                                        className={`block rounded-2xl px-4 py-3 text-sm font-extrabold uppercase tracking-wider ${isActive(l.to) ? 'bg-brand-purple text-white' : 'text-white/80 hover:bg-white/5'}`}
                                    >
                                        {l.label}
                                    </TransitionLink>
                                ))}
                                <div className="border-t border-white/10 pt-3 mt-3 space-y-1">
                                    {products.slice(0, 2).map((p) => (
                                        <TransitionLink
                                            key={p.label}
                                            to={p.to}
                                            className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-extrabold uppercase tracking-wider text-white/80 hover:bg-white/5"
                                        >
                                            {p.label}
                                            {p.badge && <span className={`text-[9px] font-bold px-1.5 rounded ${p.badge.color}`}>{p.badge.text}</span>}
                                        </TransitionLink>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-3 border-t border-white/10 pt-3 space-y-1">
                                {user ? (
                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-sm font-extrabold uppercase tracking-wider text-red-400 hover:bg-red-500/10"
                                    >
                                        <LogOut className="h-4 w-4" /> Logout ({user.username})
                                    </button>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        <TransitionLink to="/login" className="rounded-full border border-white/20 py-3 text-center text-xs font-extrabold uppercase text-white">
                                            Log in
                                        </TransitionLink>
                                        <TransitionLink to="/register" className="rounded-full bg-brand-lime py-3 text-center text-xs font-extrabold uppercase text-brand-dark">
                                            Join
                                        </TransitionLink>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Mobile bottom navigation */}
            <div className="bg-brand-dark md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 px-8 py-2.5 flex items-center justify-between">
                <TransitionLink to="/" className={`flex flex-col items-center gap-0.5 text-[10px] font-extrabold uppercase ${isActive('/') ? 'text-brand-lime' : 'text-white/50'}`}>
                    <Compass className="h-5 w-5" />
                    Home
                </TransitionLink>
                <TransitionLink to="/events" className={`flex flex-col items-center gap-0.5 text-[10px] font-extrabold uppercase ${isActive('/events') ? 'text-brand-lime' : 'text-white/50'}`}>
                    <LayoutGrid className="h-5 w-5" />
                    Events
                </TransitionLink>
                <TransitionLink to={user ? dashPath : '/login'} className={`flex flex-col items-center gap-0.5 text-[10px] font-extrabold uppercase ${isActive(dashPath) ? 'text-brand-lime' : 'text-white/50'}`}>
                    <UserRound className="h-5 w-5" />
                    Account
                </TransitionLink>
            </div>

            <style>{`
                .marquee-content {
                    animation: scroll 20s linear infinite;
                }
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @media (prefers-reduced-motion: reduce) {
                    .marquee-content {
                        animation: none;
                    }
                }
            `}</style>
        </>
    );
};

const Avatar = ({ src, size, className }) => (
    <img
        src={src}
        alt="Community member"
        className={`rounded-full object-cover border-2 border-[#1a1a22] ${size} ${className}`}
    />
);

export default Navbar;
