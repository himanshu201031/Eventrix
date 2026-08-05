import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrashAlt, FaCheck, FaTimes, FaChartLine, FaTicketAlt, FaUsers, FaClock, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showEventForm, setShowEventForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', image: ''
    });

    const [activeTab, setActiveTab] = useState('bookings'); // 'bookings', 'events', 'analytics'

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            const [eventsRes, bookingsRes] = await Promise.all([
                api.get('/events'),
                api.get('/bookings/my') // Admin gets all bookings
            ]);
            setEvents(eventsRes.data);
            setBookings(bookingsRes.data);
        } catch (error) {
            console.error('Error fetching admin data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/events', formData);
            setShowEventForm(false);
            setFormData({ title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', image: '' });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating event');
        }
    };

    const handleDeleteEvent = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/events/${id}`);
                fetchData();
            } catch (error) {
                alert('Error deleting event');
            }
        }
    };

    const handleConfirmBooking = async (id, paymentStatus) => {
        try {
            await api.put(`/bookings/${id}/confirm`, { paymentStatus });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error confirming booking');
        }
    };

    const handleCancelBooking = async (id) => {
        if (window.confirm('Cancel this user\'s booking request?')) {
            try {
                await api.delete(`/bookings/${id}`);
                fetchData();
            } catch (error) {
                alert(error.response?.data?.message || 'Error cancelling booking');
            }
        }
    };

    if (loading) {
        return (
            <div className="text-center py-28 space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin mx-auto"></div>
                <p className="text-gray-400 text-sm font-medium">Loading admin suite...</p>
            </div>
        );
    }

    const totalRevenue = bookings.reduce((sum, b) => b.paymentStatus === 'paid' && b.status === 'confirmed' ? sum + (b.amount || 0) : sum, 0);
    const paidClientsCount = new Set(bookings.filter(b => b.paymentStatus === 'paid' && b.status === 'confirmed').map(b => b.userId?._id)).size;
    const pendingRequestsCount = bookings.filter(b => b.status === 'pending').length;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Stripe/Vercel Header Banner */}
            <div className="glass-card p-6 sm:p-10 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="space-y-1 text-center md:text-left z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-extrabold uppercase tracking-widest">
                        <HiSparkles /> Administrator Console
                    </span>
                    <h1 className="text-3xl font-black text-white">Eventrix Admin Suite</h1>
                    <p className="text-xs text-gray-400">Manage live events, approve gate access, and track ticket revenue analytics.</p>
                </div>

                <button
                    onClick={() => setShowEventForm(!showEventForm)}
                    className="z-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black py-3 px-6 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-purple-500/25 flex items-center gap-2"
                >
                    <FaPlus /> {showEventForm ? 'Close Form' : 'Publish New Event'}
                </button>
            </div>

            {/* Analytics Metric Cards (Stripe Style) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 block">Gross Ticket Revenue</span>
                    <div className="flex items-baseline justify-between">
                        <span className="text-3xl font-black text-white">₹{totalRevenue}</span>
                        <FaChartLine className="text-emerald-400 text-xl" />
                    </div>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 block">Verified Paid Clients</span>
                    <div className="flex items-baseline justify-between">
                        <span className="text-3xl font-black text-white">{paidClientsCount}</span>
                        <FaUsers className="text-cyan-400 text-xl" />
                    </div>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 block">Pending Gate Requests</span>
                    <div className="flex items-baseline justify-between">
                        <span className="text-3xl font-black text-white">{pendingRequestsCount}</span>
                        <FaClock className="text-amber-400 text-xl" />
                    </div>
                </div>
            </div>

            {/* Event Creation Form Modal / Panel */}
            {showEventForm && (
                <div className="glass-card p-8 rounded-3xl border border-purple-500/40 glow-purple space-y-6 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <FaPlus className="text-purple-400 text-xs" /> Publish New Event Experience
                        </h2>
                        <button onClick={() => setShowEventForm(false)} className="text-gray-400 hover:text-white text-sm font-bold">✕</button>
                    </div>

                    <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-300">Event Title</label>
                            <input required type="text" placeholder="e.g. Neon Odyssey Cyberpunk Fest" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-purple-500 focus:outline-none" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-300">Category (Genre)</label>
                            <input required type="text" placeholder="Music, Tech, Arts, Food, Gaming" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-purple-500 focus:outline-none" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-300">Event Date</label>
                            <input required type="date" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-purple-500 focus:outline-none" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-300">Venue Location</label>
                            <input required type="text" placeholder="e.g. Cyber Arena, Main Stage" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-purple-500 focus:outline-none" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-300">Total Capacity Seats</label>
                            <input required type="number" placeholder="200" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-purple-500 focus:outline-none" value={formData.totalSeats} onChange={e => setFormData({ ...formData, totalSeats: e.target.value })} />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-300">Ticket Price (₹, 0 for free)</label>
                            <input required type="number" placeholder="1499" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-purple-500 focus:outline-none" value={formData.ticketPrice} onChange={e => setFormData({ ...formData, ticketPrice: e.target.value })} />
                        </div>

                        <div className="md:col-span-2 space-y-1">
                            <label className="text-xs font-bold text-gray-300">Cover Image Direct URL</label>
                            <input type="text" placeholder="https://images.unsplash.com/..." className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-purple-500 focus:outline-none" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                        </div>

                        <div className="md:col-span-2 space-y-1">
                            <label className="text-xs font-bold text-gray-300">Event Description</label>
                            <textarea required placeholder="Detailed information about speakers, stages, agenda..." className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-purple-500 focus:outline-none h-24" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        </div>

                        <button type="submit" className="md:col-span-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg">
                            Publish Event Experience
                        </button>
                    </form>
                </div>
            )}

            {/* Admin Tabs Bar */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                <button
                    onClick={() => setActiveTab('bookings')}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${activeTab === 'bookings' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'}`}
                >
                    Booking Approvals ({bookings.length})
                </button>
                <button
                    onClick={() => setActiveTab('events')}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${activeTab === 'events' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'}`}
                >
                    All Events ({events.length})
                </button>
            </div>

            {/* Tab 1: Bookings Management */}
            {activeTab === 'bookings' && (
                <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
                    <h2 className="text-xl font-bold text-white">Attendee Booking Requests</h2>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                        {bookings.length === 0 ? (
                            <p className="text-gray-400 text-xs text-center py-8">No booking requests submitted yet.</p>
                        ) : (
                            bookings.map((booking) => (
                                <div key={booking._id} className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-4 hover:border-white/20 transition-all">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                        <div>
                                            <h4 className="font-bold text-white text-base">{booking.eventId?.title || 'Deleted Event'}</h4>
                                            <p className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                                                <span>User: <strong className="text-white">{booking.userId?.username || 'Guest'}</strong> ({booking.userId?.email})</span>
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                                booking.status === 'cancelled' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                                                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons for Admin */}
                                    {booking.status === 'pending' && (
                                        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                                            <button
                                                onClick={() => handleConfirmBooking(booking._id, 'paid')}
                                                className="bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 hover:text-white border border-emerald-500/30 text-xs font-bold py-2 px-4 rounded-xl transition-all flex items-center gap-1"
                                            >
                                                <FaCheck /> Approve as Paid (₹{booking.amount})
                                            </button>
                                            <button
                                                onClick={() => handleConfirmBooking(booking._id, 'not_paid')}
                                                className="bg-white/10 hover:bg-white/20 text-gray-300 text-xs font-bold py-2 px-4 rounded-xl transition-all"
                                            >
                                                Approve Undecided
                                            </button>
                                            <button
                                                onClick={() => handleCancelBooking(booking._id)}
                                                className="bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 text-xs font-bold py-2 px-4 rounded-xl transition-all flex items-center gap-1 ml-auto"
                                            >
                                                <FaTimes /> Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Tab 2: Events Management */}
            {activeTab === 'events' && (
                <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
                    <h2 className="text-xl font-bold text-white">Live Event Catalogue</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {events.map((event) => (
                            <div key={event._id} className="bg-white/5 p-5 rounded-2xl border border-white/10 flex items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-400">{event.category}</span>
                                    <h4 className="font-bold text-white text-sm line-clamp-1">{event.title}</h4>
                                    <p className="text-xs text-gray-400">{event.availableSeats} of {event.totalSeats} seats remaining</p>
                                </div>
                                <button
                                    onClick={() => handleDeleteEvent(event._id)}
                                    className="w-9 h-9 rounded-xl bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 flex items-center justify-center transition-all shrink-0"
                                    title="Delete Event"
                                >
                                    <FaTrashAlt className="text-xs" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;