import React from 'react';
import { motion } from 'framer-motion';
import { DirectionalTransition, TransitionLink } from '../components/Transitions';
import { CheckCircle2, ArrowRight, Sparkle, Ticket } from 'lucide-react';

const PaymentSuccess = () => {
    return (
        <DirectionalTransition>
        <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-28 pb-16">
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-black/5 bg-white p-10 text-center shadow-[0_40px_100px_-30px_rgba(13,13,17,0.35)] dark:border-dark-line dark:bg-dark-surface"
            >
                <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-brand-lime/20 blur-3xl" />
                <div className="absolute -left-14 -bottom-14 h-40 w-40 rounded-full bg-brand-purple/15 blur-3xl" />

                <div className="relative">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.15 }}
                        className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-brand-lime text-brand-dark shadow-[0_20px_50px_-12px_rgba(166,255,0,0.5)]"
                    >
                        <CheckCircle2 className="h-12 w-12" />
                    </motion.div>

                    <div className="mt-2 flex justify-center gap-2">
                        {[0, 1, 2].map((i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, y: 0, scale: 0 }}
                                animate={{ opacity: [0, 1, 0], y: -60, scale: 1 }}
                                transition={{ duration: 1.4, delay: 0.5 + i * 0.2, repeat: Infinity, repeatDelay: 1.6 }}
                                className="absolute text-brand-purple"
                            >
                                <Sparkle className="h-5 w-5" fill="currentColor" />
                            </motion.span>
                        ))}
                    </div>

                    <h1 className="font-display mt-6 text-4xl uppercase tracking-tight">
                        Booking <span className="text-gradient-lime">confirmed!</span>
                    </h1>
                    <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-dark-muted">
                        Your ticket has been booked successfully. A confirmation email with your digital QR pass has been sent to your registered address.
                    </p>

                    <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-brand-purple/20 bg-brand-purple/5 py-3.5 text-xs font-black uppercase tracking-wider text-brand-purple">
                        <Ticket className="h-4 w-4" /> Check your dashboard for the QR pass
                    </div>

                    <div className="mt-7 space-y-3">
                        <TransitionLink to="/dashboard" className="btn-gradient flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-xs font-extrabold uppercase tracking-wider text-white">
                            View my tickets <ArrowRight className="h-4 w-4" />
                        </TransitionLink>
                        <TransitionLink to="/" className="block w-full rounded-2xl border border-black/10 py-4 text-xs font-extrabold uppercase tracking-wider text-gray-700 transition-all hover:border-brand-purple hover:text-brand-purple dark:border-dark-line dark:text-dark-muted dark:hover:border-brand-purple dark:hover:text-brand-purple">
                            Discover more events
                        </TransitionLink>
                    </div>
                </div>
            </motion.div>
        </div>
        </DirectionalTransition>
    );
};

export default PaymentSuccess;
