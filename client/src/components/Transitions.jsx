import { ViewTransition, startTransition, addTransitionType } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Native view-transition helpers (React canary <ViewTransition>).
 *
 * - `DirectionalTransition` — wraps each page; type-keyed slides for
 *   hierarchical navigation (list → detail = forward, back = reverse).
 *   default="none" so nothing animates unless explicitly tagged.
 * - `push` — navigate with a direction tag inside startTransition.
 * - `TransitionLink` — a react-router <Link> that navigates through `push`,
 *   so every link participates in the directional page transition.
 */

export function DirectionalTransition({ children }) {
    return (
        <ViewTransition
            enter={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' }}
            exit={{ 'nav-forward': 'nav-forward', 'nav-back': 'nav-back', default: 'none' }}
            default="none"
        >
            {children}
        </ViewTransition>
    );
}

export function push(navigate, to, type = 'nav-forward') {
    startTransition(() => {
        addTransitionType(type);
        navigate(to);
    });
}

export function TransitionLink({ to, direction = 'nav-forward', onClick, children, ...props }) {
    const navigate = useNavigate();
    return (
        <Link
            to={to}
            {...props}
            onClick={(e) => {
                if (onClick) onClick(e);
                if (e.defaultPrevented) return;
                e.preventDefault();
                push(navigate, to, direction);
            }}
        >
            {children}
        </Link>
    );
}

export default DirectionalTransition;
