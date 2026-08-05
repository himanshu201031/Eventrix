import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import EventCard from '../components/EventCard';
import { FaSearch, FaFilter, FaThLarge, FaList, FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt } from 'react-icons/fa';
import { HiSparkles, HiTag } from 'react-icons/hi2';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceFilter, setPriceFilter] = useState('all'); // all, free, paid
    const [viewMode, setViewMode] = useState('grid'); // grid, list
    const [loading, setLoading] = useState(true);

    const categories = ['All', 'Music', 'Tech', 'Arts', 'Food', 'Gaming', 'Business'];

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchEvents();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [search]);

    const fetchEvents = async () => {
        try {
            const { data } = await api.get(`/events?search=${search}`);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter events locally by Category and Price filter
    const filteredEvents = events.filter(event => {
        const categoryMatch = selectedCategory === 'All' || (event.category && event.category.toLowerCase() === selectedCategory.toLowerCase());
        const priceMatch =
            priceFilter === 'all' ||
            (priceFilter === 'free' && (event.ticketPrice === 0 || !event.ticketPrice)) ||
            (priceFilter === 'paid' && event.ticketPrice > 0);
        return categoryMatch && priceMatch;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
            {/* Header Banner */}
            <div className="relative rounded-3xl bg-gradient-to-r from-purple-900/60 via-[#0e131f] to-pink-900/40 p-8 sm:p-12 border border-white/10 overflow-hidden shadow-2xl">
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-purple-600/20 blur-[100px] rounded-full pointer-events-none"></div>
                <div className="relative z-10 space-y-4 max-w-2xl">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-extrabold uppercase tracking-widest">
                        <HiSparkles /> Event Discovery Hub
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                        Explore Unforgettable <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">Live Experiences</span>
                    </h1>
                    <p className="text-gray-300 text-sm sm:text-base font-normal leading-relaxed">
                        Filter by genre, music style, technology track, location, or ticket pricing. Secure guaranteed access in seconds.
                    </p>
                </div>
            </div>

            {/* Sticky Filter & Control Bar */}
            <div className="glass-card p-4 sm:p-6 rounded-2xl border border-white/10 space-y-4 sticky top-24 z-30 shadow-xl">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                    {/* Search Input */}
                    <div className="relative w-full lg:w-96">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                            type="text"
                            placeholder="Search by event title, location, or keyword..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                        />
                    </div>

                    {/* Controls: Price Filter & Grid/List View */}
                    <div className="flex items-center justify-between w-full lg:w-auto gap-4">
                        {/* Price Filter dropdown */}
                        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                            <button
                                onClick={() => setPriceFilter('all')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${priceFilter === 'all' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                All Prices
                            </button>
                            <button
                                onClick={() => setPriceFilter('free')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${priceFilter === 'free' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                Free
                            </button>
                            <button
                                onClick={() => setPriceFilter('paid')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${priceFilter === 'paid' ? 'bg-pink-600 text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                Paid
                            </button>
                        </div>

                        {/* Toggle Grid vs List */}
                        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg text-xs transition-all ${viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}
                                title="Grid View"
                            >
                                <FaThLarge />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg text-xs transition-all ${viewMode === 'list' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'}`}
                                title="List View"
                            >
                                <FaList />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Category Chips Bar */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 no-scrollbar">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1 mr-2 shrink-0">
                        <HiTag /> Category:
                    </span>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${selectedCategory === cat ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/25 border border-transparent' : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Event List / Grid */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                        <span>All Matching Events</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-600/20 text-purple-300 border border-purple-500/30">
                            {filteredEvents.length} results
                        </span>
                    </h2>
                </div>

                {loading ? (
                    <div className="text-center py-24 space-y-4">
                        <div className="w-12 h-12 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin mx-auto"></div>
                        <p className="text-gray-400 text-sm font-medium">Fetching curated events...</p>
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="glass-card p-16 rounded-3xl text-center border border-white/10 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-gray-500 text-2xl">
                            <FaFilter />
                        </div>
                        <h3 className="text-xl font-bold text-white">No events match your criteria</h3>
                        <p className="text-gray-400 text-sm max-w-md mx-auto">
                            Try adjusting your search keywords, switching categories, or clearing price filters.
                        </p>
                        <button
                            onClick={() => {
                                setSearch('');
                                setSelectedCategory('All');
                                setPriceFilter('all');
                            }}
                            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-wider transition-all"
                        >
                            Reset All Filters
                        </button>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {filteredEvents.map((event) => (
                            <EventCard key={event._id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredEvents.map((event) => (
                            <div
                                key={event._id}
                                className="glass-card p-5 rounded-2xl border border-white/10 hover:border-purple-500/40 transition-all flex flex-col sm:flex-row items-center justify-between gap-6"
                            >
                                <div className="flex items-center gap-5 w-full sm:w-auto">
                                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-800 shrink-0">
                                        <img src={event.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=400&auto=format&fit=crop'} alt={event.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-400">{event.category}</span>
                                        <h3 className="text-lg font-bold text-white">{event.title}</h3>
                                        <div className="flex items-center gap-4 text-xs text-gray-400 pt-1">
                                            <span className="flex items-center gap-1"><FaCalendarAlt className="text-purple-400" /> {new Date(event.date).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-pink-400" /> {event.location}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-white/10">
                                    <div className="text-right">
                                        <span className="text-xs text-gray-400 uppercase font-bold block">Ticket Price</span>
                                        <span className="text-lg font-black text-white">{event.ticketPrice === 0 ? 'FREE' : `₹${event.ticketPrice}`}</span>
                                    </div>
                                    <a
                                        href={`/events/${event._id}`}
                                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:shadow-lg transition-all"
                                    >
                                        Details & Book
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;
