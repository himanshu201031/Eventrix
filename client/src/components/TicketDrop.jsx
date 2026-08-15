import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, CalendarDays, MapPin, Sparkle, Ticket } from 'lucide-react';

/* Self-contained decorative QR glyph — the "scan me" beat of the drop.
   Same matrix family as the dashboard pass modal. */
const QR_MATRIX = [
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
    [0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0],
    [1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0],
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1],
];

const FALLBACK_IMG =
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop';

/* The ticket face — shared by the choreographed and the reduced-motion
   render so the final pass looks identical either way. `qrScan` adds the
   expand + scan-sweep beat; reduced motion renders the pass complete. */
const PassFace = ({ ev, dateLabel, tierLabel, quantity, total, ref, qrScan }) => {
    const qr = qrScan
        ? {
              initial: { scaleY: 0.06, opacity: 0 },
              animate: { scaleY: 1, opacity: 1 },
              transition: { delay: 1.95, duration: 0.55, ease: 'easeOut' },
              style: { transformOrigin: 'top' },
          }
        : { initial: false, animate: { opacity: 1 }, transition: { duration: 0 } };

    return (
        <div className="relative overflow-hidden rounded-[1.75rem] border border-black/10 bg-white text-left shadow-[0_30px_80px_-30px_rgba(13,13,17,0.55)] dark:border-dark-line dark:bg-dark-surface">
            {/* Purple header */}
            <div className="relative bg-brand-purple p-6 text-white">
                <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
                        <Sparkle className="h-3 w-3 text-brand-lime" fill="currentColor" /> Official pass
                    </span>
                    <span className="font-mono text-[10px] font-bold text-white/80">#{ref}</span>
                </div>
                <h4 className="font-display mt-3 text-2xl uppercase leading-tight tracking-wide">
                    {ev.title || 'Eventrix Pass'}
                </h4>
            </div>

            {/* Body */}
            <div className="space-y-4 p-6 pt-5">
                <div className="flex items-center justify-between gap-3 text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-gray-700 dark:text-dark-ink">
                        <CalendarDays className="h-4 w-4 shrink-0 text-brand-purple" /> {dateLabel}
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-700 dark:text-dark-ink">
                        <MapPin className="h-4 w-4 shrink-0 text-brand-orange" />
                        <span className="max-w-[140px] truncate">{ev.location || 'Main Hall'}</span>
                    </span>
                </div>

                {/* Tier / Qty / Total */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded-xl bg-brand-light p-3 dark:bg-dark-surface-2">
                        <span className="block text-[9px] font-black uppercase tracking-wider text-gray-400 dark:text-dark-muted">Tier</span>
                        <span className="mt-0.5 block font-black leading-tight text-brand-dark dark:text-dark-ink">{tierLabel}</span>
                    </div>
                    <div className="rounded-xl bg-brand-light p-3 dark:bg-dark-surface-2">
                        <span className="block text-[9px] font-black uppercase tracking-wider text-gray-400 dark:text-dark-muted">Qty</span>
                        <span className="mt-0.5 block font-black text-brand-dark dark:text-dark-ink">{quantity}</span>
                    </div>
                    <div className="rounded-xl bg-brand-lime/20 p-3">
                        <span className="block text-[9px] font-black uppercase tracking-wider text-gray-500 dark:text-dark-muted">Total</span>
                        <span className="mt-0.5 block font-black text-brand-lime-deep">{total === 0 ? 'FREE' : `₹${total.toLocaleString('en-IN')}`}</span>
                    </div>
                </div>

                {/* QR — expands from a sliver, then a lime sweep scans it */}
                <motion.div {...qr} className="relative rounded-2xl border-2 border-dashed border-brand-purple/30 bg-brand-light p-5 dark:bg-dark-surface-2">
                    <svg className="mx-auto h-40 w-40" viewBox="0 0 19 19" aria-hidden="true">
                        {QR_MATRIX.map((row, rIdx) =>
                            row.map((cell, cIdx) =>
                                cell ? <rect key={`${rIdx}-${cIdx}`} x={cIdx} y={rIdx} width="1" height="1" fill="#0d0d11" /> : null
                            )
                        )}
                    </svg>
                    <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-widest text-gray-500 dark:text-dark-muted">
                        Scan at venue entrance
                    </p>
                    {qrScan && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 1, 0], y: [8, 150, 150, 8] }}
                            transition={{ delay: 2.25, duration: 1.05, times: [0, 0.25, 0.75, 1], ease: 'easeInOut' }}
                            className="pointer-events-none absolute inset-x-8 top-2 h-10 rounded-full bg-gradient-to-b from-brand-lime/0 via-brand-lime/45 to-brand-lime/0"
                        />
                    )}
                </motion.div>

                {/* Stub */}
                <div className="relative flex items-center justify-between rounded-2xl border border-black/10 bg-brand-light p-4 dark:border-dark-line dark:bg-dark-surface-2">
                    <div className="space-y-0.5 pr-6">
                        <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-dark-muted">Gate</span>
                        <span className="font-mono text-lg font-black text-brand-dark dark:text-dark-ink">02</span>
                    </div>
                    <div className="space-y-0.5 border-x border-dashed border-black/20 px-6 text-center dark:border-white/20">
                        <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-dark-muted">Row</span>
                        <span className="font-mono text-lg font-black text-brand-dark dark:text-dark-ink">A</span>
                    </div>
                    <div className="space-y-0.5 pl-6">
                        <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-dark-muted">Seat</span>
                        <span className="font-mono text-lg font-black text-brand-dark dark:text-dark-ink">25</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * TicketDrop — Eventrix's signature booking moment.
 *
 * The event card drops in, lingers, then peels away into the digital pass:
 * the QR code expands and gets scanned, and a lime "YOU'RE GOING" seal pops
 * onto the pass. Everything is declarative framer-motion (no timeouts, no
 * state), the full final state is in the DOM from the first frame — so the
 * sequence is deterministic, testable and reduced-motion-safe.
 */
const TicketDrop = ({ event = {}, tierLabel = 'General Access Pass', quantity = 1, total = 0, passRef }) => {
    const reduce = useReducedMotion();
    const ev = event || {};
    const dateLabel = ev.date
        ? new Date(ev.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
        : 'Upcoming';
    const ref = passRef || `EVTX-${String(ev._id || 'EVENTRIX').slice(-8).toUpperCase()}`;

    /* Reduced motion: the pass (with QR) appears immediately, no choreography. */
    if (reduce) {
        return (
            <div className="relative mx-auto w-full max-w-sm">
                <PassFace
                    ev={ev}
                    dateLabel={dateLabel}
                    tierLabel={tierLabel}
                    quantity={quantity}
                    total={total}
                    ref={ref}
                    qrScan={false}
                />
            </div>
        );
    }

    return (
        <div className="relative mx-auto w-full max-w-sm pb-9">
            {/* Beats 1–2: the event card drops in, lingers, then peels away —
                making room for the pass underneath. */}
            <motion.div
                initial={{ y: -46, rotate: 7, opacity: 0, scale: 1 }}
                animate={{
                    y: [-46, 0, 0, -30],
                    rotate: [7, 0, 0, 5],
                    opacity: [0, 1, 1, 0],
                    scale: [1, 1, 1, 0.94],
                }}
                transition={{ duration: 2.4, times: [0, 0.3, 0.42, 0.68], ease: ['easeOut', 'easeIn', 'easeIn'] }}
                className="absolute inset-0 z-20 flex flex-col overflow-hidden rounded-[1.75rem] border border-black/10 bg-white shadow-[0_30px_80px_-30px_rgba(13,13,17,0.55)] dark:border-dark-line dark:bg-dark-surface"
                aria-hidden="true"
            >
                <img src={ev.image || FALLBACK_IMG} alt="" draggable={false} className="h-44 w-full shrink-0 object-cover" />
                <div className="flex flex-1 flex-col p-6">
                    <span className="eyebrow flex items-center gap-1.5 text-brand-purple">
                        <Ticket className="h-3.5 w-3.5" /> Booking pass
                    </span>
                    <h5 className="font-display mt-2 text-2xl uppercase leading-tight">
                        {ev.title || 'Your next night'}
                    </h5>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                        <span className="text-xs font-bold text-gray-500 dark:text-dark-muted">
                            {quantity}× {tierLabel}
                        </span>
                        <span className="font-display text-lg text-brand-dark dark:text-dark-ink">
                            {total === 0 ? 'FREE' : `₹${total.toLocaleString('en-IN')}`}
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Beat 3: the pass materialises under the peeling card */}
            <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1.1, duration: 0.5, ease: 'easeOut' }}
            >
                <PassFace
                    ev={ev}
                    dateLabel={dateLabel}
                    tierLabel={tierLabel}
                    quantity={quantity}
                    total={total}
                    ref={ref}
                    qrScan
                />
            </motion.div>

            {/* Beat 4: the seal — "YOU'RE GOING" springs onto the pass */}
            <motion.div
                initial={{ scale: 0, rotate: -12, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ delay: 2.75, type: 'spring', stiffness: 320, damping: 15 }}
                className="absolute -bottom-2 left-1/2 z-30"
                style={{ x: '-50%' }}
                aria-hidden="true"
            >
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-lime px-6 py-3 font-display text-sm uppercase tracking-wider text-brand-dark shadow-[0_16px_40px_-12px_rgba(166,255,0,0.65)]">
                    <Check className="h-4 w-4" strokeWidth={3} /> You're going
                </span>
            </motion.div>
        </div>
    );
};

export default TicketDrop;
