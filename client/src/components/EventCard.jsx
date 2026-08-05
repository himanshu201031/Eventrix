import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaBookmark, FaRegBookmark, FaTicketAlt } from 'react-icons/fa';
import { HiSparkles, HiUserGroup } from 'react-icons/hi2';

const EventCard = ({ event }) => {
    const [bookmarked, setBookmarked] = useState(false);

    if (!event) return null;

    const availableSeats = event.availableSeats ?? event.totalSeats ?? 50;
    const totalSeats = event.totalSeats ?? 100;
    const percentRemaining = Math.round((availableSeats / totalSeats) * 100);
    const isLowSeats = availableSeats > 0 && availableSeats <= 15;
    const isSoldOut = availableSeats <= 0;

    // Fallback images based on category if image URL fails or is empty
    const defaultImages = {
        Music: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop',
        Tech: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop',
        Arts: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1000&auto=format&fit=crop',
        Food: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&auto=format&fit=crop',
        Gaming: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000&auto=format&fit=crop'
    };

    const imageUrl = event.image || defaultImages[event.category] || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop';

    return (
        <div className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col group relative border border-white/10">
            {/* Top Image & Overlays */}
            <div className="relative h-56 w-full overflow-hidden bg-gray-900">
                <img
                    src={imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop';
                    }}
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e131f] via-transparent to-black/30"></div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-10">
                    <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/15 tracking-wider uppercase flex items-center gap-1 shadow-md">
                        <HiSparkles className="text-purple-400 text-xs" />
                        {event.category || 'Event'}
                    </span>
                </div>

                {/* Bookmark Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setBookmarked(!bookmarked);
                    }}
                    className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:text-purple-400 hover:scale-110 transition-all shadow-md"
                    title={bookmarked ? "Remove Bookmark" : "Save Event"}
                >
                    {bookmarked ? <FaBookmark className="text-purple-400 text-sm" /> : <FaRegBookmark className="text-gray-300 text-sm" />}
                </button>

                {/* Price Tag Overlay */}
                <div className="absolute bottom-4 right-4 z-10">
                    <div className="bg-purple-900/80 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl border border-purple-500/30 text-sm font-black tracking-tight shadow-lg flex items-center gap-1.5">
                        <FaTicketAlt className="text-purple-300 text-xs" />
                        {event.ticketPrice === 0 || !event.ticketPrice ? (
                            <span className="text-emerald-400 font-extrabold uppercase text-xs tracking-wider">FREE ENTRY</span>
                        ) : (
                            <span>₹{event.ticketPrice}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div>
                    {/* Date & Location Line */}
                    <div className="flex items-center justify-between text-xs text-purple-300/80 font-medium mb-2">
                        <div className="flex items-center gap-1.5">
                            <FaCalendarAlt className="text-purple-400" />
                            <span>{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-400 max-w-[140px] truncate">
                            <FaMapMarkerAlt className="text-pink-400 shrink-0" />
                            <span className="truncate">{event.location || 'Online'}</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 leading-snug">
                        {event.title}
                    </h3>

                    {/* Short Description */}
                    {event.description && (
                        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mt-2 font-normal">
                            {event.description}
                        </p>
                    )}
                </div>

                {/* Seats Progress & CTA */}
                <div className="pt-3 border-t border-white/10 space-y-3">
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-semibold">
                            <span className="text-gray-400 flex items-center gap-1">
                                <HiUserGroup className="text-purple-400 text-xs" /> Capacity
                            </span>
                            <span className={isSoldOut ? 'text-red-400 font-bold' : isLowSeats ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                                {isSoldOut ? 'SOLD OUT' : `${availableSeats} of ${totalSeats} left`}
                            </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${isSoldOut ? 'bg-red-500' : isLowSeats ? 'bg-amber-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`}
                                style={{ width: `${Math.min(100, Math.max(5, percentRemaining))}%` }}
                            ></div>
                        </div>
                    </div>

                    <Link
                        to={`/events/${event._id}`}
                        className="w-full bg-white/10 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-purple-500/25 border border-white/10 hover:border-transparent"
                    >
                        <span>View & Register</span>
                        <span className="text-xs transition-transform group-hover:translate-x-1">&rarr;</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
