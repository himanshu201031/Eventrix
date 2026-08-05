import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaInstagram, FaDiscord, FaGithub, FaPlay } from 'react-icons/fa6';
import { HiSparkles } from 'react-icons/hi2';

const Footer = () => {
    // Countdown timer matching reference image footer widget
    const [timeLeft, setTimeLeft] = useState({ days: '02', hours: '22', mins: '48', secs: '55' });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const secs = String(59 - now.getSeconds()).padStart(2, '0');
            const mins = String(59 - now.getMinutes()).padStart(2, '0');
            const hours = String((23 - now.getHours()) % 24).padStart(2, '0');
            setTimeLeft({ days: '02', hours, mins, secs });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Electric Purple Container Box (Exact match to reference image bottom section) */}
            <div className="bg-[#8522FF] text-white rounded-[2.5rem] p-8 sm:p-12 lg:p-14 relative overflow-hidden shadow-2xl space-y-12">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border-b border-white/20 pb-10">

                    {/* Left Brand Identity */}
                    <div className="space-y-4 max-w-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-white text-[#8522FF] font-black text-2xl flex items-center justify-center shadow-lg">
                                ⌘
                            </div>
                            <div>
                                <h3 className="font-display font-black text-2xl tracking-tighter uppercase leading-none">
                                    WORLD GAME AWARDS®
                                </h3>
                                <span className="text-[10px] font-bold tracking-widest text-purple-200 uppercase">
                                    EVENTRIX SHOWCASE 2026
                                </span>
                            </div>
                        </div>
                        <p className="text-purple-100 text-xs leading-relaxed font-normal">
                            Connecting music festivals, tech summit showcases, developer awards, and gaming communities worldwide.
                        </p>
                    </div>

                    {/* Footer Navigation Columns */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
                        <div className="space-y-3">
                            <h4 className="font-extrabold uppercase tracking-wider text-purple-200">Main Menu</h4>
                            <ul className="space-y-2 font-semibold">
                                <li><Link to="/" className="hover:underline">Home</Link></li>
                                <li><Link to="/events" className="hover:underline">Categories & Events</Link></li>
                                <li><Link to="/events?category=Music" className="hover:underline">Music Festivals</Link></li>
                                <li><Link to="/events?category=Tech" className="hover:underline">Tech Summits</Link></li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-extrabold uppercase tracking-wider text-purple-200">Results</h4>
                            <ul className="space-y-2 font-semibold">
                                <li><Link to="/events?category=Gaming" className="hover:underline">Main Stage</Link></li>
                                <li><Link to="/events" className="hover:underline">Award Categories</Link></li>
                                <li><Link to="/dashboard" className="hover:underline">User Dashboard</Link></li>
                                <li><Link to="/admin" className="hover:underline">Admin Console</Link></li>
                            </ul>
                        </div>

                        <div className="space-y-3 col-span-2 sm:col-span-1">
                            <h4 className="font-extrabold uppercase tracking-wider text-purple-200">Live Widget</h4>
                            {/* Inline Countdown Box */}
                            <div className="bg-black/30 backdrop-blur-md p-3.5 rounded-2xl space-y-2 border border-white/10">
                                <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-widest text-purple-200">
                                    <span>LIVE STREAM</span>
                                    <span className="bg-[#D2FF00] text-black px-2 py-0.5 rounded-full font-black text-[9px] flex items-center gap-1">
                                        JOIN NOW <FaPlay className="text-[7px]" />
                                    </span>
                                </div>
                                <div className="font-display font-black text-sm tracking-wider text-white">
                                    {timeLeft.days} : {timeLeft.hours} : {timeLeft.mins} : {timeLeft.secs}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Pill Badges Left, Copyright & Social Icons Right */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                    {/* Pill Badges (Matched from reference image) */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3.5 py-1.5 rounded-full bg-white text-black font-extrabold text-[10px] uppercase tracking-wider">
                            140+ EVENTS
                        </span>
                        <span className="px-3.5 py-1.5 rounded-full bg-[#D2FF00] text-black font-extrabold text-[10px] uppercase tracking-wider">
                            20K+ ATTENDEES
                        </span>
                        <span className="px-3.5 py-1.5 rounded-full bg-black/40 text-white font-extrabold text-[10px] uppercase tracking-wider border border-white/20">
                            75+ HOSTS
                        </span>
                    </div>

                    {/* Copyright & Social Media Icons */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 text-xs font-bold text-purple-200">
                        <span>&copy; {new Date().getFullYear()} EVENTRIX SHOWCASE. ALL RIGHTS RESERVED.</span>

                        <div className="flex items-center gap-2">
                            <a href="#twitter" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white hover:text-[#8522FF] flex items-center justify-center transition-all">
                                <FaTwitter className="text-xs" />
                            </a>
                            <a href="#instagram" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white hover:text-[#8522FF] flex items-center justify-center transition-all">
                                <FaInstagram className="text-xs" />
                            </a>
                            <a href="#discord" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white hover:text-[#8522FF] flex items-center justify-center transition-all">
                                <FaDiscord className="text-xs" />
                            </a>
                            <a href="#github" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white hover:text-[#8522FF] flex items-center justify-center transition-all">
                                <FaGithub className="text-xs" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
