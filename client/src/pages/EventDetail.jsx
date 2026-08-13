import React, { useState, useEffect, useContext } from 'react';
import { ViewTransition } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/axios';
import { AuthContext } from '../context/auth';
import BookingModal from '../components/BookingModal';
import { DirectionalTransition, TransitionLink, push } from '../components/Transitions';
import { Reveal } from '../animations';
import {
    CalendarDays, MapPin, Clock, Share2, ChevronRight, Minus, Plus, Star,
    CheckCircle2, HelpCircle, Music2, Users, Ticket, ArrowUpRight, Home, Sparkle,
} from 'lucide-react';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [activeTab, setActiveTab] = useState('overview');
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [tier, setTier] = useState('general');
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);
            } catch {
                setError('Failed to load event details.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    useEffect(() => {
        if (!event || !event.date) return;
        const targetDate = new Date(event.date).getTime();
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetDate - now;
            if (difference <= 0) {
                clearInterval(timer);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000),
                });
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [event]);

    if (loading) {
        return (
            <div className="mx-auto max-w-7xl px-4 pt-28 pb-16 sm:px-6 sm:pt-32">
                <div className="skeleton h-[420px] w-full rounded-[2.5rem]" />
                <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-8 space-y-6">
                        <div className="skeleton h-10 w-2/3" />
                        <div className="skeleton h-6 w-1/3" />
                        <div className="skeleton h-40 w-full" />
                    </div>
                    <div className="lg:col-span-4">
                        <div className="skeleton h-80 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="mx-auto max-w-xl px-4 pt-32 pb-16 text-center">
                <div className="rounded-[2rem] border border-black/5 bg-white p-12 shadow-soft dark:border-dark-line dark:bg-dark-surface">
                    <Ticket className="mx-auto h-12 w-12 text-brand-purple" />
                    <h3 className="font-display mt-4 text-3xl uppercase">Event not found</h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-dark-muted">{error || 'This event does not exist.'}</p>
                    <TransitionLink to="/" direction="nav-back" className="btn-gradient mt-6 inline-flex items-center gap-2 rounded-full px-8 py-3 text-xs font-extrabold uppercase tracking-wider text-white">
                        <Home className="h-4 w-4" /> Return home
                    </TransitionLink>
                </div>
            </div>
        );
    }

    const availableSeats = event.availableSeats ?? event.totalSeats ?? 50;
    const totalSeats = event.totalSeats ?? 100;
    const isSoldOut = availableSeats <= 0;
    const basePrice = event.ticketPrice || 0;

    const tiers = [
        { id: 'general', name: 'General Pass', price: basePrice, perks: 'Main stage access · standard seating' },
        { id: 'vip', name: 'VIP Pass', price: Math.round(basePrice * 1.6), perks: 'Express lane · lounge · merch' },
        { id: 'vvip', name: 'VVIP Pass', price: Math.round(basePrice * 2.4), perks: 'Front row · meet & greet · free flow' },
    ];
    const activeTier = tiers.find((t) => t.id === tier) || tiers[0];

    const openBooking = () => {
        if (!user) push(navigate, '/login');
        else setShowBookingModal(true);
    };

    return (
        <DirectionalTransition>
        <div className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 sm:pt-28 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-dark-muted">
                <TransitionLink to="/" direction="nav-back" className="flex items-center gap-1 transition-colors hover:text-brand-purple"><Home className="h-3.5 w-3.5" /> Home</TransitionLink>
                <ChevronRight className="h-3.5 w-3.5 text-gray-300 dark:text-dark-muted" />
                <TransitionLink to="/events" direction="nav-back" className="transition-colors hover:text-brand-purple">Events</TransitionLink>
                <ChevronRight className="h-3.5 w-3.5 text-gray-300 dark:text-dark-muted" />
                <span className="text-gray-900 line-clamp-1 dark:text-dark-ink">{event.title}</span>
            </nav>

            {/* Banner */}
            <Reveal>
                <div className="relative mt-6 h-[380px] overflow-hidden rounded-[2.5rem] bg-brand-gray-900 shadow-soft sm:h-[480px]">
                    {/* Destination half of the event-cover shared-element morph
                        (paired with the grid card image on /events). */}
                    <ViewTransition name={`event-cover-${event._id}`} share="morph" default="none" className="block h-full w-full">
                        <img
                            src={event.image || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1600&auto=format&fit=crop'}
                            alt={event.title}
                            className="h-full w-full object-cover"
                        />
                    </ViewTransition>
                    <div className="absolute inset-0 bg-black/55" />

                    <div className="absolute left-6 top-6 right-6 z-10 flex items-start justify-between">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-purple px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg">
                            <Sparkle className="h-3 w-3" /> {event.category || 'Showcase'}
                        </span>
                        <button
                            onClick={() => navigator.clipboard?.writeText(window.location.href)}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-dark shadow-md transition-all hover:scale-110"
                            title="Share event link"
                        >
                            <Share2 className="h-4 w-4" />
                        </button>
                    </div>

                    {/* VIP pass graphic */}
                    <div className="absolute right-6 top-16 z-10 hidden rotate-6 rounded-2xl bg-brand-purple px-5 py-3 text-white shadow-xl sm:block animate-float-slow">
                        <Ticket className="mb-1 h-5 w-5" />
                        <span className="block text-[10px] font-black uppercase tracking-[0.2em]">Festival</span>
                        <span className="font-display text-lg uppercase leading-none">VIP Pass</span>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 z-10 space-y-3 p-6 sm:p-10">
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-bold text-white/75">
                            <span className="flex items-center gap-1.5">
                                <CalendarDays className="h-4 w-4 text-brand-lime" />
                                {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4 text-brand-orange" /> {event.location}
                            </span>
                            <span className="flex items-center gap-1.5 rounded-full bg-brand-lime/15 px-3 py-1 text-brand-lime">
                                <Star className="h-3.5 w-3.5" fill="currentColor" /> 4.8 (2.4K)
                            </span>
                        </div>
                        <h1 className="font-display max-w-4xl text-4xl uppercase leading-[0.95] text-white sm:text-6xl">
                            {event.title}
                        </h1>
                    </div>
                </div>
            </Reveal>

            {/* Countdown */}
            <Reveal delay={0.1}>
                <div className="mt-8 flex flex-col items-center justify-between gap-5 rounded-[2rem] border border-black/10 bg-white p-6 text-brand-dark sm:flex-row sm:p-7 dark:border-dark-line dark:bg-dark-surface dark:text-dark-ink">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-purple shadow-lg">
                            <Clock className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-brand-purple">Event starts in</span>
                            <h4 className="font-display text-lg uppercase">Hurry, seats are limited</h4>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        {[
                            { label: 'Days', val: timeLeft.days },
                            { label: 'Hours', val: timeLeft.hours },
                            { label: 'Mins', val: timeLeft.minutes },
                            { label: 'Secs', val: timeLeft.seconds },
                        ].map((item) => (
                            <div key={item.label} className="min-w-[68px] rounded-2xl border border-black/10 bg-brand-light px-3 py-2.5 text-center dark:border-dark-line dark:bg-dark-surface-2">
                                <span className="font-display block text-2xl text-brand-dark dark:text-dark-ink">{String(item.val).padStart(2, '0')}</span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 dark:text-dark-muted">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </Reveal>

            {/* Main content */}
            <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
                {/* Left: tabs */}
                <div className="lg:col-span-8">
                    <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar border-b border-black/5 dark:border-dark-line">
                        {[
                            { id: 'overview', name: 'Overview' },
                            { id: 'schedule', name: 'Schedule' },
                            { id: 'speakers', name: 'Artists' },
                            { id: 'venue', name: 'Venue' },
                            { id: 'faq', name: 'FAQ' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative shrink-0 rounded-full px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-all ${
                                    activeTab === tab.id ? 'text-white' : 'border border-black/10 bg-white text-gray-600 hover:text-black dark:border-dark-line dark:bg-dark-surface dark:text-dark-muted dark:hover:text-dark-ink'
                                }`}
                            >
                                {activeTab === tab.id && (
                                    <motion.span
                                        layoutId="detail-tab"
                                        className="absolute inset-0 rounded-full bg-brand-purple"
                                        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                                    />
                                )}
                                <span className="relative z-10">{tab.name}</span>
                            </button>
                        ))}
                    </div>

                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        className="mt-6"
                    >
                        {activeTab === 'overview' && (
                            <div className="space-y-6 rounded-[2rem] border border-black/5 bg-white p-7 shadow-soft sm:p-9 dark:border-dark-line dark:bg-dark-surface">
                                <h3 className="font-display text-2xl uppercase">About this event</h3>
                                <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600 dark:text-dark-muted">
                                    {event.description || 'Join us for an extraordinary showcase experience featuring keynotes, stage access, live networking, and exclusive digital passes.'}
                                </p>
                                <div className="space-y-4 border-t border-black/5 pt-6">
                                    <h4 className="font-display text-lg uppercase">What's included</h4>
                                    <div className="grid grid-cols-1 gap-3 text-xs font-bold text-gray-700 sm:grid-cols-2 dark:text-dark-muted">
                                        <div className="flex items-center gap-2.5 rounded-2xl bg-brand-purple/5 px-4 py-3.5 dark:bg-brand-purple/10"><CheckCircle2 className="h-4 w-4 shrink-0 text-brand-purple" /> Full access pass to stages</div>
                                        <div className="flex items-center gap-2.5 rounded-2xl bg-brand-purple/5 px-4 py-3.5 dark:bg-brand-purple/10"><CheckCircle2 className="h-4 w-4 shrink-0 text-brand-purple" /> Verified QR ticket pass</div>
                                        <div className="flex items-center gap-2.5 rounded-2xl bg-brand-purple/5 px-4 py-3.5 dark:bg-brand-purple/10"><CheckCircle2 className="h-4 w-4 shrink-0 text-brand-purple" /> Exclusive VIP networking lounge</div>
                                        <div className="flex items-center gap-2.5 rounded-2xl bg-brand-purple/5 px-4 py-3.5 dark:bg-brand-purple/10"><CheckCircle2 className="h-4 w-4 shrink-0 text-brand-purple" /> Free merch & goodie bag</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'schedule' && (
                            <div className="space-y-6 rounded-[2rem] border border-black/5 bg-white p-7 shadow-soft sm:p-9 dark:border-dark-line dark:bg-dark-surface">
                                <h3 className="font-display text-2xl uppercase">Timeline agenda</h3>
                                <div className="relative ml-2 space-y-6 border-l-2 border-brand-purple pl-7">
                                    {[
                                        { time: '09:00 AM', title: 'Doors open & check-in', desc: 'Scan QR pass & welcome badge.' },
                                        { time: '10:30 AM', title: 'Keynote & main stage showcase', desc: 'Opening session by lead hosts.' },
                                        { time: '01:00 PM', title: 'Networking lunch & VIP lounge', desc: 'Gourmet lounge catering.' },
                                        { time: '04:00 PM', title: 'Award ceremony & performances', desc: 'Live performances & trophy announcements.' },
                                    ].map((item, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -12 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.08 }}
                                            className="relative"
                                        >
                                            <div className="absolute -left-[35px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white">
                                                <div className="h-3 w-3 rounded-full bg-brand-purple" />
                                            </div>
                                            <span className="font-mono text-xs font-black text-brand-purple">{item.time}</span>
                                            <h4 className="font-display mt-0.5 text-base uppercase">{item.title}</h4>
                                            <p className="mt-0.5 text-xs text-gray-500 dark:text-dark-muted">{item.desc}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'speakers' && (
                            <div className="space-y-6 rounded-[2rem] border border-black/5 bg-white p-7 shadow-soft sm:p-9 dark:border-dark-line dark:bg-dark-surface">
                                <h3 className="font-display text-2xl uppercase">Featured artists & hosts</h3>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {[
                                        { name: 'Dr. Elena Rostova', role: 'Main stage host', icon: Music2 },
                                        { name: 'Marcus Vance', role: 'Keynote speaker', icon: Users },
                                    ].map((sp, i) => (
                                        <div key={i} className="flex items-center gap-4 rounded-2xl border border-black/5 bg-brand-light p-5 transition-all hover:border-brand-purple/30 dark:border-dark-line dark:bg-dark-surface-2">
                                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-purple text-xl font-black text-white shadow-lg">
                                                {sp.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black">{sp.name}</h4>
                                                <p className="text-xs font-bold text-brand-purple">{sp.role}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'venue' && (
                            <div className="space-y-6 rounded-[2rem] border border-black/5 bg-white p-7 shadow-soft sm:p-9 dark:border-dark-line dark:bg-dark-surface">
                                <h3 className="font-display text-2xl uppercase">Location</h3>
                                <p className="flex items-center gap-2 text-sm font-black">
                                    <MapPin className="h-4 w-4 text-brand-orange" /> {event.location}
                                </p>
                                <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-3xl border border-black/10 bg-brand-light dark:border-dark-line dark:bg-dark-surface-2">
                                    <div className="absolute inset-0 dots-bg opacity-40" />
                                    <div className="relative z-10 flex flex-col items-center gap-3 rounded-2xl border border-black/10 bg-white px-8 py-6 text-center dark:border-dark-line dark:bg-dark-surface">
                                        <MapPin className="h-8 w-8 text-brand-orange" />
                                        <span className="text-sm font-black text-brand-dark dark:text-dark-ink">Interactive venue map</span>
                                        <span className="text-xs text-gray-500 dark:text-dark-muted">{event.location}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'faq' && (
                            <div className="space-y-4 rounded-[2rem] border border-black/5 bg-white p-7 shadow-soft sm:p-9 dark:border-dark-line dark:bg-dark-surface">
                                <h3 className="font-display text-2xl uppercase">FAQ</h3>
                                {[
                                    { q: 'How do I receive my pass?', a: 'Your digital QR ticket pass is generated instantly in your user dashboard upon booking.' },
                                    { q: 'Is 2FA verification mandatory?', a: 'Yes, a 6-digit OTP code is sent to your email to verify identity.' },
                                ].map((faq, i) => (
                                    <div key={i} className="rounded-2xl border border-black/5 bg-brand-light p-5 dark:border-dark-line dark:bg-dark-surface-2">
                                        <h4 className="flex items-center gap-2 text-xs font-black">
                                            <HelpCircle className="h-4 w-4 shrink-0 text-brand-purple" /> {faq.q}
                                        </h4>
                                        <p className="mt-1.5 pl-6 text-xs text-gray-500 dark:text-dark-muted">{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Right: booking widget */}
                <div className="lg:col-span-4">
                    <div className="space-y-6 rounded-[2rem] border border-black/5 bg-white p-6 shadow-soft sm:p-7 lg:sticky lg:top-24 dark:border-dark-line dark:bg-dark-surface">
                        <div className="flex items-baseline justify-between border-b border-black/5 pb-5">
                            <div>
                                <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-brand-purple">Starting from</span>
                                <span className="font-display text-4xl">{basePrice === 0 ? 'Free' : `₹${basePrice}`}</span>
                            </div>
                            <span className="text-xs font-bold text-gray-500 dark:text-dark-muted">per pass</span>
                        </div>

                        {/* Seats */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-bold text-gray-600 dark:text-dark-muted">
                                <span>Seats remaining</span>
                                <span className="font-black text-gray-900 dark:text-dark-ink">{availableSeats} / {totalSeats}</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ${isSoldOut ? 'bg-red-500' : 'bg-brand-purple'}`}
                                    style={{ width: `${Math.min(100, (availableSeats / totalSeats) * 100)}%` }}
                                />
                            </div>
                        </div>

                        {/* Tier selector */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-dark-muted">Select pass tier</h4>
                            {tiers.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTier(t.id)}
                                    className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                                        tier === t.id
                                            ? 'border-brand-purple bg-brand-purple/10'
                                            : 'border-black/5 bg-brand-light hover:border-black/15 dark:border-dark-line dark:bg-dark-surface-2 dark:hover:border-white/25'
                                    }`}
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-black">{t.name}</span>
                                            {t.id === 'vvip' && <span className="rounded-full bg-brand-orange px-2 py-0.5 text-[9px] font-black uppercase text-white">Best</span>}
                                        </div>
                                        <p className="mt-0.5 text-[11px] text-gray-500 dark:text-dark-muted">{t.perks}</p>
                                    </div>
                                    <span className="shrink-0 font-black">{t.price === 0 ? 'FREE' : `₹${t.price}`}</span>
                                </button>
                            ))}
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center justify-between rounded-2xl border border-black/5 bg-brand-light p-4 dark:border-dark-line dark:bg-dark-surface-2">
                            <span className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-dark-muted">Quantity</span>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    aria-label="Decrease quantity"
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white text-gray-700 transition-all hover:border-brand-purple hover:text-brand-purple dark:border-dark-line dark:bg-dark-surface dark:text-dark-muted dark:hover:text-brand-purple"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-6 text-center text-lg font-black">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(5, quantity + 1))}
                                    aria-label="Increase quantity"
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white text-gray-700 transition-all hover:border-brand-purple hover:text-brand-purple dark:border-dark-line dark:bg-dark-surface dark:text-dark-muted dark:hover:text-brand-purple"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="flex items-center justify-between border-t border-black/5 pt-4">
                            <span className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-dark-muted">Total</span>
                            <span className="font-display text-2xl text-brand-purple">
                                ₹{activeTier.price * quantity}
                            </span>
                        </div>

                        <button
                            onClick={openBooking}
                            disabled={isSoldOut}
                            className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-xs font-extrabold uppercase tracking-wider transition-all ${
                                isSoldOut
                                    ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-white/10 dark:text-dark-muted'
                                    : 'btn-gradient text-white'
                            }`}
                        >
                            {isSoldOut ? 'Sold out' : (user ? 'Book now' : 'Sign in to book')}
                            {!isSoldOut && <ArrowUpRight className="h-4 w-4" />}
                        </button>
                        <p className="text-center text-[11px] font-semibold text-gray-400 dark:text-dark-muted">
                            Secure OTP checkout · Instant QR pass
                        </p>
                    </div>
                </div>
            </div>

            {/* Mobile sticky booking bar */}
            <div className="fixed bottom-16 left-0 right-0 z-30 px-4 md:hidden">
                <div className="flex items-center justify-between gap-3 rounded-full border border-black/10 bg-white p-3 pl-6 shadow-2xl dark:border-dark-line dark:bg-dark-surface">
                    <div>
                        <span className="block text-[9px] font-black uppercase tracking-widest text-gray-400 dark:text-dark-muted">From</span>
                        <span className="font-display text-lg text-brand-dark dark:text-dark-ink">{basePrice === 0 ? 'FREE' : `₹${basePrice}`}</span>
                    </div>
                    <button
                        onClick={openBooking}
                        disabled={isSoldOut}
                        className={`rounded-full px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white ${isSoldOut ? 'bg-gray-600' : 'btn-gradient'}`}
                    >
                        {isSoldOut ? 'Sold out' : 'Book now'}
                    </button>
                </div>
            </div>

            {showBookingModal && (
                <BookingModal
                    event={event}
                    onClose={() => setShowBookingModal(false)}
                    onSuccess={() => {
                        api.get(`/events/${id}`).then((res) => setEvent(res.data)).catch(() => {});
                    }}
                />
            )}
        </div>
        </DirectionalTransition>
    );
};

export default EventDetail;
