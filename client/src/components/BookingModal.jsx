import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/auth';
import api from '../utils/axios';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { stopScroll, startScroll } from '../utils/smoothScroll';
import { Ticket, Check, X, ShieldCheck, CreditCard, Lock, ChevronRight, ChevronLeft } from 'lucide-react';
import ConfettiSideCannons from './Confetti';
import TicketDrop from './TicketDrop';

const TIER_NAMES = {
    general: 'General Access Pass',
    vip: 'VIP Front-Row Experience',
    early: 'Early Bird Pass',
};

const BookingModal = ({ event, onClose, onSuccess }) => {
    const { user } = useContext(AuthContext);
    const [step, setStep] = useState(1);
    /* Increments per completed booking so the success confetti replays */
    const [celebrationId, setCelebrationId] = useState(0);
    const [ticketTier, setTicketTier] = useState('general');
    const [quantity, setQuantity] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    /* Pass reference captured from the booking response — the Ticket Drop
       stamps it onto the pass header. */
    const [passRef, setPassRef] = useState('');

    useEffect(() => {
        stopScroll();
        return () => startScroll();
    }, []);

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
            setStep(5);
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
            const res = await api.post('/bookings', {
                eventId: event._id,
                otp,
                amount: totalAmount,
                quantity,
                ticketTier
            });
            const bookingId = res?.data?.booking?._id || res?.data?._id || '';
            if (bookingId) setPassRef(`EVTX-${String(bookingId).slice(-8).toUpperCase()}`);
            setStep(6);
            setCelebrationId((n) => n + 1);
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Booking verification failed.');
        } finally {
            setLoading(false);
        }
    };

    const selectedClass = 'border-brand-purple bg-brand-purple/10 dark:bg-brand-purple/20';
    const idleClass = 'border-black/10 bg-brand-light hover:border-black/20 dark:border-dark-line dark:bg-dark-surface-2 dark:hover:border-white/30';

    return (
        <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent hideCloseButton className="max-w-xl gap-0 overflow-hidden p-0">
                <DialogTitle className="sr-only">
                    {event.title} - booking checkout
                </DialogTitle>

                <div className="flex max-h-[90vh] w-full flex-col overflow-hidden rounded-[2rem] border border-black/10 bg-white text-brand-dark shadow-2xl dark:border-dark-line dark:bg-dark-surface dark:text-dark-ink">
                    {/* Header */}
                    <div className="relative bg-brand-purple p-6 text-white">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20">
                                    <Ticket className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/75">
                                        Step {step} of 6 · Checkout
                                    </span>
                                    <h3 className="line-clamp-1 text-lg font-extrabold">{event.title}</h3>
                                </div>
                            </div>
                            <DialogClose asChild>
                                <button
                                    aria-label="Close booking"
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition-all hover:bg-white/30"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </DialogClose>
                        </div>

                        {/* Progress dots */}
                        <div className="mt-4 flex gap-1.5">
                            {[1, 2, 3, 4, 5, 6].map((s) => (
                                <div
                                    key={s}
                                    className={`h-1 flex-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-white' : 'bg-white/25'}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Body */}
                    <div data-lenis-prevent className="flex-grow space-y-6 overflow-y-auto p-6">
                        {error && (
                            <div className="flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-600">
                                <span>{error}</span>
                                <button onClick={() => setError('')} className="ml-2 font-black text-red-500 hover:text-red-700">✕</button>
                            </div>
                        )}

                        {/* Step 1: Ticket tier */}
                        {step === 1 && (
                            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                <h4 className="text-sm font-black uppercase tracking-wider text-gray-500 dark:text-dark-muted">1 · Select ticket experience</h4>
                                <div className="space-y-3">
                                    {[
                                        { id: 'general', title: 'General Access Pass', desc: 'Full event entry, access to main stage & standard seating', price: unitPrice, badge: 'Standard' },
                                        { id: 'vip', title: 'VIP Front-Row Experience', desc: 'Express VIP lane, exclusive lounge access, complimentary refreshments & merch', price: Math.round(basePrice * 1.5), badge: 'Best perks' },
                                        { id: 'early', title: 'Early Bird Pass', desc: 'Limited discounted pass for early registrants', price: Math.round(basePrice * 0.85), badge: 'Saver' },
                                    ].map((tier) => (
                                        <div
                                            key={tier.id}
                                            onClick={() => setTicketTier(tier.id)}
                                            className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${ticketTier === tier.id ? selectedClass : idleClass}`}
                                        >
                                            <div className="space-y-1 pr-4">
                                                <div className="flex items-center gap-2">
                                                    <h5 className="text-base font-bold text-brand-dark dark:text-dark-ink">{tier.title}</h5>
                                                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${ticketTier === tier.id ? 'bg-brand-purple text-white' : 'bg-brand-gray-400/20 text-gray-600 dark:bg-white/10 dark:text-dark-muted'}`}>
                                                        {tier.badge}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-dark-muted">{tier.desc}</p>
                                            </div>
                                            <div className="shrink-0 text-right">
                                                <span className="text-lg font-black text-brand-dark dark:text-dark-ink">{tier.price === 0 ? 'FREE' : `₹${tier.price}`}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Quantity */}
                        {step === 2 && (
                            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                <h4 className="text-sm font-black uppercase tracking-wider text-gray-500 dark:text-dark-muted">2 · Select quantity & seats</h4>
                                <div className="flex items-center justify-between rounded-2xl border border-black/10 bg-brand-light p-6 dark:border-dark-line dark:bg-dark-surface-2">
                                    <div>
                                        <h5 className="text-lg font-bold text-brand-dark dark:text-dark-ink">Number of tickets</h5>
                                        <p className="text-xs text-gray-500 dark:text-dark-muted">Max 5 tickets per account</p>
                                    </div>
                                    <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white p-2 dark:border-dark-line dark:bg-dark-surface">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            aria-label="Decrease tickets"
                                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light text-lg font-bold transition-all hover:bg-brand-purple hover:text-white dark:bg-dark-surface-2"
                                        >
                                            −
                                        </button>
                                        <span className="w-6 text-center text-xl font-black text-brand-dark dark:text-dark-ink">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(5, quantity + 1))}
                                            aria-label="Increase tickets"
                                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light text-lg font-bold transition-all hover:bg-brand-purple hover:text-white dark:bg-dark-surface-2"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Summary */}
                        {step === 3 && (
                            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                <h4 className="text-sm font-black uppercase tracking-wider text-gray-500 dark:text-dark-muted">3 · Review order summary</h4>
                                <div className="space-y-4 rounded-2xl border border-black/10 bg-brand-light p-6 dark:border-dark-line dark:bg-dark-surface-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 dark:text-dark-muted">Tier ticket ({quantity}x {ticketTier.toUpperCase()})</span>
                                        <span className="font-bold text-brand-dark dark:text-dark-ink">₹{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 dark:text-dark-muted">Service fee & tech tax</span>
                                        <span className="font-bold text-brand-dark dark:text-dark-ink">₹{bookingFee}</span>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-black/10 pt-4 dark:border-dark-line">
                                        <span className="text-base font-bold text-brand-dark dark:text-dark-ink">Total amount</span>
                                        <span className="text-2xl font-black text-brand-purple">₹{totalAmount}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4: Payment */}
                        {step === 4 && (
                            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                                <h4 className="text-sm font-black uppercase tracking-wider text-gray-500 dark:text-dark-muted">4 · Select payment option</h4>
                                <div className="space-y-3">
                                    {[
                                        { id: 'card', name: 'Credit / Debit Card', icon: CreditCard },
                                        { id: 'upi', name: 'Instant UPI / GPay / PhonePe', icon: ShieldCheck },
                                        { id: 'demo', name: 'Express Instant Checkout', icon: Lock },
                                    ].map((pm) => (
                                        <div
                                            key={pm.id}
                                            onClick={() => setPaymentMethod(pm.id)}
                                            className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${paymentMethod === pm.id ? selectedClass : idleClass}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <pm.icon className={`text-lg ${paymentMethod === pm.id ? 'text-brand-purple' : 'text-gray-500 dark:text-dark-muted'}`} />
                                                <span className="text-sm font-bold text-brand-dark dark:text-dark-ink">{pm.name}</span>
                                            </div>
                                            {paymentMethod === pm.id && <Check className="h-4 w-4 text-brand-lime-deep" />}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 5: OTP */}
                        {step === 5 && (
                            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4 py-4 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-purple/10 border-2 border-brand-purple/30">
                                    <ShieldCheck className="h-7 w-7 text-brand-purple" />
                                </div>
                                <h4 className="text-xl font-black text-brand-dark dark:text-dark-ink">Enter OTP verification code</h4>
                                <p className="mx-auto max-w-sm text-xs text-gray-500 dark:text-dark-muted">
                                    A 6-digit one-time pass code has been sent to your registered account email ({user?.email || 'your email'}).
                                </p>
                                <input
                                    type="text"
                                    maxLength="6"
                                    placeholder="000000"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="mx-auto w-full max-w-xs rounded-2xl border-2 border-brand-purple/40 bg-brand-light py-3 text-center font-mono text-2xl font-black tracking-[0.5em] text-brand-dark outline-none transition-colors focus:border-brand-purple dark:bg-dark-surface-2 dark:text-dark-ink"
                                />
                            </motion.div>
                        )}

                        {/* Step 6: Success — the signature Ticket Drop: the event
                            card transforms into the pass, the QR gets scanned,
                            and the "YOU'RE GOING" seal pops on. Confetti (keyed
                            so every new booking replays the burst) fires above. */}
                        {step === 6 && (
                            <>
                            <ConfettiSideCannons key={celebrationId} />
                            <TicketDrop
                                event={event}
                                tierLabel={TIER_NAMES[ticketTier] || TIER_NAMES.general}
                                quantity={quantity}
                                total={totalAmount}
                                passRef={passRef}
                            />
                            <p className="text-center text-xs leading-relaxed text-gray-500 dark:text-dark-muted">
                                Your <strong className="text-brand-dark dark:text-dark-ink">{event.title}</strong> pass is confirmed. It's in your dashboard, gate-ready.
                            </p>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-black/10 bg-brand-light p-6 dark:border-dark-line dark:bg-dark-surface-2">
                        {step > 1 && step < 6 ? (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="flex items-center gap-1 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-xs font-bold text-gray-600 transition-all hover:border-brand-purple hover:text-brand-purple dark:border-dark-line dark:bg-dark-surface dark:text-dark-muted"
                            >
                                <ChevronLeft className="h-4 w-4" /> Back
                            </button>
                        ) : <div />}

                        {step === 1 && (
                            <button onClick={() => setStep(2)} className="btn-gradient ml-auto flex items-center gap-2 rounded-xl px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white">
                                Next: select seats <ChevronRight className="h-4 w-4" />
                            </button>
                        )}
                        {step === 2 && (
                            <button onClick={() => setStep(3)} className="btn-gradient ml-auto flex items-center gap-2 rounded-xl px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white">
                                Next: review order <ChevronRight className="h-4 w-4" />
                            </button>
                        )}
                        {step === 3 && (
                            <button onClick={() => setStep(4)} className="btn-gradient ml-auto flex items-center gap-2 rounded-xl px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white">
                                Next: payment method <ChevronRight className="h-4 w-4" />
                            </button>
                        )}
                        {step === 4 && (
                            <button
                                onClick={handleSendOTP}
                                disabled={loading}
                                className="btn-gradient ml-auto flex items-center gap-2 rounded-xl px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white disabled:opacity-60"
                            >
                                {loading ? 'Sending OTP...' : 'Send OTP verification'} <ChevronRight className="h-4 w-4" />
                            </button>
                        )}
                        {step === 5 && (
                            <button
                                onClick={handleConfirmBooking}
                                disabled={loading || !otp}
                                className="btn-gradient-lime ml-auto flex items-center gap-2 rounded-xl px-6 py-3 text-xs font-extrabold uppercase tracking-wider disabled:opacity-50"
                            >
                                {loading ? 'Verifying...' : 'Verify OTP & confirm'} <Check className="h-4 w-4" />
                            </button>
                        )}
                        {step === 6 && (
                            <DialogClose asChild>
                                <button className="btn-gradient w-full rounded-xl py-3 text-xs font-extrabold uppercase tracking-wider text-white">
                                    Close & view dashboard
                                </button>
                            </DialogClose>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BookingModal;
