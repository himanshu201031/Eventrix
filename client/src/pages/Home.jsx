import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import EventCard from '../components/EventCard';
import { FaMagnifyingGlass, FaPlay, FaArrowUpRightFromSquare, FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import { HiSparkles, HiUserGroup, HiFire } from 'react-icons/hi2';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    // Countdown state matching reference image
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

    // Category slider cards
    const categoryCards = [
        { title: 'BEST ACTION EVENT', count: '14 NOMINEES', active: false },
        { title: 'INDIE FESTIVAL OF THE YEAR', count: '22 NOMINEES', active: false },
        { title: 'GAME OF THE YEAR', count: '29 NOMINEES', active: true },
        { title: 'STUDIO OF THE YEAR', count: '18 NOMINEES', active: false },
        { title: 'BEST ART DIRECTION', count: '15 NOMINEES', active: false },
        { title: 'BEST NARRATIVE', count: '12 NOMINEES', active: false }
    ];

    return (
        <div className="space-y-16 pb-12">

            {/* 1️⃣ Hero Section (Matched from Reference Image Top Section) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Heavy Headline & Badges */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Huge Multi-Line Headline */}
                        <div className="space-y-2">
                            <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-tighter text-[#0A0A0C] uppercase leading-[0.9]">
                                WORLD <br />
                                GAME <br />
                                AWARDS® <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8522FF] via-purple-600 to-black">
                                    2026 SHOWCASE
                                </span>
                            </h1>
                        </div>

                        {/* Badges & Target Community Bullet Points */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-4 border-t border-black/10">

                            {/* Pill Badges */}
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="px-3.5 py-1 rounded-full bg-red-500 text-white font-extrabold text-[10px] uppercase">
                                    ONLINE
                                </span>
                                <span className="px-3.5 py-1 rounded-full bg-[#D2FF00] text-black font-extrabold text-[10px] uppercase">
                                    140+ EVENTS
                                </span>
                                <span className="px-3.5 py-1 rounded-full bg-[#8522FF] text-white font-extrabold text-[10px] uppercase">
                                    REGISTER NOW
                                </span>
                            </div>

                            {/* Bullet Points with Colored Dot Icons (Matched from Reference Image) */}
                            <div className="space-y-2 text-xs font-black uppercase max-w-md">
                                <p className="text-gray-900 leading-snug">
                                    WORLD GAME AWARDS® BRINGS TOGETHER <br />
                                    <span className="inline-flex items-center gap-1 text-red-500">🔴 PLAYERS</span>,{' '}
                                    <span className="inline-flex items-center gap-1 text-orange-500">🟠 CREATORS</span>,{' '}
                                    <span className="inline-flex items-center gap-1 text-lime-600">🟢 DEVELOPERS</span>,{' '}
                                    <span className="inline-flex items-center gap-1 text-blue-500">🔵 PUBLISHERS</span>, AND{' '}
                                    <span className="inline-flex items-center gap-1 text-purple-600">🟣 COMMUNITIES</span>
                                </p>
                                <p className="text-gray-400 font-extrabold text-[11px] tracking-wider">
                                    FOR THREE DAYS OF SHOWCASES, COMPETITIONS, AND RECOGNITION.
                                </p>
                            </div>
                        </div>

                        {/* Search Input Bar */}
                        <div className="relative max-w-2xl">
                            <div className="bg-white p-2 rounded-3xl border border-black/10 shadow-lg flex items-center gap-3">
                                <FaMagnifyingGlass className="text-gray-400 text-base ml-4 shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Search showcase events, categories, or keywords..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-transparent text-black placeholder-gray-400 font-bold text-sm px-2 py-3 focus:outline-none"
                                />
                                <Link
                                    to="/events"
                                    className="bg-[#8522FF] hover:bg-purple-700 text-white font-extrabold px-6 py-3 rounded-2xl text-xs uppercase tracking-wider transition-all shrink-0 flex items-center gap-1.5 shadow-md"
                                >
                                    <span>Explore</span> <FaArrowUpRightFromSquare className="text-[10px]" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Hand Live Countdown Box Card (Matched from Reference Image top right) */}
                    <div className="lg:col-span-4 bg-[#8522FF] text-white p-8 rounded-[2.5rem] shadow-2xl space-y-8 relative overflow-hidden">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4 text-xs font-black uppercase">
                                <span>140+ EVENTS</span>
                                <span>75+ HOSTS</span>
                            </div>
                            <span className="bg-black/40 text-white px-3 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1">
                                VIEW NOW <FaPlay className="text-[8px]" />
                            </span>
                        </div>

                        <div className="space-y-2 pt-4">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-200 block">LIVE SHOWCASE COUNTDOWN</span>
                            <div className="font-display font-black text-3xl sm:text-4xl tracking-wider text-white">
                                {timeLeft.days} : {timeLeft.hours} : {timeLeft.mins} : {timeLeft.secs}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* 2️⃣ Pitch Black Stats Bar (#0B0B0B Section from Reference Image) */}
            <div className="bg-[#0B0B0B] text-white py-12 px-4 sm:px-6 lg:px-8 border-y border-white/10">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div className="space-y-1">
                        <h3 className="font-display font-black text-4xl sm:text-5xl text-white">140+</h3>
                        <p className="text-xs font-extrabold tracking-widest text-gray-400 uppercase">PROS & EVENTS</p>
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-display font-black text-4xl sm:text-5xl text-white">17</h3>
                        <p className="text-xs font-extrabold tracking-widest text-gray-400 uppercase">AWARD CATEGORIES</p>
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-display font-black text-4xl sm:text-5xl text-white">20K+</h3>
                        <p className="text-xs font-extrabold tracking-widest text-gray-400 uppercase">ATTENDEES & FANS</p>
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-display font-black text-4xl sm:text-5xl text-white">75+</h3>
                        <p className="text-xs font-extrabold tracking-widest text-gray-400 uppercase">GLOBAL HOSTS</p>
                    </div>
                </div>
            </div>

            {/* 3️⃣ 17 Categories Carousel Showcase (Matched from Reference Image) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="font-display font-black text-3xl sm:text-4xl text-[#0A0A0C] uppercase tracking-tight">
                            17 AWARDS <br />
                            <span className="text-gray-400">CATEGORIES</span>
                        </h2>
                    </div>

                    {/* Countdown widget top right */}
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-black/10 shadow-sm text-xs font-extrabold">
                        <span className="bg-black text-white px-2 py-0.5 rounded-full text-[9px] uppercase">VIEW NOW ▶</span>
                        <span>{timeLeft.days} : {timeLeft.hours} : {timeLeft.mins} : {timeLeft.secs}</span>
                    </div>
                </div>

                {/* Cards Carousel Container */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
                    {categoryCards.map((card, idx) => (
                        <div
                            key={idx}
                            className={`p-6 rounded-3xl border transition-all flex flex-col justify-between h-64 text-center cursor-pointer ${card.active ? 'bg-[#8522FF] text-white border-transparent shadow-xl scale-105 z-10' : 'bg-white text-black border-black/10 hover:border-black/30'}`}
                        >
                            <div className="mx-auto w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg">
                                ⌘
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-display font-black text-sm uppercase leading-snug">{card.title}</h3>
                                <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full ${card.active ? 'bg-white text-black' : 'bg-gray-100 text-gray-700'}`}>
                                    {card.count}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center gap-4 pt-4">
                    <button className="w-10 h-10 rounded-full bg-white border border-black/10 flex items-center justify-center font-bold text-black hover:bg-black hover:text-white transition-all">
                        <FaArrowLeft />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white border border-black/10 flex items-center justify-center font-bold text-black hover:bg-black hover:text-white transition-all">
                        <FaArrowRight />
                    </button>
                </div>
            </div>

            {/* 4️⃣ Winner Stories Video Banner (Matched from Reference Image) */}
            <div className="bg-[#8522FF] text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden shadow-2xl">
                <div className="max-w-7xl mx-auto relative z-10 text-center space-y-8">
                    {/* Background Massive Text */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 font-display font-black text-7xl sm:text-9xl uppercase tracking-tighter text-white">
                        WINNER CATEGORIES
                    </div>

                    <h2 className="font-display font-black text-4xl sm:text-6xl uppercase tracking-tight relative z-10">
                        WINNER <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white text-[#8522FF] align-middle mx-2 text-xl shadow-lg"><FaPlay className="ml-1 text-sm" /></span> STORIES
                    </h2>

                    {/* Centered Video / Image Card */}
                    <div className="relative max-w-sm mx-auto h-96 rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-gray-900 group">
                        <img
                            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop"
                            alt="Winner Acceptance"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center text-xl shadow-2xl group-hover:scale-110 transition-transform">
                                <FaPlay className="ml-1" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5️⃣ Community Choice Leaderboard (Matched from Reference Image) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-display font-black text-3xl sm:text-4xl text-[#0A0A0C] uppercase">
                            COMMUNITY CHOICE <br />
                            <span className="text-gray-400">LEADERBOARD</span>
                        </h2>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-xs font-extrabold uppercase">
                        <span className="bg-black text-white px-2 py-0.5 rounded-full text-[9px]">VIEW NOW ▶</span>
                        <span>{timeLeft.days} : {timeLeft.hours} : {timeLeft.mins} : {timeLeft.secs}</span>
                    </div>
                </div>

                {/* Progress Bar Leaderboard Stack */}
                <div className="space-y-4">
                    {/* Purple Leader Bar */}
                    <div className="bg-[#8522FF] text-white p-6 rounded-3xl flex items-center justify-between shadow-lg">
                        <span className="font-display font-black uppercase text-sm">NEON ODYSSEY FESTIVAL 2026</span>
                        <span className="px-3 py-1 bg-white/20 rounded-full font-extrabold text-xs">VOTES: 14,820</span>
                    </div>

                    {/* Lime Green Leader Bar */}
                    <div className="bg-[#D2FF00] text-black p-6 rounded-3xl flex items-center justify-between shadow-lg">
                        <span className="font-display font-black uppercase text-sm">DEVELOPER SUMMIT & TECH EXPO</span>
                        <div className="flex items-center gap-3">
                            <span className="font-extrabold text-xs">VOTES: 12,450</span>
                            <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">+1 ⚡</span>
                        </div>
                    </div>

                    {/* Off White Bar */}
                    <div className="bg-white text-black p-6 rounded-3xl border border-black/10 flex items-center justify-between">
                        <span className="font-display font-black uppercase text-sm">GLOBAL SYNTHWAVE SHOWCASE</span>
                        <span className="font-extrabold text-xs text-gray-500">VOTES: 9,120</span>
                    </div>
                </div>
            </div>

            {/* 6️⃣ The Road to the Awards Timeline (Matched from Reference Image) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-display font-black text-3xl sm:text-4xl text-[#0A0A0C] uppercase">
                            THE ROAD TO <br />
                            THE AWARDS
                        </h2>
                    </div>
                    <span className="text-xs font-extrabold uppercase bg-gray-200 text-black px-3 py-1 rounded-full">
                        8 DAYS EVENT
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Featured Purple Expo Card */}
                    <div className="bg-[#8522FF] text-white p-6 rounded-3xl space-y-6 flex flex-col justify-between shadow-xl">
                        <div className="space-y-1">
                            <span className="text-[10px] font-extrabold uppercase text-purple-200">START SHOWCASE</span>
                            <h3 className="font-display font-black text-xl uppercase">GAME EXPO</h3>
                        </div>
                        <div className="flex items-end justify-between">
                            <div>
                                <span className="font-display font-black text-3xl">02 - 04</span>
                                <p className="text-[10px] font-extrabold uppercase text-purple-200">AUGUST '26</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                                ↗
                            </div>
                        </div>
                    </div>

                    {/* White Timeline Cards */}
                    <div className="bg-white p-6 rounded-3xl border border-black/10 space-y-6 flex flex-col justify-between">
                        <div className="space-y-1">
                            <span className="text-[10px] font-extrabold uppercase text-gray-400">TECH SHOWCASE</span>
                            <h3 className="font-display font-black text-lg uppercase">DEVELOPER SUMMIT</h3>
                        </div>
                        <div>
                            <span className="font-display font-black text-3xl text-black">07</span>
                            <p className="text-[10px] font-extrabold uppercase text-gray-400">AUGUST '26</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-black/10 space-y-6 flex flex-col justify-between">
                        <div className="space-y-1">
                            <span className="text-[10px] font-extrabold uppercase text-gray-400">STAGE ACCESS</span>
                            <h3 className="font-display font-black text-lg uppercase">COMMUNITY STAGE</h3>
                        </div>
                        <div>
                            <span className="font-display font-black text-3xl text-black">08</span>
                            <p className="text-[10px] font-extrabold uppercase text-gray-400">AUGUST '26</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-black/10 space-y-6 flex flex-col justify-between">
                        <div className="space-y-1">
                            <span className="text-[10px] font-extrabold uppercase text-gray-400">FINALE</span>
                            <h3 className="font-display font-black text-lg uppercase">AWARDS CEREMONY</h3>
                        </div>
                        <div>
                            <span className="font-display font-black text-3xl text-black">12</span>
                            <p className="text-[10px] font-extrabold uppercase text-gray-400">AUGUST '26</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 7️⃣ Be Part of the Community Banner (Matched from Reference Image) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-12 sm:p-16 rounded-[2.5rem] border border-black/10 text-center space-y-6 relative overflow-hidden shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-[#8522FF] text-white flex items-center justify-center text-xl mx-auto shadow-lg">
                        ⌘
                    </div>
                    <h2 className="font-display font-black text-3xl sm:text-5xl text-[#0A0A0C] uppercase tracking-tight">
                        BE PART OF THE <br />
                        COMMUNITY
                    </h2>
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-2 bg-[#0A0A0C] hover:bg-[#8522FF] text-white font-extrabold px-8 py-4 rounded-full text-xs uppercase tracking-wider transition-all shadow-md"
                    >
                        <span>JOIN THE EVENT</span>
                        <FaArrowUpRightFromSquare className="text-xs" />
                    </Link>
                </div>
            </div>

            {/* 8️⃣ Real API Events Grid (Preserving existing functional website content) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-display font-black text-3xl text-[#0A0A0C] uppercase">
                            ALL UPCOMING <br />
                            <span className="text-gray-400">SHOWCASE EVENTS</span>
                        </h2>
                    </div>
                    <span className="text-xs font-bold text-gray-500">{events.length} results</span>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-500 font-bold">Loading live event data...</div>
                ) : events.length === 0 ? (
                    <div className="bg-white p-12 text-center rounded-3xl border border-black/10">
                        <p className="text-gray-500 text-sm font-bold">No events match your query.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {events.map((event) => (
                            <EventCard key={event._id} event={event} />
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default Home;