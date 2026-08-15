import '@testing-library/jest-dom/vitest';

/* ---- jsdom polyfills for Radix Dialog + framer-motion ---- */

// Radix dismissable-layer / focus-scope and framer-motion rely on these
// browser APIs that jsdom does not implement.
if (!window.ResizeObserver) {
    window.ResizeObserver = class {
        observe() { }
        unobserve() { }
        disconnect() { }
    };
}

if (!window.matchMedia) {
    window.matchMedia = (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => { },
        removeListener: () => { },
        addEventListener: () => { },
        removeEventListener: () => { },
        dispatchEvent: () => false,
    });
}

if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16);
    window.cancelAnimationFrame = (id) => clearTimeout(id);
}

if (!window.PointerEvent) {
    window.PointerEvent = window.MouseEvent;
}

if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => { };
}

if (!window.scrollTo) {
    window.scrollTo = () => { };
}
