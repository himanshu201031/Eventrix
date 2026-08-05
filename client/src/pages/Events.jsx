import React, { useState, useEffect, useCallback } from 'react';
import api from '../utils/axios';
import EventCard from '../components/EventCard';
import { FaSearch, FaFilter, FaThLarge, FaList, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { HiSparkles, HiTag } from 'react-icons/hi2';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceFilter, setPriceFilter] = useState('all'); // all, free, paid
    const [viewMode, setViewMode] = useState('grid'); // grid, list
    const [loading, setLoading] = useState(true);

    const categories = ['All', 'Music', 'Tech', 'Arts', 'Food', 'Gaming', 'Business'];

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
        const timeoutId = setTimeout(() => {
            fetchEvents();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [fetchEvents]);

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
            <div className="bg-[#8522FF] text-white rounded-[2.5rem] p-8 sm:p-12 border border-black/10 shadow-xl space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-widest">
                    <HiSparkles /> DISCOVERY HUB 2026
                </span>
                <h1 className="font-display font-black text-4xl sm:text-6xl uppercase tracking-tighter leading-none">
                    EXPLORE SHOWCASE <br />
                    <span className="text-[#D2FF00]">EVENTS & CATEGORIES</span>
                </h1>
                <p className="text-purple-100 text-xs sm:text-sm font-normal max-w-xl">
                    Filter by genre, festival track, location, or ticket pricing. Secure your verified access pass.
                </p>
            </div>

            {/* Sticky Filter & Control Bar */}
            <div className="bg-white p-4 sm:p-6 rounded-3xl border border-black/10 shadow-sm space-y-4 sticky top-24 z-30">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                    {/* Search Input */}
                    <div className="relative w-full lg:w-96">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                            type="text"
                            placeholder="Search title, venue, or keyword..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border border-black/10 text-black placeholder-gray-400 text-sm font-bold focus:outline-none focus:border-[#8522FF]"
                        />
                    </div>

                    {/* Controls: Price Filter & Grid/List View */}
                    <div className="flex items-center justify-between w-full lg:w-auto gap-4">
                        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-2xl border border-black/5">
                            <button
                                onClick={() => setPriceFilter('all')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all ${priceFilter === 'all' ? 'bg-[#8522FF] text-white shadow-sm' : 'text-gray-700 hover:text-black'}`}
                            >
                                All Prices
                            </button>
                            <button
                                onClick={() => setPriceFilter('free')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all ${priceFilter === 'free' ? 'bg-[#D2FF00] text-black shadow-sm' : 'text-gray-700 hover:text-black'}`}
                            >
                                Free
                            </button>
                            <button
                                onClick={() => setPriceFilter('paid')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all ${priceFilter === 'paid' ? 'bg-black text-white shadow-sm' : 'text-gray-700 hover:text-black'}`}
                            >
                                Paid
                            </button>
                        </div>

                        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-2xl border border-black/5">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-xl text-xs transition-all ${viewMode === 'grid' ? 'bg-black text-white' : 'text-gray-500'}`}
                                title="Grid View"
                            >
                                <FaThLarge />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-xl text-xs transition-all ${viewMode === 'list' ? 'bg-black text-white' : 'text-gray-500'}`}
                                title="List View"
                            >
                                <FaList />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Category Chips Bar */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 no-scrollbar">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500 flex items-center gap-1 mr-2 shrink-0">
                        <HiTag /> GENRE:
                    </span>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase shrink-0 transition-all ${selectedCategory === cat ? 'bg-[#8522FF] text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-black/5'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Event List / Grid */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display font-black text-2xl text-black uppercase">
                        RESULTS <span className="text-[#8522FF]">({filteredEvents.length})</span>
                    </h2>
                </div>

                {loading ? (
                    <div className="text-center py-24 font-bold text-gray-500">Loading events...</div>
                ) : filteredEvents.length === 0 ? (
                    <div className="bg-white p-16 rounded-3xl text-center border border-black/10 space-y-4">
                        <h3 className="font-display font-black text-xl text-black uppercase">No Events Found</h3>
                        <p className="text-gray-500 text-xs max-w-md mx-auto">Try adjusting your search criteria or resetting filters.</p>
                        <button
                            onClick={() => {
                                setSearch('');
                                setSelectedCategory('All');
                                setPriceFilter('all');
                            }}
                            className="px-6 py-2.5 rounded-full bg-[#8522FF] text-white text-xs font-extrabold uppercase"
                        >
                            Reset Filters
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
                                className="bg-white p-5 rounded-3xl border border-black/10 hover:border-[#8522FF] transition-all flex flex-col sm:flex-row items-center justify-between gap-6"
                            >
                                <div className="flex items-center gap-5 w-full sm:w-auto">
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-200 shrink-0">
                                        <img src={event.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=400&auto=format&fit=crop'} alt={event.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black uppercase text-[#8522FF]">{event.category}</span>
                                        <h3 className="font-display font-black text-base text-black uppercase">{event.title}</h3>
                                        <div className="flex items-center gap-4 text-xs font-bold text-gray-500 pt-1">
                                            <span><FaCalendarAlt className="inline text-[#8522FF]" /> {new Date(event.date).toLocaleDateString()}</span>
                                            <span><FaMapMarkerAlt className="inline text-red-500" /> {event.location}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-black/10">
                                    <div className="text-right">
                                        <span className="text-[10px] text-gray-400 font-extrabold uppercase block">Price</span>
                                        <span className="font-display font-black text-lg text-black">{event.ticketPrice === 0 ? 'FREE' : `₹${event.ticketPrice}`}</span>
                                    </div>
                                    <a
                                        href={`/events/${event._id}`}
                                        className="bg-[#0A0A0C] hover:bg-[#8522FF] text-white px-5 py-2.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1"
                                    >
                                        <span>Details</span> <FaArrowUpRightFromSquare className="text-[10px]" />
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
