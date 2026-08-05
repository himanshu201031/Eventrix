import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { Link, useNavigate } from 'react-router-dom';
import QRTicketModal from '../components/QRTicketModal';
import { FaTicketAlt, FaTimesCircle, FaQrcode, FaCalendarAlt, FaWallet, FaRegHeart, FaUser, FaCheckCircle, FaExclamationTriangle, FaReceipt } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBookingForQR, setSelectedBookingForQR] = useState(null);
    const [activeTab, setActiveTab] = useState('bookings'); // 'bookings', 'wishlist', 'invoices', 'profile'

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchBookings();
    }, [user, navigate]);

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/bookings/my');
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings', error);
        } finally {
            setLoading(false);
        }
    };

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
            <div className="text-center py-28 space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin mx-auto"></div>
                <p className="text-gray-400 text-sm font-medium">Loading user dashboard...</p>
            </div>
        );
    }

    const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
    const pendingCount = bookings.filter(b => b.status === 'pending').length;
    const totalSpent = bookings.reduce((sum, b) => b.paymentStatus === 'paid' ? sum + (b.amount || 0) : sum, 0);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header User Profile Banner */}
            <div className="glass-card p-6 sm:p-10 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left z-10">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white text-3xl font-black uppercase shadow-lg shadow-purple-500/30">
                        {user?.username ? user.username.charAt(0) : 'U'}
                    </div>
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Active Member
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-white">{user?.username}</h1>
                        <p className="text-xs text-gray-400 font-medium">{user?.email}</p>
                    </div>
                </div>

                <div className="flex gap-3 z-10">
                    <Link
                        to="/events"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-2.5 px-5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-purple-500/25 flex items-center gap-2"
                    >
                        <HiSparkles /> Explore Events
                    </Link>
                </div>
            </div>

            {/* Quick Stats Grid (Linear Style) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-400 block">Confirmed VIP Passes</span>
                    <div className="flex items-baseline justify-between">
                        <span className="text-3xl font-black text-white">{confirmedCount}</span>
                        <FaCheckCircle className="text-emerald-400 text-lg" />
                    </div>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-400 block">Pending Gate Approval</span>
                    <div className="flex items-baseline justify-between">
                        <span className="text-3xl font-black text-white">{pendingCount}</span>
                        <FaExclamationTriangle className="text-amber-400 text-lg" />
                    </div>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-400 block">Total Investment</span>
                    <div className="flex items-baseline justify-between">
                        <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">₹{totalSpent}</span>
                        <FaWallet className="text-purple-400 text-lg" />
                    </div>
                </div>
            </div>

            {/* Linear Dashboard Tab Navigation */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto no-scrollbar">
                {[
                    { id: 'bookings', name: 'My Ticket Passes', icon: FaTicketAlt },
                    { id: 'invoices', name: 'Billing & Invoices', icon: FaReceipt },
                    { id: 'profile', name: 'Account Settings', icon: FaUser }
                ].map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id)}
                        className={`px-5 py-2.5 rounded-full text-xs font-bold shrink-0 transition-all flex items-center gap-2 ${activeTab === t.id ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'}`}
                    >
                        <t.icon className="text-xs" /> {t.name}
                    </button>
                ))}
            </div>

            {/* Tab 1: Bookings List */}
            {activeTab === 'bookings' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">Event Registrations</h2>
                        <span className="text-xs text-gray-400 font-semibold">{bookings.length} total entries</span>
                    </div>

                    {bookings.length === 0 ? (
                        <div className="glass-card p-16 rounded-3xl text-center border border-white/10 space-y-4">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-gray-500 text-2xl">
                                <FaTicketAlt />
                            </div>
                            <h3 className="text-xl font-bold text-white">No Event Passes Found</h3>
                            <p className="text-gray-400 text-xs max-w-sm mx-auto">You haven't reserved tickets for any events yet. Explore upcoming festivals and tech conferences today!</p>
                            <Link to="/events" className="inline-block bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all">
                                Browse Events Now
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {bookings.map((booking) => {
                                const event = booking.eventId || {};
                                return (
                                    <div key={booking._id} className="glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/30 transition-all flex flex-col justify-between">
                                        <div className="p-6 space-y-4">
                                            <div className="flex items-start justify-between">
                                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-400 px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30">
                                                    {event.category || 'Pass'}
                                                </span>
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                                        booking.status === 'cancelled' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                                                            'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                                        }`}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-bold text-white line-clamp-1">{event.title || 'Event Removed'}</h3>
                                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                                    <FaCalendarAlt className="text-purple-400" />
                                                    {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </div>

                                            <div className="pt-3 border-t border-white/10 text-xs space-y-1">
                                                <div className="flex justify-between text-gray-400">
                                                    <span>Amount Paid:</span>
                                                    <span className="font-bold text-white">{booking.amount === 0 ? 'FREE' : `₹${booking.amount}`}</span>
                                                </div>
                                                <div className="flex justify-between text-gray-400">
                                                    <span>Pass Ref ID:</span>
                                                    <span className="font-mono text-purple-300">#{booking._id?.slice(-8).toUpperCase()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card Footer Actions */}
                                        <div className="p-4 bg-white/5 border-t border-white/10 flex items-center justify-between gap-2">
                                            {booking.status !== 'cancelled' ? (
                                                <>
                                                    <button
                                                        onClick={() => setSelectedBookingForQR(booking)}
                                                        className="flex-1 bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all border border-purple-500/30"
                                                    >
                                                        <FaQrcode /> View Digital QR
                                                    </button>

                                                    <button
                                                        onClick={() => cancelBooking(booking._id)}
                                                        className="px-3 py-2 bg-red-500/10 hover:bg-red-500/30 text-red-400 font-bold rounded-xl text-xs transition-all border border-red-500/20"
                                                        title="Cancel Booking"
                                                    >
                                                        <FaTimesCircle />
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-xs text-gray-500 font-medium italic w-full text-center">Registration Cancelled</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Tab 2: Billing & Invoices */}
            {activeTab === 'invoices' && (
                <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-6">
                    <h2 className="text-xl font-bold text-white">Payment Receipts & Invoices</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-gray-300">
                            <thead className="bg-white/5 text-gray-400 uppercase font-bold text-[10px] border-b border-white/10">
                                <tr>
                                    <th className="p-4">Transaction ID</th>
                                    <th className="p-4">Event</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {bookings.map((b) => (
                                    <tr key={b._id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-mono text-purple-300">TXN-{b._id?.slice(-8).toUpperCase()}</td>
                                        <td className="p-4 font-bold text-white">{b.eventId?.title || 'Event'}</td>
                                        <td className="p-4">{new Date(b.bookedAt).toLocaleDateString()}</td>
                                        <td className="p-4 font-bold">₹{b.amount || 0}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase text-[9px]">PAID</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Tab 3: Account Profile */}
            {activeTab === 'profile' && (
                <div className="glass-card p-8 rounded-3xl border border-white/10 max-w-xl space-y-6">
                    <h2 className="text-xl font-bold text-white">Profile Details</h2>
                    <div className="space-y-4 text-xs font-semibold">
                        <div className="space-y-1">
                            <label className="text-gray-400 block">Full Name</label>
                            <input disabled value={user?.username} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-gray-400 block">Email Address</label>
                            <input disabled value={user?.email} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-gray-400 block">Account Role</label>
                            <input disabled value={user?.role?.toUpperCase()} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-purple-300 font-bold" />
                        </div>
                    </div>
                </div>
            )}

            {/* Interactive QR Ticket Modal Popup */}
            {selectedBookingForQR && (
                <QRTicketModal
                    booking={selectedBookingForQR}
                    onClose={() => setSelectedBookingForQR(null)}
                />
            )}
        </div>
    );
};

export default UserDashboard;