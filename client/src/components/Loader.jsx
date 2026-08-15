import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ShaderBackground } from './ui/green-border';

/**
 * Eventrix splash loader — shown once on first boot. The WebGL pulsing border
 * sits behind the wordmark and fades out via AnimatePresence when the app is
 * ready. Under prefers-reduced-motion the shader freezes to a static frame and
 * the progress sweep is skipped entirely.
 */
const Loader = () => {
    const shouldReduce = useReducedMotion();

    return (
        <motion.div
            role="status"
            aria-label="Eventrix is loading"
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduce ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center overflow-hidden bg-brand-dark"
        >
            <ShaderBackground className="absolute inset-0 h-full w-full" />

            <div className="relative z-10 flex flex-col items-center gap-5 px-6 text-center">
                <h1 className="font-display text-6xl uppercase leading-none tracking-tight text-white sm:text-7xl">
                    eventrix
                </h1>
                <p className="text-[11px] font-extralight uppercase tracking-[0.3em] text-white/60">
                    Book ✶ Discover ✶ Experience
                </p>
                {!shouldReduce && (
                    <div className="mt-2 h-px w-40 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                            className="h-full w-full bg-brand-lime"
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Loader;
