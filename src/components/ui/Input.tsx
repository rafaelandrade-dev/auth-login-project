import React, { forwardRef, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, id, icon, ...props }, ref) => {
        const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="flex flex-col space-y-1.5">
                <label
                    htmlFor={inputId}
                    className="text-xs font-semibold uppercase tracking-wider text-text-muted"
                >
                    {label}
                </label>
                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                            {icon}
                        </div>
                    )}
                    <input
                        id={inputId}
                        ref={ref}
                        className={cn(
                            'flex h-10 w-full rounded-lg border bg-surface px-3 py-2 text-sm text-text-primary',
                            'placeholder:text-text-muted/60',
                            'border-border-subtle',
                            'transition-all duration-150',
                            'focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/25',
                            'disabled:cursor-not-allowed disabled:opacity-40',
                            icon && 'pl-9',
                            error && 'border-danger/70 focus:border-danger focus:ring-danger/25',
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && (
                    <span className="flex items-center gap-1 text-xs text-danger/90">
                        {error}
                    </span>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
