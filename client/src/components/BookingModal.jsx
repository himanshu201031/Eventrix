import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import api from '../utils/axios';
import { FaTicketAlt, FaCheck, FaTimes, FaShieldAlt, FaCreditCard, FaLock, FaCheckCircle } from 'react-icons/fa';
import { HiSparkles, HiChevronRight, HiChevronLeft } from 'react-icons/hi2';

const BookingModal = ({ event, onClose, onSuccess }) => {
    const { user } = useContext(AuthContext);
    const [step, setStep] = useState(1);
    const [ticketTier, setTicketTier] = useState('general');
    const [quantity, setQuantity] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!event) return null;

    const basePrice = event.ticketPrice || 0;
    const tierMultiplier = ticketTier === 'vip' ? 1.5 : ticketTier === 'early' ? 0.85 : 1;
    const unitPrice = Math.round(basePrice * tierMultiplier);
    const subtotal = unitPrice * quantity;
    const bookingFee = basePrice === 0 ? 0 : Math.round(subtotal * 0.05);
    const totalAmount = subtotal + bookingFee;

    const handleSendOTP = async () => {
        setLoading(true);
        setError('');
        try {
            await api.post('/bookings/send-otp');
            setStep(5); // Move to OTP step
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmBooking = async () => {
        if (!otp || otp.length < 4) {
            setError('Please enter a valid OTP code.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await api.post('/bookings', {
                eventId: event._id,
                otp,
                amount: totalAmount,
                quantity,
                ticketTier
            });
            setStep(6); // Success step
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Booking verification failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-xl bg-[#0e131f] rounded-3xl border border-white/10 shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#07090e]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                            <FaTicketAlt />
                        </div>
                        <div>
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-400 block">Step {step} of 6</span>
                            <h3 className="text-lg font-bold text-white line-clamp-1">{event.title}</h3>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Body Content based on Step */}
                <div className="p-6 overflow-y-auto space-y-6 flex-grow">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-xl text-xs flex items-center justify-between">
                            <span>{error}</span>
                            <button onClick={() => setError('')} className="text-red-400 font-bold ml-2">✕</button>
                        </div>
                    )}

                    {/* Step 1: Select Ticket Tier */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">1. Select Ticket Experience</h4>
                            <div className="space-y-3">
                                {[
                                    { id: 'general', title: 'General Access Pass', desc: 'Full event entry, access to main stage & standard seating', price: unitPrice, badge: 'Standard' },
                                    { id: 'vip', title: 'VIP Front-Row Experience', desc: 'Express VIP lane, exclusive lounge access, complimentary refreshments & merch', price: Math.round(basePrice * 1.5), badge: 'Best Perks' },
                                    { id: 'early', title: 'Early Bird Pass', desc: 'Limited discounted pass for early registrants', price: Math.round(basePrice * 0.85), badge: 'Saver' },
                                ].map(tier => (
                                    <div
                                        key={tier.id}
                                        onClick={() => setTicketTier(tier.id)}
                                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${ticketTier === tier.id ? 'bg-purple-900/30 border-purple-500 glow-purple' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                                    >
                                        <div className="space-y-1 pr-4">
                                            <div className="flex items-center gap-2">
                                                <h5 className="font-bold text-white text-base">{tier.title}</h5>
                                                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">{tier.badge}</span>
                                            </div>
                                            <p className="text-xs text-gray-400">{tier.desc}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className="text-lg font-black text-white">{tier.price === 0 ? 'FREE' : `₹${tier.price}`}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Seats / Quantity */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">2. Select Quantity & Seats</h4>
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex items-center justify-between">
                                <div>
                                    <h5 className="font-bold text-white text-lg">Number of Tickets</h5>
                                    <p className="text-xs text-gray-400">Max 5 tickets per account</p>
                                </div>
                                <div className="flex items-center gap-4 bg-white/10 p-2 rounded-xl border border-white/10">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold text-lg transition-all"
                                    >
                                        -
                                    </button>
                                    <span className="text-xl font-black px-2">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(5, quantity + 1))}
                                        className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold text-lg transition-all"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Order Summary */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">3. Review Order Summary</h4>
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Tier Ticket ({quantity}x {ticketTier.toUpperCase()})</span>
                                    <span className="font-bold text-white">₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Service Fee & Tech Tax</span>
                                    <span className="font-bold text-white">₹{bookingFee}</span>
                                </div>
                                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                    <span className="font-bold text-white text-base">Total Amount</span>
                                    <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">₹{totalAmount}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Payment Method */}
                    {step === 4 && (
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400">4. Select Payment Option</h4>
                            <div className="space-y-3">
                                {[
                                    { id: 'card', name: 'Credit / Debit Card', icon: FaCreditCard },
                                    { id: 'upi', name: 'Instant UPI / GPay / PhonePe', icon: FaShieldAlt },
                                    { id: 'demo', name: 'Express Instant Checkout', icon: FaLock },
                                ].map(pm => (
                                    <div
                                        key={pm.id}
                                        onClick={() => setPaymentMethod(pm.id)}
                                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${paymentMethod === pm.id ? 'bg-purple-900/30 border-purple-500 glow-purple' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <pm.icon className="text-purple-400 text-lg" />
                                            <span className="font-bold text-white text-sm">{pm.name}</span>
                                        </div>
                                        {paymentMethod === pm.id && <FaCheck className="text-purple-400" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 5: OTP Verification */}
                    {step === 5 && (
                        <div className="space-y-4 text-center py-4">
                            <div className="w-16 h-16 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center text-2xl mx-auto border border-purple-500/30">
                                <FaShieldAlt />
                            </div>
                            <h4 className="text-xl font-bold text-white">Enter OTP Verification Code</h4>
                            <p className="text-xs text-gray-400 max-w-sm mx-auto">
                                A 6-digit one-time pass code has been sent to your registered account email ({user?.email || 'your email'}).
                            </p>
                            <input
                                type="text"
                                maxLength="6"
                                placeholder="000000"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full max-w-xs mx-auto text-center font-mono font-black text-2xl tracking-[0.5em] bg-white/5 border border-purple-500/40 rounded-2xl py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                    )}

                    {/* Step 6: Success */}
                    {step === 6 && (
                        <div className="space-y-4 text-center py-6">
                            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-4xl mx-auto border border-emerald-500/30 animate-bounce">
                                <FaCheckCircle />
                            </div>
                            <h4 className="text-2xl font-black text-white">Booking Requested!</h4>
                            <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                                Your ticket reservation for <strong className="text-white">{event.title}</strong> has been submitted! Check your dashboard for instant pass updates.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="p-6 border-t border-white/10 bg-[#07090e] flex items-center justify-between">
                    {step > 1 && step < 6 ? (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs flex items-center gap-1 transition-all"
                        >
                            <HiChevronLeft /> Back
                        </button>
                    ) : <div></div>}

                    {step === 1 && (
                        <button
                            onClick={() => setStep(2)}
                            className="ml-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-purple-500/25"
                        >
                            <span>Next: Select Seats</span> <HiChevronRight />
                        </button>
                    )}

                    {step === 2 && (
                        <button
                            onClick={() => setStep(3)}
                            className="ml-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-purple-500/25"
                        >
                            <span>Next: Review Order</span> <HiChevronRight />
                        </button>
                    )}

                    {step === 3 && (
                        <button
                            onClick={() => setStep(4)}
                            className="ml-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-purple-500/25"
                        >
                            <span>Next: Payment Method</span> <HiChevronRight />
                        </button>
                    )}

                    {step === 4 && (
                        <button
                            onClick={handleSendOTP}
                            disabled={loading}
                            className="ml-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-purple-500/25"
                        >
                            {loading ? 'Sending OTP...' : 'Send OTP Verification'} <HiChevronRight />
                        </button>
                    )}

                    {step === 5 && (
                        <button
                            onClick={handleConfirmBooking}
                            disabled={loading || !otp}
                            className="ml-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/25 disabled:opacity-50"
                        >
                            {loading ? 'Verifying...' : 'Verify OTP & Confirm'} <FaCheck />
                        </button>
                    )}

                    {step === 6 && (
                        <button
                            onClick={onClose}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg"
                        >
                            Close & View Dashboard
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
