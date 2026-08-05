import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import BookingModal from '../components/BookingModal';
import { FaCalendarAlt, FaMapMarkerAlt, FaChair, FaMoneyBillWave, FaClock, FaCheckCircle, FaUserCircle, FaQuestionCircle, FaStar, FaShareAlt, FaHeart } from 'react-icons/fa';
import { HiSparkles, HiUserGroup, HiCheckCircle } from 'react-icons/hi2';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Tabs state: 'overview', 'schedule', 'speakers', 'venue', 'faq'
    const [activeTab, setActiveTab] = useState('overview');
    const [showBookingModal, setShowBookingModal] = useState(false);

    // Countdown Timer State
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);
            } catch (err) {
                setError('Failed to load event details.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    // Live countdown timer calculation
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
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);
                setTimeLeft({ days, hours, minutes, seconds });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [event]);

    if (loading) {
        return (
            <div className="text-center py-28 space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin mx-auto"></div>
                <p className="text-gray-400 text-sm font-medium">Loading event experience...</p>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="glass-card max-w-xl mx-auto p-12 text-center rounded-3xl border border-white/10 space-y-4 my-16">
                <h3 className="text-2xl font-bold text-white">Event Not Found</h3>
                <p className="text-red-400 text-sm">{error || 'This event does not exist or has been removed.'}</p>
                <Link to="/" className="inline-block bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all">
                    Return to Home
                </Link>
            </div>
        );
    }

    const availableSeats = event.availableSeats ?? event.totalSeats ?? 50;
    const totalSeats = event.totalSeats ?? 100;
    const isSoldOut = availableSeats <= 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
            {/* Hero Image Banner with Glass Overlay */}
            <div className="relative rounded-[2.5rem] overflow-hidden bg-gray-900 border border-white/10 shadow-2xl h-[400px] sm:h-[500px]">
                <img
                    src={event.image || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1600&auto=format&fit=crop'}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/60 to-black/30"></div>

                {/* Top Actions Overlay */}
                <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
                    <span className="bg-black/60 backdrop-blur-md text-white text-xs font-extrabold px-4 py-2 rounded-full border border-white/15 tracking-wider uppercase flex items-center gap-1.5 shadow-lg">
                        <HiSparkles className="text-purple-400" /> {event.category || 'Special Event'}
                    </span>

                    <div className="flex gap-3">
                        <button
                            onClick={() => navigator.clipboard?.writeText(window.location.href)}
                            className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:text-purple-400 transition-all shadow-lg"
                            title="Share Event Link"
                        >
                            <FaShareAlt className="text-sm" />
                        </button>
                    </div>
                </div>

                {/* Banner Content */}
                <div className="absolute bottom-8 left-8 right-8 z-10 space-y-3">
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-purple-300">
                        <span className="flex items-center gap-1.5"><FaCalendarAlt className="text-pink-400" /> {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        <span className="flex items-center gap-1.5"><FaMapMarkerAlt className="text-cyan-400" /> {event.location}</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-4xl">
                        {event.title}
                    </h1>
                </div>
            </div>

            {/* Countdown Bar */}
            <div className="glass-card p-6 rounded-2xl border border-purple-500/30 glow-purple flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center text-xl border border-purple-500/30">
                        <FaClock />
                    </div>
                    <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-400 block">Live Event Countdown</span>
                        <h4 className="text-base font-bold text-white">Event Starts In:</h4>
                    </div>
                </div>

                {/* Countdown Grid */}
                <div className="grid grid-cols-4 gap-3 text-center">
                    {[
                        { label: 'DAYS', val: timeLeft.days },
                        { label: 'HOURS', val: timeLeft.hours },
                        { label: 'MINS', val: timeLeft.minutes },
                        { label: 'SECS', val: timeLeft.seconds }
                    ].map((item, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl min-w-[70px]">
                            <span className="text-2xl font-black text-white block">{String(item.val).padStart(2, '0')}</span>
                            <span className="text-[9px] font-extrabold text-purple-300 uppercase tracking-widest">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Layout (Left: Multi-Tab Info, Right: Sticky Booking Widget) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Side: Tabs & Details */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Tab Selector Header */}
                    <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto no-scrollbar">
                        {[
                            { id: 'overview', name: 'Overview' },
                            { id: 'schedule', name: 'Schedule Timeline' },
                            { id: 'speakers', name: 'Speakers & Artists' },
                            { id: 'venue', name: 'Venue & Map' },
                            { id: 'faq', name: 'FAQ' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-5 py-2.5 rounded-full text-xs font-bold shrink-0 transition-all ${activeTab === tab.id ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'}`}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </div>

                    {/* Tab 1: Overview */}
                    {activeTab === 'overview' && (
                        <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-6">
                            <h3 className="text-2xl font-extrabold text-white">About This Experience</h3>
                            <p className="text-gray-300 text-base leading-relaxed font-normal whitespace-pre-line">
                                {event.description || 'Join us for an unforgettable experience featuring top-tier stage production, keynotes, live networking, and exclusive merch.'}
                            </p>

                            <div className="pt-6 border-t border-white/10 space-y-4">
                                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                                    <HiSparkles className="text-purple-400" /> What's Included With Your Pass
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-300 font-medium">
                                    <div className="flex items-center gap-2"><HiCheckCircle className="text-emerald-400 text-base" /> Full Access to All Keynotes & Stages</div>
                                    <div className="flex items-center gap-2"><HiCheckCircle className="text-emerald-400 text-base" /> Digital Verified QR Entrance Ticket</div>
                                    <div className="flex items-center gap-2"><HiCheckCircle className="text-emerald-400 text-base" /> VIP Lounge Access (VIP Ticket Tier)</div>
                                    <div className="flex items-center gap-2"><HiCheckCircle className="text-emerald-400 text-base" /> Food & Beverage Tokens</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab 2: Schedule Timeline */}
                    {activeTab === 'schedule' && (
                        <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-6">
                            <h3 className="text-2xl font-extrabold text-white">Event Schedule Timeline</h3>
                            <div className="space-y-4 relative border-l-2 border-purple-500/40 pl-6 ml-2">
                                {[
                                    { time: '09:00 AM', title: 'Doors Open & Registration Check-In', desc: 'Scan digital QR passes, claim welcome badge & coffee networking.' },
                                    { time: '10:30 AM', title: 'Opening Keynote & Audio-Visual Intro', desc: 'Welcome session by lead hosts and festival organizers.' },
                                    { time: '01:00 PM', title: 'Networking Lunch & VIP Lounge Access', desc: 'Gourmet catering and open networking lounge.' },
                                    { time: '04:00 PM', title: 'Main Stage Performance & Panel Q&A', desc: 'Live performances and interactive audience Q&A.' }
                                ].map((item, idx) => (
                                    <div key={idx} className="relative space-y-1">
                                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-purple-500 border-4 border-[#07090e]"></div>
                                        <span className="text-xs font-mono font-bold text-purple-400">{item.time}</span>
                                        <h4 className="text-base font-bold text-white">{item.title}</h4>
                                        <p className="text-xs text-gray-400">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tab 3: Speakers & Artists */}
                    {activeTab === 'speakers' && (
                        <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-6">
                            <h3 className="text-2xl font-extrabold text-white">Featured Performers & Speakers</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { name: 'Dr. Elena Rostova', role: 'AI & Synthwave Pioneer', org: 'Eventrix Labs' },
                                    { name: 'Marcus Vance', role: 'Headliner DJ & Music Producer', org: 'Electro Records' }
                                ].map((sp, i) => (
                                    <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-lg">
                                            {sp.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm">{sp.name}</h4>
                                            <p className="text-xs text-purple-300">{sp.role}</p>
                                            <span className="text-[10px] text-gray-500">{sp.org}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tab 4: Venue & Map */}
                    {activeTab === 'venue' && (
                        <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-6">
                            <h3 className="text-2xl font-extrabold text-white">Venue Location</h3>
                            <div className="space-y-2">
                                <p className="text-sm font-bold text-white flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-pink-400" /> {event.location}
                                </p>
                                <p className="text-xs text-gray-400">Convenient parking, accessible entrance lanes, and security checkposts available.</p>
                            </div>
                            <div className="h-64 rounded-2xl bg-gray-800/80 border border-white/10 flex items-center justify-center text-gray-500 text-sm font-bold">
                                📍 [Interactive Venue Map Preview - {event.location}]
                            </div>
                        </div>
                    )}

                    {/* Tab 5: FAQ */}
                    {activeTab === 'faq' && (
                        <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-4">
                            <h3 className="text-2xl font-extrabold text-white mb-4">Frequently Asked Questions</h3>
                            {[
                                { q: 'How do I receive my digital pass?', a: 'Once booked, your QR ticket pass is generated instantly and available in your user dashboard.' },
                                { q: 'Can I transfer or cancel my registration?', a: 'You can request cancellation directly from your User Dashboard prior to the event start.' },
                                { q: 'Is 2FA verification mandatory?', a: 'Yes, an OTP code is sent to your email to verify authentic attendee identity.' }
                            ].map((faq, i) => (
                                <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-1">
                                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                        <FaQuestionCircle className="text-purple-400 text-xs" /> {faq.q}
                                    </h4>
                                    <p className="text-xs text-gray-400 pl-6">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Side: Sticky Booking Card Widget */}
                <div className="lg:col-span-4">
                    <div className="glass-card p-6 sm:p-8 rounded-3xl border border-purple-500/40 glow-purple sticky top-28 space-y-6 shadow-2xl">
                        <div className="space-y-1 border-b border-white/10 pb-4">
                            <span className="text-xs font-extrabold uppercase tracking-widest text-purple-400">Pass Reservation</span>
                            <div className="flex items-baseline justify-between pt-1">
                                <span className="text-3xl font-black text-white">
                                    {event.ticketPrice === 0 || !event.ticketPrice ? <span className="text-emerald-400">FREE</span> : `₹${event.ticketPrice}`}
                                </span>
                                <span className="text-xs text-gray-400">per entry pass</span>
                            </div>
                        </div>

                        {/* Attribute Summary */}
                        <div className="space-y-4 text-xs font-semibold">
                            <div className="flex items-center justify-between text-gray-300">
                                <span className="flex items-center gap-2 text-gray-400"><FaChair className="text-purple-400" /> Seats Available</span>
                                <span className={availableSeats < 10 ? 'text-amber-400 font-bold' : 'text-white'}>{availableSeats} / {totalSeats}</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: `${(availableSeats / totalSeats) * 100}%` }}></div>
                            </div>
                            <div className="flex items-center justify-between text-gray-300">
                                <span className="flex items-center gap-2 text-gray-400"><FaCalendarAlt className="text-pink-400" /> Date</span>
                                <span className="text-white">{new Date(event.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-gray-300">
                                <span className="flex items-center gap-2 text-gray-400"><FaMapMarkerAlt className="text-cyan-400" /> Venue</span>
                                <span className="text-white max-w-[150px] truncate">{event.location}</span>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={() => {
                                if (!user) navigate('/login');
                                else setShowBookingModal(true);
                            }}
                            disabled={isSoldOut}
                            className={`w-full py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-xl ${isSoldOut
                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/10'
                                : 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-500/30 hover:scale-[1.02]'
                                }`}
                        >
                            {isSoldOut ? 'Sold Out' : (user ? 'Reserve Ticket Pass &rarr;' : 'Sign In to Book')}
                        </button>

                        <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
                            <FaCheckCircle className="text-emerald-400" /> Guaranteed 2FA OTP Verified Ticket
                        </p>
                    </div>
                </div>
            </div>

            {/* Multi-Step Booking Modal */}
            {showBookingModal && (
                <BookingModal
                    event={event}
                    onClose={() => setShowBookingModal(false)}
                    onSuccess={() => {
                        // Refresh event available seats
                        api.get(`/events/${id}`).then(res => setEvent(res.data)).catch(() => { });
                    }}
                />
            )}
        </div>
    );
};

export default EventDetail;