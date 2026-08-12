import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, Bookmark, BookmarkCheck, ArrowUpRight, Users, Ticket } from 'lucide-react';
import { Tilt } from '../animations';

const categoryStyles = {
    Music: { badge: 'bg-brand-pink', text: 'text-brand-pink' },
    Festivals: { badge: 'bg-brand-purple', text: 'text-brand-purple' },
    Workshops: { badge: 'bg-brand-lime text-brand-dark', text: 'text-brand-lime-deep' },
    Conferences: { badge: 'bg-brand-orange', text: 'text-brand-orange' },
    Sports: { badge: 'bg-brand-cyan text-brand-dark', text: 'text-brand-cyan' },
    Tech: { badge: 'bg-brand-purple-deep', text: 'text-brand-purple' },
    Arts: { badge: 'bg-brand-pink-soft text-brand-dark', text: 'text-brand-pink' },
    Food: { badge: 'bg-brand-orange-soft', text: 'text-brand-orange' },
    Gaming: { badge: 'bg-brand-gray-700', text: 'text-brand-purple' },
    Business: { badge: 'bg-brand-cyan text-brand-dark', text: 'text-brand-cyan' },
};

const defaultImages = {
    Music: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop',
    Tech: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop',
    Arts: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1000&auto=format&fit=crop',
    Food: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&auto=format&fit=crop',
    Gaming: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000&auto=format&fit=crop',
    Festivals: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1000&auto=format&fit=crop',
    Sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1000&auto=format&fit=crop',
};

const EventCard = ({ event }) => {
    const [bookmarked, setBookmarked] = useState(false);

    if (!event) return null;

    const availableSeats = event.availableSeats ?? event.totalSeats ?? 50;
    const totalSeats = event.totalSeats ?? 100;
    const percentRemaining = Math.round((availableSeats / totalSeats) * 100);
    const isLowSeats = availableSeats > 0 && availableSeats <= 15;
    const isSoldOut = availableSeats <= 0;

    const category = event.category || 'Music';
    const style = categoryStyles[category] || categoryStyles.Music;

    const imageUrl =
        event.image ||
        defaultImages[category] ||
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop';

    const formatDate = (d) =>
        new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <Tilt max={5}>
            <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="glass-card relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-[0_10px_40px_-18px_rgba(13,13,17,0.25)] dark:border-dark-line dark:bg-dark-surface"
            >
                {/* Image with glass overlay */}
                <div className="relative h-52 w-full overflow-hidden bg-gray-100 dark:bg-dark-surface-2">
                    <img
                        src={imageUrl}
                        alt={event.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop';
                        }}
                    />
                    {/* Gradient scrim (festival night) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b14]/85 via-[#0b0b14]/25 to-transparent" />

                    {/* Category badge */}
                    <span className={`absolute left-4 top-4 z-10 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg ${style.badge}`}>
                        {category}
                    </span>

                    {/* Bookmark — glass chip */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setBookmarked(!bookmarked);
                        }}
                        aria-label="Bookmark event"
                        className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white shadow-md backdrop-blur-md transition-all hover:scale-110"
                    >
                        {bookmarked ? (
                            <BookmarkCheck className="h-4 w-4 text-brand-lime" />
                        ) : (
                            <Bookmark className="h-4 w-4" />
                        )}
                    </button>

                    {/* Date chip */}
                    <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 rounded-full border border-white/15 bg-[#0b0b14]/55 px-3.5 py-1.5 font-mono text-[11px] font-bold text-white backdrop-blur-md">
                        <CalendarDays className="h-3.5 w-3.5 text-brand-lime" />
                        {formatDate(event.date)}
                    </div>

                    {/* Price tag */}
                    <div className="absolute bottom-4 right-4 z-10">
                        <span className="inline-flex items-center gap-1 rounded-full bg-brand-lime px-3.5 py-1.5 text-xs font-black uppercase tracking-wide text-brand-dark shadow-lg">
                            <Ticket className="h-3.5 w-3.5" />
                            {event.ticketPrice === 0 || !event.ticketPrice ? 'Free' : `₹${event.ticketPrice}`}
                        </span>
                    </div>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col gap-4 p-5">
                    <div>
                        <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-gray-500 dark:text-dark-muted">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-orange" />
                            <span className="truncate">{event.location || 'Venue TBA'}</span>
                        </div>
                        <h3 className="mt-2 font-display text-lg uppercase leading-tight tracking-wide text-black line-clamp-2 dark:text-dark-ink">
                            {event.title}
                        </h3>
                        {event.description && (
                            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-500 dark:text-dark-muted">
                                {event.description}
                            </p>
                        )}
                    </div>

                    {/* Capacity */}
                    <div className="mt-auto space-y-2 border-t border-black/5 pt-3 dark:border-dark-line">
                        <div className="flex items-center justify-between font-mono text-[11px] font-bold">
                            <span className="flex items-center gap-1.5 text-gray-500 dark:text-dark-muted">
                                <Users className="h-3.5 w-3.5" /> Seats left
                            </span>
                            <span className={isSoldOut ? 'font-extrabold text-red-500' : isLowSeats ? 'font-extrabold text-brand-orange' : `font-extrabold ${style.text}`}>
                                {isSoldOut ? 'Sold out' : `${availableSeats} of ${totalSeats}`}
                            </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                            <div
                                className={`h-full rounded-full transition-all duration-700 ${isSoldOut ? 'bg-red-500' : isLowSeats ? 'bg-brand-orange' : 'bg-gradient-to-r from-brand-orange via-brand-pink to-brand-purple'}`}
                                style={{ width: `${Math.min(100, Math.max(5, percentRemaining))}%` }}
                            />
                        </div>
                    </div>

                    {/* CTA */}
                    <Link
                        to={`/events/${event._id}`}
                        className="btn-gradient flex items-center justify-center gap-2 rounded-2xl py-3 text-xs font-extrabold uppercase tracking-wider text-white"
                    >
                        Book tickets <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </div>
            </motion.div>
        </Tilt>
    );
};

export default EventCard;
