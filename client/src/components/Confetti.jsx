import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

/* Eventrix brand-tinted confetti palette */
const COLORS = ['#ba28e2', '#a6ff00', '#ff2d7a', '#00e5ff', '#ff5a1f', '#f8deb1'];

/**
 * Fire the confetti side cannons — two streams from the bottom corners,
 * looping for `duration` ms (mirrors the classic "side cannons" demo).
 */
const fireSideCannons = (durationMs = 3000) => {
    const end = Date.now() + durationMs;
    const frame = () => {
        if (Date.now() > end) return;
        confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            startVelocity: 60,
            origin: { x: 0, y: 0.7 },
            colors: COLORS,
            disableForReducedMotion: true,
        });
        confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            startVelocity: 60,
            origin: { x: 1, y: 0.7 },
            colors: COLORS,
            disableForReducedMotion: true,
        });
        requestAnimationFrame(frame);
    };
    frame();
};

/** A single celebratory burst from the center of the screen. */
const fireBurst = () => {
    confetti({
        particleCount: 140,
        spread: 100,
        startVelocity: 42,
        origin: { y: 0.6 },
        colors: COLORS,
        disableForReducedMotion: true,
        scalar: 1.1,
    });
};

/**
 * ConfettiSideCannons — mount anywhere; fires on mount (after a tiny delay
 * so the success state has painted) and on every `key` change. Perfect for
 * the booking success step: render with key={bookingId} to replay per booking.
 */
const ConfettiSideCannons = ({ durationMs = 3000, burst = true, delayMs = 250 }) => {
    const firedRef = useRef(false);

    useEffect(() => {
        firedRef.current = false;
        const t = setTimeout(() => {
            if (firedRef.current) return;
            firedRef.current = true;
            if (burst) fireBurst();
            fireSideCannons(durationMs);
        }, delayMs);
        return () => clearTimeout(t);
    }, [durationMs, burst, delayMs]);

    return null;
};

export { ConfettiSideCannons, fireSideCannons, fireBurst };
export default ConfettiSideCannons;
