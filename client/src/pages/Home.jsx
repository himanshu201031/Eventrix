import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../utils/axios';
import { getLenis } from '../utils/smoothScroll';
import EventCard from '../components/EventCard';
import { DirectionalTransition, TransitionLink, push } from '../components/Transitions';
import { Reveal, Counter, Magnetic, Tilt, Marquee } from '../animations';
import crowdImg from '../assets/crowd.png';
import djImg from '../assets/dj.png';
import micImg from '../assets/mic3d.png';
import headphonesImg from '../assets/headphones3d.png';
import {
    ArrowUpRight, BadgePercent, CalendarCheck, CalendarDays, ChevronDown, ChevronRight,
    Flame, GraduationCap, Headphones, MapPin, Mic2, Music2, PartyPopper, Plus,
    Search, ShieldCheck, Sparkle, Star, Ticket, Trophy, Users,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ---------- Demo content (shown while the API loads or is empty) ---------- */
const demoEvents = [
    {
        _id: 'sunset-fest-2026',
        title: 'Sunset Music Festival 2026',
        category: 'Festivals',
        date: '2026-12-14',
        location: 'Goa, India',
        ticketPrice: 1499,
        description: 'Three days of non-stop music, art and beach vibes.',
        image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200&auto=format&fit=crop',
        totalSeats: 5000, availableSeats: 3200,
    },
    {
        _id: 'arijit-live-2026',
        title: 'Arijit Singh · Live in Concert',
        category: 'Music',
        date: '2026-10-24',
        location: 'Mumbai, India',
        ticketPrice: 2399,
        description: 'An unforgettable night of soulful melodies under the stars.',
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1200&auto=format&fit=crop',
        totalSeats: 8000, availableSeats: 4100,
    },
    {
        _id: 'techcrunch-disrupt-2026',
        title: 'TechCrunch Disrupt 2026',
        category: 'Conferences',
        date: '2026-11-05',
        location: 'Bengaluru, India',
        ticketPrice: 4999,
        description: 'Startups, investors and the future of technology in one room.',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
        totalSeats: 3000, availableSeats: 890,
    },
    {
        _id: 'sunburn-arena-2026',
        title: 'Sunburn Arena Nights',
        category: 'Music',
        date: '2026-12-31',
        location: 'Delhi NCR, India',
        ticketPrice: 2999,
        description: 'The biggest EDM night of the year with world-class DJs.',
        image: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=1200&auto=format&fit=crop',
        totalSeats: 12000, availableSeats: 5200,
    },
    {
        _id: 'india-design-week-2026',
        title: 'India Design Week 2026',
        category: 'Workshops',
        date: '2026-09-18',
        location: 'Jaipur, India',
        ticketPrice: 1799,
        description: 'Design thinking, workshops and creative showcases.',
        image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop',
        totalSeats: 1500, availableSeats: 620,
    },
    {
        _id: 'holi-rave-2027',
        title: 'Holi Rave · Colors of Sound',
        category: 'Festivals',
        date: '2027-03-07',
        location: 'Jaipur, India',
        ticketPrice: 1299,
        description: 'Colour, bass and a thousand strangers becoming friends.',
        image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200&auto=format&fit=crop',
        totalSeats: 4000, availableSeats: 2750,
    },
];

const categories = [
    { name: 'Music', icon: Music2, tint: 'bg-brand-pink/15 text-brand-pink', count: '1,234 events' },
    { name: 'Festivals', icon: PartyPopper, tint: 'bg-brand-purple/15 text-brand-purple', count: '845 events' },
    { name: 'Workshops', icon: GraduationCap, tint: 'bg-brand-lime/15 text-brand-lime-deep', count: '645 events' },
    { name: 'Conferences', icon: Mic2, tint: 'bg-brand-purple-deep/15 text-brand-purple', count: '321 events' },
    { name: 'Sports', icon: Trophy, tint: 'bg-brand-cyan/15 text-brand-cyan', count: '421 events' },
    { name: 'Meetups', icon: Users, tint: 'bg-brand-orange/15 text-brand-orange', count: '621 events' },
];

const whyFeatures = [
    { icon: ShieldCheck, tint: 'text-brand-lime', chip: 'bg-brand-lime/15', title: 'OTP-verified booking', desc: 'Every booking is confirmed to your email before a seat is held. No bots, no ghost tickets.' },
    { icon: CalendarCheck, tint: 'text-brand-pink', chip: 'bg-brand-pink/15', title: 'Instant QR passes', desc: 'Your pass lands in the app the moment payment clears — gate-ready before you leave the house.' },
    { icon: BadgePercent, tint: 'text-brand-orange', chip: 'bg-brand-orange/15', title: 'Best-price promise', desc: 'Early-bird pricing and member deals, with no surprise fees hiding at checkout.' },
    { icon: Headphones, tint: 'text-brand-cyan', chip: 'bg-brand-cyan/15', title: '24/7 human support', desc: 'Real people, day or night. Most replies land inside five minutes.' },
];

const stats = [
    { icon: Flame, to: 12, suffix: 'K+', label: 'Events listed', tint: 'text-brand-orange', chip: 'bg-brand-orange/15' },
    { icon: Ticket, to: 500, suffix: 'K+', label: 'Tickets booked', tint: 'text-brand-pink', chip: 'bg-brand-pink/15' },
    { icon: MapPin, to: 40, suffix: '+', label: 'Cities covered', tint: 'text-brand-cyan', chip: 'bg-brand-cyan/15' },
    { icon: Users, to: 98, suffix: '%', label: 'Gate-in rate', tint: 'text-brand-purple', chip: 'bg-brand-purple/15' },
];

const testimonials = [
    { name: 'Ananya Sharma', role: 'Festival regular · Goa', quote: 'Booked Sunset Festival on a Sunday night. The QR pass was in my wallet before I finished my chai — zero queue at the gate.', initials: 'AS' },
    { name: 'Rohan Mehta', role: 'Tech founder · Bengaluru', quote: 'Every ticket, invoice and confirmation sits in one dashboard. I always know what I paid and what is coming up.', initials: 'RM' },
    { name: 'Zara Khan', role: 'Music lover · Mumbai', quote: 'Found the Arijit show in seconds, grabbed an early-bird pass, got the OTP, done. Booking felt genuinely smooth.', initials: 'ZK' },
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

/* Live countdown — ticks every second, shows ON NOW when the date has passed */
const Countdown = ({ target }) => {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, []);

    const diff = target - now;
    if (!(diff > 0)) {
        return (
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-lime px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-brand-dark">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-dark" /> On now
            </span>
        );
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    const pad = (n) => String(n).padStart(2, '0');

    const cells = [
        { v: String(days).padStart(2, '0'), l: 'days' },
        { v: pad(hours), l: 'hrs' },
        { v: pad(mins), l: 'min' },
        { v: pad(secs), l: 'sec' },
    ];

    return (
        <div className="flex items-center gap-1.5">
            {cells.map((c, i) => (
                <React.Fragment key={c.l}>
                    <span className="flex min-w-[44px] flex-col items-center rounded-xl border border-white/10 bg-white/10 px-2 py-1.5">
                        <span className="font-mono text-lg leading-none text-white">{c.v}</span>
                        <span className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-white/40">{c.l}</span>
                    </span>
                    {i < cells.length - 1 && <span className="font-mono text-sm text-brand-lime">:</span>}
                </React.Fragment>
            ))}
        </div>
    );
};

/* Deterministic faux pass number, e.g. EVX-7K2M */
const passSerial = (str) => {
    let h = 0;
    for (let i = 0; i < str.length; i += 1) h = (h * 31 + str.charCodeAt(i)) % 100000;
    const alpha = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let out = '';
    let x = h;
    for (let i = 0; i < 4; i += 1) { out += alpha[x % alpha.length]; x = Math.floor(x / alpha.length); }
    return `EVX-${out}`;
};

/* Fallback target for the pass countdown when an event has no date */
const FALLBACK_TARGET = Date.now() + 30 * 86400000;

const Home = () => {
    const navigate = useNavigate();
    const heroRef = useRef(null);
    const whyRef = useRef(null);
    const [searchParams] = useSearchParams();
    const search = searchParams.get('search') || '';
    const [events, setEvents] = useState([]);
    const [heroQuery, setHeroQuery] = useState('');
    const [heroCategory, setHeroCategory] = useState('');
    const [heroLocation, setHeroLocation] = useState('');
    const [loading, setLoading] = useState(true);
    const [subscribed, setSubscribed] = useState(false);
    const [email, setEmail] = useState('');

    /* ---- API events (kept from original implementation) ---- */
    const fetchEvents = useCallback(async () => {
        try {
            const { data } = await api.get(`/events?search=${search}`);
            setEvents(data.items ?? []);
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

    /* ---- GSAP: load-in sequence + scroll parallax (synced with Lenis) ---- */
    useEffect(() => {
        const lenis = getLenis();
        if (lenis) lenis.on('scroll', ScrollTrigger.update);

        /* Reduced motion: content renders in its final, static state — no
           entrance choreography and no scroll-driven parallax (the CSS guard
           can't stop GSAP, so we gate it here). */
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return () => {
                if (lenis) lenis.off('scroll', ScrollTrigger.update);
            };
        }

        const heroCtx = gsap.context(() => {
            gsap.fromTo(
                '.hero-el',
                { y: 46, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: 'power3.out', delay: 0.1 }
            );
            gsap.fromTo(
                '.hero-sticker',
                { scale: 0, rotate: -24 },
                { scale: 1, rotate: 0, duration: 0.8, stagger: 0.15, ease: 'back.out(1.8)', delay: 0.75 }
            );

            /* Hero content drifts up as you scroll */
            gsap.to('.hero-content', {
                yPercent: -6,
                ease: 'none',
                scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
            });

            /* Hero photo slowly un-scales for depth */
            gsap.to('.plx-hero-img', {
                scale: 1.1,
                ease: 'none',
                scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
            });
        }, heroRef);

        /* Why-section illustrations drift at their own speed */
        const whyCtx = gsap.context(() => {
            gsap.to('.plx-dj', {
                yPercent: -14,
                ease: 'none',
                scrollTrigger: { trigger: whyRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
            });
            gsap.to('.plx-mic', {
                yPercent: 22,
                ease: 'none',
                scrollTrigger: { trigger: whyRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
            });
            gsap.to('.plx-phone', {
                yPercent: 28,
                ease: 'none',
                scrollTrigger: { trigger: whyRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
            });
        }, whyRef);

        return () => {
            heroCtx.revert();
            whyCtx.revert();
            if (lenis) lenis.off('scroll', ScrollTrigger.update);
        };
    }, []);

    const displayEvents = events.length > 0 ? events : demoEvents;
    const featured = displayEvents[0];
    const featuredDate = new Date(featured?.date);
    const validFeaturedDate = featured && !Number.isNaN(featuredDate.getTime()) ? featuredDate : new Date(FALLBACK_TARGET);

    /* Trending: ranked by tickets already sold this week */
    const trending = [...displayEvents]
        .sort((a, b) => (b.totalSeats - b.availableSeats) - (a.totalSeats - a.availableSeats))
        .slice(0, 4);

    /* Upcoming: a real chronological lineup */
    const upcoming = [...displayEvents]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 6);

    const marqueeItems = [
        ...displayEvents.map((e) => e.title),
        'Lollapalooza India', 'NH7 Weekender', 'Comic Con India', 'Magnetic Fields',
    ];

    const goToSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (heroQuery) params.set('search', heroQuery);
        if (heroCategory) params.set('category', heroCategory);
        if (heroLocation) params.set('location', heroLocation);
        const qs = params.toString();
        push(navigate, qs ? `/events?${qs}` : '/events');
    };

    const subscribe = (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        setSubscribed(true);
    };

    const formatDate = (d) =>
        new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <DirectionalTransition>
        <div>
            {/* ═══════════ STAGE · HERO (always night) ═══════════ */}
            <section ref={heroRef} className="relative overflow-hidden bg-[#0b0b14] text-white">
                {/* Dynamic gradient background — drifting aurora */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                    <div className="aurora-blob aurora-a -left-48 -top-40 h-[620px] w-[620px]" />
                    <div className="aurora-blob aurora-b top-1/3 -right-48 h-[560px] w-[560px]" style={{ animationDelay: '-7s' }} />
                    <div className="aurora-blob aurora-c -bottom-52 left-1/3 h-[560px] w-[560px]" style={{ animationDelay: '-13s' }} />
                </div>
                <div className="pointer-events-none absolute inset-0 dots-bg opacity-30" aria-hidden="true" />
                <div className="noise pointer-events-none absolute inset-0" aria-hidden="true" />

                <div className="hero-content relative mx-auto max-w-7xl px-4 pt-32 pb-14 sm:px-6 sm:pt-40 lg:px-8">
                    <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
                        {/* Left: thesis */}
                        <div className="lg:col-span-7">
                            <span className="hero-el eyebrow inline-flex items-center gap-2.5 text-[11px] text-brand-lime">
                                <Sparkle className="h-3.5 w-3.5" fill="currentColor" />
                                Concerts · Festivals · Workshops — 40+ cities
                            </span>

                            <h1 className="hero-el font-display mt-5 text-[3.4rem] uppercase leading-[0.9] tracking-tight sm:text-8xl lg:text-[6rem]">
                                <span className="block">The ticket</span>
                                <span className="text-outline block">to your</span>
                                <span className="text-brand-pink block">next night</span>
                            </h1>

                            <p className="hero-el mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
                                Concerts, festivals and workshops across India. Book in seconds —
                                your pass is gate-ready before you leave the house.
                            </p>

                            {/* Search */}
                            <form onSubmit={goToSearch} className="hero-el mt-8 max-w-2xl">
                                <Magnetic strength={0.06}>
                                    <div className="flex flex-col gap-2 rounded-[2rem] border border-white/15 bg-[#14141f] p-2 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)] sm:flex-row sm:items-center sm:pl-5">
                                        <div className="flex flex-1 items-center gap-2.5">
                                            <Search className="h-5 w-5 shrink-0 text-brand-lime" />
                                            <input
                                                type="text"
                                                value={heroQuery}
                                                onChange={(e) => setHeroQuery(e.target.value)}
                                                placeholder="Search artists, festivals, venues…"
                                                className="w-full bg-transparent py-2.5 text-sm font-semibold text-white placeholder-white/40 outline-none"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="relative flex items-center">
                                                <select
                                                    value={heroCategory}
                                                    onChange={(e) => setHeroCategory(e.target.value)}
                                                    aria-label="Filter by category"
                                                    className="appearance-none rounded-full border border-white/15 bg-white/10 py-2.5 pl-4 pr-9 font-mono text-[11px] font-bold uppercase tracking-wider text-white/85 outline-none transition-colors hover:border-brand-lime/60 focus:border-brand-lime"
                                                >
                                                    <option value="" className="bg-[#14141f] text-white/70">All categories</option>
                                                    {['Music', 'Festivals', 'Workshops', 'Conferences', 'Sports'].map((c) => (
                                                        <option key={c} value={c} className="bg-[#14141f] text-white/70">{c}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-white/50" />
                                            </div>
                                            <div className="relative hidden items-center md:flex">
                                                <select
                                                    value={heroLocation}
                                                    onChange={(e) => setHeroLocation(e.target.value)}
                                                    aria-label="Filter by city"
                                                    className="appearance-none rounded-full border border-white/15 bg-white/10 py-2.5 pl-4 pr-9 font-mono text-[11px] font-bold uppercase tracking-wider text-white/85 outline-none transition-colors hover:border-brand-lime/60 focus:border-brand-lime"
                                                >
                                                    <option value="" className="bg-[#14141f] text-white/70">Any city</option>
                                                    {['Mumbai', 'Goa', 'Bengaluru', 'Delhi', 'Jaipur'].map((l) => (
                                                        <option key={l} value={l} className="bg-[#14141f] text-white/70">{l}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-white/50" />
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
                                <span className="eyebrow mr-1 text-[11px] text-white/40">Popular:</span>
                                {['Concerts', 'Festivals', 'Workshops', 'Conferences', 'Sports', 'More'].map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => push(navigate, `/events?category=${tag === 'More' ? 'Tech' : tag}`)}
                                        className="rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-white/70 transition-all hover:border-brand-lime/70 hover:text-brand-lime"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right: the pass — this page's signature */}
                        <div className="hero-el relative lg:col-span-5">
                            {/* Floating stickers */}
                            <div className="hero-sticker sticker -top-10 right-10 z-20 h-24 w-24 rotate-12 rounded-full bg-brand-lime text-brand-dark shadow-[0_20px_50px_-12px_rgba(166,255,0,0.5)] animate-float">
                                <div className="flex flex-col items-center leading-tight">
                                    <span className="font-display text-sm uppercase">Early</span>
                                    <span className="font-display text-sm uppercase">bird</span>
                                    <span className="font-display text-lg uppercase leading-none">30%</span>
                                </div>
                            </div>
                            <div className="hero-sticker sticker -left-5 top-16 z-20 rounded-[2rem] rounded-bl-md bg-brand-orange px-5 py-3 text-[11px] text-white shadow-[0_16px_36px_-14px_rgba(255,90,31,0.55)] animate-float-slow">
                                <Sparkle className="mr-1.5 h-3.5 w-3.5 text-brand-lime" fill="currentColor" />
                                Feel the vibe
                            </div>
                            <div className="hero-sticker sticker -right-4 bottom-32 z-20 hidden rounded-[2rem] rounded-tr-md bg-brand-purple px-5 py-3 text-[11px] text-white shadow-[0_16px_36px_-14px_rgba(186,40,226,0.55)] animate-float lg:flex">
                                <Ticket className="mr-1.5 h-3.5 w-3.5 text-brand-lime" />
                                Instant QR pass
                            </div>

                            {/* Doodles */}
                            <motion.span
                                animate={{ rotate: [0, 18, 0], y: [0, -8, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute -top-2 left-8 hidden text-brand-lime md:block"
                            >
                                <Plus className="h-6 w-6" />
                            </motion.span>
                            <motion.span
                                animate={{ rotate: [0, -14, 0], y: [0, 6, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute -bottom-10 -left-10 hidden text-brand-orange lg:block"
                            >
                                <Star className="h-7 w-7" fill="currentColor" />
                            </motion.span>
                            <span className="absolute right-16 top-40 hidden h-8 w-8 rounded-full border-[3px] border-brand-cyan/80 lg:block" />

                            {/* The pass */}
                            <div className="relative rotate-2 transition-transform duration-500">
                                <Tilt max={6}>
                                    <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-[#14141f] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)]">
                                        {/* Image + glass overlay */}
                                        <div className="relative h-56 w-full overflow-hidden bg-[#1a1a24]">
                                            <img
                                                src={featured?.image || crowdImg}
                                                alt={featured?.title || 'Featured event'}
                                                onError={(e) => { e.target.src = crowdImg; }}
                                                className="plx-hero-img h-full w-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/45" />
                                            <span className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-sunset px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
                                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                                                Featured
                                            </span>
                                            <span className="absolute right-4 top-4 z-10 rounded-full border border-white/20 bg-[#0b0b14]/80 px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-white">
                                                {featured?.category || 'Festivals'}
                                            </span>
                                        </div>

                                        {/* Pass body */}
                                        <div className="p-5 sm:p-6">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <span className="eyebrow text-[11px] text-brand-lime">Pass · General admission</span>
                                                    <h3 className="font-display mt-1.5 text-2xl uppercase leading-none tracking-wide text-white sm:text-[1.7rem]">
                                                        {featured?.title || 'Sunset Music Festival'}
                                                    </h3>
                                                </div>
                                                <div className="text-right">
                                                    <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">From</span>
                                                    <span className="font-display text-2xl leading-none text-white">₹{featured?.ticketPrice || 1499}</span>
                                                </div>
                                            </div>

                                            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-xs text-white/55">
                                                <span className="flex items-center gap-1.5">
                                                    <CalendarDays className="h-3.5 w-3.5 text-brand-pink" />
                                                    {featured ? formatDate(featured.date) : 'TBA'}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin className="h-3.5 w-3.5 text-brand-orange" />
                                                    {featured?.location || 'Venue TBA'}
                                                </span>
                                            </div>

                                            {/* Countdown */}
                                            <div className="mt-5 flex flex-wrap items-center gap-4">
                                                <span className="eyebrow text-[11px] text-white/45">Doors open in</span>
                                                <Countdown target={validFeaturedDate.getTime()} />
                                            </div>
                                        </div>

                                        {/* Perforation */}
                                        <div className="relative mx-5 border-t-2 border-dashed border-white/20">
                                            <span className="ticket-notch -left-5" aria-hidden="true" />
                                            <span className="ticket-notch -right-5" aria-hidden="true" />
                                        </div>

                                        {/* Stub */}
                                        <div className="flex items-center justify-between gap-4 p-5 sm:p-6">
                                            <TransitionLink
                                                to={featured ? `/events/${featured._id}` : '/events'}
                                                className="btn-gradient flex shrink-0 items-center gap-2 rounded-full px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white"
                                            >
                                                Book tickets <ArrowUpRight className="h-3.5 w-3.5" />
                                            </TransitionLink>
                                            <div className="flex items-center gap-4">
                                                <div className="barcode hidden w-36 text-white/60 sm:block" aria-hidden="true" />
                                                <div className="text-right">
                                                    <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">Pass no.</span>
                                                    <span className="font-mono text-sm font-bold text-brand-lime">{passSerial(featured?._id || 'eventrix')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Tilt>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lineup marquee — the curtain between stage and content */}
                <div className="marquee-band relative border-white/10 bg-[#0b0b14] py-4">
                    <Marquee>
                        {marqueeItems.map((name, i) => (
                            <span key={`${name}-${i}`} className="mx-5 flex items-center gap-5 font-display text-xl uppercase text-white/50 sm:text-2xl">
                                {name}
                                <Sparkle className="h-4 w-4 shrink-0 text-brand-lime/70" fill="currentColor" />
                            </span>
                        ))}
                    </Marquee>
                </div>
            </section>

            {/* ═══════════ STATS ═══════════ */}
            <section className="border-b border-black/5 bg-white dark:border-white/5 dark:bg-dark-page">
                <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
                    {stats.map((s, i) => (
                        <Reveal key={s.label} delay={i * 0.08} className="flex items-center justify-center gap-4 md:border-r md:border-black/10 md:last:border-r-0 dark:md:border-white/10">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${s.chip} ${s.tint}`}>
                                <s.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <Counter to={s.to} suffix={s.suffix} className="font-display text-3xl text-brand-dark sm:text-4xl dark:text-dark-ink" />
                                <div className="eyebrow mt-1 text-[10px] text-gray-400 dark:text-dark-muted">{s.label}</div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ═══════════ FEATURED EVENTS ═══════════ */}
            <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                <Reveal>
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <span className="eyebrow text-[11px] text-brand-pink">Hand-picked this week</span>
                            <h2 className="font-display mt-2 text-4xl uppercase leading-none text-brand-dark sm:text-5xl dark:text-dark-ink">
                                Featured <span className="text-brand-purple">events</span>
                            </h2>
                            <p className="mt-3 text-sm text-gray-500 dark:text-dark-muted">The shows the crowd is talking about right now.</p>
                        </div>
                        <TransitionLink
                            to="/events"
                            className="group inline-flex items-center gap-2 rounded-full border-[1.5px] border-black/15 px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-gray-700 transition-all hover:border-brand-pink hover:text-brand-pink dark:border-white/20 dark:text-dark-muted dark:hover:border-brand-pink dark:hover:text-brand-pink"
                        >
                            View all events <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </TransitionLink>
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

            {/* ═══════════ POPULAR CATEGORIES ═══════════ */}
            <section className="border-y border-black/5 bg-white py-20 dark:border-white/5 dark:bg-dark-page">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal className="text-center">
                        <span className="eyebrow text-[11px] text-brand-lime-deep">Six ways to spend a night out</span>
                        <h2 className="font-display mt-2 text-4xl uppercase leading-none text-brand-dark sm:text-5xl dark:text-dark-ink">                                    Pick your <span className="text-brand-purple">vibe</span>
                        </h2>
                    </Reveal>

                    <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-6">
                        {categories.map((cat, i) => (
                            <Reveal key={cat.name} delay={i * 0.07}>
                                <motion.button
                                    whileHover={{ y: -6, rotate: i % 2 === 0 ? -1 : 1 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                                    onClick={() => push(navigate, `/events?category=${cat.name}`)}
                                    className="glass-card group flex w-full flex-col items-center gap-3 rounded-3xl border border-black/5 bg-brand-light p-6 text-center dark:border-white/10 dark:bg-white/[0.04]"
                                >
                                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${cat.tint} shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}>
                                        <cat.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-display text-base uppercase text-brand-dark dark:text-dark-ink">{cat.name}</h3>
                                        <span className="font-mono text-[11px] font-bold text-gray-400 dark:text-dark-muted">{cat.count}</span>
                                    </div>
                                </motion.button>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ TRENDING EVENTS ═══════════ */}
            <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                <Reveal>
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <span className="eyebrow inline-flex items-center gap-2 text-[11px] text-brand-orange">
                                <Flame className="h-3.5 w-3.5" fill="currentColor" /> Ranked by tickets sold
                            </span>
                            <h2 className="font-display mt-2 text-4xl uppercase leading-none text-brand-dark sm:text-5xl dark:text-dark-ink">
                                Trending <span className="text-brand-purple">this week</span>
                            </h2>
                            <p className="mt-3 text-sm text-gray-500 dark:text-dark-muted">The most-booked shows right now — seats are moving.</p>
                        </div>
                    </div>
                </Reveal>

                <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
                    {trending.map((ev, i) => (
                        <div key={ev._id} className="relative w-[300px] shrink-0 snap-start sm:w-[320px]">
                            <span
                                className={`font-display pointer-events-none absolute -top-9 left-2 z-0 text-8xl leading-none text-black/10 dark:text-white/10 ${i === 0 ? 'text-brand-orange/25 dark:text-brand-orange/25' : ''}`}
                                aria-hidden="true"
                            >
                                {i + 1}
                            </span>
                            <div className="relative z-10">
                                <EventCard event={ev} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════ UPCOMING · THE LINEUP ═══════════ */}
            <section className="border-y border-black/5 bg-white py-20 dark:border-white/5 dark:bg-dark-page">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal>
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <span className="eyebrow text-[11px] text-brand-purple">What's on next, in order</span>
                                <h2 className="font-display mt-2 text-4xl uppercase leading-none text-brand-dark sm:text-5xl dark:text-dark-ink">
                                    The <span className="text-brand-purple">lineup</span>
                                </h2>
                                <p className="mt-3 text-sm text-gray-500 dark:text-dark-muted">Dates, venues and live seat counts — grab yours before the meter empties.</p>
                            </div>
                            <TransitionLink
                                to="/events"
                                className="group inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-600 transition-colors hover:text-brand-purple dark:text-dark-muted dark:hover:text-brand-purple"
                            >
                                View all events <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </TransitionLink>
                        </div>
                    </Reveal>

                    <div className="mt-10 overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-[0_20px_60px_-30px_rgba(13,13,17,0.25)] dark:border-white/10 dark:bg-white/[0.03]">
                        {loading ? (
                            <div className="space-y-0 p-6">
                                {[1, 2, 3, 4].map((n) => (
                                    <div key={n} className="skeleton mb-4 h-20 w-full rounded-2xl" />
                                ))}
                            </div>
                        ) : (
                            upcoming.map((ev, i) => {
                                const d = new Date(ev.date);
                                const day = Number.isNaN(d.getTime()) ? '--' : d.getDate();
                                const month = Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString(undefined, { month: 'short' });
                                const year = Number.isNaN(d.getTime()) ? '' : d.getFullYear();
                                const available = ev.availableSeats ?? ev.totalSeats ?? 50;
                                const total = ev.totalSeats ?? 100;
                                const pct = Math.round((available / total) * 100);
                                const low = available > 0 && available <= 15;
                                const soldOut = available <= 0;
                                return (
                                    <TransitionLink
                                        key={ev._id}
                                        to={`/events/${ev._id}`}
                                        className={`group grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-2 px-5 py-5 transition-colors hover:bg-black/[0.03] sm:grid-cols-[120px_1fr_120px_auto] sm:gap-x-8 sm:px-8 dark:hover:bg-white/[0.05] ${i !== 0 ? 'border-t border-black/5 dark:border-white/10' : ''}`}
                                    >
                                        {/* Date block */}
                                        <div className="flex items-center gap-3">
                                            <span className="font-display text-4xl leading-none text-brand-dark dark:text-white">{day}</span>
                                            <span className="font-mono text-[11px] uppercase leading-tight text-gray-400 dark:text-dark-muted">
                                                <span className="block">{month}</span>
                                                <span className="block">{year}</span>
                                            </span>
                                        </div>

                                        {/* Title + venue */}
                                        <div className="min-w-0">
                                            <h3 className="font-display truncate text-lg uppercase leading-tight tracking-wide text-brand-dark transition-colors group-hover:text-brand-pink sm:text-xl dark:text-dark-ink dark:group-hover:text-brand-pink">
                                                {ev.title}
                                            </h3>
                                            <div className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-gray-400 dark:text-dark-muted">
                                                <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-orange" />
                                                <span className="truncate">{ev.location || 'Venue TBA'}</span>
                                            </div>
                                        </div>

                                        {/* Seats meter */}
                                        <div className="hidden w-full sm:block">
                                            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider">
                                                <span className="text-gray-400 dark:text-dark-muted">Seats left</span>
                                                <span className={soldOut ? 'font-bold text-red-500' : low ? 'font-bold text-brand-orange' : 'font-bold text-brand-lime-deep dark:text-brand-lime'}>
                                                    {soldOut ? 'Sold out' : available}
                                                </span>
                                            </div>
                                            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                                                <div
                                                    className={`h-full rounded-full ${soldOut ? 'bg-red-500' : low ? 'bg-brand-orange' : 'bg-sunset'}`}
                                                    style={{ width: `${Math.min(100, Math.max(5, pct))}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Price + arrow */}
                                        <div className="col-span-2 flex items-center gap-4 justify-self-end sm:col-span-1">
                                            <div className="text-right">
                                                <span className="block font-display text-xl leading-none text-brand-dark dark:text-white">{ev.ticketPrice ? `₹${ev.ticketPrice}` : 'Free'}</span>
                                                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-400 dark:text-dark-muted">{ev.ticketPrice ? 'from' : 'entry'}</span>
                                            </div>
                                            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-gray-500 transition-all group-hover:border-transparent group-hover:bg-brand-purple group-hover:text-white dark:border-white/15 dark:text-dark-muted">
                                                <ArrowUpRight className="h-4 w-4" />
                                            </span>
                                        </div>
                                    </TransitionLink>
                                );
                            })
                        )}
                    </div>
                </div>
            </section>

            {/* ═══════════ WHY EVENTRIX ═══════════ */}
            <section ref={whyRef} className="why-section relative overflow-hidden py-24">
                <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                    <div className="aurora-blob aurora-b -right-48 top-1/4 h-[480px] w-[480px]" />
                    <div className="aurora-blob aurora-c -left-40 bottom-0 h-[420px] w-[420px]" />
                </div>

                {/* Floating festival illustrations (dj photo sits in a solid
                    dark tile so its dark background reads as intentional in
                    both themes; mic + headphones are chroma-keyed to transparent) */}
                <div className="plx-dj pointer-events-none absolute right-[5%] top-16 hidden w-40 opacity-90 xl:block" aria-hidden="true">
                    <motion.div
                        animate={{ y: [0, -14, 0], rotate: [0, -3, 0] }}
                        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                        className="overflow-hidden rounded-[1.75rem] border border-black/10 bg-[#16161d] p-2 shadow-[0_24px_48px_-20px_rgba(13,13,17,0.35)] dark:border-dark-line"
                    >
                        <img src={djImg} alt="" className="h-full w-full rounded-2xl object-cover" />
                    </motion.div>
                </div>
                <div className="plx-mic pointer-events-none absolute -left-8 top-20 hidden w-24 lg:block" aria-hidden="true">
                    <motion.img
                        src={micImg}
                        alt=""
                        animate={{ y: [0, -10, 0], rotate: [0, 4, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-full object-contain drop-shadow-[0_20px_30px_rgba(255,45,122,0.3)]"
                    />
                </div>
                <div className="plx-phone pointer-events-none absolute -right-6 top-2/3 hidden w-24 lg:block" aria-hidden="true">
                    <motion.img
                        src={headphonesImg}
                        alt=""
                        animate={{ y: [0, -12, 0], rotate: [0, -5, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-full object-contain drop-shadow-[0_20px_30px_rgba(0,229,255,0.3)]"
                    />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal className="text-center">
                        <span className="eyebrow text-[11px] text-brand-lime-deep">Why Eventrix</span>
                        <h2 className="font-display mt-2 text-4xl uppercase leading-none text-brand-dark sm:text-5xl dark:text-dark-ink">
                            Built for the <span className="text-brand-purple">night out</span>
                        </h2>
                    </Reveal>

                    <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {whyFeatures.map((f, i) => (
                            <Reveal key={f.title} delay={i * 0.08}>
                                <div className="glass-card h-full rounded-[2rem] border border-black/5 bg-white p-7 dark:border-white/10 dark:bg-white/[0.04]">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${f.chip} ${f.tint}`}>
                                        <f.icon className="h-6 w-6" />
                                    </div>
                                    <h4 className="mt-5 font-display text-lg uppercase tracking-wide text-brand-dark dark:text-dark-ink">{f.title}</h4>
                                    <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-dark-muted">{f.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ TESTIMONIALS ═══════════ */}
            <section className="border-y border-black/5 bg-white py-20 dark:border-white/5 dark:bg-dark-page">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal className="text-center">
                        <span className="eyebrow text-[11px] text-brand-pink">From the crowd</span>
                        <h2 className="font-display mt-2 text-4xl uppercase leading-none text-brand-dark sm:text-5xl dark:text-dark-ink">
                            Loved by <span className="text-brand-purple">the crowd</span>
                        </h2>
                    </Reveal>

                    <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                        {testimonials.map((t, i) => (
                            <Reveal key={t.name} delay={i * 0.1}>
                                <div className="glass-card flex h-full flex-col rounded-[2rem] border border-black/5 bg-white p-7 dark:border-white/10 dark:bg-white/[0.04]">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, s) => (
                                            <Star key={s} className="h-4 w-4 text-brand-orange" fill="currentColor" />
                                        ))}
                                    </div>
                                    <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-600 dark:text-dark-muted">"{t.quote}"</p>
                                    <div className="mt-6 flex items-center gap-3 border-t border-black/5 pt-5 dark:border-white/10">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-purple font-mono text-sm font-bold text-white">
                                            {t.initials}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-brand-dark dark:text-dark-ink">{t.name}</h4>
                                            <p className="font-mono text-[11px] font-bold text-gray-400 dark:text-dark-muted">{t.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ NEWSLETTER ═══════════ */}
            <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                <Reveal>
                    <div className="relative overflow-hidden rounded-[2.5rem] border border-black/5 bg-white px-6 py-16 text-center sm:px-12 dark:border-white/10 dark:bg-white/[0.04]">
                        <div className="pointer-events-none absolute inset-0 dots-bg opacity-25" aria-hidden="true" />

                        <div className="relative mx-auto max-w-xl">
                            <span className="eyebrow inline-flex items-center gap-2 text-[11px] text-brand-lime-deep">
                                <Ticket className="h-3.5 w-3.5" /> Twice a month, no spam
                            </span>
                            <h2 className="font-display mt-3 text-4xl uppercase leading-[0.95] text-brand-dark sm:text-5xl dark:text-dark-ink">
                                Passes drop <span className="text-brand-purple">early</span>
                            </h2>
                            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-gray-500 dark:text-dark-muted">
                                Early-bird pricing and secret gigs, before they hit the feed. Join 500K+ people who never miss a drop.
                            </p>

                            {subscribed ? (
                                <p className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full bg-brand-lime px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-brand-dark">
                                    <Sparkle className="h-4 w-4" fill="currentColor" /> You're on the list — watch your inbox
                                </p>
                            ) : (
                                <form onSubmit={subscribe} className="mx-auto mt-8 flex max-w-md flex-col gap-2 rounded-[2rem] border border-black/10 bg-brand-light p-1.5 sm:flex-row sm:items-center sm:pl-5 dark:border-white/10 dark:bg-white/[0.06]">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        aria-label="Email address"
                                        className="w-full bg-transparent py-2.5 text-sm font-semibold text-brand-dark placeholder-gray-400 outline-none dark:text-dark-ink dark:placeholder-dark-muted"
                                    />
                                    <button
                                        type="submit"
                                        className="btn-gradient shrink-0 rounded-full px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white"
                                    >
                                        Get early access
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </Reveal>
            </section>

            {/* Footer lives in App.jsx */}
        </div>
        </DirectionalTransition>
    );
};

export default Home;
