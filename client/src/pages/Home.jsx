import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import EventCard from '../components/EventCard';
import { FaSearch, FaRegClock, FaTicketAlt, FaShieldAlt, FaStar, FaBolt, FaArrowRight, FaUsers, FaCompass, FaCheckCircle } from 'react-icons/fa';
import { HiSparkles, HiUserGroup, HiFire } from 'react-icons/hi2';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

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

    const categories = [
        { name: 'Music Festivals', count: '140+ Events', color: 'from-purple-600 to-indigo-600', tag: 'Music' },
        { name: 'Tech Conferences', count: '85+ Events', color: 'from-blue-600 to-cyan-600', tag: 'Tech' },
        { name: 'Art Exhibitions', count: '60+ Events', color: 'from-pink-600 to-rose-600', tag: 'Arts' },
        { name: 'Food & Culinary', count: '45+ Events', color: 'from-amber-500 to-orange-600', tag: 'Food' },
        { name: 'Gaming & Esports', count: '90+ Events', color: 'from-emerald-600 to-teal-600', tag: 'Gaming' },
        { name: 'Business Summits', count: '50+ Events', color: 'from-purple-700 to-pink-600', tag: 'Business' }
    ];

    const featuredEvent = events[0] || {
        _id: 'featured-1',
        title: 'Neon Odyssey: Cyberpunk Electronic Festival 2026',
        category: 'Music',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'Cyber Arena, Metro Hub',
        ticketPrice: 1499,
        availableSeats: 24,
        totalSeats: 200,
        description: 'Immerse into a 3-day multi-stage audiovisual extravaganza featuring top global synthwave DJs and holographic lasers.',
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop'
    };

    return (
        <div className="space-y-20 pb-16">
            {/* 1️⃣ Hero Section */}
            <div className="relative rounded-[2.5rem] bg-[#0c0f19] border border-white/10 overflow-hidden p-8 sm:p-14 lg:p-20 shadow-2xl">
                {/* Background Ambient Glowing Orbs */}
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/30 blur-[130px] rounded-full pointer-events-none animate-pulse-glow" />
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-pink-600/25 blur-[130px] rounded-full pointer-events-none animate-pulse-glow" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Left Column: Headlines & Search */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* Floating Sticker / Tag */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-bold tracking-widest uppercase text-purple-300 shadow-md">
                            <HiSparkles className="text-pink-400 text-sm animate-spin" />
                            <span>Festival & Tech Discovery Engine</span>
                        </div>

                        {/* Bold Editorial Headline */}
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05]">
                            Discover <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                                Unforgettable
                            </span> <br />
                            Live Events.
                        </h1>

                        <p className="text-gray-300 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
                            Connect with music festivals, tech summits, secret pop-ups, and masterclasses in your city. Real-time seats, instant OTP passes, & zero hassle.
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-xl">
                            <div className="glass-card p-2 rounded-2xl border border-white/15 shadow-2xl flex items-center gap-2">
                                <FaSearch className="text-gray-400 text-lg ml-4 shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Search events by title, genre, artist, or city..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-transparent border-0 text-white placeholder-gray-400 text-sm sm:text-base px-2 py-3 focus:outline-none focus:ring-0"
                                />
                                <Link
                                    to="/events"
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shrink-0 flex items-center gap-1.5"
                                >
                                    <span>Explore</span> <FaArrowRight className="text-xs" />
                                </Link>
                            </div>
                        </div>

                        {/* Quick Stats Pills */}
                        <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-gray-400">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                <span>50,000+ Tickets Issued</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse"></div>
                                <span>1,200+ Verified Hosts</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Featured Spotlight Card */}
                    <div className="lg:col-span-5 relative">
                        {/* Floating Decorative Badge Sticker */}
                        <div className="absolute -top-6 -right-4 z-20 bg-gradient-to-r from-amber-400 to-orange-500 text-black text-xs font-extrabold px-4 py-2 rounded-2xl shadow-xl rotate-6 animate-float-slow flex items-center gap-1">
                            <HiFire className="text-sm" /> SPOTLIGHT PICK
                        </div>

                        <div className="glass-card rounded-3xl overflow-hidden border border-white/20 shadow-2xl relative group">
                            <div className="h-72 w-full overflow-hidden bg-gray-900 relative">
                                <img src={featuredEvent.image} alt={featuredEvent.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0e131f] via-black/40 to-transparent"></div>
                                <span className="absolute top-4 left-4 bg-purple-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                                    {featuredEvent.category}
                                </span>
                            </div>

                            <div className="p-6 space-y-4">
                                <h3 className="text-xl font-bold text-white leading-snug">{featuredEvent.title}</h3>
                                <p className="text-xs text-gray-400 line-clamp-2">{featuredEvent.description}</p>
                                <div className="flex items-center justify-between text-xs text-purple-300 font-semibold pt-2 border-t border-white/10">
                                    <span>{new Date(featuredEvent.date).toLocaleDateString()}</span>
                                    <span className="text-white font-black text-base">₹{featuredEvent.ticketPrice}</span>
                                </div>
                                <Link
                                    to={`/events/${featuredEvent._id}`}
                                    className="block w-full text-center bg-white/10 hover:bg-purple-600 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all border border-white/15"
                                >
                                    Get VIP Passes Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2️⃣ Popular Categories Section */}
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                    <div>
                        <span className="text-xs font-extrabold uppercase tracking-widest text-purple-400">Curated Genres</span>
                        <h2 className="text-3xl font-black text-white tracking-tight">Popular Event Categories</h2>
                    </div>
                    <Link to="/events" className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
                        Browse All Genres &rarr;
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat, idx) => (
                        <Link
                            key={idx}
                            to={`/events?category=${cat.tag}`}
                            className="glass-card p-6 rounded-2xl border border-white/10 hover:border-purple-500/40 hover:-translate-y-1 transition-all group flex items-center justify-between"
                        >
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">{cat.name}</h3>
                                <p className="text-xs text-gray-400">{cat.count}</p>
                            </div>
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform`}>
                                <FaBolt />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* 3️⃣ Upcoming Events Showcase */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-xs font-extrabold uppercase tracking-widest text-pink-400">Live & Upcoming</span>
                        <h2 className="text-3xl font-black text-white tracking-tight">Trending Events Near You</h2>
                    </div>
                    <span className="text-xs font-semibold text-gray-400">{events.length} upcoming experiences</span>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading experiences...</div>
                ) : events.length === 0 ? (
                    <div className="glass-card p-12 text-center rounded-3xl border border-white/10">
                        <p className="text-gray-400 text-base">No events found matching your search.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {events.map((event) => (
                            <EventCard key={event._id} event={event} />
                        ))}
                    </div>
                )}
            </div>

            {/* 4️⃣ Why Eventrix Section */}
            <div className="glass-card p-10 sm:p-16 rounded-[2.5rem] border border-white/10 space-y-10 relative overflow-hidden">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-purple-400">The Eventrix Standard</span>
                    <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Built for Speed, Security & Pure Energy</h2>
                    <p className="text-gray-400 text-sm">Empowering organizers and fans with cutting-edge ticketing infrastructure.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white/5 p-8 rounded-2xl border border-white/10 text-center space-y-4 hover:border-purple-500/30 transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center text-2xl mx-auto">
                            <FaRegClock />
                        </div>
                        <h3 className="text-xl font-bold text-white">Instant 1-Click Booking</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">Reserve passes in under 15 seconds with seamless automated checkout and real-time seat locks.</p>
                    </div>
                    <div className="bg-white/5 p-8 rounded-2xl border border-white/10 text-center space-y-4 hover:border-pink-500/30 transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-pink-600/20 border border-pink-500/30 text-pink-400 flex items-center justify-center text-2xl mx-auto">
                            <FaTicketAlt />
                        </div>
                        <h3 className="text-xl font-bold text-white">Interactive QR Tickets</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">Instant digital passes with offline SVG QR security codes directly saved to your profile dashboard.</p>
                    </div>
                    <div className="bg-white/5 p-8 rounded-2xl border border-white/10 text-center space-y-4 hover:border-cyan-500/30 transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-2xl mx-auto">
                            <FaShieldAlt />
                        </div>
                        <h3 className="text-xl font-bold text-white">2FA OTP Guarantee</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">Every registration is protected with two-factor email verification to eradicate ticket scalpers.</p>
                    </div>
                </div>
            </div>

            {/* 5️⃣ Interactive Stats Section */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { number: '50,000+', label: 'Tickets Issued', sub: 'Worldwide fans' },
                    { number: '1,200+', label: 'Verified Hosts', sub: 'Festivals & Tech' },
                    { number: '99.8%', label: 'Scan Accuracy', sub: 'Instant gate entry' },
                    { number: '4.9 / 5', label: 'User Rating', sub: 'Over 10k reviews' }
                ].map((stat, i) => (
                    <div key={i} className="glass-card p-6 rounded-2xl border border-white/10 text-center space-y-1">
                        <h3 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">{stat.number}</h3>
                        <p className="text-sm font-bold text-white">{stat.label}</p>
                        <p className="text-xs text-gray-500">{stat.sub}</p>
                    </div>
                ))}
            </div>

            {/* 6️⃣ Testimonials Section */}
            <div className="space-y-6">
                <div className="text-center max-w-xl mx-auto space-y-2">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-purple-400">Community Voices</span>
                    <h2 className="text-3xl font-black text-white">Loved by Fans & Organizers</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { name: 'Alex Rivera', role: 'Music Festival Host', text: 'Eventrix made gate scanning at our electronic festival effortless. Sold out 3,000 tickets in 2 hours with zero crash.' },
                        { name: 'Sophia Chen', role: 'Tech Conference Lead', text: 'The OTP verification stopped bots from buying up our developer summit passes. Our attendees loved the digital QR pass!' },
                        { name: 'Marcus Vance', role: 'Avid Concert Goer', text: 'I booked VIP access for Neon Odyssey in literally 10 seconds on my phone. Cleanest ticket platform on the web.' }
                    ].map((t, i) => (
                        <div key={i} className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                            <div className="flex items-center gap-1 text-amber-400">
                                {[...Array(5)].map((_, s) => <FaStar key={s} className="text-xs" />)}
                            </div>
                            <p className="text-xs text-gray-300 leading-relaxed font-normal">"{t.text}"</p>
                            <div className="pt-2 border-t border-white/10 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs uppercase">
                                    {t.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white">{t.name}</h4>
                                    <p className="text-[10px] text-gray-500">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;