import React from 'react';
import { FaTicketAlt, FaCalendarAlt, FaMapMarkerAlt, FaDownload, FaTimes, FaQrcode, FaCheckCircle } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';

const QRTicketModal = ({ booking, onClose }) => {
    if (!booking) return null;

    const event = booking.eventId || {};
    const bookingId = booking._id ? booking._id.slice(-8).toUpperCase() : 'EVTX-9982';

    // Simple SVG QR code matrix renderer for self-contained, clean UI
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-md bg-[#0f172a] rounded-3xl border border-purple-500/30 shadow-2xl overflow-hidden text-white">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-purple-900 via-purple-700 to-pink-600 p-6 text-center relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/50 transition-all"
                    >
                        <FaTimes />
                    </button>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-extrabold uppercase tracking-widest text-white mb-2">
                        <HiSparkles className="text-yellow-300" /> Official VIP Pass
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tight">{event.title || 'Eventrix Ticket'}</h3>
                    <p className="text-purple-200 text-xs mt-1 font-medium">Pass Ref: #{bookingId}</p>
                </div>

                {/* Ticket Details Body */}
                <div className="p-6 space-y-6">
                    {/* QR Code Container */}
                    <div className="bg-white p-6 rounded-2xl flex flex-col items-center justify-center shadow-inner border border-purple-200">
                        <svg className="w-48 h-48" viewBox="0 0 19 19">
                            {qrMatrix.map((row, rIdx) =>
                                row.map((cell, cIdx) =>
                                    cell ? <rect key={`${rIdx}-${cIdx}`} x={cIdx} y={rIdx} width="1" height="1" fill="#0f172a" /> : null
                                )
                            )}
                        </svg>
                        <p className="text-gray-500 text-[10px] font-mono tracking-widest uppercase mt-3">Scan at venue entrance</p>
                    </div>

                    {/* Booking Attributes */}
                    <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 text-xs">
                        <div>
                            <span className="text-gray-400 text-[10px] uppercase font-bold block mb-1">Status</span>
                            <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
                                <FaCheckCircle /> {booking.status?.toUpperCase() || 'CONFIRMED'}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-400 text-[10px] uppercase font-bold block mb-1">Payment</span>
                            <span className="font-bold text-purple-300">
                                {booking.paymentStatus === 'paid' ? 'PAID IN FULL' : 'PAY AT DOOR / VERIFIED'}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-400 text-[10px] uppercase font-bold block mb-1">Date & Time</span>
                            <span className="font-bold text-white flex items-center gap-1">
                                <FaCalendarAlt className="text-purple-400" />
                                {event.date ? new Date(event.date).toLocaleDateString() : 'Upcoming'}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-400 text-[10px] uppercase font-bold block mb-1">Venue</span>
                            <span className="font-bold text-white flex items-center gap-1 truncate">
                                <FaMapMarkerAlt className="text-pink-400 shrink-0" />
                                <span className="truncate">{event.location || 'Main Hall'}</span>
                            </span>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={handlePrint}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
                        >
                            <FaDownload /> Download / Save Pass
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 bg-white/10 hover:bg-white/20 text-gray-300 font-bold rounded-xl text-xs transition-all border border-white/10"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRTicketModal;
