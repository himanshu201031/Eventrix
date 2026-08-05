import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/authContext';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrashAlt, FaCheck, FaTimes, FaChartLine, FaUsers, FaClock } from 'react-icons/fa';
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

    const [activeTab, setActiveTab] = useState('bookings');

    const fetchData = useCallback(async () => {
        try {
            const [eventsRes, bookingsRes] = await Promise.all([
                api.get('/events'),
                api.get('/bookings/my')
            ]);
            setEvents(eventsRes.data);
            setBookings(bookingsRes.data);
        } catch (error) {
            console.error('Error fetching admin data', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        fetchData();
    }, [user, navigate, fetchData]);

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
            } catch {
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
        return <div className="text-center py-28 font-bold text-gray-500">Loading admin suite...</div>;
    }

    const totalRevenue = bookings.reduce((sum, b) => b.paymentStatus === 'paid' && b.status === 'confirmed' ? sum + (b.amount || 0) : sum, 0);
    const paidClientsCount = new Set(bookings.filter(b => b.paymentStatus === 'paid' && b.status === 'confirmed').map(b => b.userId?._id)).size;
    const pendingRequestsCount = bookings.filter(b => b.status === 'pending').length;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header Banner */}
            <div className="bg-[#0B0B0B] text-white p-6 sm:p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="space-y-1 text-center md:text-left">
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#8522FF] text-white text-[10px] font-extrabold uppercase">
                        <HiSparkles /> ADMIN CONSOLE
                    </span>
                    <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight">Eventrix Admin Suite</h1>
                    <p className="text-xs text-gray-400 font-bold">Manage showcase events, approve gate access, and track gross revenues.</p>
                </div>

                <button
                    onClick={() => setShowEventForm(!showEventForm)}
                    className="bg-[#D2FF00] hover:bg-[#bce400] text-black font-extrabold py-3 px-6 rounded-full text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2"
                >
                    <FaPlus /> {showEventForm ? 'Close Form' : 'Publish New Event'}
                </button>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-black/10 space-y-2 shadow-sm">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">GROSS TICKET REVENUE</span>
                    <div className="flex items-baseline justify-between">
                        <span className="font-display font-black text-3xl text-black">₹{totalRevenue}</span>
                        <FaChartLine className="text-[#8522FF] text-xl" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-black/10 space-y-2 shadow-sm">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">PAID ATTENDEES</span>
                    <div className="flex items-baseline justify-between">
                        <span className="font-display font-black text-3xl text-black">{paidClientsCount}</span>
                        <FaUsers className="text-[#8522FF] text-xl" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-black/10 space-y-2 shadow-sm">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">PENDING APPROVALS</span>
                    <div className="flex items-baseline justify-between">
                        <span className="font-display font-black text-3xl text-black">{pendingRequestsCount}</span>
                        <FaClock className="text-amber-500 text-xl" />
                    </div>
                </div>
            </div>

            {/* Event Creation Form */}
            {showEventForm && (
                <div className="bg-white p-8 rounded-3xl border border-black/10 space-y-6 shadow-xl animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-black/10 pb-4">
                        <h2 className="font-display font-black text-xl text-black uppercase">Publish New Event Experience</h2>
                        <button onClick={() => setShowEventForm(false)} className="text-gray-500 hover:text-black font-extrabold">✕</button>
                    </div>

                    <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-extrabold text-gray-700 uppercase">Event Title</label>
                            <input required type="text" placeholder="Title" className="w-full bg-gray-50 border border-black/10 rounded-2xl p-3 text-xs text-black font-bold focus:border-[#8522FF]" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-extrabold text-gray-700 uppercase">Category (Genre)</label>
                            <input required type="text" placeholder="Music, Tech, Arts, Food, Gaming" className="w-full bg-gray-50 border border-black/10 rounded-2xl p-3 text-xs text-black font-bold focus:border-[#8522FF]" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-extrabold text-gray-700 uppercase">Event Date</label>
                            <input required type="date" className="w-full bg-gray-50 border border-black/10 rounded-2xl p-3 text-xs text-black font-bold focus:border-[#8522FF]" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-extrabold text-gray-700 uppercase">Venue Location</label>
                            <input required type="text" placeholder="Cyber Arena, Main Stage" className="w-full bg-gray-50 border border-black/10 rounded-2xl p-3 text-xs text-black font-bold focus:border-[#8522FF]" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-extrabold text-gray-700 uppercase">Total Seats</label>
                            <input required type="number" placeholder="200" className="w-full bg-gray-50 border border-black/10 rounded-2xl p-3 text-xs text-black font-bold focus:border-[#8522FF]" value={formData.totalSeats} onChange={e => setFormData({ ...formData, totalSeats: e.target.value })} />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-extrabold text-gray-700 uppercase">Ticket Price (₹, 0 for free)</label>
                            <input required type="number" placeholder="1499" className="w-full bg-gray-50 border border-black/10 rounded-2xl p-3 text-xs text-black font-bold focus:border-[#8522FF]" value={formData.ticketPrice} onChange={e => setFormData({ ...formData, ticketPrice: e.target.value })} />
                        </div>

                        <div className="md:col-span-2 space-y-1">
                            <label className="text-xs font-extrabold text-gray-700 uppercase">Cover Image Direct Link</label>
                            <input type="text" placeholder="https://..." className="w-full bg-gray-50 border border-black/10 rounded-2xl p-3 text-xs text-black font-bold focus:border-[#8522FF]" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                        </div>

                        <div className="md:col-span-2 space-y-1">
                            <label className="text-xs font-extrabold text-gray-700 uppercase">Event Description</label>
                            <textarea required placeholder="Information about stages, hosts, agenda..." className="w-full bg-gray-50 border border-black/10 rounded-2xl p-3 text-xs text-black font-bold focus:border-[#8522FF] h-24" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        </div>

                        <button type="submit" className="md:col-span-2 bg-[#8522FF] text-white font-extrabold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md">
                            Publish Event Experience
                        </button>
                    </form>
                </div>
            )}

            {/* Admin Tabs */}
            <div className="flex items-center gap-2 border-b border-black/10 pb-4">
                <button
                    onClick={() => setActiveTab('bookings')}
                    className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase transition-all ${activeTab === 'bookings' ? 'bg-[#8522FF] text-white shadow-md' : 'bg-white text-gray-700 border border-black/10'}`}
                >
                    Booking Approvals ({bookings.length})
                </button>
                <button
                    onClick={() => setActiveTab('events')}
                    className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase transition-all ${activeTab === 'events' ? 'bg-[#8522FF] text-white shadow-md' : 'bg-white text-gray-700 border border-black/10'}`}
                >
                    All Events ({events.length})
                </button>
            </div>

            {/* Tab 1: Bookings Management */}
            {activeTab === 'bookings' && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/10 space-y-6 shadow-sm">
                    <h2 className="font-display font-black text-xl text-black uppercase">Booking Requests</h2>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                        {bookings.length === 0 ? (
                            <p className="text-gray-500 font-bold text-xs text-center py-8">No booking requests submitted yet.</p>
                        ) : (
                            bookings.map((booking) => (
                                <div key={booking._id} className="bg-gray-50 p-5 rounded-2xl border border-black/10 space-y-4">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                        <div>
                                            <h4 className="font-display font-black text-[#0A0A0C] text-base uppercase">{booking.eventId?.title || 'Deleted Event'}</h4>
                                            <p className="text-xs font-bold text-gray-600">
                                                User: <strong className="text-black">{booking.userId?.username || 'Guest'}</strong> ({booking.userId?.email})
                                            </p>
                                        </div>
                                        <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full uppercase ${booking.status === 'confirmed' ? 'bg-[#D2FF00] text-black' :
                                            booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                'bg-amber-100 text-amber-800'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </div>

                                    {booking.status === 'pending' && (
                                        <div className="flex flex-wrap gap-2 pt-2 border-t border-black/10">
                                            <button
                                                onClick={() => handleConfirmBooking(booking._id, 'paid')}
                                                className="bg-[#D2FF00] hover:bg-[#bce400] text-black text-xs font-extrabold py-2 px-4 rounded-xl transition-all flex items-center gap-1"
                                            >
                                                <FaCheck /> Approve as Paid (₹{booking.amount})
                                            </button>
                                            <button
                                                onClick={() => handleConfirmBooking(booking._id, 'not_paid')}
                                                className="bg-gray-200 text-black text-xs font-extrabold py-2 px-4 rounded-xl transition-all"
                                            >
                                                Approve Undecided
                                            </button>
                                            <button
                                                onClick={() => handleCancelBooking(booking._id)}
                                                className="bg-red-100 hover:bg-red-200 text-red-700 text-xs font-extrabold py-2 px-4 rounded-xl transition-all flex items-center gap-1 ml-auto"
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

            {/* Tab 2: Events Catalogue */}
            {activeTab === 'events' && (
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/10 space-y-6 shadow-sm">
                    <h2 className="font-display font-black text-xl text-black uppercase">Live Event Catalogue</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {events.map((event) => (
                            <div key={event._id} className="bg-gray-50 p-5 rounded-2xl border border-black/10 flex items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase text-[#8522FF]">{event.category}</span>
                                    <h4 className="font-display font-black text-black text-sm uppercase line-clamp-1">{event.title}</h4>
                                    <p className="text-xs font-bold text-gray-500">{event.availableSeats} of {event.totalSeats} seats left</p>
                                </div>
                                <button
                                    onClick={() => handleDeleteEvent(event._id)}
                                    className="w-9 h-9 rounded-xl bg-red-100 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all shrink-0"
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