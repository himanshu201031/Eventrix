import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

function DialogOverlay({ className, ref, ...props }) {
    return (
        <DialogPrimitive.Overlay
            ref={ref}
            className={cn(
                'fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out',
                className
            )}
            {...props}
        />
    );
}
DialogOverlay.displayName = 'DialogOverlay';

function DialogContent({ className, children, hideCloseButton = false, ref, ...props }) {
    return (
        <DialogPortal>
            <DialogOverlay />
            <DialogPrimitive.Content
                ref={ref}
                className={cn(
                    'glass-strong fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-[2rem] p-6 shadow-2xl data-[state=open]:animate-dialog-in data-[state=closed]:animate-dialog-out',
                    className
                )}
                {...props}
            >
                {children}
                {!hideCloseButton && (
                    <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground opacity-70 transition-all hover:bg-accent hover:text-foreground hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <X className="size-4" />
                        <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>
                )}
            </DialogPrimitive.Content>
        </DialogPortal>
    );
}
DialogContent.displayName = 'DialogContent';

function DialogHeader({ className, ...props }) {
    return <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />;
}
DialogHeader.displayName = 'DialogHeader';

function DialogFooter({ className, ...props }) {
    return <div className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)} {...props} />;
}
DialogFooter.displayName = 'DialogFooter';

function DialogTitle({ className, ref, ...props }) {
    return (
        <DialogPrimitive.Title
            ref={ref}
            className={cn('font-display text-xl uppercase leading-none tracking-wide text-foreground', className)}
            {...props}
        />
    );
}
DialogTitle.displayName = 'DialogTitle';

function DialogDescription({ className, ref, ...props }) {
    return (
        <DialogPrimitive.Description
            ref={ref}
            className={cn('text-sm text-muted-foreground', className)}
            {...props}
        />
    );
}
DialogDescription.displayName = 'DialogDescription';

export {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogTrigger,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
};
