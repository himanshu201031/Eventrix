import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { CalendarDays, MapPin, Download, X, CheckCircle2, Sparkle } from 'lucide-react';
import { stopScroll, startScroll } from '../utils/smoothScroll';

const QRTicketModal = ({ booking, onClose }) => {
    useEffect(() => {
        stopScroll();
        return () => startScroll();
    }, []);

    if (!booking) return null;

    const event = booking.eventId || {};
    const bookingId = booking._id ? booking._id.slice(-8).toUpperCase() : 'EVTX-9982';

    // Simple SVG QR code matrix renderer (self-contained, decorative)
    const qrMatrix = [
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
        [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1]
    ];

    const handlePrint = () => {
        window.print();
    };

    return (
        <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent hideCloseButton className="max-w-md gap-0 overflow-hidden p-0">
                <DialogTitle className="sr-only">
                    {event.title || 'Eventrix Ticket'} — official pass
                </DialogTitle>

                <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-2xl dark:border-dark-line dark:bg-dark-surface">
                    {/* Header */}
                    <div className="relative bg-brand-purple p-6 text-center text-white">
                        <DialogClose asChild>
                            <button
                                aria-label="Close pass"
                                className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition-all hover:bg-white/35"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </DialogClose>
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                            <Sparkle className="h-3 w-3 text-brand-lime" fill="currentColor" /> Official pass
                        </div>
                        <h3 className="font-display relative mt-3 text-2xl uppercase leading-tight tracking-wide">
                            {event.title || 'Eventrix Ticket'}
                        </h3>
                        <p className="relative mt-1 font-mono text-[11px] font-bold text-white/85">Pass Ref: #{bookingId}</p>
                    </div>

                    {/* Body */}
                    <div className="space-y-5 p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-dark-ink">
                                <CalendarDays className="h-4 w-4 text-brand-purple" />
                                {event.date ? new Date(event.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'Upcoming'}
                            </div>
                            <div className="flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-dark-ink">
                                <MapPin className="h-4 w-4 text-brand-orange" />
                                <span className="max-w-[150px] truncate">{event.location || 'Main Hall'}</span>
                            </div>
                        </div>

                        {/* QR */}
                        <div className="rounded-2xl border-2 border-dashed border-brand-purple/30 bg-brand-light p-5 dark:bg-dark-surface-2">
                            <svg className="mx-auto h-44 w-44" viewBox="0 0 19 19">
                                {qrMatrix.map((row, rIdx) =>
                                    row.map((cell, cIdx) =>
                                        cell ? <rect key={`${rIdx}-${cIdx}`} x={cIdx} y={rIdx} width="1" height="1" fill="#0d0d11" /> : null
                                    )
                                )}
                            </svg>
                            <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-widest text-gray-500 dark:text-dark-muted">
                                Scan at venue entrance
                            </p>
                        </div>

                        {/* Status chips */}
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="rounded-2xl bg-brand-lime/20 px-4 py-3">
                                <span className="block text-[10px] font-black uppercase tracking-wider text-gray-500 dark:text-dark-muted">Status</span>
                                <span className="flex items-center gap-1 font-black text-brand-lime-deep">
                                    <CheckCircle2 className="h-3.5 w-3.5" /> {booking.status?.toUpperCase() || 'CONFIRMED'}
                                </span>
                            </div>
                            <div className="rounded-2xl bg-brand-purple/10 px-4 py-3">
                                <span className="block text-[10px] font-black uppercase tracking-wider text-gray-500 dark:text-dark-muted">Payment</span>
                                <span className="font-black text-brand-purple">
                                    {booking.paymentStatus === 'paid' ? 'PAID IN FULL' : 'PAY AT DOOR'}
                                </span>
                            </div>
                        </div>

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

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={handlePrint}
                                className="btn-gradient flex flex-1 items-center justify-center gap-2 rounded-2xl py-3.5 text-xs font-extrabold uppercase tracking-wider text-white"
                            >
                                <Download className="h-4 w-4" /> Download / save pass
                            </button>
                            <DialogClose asChild>
                                <button className="rounded-2xl border border-black/10 bg-white px-5 text-xs font-extrabold uppercase tracking-wider text-gray-700 transition-all hover:border-brand-purple hover:text-brand-purple dark:border-dark-line dark:bg-dark-surface dark:text-dark-muted">
                                    Close
                                </button>
                            </DialogClose>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default QRTicketModal;
