import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import { initSmoothScroll, destroySmoothScroll, scrollToTop } from './utils/smoothScroll';
import { Compass } from 'lucide-react';

/* Scroll to top on every route change (uses Lenis when available) */
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        scrollToTop(true);
    }, [pathname]);
    return null;
};

/* Animated route transitions */
const AnimatedRoutes = () => {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
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
            </motion.div>
        </AnimatePresence>
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
            <div className="flex min-h-screen flex-col bg-brand-light text-brand-dark selection:bg-brand-purple selection:text-white dark:bg-dark-page dark:text-dark-ink">
                <Navbar />
                <main className="flex-grow pb-16 md:pb-0">
                    <AnimatedRoutes />
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
