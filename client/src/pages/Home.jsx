import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../utils/axios';
import { getLenis } from '../utils/smoothScroll';
import EventCard from '../components/EventCard';
import { Reveal, Counter, Magnetic, Tilt } from '../animations';
import crowdImg from '../assets/crowd.png';
import djImg from '../assets/dj.png';
import ticketImg from '../assets/ticket3d.png';
import micImg from '../assets/mic3d.png';
import headphonesImg from '../assets/headphones3d.png';
import {
    Search, MapPin, CalendarDays, ArrowUpRight, Flame, Star, Heart, Ticket,
    Music2, PartyPopper, GraduationCap, Mic2, Trophy, Users, ShieldCheck,
    CalendarCheck, BadgePercent, ChevronRight, Sparkle, CheckCircle2,
    ChevronDown, Layers, CreditCard, Headphones, Plus, SlidersHorizontal,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ---------- Fallback / demo content (used while API loads or is empty) ---------- */
const demoEvents = [
    {
        _id: 'sunset-fest-2025',
        title: 'Sunset Music Festival 2025',
        category: 'Festivals',
        date: '2025-12-14',
        location: 'Goa, India',
        ticketPrice: 1499,
        description: 'Three days of non-stop music, art and beach vibes.',
        image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200&auto=format&fit=crop',
        totalSeats: 5000, availableSeats: 3200,
    },
    {
        _id: 'arijit-live',
        title: 'Arijit Singh · Live in Concert',
        category: 'Music',
        date: '2025-05-24',
        location: 'Mumbai, India',
        ticketPrice: 2399,
        description: 'An unforgettable night of soulful melodies under the stars.',
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1200&auto=format&fit=crop',
        totalSeats: 8000, availableSeats: 4100,
    },
    {
        _id: 'techcrunch-disrupt',
        title: 'TechCrunch Disrupt 2025',
        category: 'Conferences',
        date: '2025-10-28',
        location: 'Bengaluru, India',
        ticketPrice: 4999,
        description: 'Startups, investors and the future of technology in one room.',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
        totalSeats: 3000, availableSeats: 890,
    },
    {
        _id: 'sunburn-arena',
        title: 'Sunburn Arena Nights',
        category: 'Music',
        date: '2025-12-31',
        location: 'Delhi NCR, India',
        ticketPrice: 2999,
        description: 'The biggest EDM night of the year with world-class DJs.',
        image: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=1200&auto=format&fit=crop',
        totalSeats: 12000, availableSeats: 5200,
    },
    {
        _id: 'idw-2025',
        title: 'India Design Week 2025',
        category: 'Workshops',
        date: '2025-09-05',
        location: 'Jaipur, India',
        ticketPrice: 1799,
        description: 'Design thinking, workshops and creative showcases.',
        image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop',
        totalSeats: 1500, availableSeats: 620,
    },
];

const categories = [
    { name: 'Music', icon: Music2, color: 'bg-brand-pink', count: '1,234 Events' },
    { name: 'Festivals', icon: PartyPopper, color: 'bg-brand-purple', count: '845 Events' },
    { name: 'Workshops', icon: GraduationCap, color: 'bg-brand-cyan text-brand-dark', count: '645 Events' },
    { name: 'Conferences', icon: Mic2, color: 'bg-brand-purple-deep', count: '321 Events' },
    { name: 'Sports', icon: Trophy, color: 'bg-brand-lime text-brand-dark', count: '421 Events' },
    { name: 'Meetups', icon: Users, color: 'bg-brand-orange', count: '621 Events' },
];

const whyFeatures = [
    { icon: CalendarCheck, title: 'Easy Booking', desc: 'Quick & hassle-free ticket checkout in under a minute.', accent: 'bg-brand-pink/10 text-brand-pink border-brand-pink/15' },
    { icon: ShieldCheck, title: 'Secure Payments', desc: '100% safe & secure OTP-verified transactions.', accent: 'bg-brand-lime/15 text-brand-lime-deep border-brand-lime/30' },
    { icon: BadgePercent, title: 'Best Prices', desc: 'Unbeatable early-bird deals & member pricing.', accent: 'bg-brand-orange/10 text-brand-orange border-brand-orange/15' },
    { icon: Headphones, title: '24/7 Support', desc: "We're here to help — day or night, always online.", accent: 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/25' },
];

const bookingSteps = [
    { icon: Ticket, title: 'Select Event', desc: 'Choose your favorite event' },
    { icon: Layers, title: 'Choose Tickets', desc: 'Select ticket type and quantity' },
    { icon: Users, title: 'Checkout', desc: 'Review your order and details' },
    { icon: CreditCard, title: 'Payment', desc: 'Make secure payment' },
    { icon: CheckCircle2, title: 'Success', desc: 'Get your ticket & enjoy the event!' },
];

const testimonials = [
    { name: 'Ananya Sharma', role: 'Festival regular · Goa', quote: 'Eventrix made booking Sunset Festival feel effortless. Instant QR passes, zero queues at the gate. Best event platform I have used.', initials: 'AS' },
    { name: 'Rohan Mehta', role: 'Tech founder · Bengaluru', quote: 'The dashboard is beautiful. Every ticket, invoice and confirmation in one clean place. Feels like a premium product.', initials: 'RM' },
    { name: 'Zara Khan', role: 'Music lover · Mumbai', quote: 'Found my favourite artist\'s concert in seconds, grabbed an early bird pass before it sold out. The OTP booking feels super secure.', initials: 'ZK' },
];

const SkeletonCard = () => (
    <div className="overflow-hidden rounded-[1.75rem] border border-black/5 bg-white dark:border-dark-line dark:bg-dark-surface">
        <div className="skeleton h-52 w-full rounded-none" />
        <div className="space-y-3 p-5">
            <div className="skeleton h-3 w-1/3" />
            <div className="skeleton h-6 w-3/4" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-11 w-full" />
        </div>
    </div>
);

const Home = () => {
    const navigate = useNavigate();
    const heroRef = useRef(null);
    const [searchParams] = useSearchParams();
    const search = searchParams.get('search') || '';
    const [events, setEvents] = useState([]);
    const [heroQuery, setHeroQuery] = useState('');
    const [heroCategory, setHeroCategory] = useState('');
    const [heroLocation, setHeroLocation] = useState('');
    const [loading, setLoading] = useState(true);
    const [subscribed, setSubscribed] = useState(false);

    /* ---- API events (kept from original implementation) ---- */
    const fetchEvents = useCallback(async () => {
        try {
            const { data } = await api.get(`/events?search=${search}`);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        const timeoutId = setTimeout(() => fetchEvents(), 300);
        return () => clearTimeout(timeoutId);
    }, [fetchEvents]);

    /* ---- GSAP hero intro + scroll parallax (kept in sync with Lenis) ---- */
    useEffect(() => {
        const lenis = getLenis();
        if (lenis) lenis.on('scroll', ScrollTrigger.update);

        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.hero-el',
                { y: 46, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: 'power3.out', delay: 0.1 }
            );
            gsap.fromTo(
                '.hero-sticker',
                { scale: 0, rotate: -20 },
                { scale: 1, rotate: 0, duration: 0.8, stagger: 0.15, ease: 'back.out(1.8)', delay: 0.7 }
            );

            /* Hero content drift on scroll */
            gsap.to('.hero-content', {
                yPercent: -6,
                ease: 'none',
                scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
            });

            /* Floating decor — each layer parallaxes at its own speed */
            gsap.to('.plx-ticket', {
                yPercent: 34,
                rotate: 8,
                ease: 'none',
                scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
            });
            gsap.to('.plx-sticker', {
                yPercent: 22,
                ease: 'none',
                scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
            });
            gsap.to('.plx-hero-img', {
                yPercent: -12,
                scale: 1.08,
                ease: 'none',
                scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
            });
            gsap.to('.plx-doodle', {
                yPercent: -26,
                ease: 'none',
                scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
            });

            /* CTA banner parallax */
            gsap.to('.plx-cta-img', {
                yPercent: -16,
                ease: 'none',
                scrollTrigger: { trigger: '.cta-section', start: 'top bottom', end: 'bottom top', scrub: true },
            });

            /* Why-choose illustration parallax */
            gsap.to('.plx-dj', {
                yPercent: -14,
                ease: 'none',
                scrollTrigger: { trigger: '.why-section', start: 'top bottom', end: 'bottom top', scrub: true },
            });
            gsap.to('.plx-mic', {
                yPercent: 20,
                ease: 'none',
                scrollTrigger: { trigger: '.why-section', start: 'top bottom', end: 'bottom top', scrub: true },
            });
            gsap.to('.plx-phone', {
                yPercent: 26,
                ease: 'none',
                scrollTrigger: { trigger: '.why-section', start: 'top bottom', end: 'bottom top', scrub: true },
            });
        }, heroRef);

        return () => {
            ctx.revert();
            if (lenis) lenis.off('scroll', ScrollTrigger.update);
        };
    }, []);

    const displayEvents = events.length > 0 ? events : demoEvents;
    const featured = displayEvents[0];
    const upcoming = events.length > 0 ? events.slice(0, 6) : displayEvents.slice(0, 6);

    const goToSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (heroQuery) params.set('search', heroQuery);
        if (heroCategory) params.set('category', heroCategory);
        const qs = params.toString();
        navigate(qs ? `/events?${qs}` : '/events');
    };

    return (
        <div className="pb-16 md:pb-0">
            {/* ═══════════ 1 · HERO ═══════════ */}
            <section ref={heroRef} className="relative overflow-hidden bg-brand-light dark:bg-dark-page">
                <div className="absolute inset-0 dots-bg opacity-40" />
                {/* soft color blobs */}
                <div className="absolute -right-32 top-16 h-80 w-80 rounded-full bg-brand-purple/10" />
                <div className="absolute -left-24 top-40 h-64 w-64 rounded-full bg-brand-pink/10" />
                <div className="absolute bottom-24 right-1/4 h-56 w-56 rounded-full bg-brand-cyan/10" />

                <div className="hero-content relative mx-auto max-w-7xl px-4 pt-36 pb-16 sm:px-6 sm:pt-40 lg:px-8">
                    <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
                        {/* Left */}
                        <div className="lg:col-span-7">
                            <h1 className="hero-el font-display text-[2.9rem] uppercase leading-[0.92] tracking-tight text-brand-dark dark:text-dark-ink sm:text-7xl lg:text-[5.2rem]">
                                Experience <br />
                                events like <br />
                                <span className="text-gradient-brand">never before</span>
                            </h1>

                            <p className="hero-el mt-6 max-w-lg text-base leading-relaxed text-gray-500 dark:text-dark-muted sm:text-lg">
                                Discover epic events, book your tickets and create unforgettable memories.
                            </p>

                            {/* Search bar */}
                            <form onSubmit={goToSearch} className="hero-el mt-8 max-w-2xl">
                                <Magnetic strength={0.06}>
                                    <div className="flex flex-col gap-2 rounded-[1.75rem] border border-black/10 bg-white p-2 shadow-[0_20px_50px_-20px_rgba(13,13,17,0.2)] dark:border-dark-line dark:bg-dark-surface sm:flex-row sm:items-center sm:pl-5">
                                        <div className="flex flex-1 items-center gap-2.5">
                                            <Search className="h-5 w-5 shrink-0 text-gray-400 dark:text-dark-muted" />
                                            <input
                                                type="text"
                                                value={heroQuery}
                                                onChange={(e) => setHeroQuery(e.target.value)}
                                                placeholder="Search events, artists, venues..."
                                                className="w-full bg-transparent py-2.5 text-sm font-semibold text-gray-800 placeholder-gray-400 outline-none dark:text-dark-ink dark:placeholder-dark-muted"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="relative flex items-center">
                                                <select
                                                    value={heroCategory}
                                                    onChange={(e) => setHeroCategory(e.target.value)}
                                                    className="appearance-none rounded-full border border-black/10 bg-brand-light py-2.5 pl-4 pr-9 text-xs font-extrabold uppercase tracking-wider text-gray-700 outline-none transition-colors hover:border-brand-purple focus:border-brand-purple dark:border-dark-line dark:bg-dark-surface-2 dark:text-dark-muted"
                                                >
                                                    <option value="">All Categories</option>
                                                    {['Music', 'Festivals', 'Workshops', 'Conferences', 'Sports'].map((c) => (
                                                        <option key={c} value={c}>{c}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-gray-400 dark:text-dark-muted" />
                                            </div>
                                            <div className="relative hidden items-center md:flex">
                                                <select
                                                    value={heroLocation}
                                                    onChange={(e) => setHeroLocation(e.target.value)}
                                                    className="appearance-none rounded-full border border-black/10 bg-brand-light py-2.5 pl-4 pr-9 text-xs font-extrabold uppercase tracking-wider text-gray-700 outline-none transition-colors hover:border-brand-purple focus:border-brand-purple dark:border-dark-line dark:bg-dark-surface-2 dark:text-dark-muted"
                                                >
                                                    <option value="">Location</option>
                                                    {['Mumbai', 'Goa', 'Bengaluru', 'Delhi', 'Jaipur'].map((l) => (
                                                        <option key={l} value={l}>{l}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-gray-400 dark:text-dark-muted" />
                                            </div>
                                            <button
                                                type="submit"
                                                className="btn-gradient flex shrink-0 items-center gap-2 rounded-full px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white"
                                            >
                                                Search <ArrowUpRight className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </Magnetic>
                            </form>

                            {/* Quick pills */}
                            <div className="hero-el mt-5 flex flex-wrap items-center gap-2 text-[11px] font-bold">
                                <span className="uppercase tracking-widest text-brand-gray-400 dark:text-dark-muted">Popular:</span>
                                {['Concerts', 'Festivals', 'Workshops', 'Conferences', 'Sports', 'More'].map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => navigate(`/events?category=${tag === 'More' ? 'Tech' : tag}`)}
                                        className="rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-gray-600 transition-all hover:border-brand-purple hover:text-brand-purple dark:border-dark-line dark:bg-dark-surface dark:text-dark-muted dark:hover:text-brand-purple"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right: featured event card + floating stickers */}
                        <div className="hero-el relative lg:col-span-5">
                            {/* GOOD MUSIC badge */}
                            <div className="hero-sticker plx-sticker sticker -top-8 right-6 z-20 h-24 w-24 rotate-12 rounded-full bg-brand-lime text-brand-dark animate-float sm:right-10">
                                <div className="flex flex-col items-center leading-tight">
                                    <span className="font-display text-sm uppercase">Good</span>
                                    <span className="font-display text-sm uppercase">Music</span>
                                </div>
                            </div>

                            {/* FEEL THE VIBE cloud sticker */}
                            <div className="hero-sticker plx-sticker sticker -left-4 top-14 hidden rounded-[2rem] rounded-bl-md bg-brand-orange px-5 py-3 text-[11px] text-white animate-float-slow sm:flex">
                                <Sparkle className="mr-1.5 h-3.5 w-3.5 text-brand-lime" fill="currentColor" />
                                Feel the vibe
                            </div>

                            {/* Floating 3D ticket: 30% OFF */}
                            <div className="plx-ticket hero-sticker sticker -right-3 bottom-24 z-20 hidden w-36 flex-col rounded-3xl bg-brand-purple px-4 py-4 text-white shadow-[0_24px_50px_-16px_rgba(186,40,226,0.55)] animate-float lg:flex">
                                <img src={ticketImg} alt="Early bird ticket" className="mb-2 h-12 w-12 object-contain drop-shadow-lg" />
                                <span className="font-display text-2xl leading-none uppercase text-brand-lime">30% off</span>
                                <span className="mt-0.5 text-[9px] font-black uppercase tracking-[0.2em] text-white/85">Early bird</span>
                            </div>

                            {/* doodles */}
                            <motion.span
                                animate={{ rotate: [0, 18, 0], y: [0, -8, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                                className="plx-doodle absolute -top-4 left-16 hidden text-brand-purple md:block"
                            >
                                <Plus className="h-6 w-6" />
                            </motion.span>
                            <motion.span
                                animate={{ rotate: [0, -14, 0], y: [0, 6, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                                className="plx-doodle absolute bottom-36 -left-8 hidden text-brand-orange lg:block"
                            >
                                <Star className="h-7 w-7" fill="currentColor" />
                            </motion.span>
                            <span className="plx-doodle absolute right-14 top-40 hidden h-8 w-8 rounded-full border-[3px] border-brand-cyan lg:block" />

                            {/* Tilted featured card */}
                            <div className="relative rotate-2 transition-transform duration-500">
                                <Tilt max={7}>
                                    <div className="relative overflow-hidden rounded-[2rem] border border-brand-purple/30 bg-white p-4 shadow-[0_30px_70px_-30px_rgba(13,13,17,0.3)] dark:border-brand-purple/40 dark:bg-dark-surface">
                                        <div className="relative h-52 w-full overflow-hidden rounded-2xl bg-brand-gray-900">
                                            <img src={crowdImg} alt="Concert crowd" className="plx-hero-img h-full w-full object-cover" />
                                            <div className="absolute inset-0 bg-brand-purple/15" />
                                            <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-brand-pink px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
                                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Live concert
                                            </span>
                                        </div>

                                        <h3 className="font-display mt-4 text-xl uppercase leading-tight text-brand-dark dark:text-dark-ink sm:text-2xl">
                                            {featured.title}
                                        </h3>
                                        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-gray-500 dark:text-dark-muted">
                                            <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-brand-purple" /> {new Date(featured.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-brand-orange" /> {featured.location}</span>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-4 dark:border-dark-line">
                                            <div>
                                                <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-dark-muted">From</span>
                                                <span className="font-display text-2xl text-brand-dark dark:text-dark-ink">₹{featured.ticketPrice || 1499}</span>
                                            </div>
                                            <Link
                                                to={`/events/${featured._id}`}
                                                className="btn-gradient flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[11px] font-extrabold uppercase tracking-wider text-white"
                                            >
                                                Book now <ArrowUpRight className="h-3.5 w-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                </Tilt>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats bar */}
                <div className="relative border-t border-black/5 bg-white dark:border-dark-line dark:bg-dark-surface">
                    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
                        {[
                            { icon: Flame, color: 'bg-brand-orange/10 text-brand-orange', to: 10, suffix: 'K+', label: 'Events' },
                            { icon: Star, color: 'bg-brand-purple/10 text-brand-purple', to: 500, suffix: 'K+', label: 'Users' },
                            { icon: Users, color: 'bg-brand-purple/10 text-brand-purple', to: 25, suffix: 'K+', label: 'Organizers' },
                            { icon: Heart, color: 'bg-brand-pink/10 text-brand-pink', to: 98, suffix: '%', label: 'Happy customers' },
                        ].map((s) => (
                            <div key={s.label} className="flex items-center justify-center gap-4 md:border-r md:border-black/10 last:md:border-r-0 dark:md:border-dark-line">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${s.color}`}>
                                    <s.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <Counter to={s.to} suffix={s.suffix} className="font-display text-3xl text-brand-dark dark:text-dark-ink sm:text-4xl" />
                                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-dark-muted">{s.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ 2 · FEATURED EVENTS ═══════════ */}
            <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                <Reveal>
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h2 className="font-display text-4xl uppercase leading-none text-brand-dark dark:text-dark-ink sm:text-5xl">
                                Featured <span className="text-gradient-brand">events</span>
                            </h2>
                            <p className="mt-2 text-sm text-gray-500 dark:text-dark-muted">Hand-picked experiences the crowd is loving right now.</p>
                        </div>
                        <Link
                            to="/events"
                            className="group inline-flex items-center gap-2 rounded-full border-[1.5px] border-black/15 px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-gray-700 transition-all hover:border-brand-purple hover:text-brand-purple dark:border-white/20 dark:text-dark-muted dark:hover:border-brand-purple dark:hover:text-brand-purple"
                        >
                            View all events <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </Link>
                    </div>
                </Reveal>

                <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {displayEvents.slice(0, 4).map((ev, i) => (
                        <Reveal key={ev._id} delay={(i % 4) * 0.08}>
                            <EventCard event={ev} />
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ═══════════ 3 · EXPLORE BY CATEGORY ═══════════ */}
            <section className="bg-white py-20 dark:bg-dark-page">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal className="text-center">
                        <span className="inline-flex items-center gap-2 rounded-full bg-brand-purple/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-brand-purple">
                            <SlidersHorizontal className="h-3.5 w-3.5" /> Browse
                        </span>
                        <h2 className="font-display mt-3 text-4xl uppercase leading-none text-brand-dark dark:text-dark-ink sm:text-5xl">
                            Explore by <span className="text-gradient-brand">category</span>
                        </h2>
                        <p className="mx-auto mt-3 max-w-md text-sm text-gray-500 dark:text-dark-muted">
                            From underground gigs to mega festivals — pick a lane and dive in.
                        </p>
                    </Reveal>

                    <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-6">
                        {categories.map((cat, i) => (
                            <Reveal key={cat.name} delay={i * 0.07}>
                                <motion.button
                                    whileHover={{ y: -6, rotate: i % 2 === 0 ? -1 : 1 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                                    onClick={() => navigate(`/events?category=${cat.name}`)}
                                    className="card-lift group flex w-full flex-col items-center gap-3 rounded-3xl border border-black/5 bg-brand-light p-6 text-center dark:border-dark-line dark:bg-dark-surface"
                                >
                                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${cat.color} shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}>
                                        <cat.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-display text-base uppercase text-brand-dark dark:text-dark-ink">{cat.name}</h3>
                                        <span className="text-[11px] font-bold text-gray-400 dark:text-dark-muted">{cat.count}</span>
                                    </div>
                                </motion.button>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ 4 · UPCOMING EVENTS ═══════════ */}
            <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                <Reveal>
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h2 className="font-display text-4xl uppercase leading-none text-brand-dark dark:text-dark-ink sm:text-5xl">
                                Upcoming <span className="text-gradient-brand">events</span>
                            </h2>
                            <p className="mt-2 text-sm text-gray-500 dark:text-dark-muted">Grab your passes before they sell out.</p>
                        </div>
                        <Link
                            to="/events"
                            className="group inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-600 transition-colors hover:text-brand-purple dark:text-dark-muted"
                        >
                            View all events <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </Reveal>

                {loading ? (
                    <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((n) => <SkeletonCard key={n} />)}
                    </div>
                ) : (
                    <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {upcoming.slice(0, 4).map((ev, i) => (
                            <Reveal key={ev._id} delay={(i % 4) * 0.08}>
                                <EventCard event={ev} />
                            </Reveal>
                        ))}
                    </div>
                )}
            </section>

            {/* ═══════════ 5 · WHY CHOOSE EVENTRIX ═══════════ */}
            <section className="why-section relative overflow-hidden bg-white py-24 dark:bg-dark-page">
                <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-brand-purple/10" />
                <div className="absolute -right-20 bottom-10 h-64 w-64 rounded-full bg-brand-pink/10" />

                {/* DJ illustration — parallax decor */}
                <div className="plx-dj absolute right-[6%] top-14 hidden w-44 opacity-90 xl:block">
                    <motion.img
                        src={djImg}
                        alt="DJ illustration"
                        animate={{ y: [0, -14, 0], rotate: [0, -3, 0] }}
                        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-full object-contain drop-shadow-[0_30px_40px_rgba(186,40,226,0.25)]"
                    />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal className="text-center">
                        <span className="inline-flex items-center gap-2 rounded-full bg-brand-lime/20 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-brand-lime-deep">
                            <Sparkle className="h-3.5 w-3.5" /> Eventrix advantage
                        </span>
                        <h2 className="font-display mt-3 text-4xl uppercase leading-none text-brand-dark dark:text-dark-ink sm:text-5xl">
                            Why choose <span className="text-gradient-brand">Eventrix?</span>
                        </h2>
                    </Reveal>

                    <div className="relative mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {whyFeatures.map((f, i) => (
                            <Reveal key={f.title} delay={i * 0.08}>
                                <div className={`card-lift h-full rounded-3xl border p-6 transition-all hover:-translate-y-1 ${f.accent} dark:bg-dark-surface`}>
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${f.accent} shadow-sm`}>
                                        <f.icon className="h-6 w-6" />
                                    </div>
                                    <h4 className="mt-4 text-sm font-black uppercase tracking-wide text-brand-dark dark:text-dark-ink">{f.title}</h4>
                                    <p className="mt-1.5 text-xs leading-relaxed text-gray-500 dark:text-dark-muted">{f.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>

                    {/* Floating 3D elements */}
                    <div className="plx-mic pointer-events-none absolute -left-6 top-8 hidden w-28 lg:block">
                        <motion.img
                            src={micImg}
                            alt="3D microphone"
                            animate={{ y: [0, -10, 0], rotate: [0, 4, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-full object-contain"
                        />
                    </div>
                    <div className="plx-phone pointer-events-none absolute -right-4 top-2/3 hidden w-28 lg:block">
                        <motion.img
                            src={headphonesImg}
                            alt="3D headphones"
                            animate={{ y: [0, -12, 0], rotate: [0, -5, 0] }}
                            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-full object-contain"
                        />
                    </div>
                </div>
            </section>

            {/* ═══════════ 6 · CTA BANNER ═══════════ */}
            <section className="cta-section mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
                <Reveal>
                    <div className="relative overflow-hidden rounded-[2.5rem] border border-brand-purple/20 bg-brand-purple/[0.08] px-6 py-14 sm:px-12 sm:py-16 dark:bg-brand-purple/[0.12]">
                        <div className="absolute inset-0 dots-bg opacity-30" />

                        <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
                            {/* Left copy */}
                            <div className="lg:col-span-6">
                                <span className="inline-flex items-center gap-2 rounded-full border border-brand-purple/25 bg-white px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-purple dark:bg-dark-surface">
                                    <Sparkle className="h-3 w-3" /> Join the movement
                                </span>
                                <h2 className="font-display mt-4 text-4xl uppercase leading-[0.95] text-brand-dark dark:text-dark-ink sm:text-6xl">
                                    Ready for your <br /> next experience?
                                </h2>
                                <p className="mt-4 max-w-md text-sm leading-relaxed text-gray-500 dark:text-dark-muted">
                                    Join thousands of people discovering and booking amazing events.
                                </p>
                                <Link
                                    to="/register"
                                    className="btn-gradient mt-8 inline-flex items-center gap-2 rounded-full px-9 py-4 text-xs font-extrabold uppercase tracking-wider text-white"
                                >
                                    Sign up now <ArrowUpRight className="h-4 w-4" />
                                </Link>
                            </div>

                            {/* Right visual: crowd photo + progress ring + badge */}
                            <div className="relative lg:col-span-6">
                                <div className="relative mx-auto max-w-lg overflow-hidden rounded-[2rem] border-4 border-white bg-brand-gray-900 shadow-[0_40px_90px_-30px_rgba(186,40,226,0.4)] dark:border-dark-surface">
                                    <img
                                        src={crowdImg}
                                        alt="Concert crowd raising hands"
                                        className="plx-cta-img h-72 w-full object-cover sm:h-80"
                                    />
                                    <div className="absolute inset-0 bg-brand-purple/20" />
                                </div>

                                {/* Progress ring */}
                                <motion.svg
                                    initial={{ rotate: -90 }}
                                    animate={{ rotate: 270 }}
                                    transition={{ duration: 2.4, ease: 'easeInOut', delay: 0.3 }}
                                    viewBox="0 0 120 120"
                                    className="absolute -left-6 -top-6 hidden h-28 w-28 sm:block"
                                >
                                    <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(186,40,226,0.15)" strokeWidth="12" />
                                    <circle cx="60" cy="60" r="52" fill="none" stroke="#ba28e2" strokeWidth="12" strokeDasharray="326" strokeDashoffset="72" strokeLinecap="round" />
                                </motion.svg>

                                {/* GOOD VIBES ONLY badge */}
                                <div className="sticker -bottom-6 -right-3 flex h-24 w-24 rotate-6 flex-col items-center justify-center rounded-full bg-brand-lime text-center text-brand-dark shadow-[0_20px_40px_-10px_rgba(166,255,0,0.5)] animate-float-slow sm:h-28 sm:w-28">
                                    <span className="font-display text-[11px] uppercase leading-tight sm:text-sm">Good</span>
                                    <span className="font-display text-[11px] uppercase leading-tight sm:text-sm">Vibes</span>
                                    <span className="font-display text-[11px] uppercase leading-tight sm:text-sm">Only</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </section>

            {/* ═══════════ 7 · SIMPLE BOOKING FLOW ═══════════ */}
            <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
                <Reveal className="text-center">
                    <span className="inline-flex items-center gap-2 rounded-full bg-brand-pink/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-brand-pink">
                        <Ticket className="h-3.5 w-3.5" /> How it works
                    </span>
                    <h2 className="font-display mt-3 text-4xl uppercase leading-none text-brand-dark dark:text-dark-ink sm:text-5xl">
                        Simple booking <span className="text-gradient-brand">flow</span>
                    </h2>
                    <p className="mx-auto mt-3 max-w-md text-sm text-gray-500 dark:text-dark-muted">
                        Book your tickets in just a few simple steps.
                    </p>
                </Reveal>

                <div className="relative mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
                    {/* dotted connector (desktop) */}
                    <div className="absolute left-[8%] right-[8%] top-7 hidden border-t-2 border-dashed border-brand-purple/40 lg:block" />
                    {bookingSteps.map((step, i) => (
                        <Reveal key={step.title} delay={i * 0.1}>
                            <div className="group relative flex flex-col items-center text-center">
                                <span className="font-display absolute -top-6 text-5xl text-brand-gray-400/30 transition-colors group-hover:text-brand-purple/40 dark:text-dark-muted/30">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: i % 2 === 0 ? -5 : 5 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 16 }}
                                    className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-purple text-white shadow-[0_14px_30px_-10px_rgba(186,40,226,0.5)]"
                                >
                                    <step.icon className="h-6 w-6" />
                                    {i === 4 && (
                                        <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand-lime text-[10px] font-black text-brand-dark">
                                            05
                                        </span>
                                    )}
                                </motion.div>
                                <h4 className="mt-4 text-sm font-black uppercase tracking-wide text-brand-dark dark:text-dark-ink">{step.title}</h4>
                                <p className="mt-1 max-w-[150px] text-xs leading-relaxed text-gray-500 dark:text-dark-muted">{step.desc}</p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ═══════════ 8 · TESTIMONIALS ═══════════ */}
            <section className="bg-white py-20 dark:bg-dark-page">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal className="text-center">
                        <span className="inline-flex items-center gap-2 rounded-full bg-brand-purple/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-brand-purple">
                            <Star className="h-3.5 w-3.5" fill="currentColor" /> Testimonials
                        </span>
                        <h2 className="font-display mt-3 text-4xl uppercase leading-none text-brand-dark dark:text-dark-ink sm:text-5xl">
                            Loved by <span className="text-gradient-brand">the crowd</span>
                        </h2>
                    </Reveal>

                    <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                        {testimonials.map((t, i) => (
                            <Reveal key={t.name} delay={i * 0.1}>
                                <div className="card-lift flex h-full flex-col rounded-[2rem] border border-black/5 bg-brand-light p-7 dark:border-dark-line dark:bg-dark-surface">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, s) => (
                                            <Star key={s} className="h-4 w-4 text-brand-orange" fill="currentColor" />
                                        ))}
                                    </div>
                                    <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-600 dark:text-dark-muted">"{t.quote}"</p>
                                    <div className="mt-6 flex items-center gap-3 border-t border-black/5 pt-5 dark:border-dark-line">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-purple text-sm font-black text-white">
                                            {t.initials}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-brand-dark dark:text-dark-ink">{t.name}</h4>
                                            <p className="text-xs font-bold text-gray-400 dark:text-dark-muted">{t.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ 9 · NEWSLETTER ═══════════ */}
            <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                <Reveal>
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-brand-purple px-6 py-16 text-center text-white sm:px-12">
                        <div className="absolute inset-0 dots-bg-light opacity-40" />
                        <div className="sticker -top-5 left-10 hidden bg-brand-lime px-4 py-2 text-[11px] text-brand-dark animate-float sm:flex">
                            Early bird drops 🔥
                        </div>
                        <div className="sticker -bottom-4 right-14 hidden bg-white px-4 py-2 text-[11px] text-brand-pink animate-float-slow sm:flex">
                            No spam, ever
                        </div>

                        <div className="relative mx-auto max-w-xl">
                            <h2 className="font-display text-4xl uppercase leading-[0.95] sm:text-5xl">
                                Get the good vibes <br /> in your inbox
                            </h2>
                            <p className="mx-auto mt-4 max-w-md text-sm text-white/80">
                                Join 500K+ event lovers. Early-bird passes, secret gigs and festival news — twice a month, straight to you.
                            </p>

                            {subscribed ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mx-auto mt-8 flex max-w-md items-center justify-center gap-2 rounded-full bg-white/20 px-6 py-4 font-black uppercase tracking-wider"
                                >
                                    <CheckCircle2 className="h-5 w-5 text-brand-lime" /> You're on the list! See you at the festival 🎉
                                </motion.div>
                            ) : (
                                <form
                                    onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }}
                                    className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
                                >
                                    <input
                                        type="email"
                                        required
                                        placeholder="your@email.com"
                                        className="flex-1 rounded-full border border-white/30 bg-white/15 px-6 py-4 text-sm font-semibold text-white placeholder-white/60 outline-none transition-colors focus:border-white"
                                    />
                                    <button
                                        type="submit"
                                        className="rounded-full bg-brand-dark px-8 py-4 text-xs font-extrabold uppercase tracking-wider text-white transition-all hover:scale-[1.03] hover:bg-black"
                                    >
                                        Subscribe
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </Reveal>
            </section>
        </div>
    );
};

export default Home;
