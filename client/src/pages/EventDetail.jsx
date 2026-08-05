import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import BookingModal from '../components/BookingModal';
import { FaCalendarAlt, FaMapMarkerAlt, FaChair, FaClock, FaCheckCircle, FaQuestionCircle, FaShareAlt } from 'react-icons/fa';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { HiSparkles, HiUserGroup, HiCheckCircle } from 'react-icons/hi2';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [activeTab, setActiveTab] = useState('overview');
    const [showBookingModal, setShowBookingModal] = useState(false);
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
        return <div className="text-center py-28 font-bold text-gray-500">Loading event details...</div>;
    }

    if (error || !event) {
        return (
            <div className="bg-white max-w-xl mx-auto p-12 text-center rounded-3xl border border-black/10 space-y-4 my-16">
                <h3 className="font-display font-black text-2xl text-black">Event Not Found</h3>
                <p className="text-red-500 text-xs font-bold">{error || 'This event does not exist.'}</p>
                <Link to="/" className="inline-block bg-[#8522FF] text-white font-extrabold px-6 py-2.5 rounded-full text-xs uppercase">
                    Return Home
                </Link>
            </div>
        );
    }

    const availableSeats = event.availableSeats ?? event.totalSeats ?? 50;
    const totalSeats = event.totalSeats ?? 100;
    const isSoldOut = availableSeats <= 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
            {/* Hero Image Banner */}
            <div className="relative rounded-[2.5rem] overflow-hidden bg-gray-900 border border-black/10 shadow-xl h-[400px] sm:h-[480px]">
                <img
                    src={event.image || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1600&auto=format&fit=crop'}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10">
                    <span className="bg-[#8522FF] text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider shadow-lg">
                        <HiSparkles className="inline mr-1" /> {event.category || 'SHOWCASE'}
                    </span>

                    <button
                        onClick={() => navigator.clipboard?.writeText(window.location.href)}
                        className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#8522FF] hover:text-white transition-all shadow-lg"
                        title="Share Event Link"
                    >
                        <FaShareAlt className="text-sm" />
                    </button>
                </div>

                <div className="absolute bottom-8 left-8 right-8 z-10 space-y-3">
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-300">
                        <span><FaCalendarAlt className="inline text-[#D2FF00]" /> {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        <span><FaMapMarkerAlt className="inline text-red-400" /> {event.location}</span>
                    </div>

                    <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight uppercase leading-tight max-w-4xl">
                        {event.title}
                    </h1>
                </div>
            </div>

            {/* Countdown Box */}
            <div className="bg-[#8522FF] text-white p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-xl font-bold">
                        <FaClock />
                    </div>
                    <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-200 block">LIVE SHOWCASE COUNTDOWN</span>
                        <h4 className="font-display font-black text-base uppercase">EVENT STARTS IN:</h4>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-3 text-center">
                    {[
                        { label: 'DAYS', val: timeLeft.days },
                        { label: 'HOURS', val: timeLeft.hours },
                        { label: 'MINS', val: timeLeft.minutes },
                        { label: 'SECS', val: timeLeft.seconds }
                    ].map((item, i) => (
                        <div key={i} className="bg-black/30 border border-white/10 px-4 py-2 rounded-2xl min-w-[70px]">
                            <span className="font-display font-black text-2xl block">{String(item.val).padStart(2, '0')}</span>
                            <span className="text-[9px] font-extrabold uppercase text-purple-200">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Side Tabs */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center gap-2 border-b border-black/10 pb-4 overflow-x-auto no-scrollbar">
                        {[
                            { id: 'overview', name: 'Overview' },
                            { id: 'schedule', name: 'Schedule Timeline' },
                            { id: 'speakers', name: 'Speakers & Artists' },
                            { id: 'venue', name: 'Venue Location' },
                            { id: 'faq', name: 'FAQ' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider shrink-0 transition-all ${activeTab === tab.id ? 'bg-[#8522FF] text-white shadow-md' : 'bg-white text-gray-700 hover:text-black border border-black/10'}`}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'overview' && (
                        <div className="bg-white p-8 rounded-3xl border border-black/10 space-y-6 shadow-sm">
                            <h3 className="font-display font-black text-2xl text-black uppercase">About This Showcase</h3>
                            <p className="text-gray-700 text-sm leading-relaxed font-normal whitespace-pre-line">
                                {event.description || 'Join us for an extraordinary showcase experience featuring keynotes, stage access, live networking, and exclusive digital passes.'}
                            </p>

                            <div className="pt-6 border-t border-black/10 space-y-4">
                                <h4 className="font-display font-black text-lg text-black uppercase">What's Included</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-gray-700">
                                    <div className="flex items-center gap-2"><HiCheckCircle className="text-[#8522FF] text-base" /> Full Access Pass to Stages</div>
                                    <div className="flex items-center gap-2"><HiCheckCircle className="text-[#8522FF] text-base" /> Verified QR Ticket Pass</div>
                                    <div className="flex items-center gap-2"><HiCheckCircle className="text-[#8522FF] text-base" /> Exclusive VIP Networking Lounge</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'schedule' && (
                        <div className="bg-white p-8 rounded-3xl border border-black/10 space-y-6">
                            <h3 className="font-display font-black text-2xl text-black uppercase">Timeline Agenda</h3>
                            <div className="space-y-4 relative border-l-2 border-[#8522FF] pl-6 ml-2">
                                {[
                                    { time: '09:00 AM', title: 'Doors Open & Check-In', desc: 'Scan QR pass & welcome badge.' },
                                    { time: '10:30 AM', title: 'Keynote & Main Stage Showcase', desc: 'Opening session by lead hosts.' },
                                    { time: '01:00 PM', title: 'Networking Lunch & VIP Lounge', desc: 'Gourmet lounge catering.' },
                                    { time: '04:00 PM', title: 'Award Ceremony & Performances', desc: 'Live performances & trophy announcements.' }
                                ].map((item, idx) => (
                                    <div key={idx} className="relative space-y-1">
                                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#8522FF] border-4 border-white"></div>
                                        <span className="text-xs font-mono font-bold text-[#8522FF]">{item.time}</span>
                                        <h4 className="font-display font-black text-base text-black uppercase">{item.title}</h4>
                                        <p className="text-xs text-gray-500 font-medium">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'speakers' && (
                        <div className="bg-white p-8 rounded-3xl border border-black/10 space-y-6">
                            <h3 className="font-display font-black text-2xl text-black uppercase">Featured Speakers & Hosts</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { name: 'Dr. Elena Rostova', role: 'Main Stage Host', org: 'World Game Awards' },
                                    { name: 'Marcus Vance', role: 'Keynote Speaker', org: 'Eventrix Labs' }
                                ].map((sp, i) => (
                                    <div key={i} className="bg-gray-50 p-4 rounded-2xl border border-black/10 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-[#8522FF] text-white font-black flex items-center justify-center text-lg uppercase">
                                            {sp.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-black text-sm">{sp.name}</h4>
                                            <p className="text-xs text-[#8522FF] font-bold">{sp.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'venue' && (
                        <div className="bg-white p-8 rounded-3xl border border-black/10 space-y-6">
                            <h3 className="font-display font-black text-2xl text-black uppercase">Location</h3>
                            <p className="text-sm font-bold text-black flex items-center gap-2">
                                <FaMapMarkerAlt className="text-red-500" /> {event.location}
                            </p>
                            <div className="h-64 rounded-2xl bg-gray-100 border border-black/10 flex items-center justify-center text-gray-500 font-bold text-sm">
                                📍 [Interactive Venue Map Preview - {event.location}]
                            </div>
                        </div>
                    )}

                    {activeTab === 'faq' && (
                        <div className="bg-white p-8 rounded-3xl border border-black/10 space-y-4">
                            <h3 className="font-display font-black text-2xl text-black uppercase mb-4">FAQ</h3>
                            {[
                                { q: 'How do I receive my pass?', a: 'Your digital QR ticket pass is generated instantly in your User Dashboard upon booking.' },
                                { q: 'Is 2FA verification mandatory?', a: 'Yes, a 6-digit OTP code is sent to your email to verify identity.' }
                            ].map((faq, i) => (
                                <div key={i} className="bg-gray-50 p-4 rounded-2xl border border-black/10 space-y-1">
                                    <h4 className="text-xs font-bold text-black flex items-center gap-2">
                                        <FaQuestionCircle className="text-[#8522FF]" /> {faq.q}
                                    </h4>
                                    <p className="text-xs text-gray-500 pl-6">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Side Booking Widget */}
                <div className="lg:col-span-4">
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/10 space-y-6 sticky top-28 shadow-xl">
                        <div className="space-y-1 border-b border-black/10 pb-4">
                            <span className="text-[10px] font-black uppercase text-[#8522FF] tracking-wider block">Pass Price</span>
                            <div className="flex items-baseline justify-between pt-1">
                                <span className="font-display font-black text-3xl text-black">
                                    {event.ticketPrice === 0 || !event.ticketPrice ? <span className="text-[#8522FF]">FREE</span> : `₹${event.ticketPrice}`}
                                </span>
                                <span className="text-xs text-gray-500 font-bold">per entry pass</span>
                            </div>
                        </div>

                        <div className="space-y-4 text-xs font-bold">
                            <div className="flex items-center justify-between text-gray-600">
                                <span>Seats Remaining</span>
                                <span className="text-black font-black">{availableSeats} / {totalSeats}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div className="bg-[#8522FF] h-2 rounded-full" style={{ width: `${(availableSeats / totalSeats) * 100}%` }}></div>
                            </div>
                            <div className="flex items-center justify-between text-gray-600">
                                <span>Date</span>
                                <span className="text-black">{new Date(event.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-gray-600">
                                <span>Location</span>
                                <span className="text-black max-w-[140px] truncate">{event.location}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                if (!user) navigate('/login');
                                else setShowBookingModal(true);
                            }}
                            disabled={isSoldOut}
                            className={`w-full py-4 px-6 rounded-2xl font-extrabold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-1.5 ${isSoldOut
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-[#0A0A0C] hover:bg-[#8522FF] text-white shadow-black/20'
                                }`}
                        >
                            <span>{isSoldOut ? 'Sold Out' : (user ? 'Reserve Pass' : 'Sign In to Book')}</span>
                            {!isSoldOut && <FaArrowUpRightFromSquare className="text-[10px]" />}
                        </button>
                    </div>
                </div>
            </div>

            {showBookingModal && (
                <BookingModal
                    event={event}
                    onClose={() => setShowBookingModal(false)}
                    onSuccess={() => {
                        api.get(`/events/${id}`).then(res => setEvent(res.data)).catch(() => { });
                    }}
                />
            )}
        </div>
    );
};

export default EventDetail;