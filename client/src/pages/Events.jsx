import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/axios';
import EventCard from '../components/EventCard';
import { Reveal } from '../animations';
import { Search, SlidersHorizontal, LayoutGrid, List, CalendarDays, MapPin, Ticket, ArrowUpRight, Sparkle } from 'lucide-react';

const categories = ['All', 'Music', 'Festivals', 'Workshops', 'Sports', 'Tech', 'Arts', 'Food', 'Gaming', 'Business'];

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

const Events = () => {
    const [searchParams] = useSearchParams();
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');

    /* Sync state when the URL query changes (e.g. footer links, hero search) */
    useEffect(() => {
        const cat = searchParams.get('category');
        const s = searchParams.get('search');
        const t = setTimeout(() => {
            if (cat) setSelectedCategory(cat);
            if (s !== null) setSearch(s);
        }, 0);
        return () => clearTimeout(t);
    }, [searchParams]);
    const [priceFilter, setPriceFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [loading, setLoading] = useState(true);
    const [filtersOpen, setFiltersOpen] = useState(false);

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

    const filteredEvents = events.filter((event) => {
        const categoryMatch =
            selectedCategory === 'All' ||
            (event.category && event.category.toLowerCase() === selectedCategory.toLowerCase());
        const priceMatch =
            priceFilter === 'all' ||
            (priceFilter === 'free' && (event.ticketPrice === 0 || !event.ticketPrice)) ||
            (priceFilter === 'paid' && event.ticketPrice > 0);
        return categoryMatch && priceMatch;
    });

    const resetFilters = () => {
        setSearch('');
        setSelectedCategory('All');
        setPriceFilter('all');
    };

    return (
        <div className="mx-auto max-w-7xl px-4 pt-28 pb-16 sm:px-6 sm:pt-32 lg:px-8">
            {/* Header */}
            <Reveal>
                <div className="relative overflow-hidden rounded-[2.5rem] border border-black/10 bg-white p-8 sm:p-12 dark:border-dark-line dark:bg-dark-surface">
                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-purple/10" />
                    <div className="absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-brand-pink/10" />
                    <div className="relative space-y-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-purple/20 bg-brand-purple/10 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-purple">
                            <Sparkle className="h-3 w-3" /> Discovery hub 2025
                        </span>
                        <h1 className="font-display text-4xl uppercase leading-[0.95] text-brand-dark sm:text-6xl dark:text-dark-ink">
                            Explore events <br />
                            <span className="text-gradient-brand">& categories</span>
                        </h1>
                        <p className="max-w-xl text-sm text-gray-500 dark:text-dark-muted">
                            Filter by genre, festival track, location or ticket pricing. Secure your verified access pass.
                        </p>
                    </div>
                </div>
            </Reveal>

            {/* Sticky filter bar */}
            <div className="sticky top-20 z-30 mt-8 rounded-3xl border border-black/10 bg-white p-4 shadow-[0_16px_50px_-20px_rgba(13,13,17,0.25)] sm:p-5 dark:border-dark-line dark:bg-dark-surface">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* Search */}
                    <div className="relative w-full lg:w-96">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search title, venue, or keyword..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-2xl border border-black/10 bg-brand-light py-3 pl-11 pr-4 text-sm font-semibold text-gray-800 placeholder-gray-400 outline-none transition-colors focus:border-brand-purple dark:border-dark-line dark:bg-dark-surface-2 dark:text-dark-ink dark:placeholder-dark-muted"
                        />
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between gap-3 lg:w-auto">
                        {/* Price pills */}
                        <div className="flex items-center gap-1 rounded-2xl border border-black/5 bg-brand-light p-1 dark:border-dark-line dark:bg-dark-surface-2">
                            {[
                                { id: 'all', label: 'All' },
                                { id: 'free', label: 'Free' },
                                { id: 'paid', label: 'Paid' },
                            ].map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => setPriceFilter(p.id)}
                                    className={`relative rounded-xl px-3.5 py-1.5 text-xs font-black uppercase transition-all ${
                                        priceFilter === p.id ? 'text-white' : 'text-gray-600 hover:text-black dark:text-dark-muted dark:hover:text-dark-ink'
                                    }`}
                                >
                                    {priceFilter === p.id && (
                                        <motion.span
                                            layoutId="price-pill"
                                            className="absolute inset-0 rounded-xl bg-brand-purple"
                                            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                                        />
                                    )}
                                    <span className="relative z-10">{p.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* View toggle */}
                        <div className="flex items-center gap-1 rounded-2xl border border-black/5 bg-brand-light p-1 dark:border-dark-line dark:bg-dark-surface-2">
                            <button
                                onClick={() => setViewMode('grid')}                                                className={`rounded-xl p-2 transition-all ${viewMode === 'grid' ? 'bg-brand-purple text-white' : 'text-gray-500 hover:text-black dark:text-dark-muted dark:hover:text-dark-ink'}`}
                                title="Grid view"
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}                                                className={`rounded-xl p-2 transition-all ${viewMode === 'list' ? 'bg-brand-purple text-white' : 'text-gray-500 hover:text-black dark:text-dark-muted dark:hover:text-dark-ink'}`}
                                title="List view"
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Mobile filter toggle */}
                        <button
                            onClick={() => setFiltersOpen(!filtersOpen)}
                            className="lg:hidden flex items-center gap-2 rounded-2xl border border-black/10 px-4 py-2.5 text-xs font-extrabold uppercase text-gray-700 dark:border-dark-line dark:text-dark-muted"
                        >
                            <SlidersHorizontal className="h-4 w-4" /> Filters
                        </button>
                    </div>
                </div>

                {/* Category pills */}
                <div className={`mt-4 ${filtersOpen ? 'block' : 'hidden lg:block'}`}>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                        <span className="mr-1 flex shrink-0 items-center gap-1 text-[11px] font-black uppercase tracking-wider text-gray-400 dark:text-dark-muted">
                            <Ticket className="h-3.5 w-3.5" /> Genre:
                        </span>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`relative shrink-0 rounded-full px-4 py-2 text-xs font-extrabold uppercase transition-all ${
                                    selectedCategory === cat ? 'text-white' : 'border border-black/10 bg-white text-gray-700 hover:border-brand-purple hover:text-brand-purple dark:border-dark-line dark:bg-dark-surface dark:text-dark-muted'
                                }`}
                            >
                                {selectedCategory === cat && (
                                    <motion.span
                                        layoutId="cat-pill"
                                        className="absolute inset-0 rounded-full bg-brand-purple"
                                        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                                    />
                                )}
                                <span className="relative z-10">{cat}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="mt-10">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="font-display text-2xl uppercase tracking-wide dark:text-dark-ink">
                        Results <span className="text-gradient-brand">({filteredEvents.length})</span>
                    </h2>
                    {(search || selectedCategory !== 'All' || priceFilter !== 'all') && (
                        <button onClick={resetFilters} className="text-xs font-extrabold uppercase tracking-wider text-brand-purple hover:underline">
                            Reset filters
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((n) => <SkeletonCard key={n} />)}
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-[2rem] border border-black/5 bg-white p-16 text-center dark:border-dark-line dark:bg-dark-surface"
                    >
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-purple/10 text-brand-purple">
                            <Ticket className="h-8 w-8" />
                        </div>
                        <h3 className="font-display mt-5 text-2xl uppercase">No events found</h3>                            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500 dark:text-dark-muted">
                            Try adjusting your search criteria or resetting the filters to discover more experiences.
                        </p>
                        <button
                            onClick={resetFilters}
                            className="btn-gradient mt-6 rounded-full px-8 py-3 text-xs font-extrabold uppercase tracking-wider text-white"
                        >
                            Reset filters
                        </button>
                    </motion.div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredEvents.map((event, i) => (
                            <Reveal key={event._id} delay={(i % 3) * 0.06}>
                                <EventCard event={event} />
                            </Reveal>
                        ))}
                    </div>
                ) : (
                    <AnimatePresence>
                        <div className="space-y-4">
                            {filteredEvents.map((event, i) => (
                                <motion.div
                                    key={event._id}
                                    initial={{ opacity: 0, x: -16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="card-lift flex flex-col gap-5 rounded-[1.75rem] border border-black/5 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 dark:border-dark-line dark:bg-dark-surface"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-gray-200 sm:h-28 sm:w-28 dark:bg-dark-surface-2">
                                            <img
                                                src={event.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=400&auto=format&fit=crop'}
                                                alt={event.title}
                                                className="h-full w-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40" />
                                            {event.ticketPrice === 0 || !event.ticketPrice ? (
                                                <span className="absolute bottom-2 left-2 rounded-full bg-brand-lime px-2 py-0.5 text-[9px] font-black uppercase text-brand-dark">Free</span>
                                            ) : (
                                                <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-black uppercase text-black dark:bg-dark-surface/90 dark:text-dark-ink">₹{event.ticketPrice}</span>
                                            )}
                                        </div>
                                        <div className="space-y-1.5">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-purple">{event.category}</span>
                                            <h3 className="font-display text-base uppercase leading-tight line-clamp-1">{event.title}</h3>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-gray-500 dark:text-dark-muted">
                                                <span className="flex items-center gap-1.5">
                                                    <CalendarDays className="h-3.5 w-3.5 text-brand-purple" /> {new Date(event.date).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <MapPin className="h-3.5 w-3.5 text-brand-orange" /> {event.location}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <Link
                                        to={`/events/${event._id}`}
                                        className="btn-gradient flex shrink-0 items-center justify-center gap-2 rounded-2xl px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white sm:self-center"
                                    >
                                        Details <ArrowUpRight className="h-4 w-4" />
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default Events;
