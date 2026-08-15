import React from 'react';
import { Sparkle, Camera, AtSign, Play, Globe } from 'lucide-react';
import { TransitionLink } from './Transitions';
import { RuixenGradientFooter } from './ui/ruixen-gradient-footer';

const socials = [
    { icon: Camera, label: 'Instagram' },
    { icon: AtSign, label: 'Twitter / X' },
    { icon: Play, label: 'YouTube' },
    { icon: Globe, label: 'Website' },
];

const exploreLinks = [
    { to: '/', label: 'Home' },
    { to: '/events', label: 'All Events' },
    { to: '/events?category=Music', label: 'Music' },
    { to: '/events?category=Tech', label: 'Conferences' },
];

const accountLinks = [
    { to: '/dashboard', label: 'My Tickets' },
    { to: '/dashboard', label: 'Invoices' },
    { to: '/register', label: 'Join' },
    { to: '/login', label: 'Log In' },
];

const Footer = () => {
    return (
        <RuixenGradientFooter gradientHeight="48vh">
            <div className="mx-auto w-full max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
                <div className="grid gap-12 pb-12 sm:grid-cols-2 lg:grid-cols-6">
                    {/* Brand + newsletter */}
                    <div className="space-y-7 lg:col-span-2">
                        <TransitionLink to="/" className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-purple shadow-[0_8px_22px_-8px_rgba(186,40,226,0.5)]">
                                <Sparkle className="h-6 w-6 text-white" fill="white" />
                            </div>
                            <div className="leading-none">
                                <span className="font-display text-3xl tracking-wide text-brand-dark uppercase dark:text-dark-ink">
                                    eventrix
                                </span>
                                <span className="mt-1 block text-[9px] font-black uppercase tracking-[0.28em] text-brand-gray-400">
                                    Good vibes only
                                </span>
                            </div>
                        </TransitionLink>
                        <p className="max-w-sm text-sm leading-relaxed text-gray-500 dark:text-dark-muted">
                            Discover epic events, book your tickets and create unforgettable memories.
                            Concerts, festivals, workshops and conferences, all in one place.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="rounded-full bg-brand-purple px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-white">
                                10K+ Events
                            </span>
                            <span className="rounded-full bg-brand-lime px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-brand-dark">
                                500K+ Users
                            </span>
                            <span className="rounded-full border border-black/10 bg-brand-light px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-brand-gray-700 dark:border-dark-line dark:bg-dark-surface-2 dark:text-dark-muted">
                                98% Happy
                            </span>
                        </div>
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-brand-gray-400 dark:text-dark-muted">
                                Stay in the loop
                            </h4>
                            <form onSubmit={(e) => e.preventDefault()} className="mt-3 space-y-3">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    aria-label="Email address for newsletter"
                                    className="w-full rounded-2xl border border-black/10 bg-brand-light px-4 py-3 text-sm text-brand-dark placeholder-gray-400 outline-none transition-colors focus:border-brand-purple dark:border-dark-line dark:bg-dark-surface-2 dark:text-dark-ink dark:placeholder-dark-muted"
                                />
                                <button className="btn-gradient w-full rounded-2xl py-3 text-xs font-extrabold uppercase tracking-wider text-white">
                                    Subscribe
                                </button>
                            </form>
                        </div>
                        <div className="flex gap-2.5">
                            {socials.map(({ icon: Icon, label }) => (
                                <a
                                    key={label}
                                    href="#"
                                    onClick={(e) => e.preventDefault()}
                                    title={label}
                                    aria-label={label}
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-brand-light text-brand-gray-700 transition-all hover:bg-brand-purple hover:text-white dark:border-dark-line dark:bg-dark-surface-2 dark:text-dark-muted"
                                >
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    <nav
                        aria-label="Footer"
                        className="grid grid-cols-2 gap-10 text-sm lg:col-span-4 lg:pl-16"
                    >
                        <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-brand-gray-400 dark:text-dark-muted">
                                Explore
                            </h4>
                            <ul className="space-y-3 font-semibold text-brand-gray-700 dark:text-dark-muted">
                                {exploreLinks.map((link) => (
                                    <li key={link.label}>
                                        <TransitionLink
                                            to={link.to}
                                            className="transition-colors hover:text-brand-purple dark:hover:text-brand-lime"
                                        >
                                            {link.label}
                                        </TransitionLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-brand-gray-400 dark:text-dark-muted">
                                Account
                            </h4>
                            <ul className="space-y-3 font-semibold text-brand-gray-700 dark:text-dark-muted">
                                {accountLinks.map((link) => (
                                    <li key={link.label}>
                                        <TransitionLink
                                            to={link.to}
                                            className="transition-colors hover:text-brand-purple dark:hover:text-brand-lime"
                                        >
                                            {link.label}
                                        </TransitionLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </nav>
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col items-center justify-between gap-3 border-t border-black/10 py-6 font-semibold text-brand-gray-400 sm:flex-row dark:border-dark-line dark:text-dark-muted">
                    <p className="text-xs">© {new Date().getFullYear()} Eventrix. All rights reserved.</p>
                    <div className="flex items-center gap-5 text-xs">
                        <span className="cursor-pointer transition-colors hover:text-brand-dark dark:hover:text-dark-ink">Privacy</span>
                        <span className="cursor-pointer transition-colors hover:text-brand-dark dark:hover:text-dark-ink">Terms</span>
                    </div>
                    <span className="text-xs font-black uppercase text-brand-purple dark:text-brand-lime">
                        Good vibes only
                    </span>
                </div>
            </div>
        </RuixenGradientFooter>
    );
};

export default Footer;
