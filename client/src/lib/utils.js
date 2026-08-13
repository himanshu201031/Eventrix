import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes intelligently — later classes win, no conflicts.
 * Standard shadcn/ui utility, used by every component in components/ui.
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
