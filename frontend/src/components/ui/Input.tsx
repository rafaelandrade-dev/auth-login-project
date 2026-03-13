import React, { forwardRef, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    icon?: ReactNode;
    suffix?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, id, icon, suffix, ...props }, ref) => {
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
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary-400">
                            {icon}
                        </div>
                    )}
                    <input
                        id={inputId}
                        ref={ref}
                        className={cn(
                            'flex h-10 w-full rounded-lg border px-3 py-2 text-sm font-sans font-medium',
                            '!bg-[#252842] !text-white border-[#2E3155]',
                            'placeholder:text-[#9B9EB3]/60',
                            'transition-[border-color,box-shadow] duration-150',
                            'focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/25',
                            'disabled:cursor-not-allowed disabled:opacity-40',
                            icon && 'pl-9',
                            suffix && 'pr-10',
                            error && 'border-[#EF4444]/70 focus:border-[#EF4444] focus:ring-[#EF4444]/25',
                            className
                        )}
                        {...props}
                    />
                    {suffix && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                            {suffix}
                        </div>
                    )}
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
