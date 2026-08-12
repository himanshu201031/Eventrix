import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkle, AtSign, Camera, Play, Globe } from 'lucide-react';
import { Reveal } from '../animations';

const socials = [
    { icon: Camera, label: 'Instagram' },
    { icon: AtSign, label: 'Twitter / X' },
    { icon: Play, label: 'YouTube' },
    { icon: Globe, label: 'Website' },
];

const Footer = () => {
    return (
        <footer className="px-4 sm:px-6 lg:px-8 pb-6 pt-4">
            <Reveal y={48}>
                <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-black/10 bg-white dark:border-dark-line dark:bg-dark-surface">
                    {/* Solid accent top edge */}
                    <div className="absolute inset-x-0 top-0 h-1.5 bg-brand-purple" />
                    <div className="absolute -top-24 right-10 h-64 w-64 rounded-full bg-brand-purple/10" />
                    <div className="absolute bottom-0 -left-16 h-56 w-56 rounded-full bg-brand-pink/10" />

                    <div className="relative grid grid-cols-1 gap-12 p-8 sm:p-12 lg:p-16 lg:grid-cols-12">
                        {/* Brand */}
                        <div className="lg:col-span-5 space-y-6">
                            <Link to="/" className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-purple shadow-[0_8px_22px_-8px_rgba(186,40,226,0.5)]">
                                    <Sparkle className="h-6 w-6 text-white" fill="white" />
                                </div>
                                <div className="leading-none">
                                    <span className="font-display text-3xl tracking-wide text-brand-dark uppercase dark:text-dark-ink">eventrix</span>
                                    <span className="mt-1 block text-[9px] font-black uppercase tracking-[0.28em] text-brand-gray-400">
                                        Good vibes only
                                    </span>
                                </div>
                            </Link>
                            <p className="max-w-sm text-sm leading-relaxed text-gray-500 dark:text-dark-muted">
                                Discover epic events, book your tickets and create unforgettable memories.
                                Concerts, festivals, workshops and conferences — all in one place.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="rounded-full bg-brand-purple px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-white">
                                    10K+ Events
                                </span>
                                <span className="rounded-full bg-brand-lime px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-brand-dark">
                                    500K+ Users
                                </span>
                                <span className="rounded-full bg-brand-light border border-black/10 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-brand-gray-700 dark:border-dark-line dark:bg-dark-surface-2 dark:text-dark-muted">
                                    98% Happy
                                </span>
                            </div>
                        </div>

                        {/* Link columns */}
                        <div className="lg:col-span-4 grid grid-cols-2 gap-8 text-sm">
                            <div className="space-y-3">
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-brand-gray-400 dark:text-dark-muted">Explore</h4>
                                <ul className="space-y-2.5 font-semibold text-brand-gray-700 dark:text-dark-muted">
                                    <li><Link to="/" className="transition-colors hover:text-brand-purple">Home</Link></li>
                                    <li><Link to="/events" className="transition-colors hover:text-brand-purple">All Events</Link></li>
                                    <li><Link to="/events?category=Music" className="transition-colors hover:text-brand-purple">Music</Link></li>
                                    <li><Link to="/events?category=Tech" className="transition-colors hover:text-brand-purple">Conferences</Link></li>
                                </ul>
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-brand-gray-400 dark:text-dark-muted">Account</h4>
                                <ul className="space-y-2.5 font-semibold text-brand-gray-700 dark:text-dark-muted">
                                    <li><Link to="/dashboard" className="transition-colors hover:text-brand-purple">My Tickets</Link></li>
                                    <li><Link to="/dashboard" className="transition-colors hover:text-brand-purple">Invoices</Link></li>
                                    <li><Link to="/register" className="transition-colors hover:text-brand-purple">Sign Up</Link></li>
                                    <li><Link to="/login" className="transition-colors hover:text-brand-purple">Log In</Link></li>
                                </ul>
                            </div>
                        </div>

                        {/* Newsletter + socials */}
                        <div className="lg:col-span-3 space-y-5">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-brand-gray-400 dark:text-dark-muted">Stay in the loop</h4>
                            <p className="text-sm text-gray-500 dark:text-dark-muted">Get early-bird drops and festival news first.</p>
                            <form
                                onSubmit={(e) => e.preventDefault()}
                                className="space-y-3"
                            >
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="w-full rounded-2xl border border-black/10 bg-brand-light px-4 py-3 text-sm text-brand-dark placeholder-gray-400 outline-none transition-colors focus:border-brand-purple dark:border-dark-line dark:bg-dark-surface-2 dark:text-dark-ink dark:placeholder-dark-muted"
                                />
                                <button className="btn-gradient w-full rounded-2xl py-3 text-xs font-extrabold uppercase tracking-wider text-white">
                                    Subscribe
                                </button>
                            </form>
                            <div className="flex gap-2.5">
                                {socials.map(({ icon: Icon, label }) => (
                                    <a
                                        key={label}
                                        href="#"
                                        onClick={(e) => e.preventDefault()}
                                        title={label}
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-light border border-black/10 text-brand-gray-700 transition-all hover:bg-brand-purple hover:text-white dark:border-dark-line dark:bg-dark-surface-2 dark:text-dark-muted"
                                    >
                                        <Icon className="h-4 w-4" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="relative border-t border-black/10 px-8 sm:px-12 lg:px-16 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 dark:border-dark-line">
                        <p className="text-xs font-semibold text-brand-gray-400 dark:text-dark-muted">
                            © {new Date().getFullYear()} Eventrix. All rights reserved.
                        </p>
                        <div className="flex items-center gap-5 text-xs font-semibold text-brand-gray-400 dark:text-dark-muted">
                            <span className="transition-colors hover:text-brand-dark cursor-pointer dark:hover:text-dark-ink">Privacy</span>
                            <span className="transition-colors hover:text-brand-dark cursor-pointer dark:hover:text-dark-ink">Terms</span>
                            <span className="flex items-center gap-1.5 text-brand-purple font-black uppercase">
                                <span className="h-1.5 w-1.5 rounded-full bg-brand-lime animate-pulse" /> Good vibes only
                            </span>
                        </div>
                    </div>
                </div>
            </Reveal>
        </footer>
    );
};

export default Footer;
