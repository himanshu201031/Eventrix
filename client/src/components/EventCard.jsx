import React, { useState } from 'react';
import {
    ArrowUpRight,
    Bookmark,
    BookmarkCheck,
    CalendarDays,
    Cpu,
    Gamepad2,
    GraduationCap,
    MapPin,
    Mic2,
    Palette,
    PartyPopper,
    Ticket,
    Trophy,
    Users,
    UtensilsCrossed,
    Zap,
} from 'lucide-react';
import { TransitionLink } from './Transitions';

/* ── Category system ────────────────────────────────────────────────
   One solid accent + one editorial glyph per category. The accent drives
   the category pill, price tag, seat meter, glyph and hover glow; `ink`
   is the text colour that stays readable on that accent. Everything is
   flat — the ticket language comes from punch-outs, not gradients. */
const CATEGORY_CONFIG = {
    Music: { accent: '#FF2A78', icon: Zap, ink: '#ffffff' },
    Festivals: { accent: '#BA28E2', icon: PartyPopper, ink: '#ffffff' },
    Workshops: { accent: '#A855F7', icon: GraduationCap, ink: '#ffffff' },
    Conferences: { accent: '#FF5A1F', icon: Mic2, ink: '#ffffff' },
    Sports: { accent: '#FF7A00', icon: Trophy, ink: '#ffffff' },
    Tech: { accent: '#00D9FF', icon: Cpu, ink: '#0d0d11' },
    Arts: { accent: '#FF6EC7', icon: Palette, ink: '#0d0d11' },
    Food: { accent: '#FF8A00', icon: UtensilsCrossed, ink: '#0d0d11' },
    Gaming: { accent: '#FFC53D', icon: Gamepad2, ink: '#0d0d11' },
    Business: { accent: '#B6FF00', icon: ArrowUpRight, ink: '#0d0d11' },
};

const FALLBACK_IMG =
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop';

const defaultImages = {
    Music: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop',
    Tech: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop',
    Arts: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1000&auto=format&fit=crop',
    Food: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000&auto=format&fit=crop',
    Gaming: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000&auto=format&fit=crop',
    Festivals: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1000&auto=format&fit=crop',
    Sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1000&auto=format&fit=crop',
};

const formatDay = (d) =>
    new Date(d)
        .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        .toUpperCase();

/* Accept a full `event` object (existing call sites) or discrete props
   (reusable component contract). Props win; the event object fills gaps. */
const EventCard = ({
    event,
    category,
    title,
    image,
    location,
    date,
    time,
    price,
    priceLabel,
    seatsRemaining,
    totalSeats,
    accentColor,
    accentIcon,
    isFeatured = false,
    isSaved = false,
}) => {
    const [bookmarked, setBookmarked] = useState(isSaved);
    const ev = event || {};

    const cat = category || ev.category || 'Music';
    const cfg = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.Music;
    const accent = accentColor || cfg.accent;
    const Glyph = accentIcon || cfg.icon;

    const titleText = title || ev.title || 'Untitled event';
    const img = image || ev.image || defaultImages[cat] || FALLBACK_IMG;
    const loc = location || ev.location || 'Venue TBA';
    const dateLabel = date || ev.date ? formatDay(date || ev.date) : 'Date TBA';
    const timeLabel =
        time || (ev.startTime && ev.endTime ? `${ev.startTime} – ${ev.endTime}` : ev.startTime) || null;
    const rawPrice = price ?? ev.ticketPrice;
    const label = priceLabel || 'Entry pass';
    const avail = seatsRemaining ?? ev.availableSeats ?? ev.totalSeats ?? 0;
    const total = totalSeats ?? ev.totalSeats ?? Math.max(avail, 1);
    const soldOut = avail <= 0;
    const pct = Math.max(0, Math.min(100, Math.round((avail / total) * 100)));
    const href = ev._id ? `/events/${ev._id}` : '/events';

    return (
        <article
            className={`evx-card group flex h-full min-h-[560px] w-full max-w-[380px] flex-col overflow-hidden rounded-[26px] ${isFeatured ? 'evx-card-featured' : ''}`}
            style={{ '--accent': accent }}
        >
            {/* ── Photography ─────────────────────────────────────── */}
            <div className="relative h-[210px] shrink-0 overflow-hidden sm:h-[230px]">
                <img
                    src={img}
                    alt={titleText}
                    loading="lazy"
                    draggable={false}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    onError={(e) => {
                        if (e.currentTarget.src !== FALLBACK_IMG) e.currentTarget.src = FALLBACK_IMG;
                    }}
                />
                {/* Bottom scrim keeps the date + price tags legible on any photo */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

                {/* Category pill */}
                <span
                    className="absolute left-4 top-4 z-10 inline-flex items-center rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.05em] transition-transform duration-300 ease-out group-hover:-translate-y-0.5"
                    style={{ background: accent, color: cfg.ink }}
                >
                    {cat}
                </span>

                {/* Bookmark */}
                <button
                    type="button"
                    onClick={() => setBookmarked((b) => !b)}
                    aria-pressed={bookmarked}
                    aria-label={bookmarked ? `Remove ${titleText} from saved events` : `Save ${titleText}`}
                    className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white transition-all duration-300 ease-out hover:scale-105 hover:border-white hover:bg-white hover:text-black group-hover:scale-105"
                    style={bookmarked ? { background: accent, borderColor: accent, color: '#0d0d11' } : undefined}
                >
                    {bookmarked ? (
                        <BookmarkCheck className="h-5 w-5" fill="currentColor" strokeWidth={2.5} />
                    ) : (
                        <Bookmark className="h-5 w-5" strokeWidth={2} />
                    )}
                </button>

                {/* Date / time capsule */}
                <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2.5 rounded-2xl border border-white/15 bg-black/55 px-4 py-2.5">
                    <CalendarDays className="h-4 w-4 shrink-0" style={{ color: accent }} />
                    <span className="leading-tight">
                        <span className="block text-[11px] font-bold uppercase tracking-wider text-white">
                            {dateLabel}
                        </span>
                        {timeLabel && (
                            <span className="block text-[10px] font-semibold tracking-wide text-white/65">
                                {timeLabel}
                            </span>
                        )}
                    </span>
                </div>

                {/* Price ticket — solid accent with punched edges */}
                <div className="evx-ticket-badge absolute bottom-4 right-4 z-10 px-6 py-2.5 text-center text-brand-dark">
                    <span className="font-display block text-lg leading-none tracking-wide">
                        {rawPrice === 0 || rawPrice == null ? 'FREE' : `₹${rawPrice.toLocaleString('en-IN')}`}
                    </span>
                    <span className="mx-auto mt-1.5 block h-px w-9 border-t border-dashed border-black/40" aria-hidden="true" />
                    <span className="mt-1 block text-[8px] font-black uppercase tracking-[0.22em]">{label}</span>
                </div>
            </div>

            {/* ── Ticket body ─────────────────────────────────────── */}
            <div className="flex flex-1 flex-col p-6">
                {/* Location */}
                <div className="flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-wider text-white/45">
                    <MapPin className="h-3.5 w-3.5 shrink-0" style={{ color: accent }} />
                    <span className="truncate">{loc}</span>
                </div>

                {/* Title + editorial glyph */}
                <div className="mt-4 flex items-start gap-2.5">
                    <span className="mt-0.5 shrink-0" style={{ color: accent }} aria-hidden="true">
                        <Glyph className="h-5 w-5 -rotate-6" strokeWidth={2.5} />
                    </span>
                    <h3 className="font-display line-clamp-2 text-[27px] uppercase leading-[0.95] tracking-wide text-white sm:text-[30px]">
                        {titleText}
                    </h3>
                </div>

                <div className="mt-6 h-px w-full bg-[#292A2E]" aria-hidden="true" />

                {/* Seat availability */}
                <div className="mt-6 flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/45">
                        <Users className="h-4 w-4 text-white/35" /> Seats left
                    </span>
                    <span className="text-sm font-black tracking-wide" style={{ color: soldOut ? '#FF5A5F' : accent }}>
                        {soldOut ? 'Sold out' : `${avail.toLocaleString('en-IN')} of ${total.toLocaleString('en-IN')}`}
                    </span>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#292A2E]">
                    <div
                        className="h-full rounded-full transition-[width] duration-700 ease-out"
                        style={{ width: `${soldOut ? 0 : pct}%`, background: soldOut ? '#3d3d46' : accent }}
                    />
                </div>

                {/* CTA — ticket-shaped, full-bleed across the card foot */}
                <TransitionLink
                    to={href}
                    aria-label={soldOut ? `${titleText} is sold out` : `Book tickets for ${titleText}`}
                    className="evx-cta-ticket group/cta relative -mx-6 -mb-6 mt-auto flex h-[72px] w-[calc(100%+3rem)] items-center justify-between border border-[#7d35e8]/50 pl-7 pr-4 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#8a4bf0]"
                >
                    <span className="flex min-w-0 items-center gap-3">
                        <Ticket className="h-4 w-4 shrink-0 text-white/45" />
                        <span className="font-display truncate text-base uppercase tracking-[0.08em] text-white">
                            {soldOut ? 'Sold out' : 'Book tickets'}
                        </span>
                    </span>
                    <span className="relative flex h-full items-center">
                        <span
                            className="absolute bottom-4 top-4 w-px border-l border-dashed border-white/20"
                            aria-hidden="true"
                        />
                        <span className="ml-7 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 ease-out group-hover/cta:translate-x-1 group-hover/cta:bg-[var(--accent)] group-hover/cta:text-brand-dark group-hover/cta:shadow-[0_10px_24px_-8px_var(--accent)]">
                            <ArrowUpRight className="h-5 w-5 transition-transform duration-300 ease-out group-hover:translate-x-1" strokeWidth={2.5} />
                        </span>
                    </span>
                </TransitionLink>
            </div>
        </article>
    );
};

export default EventCard;
