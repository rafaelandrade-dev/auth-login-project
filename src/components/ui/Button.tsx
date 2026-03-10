import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'ghost';
    loading?: boolean;
}

export function Button({
    className,
    variant = 'primary',
    loading = false,
    disabled,
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(
                'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
                {
                    'bg-indigo-600 text-white hover:bg-indigo-700': variant === 'primary',
                    'bg-transparent hover:bg-gray-100 text-gray-900': variant === 'ghost',
                },
                'h-10 py-2 px-4',
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
}
