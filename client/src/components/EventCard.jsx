import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarDays, FaLocationDot, FaBookmark, FaRegBookmark, FaArrowUpRightFromSquare, FaTicket } from 'react-icons/fa6';
import { HiSparkles, HiUserGroup } from 'react-icons/hi2';

const EventCard = ({ event }) => {
    const [bookmarked, setBookmarked] = useState(false);

    if (!event) return null;

    const availableSeats = event.availableSeats ?? event.totalSeats ?? 50;
    const totalSeats = event.totalSeats ?? 100;
    const percentRemaining = Math.round((availableSeats / totalSeats) * 100);
    const isLowSeats = availableSeats > 0 && availableSeats <= 15;
    const isSoldOut = availableSeats <= 0;

    const defaultImages = {
        Music: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop',
        Tech: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop',
        Arts: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1000&auto=format&fit=crop',
        Food: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&auto=format&fit=crop',
        Gaming: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000&auto=format&fit=crop'
    };

    const imageUrl = event.image || defaultImages[event.category] || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop';

    return (
        <div className="brutalist-card brutalist-card-hover rounded-3xl overflow-hidden flex flex-col justify-between relative group border border-black/10 bg-white">
            {/* Top Image Banner */}
            <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                <img
                    src={imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop';
                    }}
                />

                {/* Dark Gradient Overlay for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

                {/* Electric Purple Category Badge (Top Left) */}
                <div className="absolute top-4 left-4 z-10">
                    <span className="bg-[#8522FF] text-white text-[10px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
                        <HiSparkles /> {event.category || 'SHOWCASE'}
                    </span>
                </div>

                {/* Bookmark Button (Top Right) */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setBookmarked(!bookmarked);
                    }}
                    className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white text-black border border-black/10 flex items-center justify-center hover:bg-[#8522FF] hover:text-white transition-all shadow-md"
                >
                    {bookmarked ? <FaBookmark className="text-[#8522FF]" /> : <FaRegBookmark />}
                </button>

                {/* Acid Lime Price Tag (Bottom Right) */}
                <div className="absolute bottom-4 right-4 z-10">
                    <div className="bg-[#D2FF00] text-black px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md border border-black/10">
                        {event.ticketPrice === 0 || !event.ticketPrice ? 'FREE ENTRY' : `₹${event.ticketPrice}`}
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                    {/* Date & Location tags */}
                    <div className="flex items-center justify-between text-xs font-bold text-gray-500">
                        <span className="flex items-center gap-1">
                            <FaCalendarDays className="text-[#8522FF]" />
                            {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1 truncate max-w-[130px]">
                            <FaLocationDot className="text-red-500 shrink-0" />
                            <span className="truncate">{event.location || 'Main Stage'}</span>
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-black text-lg text-[#0A0A0C] group-hover:text-[#8522FF] transition-colors leading-snug uppercase tracking-tight line-clamp-2">
                        {event.title}
                    </h3>

                    {/* Description */}
                    {event.description && (
                        <p className="text-gray-600 text-xs line-clamp-2 font-normal">
                            {event.description}
                        </p>
                    )}
                </div>

                {/* Capacity & Register CTA */}
                <div className="pt-3 border-t border-black/10 space-y-3">
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                            <span className="text-gray-500 flex items-center gap-1">
                                <HiUserGroup className="text-[#8522FF]" /> Capacity
                            </span>
                            <span className={isSoldOut ? 'text-red-600 font-extrabold' : isLowSeats ? 'text-amber-600 font-extrabold' : 'text-[#8522FF] font-extrabold'}>
                                {isSoldOut ? 'SOLD OUT' : `${availableSeats} of ${totalSeats} Left`}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${isSoldOut ? 'bg-red-600' : isLowSeats ? 'bg-amber-500' : 'bg-[#8522FF]'}`}
                                style={{ width: `${Math.min(100, Math.max(5, percentRemaining))}%` }}
                            ></div>
                        </div>
                    </div>

                    <Link
                        to={`/events/${event._id}`}
                        className="w-full bg-[#0A0A0C] hover:bg-[#8522FF] text-white font-extrabold py-3 rounded-2xl text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
                    >
                        <span>View Details</span>
                        <FaArrowUpRightFromSquare className="text-[10px]" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
