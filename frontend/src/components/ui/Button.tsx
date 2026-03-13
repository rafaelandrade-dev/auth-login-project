import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'ghost' | 'danger' | 'outline';
    loading?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export function Button({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(
                'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:pointer-events-none select-none',
                {
                    // Primary: gradient + glow
                    'bg-gradient-to-r from-primary-600 to-violet-600 text-white shadow-glow-sm hover:shadow-glow-primary hover:from-primary-500 hover:to-violet-500 active:scale-[0.98]': variant === 'primary',
                    // Ghost: transparent, subtle hover
                    'bg-transparent text-text-muted border border-border-subtle hover:bg-surface-hover hover:text-text-primary active:scale-[0.98]': variant === 'ghost',
                    // Danger: red filled
                    'bg-danger text-white hover:bg-red-600 active:bg-red-700 active:scale-[0.98] shadow-sm': variant === 'danger',
                    // Outline: primary border, fills on hover
                    'bg-transparent text-primary-400 border border-primary-600/60 hover:bg-primary-600/10 hover:text-primary-300 hover:border-primary-500 active:scale-[0.98]': variant === 'outline',
                },
                {
                    'h-8 px-3 text-xs gap-1.5': size === 'sm',
                    'h-10 px-4 text-sm gap-2': size === 'md',
                    'h-12 px-6 text-base gap-2.5': size === 'lg',
                },
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <Loader2 className={cn('animate-spin flex-shrink-0', size === 'sm' ? 'h-3 w-3' : 'h-4 w-4')} />}
            {children}
        </button>
    );
}
