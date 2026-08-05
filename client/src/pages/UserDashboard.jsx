import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/authContext';
import api from '../utils/axios';
import { Link, useNavigate } from 'react-router-dom';
import QRTicketModal from '../components/QRTicketModal';
import { FaTicketAlt, FaTimesCircle, FaQrcode, FaCalendarAlt, FaWallet, FaUser, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { FaReceipt } from 'react-icons/fa6';
import { HiSparkles } from 'react-icons/hi2';

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBookingForQR, setSelectedBookingForQR] = useState(null);
    const [activeTab, setActiveTab] = useState('bookings');

    const fetchBookings = useCallback(async () => {
        try {
            const { data } = await api.get('/bookings/my');
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchBookings();
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
        return <div className="text-center py-28 font-bold text-gray-500">Loading user dashboard...</div>;
    }

    const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
    const pendingCount = bookings.filter(b => b.status === 'pending').length;
    const totalSpent = bookings.reduce((sum, b) => b.paymentStatus === 'paid' ? sum + (b.amount || 0) : sum, 0);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header User Profile Banner */}
            <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] border border-black/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                    <div className="w-20 h-20 rounded-2xl bg-[#8522FF] text-white flex items-center justify-center font-display font-black text-3xl uppercase shadow-lg">
                        {user?.username ? user.username.charAt(0) : 'U'}
                    </div>
                    <div className="space-y-1">
                        <span className="px-3 py-0.5 rounded-full bg-[#D2FF00] text-black font-extrabold text-[10px] uppercase">
                            ACTIVE MEMBER
                        </span>
                        <h1 className="font-display font-black text-2xl sm:text-3xl text-black uppercase">{user?.username}</h1>
                        <p className="text-xs font-bold text-gray-500">{user?.email}</p>
                    </div>
                </div>

                <Link
                    to="/events"
                    className="bg-[#0A0A0C] hover:bg-[#8522FF] text-white font-extrabold py-3 px-6 rounded-full text-xs uppercase tracking-wider transition-all shadow-sm"
                >
                    Explore Events
                </Link>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-black/10 space-y-1 shadow-sm">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">CONFIRMED PASSES</span>
                    <div className="flex items-baseline justify-between">
                        <span className="font-display font-black text-3xl text-black">{confirmedCount}</span>
                        <FaCheckCircle className="text-[#8522FF] text-xl" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-black/10 space-y-1 shadow-sm">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">PENDING APPROVAL</span>
                    <div className="flex items-baseline justify-between">
                        <span className="font-display font-black text-3xl text-black">{pendingCount}</span>
                        <FaExclamationTriangle className="text-amber-500 text-xl" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-black/10 space-y-1 shadow-sm">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">TOTAL INVESTMENT</span>
                    <div className="flex items-baseline justify-between">
                        <span className="font-display font-black text-3xl text-[#8522FF]">₹{totalSpent}</span>
                        <FaWallet className="text-[#8522FF] text-xl" />
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-2 border-b border-black/10 pb-4 overflow-x-auto no-scrollbar">
                {[
                    { id: 'bookings', name: 'My Ticket Passes', icon: FaTicketAlt },
                    { id: 'invoices', name: 'Billing & Invoices', icon: FaReceipt },
                    { id: 'profile', name: 'Account Settings', icon: FaUser }
                ].map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id)}
                        className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase shrink-0 transition-all flex items-center gap-2 ${activeTab === t.id ? 'bg-[#8522FF] text-white shadow-md' : 'bg-white text-gray-700 hover:text-black border border-black/10'}`}
                    >
                        <t.icon className="text-xs" /> {t.name}
                    </button>
                ))}
            </div>

            {/* Tab 1: Bookings List */}
            {activeTab === 'bookings' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="font-display font-black text-xl text-black uppercase">Event Registrations</h2>
                        <span className="text-xs font-bold text-gray-500">{bookings.length} total entries</span>
                    </div>

                    {bookings.length === 0 ? (
                        <div className="bg-white p-16 rounded-3xl text-center border border-black/10 space-y-4">
                            <h3 className="font-display font-black text-xl text-black uppercase">No Passes Found</h3>
                            <p className="text-gray-500 text-xs max-w-sm mx-auto">You haven't reserved tickets for any events yet. Explore upcoming showcases!</p>
                            <Link to="/events" className="inline-block bg-[#8522FF] text-white font-extrabold px-6 py-3 rounded-full text-xs uppercase">
                                Browse Events Now
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {bookings.map((booking) => {
                                const event = booking.eventId || {};
                                return (
                                    <div key={booking._id} className="bg-white rounded-3xl overflow-hidden border border-black/10 flex flex-col justify-between shadow-sm hover:border-[#8522FF] transition-all">
                                        <div className="p-6 space-y-4">
                                            <div className="flex items-start justify-between">
                                                <span className="text-[10px] font-black uppercase text-[#8522FF] px-2.5 py-1 rounded-full bg-purple-50">
                                                    {event.category || 'Pass'}
                                                </span>
                                                <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full uppercase ${booking.status === 'confirmed' ? 'bg-[#D2FF00] text-black' :
                                                    booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-amber-100 text-amber-800'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </div>

                                            <div>
                                                <h3 className="font-display font-black text-base text-black uppercase line-clamp-1">{event.title || 'Event Removed'}</h3>
                                                <p className="text-xs font-bold text-gray-500 mt-1 flex items-center gap-1">
                                                    <FaCalendarAlt className="text-[#8522FF]" />
                                                    {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </div>

                                            <div className="pt-3 border-t border-black/10 text-xs space-y-1 font-bold">
                                                <div className="flex justify-between text-gray-500">
                                                    <span>Amount:</span>
                                                    <span className="text-black">{booking.amount === 0 ? 'FREE' : `₹${booking.amount}`}</span>
                                                </div>
                                                <div className="flex justify-between text-gray-500">
                                                    <span>Pass Ref:</span>
                                                    <span className="font-mono text-[#8522FF]">#{booking._id?.slice(-8).toUpperCase()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-gray-50 border-t border-black/10 flex items-center justify-between gap-2">
                                            {booking.status !== 'cancelled' ? (
                                                <>
                                                    <button
                                                        onClick={() => setSelectedBookingForQR(booking)}
                                                        className="flex-1 bg-[#8522FF] text-white font-extrabold py-2 px-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 uppercase transition-all shadow-sm"
                                                    >
                                                        <FaQrcode /> View Digital QR
                                                    </button>

                                                    <button
                                                        onClick={() => cancelBooking(booking._id)}
                                                        className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-2xl text-xs transition-all"
                                                        title="Cancel Booking"
                                                    >
                                                        <FaTimesCircle />
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-xs font-bold text-gray-400 uppercase w-full text-center">Registration Cancelled</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Tab 2: Billing */}
            {activeTab === 'invoices' && (
                <div className="bg-white p-8 rounded-3xl border border-black/10 space-y-6">
                    <h2 className="font-display font-black text-xl text-black uppercase">Payment Receipts & Invoices</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-bold text-gray-700">
                            <thead className="bg-gray-100 text-gray-500 uppercase text-[10px]">
                                <tr>
                                    <th className="p-4">Transaction ID</th>
                                    <th className="p-4">Event</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5">
                                {bookings.map((b) => (
                                    <tr key={b._id} className="hover:bg-gray-50">
                                        <td className="p-4 font-mono text-[#8522FF]">TXN-{b._id?.slice(-8).toUpperCase()}</td>
                                        <td className="p-4 text-black">{b.eventId?.title || 'Event'}</td>
                                        <td className="p-4">{new Date(b.bookedAt).toLocaleDateString()}</td>
                                        <td className="p-4 font-black">₹{b.amount || 0}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 rounded bg-[#D2FF00] text-black font-black uppercase text-[9px]">PAID</span>
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
                <div className="bg-white p-8 rounded-3xl border border-black/10 max-w-xl space-y-6">
                    <h2 className="font-display font-black text-xl text-black uppercase">Profile Details</h2>
                    <div className="space-y-4 text-xs font-extrabold">
                        <div className="space-y-1">
                            <label className="text-gray-500 block uppercase">Full Name</label>
                            <input disabled value={user?.username} className="w-full bg-gray-50 border border-black/10 rounded-2xl p-3 text-black font-bold" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-gray-500 block uppercase">Email Address</label>
                            <input disabled value={user?.email} className="w-full bg-gray-50 border border-black/10 rounded-2xl p-3 text-black font-bold" />
                        </div>
                    </div>
                </div>
            )}

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