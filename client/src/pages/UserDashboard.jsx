import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/auth';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { DirectionalTransition, TransitionLink, push } from '../components/Transitions';
import { motion } from 'framer-motion';
import QRTicketModal from '../components/QRTicketModal';
import { Reveal } from '../animations';
import {
    LayoutDashboard, Ticket, Heart, Receipt, Bell, UserRound, Settings,
    CalendarDays, QrCode, XCircle, CheckCircle2, AlertTriangle, Wallet,
    ArrowUpRight, Sparkle, MapPin,
} from 'lucide-react';

const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'bookings', label: 'My Bookings', icon: Ticket },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'invoices', label: 'Invoices', icon: Receipt },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'Profile', icon: UserRound },
    { id: 'settings', label: 'Settings', icon: Settings },
];

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBookingForQR, setSelectedBookingForQR] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    const fetchBookings = useCallback(async () => {
        try {
            const { data } = await api.get('/bookings/my');
            setBookings(data.items ?? []);
        } catch (error) {
            console.error('Error fetching bookings', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!user) {
            push(navigate, '/login');
            return;
        }
        const load = async () => { await fetchBookings(); };
        load();
    }, [user, navigate, fetchBookings]);

    const cancelBooking = async (id) => {
        if (window.confirm('Are you sure you want to cancel this booking request?')) {
            try {
                await api.delete(`/bookings/${id}`);
                fetchBookings();
            } catch (error) {
                alert(error.response?.data?.message || 'Error cancelling booking');
            }
        }
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-7xl px-4 pt-28 pb-16 sm:px-6 sm:pt-32">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="hidden lg:col-span-3 lg:block">
                        <div className="skeleton h-[420px] w-full" />
                    </div>
                    <div className="lg:col-span-9 space-y-6">
                        <div className="skeleton h-24 w-full" />
                        <div className="grid grid-cols-3 gap-4">
                            {[1, 2, 3].map((n) => <div key={n} className="skeleton h-28 w-full" />)}
                        </div>
                        {[1, 2].map((n) => <div key={n} className="skeleton h-24 w-full" />)}
                    </div>
                </div>
            </div>
        );
    }

    const upcomingCount = bookings.filter(
        (b) => b.status !== 'cancelled' && b.eventId?.date && new Date(b.eventId.date) > new Date()
    ).length;
    const ticketsCount = bookings.filter((b) => b.status !== 'cancelled').length;
    const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
    const pendingCount = bookings.filter((b) => b.status === 'pending').length;
    const totalSpent = bookings.reduce((sum, b) => (b.paymentStatus === 'paid' ? sum + (b.amount || 0) : sum), 0);
    const wishlistCount = 0;

    const stats = [
        { label: 'Upcoming events', value: upcomingCount, icon: CalendarDays, accent: 'bg-brand-purple' },
        { label: 'Tickets owned', value: ticketsCount, icon: Ticket, accent: 'bg-brand-pink' },
        { label: 'Wishlist', value: wishlistCount, icon: Heart, accent: 'bg-brand-orange' },
        { label: 'Total spent', value: `₹${totalSpent}`, icon: Wallet, accent: 'bg-brand-lime text-brand-dark' },
    ];

    const upcomingBookings = bookings
        .filter((b) => b.status !== 'cancelled')
        .sort((a, b) => new Date(a.eventId?.date || 0) - new Date(b.eventId?.date || 0));

    return (
        <DirectionalTransition>
        <div className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 sm:pt-28 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                {/* Sidebar */}
                <aside className="hidden lg:block lg:col-span-3">
                    <div className="rounded-[2rem] border border-black/5 bg-white p-4 shadow-soft lg:sticky lg:top-24 dark:border-dark-line dark:bg-dark-surface">
                        {/* Profile mini card */}
                        <div className="flex items-center gap-3 rounded-2xl bg-brand-light p-4 dark:bg-dark-surface-2">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-purple font-display text-xl text-white shadow-lg">
                                {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="min-w-0">
                                <span className="inline-flex items-center gap-1 rounded-full bg-brand-lime/20 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-brand-lime-deep">
                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-lime-deep" /> Active member
                                </span>
                                <h2 className="truncate text-sm font-black">{user?.username}</h2>
                            </div>
                        </div>

                        {/* Sidebar nav */}
                        <nav className="mt-4 space-y-1">
                            {sidebarItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`relative flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold transition-all ${
                                        activeTab === item.id ? 'text-white' : 'text-gray-600 hover:bg-brand-light hover:text-black dark:text-dark-muted dark:hover:bg-dark-surface-2 dark:hover:text-dark-ink'
                                    }`}
                                >
                                    {activeTab === item.id && (
                                        <motion.span
                                            layoutId="sidebar-active"
                                            className="absolute inset-0 rounded-2xl bg-brand-purple shadow-[0_8px_18px_-6px_rgba(186,40,226,0.45)]"
                                            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                                        />
                                    )}
                                    <item.icon className="relative z-10 h-4 w-4" />
                                    <span className="relative z-10">{item.label}</span>
                                </button>
                            ))}
                        </nav>

                        <TransitionLink to="/events" className="btn-gradient mt-4 flex items-center justify-center gap-2 rounded-2xl py-3 text-xs font-extrabold uppercase tracking-wider text-white">
                            Explore events <ArrowUpRight className="h-4 w-4" />
                        </TransitionLink>
                    </div>
                </aside>

                {/* Main */}
                <main className="lg:col-span-9">
                    {/* Greeting */}
                    <Reveal>
                        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-black/5 bg-white p-6 shadow-soft sm:p-8 dark:border-dark-line dark:bg-dark-surface">
                            <div>
                                <h1 className="font-display text-3xl uppercase leading-tight">
                                    Welcome back, <span className="text-gradient-brand">{user?.username || 'there'}</span>
                                </h1>
                                <p className="mt-1 text-sm font-semibold text-gray-500 dark:text-dark-muted">{user?.email}</p>
                            </div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-brand-purple/20 bg-brand-purple/5 px-4 py-2 text-[11px] font-black uppercase tracking-wider text-brand-purple">
                                <Sparkle className="h-3.5 w-3.5" /> {bookings.length} total bookings
                            </span>
                        </div>
                    </Reveal>

                    {/* Mobile tab pills */}
                    <div className="mt-6 flex gap-2 overflow-x-auto pb-1 no-scrollbar lg:hidden">
                        {sidebarItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`shrink-0 rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-wider transition-all ${
                                    activeTab === item.id ? 'bg-brand-purple text-white' : 'border border-black/10 bg-white text-gray-600 dark:border-dark-line dark:bg-dark-surface dark:text-dark-muted'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Overview / Bookings tabs */}
                    {(activeTab === 'overview' || activeTab === 'bookings') && (
                        <div className="mt-6 space-y-6">
                            {/* Stat cards */}
                            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                                {stats.map((s, i) => (
                                    <Reveal key={s.label} delay={i * 0.06}>
                                        <div className="card-lift rounded-3xl border border-black/5 bg-white p-5 shadow-soft dark:border-dark-line dark:bg-dark-surface">
                                            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${s.accent} shadow-lg`}>
                                                <s.icon className="h-5 w-5" />
                                            </div>
                                            <div className="mt-4 font-display text-3xl">{s.value}</div>
                                            <div className="text-[11px] font-black uppercase tracking-wider text-gray-400 dark:text-dark-muted">{s.label}</div>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>

                            {/* Upcoming events list */}
                            <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-soft sm:p-8 dark:border-dark-line dark:bg-dark-surface">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-display text-xl uppercase">Upcoming events</h3>
                                    <TransitionLink to="/events" className="text-xs font-extrabold uppercase text-brand-purple hover:underline">View all</TransitionLink>
                                </div>

                                {upcomingBookings.length === 0 ? (
                                    <div className="mt-6 rounded-3xl border border-dashed border-black/10 bg-brand-light p-10 text-center dark:border-dark-line dark:bg-dark-surface-2">
                                        <Ticket className="mx-auto h-10 w-10 text-brand-purple" />
                                        <h4 className="font-display mt-3 text-xl uppercase">No tickets yet</h4>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-dark-muted">You haven't reserved passes for any events. Let's fix that!</p>
                                        <TransitionLink to="/events" className="btn-gradient mt-5 inline-flex items-center gap-2 rounded-full px-7 py-3 text-xs font-extrabold uppercase tracking-wider text-white">
                                            Browse events <ArrowUpRight className="h-4 w-4" />
                                        </TransitionLink>
                                    </div>
                                ) : (
                                    <div className="mt-6 space-y-3">
                                        {upcomingBookings.map((booking, i) => {
                                            const event = booking.eventId || {};
                                            return (
                                                <Reveal key={booking._id} delay={i * 0.05}>
                                                    <div className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-brand-light p-4 sm:flex-row sm:items-center sm:justify-between dark:border-dark-line dark:bg-dark-surface-2">
                                                        <div className="flex items-center gap-4">
                                                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-gray-200 dark:bg-dark-surface">
                                                                <img
                                                                    src={event.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=200&auto=format&fit=crop'}
                                                                    alt={event.title}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-purple">{event.category || 'Pass'}</span>
                                                                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${booking.status === 'confirmed' ? 'bg-brand-lime/30 text-brand-lime-deep dark:bg-brand-lime/20' : booking.status === 'cancelled' ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'}`}>
                                                                        {booking.status}
                                                                    </span>
                                                                </div>
                                                                <h4 className="mt-0.5 truncate text-sm font-black line-clamp-1">{event.title || 'Event removed'}</h4>
                                                                <p className="flex items-center gap-3 text-[11px] font-bold text-gray-500 dark:text-dark-muted">
                                                                    <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3 text-brand-purple" /> {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}</span>
                                                                    <span className="flex items-center gap-1 truncate"><MapPin className="h-3 w-3 text-brand-orange" /> {event.location || '—'}</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 sm:shrink-0">
                                                            <span className="mr-1 rounded-full bg-white px-3 py-1 text-[11px] font-black text-gray-700 dark:bg-dark-surface dark:text-dark-muted">
                                                                {booking.quantity || 1} {booking.quantity > 1 ? 'Tickets' : 'Ticket'}
                                                            </span>
                                                            {booking.status !== 'cancelled' ? (
                                                                <>
                                                                    <button
                                                                        onClick={() => setSelectedBookingForQR(booking)}
                                                                        className="flex items-center gap-1.5 rounded-xl bg-brand-purple px-4 py-2.5 text-[11px] font-extrabold uppercase text-white shadow-md transition-all hover:bg-brand-purple-deep"
                                                                    >
                                                                        <QrCode className="h-3.5 w-3.5" /> QR
                                                                    </button>
                                                                    <button
                                                                        onClick={() => cancelBooking(booking._id)}
                                                                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white text-red-500 transition-all hover:bg-red-50 dark:border-dark-line dark:bg-dark-surface dark:hover:bg-red-500/10"
                                                                        title="Cancel booking"
                                                                    >
                                                                        <XCircle className="h-4 w-4" />
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <span className="text-[10px] font-black uppercase text-gray-400 dark:text-dark-muted">Cancelled</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Reveal>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Extra booking status cards (overview only) */}
                            {activeTab === 'overview' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-soft dark:border-dark-line dark:bg-dark-surface">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-black uppercase tracking-wider text-gray-400 dark:text-dark-muted">Confirmed</span>
                                        <CheckCircle2 className="h-5 w-5 text-brand-lime-deep" />
                                    </div>
                                        <div className="mt-2 font-display text-3xl">{confirmedCount}</div>
                                    </div>
                                    <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-soft dark:border-dark-line dark:bg-dark-surface">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] font-black uppercase tracking-wider text-gray-400 dark:text-dark-muted">Pending</span>
                                            <AlertTriangle className="h-5 w-5 text-brand-orange" />
                                        </div>
                                        <div className="mt-2 font-display text-3xl">{pendingCount}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Invoices */}
                    {activeTab === 'invoices' && (
                        <div className="mt-6 rounded-[2rem] border border-black/5 bg-white p-6 shadow-soft sm:p-8 dark:border-dark-line dark:bg-dark-surface">
                            <h3 className="font-display text-xl uppercase">Payment receipts & invoices</h3>
                            <div className="mt-5 overflow-x-auto">
                                <table className="w-full text-left text-xs font-bold text-gray-700 dark:text-dark-muted">
                                    <thead>
                                        <tr className="bg-brand-light uppercase text-gray-400 text-[10px] tracking-wider dark:bg-dark-surface-2 dark:text-dark-muted">
                                            <th className="rounded-l-xl p-4">Transaction ID</th>
                                            <th className="p-4">Event</th>
                                            <th className="p-4">Date</th>
                                            <th className="p-4">Amount</th>
                                            <th className="rounded-r-xl p-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-black/5 dark:divide-dark-line">
                                        {bookings.map((b) => (
                                            <tr key={b._id} className="hover:bg-brand-light/60 dark:hover:bg-dark-surface-2">
                                                <td className="p-4 font-mono text-brand-purple">TXN-{b._id?.slice(-8).toUpperCase()}</td>
                                                <td className="p-4 text-gray-900 dark:text-dark-ink">{b.eventId?.title || 'Event'}</td>
                                                <td className="p-4">{new Date(b.bookedAt).toLocaleDateString()}</td>
                                                <td className="p-4 font-black">₹{b.amount || 0}</td>
                                                <td className="p-4">
                                                    <span className="rounded-full bg-brand-lime/30 px-2.5 py-1 font-black uppercase text-brand-lime-deep text-[9px]">Paid</span>
                                                </td>
                                            </tr>
                                        ))}
                                        {bookings.length === 0 && (
                                            <tr><td colSpan="5" className="p-8 text-center text-gray-400 dark:text-dark-muted">No invoices yet.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Profile & Settings */}
                    {(activeTab === 'profile' || activeTab === 'settings') && (
                        <div className="mt-6 max-w-xl rounded-[2rem] border border-black/5 bg-white p-6 shadow-soft sm:p-8 dark:border-dark-line dark:bg-dark-surface">
                            <h3 className="font-display text-xl uppercase">{activeTab === 'profile' ? 'Profile details' : 'Account settings'}</h3>
                            <div className="mt-5 space-y-4 text-xs font-extrabold">
                                <div className="space-y-1.5">
                                    <label className="block uppercase text-gray-400 dark:text-dark-muted">Full name</label>
                                    <input disabled value={user?.username} className="w-full rounded-2xl border border-black/10 bg-brand-light p-3.5 font-bold text-gray-900 dark:border-dark-line dark:bg-dark-surface-2 dark:text-dark-ink" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block uppercase text-gray-400 dark:text-dark-muted">Email address</label>
                                    <input disabled value={user?.email} className="w-full rounded-2xl border border-black/10 bg-brand-light p-3.5 font-bold text-gray-900 dark:border-dark-line dark:bg-dark-surface-2 dark:text-dark-ink" />
                                </div>
                                {activeTab === 'settings' && (
                                    <div className="rounded-2xl border border-brand-purple/20 bg-brand-purple/5 p-4 text-brand-purple">
                                        Password & notification preferences can be updated here soon.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Wishlist / Notifications placeholders */}
                    {(activeTab === 'wishlist' || activeTab === 'notifications') && (
                        <div className="mt-6 rounded-[2rem] border border-dashed border-black/10 bg-white p-14 text-center shadow-soft dark:border-dark-line dark:bg-dark-surface">
                            {activeTab === 'wishlist' ? <Heart className="mx-auto h-12 w-12 text-brand-pink" /> : <Bell className="mx-auto h-12 w-12 text-brand-purple" />}
                            <h3 className="font-display mt-4 text-2xl uppercase">
                                {activeTab === 'wishlist' ? 'Your wishlist is empty' : 'No notifications yet'}
                            </h3>
                            <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500 dark:text-dark-muted">
                                {activeTab === 'wishlist'
                                    ? 'Tap the bookmark icon on any event to save it here for later.'
                                    : 'Booking updates, reminders and festival news will show up here.'}
                            </p>
                            {activeTab === 'wishlist' && (
                                <TransitionLink to="/events" className="btn-gradient mt-6 inline-flex items-center gap-2 rounded-full px-7 py-3 text-xs font-extrabold uppercase tracking-wider text-white">
                                    Explore events <ArrowUpRight className="h-4 w-4" />
                                </TransitionLink>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {selectedBookingForQR && (
                <QRTicketModal
                    booking={selectedBookingForQR}
                    onClose={() => setSelectedBookingForQR(null)}
                />
            )}
        </div>
        </DirectionalTransition>
    );
};

export default UserDashboard;
