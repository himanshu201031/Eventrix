import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/auth';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal } from '../animations';
import {
    Plus, Trash2, Check, X, Users, Clock, Sparkle, CalendarDays,
    Ticket, IndianRupee, XCircle,
} from 'lucide-react';

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
            setEvents(eventsRes.data.items ?? []);
            setBookings(bookingsRes.data.items ?? []);
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
        const load = async () => { await fetchData(); };
        load();
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
        if (window.confirm("Cancel this user's booking request?")) {
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
            <div className="mx-auto max-w-7xl px-4 pt-28 pb-16 sm:px-6 sm:pt-32">
                <div className="skeleton h-40 w-full rounded-[2rem]" />
                <div className="mt-6 grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((n) => <div key={n} className="skeleton h-28 w-full" />)}
                </div>
                <div className="mt-6 skeleton h-96 w-full rounded-[2rem]" />
            </div>
        );
    }

    const totalRevenue = bookings.reduce((sum, b) => (b.paymentStatus === 'paid' && b.status === 'confirmed' ? sum + (b.amount || 0) : sum), 0);
    const paidClientsCount = new Set(bookings.filter((b) => b.paymentStatus === 'paid' && b.status === 'confirmed').map((b) => b.userId?._id)).size;
    const pendingRequestsCount = bookings.filter((b) => b.status === 'pending').length;

    const metrics = [
        { label: 'Gross ticket revenue', value: `₹${totalRevenue}`, icon: IndianRupee, accent: 'bg-brand-purple' },
        { label: 'Paid attendees', value: paidClientsCount, icon: Users, accent: 'bg-brand-pink' },
        { label: 'Pending approvals', value: pendingRequestsCount, icon: Clock, accent: 'bg-brand-orange' },
        { label: 'Live events', value: events.length, icon: CalendarDays, accent: 'bg-brand-cyan text-brand-dark' },
    ];

    const inputClass = 'w-full rounded-2xl border border-black/10 bg-brand-light p-3.5 text-sm font-semibold text-gray-900 outline-none transition-colors focus:border-brand-purple dark:border-dark-line dark:bg-dark-surface-2 dark:text-dark-ink dark:placeholder-dark-muted';

    return (
        <div className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 sm:pt-28 lg:px-8">
            {/* Header */}
            <Reveal>
                <div className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-white p-8 sm:p-10 dark:border-dark-line dark:bg-dark-surface">
                    <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-purple/10" />
                    <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-brand-pink/10" />
                    <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-purple/20 bg-brand-purple/10 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-purple">
                                <Sparkle className="h-3 w-3" /> Admin console
                            </span>
                            <h1 className="font-display text-3xl uppercase leading-tight text-brand-dark sm:text-4xl dark:text-dark-ink">Eventrix admin suite</h1>
                            <p className="text-sm text-gray-500 dark:text-dark-muted">Manage events, approve gate access and track gross revenues.</p>
                        </div>
                        <button
                            onClick={() => setShowEventForm(!showEventForm)}
                            className={`flex shrink-0 items-center gap-2 rounded-full px-7 py-3.5 text-xs font-extrabold uppercase tracking-wider transition-all ${
                                showEventForm ? 'border border-black/10 bg-brand-light text-gray-600 dark:border-dark-line dark:bg-dark-surface-2 dark:text-dark-muted' : 'btn-gradient-lime text-brand-dark'
                            }`}
                        >
                            <Plus className="h-4 w-4" /> {showEventForm ? 'Close form' : 'Publish new event'}
                        </button>
                    </div>
                </div>
            </Reveal>

            {/* Metrics */}
            <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
                {metrics.map((m, i) => (
                    <Reveal key={m.label} delay={i * 0.06}>
                        <div className="card-lift rounded-3xl border border-black/5 bg-white p-5 shadow-soft dark:border-dark-line dark:bg-dark-surface">
                            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${m.accent} shadow-lg`}>
                                <m.icon className="h-5 w-5" />
                            </div>
                            <div className="mt-4 font-display text-3xl">{m.value}</div>
                            <div className="text-[11px] font-black uppercase tracking-wider text-gray-400 dark:text-dark-muted">{m.label}</div>
                        </div>
                    </Reveal>
                ))}
            </div>

            {/* Create event form */}
            <AnimatePresence>
                {showEventForm && (
                    <motion.div
                        initial={{ opacity: 0, y: 16, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: 16, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-6 rounded-[2rem] border border-black/5 bg-white p-6 shadow-soft sm:p-8 dark:border-dark-line dark:bg-dark-surface">
                            <div className="flex items-center justify-between border-b border-black/5 pb-4 dark:border-dark-line">
                                <h2 className="font-display text-xl uppercase">Publish new event experience</h2>
                                <button onClick={() => setShowEventForm(false)} className="text-gray-400 hover:text-black dark:text-dark-muted dark:hover:text-dark-ink">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateEvent} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black uppercase text-gray-500 dark:text-dark-muted">Event title</label>
                                    <input required type="text" placeholder="Sunset Music Festival 2025" className={inputClass} value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black uppercase text-gray-500 dark:text-dark-muted">Category (genre)</label>
                                    <input required type="text" placeholder="Music, Tech, Arts, Food, Gaming" className={inputClass} value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black uppercase text-gray-500 dark:text-dark-muted">Event date</label>
                                    <input required type="date" className={inputClass} value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black uppercase text-gray-500 dark:text-dark-muted">Venue location</label>
                                    <input required type="text" placeholder="Goa, India" className={inputClass} value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black uppercase text-gray-500 dark:text-dark-muted">Total seats</label>
                                    <input required type="number" placeholder="200" className={inputClass} value={formData.totalSeats} onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-black uppercase text-gray-500 dark:text-dark-muted">Ticket price (₹, 0 for free)</label>
                                    <input required type="number" placeholder="1499" className={inputClass} value={formData.ticketPrice} onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })} />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-[11px] font-black uppercase text-gray-500 dark:text-dark-muted">Cover image direct link</label>
                                    <input type="text" placeholder="https://..." className={inputClass} value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-[11px] font-black uppercase text-gray-500 dark:text-dark-muted">Event description</label>
                                    <textarea required placeholder="Information about stages, hosts, agenda..." className={`${inputClass} h-24 resize-none`} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                                </div>
                                <button type="submit" className="btn-gradient md:col-span-2 flex items-center justify-center gap-2 rounded-2xl py-4 text-xs font-extrabold uppercase tracking-wider text-white">
                                    <Plus className="h-4 w-4" /> Publish event experience
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tabs */}
            <div className="mt-8 flex items-center gap-2">
                <button
                    onClick={() => setActiveTab('bookings')}
                    className={`relative rounded-full px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-all ${activeTab === 'bookings' ? 'text-white' : 'border border-black/10 bg-white text-gray-600 dark:border-dark-line dark:bg-dark-surface dark:text-dark-muted'}`}
                >
                    {activeTab === 'bookings' && (
                        <motion.span layoutId="admin-tab" className="absolute inset-0 rounded-full bg-brand-purple" transition={{ type: 'spring', stiffness: 320, damping: 26 }} />
                    )}
                    <span className="relative z-10">Booking approvals ({bookings.length})</span>
                </button>
                <button
                    onClick={() => setActiveTab('events')}
                    className={`relative rounded-full px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-all ${activeTab === 'events' ? 'text-white' : 'border border-black/10 bg-white text-gray-600 dark:border-dark-line dark:bg-dark-surface dark:text-dark-muted'}`}
                >
                    {activeTab === 'events' && (
                        <motion.span layoutId="admin-tab" className="absolute inset-0 rounded-full bg-brand-purple" transition={{ type: 'spring', stiffness: 320, damping: 26 }} />
                    )}
                    <span className="relative z-10">All events ({events.length})</span>
                </button>
            </div>

            {/* Bookings management */}
            {activeTab === 'bookings' && (
                <div className="mt-6 rounded-[2rem] border border-black/5 bg-white p-6 shadow-soft sm:p-8 dark:border-dark-line dark:bg-dark-surface">
                    <h2 className="font-display text-xl uppercase">Booking requests</h2>
                    <div className="mt-5 max-h-[600px] space-y-4 overflow-y-auto pr-1" data-lenis-prevent>
                        {bookings.length === 0 ? (
                            <p className="py-10 text-center text-sm font-bold text-gray-400 dark:text-dark-muted">No booking requests submitted yet.</p>
                        ) : (
                            bookings.map((booking) => (
                                <motion.div
                                    key={booking._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="rounded-2xl border border-black/5 bg-brand-light p-5 dark:border-dark-line dark:bg-dark-surface-2"
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <h4 className="font-display text-base uppercase">{booking.eventId?.title || 'Deleted event'}</h4>
                                            <p className="mt-0.5 text-xs font-bold text-gray-600 dark:text-dark-muted">
                                                User: <strong className="text-gray-900 dark:text-dark-ink">{booking.userId?.username || 'Guest'}</strong> ({booking.userId?.email}) · ₹{booking.amount || 0} · {booking.quantity || 1} ticket(s)
                                            </p>
                                        </div>
                                        <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-black uppercase ${booking.status === 'confirmed' ? 'bg-brand-lime/30 text-brand-lime-deep dark:bg-brand-lime/20' : booking.status === 'cancelled' ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'}`}>
                                            {booking.status}
                                        </span>
                                    </div>

                                    {booking.status === 'pending' && (
                                        <div className="mt-4 flex flex-wrap gap-2 border-t border-black/5 pt-4 dark:border-dark-line">
                                            <button
                                                onClick={() => handleConfirmBooking(booking._id, 'paid')}
                                                className="btn-gradient-lime flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-extrabold uppercase"
                                            >
                                                <Check className="h-3.5 w-3.5" /> Approve as paid (₹{booking.amount})
                                            </button>
                                            <button
                                                onClick={() => handleConfirmBooking(booking._id, 'not_paid')}
                                                className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-xs font-extrabold uppercase text-gray-700 transition-all hover:border-brand-purple dark:border-dark-line dark:bg-dark-surface dark:text-dark-muted"
                                            >
                                                Approve undecided
                                            </button>
                                            <button
                                                onClick={() => handleCancelBooking(booking._id)}
                                                className="ml-auto flex items-center gap-1.5 rounded-xl bg-red-50 px-4 py-2.5 text-xs font-extrabold uppercase text-red-600 transition-all hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                                            >
                                                <XCircle className="h-3.5 w-3.5" /> Reject
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Events catalogue */}
            {activeTab === 'events' && (
                <div className="mt-6 rounded-[2rem] border border-black/5 bg-white p-6 shadow-soft sm:p-8 dark:border-dark-line dark:bg-dark-surface">
                    <h2 className="font-display text-xl uppercase">Live event catalogue</h2>
                    <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                        {events.map((event) => (
                            <div key={event._id} className="flex items-center justify-between gap-4 rounded-2xl border border-black/5 bg-brand-light p-5 transition-all hover:border-brand-purple/30 dark:border-dark-line dark:bg-dark-surface-2">
                                <div className="min-w-0">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-purple">{event.category}</span>
                                    <h4 className="font-display mt-0.5 text-sm uppercase line-clamp-1">{event.title}</h4>
                                    <p className="mt-1 flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-dark-muted">
                                        <Ticket className="h-3 w-3 text-brand-pink" />
                                        {event.availableSeats} of {event.totalSeats} seats left · ₹{event.ticketPrice || 0}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDeleteEvent(event._id)}
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 transition-all hover:bg-red-500 hover:text-white dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white"
                                    title="Delete event"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                        {events.length === 0 && (
                            <p className="col-span-full py-10 text-center text-sm font-bold text-gray-400 dark:text-dark-muted">No events published yet.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
