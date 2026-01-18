import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SectionProps {
    children: ReactNode;
    className?: string;
    id?: string;
    noPadding?: boolean;
}

export function Section({ children, className, id, noPadding = false }: SectionProps) {
    return (
        <section
            id={id}
            className={cn(
                'relative',
                !noPadding && 'py-16 md:py-24',
                className
            )}
        >
            {children}
        </section>
    );
}
