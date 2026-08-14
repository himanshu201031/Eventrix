import { Link, useNavigate } from 'react-router-dom';

/**
 * Navigation helpers for route transitions.
 *
 * The original native View Transition API experiment (React canary
 * <ViewTransition>) never fired with react-router v7 navigation, so page
 * transitions now run through framer-motion <AnimatePresence> in App.jsx.
 * These helpers keep a single navigation vocabulary app-wide:
 *
 * - `DirectionalTransition` — inert wrapper retained so the pages that wrap
 *   themselves in it need no changes; App.jsx owns the actual animation.
 * - `push` — plain programmatic navigation.
 * - `TransitionLink` — a react-router <Link> that navigates through `push`.
 */

export function DirectionalTransition({ children }) {
    return children;
}

export function push(navigate, to) {
    navigate(to);
}

export function TransitionLink({ to, onClick, children, ...props }) {
    const navigate = useNavigate();
    /* Legacy VT vocabulary: some pages pass `direction="nav-back"`. Strip it so
       it never leaks onto the <Link> and the DOM. */
    delete props.direction;
    return (
        <Link
            to={to}
            {...props}
            onClick={(e) => {
                if (onClick) onClick(e);
                if (e.defaultPrevented) return;
                e.preventDefault();
                push(navigate, to);
            }}
        >
            {children}
        </Link>
    );
}

export default DirectionalTransition;
