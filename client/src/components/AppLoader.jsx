import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkle } from 'lucide-react';

/* Rotating mono captions — the loader reads as a real moment, not a spinner */
const captions = ['booking the lineup', 'warming up the stage', 'checking the sound', 'passes loading'];

/* Full-screen branded loader shown while the app boots. The parent mounts it
   inside <AnimatePresence> so the exit fade plays before it unmounts. */
const AppLoader = () => {
    const [caption, setCaption] = useState(0);

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

            {/* Indeterminate progress track */}
            <div className="mt-8 h-1 w-44 overflow-hidden rounded-full bg-white/10">
                <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: '0%' }}
                    transition={{ duration: 0.9, ease: 'easeInOut', repeat: Infinity }}
                    className="h-full w-full rounded-full bg-brand-purple"
                />
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
