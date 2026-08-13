import React, { lazy, Suspense, useEffect } from 'react';
import { ViewTransition } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigationType } from 'react-router-dom';
import { motion, MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { initSmoothScroll, destroySmoothScroll, scrollToTop } from './utils/smoothScroll';
import { Compass } from 'lucide-react';

/* Route-level code splitting: each page is its own chunk, so /login, /events,
   /dashboard etc. never download each other's code (GSAP stays with Home, the
   dashboards carry their modals, and so on). */
const Home = lazy(() => import('./pages/Home'));
const Events = lazy(() => import('./pages/Events'));
const EventDetail = lazy(() => import('./pages/EventDetail'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const PaymentFailed = lazy(() => import('./pages/PaymentFailed'));

/* Quiet fallback while a route chunk loads — pages render their own skeletons,
   so this just holds the layout steady during the fetch. */
const RouteFallback = () => (
    <div className="flex min-h-[70vh] items-center justify-center" role="status" aria-label="Loading page">
        <span className="font-display animate-pulse text-lg uppercase tracking-widest text-brand-gray-400 dark:text-dark-muted">
            eventrix
        </span>
    </div>
);

/* Scroll to top on forward navigation, but NOT on browser back (POP) —
   restoring a previous page must preserve its scroll position. */
const ScrollToTop = () => {
    const { pathname } = useLocation();
    const navType = useNavigationType();
    useEffect(() => {
        if (navType !== 'POP') scrollToTop(true);
    }, [pathname, navType]);
    return null;
};

/* Routes with native view transitions. Page-level directional slides come
   from each page's own <DirectionalTransition>; this boundary handles the
   Suspense reveal (fallback → content, vertical slide) for lazy chunks. */
const AnimatedRoutes = () => {
    const location = useLocation();
    return (
        <Suspense
            fallback={
                <ViewTransition exit="slide-down" default="none">
                    <RouteFallback />
                </ViewTransition>
            }
        >
            <ViewTransition enter="slide-up" default="none">
                <Routes location={location}>
                    <Route path="/" element={<Home />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/events/:id" element={<EventDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<UserDashboard />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/payment-success" element={<PaymentSuccess />} />
                    <Route path="/payment-failed" element={<PaymentFailed />} />
                    <Route
                        path="*"
                        element={
                            <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 pt-24 pb-16 text-center">
                                <div className="relative">
                                    <span className="font-display text-[8rem] uppercase leading-none text-brand-purple sm:text-[10rem]">
                                        404
                                    </span>
                                    <motion.div
                                        animate={{ y: [0, -14, 0], rotate: [0, 8, 0] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                                        className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-brand-dark text-white shadow-2xl"
                                    >
                                        <Compass className="h-6 w-6 text-brand-lime" />
                                    </motion.div>
                                </div>
                                <h1 className="font-display mt-4 text-3xl uppercase">Page not found</h1>
                                <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-dark-muted">
                                    Looks like you wandered off the festival grounds. Let's get you back to the stage.
                                </p>
                                <Link to="/" className="btn-gradient mt-7 rounded-full px-8 py-3.5 text-xs font-extrabold uppercase tracking-wider text-white">
                                    Back to home
                                </Link>
                            </div>
                        }
                    />
                </Routes>
            </ViewTransition>
        </Suspense>
    );
};

function App() {
    useEffect(() => {
        initSmoothScroll();
        return () => destroySmoothScroll();
    }, []);

    return (
        <Router>
            <ScrollToTop />
            {/* reducedMotion="user" makes framer-motion micro-interactions honour
                the OS prefers-reduced-motion setting; native view transitions have
                their own reduced-motion CSS in index.css. */}
            <MotionConfig reducedMotion="user">
                <a href="#main-content" className="skip-link">
                    Skip to content
                </a>
                <div className="flex min-h-screen flex-col bg-brand-light text-brand-dark selection:bg-brand-purple selection:text-white dark:bg-dark-page dark:text-dark-ink">
                    <Navbar />
                    <main id="main-content" className="flex-grow pb-16 md:pb-0">
                        <AnimatedRoutes />
                    </main>
                    <Footer />
                </div>
            </MotionConfig>
        </Router>
    );
}

export default App;
