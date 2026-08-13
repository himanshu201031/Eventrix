import React from 'react';
import { motion } from 'framer-motion';
import { DirectionalTransition, TransitionLink } from '../components/Transitions';
import { XCircle, ArrowLeft, ArrowRight, Ticket } from 'lucide-react';

const PaymentFailed = () => {
    return (
        <DirectionalTransition>
        <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-28 pb-16">
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-black/5 bg-white p-10 text-center shadow-[0_40px_100px_-30px_rgba(13,13,17,0.35)] dark:border-dark-line dark:bg-dark-surface"
            >
                <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-red-200/40 blur-3xl" />
                <div className="absolute -left-14 -bottom-14 h-40 w-40 rounded-full bg-brand-orange/15 blur-3xl" />

                <div className="relative">
                    <motion.div
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 240, damping: 14, delay: 0.15 }}
                        className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-brand-orange text-white shadow-[0_20px_50px_-12px_rgba(255,90,31,0.45)]"
                    >
                        <XCircle className="h-12 w-12" />
                    </motion.div>

                    <h1 className="font-display mt-6 text-4xl uppercase tracking-tight">
                        Booking <span className="text-gradient-orange">failed</span>
                    </h1>
                    <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-dark-muted">
                        We couldn't process your payment. Please ensure your payment details are correct and try again.
                    </p>

                    <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-brand-orange/20 bg-brand-orange/5 py-3.5 text-xs font-black uppercase tracking-wider text-brand-orange">
                        <Ticket className="h-4 w-4" /> No amount has been deducted
                    </div>

                    <div className="mt-7 space-y-3">
                        <TransitionLink to="/" className="btn-gradient flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-xs font-extrabold uppercase tracking-wider text-white">
                            <ArrowLeft className="h-4 w-4" /> Return to events
                        </TransitionLink>
                        <TransitionLink to="/dashboard" className="block w-full rounded-2xl border border-black/10 py-4 text-xs font-extrabold uppercase tracking-wider text-gray-700 transition-all hover:border-brand-purple hover:text-brand-purple dark:border-dark-line dark:text-dark-muted dark:hover:border-brand-purple dark:hover:text-brand-purple">
                            Go to dashboard <ArrowRight className="ml-1 inline h-4 w-4" />
                        </TransitionLink>
                    </div>
                </div>
            </motion.div>
        </div>
        </DirectionalTransition>
    );
};

export default PaymentFailed;
