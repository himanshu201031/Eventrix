import React from 'react';
import { Link } from 'react-router-dom';
import { FaTicketAlt, FaTwitter, FaInstagram, FaDiscord, FaGithub, FaHeart } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';

const Footer = () => {
    return (
        <footer className="bg-[#05070c] text-gray-400 pt-16 pb-12 border-t border-white/10 relative overflow-hidden mt-auto">
            {/* Ambient Background Glow */}
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/10 blur-[120px] pointer-events-none rounded-full" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
                    {/* Brand column */}
                    <div className="lg:col-span-2 space-y-4">
                        <Link to="/" className="inline-flex items-center gap-2.5 text-2xl font-black text-white tracking-tight">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                                <FaTicketAlt className="text-lg -rotate-12" />
                            </div>
                            <span>EVENT<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">RIX</span></span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm font-normal">
                            The next-generation event discovery and ticket booking engine. Connecting music lovers, tech innovators, and culture creators to unforgettable real-world experiences.
                        </p>

                        <div className="flex items-center gap-3 pt-2">
                            <a href="#twitter" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-purple-600/20 hover:text-purple-400 flex items-center justify-center text-gray-400 transition-all border border-white/5 hover:border-purple-500/30">
                                <FaTwitter />
                            </a>
                            <a href="#instagram" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-pink-600/20 hover:text-pink-400 flex items-center justify-center text-gray-400 transition-all border border-white/5 hover:border-pink-500/30">
                                <FaInstagram />
                            </a>
                            <a href="#discord" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-indigo-600/20 hover:text-indigo-400 flex items-center justify-center text-gray-400 transition-all border border-white/5 hover:border-indigo-500/30">
                                <FaDiscord />
                            </a>
                            <a href="#github" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white flex items-center justify-center text-gray-400 transition-all border border-white/5">
                                <FaGithub />
                            </a>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div>
                        <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 flex items-center gap-1.5">
                            <HiSparkles className="text-purple-400 text-xs" /> Discover
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link to="/events?category=Music" className="hover:text-purple-400 transition-colors">Music Festivals</Link></li>
                            <li><Link to="/events?category=Tech" className="hover:text-purple-400 transition-colors">Tech Conferences</Link></li>
                            <li><Link to="/events?category=Arts" className="hover:text-purple-400 transition-colors">Art & Exhibitions</Link></li>
                            <li><Link to="/events?category=Food" className="hover:text-purple-400 transition-colors">Food & Drink</Link></li>
                            <li><Link to="/events?category=Gaming" className="hover:text-purple-400 transition-colors">Gaming & Esports</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 flex items-center gap-1.5">
                            Platform
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link to="/events" className="hover:text-purple-400 transition-colors">All Events</Link></li>
                            <li><Link to="/dashboard" className="hover:text-purple-400 transition-colors">User Dashboard</Link></li>
                            <li><Link to="/admin" className="hover:text-purple-400 transition-colors">Host an Event</Link></li>
                            <li><Link to="/login" className="hover:text-purple-400 transition-colors">Sign In</Link></li>
                            <li><Link to="/register" className="hover:text-purple-400 transition-colors">Create Account</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
                            Stay Updated
                        </h4>
                        <p className="text-xs text-gray-400 mb-3">
                            Subscribe for early bird drops, secret lineups & VIP ticket alerts.
                        </p>
                        <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to Eventrix VIP alerts!'); }} className="space-y-2">
                            <input
                                type="email"
                                required
                                placeholder="Enter your email"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                            />
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-2 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-purple-500/20"
                            >
                                Join VIP List
                            </button>
                        </form>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-gray-500">
                    <div className="flex items-center gap-2">
                        <span>&copy; {new Date().getFullYear()} Eventrix Platform. All rights reserved.</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-emerald-400 font-semibold text-[11px]">Systems Operational</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <a href="#privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
                        <a href="#terms" className="hover:text-gray-300 transition-colors">Terms of Service</a>
                        <a href="#cookies" className="hover:text-gray-300 transition-colors">Cookie Settings</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
