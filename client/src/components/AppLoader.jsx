import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkle } from 'lucide-react';

/* Rotating mono captions — the loader reads as a real moment, not a spinner */
const captions = ['booking the lineup', 'warming up the stage', 'checking the sound', 'passes loading'];

/* Full-screen branded loader shown while the app boots. `progress` (0-100) is
   driven by App.jsx from real boot signals, so the percentage is honest and
   hits 100 exactly when the home page has finished loading. The parent mounts
   it inside <AnimatePresence> so the exit fade plays before it unmounts. */
const AppLoader = ({ progress = 0 }) => {
    const [caption, setCaption] = useState(0);
    const pct = Math.round(Math.min(100, Math.max(0, progress)));

    useEffect(() => {
        const id = setInterval(() => setCaption((c) => (c + 1) % captions.length), 480);
        return () => clearInterval(id);
    }, []);

    return (
        <motion.div
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-[#0b0b14]"
            role="status"
            aria-label="Loading Eventrix"
        >
            {/* Brand mark */}
            <motion.div
                animate={{ scale: [1, 1.07, 1], rotate: [0, 4, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-purple shadow-[0_16px_40px_-12px_rgba(186,40,226,0.6)]"
            >
                <Sparkle className="h-8 w-8 text-white" fill="white" />
            </motion.div>

            <div className="font-display mt-6 text-4xl uppercase tracking-wide text-white">eventrix</div>
            <div className="eyebrow mt-1.5 text-[10px] text-white/40">Live experiences</div>

            {/* Progress: percentage readout + determinate bar (scaleX sweep,
                not layout-animated width) */}
            <div className="mt-8 w-48">
                <div className="flex items-end justify-between font-mono text-[10px] uppercase tracking-widest">
                    <span className="text-white/40">Loading</span>
                    <span className="font-bold text-brand-lime" aria-live="polite">{pct}%</span>
                </div>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: pct / 100 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        style={{ originX: 0 }}
                        className="h-full w-full rounded-full bg-brand-purple"
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.span
                    key={caption}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="eyebrow mt-4 text-[10px] text-brand-lime"
                >
                    {captions[caption]}
                </motion.span>
            </AnimatePresence>
        </motion.div>
    );
};

export default AppLoader;
