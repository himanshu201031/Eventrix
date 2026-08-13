import React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@/lib/utils';

function Label({ className, ref, ...props }) {
    return (
        <LabelPrimitive.Root
            ref={ref}
            className={cn('text-sm font-bold text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70', className)}
            {...props}
        />
    );
}
Label.displayName = 'Label';

export default Label;
