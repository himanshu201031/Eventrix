import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../utils/axios';
import { getLenis } from '../utils/smoothScroll';
import EventCard from '../components/EventCard';
import { DirectionalTransition, TransitionLink, push } from '../components/Transitions';
import { Reveal, Counter, Magnetic, Marquee } from '../animations';
import heroBg from '../assets/herobg.png';
import peoples from '../assets/peoples.png';
import vipTicket from '../assets/vipticket.png';
import midTicket from '../assets/midticket.png';
import normalTicket from '../assets/normalticket.png';
import djImg from '../assets/dj.png';
import micImg from '../assets/mic3d.png';
import headphonesImg from '../assets/headphones3d.png';
import {
    ArrowUpRight, BadgePercent, CalendarCheck, ChevronDown, ChevronRight,
    Flame, GraduationCap, Headphones, MapPin, Mic2, Music2, PartyPopper, Plus,
    Search, ShieldCheck, Sparkle, Star, Ticket, Trophy, Users,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ---------- Demo content (shown while the API loads or is empty) ---------- */
const demoEvents = [
    {
        _id: 'sunset-fest-2026',
        title: 'Sunset Music Festival 2026',
        category: 'Festivals',
        date: '2026-12-14',
        location: 'Goa, India',
        ticketPrice: 1499,
        description: 'Three days of non-stop music, art and beach vibes.',
        image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200&auto=format&fit=crop',
        totalSeats: 5000, availableSeats: 3200,
    },
    {
        _id: 'arijit-live-2026',
        title: 'Arijit Singh · Live in Concert',
        category: 'Music',
        date: '2026-10-24',
        location: 'Mumbai, India',
        ticketPrice: 2399,
        description: 'An unforgettable night of soulful melodies under the stars.',
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1200&auto=format&fit=crop',
        totalSeats: 8000, availableSeats: 4100,
    },
    {
        _id: 'techcrunch-disrupt-2026',
        title: 'TechCrunch Disrupt 2026',
        category: 'Conferences',
        date: '2026-11-05',
        location: 'Bengaluru, India',
        ticketPrice: 4999,
        description: 'Startups, investors and the future of technology in one room.',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop',
        totalSeats: 3000, availableSeats: 890,
    },
    {
        _id: 'sunburn-arena-2026',
        title: 'Sunburn Arena Nights',
        category: 'Music',
        date: '2026-12-31',
        location: 'Delhi NCR, India',
        ticketPrice: 2999,
        description: 'The biggest EDM night of the year with world-class DJs.',
        image: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=1200&auto=format&fit=crop',
        totalSeats: 12000, availableSeats: 5200,
    },
    {
        _id: 'india-design-week-2026',
        title: 'India Design Week 2026',
        category: 'Workshops',
        date: '2026-09-18',
        location: 'Jaipur, India',
        ticketPrice: 1799,
        description: 'Design thinking, workshops and creative showcases.',
        image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop',
        totalSeats: 1500, availableSeats: 620,
    },
    {
        _id: 'holi-rave-2027',
        title: 'Holi Rave · Colors of Sound',
        category: 'Festivals',
        date: '2027-03-07',
        location: 'Jaipur, India',
        ticketPrice: 1299,
        description: 'Colour, bass and a thousand strangers becoming friends.',
        image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200&auto=format&fit=crop',
        totalSeats: 4000, availableSeats: 2750,
    },
];

const categories = [
    { name: 'Music', icon: Music2, tint: 'from-brand-pink/25 to-brand-pink/5 text-brand-pink', count: '1,234 events' },
    { name: 'Festivals', icon: PartyPopper, tint: 'from-brand-purple/25 to-brand-purple/5 text-brand-purple', count: '845 events' },
    { name: 'Workshops', icon: GraduationCap, tint: 'from-brand-lime/25 to-brand-lime/5 text-brand-lime-deep', count: '645 events' },
    { name: 'Conferences', icon: Mic2, tint: 'from-brand-purple-deep/25 to-brand-purple-deep/5 text-brand-purple', count: '321 events' },
    { name: 'Sports', icon: Trophy, tint: 'from-brand-cyan/25 to-brand-cyan/5 text-brand-cyan', count: '421 events' },
    { name: 'Meetups', icon: Users, tint: 'from-brand-orange/25 to-brand-orange/5 text-brand-orange', count: '621 events' },
];

const whyFeatures = [
    { icon: ShieldCheck, tint: 'text-brand-lime', chip: 'bg-brand-lime/15', title: 'OTP-verified booking', desc: 'Every booking is confirmed to your email before a seat is held. No bots, no ghost tickets.' },
    { icon: CalendarCheck, tint: 'text-brand-pink', chip: 'bg-brand-pink/15', title: 'Instant QR passes', desc: 'Your pass lands in the app the moment payment clears, gate-ready before you leave the house.' },
    { icon: BadgePercent, tint: 'text-brand-orange', chip: 'bg-brand-orange/15', title: 'Best-price promise', desc: 'Early-bird pricing and member deals, with no surprise fees hiding at checkout.' },
    { icon: Headphones, tint: 'text-brand-cyan', chip: 'bg-brand-cyan/15', title: '24/7 human support', desc: 'Real people, day or night. Most replies land inside five minutes.' },
];

const stats = [
    { icon: Flame, to: 12, suffix: 'K+', label: 'Events listed', tint: 'text-brand-orange', chip: 'bg-brand-orange/15' },
    { icon: Ticket, to: 500, suffix: 'K+', label: 'Tickets booked', tint: 'text-brand-pink', chip: 'bg-brand-pink/15' },
    { icon: MapPin, to: 40, suffix: '+', label: 'Cities covered', tint: 'text-brand-cyan', chip: 'bg-brand-cyan/15' },
    { icon: Users, to: 98, suffix: '%', label: 'Gate-in rate', tint: 'text-brand-purple', chip: 'bg-brand-purple/15' },
];

const testimonials = [
    { name: 'Ananya Sharma', role: 'Festival regular · Goa', quote: 'Booked Sunset Festival on a Sunday night. The QR pass was in my wallet before I finished my chai. Zero queue at the gate.', initials: 'AS' },
    { name: 'Rohan Mehta', role: 'Tech founder · Bengaluru', quote: 'Every ticket, invoice and confirmation sits in one dashboard. I always know what I paid and what is coming up.', initials: 'RM' },
    { name: 'Zara Khan', role: 'Music lover · Mumbai', quote: 'Found the Arijit show in seconds, grabbed an early-bird pass, got the OTP, done. Booking felt genuinely smooth.', initials: 'ZK' },
];

const SkeletonCard = () => (
    <div className="overflow-hidden rounded-[1.75rem] border border-black/5 bg-white dark:border-dark-line dark:bg-dark-surface">
        <div className="skeleton h-52 w-full rounded-none" />
        <div className="space-y-3 p-5">
            <div className="skeleton h-3 w-1/3" />
            <div className="skeleton h-6 w-3/4" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-11 w-full" />
        </div>
    </div>
);



/* Fallback poster for the lineup cursor preview when an event has no image */
const lineupFallbackImg = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop';

const Home = () => {
    const navigate = useNavigate();
    const heroRef = useRef(null);
    const whyRef = useRef(null);
    const outerRef = useRef(null);
    const rigRef = useRef(null);
    /* Lets the journey effect be told to re-measure (events loaded, etc.) */
    const journeyRebuildRef = useRef(null);
    const [searchParams] = useSearchParams();
    const search = searchParams.get('search') || '';
    const [events, setEvents] = useState([]);
    const [heroQuery, setHeroQuery] = useState('');
    const [heroCategory, setHeroCategory] = useState('');
    const [heroLocation, setHeroLocation] = useState('');
    const [loading, setLoading] = useState(true);
    const [subscribed, setSubscribed] = useState(false);
    const [email, setEmail] = useState('');
    /* Pick Your Vibe: which mood is hovered — it expands while its neighbours
       shrink, turning the grid into a single composable moment. */
    const [vibe, setVibe] = useState(null);
    /* Lineup: the event whose poster follows the cursor across the rows */
    const [lineupPreview, setLineupPreview] = useState(null);
    const lineupListRef = useRef(null);
    const lineupPreviewRef = useRef(null);

    /* ---- API events (kept from original implementation) ---- */
    const fetchEvents = useCallback(async () => {
        try {
            const { data } = await api.get(`/events?search=${search}`);
            setEvents(data.items ?? []);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        const timeoutId = setTimeout(() => fetchEvents(), 300);
        return () => clearTimeout(timeoutId);
    }, [fetchEvents]);

    /* ---- GSAP: load-in sequence + scroll parallax (synced with Lenis) ---- */
    useEffect(() => {
        const lenis = getLenis();
        if (lenis) lenis.on('scroll', ScrollTrigger.update);

        /* Reduced motion: content renders in its final, static state — no
           entrance choreography and no scroll-driven parallax (the CSS guard
           can't stop GSAP, so we gate it here). */
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return () => {
                if (lenis) lenis.off('scroll', ScrollTrigger.update);
            };
        }

        const heroCtx = gsap.context(() => {
            gsap.fromTo(
                '.hero-el',
                { y: 46, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: 'power3.out', delay: 0.1 }
            );
            /* Headline lines rise line-by-line, each with a whisper of rotation */
            gsap.fromTo(
                '.hero-line',
                { y: 64, rotate: 4, opacity: 0 },
                { y: 0, rotate: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power4.out', delay: 0.25 }
            );
            gsap.fromTo(
                '.hero-sticker',
                { scale: 0, rotate: -24 },
                { scale: 1, rotate: 0, duration: 0.8, stagger: 0.15, ease: 'back.out(1.8)', delay: 0.75 }
            );

            /* Hero copy recedes at three speeds while the passes burst out —
               the headline leads, the subtitle trails, the CTA lingers, so
               the text reads as a layer behind the tickets. The first quarter
               of the hero's scroll leaves the copy fully stable. */
            const heroCopy = (sel, dist) =>
                gsap.fromTo(sel, { y: 0, opacity: 1 }, {
                    keyframes: [
                        { y: 0, opacity: 1, duration: 0.25 },
                        { y: dist, opacity: 0, duration: 0.75, ease: 'none' },
                    ],
                    ease: 'none',
                    scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
                });
            heroCopy('.hero-headline', -120);
            heroCopy('.hero-sub', -85);
            heroCopy('.hero-cta', -55);

            /* Layered parallax — the stage artwork lags (drifts down) while
               the crowd rises (drifts up), so the two planes pull apart for
               depth as you scroll. The bg's scale covers its travel; the
               crowd barely moves — the passes are the primary motion focus. */
            gsap.fromTo(
                '.plx-hero-bg',
                { yPercent: -8, scale: 1.1 },
                {
                    yPercent: 8,
                    scale: 1.1,
                    ease: 'none',
                    scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
                }
            );
            gsap.fromTo(
                '.plx-hero-crowd',
                { yPercent: 6, scale: 1 },
                {
                    yPercent: -14,
                    scale: 1.08,
                    ease: 'none',
                    scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
                }
            );
        }, heroRef);

        /* Why-section illustrations drift at their own speed */
        const whyCtx = gsap.context(() => {
            gsap.to('.plx-dj', {
                yPercent: -14,
                ease: 'none',
                scrollTrigger: { trigger: whyRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
            });
            gsap.to('.plx-mic', {
                yPercent: 22,
                ease: 'none',
                scrollTrigger: { trigger: whyRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
            });
            gsap.to('.plx-phone', {
                yPercent: 28,
                ease: 'none',
                scrollTrigger: { trigger: whyRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
            });
        }, whyRef);

        return () => {
            heroCtx.revert();
            whyCtx.revert();
            if (lenis) lenis.off('scroll', ScrollTrigger.update);
        };
    }, []);

    /* ---- Ticket journey: the three passes fly section-to-section ----
       Each section hosts a `.ticket-slot`; as the page scrolls, the fan of
       passes travels from slot to slot along an S-curve (zig-zag) path,
       parking in the next section's reserved space. Each stop arrives exactly
       as its section's pocket reaches the viewport centre, rests there while
       the section scrolls through, then leaps to the next. Rebuilt on resize /
       breakpoint changes / font load so parked positions stay exact. */
    useEffect(() => {
        const outer = outerRef.current;
        const rig = rigRef.current;
        if (!outer || !rig) return undefined;

        let tl1 = null;
        let tl2 = null;
        let resizeTimer = null;
        let dispose = null;
        let disposed = false;
        let pointerCleanup = null;

        /* The layout is NOT settled at mount: the page-enter translate is
           still animating and the display fonts are still loading, so any
           slot rect read now inherits a shifted baseline — the earlier build
           parked the fan at page (0,0) for exactly this reason. Hide the rig
           until the first settled build, then run pin + takeoff + journey in
           one pass. */
        gsap.set(rig, { opacity: 0 });

        const build = () => {
            if (disposed) return;

            const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        /* Only slots currently visible (display:none below lg for section
           slots, so mobile = hero slot only). */
        const slots = gsap.utils
            .toArray('.ticket-slot')
            .filter((s) => s.getClientRects().length > 0);
        if (slots.length === 0) return undefined;

        const tMid = rig.querySelector('.ticket-mid');
        const tNorm = rig.querySelector('.ticket-normal');
        const tVip = rig.querySelector('.ticket-vip');
        const r = rig.getBoundingClientRect();
        const sx = r.left + window.scrollX;
        const sy = r.top + window.scrollY;
        const fanW = rig.offsetWidth;
        const fanH = rig.offsetHeight;
        const vh = window.innerHeight || 1;
        /* The hero's natural page-top, captured before the pin turns it
           fixed — used to anchor the hero slot's page position. */
        const heroEl = heroRef.current;
        const heroPageTop = heroEl.getBoundingClientRect().top + window.scrollY;

        const measure = () => {
            const hr = heroEl.getBoundingClientRect();
            return slots.map((s, i) => {
                const sr = s.getBoundingClientRect();
                /* The hero slot lives inside the pinned (fixed) hero, so its
                   rect is viewport-anchored — derive its page position from
                   the hero's own rect instead of adding scrollY, which would
                   corrupt it whenever a rebuild runs mid-pin. Section slots
                   stay in normal flow, so they keep the scroll offset. */
                const pageY = i === 0
                    ? heroPageTop + (sr.top - hr.top)
                    : sr.top + window.scrollY;
                return {
                    x: sr.left + sr.width / 2 + window.scrollX - sx - fanW / 2,
                    y: sr.height / 2 + pageY - sy - fanH / 2,
                };
            });
        };

        const prePts = measure();

        /* Responsive burst distances: full on desktop, ~65% on tablet,
           ~45% on mobile. 3D Y-tilt is dropped below lg. */
        const vw = window.innerWidth;
        const F = vw < 640 ? 0.45 : vw < 1024 ? 0.65 : 1;
        const ryOn = vw >= 1024;

        if (reduced) {
            gsap.set(rig, { x: prePts[0].x, y: prePts[0].y, rotation: 0, opacity: 1 });
            gsap.set(tMid, { rotation: -8, rotateY: ryOn ? -10 : 0 });
            gsap.set(tVip, { rotation: 3, rotateY: ryOn ? -3 : 0 });
            gsap.set(tNorm, { rotation: 8, rotateY: ryOn ? 10 : 0 });
            return undefined;
        }

        /* Takeoff window: how much scroll the pinned hero consumes while
           the passes burst up out of it (capped so the featured pocket
           always has room to receive them). */
        const preArrive = (prePts[1]?.y ?? 900) + fanH / 2 - vh / 2;
        const TW = Math.min(560, Math.max(320, Math.round(preArrive * 0.5)));

        const heroPt = prePts[0];
        const tilts = [0, -3, 3, -2, 3, -4, 3, -2, 4];

        gsap.set(rig, { x: heroPt.x, y: heroPt.y, rotation: 0, opacity: 1 });
        /* Parked 3D pose — matches the artwork composition: GENERAL tilted
           back-left, VIP flat-front (largest), VVIP tilted back-right. The
           takeoff bursts FROM these poses; the journey's Z-rotation resets
           them flat at each pocket landing. */
        gsap.set(tMid, { rotation: -8, rotateY: ryOn ? -10 : 0 });
        gsap.set(tVip, { rotation: 3, rotateY: ryOn ? -3 : 0 });
        gsap.set(tNorm, { rotation: 8, rotateY: ryOn ? 10 : 0 });

        /* Durations are raw scroll-pixels, so the timeline's time axis maps
           1:1 to scroll position — arrivals happen exactly when each pocket
           reaches the viewport centre, and scrolling back up runs the whole
           thing in reverse. */
        const addFlight = (timeline, leg, i, at) => {
            const d = leg.len;
            const d1 = d * 0.34;
            const d2 = d * 0.33;
            const d3 = d * 0.33;
            const zig = (i % 2 === 0 ? 1 : -1) * 110;
            const mx1 = leg.a.x + (leg.b.x - leg.a.x) * 0.32;
            const my1 = leg.a.y + (leg.b.y - leg.a.y) * 0.42;
            const mx2 = leg.a.x + (leg.b.x - leg.a.x) * 0.68;
            const my2 = leg.a.y + (leg.b.y - leg.a.y) * 0.74;

            /* The rig weaves the S-curve; on top of that the left pass zigs
               to the right, the right pass zigs to the left (mirror), and the
               VIP pass rides straight. They fan apart mid-flight and re-form
               on the slot. */
            timeline.to(rig, { x: mx1 + zig, y: my1 - 36, rotation: 7, duration: d1 }, at);
            timeline.to(tMid, { x: 170, y: 14, rotation: 13, duration: d1 }, at);
            timeline.to(tNorm, { x: -170, y: -14, rotation: -13, duration: d1 }, at);
            at += d1;

            timeline.to(rig, { x: mx2 - zig, y: my2 + 28, rotation: -6, duration: d2 }, at);
            timeline.to(tMid, { x: 80, y: -8, rotation: -7, duration: d2 }, at);
            timeline.to(tNorm, { x: -80, y: 8, rotation: 7, duration: d2 }, at);
            at += d2;

            timeline.to(rig, { x: leg.b.x, y: leg.b.y, rotation: leg.rot, duration: d3, ease: 'power2.inOut' }, at);
            timeline.to(tMid, { x: 0, y: 0, rotation: 0, duration: d3, ease: 'power2.inOut' }, at);
            timeline.to(tNorm, { x: 0, y: 0, rotation: 0, duration: d3, ease: 'power2.inOut' }, at);
            return at + d3;
        };

        /* ── Takeoff keyframes ──
           The passes burst up through the hero and out the top. Each y target
           moves the fan CENTRE in viewport space and adds the scroll consumed
           so far: the rig is page-anchored and the page itself scrolls while
           the hero is pinned, so without that term the passes would fly off
           the top instead of visibly rising. */
        const tkX = (dx) => heroPt.x + dx;
        const tkY = (viewportY, share) => viewportY - fanH / 2 + TW * share;
        const td1 = TW * 0.34;
        const td2 = TW * 0.33;
        const td3 = TW * 0.33;
        const fanCY = heroPt.y + fanH / 2;
        const leapPt = { x: tkX(70), y: tkY(-260, 1) };

        /* Pass 2 (post-pin): ScrollTrigger moves the hero into its pin-spacer
           on its first refresh, which is what shifts the sections below. TL2
           is therefore built from that refresh — deferred out of the refresh
           cycle (rAF) so creating its trigger can't disturb the pin setup. */
        let built2 = false;
        const buildJourney2 = () => {
            if (disposed) return;
            if (tl2) {
                if (tl2.scrollTrigger) tl2.scrollTrigger.kill();
                tl2.kill();
                tl2 = null;
            }

            const pts = measure();
            const maxScroll = Math.max(1, outer.scrollHeight - vh);
            const scrollFor = pts.map((p, i) =>
                i === 0 ? 0 : Math.min(maxScroll, Math.max(0, p.y + fanH / 2 - vh / 2))
            );

            const windows = [];
            for (let i = 0; i < pts.length - 1; i += 1) {
                const arriveNext = scrollFor[i + 1];
                const departCur = i === 0 ? TW : scrollFor[i] + vh / 2;
                windows.push(Math.max(60, arriveNext - departCur));
            }
            /* Final leg: settle into the last pocket and hold to the page end */
            windows.push(Math.max(60, maxScroll - scrollFor[pts.length - 1]));

            const legs = [];
            for (let i = 0; i < pts.length - 1; i += 1) {
                legs.push({
                    a: pts[i],
                    b: pts[i + 1],
                    len: windows[i],
                    rot: tilts[i + 1] ?? 0,
                });
            }
            if (legs.length === 0) return;

            tl2 = gsap.timeline({
                defaults: { ease: 'none' },
                scrollTrigger: {
                    trigger: outer,
                    start: TW,
                    /* Bind the end to the timeline's own duration (evaluated on
                       refresh, after all flights are added) instead of 'max':
                       the page below outer (footer, etc.) makes the document
                       taller, which silently stretches the scrub mapping and
                       lands every flight progressively late. With end = start +
                       duration, scroll maps 1:1 to timeline time. */
                    end: () => TW + tl2.duration(),
                    scrub: 1,
                },
            });

            /* Glide down from the takeoff exit into the featured pocket */
            let at = 0;
            at = addFlight(tl2, { a: leapPt, b: pts[1], len: windows[0], rot: tilts[1] ?? 0 }, 0, at);
            /* Each later stop: rest in the section as it scrolls through the
               viewport (vh/2 of scroll), then leap to the next section */
            for (let i = 1; i < legs.length; i += 1) {
                tl2.to(rig, { x: legs[i - 1].b.x, y: legs[i - 1].b.y, rotation: tilts[i] ?? 0, duration: vh / 2 }, at);
                at += vh / 2;
                at = addFlight(tl2, legs[i], i, at);
            }
            /* Hold the final park through the rest of the page */
            const last = pts[pts.length - 1];
            tl2.to(rig, { x: last.x, y: last.y, rotation: tilts[pts.length - 1] ?? 0, duration: windows[windows.length - 1] }, at);
        };

        /* ── TL1: pin the hero for the takeoff ──
           Created once; rebuilds only touch TL2. onRefresh signals that the
           pin-spacer exists, so buildJourney2 can measure the shifted layout. */
        tl1 = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
                trigger: heroRef.current,
                start: 'top top',
                end: `+=${TW}`,
                pin: true,
                anticipatePin: 1,
                scrub: 1,
                onRefresh: () => {
                    if (!built2) {
                        built2 = true;
                        requestAnimationFrame(() => {
                            reanchorTakeoff();
                            buildJourney2();
                        });
                    }
                },
            },
        });

        /* ── Takeoff: one pinned burst in three directions ──
           The passes explode out of the hero composition along three distinct
           trajectories — GENERAL → upper-left, VIP → lower-right, VVIP →
           upper-right — then arc back together at the off-screen leap point
           so the featured pocket receives the reformed fan (collection →
           separation → expansion → disappearance → next section). Each pass
           carries its own 3D Y-tilt, rotation and scale: GENERAL swings
           up-left and shrinks (CCW), VIP dips right-down and grows first,
           VVIP flies up-right with the most aggressive rotation. */
        /* Every phase pins all four passes at the SAME timeline position so
           the three trajectories run in parallel (one burst, three directions)
           — without the explicit positions GSAP stacks them sequentially and
           the directions fire one-after-another instead of together. */
        tl1.to(rig, { x: tkX(80), y: tkY(fanCY - 190, 0.34), rotation: 6, duration: td1 }, 0);
        tl1.to(tMid, { x: -260 * F, y: -150 * F, rotation: -16, rotateY: ryOn ? -10 : 0, scale: 0.92, duration: td1 }, 0);
        tl1.to(tVip, { x: 250 * F, y: 80 * F, rotation: 8, rotateY: ryOn ? -4 : 0, scale: 1.06, duration: td1 }, 0);
        tl1.to(tNorm, { x: 220 * F, y: -170 * F, rotation: 18, rotateY: ryOn ? 10 : 0, scale: 0.9, duration: td1 }, 0);
        tl1.to(rig, { x: tkX(-70), y: tkY(fanCY - 330, 0.67), rotation: -6, duration: td2 }, td1);
        tl1.to(tMid, { x: -340 * F, y: -220 * F, rotation: -22, rotateY: ryOn ? -14 : 0, scale: 0.86, duration: td2 }, td1);
        tl1.to(tVip, { x: 320 * F, y: 180 * F, rotation: 13, rotateY: ryOn ? 3 : 0, scale: 0.96, duration: td2 }, td1);
        tl1.to(tNorm, { x: 320 * F, y: -250 * F, rotation: 26, rotateY: ryOn ? 15 : 0, scale: 0.84, duration: td2 }, td1);
        tl1.to(rig, { x: tkX(70), y: tkY(-260, 1), rotation: 3, duration: td3, ease: 'power2.inOut' }, td1 + td2);
        tl1.to(tMid, { x: 0, y: 0, rotation: 0, rotateY: ryOn ? -10 : 0, scale: 1, duration: td3, ease: 'power2.inOut' }, td1 + td2);
        tl1.to(tVip, { x: 0, y: 0, rotation: 0, rotateY: ryOn ? -3 : 0, scale: 1, duration: td3, ease: 'power2.inOut' }, td1 + td2);
        tl1.to(tNorm, { x: 0, y: 0, rotation: 0, rotateY: ryOn ? 10 : 0, scale: 1, duration: td3, ease: 'power2.inOut' }, td1 + td2);

        /* ── Mouse parallax on the parked fan ──
           Before any scroll, the passes answer the cursor at three different
           speeds (GENERAL 4px, VIP 8px, VVIP 12px) via quickTo — no per-frame
           listeners. Scroll owns the passes the moment the page moves: the
           parallax is gated to the hero park (scrollY < 40) and the scrubbed
           timelines write the transforms during flight. */
        if (!reduced) {
            const makePar = (el) => ({
                x: gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3.out' }),
                y: gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3.out' }),
            });
            const par = {
                general: makePar(tMid),
                vip: makePar(tVip),
                vvip: makePar(tNorm),
            };
            const onPointerMove = (e) => {
                if (window.scrollY > 40) return;
                const nx = (e.clientX / window.innerWidth) * 2 - 1;
                const ny = (e.clientY / window.innerHeight) * 2 - 1;
                par.general.x(nx * 4);
                par.general.y(ny * 3);
                par.vip.x(nx * 8);
                par.vip.y(ny * 6);
                par.vvip.x(nx * 12);
                par.vvip.y(ny * 8);
            };
            window.addEventListener('pointermove', onPointerMove, { passive: true });
            pointerCleanup = () => {
                window.removeEventListener('pointermove', onPointerMove);
                gsap.killTweensOf([tMid, tVip, tNorm]);
            };
        }

        /* The pin-spacer + late font/image settle shift the hero pocket after
           the first measure — re-anchor the parked fan and every takeoff
           keyframe to the settled heroPt so the takeoff starts exactly on the
           slot. Idempotent: re-measures and shifts by the fresh delta each
           rebuild, converging on the final layout. */
        const reanchorTakeoff = () => {
            const pts = measure();
            const dx = pts[0].x - heroPt.x;
            const dy = pts[0].y - heroPt.y;
            if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
                heroPt.x += dx;
                heroPt.y += dy;
                gsap.set(rig, { x: heroPt.x, y: heroPt.y, rotation: 0 });
                tl1.getChildren().forEach((tween) => {
                    if (tween.targets()[0] === rig) {
                        if (typeof tween.vars.x === 'number') tween.vars.x += dx;
                        if (typeof tween.vars.y === 'number') tween.vars.y += dy;
                    }
                });
                leapPt.x += dx;
                leapPt.y += dy;
                /* Re-capture tween start values from the current (re-parked)
                   position on the next render. */
                tl1.invalidate();
            }
        };

        /* Rebuilds (resize / load / events) re-measure and re-wire TL2 only —
           the pin and takeoff stay put, so no spacer compounding. */
        const rebuild = () => {
            reanchorTakeoff();
            buildJourney2();
            ScrollTrigger.refresh();
        };
        const onResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(rebuild, 150);
        };
        window.addEventListener('resize', onResize);
        window.addEventListener('load', rebuild);
        journeyRebuildRef.current = rebuild;

        /* The hero pocket can keep shifting while fonts/images finish — keep
           re-anchoring the takeoff every frame until the layout is quiet: at
           least 4s AND 30 consecutive stable frames, so a late font swap or
           image settle is always caught no matter when it lands. */
        let settleRaf = 0;
        let stableFrames = 0;
        const settleStart = performance.now();
        const settleCheck = () => {
            if (disposed) return;
            const before = { x: heroPt.x, y: heroPt.y };
            reanchorTakeoff();
            const moved = Math.abs(heroPt.x - before.x) > 1 || Math.abs(heroPt.y - before.y) > 1;
            stableFrames = moved ? 0 : stableFrames + 1;
            const elapsed = performance.now() - settleStart;
            if (stableFrames < 30 || elapsed < 4000) settleRaf = requestAnimationFrame(settleCheck);
        };
        settleRaf = requestAnimationFrame(settleCheck);

            dispose = () => {
                window.removeEventListener('resize', onResize);
                window.removeEventListener('load', rebuild);
                cancelAnimationFrame(settleRaf);
                clearTimeout(resizeTimer);
                journeyRebuildRef.current = null;
                if (tl1) {
                    if (tl1.scrollTrigger) tl1.scrollTrigger.kill();
                    tl1.kill();
                    tl1 = null;
                }
                if (tl2) {
                    if (tl2.scrollTrigger) tl2.scrollTrigger.kill();
                    tl2.kill();
                    tl2 = null;
                }
                if (pointerCleanup) {
                    pointerCleanup();
                    pointerCleanup = null;
                }
            };
        };

        /* First build waits for the layout to settle: past the page-enter
           translate AND the display fonts, with a cap so a slow font CDN can
           never leave the fan hidden. */
        let ran = false;
        let deferTimer = null;
        const go = () => {
            if (ran) return;
            ran = true;
            clearTimeout(deferTimer);
            build();
        };
        const MIN_SETTLE = 450;
        const start = Date.now();
        const whenSettled = () => {
            const elapsed = Date.now() - start;
            if (elapsed >= MIN_SETTLE) go();
            else deferTimer = setTimeout(go, MIN_SETTLE - elapsed);
        };
        if (document.fonts && document.fonts.ready) {
            deferTimer = setTimeout(go, 900);
            document.fonts.ready.then(whenSettled).catch(whenSettled);
        } else {
            deferTimer = setTimeout(go, MIN_SETTLE);
        }

        return () => {
            if (dispose) dispose();
            else disposed = true;
            clearTimeout(deferTimer);
            ran = true;
        };
    }, []);

    /* The API events re-render the cards with real heights once loaded —
       re-measure the journey's parked positions then (ScrollTrigger needs
       refresh() after layout changes). */
    useEffect(() => {
        if (!loading && journeyRebuildRef.current) {
            journeyRebuildRef.current();
        }
    }, [loading]);

    const displayEvents = events.length > 0 ? events : demoEvents;

    /* Trending: ranked by tickets already sold this week */
    const trending = [...displayEvents]
        .sort((a, b) => (b.totalSeats - b.availableSeats) - (a.totalSeats - a.availableSeats))
        .slice(0, 4);

    /* Upcoming: a real chronological lineup */
    const upcoming = [...displayEvents]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 6);

    const marqueeItems = [
        ...displayEvents.map((e) => e.title),
        'Lollapalooza India', 'NH7 Weekender', 'Comic Con India', 'Magnetic Fields',
    ];

    const goToSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (heroQuery) params.set('search', heroQuery);
        if (heroCategory) params.set('category', heroCategory);
        if (heroLocation) params.set('location', heroLocation);
        const qs = params.toString();
        push(navigate, qs ? `/events?${qs}` : '/events');
    };

    const subscribe = (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        setSubscribed(true);
    };

    /* Position the cursor poster imperatively (no re-renders per mousemove),
       offset to the right of the pointer and clamped inside the list. */
    const onLineupMove = (e) => {
        const el = lineupPreviewRef.current;
        const list = lineupListRef.current;
        if (!el || !list || !lineupPreview) return;
        const rect = list.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const nx = Math.min(Math.max(12, x + 28), Math.max(12, rect.width - w - 12));
        const ny = Math.min(Math.max(12, y - h / 2), Math.max(12, rect.height - h - 12));
        el.style.transform = `translate3d(${nx}px, ${ny}px, 0)`;
    };

    return (
        <DirectionalTransition>
        <div ref={outerRef} className="relative">
            {/* ═══════════ STAGE · HERO (always night) ═══════════ */}
            <section ref={heroRef} className="relative overflow-hidden bg-[#0b0b14] text-white">
                {/* Static artwork backdrop + legibility wash */}
                <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                    <img src={heroBg} alt="" className="plx-hero-bg h-full w-full object-cover object-center opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b14] via-[#0b0b14]/60 to-[#0b0b14]/25" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b14] via-transparent to-[#0b0b14]/40" />
                </div>
                {/* Dynamic gradient background — drifting aurora */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                    <div className="aurora-blob aurora-a -left-48 -top-40 h-[620px] w-[620px]" />
                    <div className="aurora-blob aurora-b top-1/3 -right-48 h-[560px] w-[560px]" style={{ animationDelay: '-7s' }} />
                    <div className="aurora-blob aurora-c -bottom-52 left-1/3 h-[560px] w-[560px]" style={{ animationDelay: '-13s' }} />
                </div>
                <div className="pointer-events-none absolute inset-0 dots-bg opacity-30" aria-hidden="true" />
                <div className="noise pointer-events-none absolute inset-0" aria-hidden="true" />

                {/* Crowd cutout — foreground parallax layer across the hero floor */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 sm:h-60 lg:h-80" aria-hidden="true">
                    <img
                        src={peoples}
                        alt=""
                        className="plx-hero-crowd h-full w-full object-cover object-bottom opacity-70"
                    />
                </div>

                <div className="hero-content relative mx-auto max-w-7xl px-4 pt-32 pb-14 sm:px-6 sm:pt-40 lg:px-8">
                    <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
                        {/* Left: thesis */}
                        <div className="lg:col-span-7">
                            <span className="hero-el eyebrow inline-flex items-center gap-2.5 text-[11px] text-brand-lime">
                                <Sparkle className="h-3.5 w-3.5" fill="currentColor" />
                                Live events across 40+ cities
                            </span>

                            <h1 className="hero-headline font-display mt-5 text-[3.4rem] uppercase leading-[0.9] tracking-tighter sm:text-8xl lg:text-[6.25rem]">
                                <span className="hero-line block">The ticket</span>
                                <span className="hero-line text-outline block">to your</span>
                                <span className="hero-line text-gradient-sunset block">next night</span>
                            </h1>

                            <p className="hero-sub hero-el mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
                                Concerts, festivals and workshops across India.
                                Your pass is gate-ready before you leave the house.
                            </p>

                            {/* Search */}
                            <form onSubmit={goToSearch} className="hero-cta hero-el mt-8 max-w-2xl">
                                <Magnetic strength={0.06}>
                                    <div className="flex flex-col gap-2 rounded-[2rem] border border-white/15 bg-white/[0.08] p-2 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:flex-row sm:items-center sm:pl-5">
                                        <div className="flex flex-1 items-center gap-2.5">
                                            <Search className="h-5 w-5 shrink-0 text-brand-lime" />
                                            <input
                                                type="text"
                                                value={heroQuery}
                                                onChange={(e) => setHeroQuery(e.target.value)}
                                                placeholder="Search artists, festivals, venues…"
                                                className="w-full bg-transparent py-2.5 text-sm font-semibold text-white placeholder-white/40 outline-none"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="relative flex items-center">
                                                <select
                                                    value={heroCategory}
                                                    onChange={(e) => setHeroCategory(e.target.value)}
                                                    aria-label="Filter by category"
                                                    className="appearance-none rounded-full border border-white/15 bg-white/10 py-2.5 pl-4 pr-9 font-mono text-[11px] font-bold uppercase tracking-wider text-white/85 outline-none transition-colors hover:border-brand-lime/60 focus:border-brand-lime"
                                                >
                                                    <option value="" className="bg-[#14141f] text-white/70">All categories</option>
                                                    {['Music', 'Festivals', 'Workshops', 'Conferences', 'Sports'].map((c) => (
                                                        <option key={c} value={c} className="bg-[#14141f] text-white/70">{c}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-white/50" />
                                            </div>
                                            <div className="relative hidden items-center md:flex">
                                                <select
                                                    value={heroLocation}
                                                    onChange={(e) => setHeroLocation(e.target.value)}
                                                    aria-label="Filter by city"
                                                    className="appearance-none rounded-full border border-white/15 bg-white/10 py-2.5 pl-4 pr-9 font-mono text-[11px] font-bold uppercase tracking-wider text-white/85 outline-none transition-colors hover:border-brand-lime/60 focus:border-brand-lime"
                                                >
                                                    <option value="" className="bg-[#14141f] text-white/70">Any city</option>
                                                    {['Mumbai', 'Goa', 'Bengaluru', 'Delhi', 'Jaipur'].map((l) => (
                                                        <option key={l} value={l} className="bg-[#14141f] text-white/70">{l}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-white/50" />
                                            </div>
                                            <button
                                                type="submit"
                                                className="btn-gradient flex shrink-0 items-center gap-2 rounded-full px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white"
                                            >
                                                Search <ArrowUpRight className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </Magnetic>
                            </form>

                            {/* Quick pills */}
                            <div className="hero-cta hero-el mt-5 flex flex-wrap items-center gap-2 text-[11px] font-bold">
                                <span className="eyebrow mr-1 text-[11px] text-white/40">Popular:</span>
                                {['Concerts', 'Festivals', 'Workshops', 'Conferences', 'Sports', 'More'].map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => push(navigate, `/events?category=${tag === 'More' ? 'Tech' : tag}`)}
                                        className="rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-white/70 transition-all hover:border-brand-lime/70 hover:text-brand-lime"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right: the pass — this page's signature */}
                        <div className="hero-el relative lg:col-span-5">
                            {/* Floating stickers */}
                            <div className="hero-sticker sticker -top-10 right-10 z-20 h-24 w-24 rotate-12 rounded-full bg-brand-lime text-brand-dark shadow-[0_20px_50px_-12px_rgba(166,255,0,0.5)] animate-float">
                                <div className="flex flex-col items-center leading-tight">
                                    <span className="font-display text-sm uppercase">Early</span>
                                    <span className="font-display text-sm uppercase">bird</span>
                                    <span className="font-display text-lg uppercase leading-none">30%</span>
                                </div>
                            </div>
                            <div className="hero-sticker sticker -left-5 top-16 z-20 rounded-[2rem] rounded-bl-md bg-brand-lime px-5 py-3 text-[11px] text-brand-dark shadow-[0_16px_36px_-14px_rgba(166,255,0,0.55)] animate-float-slow">
                                <Sparkle className="mr-1.5 h-3.5 w-3.5 text-brand-dark" fill="currentColor" />
                                Feel the vibe
                            </div>
                            <div className="hero-sticker sticker -right-4 bottom-6 z-20 hidden rounded-[2rem] rounded-tr-md bg-brand-purple px-5 py-3 text-[11px] text-white shadow-[0_16px_36px_-14px_rgba(186,40,226,0.55)] animate-float lg:flex">
                                <Ticket className="mr-1.5 h-3.5 w-3.5 text-brand-lime" />
                                Instant QR pass
                            </div>

                            {/* Doodles */}
                            <motion.span
                                animate={{ rotate: [0, 18, 0], y: [0, -8, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute -top-2 left-8 hidden text-brand-lime md:block"
                            >
                                <Plus className="h-6 w-6" />
                            </motion.span>
                            <motion.span
                                animate={{ rotate: [0, -14, 0], y: [0, 6, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute -bottom-10 -left-10 hidden text-white/25 lg:block"
                            >
                                <Star className="h-7 w-7" fill="currentColor" />
                            </motion.span>
                            <span className="absolute -right-2 top-8 hidden h-8 w-8 rounded-full border-[3px] border-white/20 lg:block" />

                            {/* Reserved space — the three passes park here until scroll flies them to the next section */}
                            <div className="ticket-slot relative mx-auto h-52 w-56 lg:h-96 lg:w-72" aria-hidden="true" />
                        </div>
                    </div>
                </div>

                {/* Lineup marquee — the curtain between stage and content */}
                <div className="marquee-band relative border-white/10 bg-[#0b0b14]/60 py-4 backdrop-blur-sm">
                    <Marquee>
                        {marqueeItems.map((name, i) => (
                            <span key={`${name}-${i}`} className="mx-5 flex items-center gap-5 font-display text-xl uppercase text-white/50 sm:text-2xl">
                                {name}
                                <Sparkle className="h-4 w-4 shrink-0 text-brand-lime/70" fill="currentColor" />
                            </span>
                        ))}
                    </Marquee>
                </div>
            </section>

            {/* ═══════════ STATS ═══════════ */}
            <section className="border-b border-black/5 bg-white dark:border-white/5 dark:bg-dark-page">
                <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
                    {stats.map((s, i) => (
                        <Reveal key={s.label} delay={i * 0.08} className="flex items-center justify-center gap-4 md:border-r md:border-black/10 md:last:border-r-0 dark:md:border-white/10">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${s.chip} ${s.tint}`}>
                                <s.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <Counter to={s.to} suffix={s.suffix} className="font-display text-3xl text-brand-dark sm:text-4xl dark:text-dark-ink" />
                                <div className="eyebrow mt-1 text-[10px] text-gray-400 dark:text-dark-muted">{s.label}</div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ═══════════ FEATURED EVENTS ═══════════ */}
            <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                {/* Parking pocket — the passes land here from the hero */}
                <div className="ticket-slot pointer-events-none absolute -top-7 left-4 h-40 w-28 lg:-left-6 lg:top-24 lg:h-60 lg:w-40" aria-hidden="true" />
                <Reveal>
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <span className="eyebrow text-[11px] text-brand-pink">Hand-picked this week</span>
                            <h2 className="font-display mt-2 text-4xl uppercase leading-none text-brand-dark sm:text-5xl dark:text-dark-ink">
                                Featured <span className="text-gradient-sunset">events</span>
                            </h2>
                            <p className="mt-3 text-sm text-gray-500 dark:text-dark-muted">The shows the crowd is talking about right now.</p>
                        </div>
                        <TransitionLink
                            to="/events"
                            className="group inline-flex items-center gap-2 rounded-full border-[1.5px] border-black/15 px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-gray-700 transition-all hover:border-brand-pink hover:text-brand-pink dark:border-white/20 dark:text-dark-muted dark:hover:border-brand-pink dark:hover:text-brand-pink"
                        >
                            View all events <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </TransitionLink>
                    </div>
                </Reveal>

                <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {displayEvents.slice(0, 4).map((ev, i) => (
                        <Reveal key={ev._id} delay={(i % 4) * 0.08}>
                            <EventCard event={ev} />
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ═══════════ POPULAR CATEGORIES ═══════════ */}
            <section className="relative border-y border-black/5 bg-white py-20 dark:border-white/5 dark:bg-dark-page">
                <div className="ticket-slot pointer-events-none absolute -top-7 right-4 h-40 w-28 lg:-right-6 lg:top-1/3 lg:h-60 lg:w-40" aria-hidden="true" />
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal className="text-center">
                        <h2 className="font-display mt-2 text-4xl uppercase leading-none text-brand-dark sm:text-5xl dark:text-dark-ink">
                            Pick your <span className="text-gradient-sunset">vibe</span>
                        </h2>
                    </Reveal>

                    <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-6">
                        {categories.map((cat, i) => {
                            const active = vibe === cat.name;
                            return (
                                <Reveal key={cat.name} delay={i * 0.07}>
                                    <motion.button
                                        onMouseEnter={() => setVibe(cat.name)}
                                        onMouseLeave={() => setVibe(null)}
                                        onFocus={() => setVibe(cat.name)}
                                        onBlur={() => setVibe(null)}
                                        onClick={() => push(navigate, `/events?category=${cat.name}`)}
                                        animate={{ scale: vibe ? (active ? 1.07 : 0.9) : 1, y: vibe ? (active ? -6 : 0) : 0 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                                        className={`glass-card group relative flex w-full flex-col items-center gap-3 overflow-hidden rounded-3xl border p-6 text-center transition-colors duration-300 ${active ? 'border-brand-purple/40 bg-brand-purple/[0.06] dark:border-brand-purple/50 dark:bg-brand-purple/[0.12]' : 'border-black/5 bg-brand-light dark:border-white/10 dark:bg-white/[0.04]'}`}
                                    >
                                        {/* Ghost wordmark bleeds in behind the active mood */}
                                        <span
                                            className={`pointer-events-none absolute -bottom-4 left-1/2 -translate-x-1/2 font-display text-[68px] uppercase leading-none text-black/[0.05] transition-opacity duration-300 dark:text-white/[0.06] ${active ? 'opacity-100' : 'opacity-0'}`}
                                            aria-hidden="true"
                                        >
                                            {cat.name}
                                        </span>
                                        <div className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl ${cat.tint} shadow-lg transition-transform duration-300 ${active ? 'scale-110 -rotate-6' : ''}`}>
                                            <cat.icon className="h-6 w-6" />
                                        </div>
                                        <div className="relative z-10">
                                            <h3 className="font-display text-base uppercase text-brand-dark dark:text-dark-ink">{cat.name}</h3>
                                            <span className="font-mono text-[11px] font-bold text-gray-400 dark:text-dark-muted">{cat.count}</span>
                                        </div>
                                    </motion.button>
                                </Reveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ═══════════ TRENDING EVENTS ═══════════ */}
            <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                <div className="ticket-slot pointer-events-none absolute -top-7 left-4 h-40 w-28 lg:-left-4 lg:top-16 lg:h-60 lg:w-40" aria-hidden="true" />
                <Reveal>
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h2 className="font-display mt-2 text-4xl uppercase leading-none text-brand-dark sm:text-5xl dark:text-dark-ink">
                                Trending <span className="text-gradient-sunset">this week</span>
                            </h2>
                            <p className="mt-3 text-sm text-gray-500 dark:text-dark-muted">The most-booked shows right now. Seats are moving.</p>
                        </div>
                    </div>
                </Reveal>

                <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
                    {trending.map((ev, i) => (
                        <div key={ev._id} className="relative w-[300px] shrink-0 snap-start sm:w-[320px]">
                            <span
                                className={`font-display pointer-events-none absolute -top-9 left-2 z-0 text-8xl leading-none text-black/10 dark:text-white/10 ${i === 0 ? 'text-brand-orange/25 dark:text-brand-orange/25' : ''}`}
                                aria-hidden="true"
                            >
                                {i + 1}
                            </span>
                            <div className="relative z-10">
                                <EventCard event={ev} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════ UPCOMING · THE LINEUP ═══════════ */}
            <section className="relative border-y border-black/5 bg-white py-20 dark:border-white/5 dark:bg-dark-page">
                <div className="ticket-slot pointer-events-none absolute -top-7 right-4 h-40 w-28 lg:-right-4 lg:top-1/2 lg:h-60 lg:w-40" aria-hidden="true" />
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal>
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <span className="eyebrow text-[11px] text-brand-purple">What's on next, in order</span>
                                <h2 className="font-display mt-2 text-4xl uppercase leading-none text-brand-dark sm:text-5xl dark:text-dark-ink">
                                    The <span className="text-gradient-sunset">lineup</span>
                                </h2>
                                <p className="mt-3 text-sm text-gray-500 dark:text-dark-muted">Dates, venues and live seat counts. Grab yours before the meter empties.</p>
                            </div>
                            <TransitionLink
                                to="/events"
                                className="group inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-600 transition-colors hover:text-brand-purple dark:text-dark-muted dark:hover:text-brand-purple"
                            >
                                View all events <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </TransitionLink>
                        </div>
                    </Reveal>

                    <div
                        ref={lineupListRef}
                        onMouseMove={onLineupMove}
                        onMouseLeave={() => setLineupPreview(null)}
                        className="relative mt-10 overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-[0_20px_60px_-30px_rgba(13,13,17,0.25)] dark:border-white/10 dark:bg-white/[0.03]"
                    >
                        {/* Cursor poster — follows the pointer across the rows (desktop) */}
                        <div className="pointer-events-none absolute inset-0 z-20 hidden sm:block" aria-hidden="true">
                            <div
                                ref={lineupPreviewRef}
                                className={`absolute left-0 top-0 h-44 w-60 overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_24px_60px_-20px_rgba(13,13,17,0.5)] transition-opacity duration-200 dark:border-white/10 dark:bg-dark-surface ${lineupPreview ? 'opacity-100' : 'opacity-0'}`}
                            >
                                <img
                                    src={lineupPreview?.image || lineupFallbackImg}
                                    alt=""
                                    onError={(e) => { e.target.src = lineupFallbackImg; }}
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                                <div className="absolute bottom-3 left-4 right-4">
                                    <div className="font-display truncate text-sm uppercase leading-tight text-white">
                                        {lineupPreview?.title || 'Event'}
                                    </div>
                                    <div className="mt-1 flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-white/70">
                                        <span>{lineupPreview?.ticketPrice ? `₹${lineupPreview.ticketPrice}` : 'Free'}</span>
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-2.5 w-2.5" />
                                            {lineupPreview?.location || 'TBA'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {loading ? (
                            <div className="space-y-0 p-6">
                                {[1, 2, 3, 4].map((n) => (
                                    <div key={n} className="skeleton mb-4 h-20 w-full rounded-2xl" />
                                ))}
                            </div>
                        ) : (
                            upcoming.map((ev, i) => {
                                const d = new Date(ev.date);
                                const day = Number.isNaN(d.getTime()) ? '--' : d.getDate();
                                const month = Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString(undefined, { month: 'short' });
                                const year = Number.isNaN(d.getTime()) ? '' : d.getFullYear();
                                const available = ev.availableSeats ?? ev.totalSeats ?? 50;
                                const total = ev.totalSeats ?? 100;
                                const pct = Math.round((available / total) * 100);
                                const low = available > 0 && available <= 15;
                                const soldOut = available <= 0;
                                return (
                                    <TransitionLink
                                        key={ev._id}
                                        to={`/events/${ev._id}`}
                                        onMouseEnter={() => setLineupPreview(ev)}
                                        onMouseLeave={() => setLineupPreview(null)}
                                        className={`group grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-2 px-5 py-5 transition-colors hover:bg-black/[0.03] sm:grid-cols-[120px_1fr_120px_auto] sm:gap-x-8 sm:px-8 dark:hover:bg-white/[0.05] ${i !== 0 ? 'border-t border-black/5 dark:border-white/10' : ''}`}
                                    >
                                        {/* Date block */}
                                        <div className="flex items-center gap-3">
                                            <span className="font-display text-4xl leading-none text-brand-dark dark:text-white">{day}</span>
                                            <span className="font-mono text-[11px] uppercase leading-tight text-gray-400 dark:text-dark-muted">
                                                <span className="block">{month}</span>
                                                <span className="block">{year}</span>
                                            </span>
                                        </div>

                                        {/* Title + venue */}
                                        <div className="min-w-0">
                                            <h3 className="font-display truncate text-lg uppercase leading-tight tracking-wide text-brand-dark transition-colors group-hover:text-brand-pink sm:text-xl dark:text-dark-ink dark:group-hover:text-brand-pink">
                                                {ev.title}
                                            </h3>
                                            <div className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-gray-400 dark:text-dark-muted">
                                                <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-orange" />
                                                <span className="truncate">{ev.location || 'Venue TBA'}</span>
                                            </div>
                                        </div>

                                        {/* Seats meter */}
                                        <div className="hidden w-full sm:block">
                                            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider">
                                                <span className="text-gray-400 dark:text-dark-muted">Seats left</span>
                                                <span className={soldOut ? 'font-bold text-red-500' : low ? 'font-bold text-brand-orange' : 'font-bold text-brand-lime-deep dark:text-brand-lime'}>
                                                    {soldOut ? 'Sold out' : available}
                                                </span>
                                            </div>
                                            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                                                <div
                                                    className={`h-full rounded-full ${soldOut ? 'bg-red-500' : low ? 'bg-brand-orange' : 'bg-sunset'}`}
                                                    style={{ width: `${Math.min(100, Math.max(5, pct))}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Price + arrow */}
                                        <div className="col-span-2 flex items-center gap-4 justify-self-end sm:col-span-1">
                                            <div className="text-right">
                                                <span className="block font-display text-xl leading-none text-brand-dark dark:text-white">{ev.ticketPrice ? `₹${ev.ticketPrice}` : 'Free'}</span>
                                                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-400 dark:text-dark-muted">{ev.ticketPrice ? 'from' : 'entry'}</span>
                                            </div>
                                            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-gray-500 transition-all group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:from-brand-orange group-hover:via-brand-pink group-hover:to-brand-purple group-hover:text-white dark:border-white/15 dark:text-dark-muted">
                                                <ArrowUpRight className="h-4 w-4" />
                                            </span>
                                        </div>
                                    </TransitionLink>
                                );
                            })
                        )}
                    </div>
                </div>
            </section>

            {/* ═══════════ WHY EVENTRIX ═══════════ */}
            <section ref={whyRef} className="why-section relative overflow-hidden py-24">
                <div className="ticket-slot pointer-events-none absolute -top-7 left-4 h-40 w-28 lg:-left-6 lg:top-1/3 lg:h-60 lg:w-40" aria-hidden="true" />
                <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                    <div className="aurora-blob aurora-b -right-48 top-1/4 h-[480px] w-[480px]" />
                    <div className="aurora-blob aurora-c -left-40 bottom-0 h-[420px] w-[420px]" />
                </div>

                {/* Floating festival illustrations */}
                <div className="plx-dj pointer-events-none absolute right-[5%] top-16 hidden w-40 opacity-90 xl:block" aria-hidden="true">
                    <motion.img
                        src={djImg}
                        alt=""
                        animate={{ y: [0, -14, 0], rotate: [0, -3, 0] }}
                        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-full object-contain drop-shadow-[0_30px_40px_rgba(186,40,226,0.35)]"
                    />
                </div>
                <div className="plx-mic pointer-events-none absolute -left-8 top-20 hidden w-24 lg:block" aria-hidden="true">
                    <motion.img
                        src={micImg}
                        alt=""
                        animate={{ y: [0, -10, 0], rotate: [0, 4, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-full object-contain drop-shadow-[0_20px_30px_rgba(255,45,122,0.3)]"
                    />
                </div>
                <div className="plx-phone pointer-events-none absolute -right-6 top-2/3 hidden w-24 lg:block" aria-hidden="true">
                    <motion.img
                        src={headphonesImg}
                        alt=""
                        animate={{ y: [0, -12, 0], rotate: [0, -5, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-full object-contain drop-shadow-[0_20px_30px_rgba(0,229,255,0.3)]"
                    />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal className="text-center">
                        <h2 className="font-display mt-2 text-4xl uppercase leading-none text-brand-dark sm:text-5xl dark:text-dark-ink">
                            Built for the <span className="text-gradient-sunset">night out</span>
                        </h2>
                    </Reveal>

                    <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {whyFeatures.map((f, i) => (
                            <Reveal key={f.title} delay={i * 0.08}>
                                <div className="glass-card h-full rounded-[2rem] border border-black/5 bg-white p-7 dark:border-white/10 dark:bg-white/[0.04]">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${f.chip} ${f.tint}`}>
                                        <f.icon className="h-6 w-6" />
                                    </div>
                                    <h4 className="mt-5 font-display text-lg uppercase tracking-wide text-brand-dark dark:text-dark-ink">{f.title}</h4>
                                    <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-dark-muted">{f.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ TESTIMONIALS ═══════════ */}
            <section className="relative border-y border-black/5 bg-white py-20 dark:border-white/5 dark:bg-dark-page">
                <div className="ticket-slot pointer-events-none absolute -top-7 right-4 h-40 w-28 lg:-right-6 lg:top-1/2 lg:h-60 lg:w-40" aria-hidden="true" />
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <Reveal className="text-center">
                        <h2 className="font-display mt-2 text-4xl uppercase leading-none text-brand-dark sm:text-5xl dark:text-dark-ink">
                            Loved by <span className="text-gradient-sunset">the crowd</span>
                        </h2>
                    </Reveal>

                    <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                        {testimonials.map((t, i) => (
                            <Reveal key={t.name} delay={i * 0.1}>
                                <div className="glass-card flex h-full flex-col rounded-[2rem] border border-black/5 bg-white p-7 dark:border-white/10 dark:bg-white/[0.04]">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, s) => (
                                            <Star key={s} className="h-4 w-4 text-brand-orange" fill="currentColor" />
                                        ))}
                                    </div>
                                    <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-600 dark:text-dark-muted">"{t.quote}"</p>
                                    <div className="mt-6 flex items-center gap-3 border-t border-black/5 pt-5 dark:border-white/10">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-orange via-brand-pink to-brand-purple font-mono text-sm font-bold text-white">
                                            {t.initials}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-brand-dark dark:text-dark-ink">{t.name}</h4>
                                            <p className="font-mono text-[11px] font-bold text-gray-400 dark:text-dark-muted">{t.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ NEWSLETTER ═══════════ */}
            <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                <div className="ticket-slot pointer-events-none absolute -top-7 left-4 h-40 w-28 lg:-left-2 lg:top-1/2 lg:h-64 lg:w-44" aria-hidden="true" />
                <Reveal>
                    <div className="relative overflow-hidden rounded-[2.5rem] border border-black/5 bg-white px-6 py-16 text-center sm:px-12 dark:border-white/10 dark:bg-white/[0.04]">
                        {/* Gradient glow */}
                        <div className="pointer-events-none absolute -top-48 left-1/2 h-80 w-[130%] -translate-x-1/2 bg-gradient-to-r from-brand-orange/25 via-brand-pink/25 to-brand-purple/25 blur-[110px]" aria-hidden="true" />
                        <div className="pointer-events-none absolute inset-0 dots-bg opacity-25" aria-hidden="true" />

                        <div className="relative mx-auto max-w-xl">
                            <h2 className="font-display mt-3 text-4xl uppercase leading-[0.95] text-brand-dark sm:text-5xl dark:text-dark-ink">
                                Passes drop <span className="text-gradient-sunset">early</span>
                            </h2>
                            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-gray-500 dark:text-dark-muted">
                                Early-bird pricing and secret gigs, before they hit the feed. Join 500K+ people who never miss a drop.
                            </p>

                            {subscribed ? (
                                <p className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full bg-brand-lime px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-brand-dark">
                                    <Sparkle className="h-4 w-4" fill="currentColor" /> You're on the list. Watch your inbox
                                </p>
                            ) : (
                                <form onSubmit={subscribe} className="mx-auto mt-8 flex max-w-md flex-col gap-2 rounded-[2rem] border border-black/10 bg-brand-light p-1.5 sm:flex-row sm:items-center sm:pl-5 dark:border-white/10 dark:bg-white/[0.06]">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        aria-label="Email address"
                                        className="w-full bg-transparent py-2.5 text-sm font-semibold text-brand-dark placeholder-gray-400 outline-none dark:text-dark-ink dark:placeholder-dark-muted"
                                    />
                                    <button
                                        type="submit"
                                        className="btn-gradient shrink-0 rounded-full px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white"
                                    >
                                        Get early access
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </Reveal>
            </section>

            {/* Footer lives in App.jsx */}

            {/* ═══════════ THE THREE PASSES ═══════════
               A page-wide layer holding the vip / mid / normal passes. They
               start parked on the hero slot and are flown slot-to-slot by the
               GSAP journey above, always arriving in the next section's
               reserved pocket. */}
            <div ref={rigRef} className="ticket-rig" aria-hidden="true">
                {/* GSAP owns each pass's transform during the flight — the left
                    swings right, the right swings left, the VIP runs straight. */}
                <div className="ticket-fan scale-[0.62] sm:scale-[0.78] lg:scale-[0.95]">
                    <img src={midTicket} alt="" draggable={false} className="ticket-img ticket-mid" />
                    <img src={normalTicket} alt="" draggable={false} className="ticket-img ticket-normal" />
                    <img src={vipTicket} alt="" draggable={false} className="ticket-img ticket-vip" />
                </div>
            </div>
        </div>
        </DirectionalTransition>
    );
};

export default Home;
