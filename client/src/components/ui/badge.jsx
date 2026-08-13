import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/** Eventrix Badge — uppercase tracking chip. Default wears the sunset gradient. */
const badgeVariants = cva(
    'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    {
        variants: {
            variant: {
                default: 'bg-sunset text-white',
                secondary: 'bg-secondary text-secondary-foreground',
                outline: 'border border-border text-foreground',
                lime: 'bg-brand-lime text-brand-dark',
                purple: 'bg-brand-purple text-white',
                pink: 'bg-brand-pink text-white',
                destructive: 'bg-destructive text-destructive-foreground',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

function Badge({ className, variant, ref, ...props }) {
    return <span ref={ref} className={cn(badgeVariants({ variant, className }))} {...props} />;
}
Badge.displayName = 'Badge';

export default Badge;
export { badgeVariants };
