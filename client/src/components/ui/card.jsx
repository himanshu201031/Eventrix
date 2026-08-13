import React from 'react';
import { cn } from '@/lib/utils';

/** Eventrix Card — glass surface with hover lift. */
function Card({ className, ref, ...props }) {
    return (
        <div
            ref={ref}
            className={cn('glass-card rounded-[1.75rem] border border-border bg-card text-card-foreground', className)}
            {...props}
        />
    );
}
Card.displayName = 'Card';

function CardHeader({ className, ref, ...props }) {
    return <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />;
}
CardHeader.displayName = 'CardHeader';

function CardTitle({ className, ref, ...props }) {
    return (
        <h3
            ref={ref}
            className={cn('font-display text-lg uppercase leading-tight tracking-wide text-card-foreground', className)}
            {...props}
        />
    );
}
CardTitle.displayName = 'CardTitle';

function CardDescription({ className, ref, ...props }) {
    return <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />;
}
CardDescription.displayName = 'CardDescription';

function CardContent({ className, ref, ...props }) {
    return <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />;
}
CardContent.displayName = 'CardContent';

function CardFooter({ className, ref, ...props }) {
    return <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />;
}
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
